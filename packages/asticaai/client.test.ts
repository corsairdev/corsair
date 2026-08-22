import { ApiError, request } from 'corsair/http';
import { AsticaAiAPIError, makeAsticaAiRequest } from './client';
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
	// only ever sees the message.
	it('classifies an in-body auth failure by message', () => {
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
