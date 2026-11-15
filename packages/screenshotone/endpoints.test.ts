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

	it('stores plan usage and sends access_key as a query param', async () => {
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
			query: { access_key: 'sekrit' },
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
			method: 'GET',
			url: '/take',
			query: expect.objectContaining({
				response_type: 'json',
				url: 'https://secret.example',
			}),
		});
	});

	it('rejects an empty url before calling the API', async () => {
		await expect(takeAnimation(context(), { url: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
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
