import { ApiError } from 'corsair/http';
import { AsinDataApiAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiError(status: number, message = 'request failed') {
	return new ApiError(
		{ method: 'GET', url: 'collections' },
		{
			url: 'https://api.asindataapi.com/collections',
			ok: false,
			status,
			statusText: '',
			body: {},
		},
		message,
	);
}

function classify(error: Error): string {
	for (const [name, handler] of Object.entries(errorHandlers)) {
		if (handler.match(error)) return name;
	}
	return 'UNMATCHED';
}

describe('ASIN Data API error handlers', () => {
	it('classifies 429 as RATE_LIMIT_ERROR', () => {
		expect(
			classify(
				new AsinDataApiAPIError('limited', 429, { cause: apiError(429) }),
			),
		).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies 401 as AUTH_ERROR', () => {
		expect(
			classify(
				new AsinDataApiAPIError('bad key', 401, { cause: apiError(401) }),
			),
		).toBe('AUTH_ERROR');
	});

	it('classifies 404 as NOT_FOUND_ERROR', () => {
		expect(
			classify(
				new AsinDataApiAPIError('missing', 404, { cause: apiError(404) }),
			),
		).toBe('NOT_FOUND_ERROR');
	});

	it('classifies 500 as SERVER_ERROR', () => {
		expect(
			classify(new AsinDataApiAPIError('boom', 500, { cause: apiError(500) })),
		).toBe('SERVER_ERROR');
	});
});
