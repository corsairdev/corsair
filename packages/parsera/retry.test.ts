import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { parsera } from './index';
import { agentTaskPending } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only reads are replayed on 5xx,
 * because extraction runs charge credits with no documented idempotency
 * contract.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'parsera', 'default');
	const corsair = createCorsair({
		plugins: [parsera({ key: 'prs-test-key' })],
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
			respond({ detail: 'Slow down' }, 429, { 'Retry-After': '0' });
			respond(agentTaskPending, 202);

			await expect(
				corsair.parsera.api.agent.extract({
					url: 'https://example.com',
					prompt: 'Extract the titles',
				}),
			).resolves.toMatchObject({ task_id: 'agent-extract-abc123' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Something went wrong' }, 503);
			respond(agentTaskPending);

			await expect(
				corsair.parsera.api.agent.getTask({ taskId: 'agent-extract-abc123' }),
			).resolves.toMatchObject({ task_id: 'agent-extract-abc123' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the extract write on a 502', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ detail: 'Something went wrong' }, 502);

			await expect(
				corsair.parsera.api.extractor.extract({
					url: 'https://example.com',
					prompt: 'Extract the titles',
					attributes: [{ name: 'title', description: 'The title' }],
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
			respond({ detail: 'Invalid API key' }, 401);

			await expect(
				corsair.parsera.api.agent.getTask({ taskId: 'x' }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
