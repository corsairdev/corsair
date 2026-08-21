/**
 * Every status this API answers with, mapped to the retry decision this
 * plugin makes for it - including the four empty-body statuses (401, 404
 * unknown-route, 405, 429) and the 409 conflict. Bind retries stay at 0
 * because corsair/core discards a successful retry and rethrows.
 */
import { ApiError } from 'corsair/http';
import { errorHandlers, isNonIdempotent } from './error-handlers';

function apiError(status: number, body?: unknown): ApiError {
	const err = new ApiError(
		{ method: 'GET', url: 'https://api.altoviz.com/v1/customers/1' },
		{
			url: 'https://api.altoviz.com/v1/customers/1',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		'error',
	);
	return err;
}

function context(operation: string, error: Error) {
	return { pluginId: 'altoviz', operation, input: {}, originalError: error };
}

describe('status-to-handler mapping', () => {
	test('401 (empty body) matches AUTH_ERROR and is never retried', () => {
		const error = apiError(401, undefined);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	test('404 matches NOT_FOUND_ERROR whether the body is a message or empty', async () => {
		const withMessage = apiError(404, {
			errors: [],
			message: 'Customer with ID 1 not found.',
		});
		const empty = apiError(404, undefined);
		expect(errorHandlers.NOT_FOUND_ERROR.match(withMessage)).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(empty)).toBe(true);
		const result = await errorHandlers.NOT_FOUND_ERROR.handler(
			withMessage,
			context('customers.get', withMessage),
		);
		expect(result.maxRetries).toBe(0);
	});

	test('405 matches METHOD_ERROR', () => {
		const error = apiError(405, undefined);
		expect(errorHandlers.METHOD_ERROR.match(error)).toBe(true);
	});

	test('409 matches CONFLICT_ERROR and is never retried', async () => {
		const error = apiError(409, {
			errors: null,
			message: "L'element ... ne peut pas etre supprime car il a ete utilise.",
		});
		expect(errorHandlers.CONFLICT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.CONFLICT_ERROR.handler(
			error,
			context('customerFamilies.delete', error),
		);
		expect(result.maxRetries).toBe(0);
	});

	test('400 matches VALIDATION_ERROR whether errors is an array, empty, or null', () => {
		for (const body of [
			{ errors: ['bad'], message: 'Validation failed' },
			{ errors: [], message: 'Number or internal ID have to be defined' },
			{ errors: null, message: "La TVA n'existe pas." },
		]) {
			const error = apiError(400, body);
			expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
		}
	});

	test('429 matches RATE_LIMIT_ERROR and honours Retry-After in milliseconds', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'https://api.altoviz.com/v1/units' },
			{
				url: 'https://api.altoviz.com/v1/units',
				ok: false,
				status: 429,
				statusText: 'Error',
				body: undefined,
			},
			'error',
			{ retryAfter: 36000 * 1000 },
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			context('account.getUnits', error),
		);
		expect(result.headersRetryAfterMs).toBe(36000);
		expect(result.maxRetries).toBe(0);
	});

	test('429 on a non-idempotent operation is never retried, even with Retry-After present', async () => {
		const error = new ApiError(
			{ method: 'POST', url: 'https://api.altoviz.com/v1/saleinvoices' },
			{
				url: 'https://api.altoviz.com/v1/saleinvoices',
				ok: false,
				status: 429,
				statusText: 'Error',
				body: undefined,
			},
			'error',
			{ retryAfter: 13000 },
		);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			context('saleInvoices.create', error),
		);
		expect(result.maxRetries).toBe(0);
	});

	test('500 is never retried by bind', async () => {
		const error = apiError(500, {
			errors: ['Une erreur est survenue.'],
			message: 'Internal error',
		});
		const readResult = await errorHandlers.SERVER_ERROR.handler(
			error,
			context('customers.get', error),
		);
		expect(readResult.maxRetries).toBe(0);
		const writeResult = await errorHandlers.SERVER_ERROR.handler(
			error,
			context('saleInvoices.create', error),
		);
		expect(writeResult.maxRetries).toBe(0);
	});

	test('a network error is never retried by bind', async () => {
		const error = new Error('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(error)).toBe(true);
		const readResult = await errorHandlers.NETWORK_ERROR.handler(
			error,
			context('customers.get', error),
		);
		expect(readResult.maxRetries).toBe(0);
		const writeResult = await errorHandlers.NETWORK_ERROR.handler(
			error,
			context('customers.create', error),
		);
		expect(writeResult.maxRetries).toBe(0);
		expect(errorHandlers.NETWORK_ERROR.match(apiError(400))).toBe(false);
	});

	test('DEFAULT catches everything else and never retries', async () => {
		const error = new Error('something unexpected');
		expect(errorHandlers.DEFAULT.match()).toBe(true);
		const result = await errorHandlers.DEFAULT.handler(
			error,
			context('customers.get', error),
		);
		expect(result.maxRetries).toBe(0);
	});
});

describe('isNonIdempotent', () => {
	test('every write and destructive operation is non-idempotent; every read is not', () => {
		expect(isNonIdempotent('customers.create')).toBe(true);
		expect(isNonIdempotent('customers.delete')).toBe(true);
		expect(isNonIdempotent('customers.get')).toBe(false);
		expect(isNonIdempotent('customers.list')).toBe(false);
	});
});
