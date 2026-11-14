import { ApiError } from 'corsair/http';
import { DiscordAPIError, makeDiscordRequest } from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const { request } = jest.requireMock('corsair/http') as {
	request: jest.Mock;
};

const makeApiError = (
	status: number,
	statusText: string,
	rateLimitInfo?: { retryAfter?: number },
) =>
	new ApiError(
		{ method: 'GET', url: 'channels/1/messages' },
		{
			url: 'https://discord.com/api/v10/channels/1/messages',
			ok: false,
			status,
			statusText,
			body: {},
		},
		statusText,
		rateLimitInfo,
	);

const errorContext = { operation: 'messages.list' } as Parameters<
	typeof errorHandlers.RATE_LIMIT_ERROR.handler
>[1];

describe('makeDiscordRequest error handling', () => {
	beforeEach(() => {
		request.mockReset();
	});

	it('rethrows ApiError untouched so status and retryAfter survive', async () => {
		const apiError = makeApiError(429, 'Too Many Requests', {
			retryAfter: 1500,
		});
		request.mockRejectedValue(apiError);

		const thrown = await makeDiscordRequest(
			'channels/1/messages',
			'token',
		).catch((e: unknown) => e);

		expect(thrown).toBe(apiError);
		expect((thrown as ApiError).status).toBe(429);
		expect((thrown as ApiError).retryAfter).toBe(1500);
	});

	it('wraps non-ApiError errors in DiscordAPIError', async () => {
		request.mockRejectedValue(new Error('network down'));

		await expect(
			makeDiscordRequest('channels/1/messages', 'token'),
		).rejects.toMatchObject({
			name: 'DiscordAPIError',
			message: 'network down',
		});
		await expect(
			makeDiscordRequest('channels/1/messages', 'token'),
		).rejects.toBeInstanceOf(DiscordAPIError);
	});

	it('wraps non-Error rejections in DiscordAPIError', async () => {
		request.mockRejectedValue('boom');

		await expect(
			makeDiscordRequest('channels/1/messages', 'token'),
		).rejects.toMatchObject({
			name: 'DiscordAPIError',
			message: 'Unknown error',
		});
	});

	it('lets the rate limit handler retry a 429 using the Retry-After delay', async () => {
		request.mockRejectedValue(
			makeApiError(429, 'Too Many Requests', { retryAfter: 1500 }),
		);
		const thrown = (await makeDiscordRequest(
			'channels/1/messages',
			'token',
		).catch((e: unknown) => e)) as Error;

		expect(errorHandlers.RATE_LIMIT_ERROR.match(thrown, errorContext)).toBe(
			true,
		);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(thrown, errorContext),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 1500 });
	});

	it.each([
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
	] as const)('routes a %i to the %s handler', async (status, handlerName) => {
		request.mockRejectedValue(makeApiError(status, 'nope'));
		const thrown = (await makeDiscordRequest(
			'channels/1/messages',
			'token',
		).catch((e: unknown) => e)) as Error;

		expect(errorHandlers[handlerName].match(thrown, errorContext)).toBe(true);
	});
});
