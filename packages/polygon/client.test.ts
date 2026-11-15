import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import * as client from './client';
import {
	describePolygonError,
	makePolygonRequest,
	mintPolygonToken,
	POLYGON_HOSTS,
	PolygonAPIError,
	readErrorCode,
	readErrorNumber,
	resetPolygonTokenCache,
	resolvePolygonToken,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const CREDENTIALS = { apiKey: 'sk_sdbx_key', apiSecret: 'secret-value' };

/** An ApiError carrying the OMS error envelope. */
function apiError(
	status: number,
	body: Record<string, unknown>, // unknown: OMS's error body, read by key.
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: '/networks' },
		{
			url: `${POLYGON_HOSTS.live}/networks`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		String(body.msg ?? 'error'),
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
	resetPolygonTokenCache();
});

describe('OMS error body', () => {
	it('reads the stable error name and keeps the message free of the secret', () => {
		const body = {
			error: 'InvalidCredentials',
			code: 1003,
			msg: 'invalid credentials',
			status: 401,
		};

		expect(readErrorCode(body)).toBe('InvalidCredentials');
		expect(describePolygonError(401, body, 'fallback')).toBe(
			'Polygon 401 InvalidCredentials: invalid credentials',
		);
	});

	it('falls back to the supplied text when the body is not OMS shaped', () => {
		expect(
			describePolygonError(502, '<html>bad gateway</html>', 'Bad Gateway'),
		).toBe('Polygon 502: Bad Gateway');
	});
});

describe('mintPolygonToken', () => {
	it('posts the key and secret to /auth/token on the chosen host', async () => {
		mockRequest.mockResolvedValue({
			accessToken: 'jwt-value',
			tokenType: 'bearer',
			expiresIn: 3600,
			expiresAt: '2026-01-01T00:00:00Z',
			projectId: 'prj_1',
			projectMode: 'sandbox',
		});

		const token = await mintPolygonToken('sandbox', CREDENTIALS);

		expect(token.accessToken).toBe('jwt-value');
		// The response's own lifetime is what the cache honours.
		expect(token.expiresInSeconds).toBe(3600);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({ BASE: POLYGON_HOSTS.sandbox });
		expect(options).toMatchObject({
			method: 'POST',
			url: '/auth/token',
			body: { apiKey: 'sk_sdbx_key', apiSecret: 'secret-value' },
			mediaType: 'application/json',
		});
	});

	it('passes InvalidCredentials through as a core ApiError without the secret', async () => {
		mockRequest.mockRejectedValue(
			apiError(401, {
				error: 'InvalidCredentials',
				code: 1003,
				msg: 'invalid credentials',
				status: 401,
			}),
		);

		const error = await captureError(mintPolygonToken('live', CREDENTIALS));

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(401);
		// OMS's stable code is read from the body the error carries.
		expect(readErrorCode(error.body)).toBe('InvalidCredentials');
		expect(readErrorNumber(error.body)).toBe(1003);
		// The secret never reaches an error, since it rides in the POST body.
		expect(JSON.stringify(error)).not.toContain('secret-value');
		expect(String(error.stack)).not.toContain('secret-value');
	});

	it('refuses a 200 that carries no access token rather than caching undefined', async () => {
		mockRequest.mockResolvedValue({ tokenType: 'bearer' });

		await expect(mintPolygonToken('live', CREDENTIALS)).rejects.toThrow(
			/did not return an access token/,
		);
	});
});

describe('resolvePolygonToken', () => {
	it('mints one token and reuses it across calls', async () => {
		mockRequest.mockResolvedValue({
			accessToken: 'cached-jwt',
			expiresIn: 3600,
		});

		const first = await resolvePolygonToken('live', CREDENTIALS);
		const second = await resolvePolygonToken('live', CREDENTIALS);

		expect(first).toBe('cached-jwt');
		expect(second).toBe('cached-jwt');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('mints a separate token per host, so sandbox and live never mix', async () => {
		mockRequest
			.mockResolvedValueOnce({ accessToken: 'sandbox-jwt' })
			.mockResolvedValueOnce({ accessToken: 'live-jwt' });

		await expect(resolvePolygonToken('sandbox', CREDENTIALS)).resolves.toBe(
			'sandbox-jwt',
		);
		await expect(resolvePolygonToken('live', CREDENTIALS)).resolves.toBe(
			'live-jwt',
		);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('mints a separate token per secret, so a wrong secret cannot reuse one', async () => {
		mockRequest
			.mockResolvedValueOnce({ accessToken: 'real-jwt' })
			.mockResolvedValueOnce({ accessToken: 'other-jwt' });

		await expect(resolvePolygonToken('live', CREDENTIALS)).resolves.toBe(
			'real-jwt',
		);
		// Same key, different secret: this must authenticate on its own rather than
		// inherit the token the first pair was granted.
		await expect(
			resolvePolygonToken('live', {
				apiKey: CREDENTIALS.apiKey,
				apiSecret: 'a-different-secret',
			}),
		).resolves.toBe('other-jwt');
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('keeps the secret out of the cache key and checks it on lookup', async () => {
		const key = client.tokenCacheKey('live', CREDENTIALS);
		expect(key).not.toContain(CREDENTIALS.apiSecret);

		mockRequest
			.mockResolvedValueOnce({ accessToken: 'real-jwt' })
			.mockResolvedValueOnce({ accessToken: 'other-jwt' })
			.mockResolvedValueOnce({ accessToken: 'real-again-jwt' });
		await resolvePolygonToken('live', CREDENTIALS);
		await resolvePolygonToken('live', {
			apiKey: CREDENTIALS.apiKey,
			apiSecret: 'a-different-secret',
		});
		// The slot now holds the other secret's token, so the first pair mints again
		// instead of receiving a token it did not authenticate for.
		await expect(resolvePolygonToken('live', CREDENTIALS)).resolves.toBe(
			'real-again-jwt',
		);
		expect(mockRequest).toHaveBeenCalledTimes(3);
	});

	it('does not share an in-flight mint with a different secret', async () => {
		mockRequest
			.mockResolvedValueOnce({ accessToken: 'real-jwt' })
			.mockResolvedValueOnce({ accessToken: 'other-jwt' });

		const tokens = await Promise.all([
			resolvePolygonToken('live', CREDENTIALS),
			resolvePolygonToken('live', {
				apiKey: CREDENTIALS.apiKey,
				apiSecret: 'a-different-secret',
			}),
		]);

		expect(tokens).toEqual(['real-jwt', 'other-jwt']);
	});

	it('deduplicates concurrent mints into one request', async () => {
		mockRequest.mockResolvedValue({ accessToken: 'single-jwt' });

		const tokens = await Promise.all([
			resolvePolygonToken('live', CREDENTIALS),
			resolvePolygonToken('live', CREDENTIALS),
			resolvePolygonToken('live', CREDENTIALS),
		]);

		expect(tokens).toEqual(['single-jwt', 'single-jwt', 'single-jwt']);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('honours a short expiresIn from the response instead of assuming 60 minutes', async () => {
		jest.useFakeTimers();
		try {
			// One second of life, so the refresh margin alone makes it stale.
			mockRequest.mockResolvedValue({ accessToken: 'short-jwt', expiresIn: 1 });

			await resolvePolygonToken('live', CREDENTIALS);
			await jest.advanceTimersByTimeAsync(2000);
			mockRequest.mockResolvedValue({
				accessToken: 'second-jwt',
				expiresIn: 3600,
			});
			const next = await resolvePolygonToken('live', CREDENTIALS);

			// A hardcoded hour would have kept serving `short-jwt` here.
			expect(next).toBe('second-jwt');
			expect(mockRequest).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
		}
	});

	it('throws AuthMissingError without a request when a credential is blank', async () => {
		await expect(
			resolvePolygonToken('live', { apiKey: 'key', apiSecret: '  ' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('makePolygonRequest', () => {
	it('sends the bearer token and no secret', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makePolygonRequest('live', 'jwt-value', {
			method: 'GET',
			path: '/networks',
			query: { limit: 10 },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POLYGON_HOSTS.live,
			HEADERS: {
				Authorization: 'Bearer jwt-value',
				Accept: 'application/json',
			},
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/networks',
			query: { limit: 10 },
		});
	});

	it('sends the Idempotency-Key header only when one is supplied', async () => {
		mockRequest.mockResolvedValue({});

		await makePolygonRequest('live', 'jwt', {
			method: 'POST',
			path: '/customers',
			body: { type: 'individual' },
			idempotencyKey: 'attempt-1',
		});
		const withKey = mockRequest.mock.calls[0]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(withKey.HEADERS['Idempotency-Key']).toBe('attempt-1');
		expect(withKey.HEADERS['Content-Type']).toBe('application/json');

		await makePolygonRequest('live', 'jwt', {
			method: 'GET',
			path: '/networks',
		});
		const withoutKey = mockRequest.mock.calls[1]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(withoutKey.HEADERS['Idempotency-Key']).toBeUndefined();
		// A bodyless request must not claim a JSON body it is not sending.
		expect(withoutKey.HEADERS['Content-Type']).toBeUndefined();
	});

	it('keeps status, error code and Retry-After on the core ApiError', async () => {
		mockRequest.mockRejectedValue(
			apiError(
				429,
				{
					error: 'RateLimited',
					code: 1040,
					msg: 'too many requests',
					status: 429,
				},
				2500,
			),
		);

		const error = await captureError(
			makePolygonRequest('live', 'jwt', {
				method: 'GET',
				path: '/transactions',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(429);
		expect(readErrorCode(error.body)).toBe('RateLimited');
		expect(error.retryAfter).toBe(2500);
		expect(error.request.method).toBe('GET');
		expect(JSON.stringify(error)).not.toContain('jwt');
	});

	it('drops the request body from the ApiError, since a customer write carries personal data', async () => {
		// Core builds ApiError from the request it sent, body included.
		mockRequest.mockImplementation((_config, options) => {
			throw new ApiError(
				options,
				{
					url: `${POLYGON_HOSTS.live}/customers`,
					ok: false,
					status: 400,
					statusText: 'Bad Request',
					body: {
						error: 'InvalidArgument',
						code: 2001,
						msg: 'invalid argument',
					},
				},
				'invalid argument',
			);
		});

		const error = await captureError(
			makePolygonRequest('live', 'jwt', {
				method: 'POST',
				path: '/customers',
				body: { firstName: 'Jane', birthDate: '1990-01-01' },
				idempotencyKey: 'idem-1',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(400);
		expect(error.request.method).toBe('POST');
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('1990-01-01');
	});

	it.each([
		['an email filter', '/customers', { email: 'jane@example.com' }, 'jane'],
		[
			'exact coordinates',
			'/cash-locations',
			{ provider: 'moneygram', latitude: 40.712776, longitude: -74.005974 },
			'40.712776',
		],
	])(
		'drops the query string from the ApiError url after a failed request with %s',
		async (_label, path, query, secretPart) => {
			// Core builds the response url from the full query string.
			mockRequest.mockImplementation((_config, options) => {
				const search = new URLSearchParams(
					Object.entries(options.query ?? {}).map(
						([k, v]): [string, string] => [k, String(v)],
					),
				);
				throw new ApiError(
					options,
					{
						url: `${POLYGON_HOSTS.live}${path}?${search}`,
						ok: false,
						status: 500,
						statusText: 'Internal Server Error',
						body: { error: 'Internal', code: 1000, msg: 'internal error' },
					},
					'internal error',
					{ retryAfter: 1000 },
				);
			});

			const error = await captureError(
				makePolygonRequest('live', 'jwt', { method: 'GET', path, query }),
			);

			expect(error).toBeInstanceOf(ApiError);
			if (!(error instanceof ApiError)) return;
			expect(error.status).toBe(500);
			expect(error.retryAfter).toBe(1000);
			expect(error.url).toBe(`${POLYGON_HOSTS.live}${path}`);
			expect(JSON.stringify(error)).not.toContain(secretPart);
			expect(String(error.stack)).not.toContain(secretPart);
		},
	);

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePolygonRequest('live', 'jwt', {
				method: 'POST',
				path: '/transactions',
			}),
		);

		expect(error).toBeInstanceOf(PolygonAPIError);
		if (!(error instanceof PolygonAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
	});
});
