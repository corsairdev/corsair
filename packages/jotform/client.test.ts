import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	JOTFORM_API_BASE,
	JOTFORM_EU_API_BASE,
	JOTFORM_HIPAA_API_BASE,
	JOTFORM_RATE_LIMIT_CONFIG,
	makeJotformRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function makeApiError(
	status: number,
	message: string,
	retryAfter?: number,
	body: unknown = {},
) {
	return new ApiError(
		{
			method: 'GET',
			url: '/user?apiKey=secret-key',
			body: { password: 'secret-password' },
		},
		{
			url: 'https://api.jotform.com/user?apiKey=secret-key',
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
	mockedRequest.mockReset();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('makeJotformRequest', () => {
	it('sends APIKEY header and does not set TOKEN in config', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: {},
		});

		await makeJotformRequest('/user', 'test-api-key', {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = mockedRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: JOTFORM_API_BASE,
			TIMEOUT: 30_000,
			HEADERS: {
				APIKEY: 'test-api-key',
				'Content-Type': 'application/json; charset=utf-8',
			},
		});
		expect(config).not.toHaveProperty('TOKEN');
		expect(requestOptions).toMatchObject({
			method: 'GET',
			url: '/user',
		});
	});

	it('supports EU and HIPAA base URLs', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: {},
		});

		await makeJotformRequest('/user', 'test-api-key', {
			method: 'GET',
			baseUrl: JOTFORM_EU_API_BASE,
		});

		expect(mockedRequest.mock.calls[0]?.[0]?.BASE).toBe(JOTFORM_EU_API_BASE);

		await makeJotformRequest('/user', 'test-api-key', {
			method: 'GET',
			baseUrl: JOTFORM_HIPAA_API_BASE,
		});

		expect(mockedRequest.mock.calls[1]?.[0]?.BASE).toBe(JOTFORM_HIPAA_API_BASE);
	});

	it('makes unauthenticated requests without APIKEY header', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: {},
		});

		await makeJotformRequest('/system/plan/FREE', undefined, {
			method: 'GET',
		});

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		const [config] = mockedRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).not.toHaveProperty('APIKEY');
	});

	it('throws AuthMissingError for an explicitly empty key without sending a request', async () => {
		await expect(
			makeJotformRequest('/user', '', { method: 'GET' }),
		).rejects.toThrow(AuthMissingError);

		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('redacts sensitive fields from ApiError', async () => {
		const rawError = makeApiError(400, 'Bad Request', undefined, {
			error: 'Invalid request',
			apiKey: 'sensitive-api-token',
			password: 'sensitive-password',
			secret: 'hidden-secret',
		});
		mockedRequest.mockRejectedValue(rawError);

		// unknown because a rejection value has no static type; assertions narrow it.
		const error = await makeJotformRequest('/user', 'test-key').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected ApiError');
		}

		expect(error.request.body).toBeUndefined();
		expect(error.request.url).toBe('/user');
		expect(error.url).toBe('https://api.jotform.com/user');
		const body = error.body as Record<string, unknown>;
		expect(body.apiKey).toBe('[REDACTED]');
		expect(body.password).toBe('[REDACTED]');
		expect(body.secret).toBe('[REDACTED]');
		expect(body.error).toBe('Invalid request');
	});

	it('passes rateLimitConfig with maxRetries 0 to transport', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: {},
		});

		await makeJotformRequest('/user', 'test-api-key');

		const [, , options] = mockedRequest.mock.calls[0] ?? [];
		expect(options?.rateLimitConfig).toEqual(JOTFORM_RATE_LIMIT_CONFIG);
		expect(JOTFORM_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
		expect(JOTFORM_RATE_LIMIT_CONFIG.enabled).toBe(true);
	});

	it('preserves Retry-After on ApiError from real transport', async () => {
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		mockedRequest.mockImplementation((config, options, requestOptions) =>
			actualRequest(config, options, requestOptions),
		);

		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ responseCode: 429, message: 'Too Many Requests' }),
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '4',
					},
				},
			),
		);

		// unknown because a rejection value has no static type; assertions narrow it.
		const error = await makeJotformRequest('/user', 'test-key').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) {
			throw new Error('Expected ApiError from transport');
		}

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error.retryAfter).toBe(4000);
		expect(error.isRateLimitError()).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 3, headersRetryAfterMs: 4000 });
	});
});
