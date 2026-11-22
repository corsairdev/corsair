import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { parsio } from './index';
import { parsedDocument, parsingDocument } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because parses and uploads bill credits with no documented idempotency
 * contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'parsio', 'default');
	const corsair = createCorsair({
		plugins: [parsio({ key: 'prsio-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		}),
	);
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it("retries a 429 through the transport's rate-limit handling", async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 429, message: 'Slow down' }, 429, {
				'Retry-After': '0',
			});
			respond(parsedDocument);

			await expect(
				corsair.parsio.api.documents.get({ documentId: 'DOC_ID' }),
			).resolves.toMatchObject({ doc_id: 'DOC_ID' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 500, message: 'Something went wrong' }, 503);
			respond(parsedDocument);

			await expect(
				corsair.parsio.api.documents.get({ documentId: 'DOC_ID' }),
			).resolves.toMatchObject({ doc_id: 'DOC_ID' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the parse write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 502, message: 'Something went wrong' }, 502);

			await expect(
				corsair.parsio.api.documents.createAsync({
					mailboxId: 'mbx_1',
					text: 'Invoice total 42.00',
				}),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 401, message: 'Unauthorized' }, 401);

			await expect(
				corsair.parsio.api.documents.get({ documentId: 'DOC_ID' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('backs off the exponential strategy between 503 replays with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ statusCode: 500, message: 'Something went wrong' }, 503);
			respond(parsingDocument);

			const pending = corsair.parsio.api.documents.get({
				documentId: 'DOC_ID',
			});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				parsing_in_progress: true,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
