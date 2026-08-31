import { ApiError } from 'corsair/http';
import { KrakenAPIError } from './client';
import { errorHandlers } from './error-handlers';

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

function transportError(status: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: 'url' },
		{
			url: 'https://api.kraken.io/v1/url',
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'boom' },
		},
		'Kraken request failed',
	);
}

describe('errorHandlers', () => {
	it('classifies a 429 ApiError as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(transportError(429))).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a KrakenAPIError(429) as RATE_LIMIT_ERROR', () => {
		const error = new KrakenAPIError('rate limited', undefined, 429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a rate-limit message with no status as RATE_LIMIT_ERROR', () => {
		const error = new KrakenAPIError('Too many requests, slow down');
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies a 401 as AUTH_ERROR', () => {
		expect(matchedHandlerName(transportError(401))).toBe('AUTH_ERROR');
	});

	it('classifies an invalid api_secret message as AUTH_ERROR', () => {
		const error = new KrakenAPIError('Invalid api_secret provided');
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies a quota message as QUOTA_EXCEEDED_ERROR', () => {
		const error = new KrakenAPIError(
			'Insufficient credits remaining in your quota',
		);
		expect(matchedHandlerName(error)).toBe('QUOTA_EXCEEDED_ERROR');
	});

	it('classifies a 400 as BAD_REQUEST_ERROR', () => {
		expect(matchedHandlerName(transportError(400))).toBe('BAD_REQUEST_ERROR');
	});

	it('classifies a 500 as SERVER_ERROR and retries the idempotent read', async () => {
		const error = transportError(500);
		expect(matchedHandlerName(error)).toBe('SERVER_ERROR');
		const result = await errorHandlers.SERVER_ERROR.handler(error, {
			pluginId: 'kraken',
			operation: 'account.checkStatus',
			input: {},
			originalError: error,
		});
		expect(result).toEqual({ maxRetries: 2, headersRetryAfterMs: 1000 });
	});

	it('never retries a 500 on a quota-consuming write, to avoid double-spending quota', async () => {
		const error = transportError(500);
		for (const operation of [
			'image.optimizeUrl',
			'image.preserveMetadata',
			'image.sandboxUpload',
		]) {
			const result = await errorHandlers.SERVER_ERROR.handler(error, {
				pluginId: 'kraken',
				operation,
				input: {},
				originalError: error,
			});
			expect(result).toEqual({ maxRetries: 0 });
		}
	});

	it('retries a 429 on the idempotent read but not on writes', async () => {
		const error = transportError(429);

		const readResult = await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
			pluginId: 'kraken',
			operation: 'account.checkStatus',
			input: {},
			originalError: error,
		});
		expect(readResult).toEqual({ maxRetries: 3, headersRetryAfterMs: 1000 });

		const writeResult = await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
			pluginId: 'kraken',
			operation: 'image.optimizeUrl',
			input: {},
			originalError: error,
		});
		expect(writeResult).toEqual({ maxRetries: 0 });
	});

	it('honors a provider-supplied retryAfter (already ms) on the idempotent read without rescaling it', async () => {
		const error = new KrakenAPIError('rate limited', undefined, 429, 5_000);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error, {
			pluginId: 'kraken',
			operation: 'account.checkStatus',
			input: {},
			originalError: error,
		});

		expect(result).toEqual({ maxRetries: 3, headersRetryAfterMs: 5_000 });
	});

	it('does not retry auth failures', async () => {
		const error = transportError(401);
		const result = await errorHandlers.AUTH_ERROR.handler(error, {
			pluginId: 'kraken',
			operation: 'account.checkStatus',
			input: {},
			originalError: error,
		});
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('falls through to DEFAULT for anything unrecognized', () => {
		const error = new KrakenAPIError('totally unexpected');
		expect(matchedHandlerName(error)).toBe('DEFAULT');
	});
});
