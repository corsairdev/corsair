import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makePipedriveRequest,
	PIPEDRIVE_API_BASE,
	PIPEDRIVE_RATE_LIMIT_CONFIG,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/deals', query: { api_token: 'secret-token' } },
		{
			url: `${PIPEDRIVE_API_BASE}/deals?api_token=secret-token`,
			ok: false,
			status,
			statusText: 'Request failed',
			body: { error: 'Request failed' },
		},
		'Pipedrive request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => mockedRequest.mockReset());

describe('Pipedrive HTTP client', () => {
	it('uses the documented x-api-token header and configured v2 base URL', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makePipedriveRequest('/deals', 'test-token', 'api_key', {
			method: 'GET',
			query: { limit: 50 },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: PIPEDRIVE_API_BASE,
				VERSION: '2.0.0',
				HEADERS: {
					'Content-Type': 'application/json',
					'x-api-token': 'test-token',
				},
			}),
			expect.objectContaining({
				url: '/deals',
				query: { limit: 50 },
			}),
			expect.objectContaining({ rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG }),
		);
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
	});

	it('uses Bearer authentication for OAuth without a token query parameter', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makePipedriveRequest('/deals', 'oauth-token', 'oauth_2');
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			TOKEN: 'oauth-token',
		});
		expect(mockedRequest.mock.calls[0]?.[1]?.query).toBeUndefined();
	});

	it('fails fast for a missing credential', async () => {
		await expect(makePipedriveRequest('/deals', '', 'api_key')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('preserves ApiError status, retry metadata, and keeps API token out of request details', async () => {
		const rateLimited = apiError(429, 4000);
		mockedRequest.mockRejectedValue(rateLimited);
		const rejection = await makePipedriveRequest(
			'/deals',
			'test-token',
			'api_key',
		).catch(
			// `unknown` because a Promise rejection may contain any JavaScript value.
			(error: unknown) => error,
		);
		expect(rejection).toBe(rateLimited);
		if (!(rejection instanceof ApiError)) throw new Error('Expected ApiError');
		expect(rejection.status).toBe(429);
		expect(rejection.retryAfter).toBe(4000);
		expect(JSON.stringify(rejection.request)).not.toContain('secret-token');
		expect(JSON.stringify(mockedRequest.mock.calls[0]?.[1])).not.toContain(
			'test-token',
		);
	});

	it('extracts Pipedrive burst reset with the real shared transport', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const originalFetch = globalThis.fetch;
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ error: 'rate limited' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'x-ratelimit-reset': '4',
				},
			}),
		);
		globalThis.fetch = fetchMock;
		try {
			const rejection = await actualHttp
				.request(
					{
						BASE: PIPEDRIVE_API_BASE,
						VERSION: '2.0.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
					},
					{
						method: 'GET',
						url: '/deals',
						query: {},
					},
					{ rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG },
				)
				.catch(
					// `unknown` because a Promise rejection may contain any JavaScript value.
					(error: unknown) => error,
				);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(rejection).toBeInstanceOf(ApiError);
			if (!(rejection instanceof ApiError))
				throw new Error('Expected ApiError');
			expect(rejection.retryAfter).toBe(4000);
		} finally {
			globalThis.fetch = originalFetch;
		}
	});
});
