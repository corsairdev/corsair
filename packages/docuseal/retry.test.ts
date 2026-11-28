import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { docuseal } from './index';
import { templateList } from './test-fixtures';

/**
 * DocuSeal documents no rate-limit contract. Core's request() retries a 429
 * three times (it never ran, so every method), error-handlers.ts adds no
 * further 429 retries, a 5xx only replays a GET, and writes never replay.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'docuseal', 'default');
	const corsair = createCorsair({
		plugins: [docuseal({ key: 'docuseal-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
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
	it('retries a 429 and then succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Too many requests' }, 429, { 'Retry-After': '0' });
			respond(templateList);

			await expect(
				corsair.docuseal.api.templates.list({}),
			).resolves.toMatchObject({ data: templateList.data });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the last 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// One attempt plus core's three retries.
			for (let attempt = 0; attempt < 4; attempt += 1) {
				respond({ error: 'Too many requests' }, 429, { 'Retry-After': '0' });
			}

			await expect(corsair.docuseal.api.templates.list({})).rejects.toThrow(
				'DocuSeal 429',
			);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits one second before the first retry when no Retry-After header exists', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Too many requests' }, 429);
			respond(templateList);

			const pending = corsair.docuseal.api.templates.list({});

			await jest.advanceTimersByTimeAsync(500);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({
				data: templateList.data,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Down' }, 503);
			respond(templateList);

			await expect(
				corsair.docuseal.api.templates.list({}),
			).resolves.toMatchObject({ data: templateList.data });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a failed POST, which may have sent its emails', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Down after write' }, 503);

			await expect(
				corsair.docuseal.api.submissions.create({
					template_id: 12,
					submitters: [{ role: 'Tenant' }],
				}),
			).rejects.toThrow('DocuSeal 503');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('raises the provider error message through the runtime', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Not authenticated' }, 401);

			await expect(corsair.docuseal.api.templates.list({})).rejects.toThrow(
				'DocuSeal 401: Not authenticated',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
