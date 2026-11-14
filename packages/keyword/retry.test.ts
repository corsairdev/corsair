import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { keyword } from './index';
import {
	KEYWORD_CONTENT_TYPE,
	keywords,
	notFound,
	projects,
	quotaExceeded,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'kw-test-token';

async function createClient(options: Parameters<typeof keyword>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'keyword', 'default');
	const corsair = createCorsair({
		plugins: [keyword(options)],
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
			headers: { 'Content-Type': KEYWORD_CONTENT_TYPE },
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
			respond({ errors: [{ code: '429', message: 'Slow down' }] }, 429);
			respond(projects);

			const result = await withFakeTimers(
				corsair.keyword.api.projects.list({}),
			);

			expect(result.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ errors: [{ code: '429', message: 'Slow down' }] }, 429);
			respond({ errors: [{ code: '429', message: 'Slow down' }] }, 429);
			respond({ errors: [{ code: '429', message: 'Slow down' }] }, 429);

			const error = await withFakeTimers(
				// unknown: a rejection can be any value; the assertion below
				// narrows it to the fields it checks.
				corsair.keyword.api.projects
					.list({})
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429 });
			// One attempt plus two retries.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a plan that is full', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(quotaExceeded, 402);

			await expect(
				corsair.keyword.api.keywords.add({
					projectName: 'Disney',
					keywords: [{ kw: 'x', url: 'disney.com' }],
				}),
			).rejects.toMatchObject({ status: 402 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a keyword add after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ errors: [{ code: '500', message: 'Server error' }] }, 500);

			await expect(
				corsair.keyword.api.keywords.add({
					projectName: 'Disney',
					keywords: [{ kw: 'x', url: 'disney.com' }],
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a project delete after a 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond({ errors: [{ code: '503', message: 'Unavailable' }] }, 503);

			await expect(
				corsair.keyword.api.projects.delete({ projectName: 'Disney' }),
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
			respond({ errors: [{ code: '500', message: 'Server error' }] }, 500);
			respond(keywords);

			const result = await withFakeTimers(
				corsair.keyword.api.keywords.list({ projectName: 'Disney' }),
			);

			expect(result.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-token' });
		try {
			respond(unauthorized, 401);

			await expect(corsair.keyword.api.projects.list({})).rejects.toMatchObject(
				{ status: 401 },
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an unknown project', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			respond(notFound, 404);

			await expect(
				corsair.keyword.api.projects.get({ projectName: 'nope' }),
			).rejects.toMatchObject({ status: 404 });
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
				new Response(
					JSON.stringify({ errors: [{ code: '429', message: 'Slow' }] }),
					{
						status: 429,
						headers: {
							'Content-Type': KEYWORD_CONTENT_TYPE,
							'Retry-After': '2',
						},
					},
				),
			);
			respond(projects);

			const pending = corsair.keyword.api.projects.list({});
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
			respond(projects);

			const result = await withFakeTimers(
				corsair.keyword.api.projects.list({}),
			);

			expect(result.data).toHaveLength(2);
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
				corsair.keyword.api.keywords.add({
					projectName: 'Disney',
					keywords: [{ kw: 'x', url: 'disney.com' }],
				}),
			).rejects.toMatchObject({ transport: true, method: 'POST' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
