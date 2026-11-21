import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { pingdom } from './index';
import { credits, probesList } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only GET requests replay a
 * 5xx, writes never do (checks, teams and contacts would double-apply).
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'pingdom', 'default');
	const corsair = createCorsair({
		plugins: [pingdom({ key: 'pd-test-token' })],
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
			respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
			respond(credits);

			await expect(
				corsair.pingdom.api.tools.getCredits({}),
			).resolves.toMatchObject({ credits: credits.credits });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: { errormessage: 'Down' } }, 503);
			respond(probesList);

			await expect(
				corsair.pingdom.api.tools.listProbes({}),
			).resolves.toMatchObject({ probes: probesList.probes });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a failed POST, which already ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: { errormessage: 'Down after write' } }, 503);

			await expect(
				corsair.pingdom.api.alerting.teams.create({
					name: 'API Team',
					memberIds: [1],
				}),
			).rejects.toThrow('Pingdom 503');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('raises the provider error message through the runtime', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					error: {
						statuscode: 401,
						statusdesc: 'Unauthorized',
						errormessage: 'Please provide a valid API token',
					},
				},
				401,
			);

			await expect(corsair.pingdom.api.checks.list({})).rejects.toThrow(
				'Pingdom 401: Please provide a valid API token',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
