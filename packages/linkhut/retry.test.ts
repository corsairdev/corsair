import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { LINKHUT_MIN_INTERVAL_MS, linkhutRequestGap } from './client';
import { linkhut } from './index';
import { done, postsOfOneDay, unauthenticated } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 *
 * Every request here is a GET, and four of them mutate, so each case pins the
 * replay decision the operation declared rather than the method.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'linkhut', 'default');
	const corsair = createCorsair({
		plugins: [linkhut({ key: 'linkhut-test-token' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

function respond(
	body: unknown, // unknown: the body is whichever JSON the case under test needs.
	status = 200,
) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	jest.useFakeTimers();
	linkhutRequestGap.minIntervalMs = 0;
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	linkhutRequestGap.minIntervalMs = LINKHUT_MIN_INTERVAL_MS;
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the rows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(respond(unauthenticated, 429))
				.mockResolvedValueOnce(respond(postsOfOneDay));

			const pending = corsair.linkhut.api.posts.recent({ count: 2 });
			await jest.advanceTimersByTimeAsync(2000);
			const result = await pending;

			expect(result.posts).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the three 429 retries core makes', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockImplementation(() =>
				Promise.resolve(respond(unauthenticated, 429)),
			);

			const pending = corsair.linkhut.api.posts.recent({});
			// The expectation attaches first, so the rejection never lands on an
			// unattended promise while the fake clock advances.
			const expectation = expect(pending).rejects.toMatchObject({
				status: 429,
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			// One attempt plus core's three retries; RATE_LIMIT_ERROR adds none.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a 5xx on posts.delete, which is a destructive GET', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(respond(done, 500));

			const pending = corsair.linkhut.api.posts.delete({
				url: 'https://example.com/',
			});
			const expectation = expect(pending).rejects.toMatchObject({
				status: 500,
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a 5xx on tags.delete either', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(respond(done, 500));

			const pending = corsair.linkhut.api.tags.delete({ tag: 'old' });
			const expectation = expect(pending).rejects.toMatchObject({
				status: 500,
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 500 on a read, which linkhut documents as throttling', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(respond(done, 500))
				.mockResolvedValueOnce(respond(postsOfOneDay));

			const pending = corsair.linkhut.api.posts.recent({});
			await jest.advanceTimersByTimeAsync(3000);
			const result = await pending;

			expect(result.posts).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a 500 on a posts.add create, which may have landed', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(respond(done, 500));

			const pending = corsair.linkhut.api.posts.add({
				url: 'https://example.com/',
				description: 'Example',
			});
			const expectation = expect(pending).rejects.toMatchObject({
				status: 500,
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 500 on a posts.add update (replace=yes), which converges', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(respond(done, 500))
				.mockResolvedValueOnce(respond(done));

			const pending = corsair.linkhut.api.posts.add({
				url: 'https://example.com/',
				description: 'Example',
				replace: 'yes',
			});
			await jest.advanceTimersByTimeAsync(3000);
			await expect(pending).resolves.toEqual({ result_code: 'done' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never replays a dropped connection on posts.delete', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

			const pending = corsair.linkhut.api.posts.delete({
				url: 'https://example.com/',
			});
			const expectation = expect(pending).rejects.toMatchObject({
				name: 'LinkhutNetworkError',
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(respond(unauthenticated, 401));

			const pending = corsair.linkhut.api.posts.recent({});
			const expectation = expect(pending).rejects.toMatchObject({
				status: 401,
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits about one second before the first retry when no Retry-After is sent', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock
				.mockResolvedValueOnce(respond(done, 500))
				.mockResolvedValueOnce(respond(postsOfOneDay));

			const pending = corsair.linkhut.api.posts.recent({});
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;
			expect(result.posts).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a result_code failure at HTTP 200', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockResolvedValueOnce(
				respond({ result_code: 'something went wrong' }),
			);

			const pending = corsair.linkhut.api.posts.add({
				url: 'https://example.com/',
				description: 'Example',
			});
			const expectation = expect(pending).rejects.toMatchObject({
				status: 200,
				body: { result_code: 'something went wrong' },
			});
			await jest.advanceTimersByTimeAsync(10_000);
			await expectation;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
