import { ApaleoAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number) {
	const error = new ApaleoAPIError('request failed');
	Object.assign(error, { status });
	return error;
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
});
