import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { stannp } from './index';
import { balance } from './test-fixtures';

/**
 * Core's request() reads X-RateLimit-Reset (wired as the plugin's
 * rate-limit header) onto the error; `error-handlers.ts` decides the rest.
 * Only reads are replayed on 5xx: Stannp takes real money for mail, so a
 * create that answers 5xx must not be sent again by the client.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'stannp', 'default');
	const corsair = createCorsair({
		plugins: [stannp({ key: 'sp-test-key' })],
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
	it('retries a 429 and reads the balance on the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, error: 'Too many requests' }, 429, {
				'X-RateLimit-Reset': '1',
			});
			respond({ success: true, data: balance });

			await expect(corsair.stannp.api.account.balance({})).resolves.toEqual(
				balance,
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ success: false, error: 'Too many requests' }, 429);
			}

			await expect(
				corsair.stannp.api.account.balance({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('replays a failed GET on a 503, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, error: 'Something went wrong' }, 503);
			respond({ success: true, data: balance });

			await expect(corsair.stannp.api.account.balance({})).resolves.toEqual(
				balance,
			);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a POST on a 502: a create can have posted', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, error: 'Something went wrong' }, 502);

			await expect(
				corsair.stannp.api.groups.create({ name: 'No retry' }),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad credential', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, error: 'You do not have authorisation' }, 401);

			await expect(
				corsair.stannp.api.account.balance({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out X-RateLimit-Reset with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, error: 'Too many requests' }, 429, {
				'X-RateLimit-Reset': '2',
			});
			respond({ success: true, data: balance });

			const pending = corsair.stannp.api.account.balance({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			await expect(pending).resolves.toEqual(balance);
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
			respond({ success: false, error: 'Too many requests' }, 429);
			respond({ success: true, data: balance });

			const pending = corsair.stannp.api.account.balance({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			await expect(pending).resolves.toEqual(balance);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
