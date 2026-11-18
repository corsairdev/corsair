import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function httpError(status: number): Error {
	return new ApiError(
		{ method: 'GET', url: '/v1/credits/balance' },
		{
			url: 'https://api.linkup.so/v1/credits/balance',
			ok: false,
			status,
			statusText: 'Error',
			body: {},
		},
		'Error',
	);
}

describe('Linkup error handlers', () => {
	it('does not retry a 429', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(httpError(429))).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(httpError(429)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('does not retry a 401', async () => {
		expect(errorHandlers.AUTH_ERROR.match(httpError(401))).toBe(true);
		await expect(
			errorHandlers.AUTH_ERROR.handler(httpError(401)),
		).resolves.toEqual({ maxRetries: 0 });
	});

	it('uses the default handler for any other error', async () => {
		expect(errorHandlers.DEFAULT.match(httpError(500))).toBe(true);
		await expect(
			errorHandlers.DEFAULT.handler(httpError(500)),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
