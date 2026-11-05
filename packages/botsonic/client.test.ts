import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeBotsonicRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/v1/botsonic/generate' },
		{
			url: 'https://api.botsonic.ai/v1/botsonic/generate',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeBotsonicRequest', () => {
	it('sends the generate token header and does not set TOKEN', async () => {
		mockRequest.mockResolvedValue({ answer: 'hi' });

		await makeBotsonicRequest('/v1/botsonic/generate', 'bot-token', {
			method: 'POST',
			body: { input_text: 'hi' },
		});

		const [config] = lastCall();
		expect(config.BASE).toBe('https://api.botsonic.ai');
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toMatchObject({
			token: 'bot-token',
		});
		expect(
			(config.HEADERS as Record<string, string> | undefined)?.Authorization,
		).toBeUndefined();
	});

	it('sends X-BOT-KEY for bot-key requests and does not set TOKEN', async () => {
		mockRequest.mockResolvedValue({ items: [] });

		await makeBotsonicRequest('/v1/business/bot-faq/all', 'bot-key', {
			method: 'GET',
			authType: 'bot-key',
		});

		const [config] = lastCall();
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toMatchObject({
			'X-BOT-KEY': 'bot-key',
		});
	});

	it('rethrows a 429 ApiError with retryAfter intact', async () => {
		const rateLimited = apiError(429, 'Too Many Requests', 2500);
		mockRequest.mockRejectedValue(rateLimited);

		await expect(
			makeBotsonicRequest('/v1/botsonic/generate', 'bot-token'),
		).rejects.toBe(rateLimited);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 2500,
		});
	});
});
