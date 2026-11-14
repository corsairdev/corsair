import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { kit } from './index';
import {
	account,
	invalidKey,
	notFound,
	payloadTooLarge,
	subscriberCreated,
	subscribers,
	tagResponse,
} from './test-fixtures';

const API_KEY = 'kit-test-key';

async function createClient(options: Parameters<typeof kit>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'kit', 'default');
	const corsair = createCorsair({
		plugins: [kit(options)],
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
			respond({ errors: ['Rate limited'] }, 429);
			respond(subscribers);

			const result = await withFakeTimers(corsair.kit.api.subscribers.list({}));

			expect(result.subscribers).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ errors: ['Rate limited'] }, 429);
			respond({ errors: ['Rate limited'] }, 429);
			respond({ errors: ['Rate limited'] }, 429);
			respond({ errors: ['Rate limited'] }, 429);

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.kit.api.subscribers
					.list({})
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429, name: 'ApiError' });
			// One attempt plus three retries.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a refused key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond(invalidKey, 401);

			await expect(corsair.kit.api.account.get({})).rejects.toMatchObject({
				status: 401,
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a subscriber that is not there', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(notFound, 404);

			await expect(
				corsair.kit.api.subscribers.get({ subscriberId: 999 }),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a payload Kit refuses for its size', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(payloadTooLarge, 413);

			await expect(
				corsair.kit.api.subscribers.create({
					email_address: 'a@b.example',
				}),
			).rejects.toMatchObject({ status: 413 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx subscriber create', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ errors: ['Server error'] }, 500);

			await expect(
				corsair.kit.api.subscribers.create({ email_address: 'a@b.example' }),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx form subscribe', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ errors: ['Server error'] }, 503);

			await expect(
				corsair.kit.api.forms.subscribe({
					form_id: 12,
					email_address: 'a@b.example',
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
			respond({ errors: ['Server error'] }, 500);
			respond(account);

			const result = await withFakeTimers(corsair.kit.api.account.get({}));

			expect(result.account.id).toBe(900);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honors the Retry-After header Kit sends', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ errors: ['Rate limited'] }), {
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '2' },
				}),
			);
			respond(tagResponse);

			const pending = corsair.kit.api.tags.create({ name: 'customer' });
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

	it('replays a dropped connection on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(subscribers);

			const result = await withFakeTimers(corsair.kit.api.subscribers.list({}));

			expect(result.subscribers).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a dropped connection on a write', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			await expect(
				corsair.kit.api.subscribers.create({ email_address: 'a@b.example' }),
			).rejects.toMatchObject({ transport: true, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps the subscriber ID from a create', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(subscriberCreated, 201);

			const result = await corsair.kit.api.subscribers.create({
				email_address: 'jordan@acme.example',
			});

			expect(result.subscriber.id).toBe(1001);
			expect(result.warnings).toEqual(['unknown_field']);
		} finally {
			testDb.cleanup();
		}
	});
});
