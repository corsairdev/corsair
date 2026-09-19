import { ApiError, request } from 'corsair/http';
import {
	getValidAccessToken,
	makeAuthenticatedTickTickRequest,
	makeTickTickRequest,
	TickTickAPIError,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;
const fetchMock = jest.fn();

function okJson(body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('TickTick OAuth client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		fetchMock.mockReset();
		global.fetch = fetchMock as unknown as typeof fetch;
	});

	describe('getValidAccessToken', () => {
		it('reuses an access token outside the expiry skew without refreshing', async () => {
			const result = await getValidAccessToken({
				accessToken: 'access',
				expiresAt: String(Math.floor(Date.now() / 1000) + 1800),
				clientId: 'client',
				clientSecret: 'secret',
				refreshToken: 'refresh',
			});

			expect(result).toMatchObject({
				accessToken: 'access',
				refreshed: false,
			});
			expect(fetchMock).not.toHaveBeenCalled();
		});

		it('treats a non-numeric expiresAt as expired and refreshes', async () => {
			fetchMock.mockResolvedValueOnce(
				okJson({ access_token: 'fresh', expires_in: 3600 }),
			);

			const result = await getValidAccessToken({
				accessToken: 'stale',
				expiresAt: 'not-a-timestamp',
				clientId: 'client',
				clientSecret: 'secret',
				refreshToken: 'refresh',
			});

			expect(result.refreshed).toBe(true);
			expect(result.accessToken).toBe('fresh');
		});

		it('forces a refresh even when the cached token is still valid', async () => {
			fetchMock.mockResolvedValueOnce(
				okJson({ access_token: 'forced', expires_in: 60 }),
			);

			const result = await getValidAccessToken({
				accessToken: 'still-valid',
				expiresAt: String(Math.floor(Date.now() / 1000) + 3600),
				clientId: 'client',
				clientSecret: 'secret',
				refreshToken: 'refresh',
				forceRefresh: true,
			});

			expect(result).toMatchObject({ accessToken: 'forced', refreshed: true });
		});

		it('surfaces a rotated refresh token only when the provider returns one', async () => {
			fetchMock
				.mockResolvedValueOnce(
					okJson({
						access_token: 'fresh',
						expires_in: 3600,
						refresh_token: 'rotated',
					}),
				)
				.mockResolvedValueOnce(
					okJson({ access_token: 'fresh2', expires_in: 3600 }),
				);

			const rotated = await getValidAccessToken({
				clientId: 'client',
				clientSecret: 'secret',
				refreshToken: 'refresh',
			});
			const notRotated = await getValidAccessToken({
				clientId: 'client',
				clientSecret: 'secret',
				refreshToken: 'refresh',
			});

			expect(rotated.newRefreshToken).toBe('rotated');
			expect(notRotated.newRefreshToken).toBeUndefined();
		});

		it('wraps refresh failures in TickTickAPIError with the HTTP status', async () => {
			fetchMock.mockResolvedValueOnce(
				new Response('invalid refresh token', { status: 400 }),
			);

			await expect(
				getValidAccessToken({
					clientId: 'client',
					clientSecret: 'secret',
					refreshToken: 'refresh',
				}),
			).rejects.toMatchObject({
				code: '400',
				message: expect.stringContaining('invalid refresh token'),
			});
		});

		it('retries a 429 refresh using Retry-After then returns the token', async () => {
			fetchMock
				.mockResolvedValueOnce(
					new Response('rate limited', {
						status: 429,
						headers: { 'Retry-After': '0' },
					}),
				)
				.mockResolvedValueOnce(
					okJson({ access_token: 'fresh', expires_in: 3600 }),
				);

			const result = await getValidAccessToken({
				clientId: 'client',
				clientSecret: 'secret',
				refreshToken: 'refresh',
			});

			expect(result.accessToken).toBe('fresh');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		});

		it('gives up after repeated 429 refresh responses and keeps Retry-After', async () => {
			fetchMock.mockImplementation(() =>
				Promise.resolve(
					new Response('rate limited', {
						status: 429,
						headers: { 'Retry-After': '0' },
					}),
				),
			);

			await expect(
				getValidAccessToken({
					clientId: 'client',
					clientSecret: 'secret',
					refreshToken: 'refresh',
				}),
			).rejects.toMatchObject({
				name: 'TickTickAPIError',
				code: '429',
				retryAfter: 0,
			});
			expect(fetchMock).toHaveBeenCalledTimes(6);
		});

		it('rejects a 200 token payload that is missing access_token', async () => {
			fetchMock.mockResolvedValueOnce(okJson({ expires_in: 3600 }));

			await expect(
				getValidAccessToken({
					clientId: 'client',
					clientSecret: 'secret',
					refreshToken: 'refresh',
				}),
			).rejects.toMatchObject({
				name: 'TickTickAPIError',
				code: 'INVALID_TOKEN_RESPONSE',
			});
		});

		it('rejects a 200 token payload with a non-finite expires_in', async () => {
			fetchMock.mockResolvedValueOnce(
				okJson({ access_token: 'fresh', expires_in: 'never' }),
			);

			await expect(
				getValidAccessToken({
					clientId: 'client',
					clientSecret: 'secret',
					refreshToken: 'refresh',
				}),
			).rejects.toMatchObject({
				code: 'INVALID_TOKEN_RESPONSE',
			});
		});

		it('sends the refresh grant as form fields with a timeout signal', async () => {
			fetchMock.mockResolvedValueOnce(
				okJson({ access_token: 'fresh', expires_in: 3600 }),
			);

			await getValidAccessToken({
				clientId: 'cid',
				clientSecret: 'sec',
				refreshToken: 'r',
			});

			const [url, init] = fetchMock.mock.calls[0] as [
				string,
				RequestInit & { body: URLSearchParams },
			];
			expect(url).toBe('https://ticktick.com/oauth/token');
			expect(init.body.get('grant_type')).toBe('refresh_token');
			expect(init.body.get('client_id')).toBe('cid');
			expect(init.body.get('client_secret')).toBe('sec');
			expect(init.signal).toBeDefined();
		});
	});

	describe('makeAuthenticatedTickTickRequest', () => {
		it('retries once with the refreshed token after a 401', async () => {
			const refresh = jest.fn().mockResolvedValue('fresh-token');
			mockRequest
				.mockRejectedValueOnce(
					new TickTickAPIError('[401] Unauthorized', '401'),
				)
				.mockResolvedValueOnce({ ok: true });

			const result = await makeAuthenticatedTickTickRequest(
				'/project',
				{ key: 'stale-token', _refreshAuth: refresh },
				{ method: 'GET' },
			);

			expect(result).toEqual({ ok: true });
			expect(refresh).toHaveBeenCalledTimes(1);
			expect(mockRequest).toHaveBeenCalledTimes(2);
			const retryConfig = mockRequest.mock.calls[1]?.[0];
			expect(retryConfig?.TOKEN).toBe('fresh-token');
		});

		it('rethrows a 401 when no _refreshAuth hook exists', async () => {
			mockRequest.mockRejectedValueOnce(
				new TickTickAPIError('[401] Unauthorized', '401'),
			);

			await expect(
				makeAuthenticatedTickTickRequest('/project', { key: 'stale-token' }),
			).rejects.toThrow('Unauthorized');
			expect(mockRequest).toHaveBeenCalledTimes(1);
		});

		it('propagates a second consecutive 401 without a second refresh', async () => {
			const refresh = jest.fn().mockResolvedValue('fresh-token');
			mockRequest
				.mockRejectedValueOnce(
					new TickTickAPIError('[401] Unauthorized', '401'),
				)
				.mockRejectedValueOnce(
					new TickTickAPIError('[401] Unauthorized', '401'),
				);

			await expect(
				makeAuthenticatedTickTickRequest(
					'/project',
					{ key: 'stale-token', _refreshAuth: refresh },
					{ method: 'GET' },
				),
			).rejects.toThrow('Unauthorized');

			expect(refresh).toHaveBeenCalledTimes(1);
			expect(mockRequest).toHaveBeenCalledTimes(2);
		});

		it('propagates non-401 errors without refreshing', async () => {
			const refresh = jest.fn().mockResolvedValue('fresh-token');
			mockRequest.mockRejectedValueOnce(
				new TickTickAPIError('[500] server error', '500'),
			);

			await expect(
				makeAuthenticatedTickTickRequest(
					'/project',
					{ key: 'token', _refreshAuth: refresh },
					{ method: 'GET' },
				),
			).rejects.toThrow('server error');

			expect(refresh).not.toHaveBeenCalled();
			expect(mockRequest).toHaveBeenCalledTimes(1);
		});
	});

	describe('makeTickTickRequest', () => {
		it('targets the open v1 base with bearer auth', async () => {
			mockRequest.mockResolvedValueOnce([]);

			await makeTickTickRequest('project', 'tok', { method: 'GET' });

			const [config] = mockRequest.mock.calls[0] ?? [];
			expect(config?.BASE).toBe('https://api.ticktick.com/open/v1');
			expect(config?.TOKEN).toBe('tok');
			const headers = config?.HEADERS as Record<string, string> | undefined;
			expect(headers?.Authorization).toBeUndefined();
		});

		it('omits the body on GET and passes it through on POST', async () => {
			mockRequest.mockResolvedValue({ id: 'p1' });

			await makeTickTickRequest('project', 'tok', { method: 'GET' });
			await makeTickTickRequest('project', 'tok', {
				method: 'POST',
				body: { name: 'New Project' },
			});

			const [, getOptions] = mockRequest.mock.calls[0] ?? [];
			expect(getOptions?.body).toBeUndefined();

			const [, postOptions] = mockRequest.mock.calls[1] ?? [];
			expect(postOptions?.body).toEqual({ name: 'New Project' });
		});

		it('keeps ApiError status and retryAfter on TickTickAPIError', async () => {
			mockRequest.mockRejectedValueOnce(
				new ApiError(
					{ method: 'GET', url: 'project' },
					{
						url: 'https://api.ticktick.com/open/v1/project',
						ok: false,
						status: 429,
						statusText: 'Too Many Requests',
						body: { error: 'Too Many Requests' },
					},
					'Too Many Requests',
					{ retryAfter: 2500 },
				),
			);

			await expect(
				makeTickTickRequest('project', 'tok', { method: 'GET' }),
			).rejects.toMatchObject({
				name: 'TickTickAPIError',
				code: '429',
				retryAfter: 2500,
				message: '[429] Too Many Requests',
			});
		});
	});
});
