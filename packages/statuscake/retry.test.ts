import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { statuscake } from './index';
import { uptimeList } from './test-fixtures';

/**
 * The ratelimiting guide says to wait x-ratelimit-reset seconds and retry a
 * 429; core reads that header (wired as the plugin's rate-limit header) onto
 * the error and `error-handlers.ts` decides the rest. Only reads are
 * replayed on 5xx: the errors guide warns a retried create can make a
 * second resource.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'statuscake', 'default');
	const corsair = createCorsair({
		plugins: [statuscake({ key: 'sc-test-token' })],
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
	it('retries a 429 and lists uptime on the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too Many Requests' }, 429, {
				'x-ratelimit-reset': '1',
			});
			respond(uptimeList);

			const result = await corsair.statuscake.api.uptime.list({});
			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ message: 'Too Many Requests' }, 429);
			}

			await expect(
				corsair.statuscake.api.uptime.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 503);
			respond(uptimeList);

			const result = await corsair.statuscake.api.uptime.list({});
			expect(result.data).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a POST on a 502: a create may have gone through', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Something went wrong' }, 502);

			await expect(
				corsair.statuscake.api.contactGroups.create({ name: 'No retry' }),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad token', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond('', 403);

			await expect(
				corsair.statuscake.api.uptime.list({}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400 validation failure, which needs a changed request', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					message: 'The request could not be processed',
					errors: { check_rate: ['must be one of 0, 30, 60'] },
				},
				400,
			);

			await expect(
				corsair.statuscake.api.uptime.list({}),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out x-ratelimit-reset with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too Many Requests' }, 429, {
				'x-ratelimit-reset': '2',
			});
			respond(uptimeList);

			const pending = corsair.statuscake.api.uptime.list({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toMatchObject({
				data: uptimeList.data,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the strategy delay when there is no reset header', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ message: 'Too Many Requests' }, 429);
			respond(uptimeList);

			const pending = corsair.statuscake.api.uptime.list({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toMatchObject({
				data: uptimeList.data,
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
