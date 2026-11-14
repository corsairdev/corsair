import { DocumensoAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { documenso } from './index';

describe('Documenso error handlers', () => {
	it('recognizes 429 and preserves the exact Retry-After delay without retries', async () => {
		const error = new DocumensoAPIError(
			'Documenso API request failed with HTTP 429',
			429,
			4000,
		);
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler.match(error)).toBe(true);
		expect(await handler.handler(error)).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 4000,
		});
	});

	it.each([401, 403])('classifies HTTP %i as an auth error', (status) => {
		expect(
			errorHandlers.AUTH_ERROR.match(
				new DocumensoAPIError('unauthorized', status),
			),
		).toBe(true);
	});

	it.each([400, 422])('classifies HTTP %i as a bad request', (status) => {
		expect(
			errorHandlers.BAD_REQUEST_ERROR.match(
				new DocumensoAPIError('invalid request', status),
			),
		).toBe(true);
	});

	it('classifies 404 and 5xx without retrying', async () => {
		const notFound = new DocumensoAPIError('not found', 404);
		const serverError = new DocumensoAPIError('server failure', 503);
		expect(errorHandlers.NOT_FOUND_ERROR.match(notFound)).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(serverError)).toBe(true);
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('leaves the catch-all handler last so specific handlers win first-match dispatch', () => {
		const names = Object.keys(errorHandlers);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});

	it('orders caller handlers ahead of built-ins and keeps the caller fallback last', () => {
		const plugin = documenso({
			errorHandlers: {
				NETWORK_ERROR: {
					match: (error: Error) => error.message === 'custom network failure',
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const handlers = plugin.errorHandlers;
		if (!handlers) throw new Error('Documenso error handlers are missing');
		const names = Object.keys(handlers);
		expect(names.indexOf('NETWORK_ERROR')).toBeLessThan(
			names.indexOf('DEFAULT'),
		);
		expect(names.at(-1)).toBe('DEFAULT');
		const customError = new Error('custom network failure');
		expect(
			handlers.NETWORK_ERROR?.match(customError, {
				pluginId: 'documenso',
				operation: 'envelopes.find.get',
				input: {},
				originalError: customError,
			}),
		).toBe(true);
	});
});
