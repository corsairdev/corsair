import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { pilvio } from './index';
import { locationsList } from './test-fixtures';

/**
 * A 429 gets the transport's standard retries (Retry-After honoured, up to
 * three). error-handlers.ts decides the rest: only GET requests replay a
 * 5xx, writes never do (these create and destroy infrastructure).
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'pilvio', 'default');
	const corsair = createCorsair({
		plugins: [pilvio({ key: 'pv-test-key' })],
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
			respond(locationsList);

			await expect(
				corsair.pilvio.api.config.listLocations({}),
			).resolves.toMatchObject([{ slug: 'cyc01' }]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Down' }, 503);
			respond(locationsList);

			await expect(
				corsair.pilvio.api.config.listLocations({}),
			).resolves.toMatchObject([{ slug: 'cyc01' }]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a failed POST, which already ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Down after write' }, 503);

			await expect(
				corsair.pilvio.api.vm.start({ uuid: 'u-1' }),
			).rejects.toThrow('Pilvio 503');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('raises the provider error message through the runtime', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Invalid authentication credentials' }, 403);

			await expect(corsair.pilvio.api.config.listLocations({})).rejects.toThrow(
				'Pilvio 403: Invalid authentication credentials',
			);
		} finally {
			testDb.cleanup();
		}
	});
});
