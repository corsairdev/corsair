import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { pipelinecrm } from './index';
import { stageTotal, usersList } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three; Pipeline CRM limits tokens to 10 req/s). error-handlers.ts decides
 * the rest: only GET requests replay a 5xx, writes never do.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'pipelinecrm', 'default');
	const corsair = createCorsair({
		plugins: [pipelinecrm({ key: 'pcrm_live_testtoken' })],
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
		new Response(JSON.stringify(body), {
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
			respond({ error: 'Rate limit exceeded' }, 429, { 'Retry-After': '0' });
			respond([stageTotal]);

			await expect(
				corsair.pipelinecrm.api.deals.totalsByStage({}),
			).resolves.toMatchObject([{ deal_stage_id: 3 }]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Down' }, 503);
			respond(usersList);

			await expect(
				corsair.pipelinecrm.api.users.list({}),
			).resolves.toMatchObject({ entries: usersList.entries });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a failed POST, which already ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Down after write' }, 503);

			await expect(
				corsair.pipelinecrm.api.deals.create({ name: 'x' }),
			).rejects.toThrow('Pipeline CRM 503');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('raises the provider error message through the runtime', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'Invalid or expired API token' }, 401);

			await expect(corsair.pipelinecrm.api.deals.list({})).rejects.toThrow(
				'Pipeline CRM 401: Invalid or expired API token',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
