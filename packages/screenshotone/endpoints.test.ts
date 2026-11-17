import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { ScreenshotOneContext } from './context';
import {
	getUsage,
	listDevices,
	takeAnimation,
	takeBulk,
	takeScreenshot,
} from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key?: string,
	db?: ScreenshotOneContext['db'],
): ScreenshotOneContext {
	return { key, db } as unknown as ScreenshotOneContext;
}

describe('screenshotone', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores plan usage and sends the key in the X-Access-Key header, not the query', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			total: 10000,
			available: 950,
			used: 9050,
			concurrency: { limit: 20, remaining: 19, reset: 1681646947775 },
		});
		const result = await getUsage(
			context('sekrit', {
				usage: { upsertByEntityId: upsert },
			} as unknown as ScreenshotOneContext['db']),
			{},
		);
		expect(result.usage.id).toBe('plan');
		expect(result.usage.concurrencyRemaining).toBe(19);
		expect(upsert).toHaveBeenCalledWith('plan', result.usage);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/usage',
		});
		expect(JSON.stringify(mockRequest.mock.calls[0]?.[1])).not.toContain(
			'sekrit',
		);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toMatchObject({
			'X-Access-Key': 'sekrit',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
	});

	it('stores devices and drops the user agent', async () => {
		mockRequest.mockResolvedValue([
			{
				id: 'iphone_13_pro_max_landscape',
				name: 'iPhone 13 Pro Max landscape',
				userAgent: 'Mozilla/5.0 secret',
				viewport: { width: 926, height: 428 },
			},
		]);
		const result = await listDevices(context(), {});
		expect(result.devices[0]).toEqual({
			id: 'iphone_13_pro_max_landscape',
			name: 'iPhone 13 Pro Max landscape',
			width: 926,
			height: 428,
		});
		expect(JSON.stringify(result.devices)).not.toContain('Mozilla');
	});

	it('returns a screenshot url and omits the target from the event', async () => {
		mockRequest.mockResolvedValue({
			screenshot_url: 'https://files.example/shot.png?access_key=sekrit',
		});
		const result = await takeScreenshot(context(), {
			url: 'https://secret.example',
		});
		expect(result.screenshotUrl).toBe('https://files.example/shot.png');
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('secret');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/take',
			body: { response_type: 'json', url: 'https://secret.example' },
		});
	});

	it('sends render options and returns the cache url', async () => {
		// Live POST /take response with cache=true on 11-17 (hashes shortened).
		mockRequest.mockResolvedValue({
			screenshot_url: 'https://files.screenshotonecache.com/888d/1794-dca2.jpg',
			cache_url: 'https://files.screenshotonecache.com/888d/1794-dca2.jpg',
		});
		const result = await takeScreenshot(context('k'), {
			url: 'https://example.com',
			format: 'jpg',
			full_page: true,
			viewport_width: 1024,
			block_cookie_banners: true,
			wait_until: ['networkidle2'],
			cache: true,
			cache_ttl: 14400,
		});
		expect(result).toEqual({
			screenshotUrl: 'https://files.screenshotonecache.com/888d/1794-dca2.jpg',
			cacheUrl: 'https://files.screenshotonecache.com/888d/1794-dca2.jpg',
		});
		expect(mockRequest.mock.calls[0]?.[1]?.body).toEqual({
			url: 'https://example.com',
			format: 'jpg',
			full_page: true,
			viewport_width: 1024,
			block_cookie_banners: true,
			wait_until: ['networkidle2'],
			cache: true,
			cache_ttl: 14400,
			response_type: 'json',
		});
	});

	it('renders html instead of a url', async () => {
		mockRequest.mockResolvedValue({
			screenshot_url: 'https://files.screenshotonecache.com/8b66.png',
		});
		await takeScreenshot(context('k'), { html: '<h1>hi</h1>', format: 'png' });
		expect(mockRequest.mock.calls[0]?.[1]?.body).toEqual({
			html: '<h1>hi</h1>',
			format: 'png',
			response_type: 'json',
		});
	});

	it('needs exactly one of url, html or markdown, and rejects unknown options', async () => {
		await expect(takeScreenshot(context('k'), {})).rejects.toThrow();
		await expect(
			takeScreenshot(context('k'), { url: 'https://a.b', html: '<p/>' }),
		).rejects.toThrow();
		await expect(
			takeScreenshot(context('k'), {
				url: 'https://a.b',
				colour: 'red',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends animate options as query params', async () => {
		mockRequest.mockResolvedValue({
			screenshot_url: 'https://files.screenshotonecache.com/a.mp4',
		});
		await takeAnimation(context('k'), {
			url: 'https://example.com',
			scenario: 'scroll',
			duration: 3,
			format: 'mp4',
			wait_until: ['load', 'networkidle0'],
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/animate',
			query: {
				url: 'https://example.com',
				scenario: 'scroll',
				duration: 3,
				format: 'mp4',
				wait_until: 'load,networkidle0',
				response_type: 'json',
			},
		});
	});

	it('rejects an empty url before calling the API', async () => {
		await expect(takeAnimation(context(), { url: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reads the live bulk shape (a bare array) and returns each status when executed', async () => {
		// Live POST /bulk with execute true on 11-17.
		mockRequest.mockResolvedValue([
			{
				url: 'https://api.screenshotone.com/take?response_type=json&format=jpg&url=https%3A%2F%2Fexample.com&access_key=sekrit',
				response: { is_successful: true, status: 200, statusText: 'OK' },
			},
		]);
		const result = await takeBulk(context('sekrit'), {
			urls: ['https://example.com'],
			execute: true,
			options: { format: 'jpg' },
		});
		expect(result.urls).toEqual([
			'https://api.screenshotone.com/take?response_type=json&format=jpg&url=https%3A%2F%2Fexample.com',
		]);
		expect(result.results).toEqual([
			{ url: result.urls[0], isSuccessful: true, status: 200 },
		]);
		expect(mockRequest.mock.calls[0]?.[1]?.body).toEqual({
			execute: true,
			options: { format: 'jpg' },
			requests: [{ url: 'https://example.com' }],
		});
	});

	it('returns bulk urls and strips access_key', async () => {
		mockRequest.mockResolvedValue({
			responses: [
				{
					url: 'https://api.screenshotone.com/take?url=https%3A%2F%2Fexample.com&access_key=sekrit',
				},
			],
		});
		const result = await takeBulk(context(), {
			urls: ['https://example.com'],
		});
		expect(result.urls[0]).not.toContain('access_key');
		expect(result.urls[0]).toContain('example.com');
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			url: '/bulk',
			body: { execute: false, requests: [{ url: 'https://example.com' }] },
		});
		expect(JSON.stringify(mockRequest.mock.calls[0]?.[1]?.body)).not.toContain(
			'sekrit',
		);
	});

	it('lets an HTTP 400 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/usage' },
			{
				url: 'https://api.screenshotone.com/usage',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { error_code: 'access_key_required' },
			},
			'Bad Request',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getUsage(context(), {})).rejects.toBe(error);
	});
});
