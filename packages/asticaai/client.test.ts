import { ApiError, request } from 'corsair/http';
import {
	ASTICA_RATE_LIMIT_CONFIG,
	AsticaAiAPIError,
	bodyReportsRateLimit,
	makeAsticaAiRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const KEY = 'astica-secret-key-abc123';

beforeEach(() => mockRequest.mockReset());

function buildApiError(
	status: number,
	statusText: string,
	retryAfter?: number,
) {
	return new ApiError(
		{
			method: 'POST',
			url: '/describe',
			// The key lives in the body, which is what makes this leak-prone.
			body: { input: 'https://example.com/a.jpg', tkn: KEY },
		},
		{
			url: 'https://vision.astica.ai/describe',
			ok: false,
			status,
			statusText,
			body: {},
		},
		`${statusText}: request failed`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

async function captureError(promise: Promise<unknown>) {
	try {
		await promise;
	} catch (error) {
		return error as AsticaAiAPIError & { cause?: unknown };
	}
	// Outside the try, so this sentinel cannot be swallowed by the catch above.
	throw new Error('expected the request to reject');
}

describe('makeAsticaAiRequest', () => {
	it('sends the api key in the body as tkn', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });

		await makeAsticaAiRequest('/describe', KEY, { body: { input: 'x' } });

		const [, options] = mockRequest.mock.calls[0] ?? [];
		expect(options?.body).toEqual({ input: 'x', tkn: KEY });
	});

	it('carries status and retryAfter across the wrap', async () => {
		mockRequest.mockRejectedValueOnce(
			buildApiError(429, 'Too Many Requests', 9000),
		);

		const error = await captureError(makeAsticaAiRequest('/describe', KEY));

		expect(error).toBeInstanceOf(AsticaAiAPIError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(9000);
	});

	// One retry loop only. The transport already backs off on 429, so a second
	// loop here would multiply one operation into transport x local attempts.
	it('issues exactly one transport call and delegates retries to it', async () => {
		mockRequest.mockResolvedValueOnce({ status: 'success' });

		await makeAsticaAiRequest('/describe', KEY);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [, , requestOptions] = mockRequest.mock.calls[0] ?? [];
		expect(requestOptions?.rateLimitConfig).toBe(ASTICA_RATE_LIMIT_CONFIG);
	});

	// The core redactor scrubs the URL and query only, so an ApiError kept as
	// `cause` would carry the key in request.body.tkn.
	it('does not expose the api key anywhere on the thrown error', async () => {
		mockRequest.mockRejectedValueOnce(buildApiError(401, 'Unauthorized'));

		const error = await captureError(makeAsticaAiRequest('/describe', KEY));

		const serialised = JSON.stringify({
			message: error.message,
			status: error.status,
			statusText: error.statusText,
			retryAfter: error.retryAfter,
			cause: error.cause,
		});
		expect(serialised).not.toContain(KEY);
		expect(error.cause).toBeUndefined();
	});

	it('redacts the key if the provider echoes it back in the message', async () => {
		mockRequest.mockRejectedValueOnce(new Error(`bad token ${KEY} supplied`));

		const error = await captureError(makeAsticaAiRequest('/describe', KEY));

		expect(error.message).not.toContain(KEY);
		expect(error.message).toContain('[REDACTED]');
	});

	it('wraps a non-Error rejection', async () => {
		mockRequest.mockRejectedValueOnce('boom');

		await expect(makeAsticaAiRequest('/describe', KEY)).rejects.toThrow(
			'Unknown Astica AI API error',
		);
	});

	it('does not retry a 401', async () => {
		mockRequest.mockRejectedValueOnce(buildApiError(401, 'Unauthorized'));

		await captureError(makeAsticaAiRequest('/describe', KEY));

		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('errorHandlers', () => {
	it('matches a 429 carried across the wrap and forwards the delay', async () => {
		mockRequest.mockRejectedValueOnce(
			buildApiError(429, 'Too Many Requests', 9000),
		);
		const error = await captureError(makeAsticaAiRequest('/describe', KEY));

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 9000 });
	});

	it('matches a 401 carried across the wrap', async () => {
		mockRequest.mockRejectedValueOnce(buildApiError(401, 'Unauthorized'));
		const error = await captureError(makeAsticaAiRequest('/describe', KEY));

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	// Astica reports a bad key as HTTP 200 with status:'error', so the handler
	// only ever sees the message. Both hosts return exactly this string.
	it('classifies the live invalid-key message as an auth failure', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('invalid api token'))).toBe(
			true,
		);
		expect(
			errorHandlers.AUTH_ERROR.match(new Error('Invalid API key provided')),
		).toBe(true);
	});

	it('does not classify a rate limit as an auth failure', () => {
		const rateLimited = new Error('rate_limited: too many requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(rateLimited)).toBe(false);
	});

	it('treats 5xx as a server error without retrying', async () => {
		mockRequest.mockRejectedValueOnce(
			buildApiError(503, 'Service Unavailable'),
		);
		const error = await captureError(makeAsticaAiRequest('/describe', KEY));

		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('rate-limit matcher', () => {
	const matches = (status: number, body: unknown) =>
		ASTICA_RATE_LIMIT_CONFIG.isRateLimitError?.(status, body) ?? false;

	it('keeps the transport default of retrying a 429', () => {
		expect(matches(429, {})).toBe(true);
	});

	// The transport's built-in matcher only sees the status code, so without
	// this a body-reported rate limit would never be retried.
	it('retries a rate limit reported in an HTTP 200 body', () => {
		expect(
			matches(200, { status: 'error', error: 'rate limit exceeded' }),
		).toBe(true);
		expect(matches(200, { status: 'error', error: 'Too Many Requests' })).toBe(
			true,
		);
	});

	it('does not retry other body errors', () => {
		expect(matches(200, { status: 'error', error: 'invalid api token' })).toBe(
			false,
		);
		expect(matches(200, { status: 'success', text: 'hello' })).toBe(false);
		expect(matches(200, null)).toBe(false);
		expect(matches(401, {})).toBe(false);
	});

	it('ignores a rate-limit phrase on a successful body', () => {
		expect(
			bodyReportsRateLimit({ status: 'success', text: 'rate limit explained' }),
		).toBe(false);
	});
});
