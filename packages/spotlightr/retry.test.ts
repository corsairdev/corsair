import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { spotlightr } from './index';
import { videoMetrics, videosPage } from './test-fixtures';

/**
 * `requests.test.ts` calls the HTTP client, which is built with `maxRetries: 0`
 * so only `error-handlers.ts` decides what is retried. This file goes through
 * `createCorsair` to prove that layer runs.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'spotlightr', 'default');
	const corsair = createCorsair({
		plugins: [spotlightr({ key: 'sl-test-key' })],
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
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through createCorsair', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '1' });
			respond(videosPage());

			const result = await corsair.spotlightr.api.videos.list({});

			expect(result.videos.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the builtin retry budget', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({}, 429);
			}

			await expect(
				corsair.spotlightr.api.videos.list({}),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);

	it('does not replay a video create on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 500);

			await expect(
				corsair.spotlightr.api.videos.create({
					name: 'Product tour',
					url: 'https://youtu.be/abc',
				}),
			).rejects.toMatchObject({ status: 500 });
			// A replay could create the video twice.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 503);
			respond(videoMetrics);

			const result = await corsair.spotlightr.api.videos.metrics({
				video_id: '1357835',
			});

			expect(result.loads).toBe(16);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond('Unauthorized.', 401);

			await expect(
				corsair.spotlightr.api.videos.list({}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns a write normally when it succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond('https://cdn.spotlightr.com/watch/MTM1NzgzNQ==');

			const result = await corsair.spotlightr.api.videos.create({
				name: 'Clip',
				url: 'https://youtu.be/x',
			});

			expect(result).toContain('watch/');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out Retry-After with a fake clock', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429, { 'Retry-After': '2' });
			respond(videosPage());

			const pending = corsair.spotlightr.api.videos.list({});
			await jest.advanceTimersByTimeAsync(1500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(600);
			expect((await pending).videos.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);

	it('falls back to the strategy delay when there is no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({}, 429);
			respond(videosPage());

			const pending = corsair.spotlightr.api.videos.list({});
			await jest.advanceTimersByTimeAsync(900);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(200);
			expect((await pending).videos.data).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	}, 30_000);
});
