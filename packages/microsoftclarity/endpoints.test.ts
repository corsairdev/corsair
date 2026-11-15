import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { errorHandlers } from './error-handlers';
import type { MicrosoftClarityContext } from './index';
import { microsoftclarity } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));
jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));
const mockRequest = request as jest.Mock;
const mockLog = logEventFromContext as jest.Mock;
const ctx = {
	key: 'resolved-token',
	database: undefined,
	endpoints: {},
} as MicrosoftClarityContext;
const sample = [
	{
		metricName: 'Traffic',
		information: [
			{
				totalSessionCount: '9554',
				totalBotSessionCount: '8369',
				distantUserCount: '189733',
				PagesPerSessionPercentage: 1.0931,
				OS: 'Other',
				Country: 'US',
			},
		],
	},
];

describe('Microsoft Clarity Data Export', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});
	it('exports insights with bearer token, all dimensions, and no quota retries', async () => {
		mockRequest.mockResolvedValue(sample);
		const input = {
			numOfDays: 3 as const,
			dimension1: 'OS',
			dimension2: 'Browser',
			dimension3: 'Country',
		};
		const result = await microsoftclarity({
			key: 'other-token',
		}).endpoints!.insights.get(ctx, input);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://www.clarity.ms',
				TOKEN: 'resolved-token',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/export-data/api/v1/project-live-insights',
				query: input,
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
		expect(result).toEqual(sample);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'microsoftclarity.insights.get',
			{},
			'completed',
		);
	});
	it('exposes exactly one endpoint and no inbound webhooks', () => {
		const plugin = microsoftclarity();
		expect(Object.keys(plugin.endpointSchemas ?? {})).toEqual(['insights.get']);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
	it('accepts minimum input and empty results', async () => {
		mockRequest.mockResolvedValue([]);
		await expect(
			microsoftclarity().endpoints!.insights.get(ctx, { numOfDays: 1 }),
		).resolves.toEqual([]);
		expect(mockRequest.mock.calls[0][1].query).toEqual({ numOfDays: 1 });
	});
	it('rejects invalid day counts before sending a request', async () => {
		for (const numOfDays of [0, 4, 1.5]) {
			await expect(
				microsoftclarity().endpoints!.insights.get(ctx, { numOfDays } as never),
			).rejects.toThrow();
		}
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('rejects malformed output and does not log success', async () => {
		mockRequest.mockResolvedValue([
			{ metricName: 'Traffic', information: 'bad' },
		]);
		await expect(
			microsoftclarity().endpoints!.insights.get(ctx, { numOfDays: 2 }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
	it('rejects missing tokens before sending a request', async () => {
		await expect(
			microsoftclarity().endpoints!.insights.get(
				{ ...ctx, key: ' ' },
				{ numOfDays: 1 },
			),
		).rejects.toThrow('token is required');
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('preserves provider rate limit errors without retrying', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/export-data/api/v1/project-live-insights' },
			{
				url: 'https://www.clarity.ms/export-data/api/v1/project-live-insights',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: 'Exceeded daily limit',
			},
			'Too Many Requests',
			{ retryAfter: 2 },
		);
		mockRequest.mockRejectedValue(error);
		await expect(
			microsoftclarity().endpoints!.insights.get(ctx, { numOfDays: 1 }),
		).rejects.toBe(error);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toMatchObject({ maxRetries: 0, headersRetryAfterMs: 2 });
	});
});
