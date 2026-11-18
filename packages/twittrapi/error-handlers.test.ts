import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

type HandlerName = keyof typeof errorHandlers;

/** Mirrors corsair core: the first named handler whose match() passes. */
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find(
		(key) => key !== 'DEFAULT' && errorHandlers[key].match(error),
	);
	return name ?? 'DEFAULT';
}

function apiError(status: number, method: 'GET' | 'POST' = 'GET'): ApiError {
	return new ApiError(
		{ method, url: '/search' },
		{
			url: 'https://api.twittrapi.com/search',
			ok: false,
			status,
			statusText: '',
			body: { error: 'failed' },
		},
		`TwittrAPI ${status}`,
	);
}

describe('TwittrAPI error handlers', () => {
	it('retries a 5xx or 408 on a GET', async () => {
		expect(classify(apiError(502))).toBe('SERVER_ERROR');
		expect(classify(apiError(408))).toBe('SERVER_ERROR');
		expect(await errorHandlers.SERVER_ERROR.handler()).toMatchObject({
			maxRetries: 2,
		});
	});

	it('does not replay a write that hit a 5xx', () => {
		expect(classify(apiError(502, 'POST'))).toBe('DEFAULT');
	});

	it('maps the documented 4xx codes', () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(classify(apiError(401))).toBe('AUTH_ERROR');
		expect(classify(apiError(402))).toBe('AUTH_ERROR');
		expect(classify(apiError(403))).toBe('PERMISSION_ERROR');
		expect(classify(apiError(404))).toBe('NOT_FOUND_ERROR');
		expect(classify(apiError(422))).toBe('VALIDATION_ERROR');
	});
});
