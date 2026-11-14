import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Cache } from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePrerenderRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePrerenderRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('recache', () => {
	it('posts a single url', async () => {
		mockedRequest.mockResolvedValue({ message: 'recached' });

		const result = await Cache.recache(ctx, {
			url: 'https://example.com/pricing',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/recache',
			body: {
				url: 'https://example.com/pricing',
				urls: undefined,
				adaptiveType: undefined,
			},
		});
		expect(result.message).toBe('recached');
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'prerender.recache',
			{ count: 1 },
			'completed',
		);
	});

	it('posts a list of urls and logs the count', async () => {
		mockedRequest.mockResolvedValue({ message: 'recaching' });

		await Cache.recache(ctx, {
			urls: ['https://example.com/a', 'https://example.com/b'],
			adaptiveType: 'mobile',
		});

		expect(sentRequest()?.body).toMatchObject({
			urls: ['https://example.com/a', 'https://example.com/b'],
			adaptiveType: 'mobile',
		});
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'prerender.recache',
			{ count: 2 },
			'completed',
		);
	});

	it('accepts a plain-text confirmation rather than failing the parse', async () => {
		// Some routes answer text; the plugin reads a string as the message.
		mockedRequest.mockResolvedValue('Recache queued');

		const result = await Cache.recache(ctx, { url: 'https://example.com/' });

		expect(result.message).toBe('Recache queued');
	});
});

describe('search', () => {
	it('posts the query and start offset', async () => {
		mockedRequest.mockResolvedValue({
			urls: [{ url: 'https://example.com/path', status: 'Cached' }],
		});

		const result = await Cache.search(ctx, {
			query: 'example.com/path',
			start: 200,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/search',
			body: {
				query: 'example.com/path',
				exactMatch: undefined,
				start: 200,
				adaptiveType: undefined,
			},
		});
		expect(result.urls).toHaveLength(1);
		expect(result.urls[0]?.status).toBe('Cached');
	});

	it('accepts the bare array some plans answer with', async () => {
		mockedRequest.mockResolvedValue([
			{ url: 'https://example.com/a', status: 'Cached' },
		]);

		const result = await Cache.search(ctx, { query: 'example.com' });

		expect(result.urls).toHaveLength(1);
	});

	it('accepts an empty result set', async () => {
		mockedRequest.mockResolvedValue({ urls: [] });

		const result = await Cache.search(ctx, { query: 'nothing' });

		expect(result.urls).toEqual([]);
	});
});

describe('sitemap', () => {
	it('posts the sitemap url', async () => {
		mockedRequest.mockResolvedValue({ message: 'sitemap queued' });

		await Cache.sitemap(ctx, { url: 'https://example.com/sitemap.xml' });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/sitemap',
			body: { url: 'https://example.com/sitemap.xml', adaptiveType: undefined },
		});
	});
});

describe('cacheClear', () => {
	it('posts the pattern and does not log it', async () => {
		mockedRequest.mockResolvedValue({ message: 'Cache clear queued' });

		const result = await Cache.cacheClear(ctx, {
			query: 'https://example.com%',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/cache-clear',
			body: { query: 'https://example.com%' },
		});
		expect(result.message).toBe('Cache clear queued');
		// The pattern is the caller's own URL tree, so the log stays empty.
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'prerender.cacheClear',
			{},
			'completed',
		);
	});
});

describe('cacheClearStatus', () => {
	it('puts the token in the path and sends no body', async () => {
		mockedRequest.mockResolvedValue('Not queued');

		const result = await Cache.cacheClearStatus(ctx, {});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/cache-clear-status/prerender-token',
		});
		expect(result.message).toBe('Not queued');
	});
});

describe('changeSpeed', () => {
	it('posts a manual speed and returns the metrics', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			isAutomaticDelay: false,
			recacheMetrics: {
				delayBetweenURLs: 10286,
				num1Hour: 350,
				num1Day: 8400,
			},
		});

		const result = await Cache.changeSpeed(ctx, { urlsPerHour: 18_000 });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/change-recache-speed',
			body: { urlsPerHour: 18_000 },
		});
		expect(result.isAutomaticDelay).toBe(false);
		expect(result.recacheMetrics?.num1Day).toBe(8400);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'prerender.changeSpeed',
			{ urlsPerHour: 18_000, isAutomaticDelay: false },
			'completed',
		);
	});

	it('posts 0 to restore the automatic delay', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			isAutomaticDelay: true,
			recacheMetrics: null,
		});

		const result = await Cache.changeSpeed(ctx, { urlsPerHour: 0 });

		expect(sentRequest()?.body).toEqual({ urlsPerHour: 0 });
		expect(result.isAutomaticDelay).toBe(true);
		expect(result.recacheMetrics).toBeNull();
	});
});
