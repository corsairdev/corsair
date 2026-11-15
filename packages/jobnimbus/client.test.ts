import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	JOBNIMBUS_API_BASE,
	JOBNIMBUS_NO_TRANSPORT_RETRIES,
	compactQuery,
	makeJobNimbusRequest,
	redactCredentialFields,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/contacts' },
		{
			url: 'https://app.jobnimbus.com/api1/contacts',
			ok: false,
			status,
			statusText: message,
			body: { message, status },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
	jest.restoreAllMocks();
});

describe('JobNimbus HTTP client', () => {
	it('uses the API v1 base URL and Authorization: Bearer header', async () => {
		mockedRequest.mockResolvedValue({ count: 0, results: [] });

		await makeJobNimbusRequest('/contacts', 'test-api-token', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: JOBNIMBUS_API_BASE,
			VERSION: '1.0.0',
			HEADERS: {
				Authorization: 'Bearer test-api-token',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/contacts' }),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: JOBNIMBUS_NO_TRANSPORT_RETRIES,
		});
	});

	it('preserves Authorization if Bearer prefix is already present', async () => {
		mockedRequest.mockResolvedValue({});

		await makeJobNimbusRequest('/contacts', 'Bearer already-has-prefix', {
			method: 'GET',
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.HEADERS?.Authorization).toBe(
			'Bearer already-has-prefix',
		);
	});

	it('supports custom baseUrl and full URLs', async () => {
		mockedRequest.mockResolvedValue({});

		await makeJobNimbusRequest('https://api.jobnimbus.com/files/v1/uploads/url', 'test-key', {
			method: 'POST',
			body: { filename: 'a.txt' },
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe('https://api.jobnimbus.com');
		expect(mockedRequest.mock.calls[0]?.[1]?.url).toBe('/files/v1/uploads/url');
	});

	it('throws AuthMissingError when key is empty without calling transport', async () => {
		await expect(makeJobNimbusRequest('/contacts', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('compactQuery removes undefined query entries', () => {
		expect(
			compactQuery({
				size: 10,
				from: 0,
				sort: undefined,
				actor: 'sam@company.com',
			}),
		).toEqual({
			size: 10,
			from: 0,
			actor: 'sam@company.com',
		});
	});

	it('redacts credential fields from request bodies', () => {
		const raw = {
			name: 'Test',
			api_key: 'supersecret',
			password: 'pass',
			nested: {
				token: 'tok123',
				normal: 'hello',
			},
		};
		const redacted = redactCredentialFields(raw);
		expect(redacted.changed).toBe(true);
		expect(redacted.value).toEqual({
			name: 'Test',
			api_key: '[REDACTED]',
			password: '[REDACTED]',
			nested: {
				token: '[REDACTED]',
				normal: 'hello',
			},
		});
	});

	it('re-throws sanitized ApiError when request body contains secrets', async () => {
		const sensitiveBody = {
			name: 'Job',
			token: 'secret-token-value',
		};
		const errorWithSecrets = new ApiError(
			{ method: 'POST', url: '/jobs', body: sensitiveBody },
			{
				url: 'https://app.jobnimbus.com/api1/jobs',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { message: 'Invalid payload' },
			},
			'Bad Request',
		);

		mockedRequest.mockRejectedValue(errorWithSecrets);

		// `unknown` because a rejection value has no static type; the assertion narrows it.
		const caught: unknown = await makeJobNimbusRequest('/jobs', 'test-key', {
			method: 'POST',
			body: sensitiveBody,
		}).catch((err: unknown) => err);

		expect(caught).toBeInstanceOf(ApiError);
		if (caught instanceof ApiError) {
			expect(caught.request.body).toEqual({
				name: 'Job',
				token: '[REDACTED]',
			});
		}
	});

	it('keeps Retry-After on the ApiError from the real transport', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		mockedRequest.mockImplementation((config, options, requestOptions) =>
			actualRequest(config, options, requestOptions),
		);
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'Too Many Requests' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '3',
				},
			}),
		);

		// `unknown` because a rejection value has no static type; the assertion narrows it.
		const error: unknown = await makeJobNimbusRequest('/contacts', 'test-key').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected ApiError');
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);

		// Handler matches and forwards retry-after in ms
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 3000 });
	});
});
