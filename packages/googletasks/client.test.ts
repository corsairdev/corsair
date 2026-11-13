import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeGoogleTasksRequest } from './client';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/tasks/v1/users/@me/lists' },
		{
			url: 'https://tasks.googleapis.com/tasks/v1/users/@me/lists',
			ok: false,
			status,
			statusText: 'Google API error',
			body: { error: { code: status, status: 'RESOURCE_EXHAUSTED' } },
		},
		'Google API error',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

describe('Google Tasks OAuth client', () => {
	beforeEach(() => {
		mockedRequest.mockReset().mockResolvedValue({ items: [] });
	});

	it('sends an OAuth bearer token only in the authorization header', async () => {
		await makeGoogleTasksRequest('/tasks/v1/users/@me/lists', {
			key: 'private-access-token',
		});
		const config = mockedRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://tasks.googleapis.com');
		expect(config?.VERSION).toBe('v1');
		expect(config?.HEADERS).toEqual({
			Authorization: 'Bearer private-access-token',
			'Content-Type': 'application/json',
		});
		expect(config?.TOKEN).toBeUndefined();
		expect(mockedRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 0,
				backoffMultiplier: 1,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	});

	it('fails on a missing token before making a request', async () => {
		await expect(
			makeGoogleTasksRequest('/tasks/v1/users/@me/lists', {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it.each([400, 401, 403, 404, 429, 500])(
		'preserves Google ApiError status and retry metadata for HTTP %i',
		async (status) => {
			const failure = apiError(status, status === 429 ? 4000 : undefined);
			mockedRequest.mockRejectedValue(failure);
			await expect(
				makeGoogleTasksRequest('/tasks/v1/users/@me/lists', {
					key: 'private-access-token',
				}),
			).rejects.toBe(failure);
		},
	);

	it('extracts Retry-After with the real corsair/http transport', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(
				JSON.stringify({ error: { code: 429, message: 'slow down' } }),
				{
					status: 429,
					headers: { 'Retry-After': '4', 'Content-Type': 'application/json' },
				},
			),
		);
		await expect(
			actualHttp.request(
				{
					BASE: 'https://tasks.googleapis.com',
					VERSION: 'v1',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					HEADERS: { Authorization: 'Bearer token-for-test' },
				},
				{ method: 'GET', url: '/tasks/v1/users/@me/lists' },
				{
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				},
			),
		).rejects.toMatchObject({ status: 429, retryAfter: 4000 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		fetchMock.mockRestore();
	});
});
