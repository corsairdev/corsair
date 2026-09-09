import type { ApiRequestOptions } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeWaboxappRequest, WABOXAPP_API_BASE } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('makeWaboxappRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ success: true, custom_uid: 'msg-1' });
	});

	it('posts form fields to the Waboxapp API host', async () => {
		await makeWaboxappRequest('send/chat', {
			method: 'POST',
			fields: {
				token: 'tok',
				uid: '34666123456',
				to: '34666789123',
				text: 'Hello',
				skip: undefined,
			},
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options] = mockRequest.mock.calls[0] as [
			{ BASE: string },
			{
				method: string;
				url: string;
				body: Record<string, string>;
				mediaType: string;
			},
		];
		expect(config.BASE).toBe(WABOXAPP_API_BASE);
		expect(options.method).toBe('POST');
		expect(options.url).toBe('send/chat');
		expect(options.mediaType).toBe('application/x-www-form-urlencoded');
		expect(options.body).toEqual({
			token: 'tok',
			uid: '34666123456',
			to: '34666789123',
			text: 'Hello',
		});
	});

	it('rethrows ApiError so rate-limit handlers keep status', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: 'send/chat' } as ApiRequestOptions,
			{
				url: 'https://www.waboxapp.com/api/send/chat',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'rate limited',
			{ retryAfter: 4000 },
		);
		mockRequest.mockRejectedValue(apiError);
		await expect(
			makeWaboxappRequest('send/chat', {
				method: 'POST',
				fields: { token: 'tok' },
			}),
		).rejects.toBe(apiError);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(apiError),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 4000,
		});
	});

	it('matches Waboxapp 403 as auth failure', () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'status/1' } as ApiRequestOptions,
			{
				url: 'https://www.waboxapp.com/api/status/1',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { error: 'auth' },
			},
			'forbidden',
		);
		expect(errorHandlers.AUTH_ERROR.match(apiError)).toBe(true);
	});
});
