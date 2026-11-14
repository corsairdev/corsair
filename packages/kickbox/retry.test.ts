import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { kickbox } from './index';
import {
	deliverable,
	disposableHost,
	insufficientBalance,
	invalidKey,
} from './test-fixtures';

const API_KEY = 'kb-test-key';

async function createClient(options: Parameters<typeof kickbox>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'kickbox', 'default');
	const corsair = createCorsair({
		plugins: [kickbox(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so every call a test did not stub fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response with respond first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers can step
 * over the backoff instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(5_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(
				{ success: false, code: 'TOO_MANY_REQUESTS', message: 'Slow' },
				429,
			);
			respond(deliverable);

			const result = await withFakeTimers(
				corsair.kickbox.api.verify.verify({ email: 'test@example.com' }),
			);

			expect(result.result).toBe('deliverable');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: false, message: 'Slow' }, 429);
			respond({ success: false, message: 'Slow' }, 429);
			respond({ success: false, message: 'Slow' }, 429);

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.kickbox.api.verify
					.verify({ email: 'test@example.com' })
					// unknown: a rejected request can carry any thrown value.
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429 });
			// One attempt plus two retries.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a spent balance', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(insufficientBalance, 403);

			await expect(
				corsair.kickbox.api.verify.verify({ email: 'test@example.com' }),
			).rejects.toMatchObject({
				status: 403,
				body: { code: 'INSUFFICIENT_BALANCE' },
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond(invalidKey, 403);

			await expect(
				corsair.kickbox.api.verify.verify({ email: 'test@example.com' }),
			).rejects.toMatchObject({
				status: 403,
				body: { code: 'FORBIDDEN' },
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a paid check after a 5xx, which may have been charged', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: false, message: 'Service Unavailable' }, 503);
			respond(deliverable);

			await expect(
				corsair.kickbox.api.verify.verify({ email: 'test@example.com' }),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays the free disposable check after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: false, message: 'Service Unavailable' }, 503);
			respond({ disposable: false });

			const result = await withFakeTimers(
				corsair.kickbox.api.verify.disposable({ address: 'mailinator.com' }),
			);

			expect(result.disposable).toBe(false);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection on a paid verification', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(deliverable);

			await expect(
				corsair.kickbox.api.verify.verify({ email: 'test@example.com' }),
			).rejects.toMatchObject({ transport: true, paid: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a dropped connection on a check', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(disposableHost);

			const result = await withFakeTimers(
				corsair.kickbox.api.verify.disposable({ address: 'mailinator.com' }),
			);

			expect(result.disposable).toBe(true);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors a Retry-After header instead of its own backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ success: false, message: 'Slow' }), {
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
				}),
			);
			respond(deliverable);

			const pending = corsair.kickbox.api.verify.verify({
				email: 'test@example.com',
			});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(2_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
