import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { docraptor } from './index';
import { asyncCreated, completedStatus, throttleError } from './test-fixtures';

/**
 * Core's request() makes one attempt (rateLimitConfig.maxRetries is 0);
 * `error-handlers.ts` decides the rest.
 *
 * DocRaptor publishes no 429 and no idempotency keys. Reads (status, list,
 * ips) replay; a retried create can double-bill a non-test document, so a
 * 5xx on a write is final.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'docraptor', 'default');
	const corsair = createCorsair({
		plugins: [docraptor({ key: 'dr-retry-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text; each test passes its own.
function respond(body: unknown, status = 200, headers = {}) {
	const text = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(text, {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries the 403 concurrency throttle once on a status poll', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(throttleError, 403, { 'Content-Type': 'application/xml' });
			respond(completedStatus);

			const result = await corsair.docraptor.api.documents.status({
				statusId: asyncCreated.status_id,
			});

			expect(result.status).toBe('completed');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up when a status poll keeps answering 503', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ status: 'working' }, 503);
			}

			await expect(
				corsair.docraptor.api.documents.status({ statusId: 'abc' }),
			).rejects.toMatchObject({ status: 503 });
			// One original attempt and two retries.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('never replays a 5xx create, which can double-bill a document', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ status: 'internal error' }, 500);

			await expect(
				corsair.docraptor.api.documents.createAsync({
					type: 'pdf',
					document_content: '<html><body>x</body></html>',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 403 that only means no permission', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond('Please provide a valid API key.', 403, {
				'Content-Type': 'application/xml',
			});

			await expect(
				corsair.docraptor.api.documents.status({ statusId: 'abc' }),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out the exponential strategy with a fake clock when no Retry-After exists', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond(throttleError, 403, { 'Content-Type': 'application/xml' });
			respond(completedStatus);

			const pending = corsair.docraptor.api.documents.status({
				statusId: 'abc',
			});
			// The throttle handler falls back to exponential_backoff: 1s first.
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({ status: 'completed' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
