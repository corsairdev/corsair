import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FELT_API_BASE,
	FeltAPIError,
	makeFeltRequest,
	redactSensitiveData,
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

	it('sanitizes ApiError by wrapping in FeltAPIError and redacting credential fields', async () => {
		const rawError = buildApiError(422, 'Invalid credentials', undefined, {
			errors: [
				{
					detail: 'Wrong secret',
					source: { parameter: 'password' },
					password: 'plain-password-leak',
				},
			],
		});
		mockRequest.mockRejectedValue(rawError);

		// `unknown` because rejection catch returns an untyped error object.
		const caught = await makeFeltRequest('/sources', 'my-token', {
			method: 'POST',
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FeltAPIError);
		const feltErr = caught as FeltAPIError;
		expect(feltErr.status).toBe(422);
		expect(feltErr.message).toBe('Invalid credentials');
		// Verify password in error body was redacted
		const body = feltErr.body as { errors: Array<Record<string, unknown>> };
		expect(body.errors[0]?.password).toBe('[REDACTED]');
	});

	it('preserves retryAfter on 429 rate limit error', async () => {
		const rateLimited = buildApiError(429, 'Too Many Requests', 4000);
		mockRequest.mockRejectedValue(rateLimited);

		// `unknown` because promise rejection catch yields an untyped error.
		const caught = await makeFeltRequest('/maps', 'token', {
			method: 'GET',
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(FeltAPIError);
		const err = caught as FeltAPIError;
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(4000);
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
