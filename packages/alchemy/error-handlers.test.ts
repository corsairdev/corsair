import { AlchemyAPIError } from './client';
import { errorHandlers } from './error-handlers';

describe('Alchemy error handlers', () => {
	it('matches RATE_LIMIT_ERROR on 429', async () => {
		const error = new AlchemyAPIError('Too Many Requests', { status: 429 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: undefined,
		});
	});

	it('matches RATE_LIMIT_ERROR on message', async () => {
		const error = new Error('Rate limit exceeded');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			retryStrategy: 'exponential_backoff',
			headersRetryAfterMs: undefined,
		});
	});

	it('matches AUTH_ERROR on 401 and 403', () => {
		const err401 = new AlchemyAPIError('Unauthorized', { status: 401 });
		const err403 = new AlchemyAPIError('Forbidden', { status: 403 });
		expect(errorHandlers.AUTH_ERROR.match(err401)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(err403)).toBe(true);
	});

	it('matches AUTH_ERROR on message', () => {
		const error = new Error('Invalid API key provided');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('matches BAD_REQUEST_ERROR on 400', () => {
		const error = new AlchemyAPIError('Bad Request', { status: 400 });
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});

	it('matches BAD_REQUEST_ERROR on JSON-RPC invalid params code', () => {
		const error = new AlchemyAPIError('Invalid params', { code: -32602 });
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});

	it('matches SERVER_ERROR on 5xx and retries', async () => {
		const error = new AlchemyAPIError('Upstream failed', { status: 503 });
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not treat address substrings as HTTP status matches', () => {
		const error = new Error('tx 0x400aaa failed');
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});
});
