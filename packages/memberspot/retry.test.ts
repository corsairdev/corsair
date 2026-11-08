import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { memberspot } from './index';
import { AUTH_CHECK_BODY, errorBody, USER } from './test-fixtures';

async function createClient(options: Parameters<typeof memberspot>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'memberspot', 'default');
	const corsair = createCorsair({
		plugins: [memberspot(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/**
 * Queues one JSON response. `body` is unknown because each fixture is a plain
 * object of arbitrary shape, validated by the output schema under test.
 */
function respondJson(
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
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

describe('retry behaviour', () => {
	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'memberspot-test-key',
		});
		try {
			respondJson(errorBody(429, 'Too Many Requests'), 429);
			respondJson(AUTH_CHECK_BODY);

			const pending = corsair.memberspot.api.auth.check({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(61_000);
			const result = await pending;

			expect(result.id).toBe('school-1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours a Retry-After header', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'memberspot-test-key',
		});
		try {
			respondJson(errorBody(429, 'Too Many Requests'), 429, {
				'Retry-After': '2',
			});
			respondJson(AUTH_CHECK_BODY);

			const pending = corsair.memberspot.api.auth.check({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(1_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'memberspot-test-key',
		});
		try {
			respondJson(errorBody(429, 'Too Many Requests'), 429);
			respondJson(errorBody(429, 'Too Many Requests'), 429);
			respondJson(errorBody(429, 'Too Many Requests'), 429);

			const pending = corsair.memberspot.api.auth
				.check({})
				// unknown: a rejection can be any value; the assertion names the shape.
				.catch((caught: unknown) => caught);
			for (let step = 0; step < 4; step++) {
				await Promise.resolve();
				await jest.advanceTimersByTimeAsync(61_000);
			}
			const error = await pending;

			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx, which is marked replay-safe', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'memberspot-test-key',
		});
		try {
			respondJson(errorBody(500, 'Internal server error'), 500);
			respondJson(USER);

			const pending = corsair.memberspot.api.users.findByUid({ uid: 'uid-1' });
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(5_000);
			const result = await pending;

			expect(result.uid).toBe('uid-1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an invalid key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respondJson(errorBody(401, 'Unauthorized'), 401);

			await expect(corsair.memberspot.api.auth.check({})).rejects.toMatchObject(
				{ status: 401 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('pins the no-header delay at one minute', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'memberspot-test-key',
		});
		try {
			respondJson(errorBody(429, 'Too Many Requests'), 429);
			respondJson(AUTH_CHECK_BODY);

			const pending = corsair.memberspot.api.auth.check({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(59_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(2_000);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
