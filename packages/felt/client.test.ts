import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FELT_API_BASE,
	FeltAPIError,
	makeFeltRequest,
	redactSensitiveData,
	sanitizeErrorMessage,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	// `unknown` because Jest actual module loader returns untyped module exports.
	const actual = jest.requireActual('corsair/http') as Record<string, unknown>;
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function buildApiError(
	status: number,
	message: string,
	retryAfter?: number,
	// `unknown` because test error bodies simulate arbitrary provider JSON payloads.
	body: unknown = {},
) {
	return new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://felt.com/api/v2/user',
			ok: false,
			status,
			statusText: message,
			body,
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeFeltRequest client', () => {
	it('sends Authorization: Bearer <key> with standard base URL', async () => {
		mockRequest.mockResolvedValue({ id: 'u_1', name: 'Test User' });

		await makeFeltRequest('/user', 'test-felt-token', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: FELT_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-felt-token',
				'Content-Type': 'application/json',
			},
		});
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/user',
			}),
		);
	});

	it('makes keyless request without Authorization header when apiKey is undefined', async () => {
		mockRequest.mockResolvedValue({ status: 'ok' });

		await makeFeltRequest('/public-check', undefined, {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).not.toHaveProperty(
			'Authorization',
		);
	});

	it('throws AuthMissingError when key is explicitly empty string without sending request', async () => {
		// `unknown` because rejection assertions need an untyped target.
		const err = await makeFeltRequest('/user', '', { method: 'GET' }).catch(
			// `unknown` because caught errors in promise rejections have no static type.
			(caught: unknown) => caught,
		);

		expect(err).toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('redacts sensitive fields from credentials and error bodies', () => {
		const sensitivePayload = {
			name: 'My Source',
			password: 'super-secret-password',
			nested: {
				apiKey: 'sk-12345',
				token: 'tok-abcde',
				safeField: 'visible-data',
			},
			arrayData: [{ secret_key: 'top-secret' }, { label: 'normal' }],
		};

		// `unknown` because redactSensitiveData accepts and returns untyped JSON data.
		const redacted = redactSensitiveData(sensitivePayload) as Record<
			string,
			// `unknown` because redacted record fields hold arbitrary JSON values.
			unknown
		>;

		expect(redacted.password).toBe('[REDACTED]');
		const nested = redacted.nested as Record<string, unknown>;
		expect(nested.apiKey).toBe('[REDACTED]');
		expect(nested.token).toBe('[REDACTED]');
		expect(nested.safeField).toBe('visible-data');

		const arrayData = redacted.arrayData as Array<Record<string, unknown>>;
		expect(arrayData[0]?.secret_key).toBe('[REDACTED]');
		expect(arrayData[1]?.label).toBe('normal');
	});

	it('passes core ApiError through with credential fields redacted and the sent body dropped', async () => {
		const rawError = new ApiError(
			{
				method: 'POST',
				url: '/sources/1/credentials',
				body: { password: 'submitted-secret-password', username: 'felt_user' },
			},
			{
				url: 'https://felt.com/api/v2/sources/1/credentials',
				ok: false,
				status: 422,
				statusText: 'Unprocessable Entity',
				body: {
					errors: [
						{
							detail: 'Wrong secret for password',
							source: { parameter: 'password' },
							password: 'plain-password-leak',
						},
					],
				},
			},
			'Unprocessable Entity: password=submitted-secret-password',
		);
		mockRequest.mockRejectedValue(rawError);

		// `unknown` because rejection catch returns an untyped error object.
		const caught = await makeFeltRequest('/sources/1/credentials', 'my-token', {
			method: 'POST',
			body: { password: 'submitted-secret-password' },
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		const feltErr = caught as ApiError;
		expect(feltErr.status).toBe(422);
		expect(feltErr.message).toBe('Unprocessable Entity: password=[REDACTED]');
		expect(feltErr.request.body).toBeUndefined();
		expect(JSON.stringify(feltErr)).not.toContain('submitted-secret-password');
		expect(JSON.stringify(feltErr)).not.toContain('felt_user');
		// Verify password in error body was redacted
		const body = feltErr.body as { errors: Array<Record<string, unknown>> };
		expect(body.errors[0]?.password).toBe('[REDACTED]');
		// Verify unredacted cause is not preserved (preventing leak of raw request body passwords)
		expect(feltErr.cause).toBeUndefined();

		// Test message sanitization
		expect(
			sanitizeErrorMessage(
				'Failed with password=plain-pass and Bearer secret123',
				'secret123',
			),
		).toBe('Failed with password=[REDACTED] and Bearer [REDACTED]');
	});

	it('redacts password from message, statusText, and body when sources.createCredential fails with 422', async () => {
		const secretPassword = 'my-super-secret-password';
		const rawError = new ApiError(
			{
				method: 'POST',
				url: '/sources/src_123/credentials',
				body: { credential: { password: secretPassword } },
			},
			{
				url: 'https://felt.com/api/v2/sources/src_123/credentials',
				ok: false,
				status: 422,
				statusText: `Unprocessable Entity: password ${secretPassword} invalid`,
				body: {
					message: `Failed to authenticate using password ${secretPassword}`,
					errors: [
						{
							detail: `Invalid credentials with password '${secretPassword}'`,
							source: { parameter: 'credential.password' },
							password: secretPassword,
						},
					],
				},
			},
			`422 Unprocessable Entity: Failed to verify credential password ${secretPassword}`,
		);
		mockRequest.mockRejectedValue(rawError);

		const caught = await makeFeltRequest(
			'/sources/src_123/credentials',
			'felt_token_abc',
			{
				method: 'POST',
				body: { credential: { password: secretPassword } },
			},
		).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		const feltErr = caught as ApiError;
		expect(feltErr.status).toBe(422);
		expect(JSON.stringify(feltErr)).not.toContain(secretPassword);
		expect(feltErr.message).not.toContain(secretPassword);
		expect(feltErr.message).toContain('[REDACTED]');
		expect(feltErr.statusText).not.toContain(secretPassword);
		expect(feltErr.statusText).toContain('[REDACTED]');

		const body = feltErr.body as {
			message: string;
			errors: Array<{ detail: string; password: string }>;
		};
		expect(body.message).not.toContain(secretPassword);
		expect(body.message).toContain('[REDACTED]');
		expect(body.errors[0]?.detail).not.toContain(secretPassword);
		expect(body.errors[0]?.detail).toContain('[REDACTED]');
		expect(body.errors[0]?.password).toBe('[REDACTED]');

		// Verify cause is not exposing raw request body
		expect(
			(feltErr as unknown as { cause?: { request?: { body?: unknown } } })
				.cause,
		).toBeUndefined();
	});

	it('keeps the credential type readable in a 422 while the token stays redacted', async () => {
		// Live run 11-13: Felt answered "custom_headers is not allowed on feature_server" and the
		// type name came back as [REDACTED], which hid the reason for the error.
		const token = 'snowflake-token-value-123';
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'POST', url: '/sources/s_1/credentials' },
				{
					url: 'https://felt.com/api/v2/sources/s_1/credentials',
					ok: false,
					status: 422,
					statusText: 'Unprocessable Entity',
					body: {
						errors: [
							{
								detail: `snowflake_pat is not allowed on feature_server (${token})`,
							},
						],
					},
				},
				'Unprocessable Entity',
			),
		);
		const caught = (await makeFeltRequest(
			'/sources/s_1/credentials',
			'felt_pat_test',
			{
				method: 'POST',
				body: {
					name: 'n',
					use_case: 'source_authentication',
					credential: { type: 'snowflake_pat', token },
				},
			},
		).catch((err: unknown) => err)) as ApiError;
		const detail = (caught.body as { errors: Array<{ detail: string }> })
			.errors[0]?.detail;
		expect(detail).toContain('snowflake_pat is not allowed on feature_server');
		expect(detail).not.toContain(token);
	});

	it('ensures FeltAPIError constructor sanitizes cause if passed explicitly', () => {
		const secretPassword = 'my-super-secret-password';
		const rawApiError = new ApiError(
			{
				method: 'POST',
				url: '/sources/src_123/credentials',
				body: { credential: { password: secretPassword } },
			},
			{
				url: 'https://felt.com/api/v2/sources/src_123/credentials',
				ok: false,
				status: 422,
				statusText: 'Unprocessable',
				body: { password: secretPassword },
			},
			`Error with ${secretPassword}`,
		);

		const error = new FeltAPIError('Safe message', '422', {
			cause: rawApiError,
		});

		const cause = (
			error as unknown as {
				cause?: { request?: { body?: { credential?: unknown } } };
			}
		).cause;
		expect(cause).toBeDefined();
		expect(JSON.stringify(cause)).not.toContain(secretPassword);
		expect(cause?.request?.body?.credential).toBe('[REDACTED]');
		const causeError = (error as Error).cause as Error;
		expect(causeError.message).not.toContain(secretPassword);
		expect(causeError.stack ?? '').not.toContain(secretPassword);
	});

	it('preserves retryAfter on 429 rate limit error', async () => {
		const rateLimited = buildApiError(429, 'Too Many Requests', 4000);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because promise rejection catch yields an untyped error.
		const caught = await makeFeltRequest('/maps', 'token', {
			method: 'GET',
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		const err = caught as ApiError;
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(4000);
		expect(err.isRateLimitError()).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
	});

	it('parses real transport retry-after headers using actual corsair/http request', async () => {
		// `unknown` because jest.requireActual dynamically loads module exports without static types.
		const actualHttp = jest.requireActual('corsair/http') as {
			// `unknown` because actual transport request is an untyped helper in mock tests.
			request: (config: unknown, options: unknown) => Promise<unknown>;
		};

		const originalFetch = global.fetch;
		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			headers: new Headers({ 'retry-after': '4' }),
			json: async () => ({
				errors: [{ code: 'too_many_requests', detail: 'Rate limit exceeded' }],
			}),
			text: async () => 'Rate limit exceeded',
		});
		// `unknown` because replacing global fetch in Jest requires assigning an untyped mock.
		global.fetch = mockFetch as unknown as typeof fetch;

		try {
			// `unknown` because real transport call rejection is untyped.
			const error = await actualHttp
				.request(
					{
						BASE: FELT_API_BASE,
						VERSION: '2.0',
						WITH_CREDENTIALS: false,
						CREDENTIALS: 'omit',
						HEADERS: { 'Content-Type': 'application/json' },
					},
					{
						method: 'GET',
						url: '/user',
					},
				)
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			const apiErr = error as ApiError;
			expect(apiErr.status).toBe(429);
			expect(apiErr.retryAfter).toBe(4000);
			// Transport owns 429 retries: default transport rate-limit retries 3 times (4 total attempts)
			expect(mockFetch).toHaveBeenCalledTimes(4);
		} finally {
			global.fetch = originalFetch;
		}
	});
});

describe('makeFeltRequest paths and timeouts', () => {
	it('rejects a path with a dot segment before sending', async () => {
		await expect(
			makeFeltRequest('/maps/m_1/layers/..', 'token', { method: 'DELETE' }),
		).rejects.toThrow(/dot segment/);
		await expect(
			makeFeltRequest('/maps/m_1/layers/.', 'token', { method: 'DELETE' }),
		).rejects.toThrow(/dot segment/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('passes a per-request timeout to the transport and keeps the default otherwise', async () => {
		mockRequest.mockResolvedValue({});
		await makeFeltRequest('/maps/m_1/image_exports', 'token', {
			method: 'POST',
			timeoutMs: 70_000,
		});
		await makeFeltRequest('/maps/m_1', 'token');
		expect(mockRequest.mock.calls[0]?.[0].TIMEOUT).toBe(70_000);
		expect(mockRequest.mock.calls[1]?.[0].TIMEOUT).toBeUndefined();
	});
});
