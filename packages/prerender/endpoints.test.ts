import * as client from './client';
import { PrerenderAPIError } from './client';
import { Cache } from './endpoints';
import { buildContext, captureError } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePrerenderRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePrerenderRequest);
const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('response parsing', () => {
	it('keeps a field Prerender adds to a cached URL', async () => {
		mockedRequest.mockResolvedValue({
			urls: [{ url: 'https://example.com/a', brand_new_field: 'x' }],
		});

		const result = await Cache.search(ctx, { query: 'example.com' });

		expect(result.urls[0]).toMatchObject({ brand_new_field: 'x' });
	});

	it('rejects a search answer whose urls is not an array', async () => {
		mockedRequest.mockResolvedValue({ urls: 'nope' });

		await expect(Cache.search(ctx, { query: 'example.com' })).rejects.toThrow();
	});

	it('accepts an empty body on a confirmation route', async () => {
		// A bodyless 200 must not become an undefined parse failure.
		mockedRequest.mockResolvedValue(undefined);

		const result = await Cache.recache(ctx, { url: 'https://example.com/' });

		expect(result).toEqual({});
	});

	it('accepts a confirmation that only carries a success flag', async () => {
		mockedRequest.mockResolvedValue({ success: true });

		const result = await Cache.sitemap(ctx, {
			url: 'https://example.com/sitemap.xml',
		});

		expect(result.success).toBe(true);
		expect(result.message).toBeUndefined();
	});

	it('rejects a change-speed answer that omits isAutomaticDelay', async () => {
		// Without it a caller cannot tell whether the speed applied.
		mockedRequest.mockResolvedValue({ success: true });

		await expect(
			Cache.changeSpeed(ctx, { urlsPerHour: 18_000 }),
		).rejects.toThrow();
	});

	it('rejects a cached URL whose lastCached is not a string', async () => {
		mockedRequest.mockResolvedValue({
			urls: [{ url: 'https://example.com/a', lastCached: 12345 }],
		});

		await expect(Cache.search(ctx, { query: 'example.com' })).rejects.toThrow();
	});

	it('keeps a null recacheMetrics, which the automatic delay returns', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			isAutomaticDelay: true,
			recacheMetrics: null,
		});

		const result = await Cache.changeSpeed(ctx, { urlsPerHour: 0 });

		expect(result.recacheMetrics).toBeNull();
	});
});

describe('input validation before the request', () => {
	it('rejects a recache with neither url nor urls', async () => {
		await expect(Cache.recache(ctx, {})).rejects.toThrow(
			/Supply `url` or `urls`/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a recache with both url and urls', async () => {
		await expect(
			Cache.recache(ctx, {
				url: 'https://example.com/a',
				urls: ['https://example.com/b'],
			}),
		).rejects.toThrow(/not both/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a recache list above the documented 1000', async () => {
		await expect(
			Cache.recache(ctx, {
				urls: Array.from(
					{ length: 1001 },
					(_, index) => `https://example.com/${index}`,
				),
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a recache list of exactly 1000', async () => {
		mockedRequest.mockResolvedValue({ message: 'queued' });

		await expect(
			Cache.recache(ctx, {
				urls: Array.from(
					{ length: 1000 },
					(_, index) => `https://example.com/${index}`,
				),
			}),
		).resolves.toBeDefined();
	});

	it('rejects a search with neither query nor exactMatch, which would dump the cache', async () => {
		await expect(Cache.search(ctx, {})).rejects.toThrow(
			/Supply `query` or `exactMatch`/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a search with only an exactMatch', async () => {
		mockedRequest.mockResolvedValue({ urls: [] });

		await expect(
			Cache.search(ctx, { exactMatch: 'https://example.com/path' }),
		).resolves.toBeDefined();
	});

	it('rejects a negative start offset', async () => {
		await expect(
			Cache.search(ctx, { query: 'example.com', start: -1 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a device type outside desktop and mobile', async () => {
		await expect(
			Cache.recache(ctx, {
				url: 'https://example.com/',
				adaptiveType: 'tablet' as never,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a manual speed below the documented 3600', async () => {
		// The API documents 0 for automatic, then 3600 upwards, so 1 is invalid.
		await expect(Cache.changeSpeed(ctx, { urlsPerHour: 1 })).rejects.toThrow(
			/automatic delay/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts the two documented boundaries of the manual band', async () => {
		mockedRequest.mockResolvedValue({ success: true, isAutomaticDelay: false });

		await expect(
			Cache.changeSpeed(ctx, { urlsPerHour: 3600 }),
		).resolves.toBeDefined();
		await expect(
			Cache.changeSpeed(ctx, { urlsPerHour: 36_000 }),
		).resolves.toBeDefined();
	});

	it('rejects a speed above the documented 36000', async () => {
		await expect(
			Cache.changeSpeed(ctx, { urlsPerHour: 36_001 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty cache-clear pattern', async () => {
		await expect(Cache.cacheClear(ctx, { query: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty URL rather than sending a blank one', async () => {
		await expect(Cache.recache(ctx, { url: '' })).rejects.toThrow();
		await expect(Cache.sitemap(ctx, { url: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces a rejection as an error a handler can match', async () => {
		mockedRequest.mockRejectedValue(
			new PrerenderAPIError('Prerender 400: Invalid prerenderToken', {
				status: 400,
				reason: 'Invalid prerenderToken',
				method: 'POST',
				credentialsRejected: true,
			}),
		);

		const error = await captureError(
			Cache.recache(ctx, { url: 'https://example.com/' }),
		);

		expect(error).toBeInstanceOf(PrerenderAPIError);
		expect(error).toMatchObject({ status: 400, credentialsRejected: true });
	});
});
