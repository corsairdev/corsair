import { ApiError } from 'corsair/http';
import { errorHandlers } from './error-handlers';

function makeError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/public/api/v1/groups' },
		{
			url: 'https://eventee.com/public/api/v1/groups',
			ok: false,
			status,
			statusText: message,
			body: { error: message },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function selectedHandler(error: Error): string {
	const matched = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!matched) throw new Error('No Eventee error handler matched');
	return matched[0];
}

describe('Eventee error handling', () => {
	it('recognizes 429 but does not retry automatically', async () => {
		const error = makeError(429, 'Too Many Requests', 2500);
		expect(selectedHandler(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes the documented 400 rate-limit/token-missing response without retry', async () => {
		const throttle = makeError(400, 'Something went wrong. Try again later.');
		const missingToken = makeError(400, 'token_missing');
		expect(selectedHandler(throttle)).toBe('BAD_REQUEST_ERROR');
		expect(selectedHandler(missingToken)).toBe('AUTH_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('distinguishes invalid tokens from forbidden event or plan resources', async () => {
		const invalidToken = makeError(401, 'token_invalid');
		const forbidden = makeError(
			403,
			'The resource does not belong to this event',
		);
		expect(selectedHandler(invalidToken)).toBe('AUTH_ERROR');
		expect(selectedHandler(forbidden)).toBe('FORBIDDEN_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.FORBIDDEN_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry validation, missing-resource, or server failures', async () => {
		const validation = makeError(422, 'Validation failed');
		const notFound = makeError(404, 'No query results');
		const server = makeError(503, 'Service Unavailable');
		expect(selectedHandler(validation)).toBe('DEFAULT');
		expect(selectedHandler(notFound)).toBe('DEFAULT');
		expect(selectedHandler(server)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
