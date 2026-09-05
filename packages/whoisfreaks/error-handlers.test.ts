import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/v2.0/whois/live' },
		{
			url: 'https://api.whoisfreaks.com/v2.0/whois/live',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

type HandlerContext = {
	pluginId: string;
	operation: string;
	input: Record<string, unknown>;
	originalError: Error;
};

function handlerContext(error: Error): HandlerContext {
	return {
		pluginId: 'whoisfreaks',
		operation: 'whoisLive.lookupV2',
		input: { domainName: 'example.com' },
		originalError: error,
	};
}

type AnyHandler = (
	error: Error,
	context: HandlerContext,
) => Promise<Record<string, unknown>>;

function runHandler(
	handler: unknown,
	error: Error,
): Promise<Record<string, unknown>> {
	return (handler as AnyHandler)(error, handlerContext(error));
}

describe('whoisfreaks errorHandlers', () => {
	it('classifies a 429 ApiError as RATE_LIMIT_ERROR', () => {
		const error = apiError(429, 'Please slow down.');
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('retries 429s and forwards the server Retry-After delay', async () => {
		const error = apiError(429, 'Please slow down.', 41822);
		const result = await runHandler(
			errorHandlers.RATE_LIMIT_ERROR.handler,
			error,
		);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 41822 });
	});

	it('retries 429s without a Retry-After delay when absent', async () => {
		const error = apiError(429, 'Please slow down.');
		const result = await runHandler(
			errorHandlers.RATE_LIMIT_ERROR.handler,
			error,
		);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
	});

	it('treats a raw 429 message as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(new Error('Request failed with 429'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('classifies a 401 ApiError as AUTH_ERROR', () => {
		const error = apiError(401, 'Provided API key is invalid.');
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies an inactive-key message as AUTH_ERROR', () => {
		const error = apiError(401, 'Provided API key is inactive.');
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('does not retry auth errors', async () => {
		const error = apiError(401, 'Provided API key is invalid.');
		const result = await runHandler(errorHandlers.AUTH_ERROR.handler, error);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('classifies a 404 ApiError as NOT_FOUND_ERROR', () => {
		const error = apiError(404, 'Record not found.');
		expect(matchedHandlerName(error)).toBe('NOT_FOUND_ERROR');
	});

	it('classifies a missing-record message as NOT_FOUND_ERROR', () => {
		expect(
			matchedHandlerName(new Error('No Record Found across domainName')),
		).toBe('NOT_FOUND_ERROR');
	});

	it('does not retry not-found errors', async () => {
		const error = apiError(404, 'Record not found.');
		const result = await runHandler(
			errorHandlers.NOT_FOUND_ERROR.handler,
			error,
		);
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('falls through to DEFAULT for anything else', async () => {
		const error = apiError(500, 'Internal Server error occurred.');
		expect(matchedHandlerName(error)).toBe('DEFAULT');
		const result = await runHandler(errorHandlers.DEFAULT.handler, error);
		expect(result).toEqual({ maxRetries: 0 });
	});
});
