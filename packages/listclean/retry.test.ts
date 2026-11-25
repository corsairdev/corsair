import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { listclean } from './index';

const API_KEY = 'lc-test-key';

async function createClient(options: Parameters<typeof listclean>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'listclean', 'default');
	const corsair = createCorsair({
		plugins: [listclean(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

/**
 * A client whose key lives on the account, not in the plugin options: this is
 * the path a Hub tenant takes, so it must resolve end to end.
 */
async function createStoredKeyClient() {
	const client = await createClient({});
	await client.corsair.listclean.keys.issue_new_dek();
	await client.corsair.listclean.keys.set_api_key('stored-key');
	return client;
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

// unknown: each test queues its own success payload.
function envelopeOk(data: unknown) {
	return { success: 1, error_code: 0, message: 'OK', data };
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
	it('resolves a key stored on the account when the plugin has no inline key', async () => {
		const { corsair, testDb } = await createStoredKeyClient();
		try {
			respond(envelopeOk({ credits: 30 }));

			const result = await corsair.listclean.api.account.getCredits({});

			expect(result.credits).toBe(30);
			const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
			// The stored key rode the X-Auth-Token header, proving
			// ctx.keys.get_api_key() resolved it end to end.
			expect(headers.get('X-Auth-Token')).toBe('stored-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: 0, message: 'Slow' }, 429);
			respond(envelopeOk({ credits: 24 }));

			const result = await withFakeTimers(
				corsair.listclean.api.account.getCredits({}),
			);

			expect(result.credits).toBe(24);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				respond({ success: 0, message: 'Slow' }, 429);
			}

			const error = await withFakeTimers(
				// unknown: a rejected request can carry any thrown value.
				corsair.listclean.api.account
					.getCredits({})
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429 });
			// One attempt plus three retries.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a batch submit after a 5xx, which may have started a billed job', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: 0, message: 'Service Unavailable' }, 503);
			respond(envelopeOk({ list_id: 159261 }));

			await expect(
				corsair.listclean.api.verify.startBatchVerification({
					emails: ['user@example.com'],
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: 0, message: 'Service Unavailable' }, 500);
			respond(envelopeOk({ credits: 20 }));

			const result = await withFakeTimers(
				corsair.listclean.api.account.getCredits({}),
			);

			expect(result.credits).toBe(20);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a billed verification after a dropped connection', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(envelopeOk({ status: 'clean' }));

			await expect(
				corsair.listclean.api.verify.verifyEmail({
					email: 'test@example.com',
				}),
			).rejects.toMatchObject({ transport: true, replayable: false });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a dropped connection on a free read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(envelopeOk({ credits: 18 }));

			const result = await withFakeTimers(
				corsair.listclean.api.account.getCredits({}),
			);

			expect(result.credits).toBe(18);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a delete on a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ success: 0, message: 'Service Unavailable' }, 502);
			respond(envelopeOk({}));

			await expect(
				corsair.listclean.api.lists.delete({ list_id: 159261 }),
			).rejects.toMatchObject({ status: 502 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors a Retry-After header instead of its own backoff', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ success: 0, message: 'Slow' }), {
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
				}),
			);
			respond(envelopeOk({ credits: 15 }));

			const pending = corsair.listclean.api.account.getCredits({});
			await Promise.resolve();
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(2_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1_500);
			const result = await pending;
			expect(result.credits).toBe(15);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
