import { ApaleoAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number) {
	return new ApaleoAPIError('request failed', status);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('Apaleo error handlers', () => {
	it('classifies 429 as RATE_LIMIT_ERROR', () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
	});
	it('passes Retry-After as milliseconds', async () => {
		const error = new ApaleoAPIError('slow down', 429, undefined, 5000);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.headersRetryAfterMs).toBe(5000);
	});
	it('classifies 401 as AUTH_ERROR', () => {
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
	});
	it('classifies 403 as PERMISSION_ERROR', () => {
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
	});
	it('classifies 404 as NOT_FOUND_ERROR', () => {
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
	});
	it('classifies 422 as BAD_REQUEST_ERROR', () => {
		expect(classify(apiError(422))).toBe('BAD_REQUEST_ERROR');
	});
	it('classifies 500 as SERVER_ERROR', () => {
		expect(classify(apiError(500))).toBe('SERVER_ERROR');
	});
	it('does not retry POST create on server error', async () => {
		const error = apiError(500);
		const result = await errorHandlers.SERVER_ERROR.handler(error, {
			pluginId: 'apaleo',
			operation: 'properties.create',
			input: {},
			originalError: error,
		});
		expect(result.maxRetries).toBe(0);
	});
});
