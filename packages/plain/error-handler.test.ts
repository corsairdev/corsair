import { ApiError } from 'corsair/http';
import { PlainAPIError } from './client';
import { errorHandlers } from './error-handlers';

function transportError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: '' },
		{
			url: 'https://core-api.uk.plain.com/graphql/v1',
			ok: false,
			status,
			statusText: `status ${status}`,
			body: {},
		},
		`transport failed with ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function graphQLError(message: string, status?: number): PlainAPIError {
	const cause =
		status === undefined
			? undefined
			: transportError(status === 401 ? 401 : status);
	return new PlainAPIError(message, cause ? { cause } : undefined);
}

describe('Plain RATE_LIMIT_ERROR handler', () => {
	it('matches transport 429 and GraphQL 429', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(transportError(429))).toBe(
			true,
		);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(graphQLError('slow down', 429)),
		).toBe(true);
	});

	it('matches rate-limit messages without a status', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('RATE_LIMITED')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429 busy'))).toBe(
			true,
		);
	});

	it('does not match unrelated errors', () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(transportError(500))).toBe(
			false,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('nope'))).toBe(false);
	});

	it('retries with the transport retryAfter', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			transportError(429, 2500),
		);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: 2500 });
	});

	it('retries with the GraphQL retryAfter when numeric', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			graphQLError('slow down', 429),
		);
		expect(result.maxRetries).toBe(5);
	});

	it('retries without a delay when no retryAfter is present', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('rate_limited'),
		);
		expect(result).toEqual({ maxRetries: 5, headersRetryAfterMs: undefined });
	});
});

describe('Plain AUTH_ERROR handler', () => {
	it('matches transport 401 and GraphQL 401', () => {
		expect(errorHandlers.AUTH_ERROR.match(transportError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(graphQLError('denied', 401))).toBe(
			true,
		);
	});

	it('matches auth messages without a status', () => {
		expect(errorHandlers.AUTH_ERROR.match(new Error('Unauthorized'))).toBe(
			true,
		);
		expect(
			errorHandlers.AUTH_ERROR.match(new Error('invalid_auth token')),
		).toBe(true);
	});

	it('does not match unrelated errors', () => {
		expect(errorHandlers.AUTH_ERROR.match(transportError(403))).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(new Error('nope'))).toBe(false);
	});

	it('never retries auth errors', async () => {
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('Plain DEFAULT handler', () => {
	it('matches everything and never retries', async () => {
		expect(errorHandlers.DEFAULT.match(new Error('anything'))).toBe(true);
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
