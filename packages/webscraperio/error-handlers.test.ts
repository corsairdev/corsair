import { ZodError } from 'zod';
import { WebscraperioAPIError } from './client';
import { errorHandlers } from './error-handlers';
import {
	badRequest,
	invalidToken,
	routeNotFound,
	sitemapNotFound,
} from './test-fixtures';

type HandlerName = keyof typeof errorHandlers;

// Mirrors corsair core: the first handler whose match() passes, in key order.
function classify(error: Error): HandlerName {
	const name = (Object.keys(errorHandlers) as HandlerName[]).find((key) =>
		errorHandlers[key].match(error),
	);
	if (!name) throw new Error('DEFAULT should always match');
	return name;
}

async function strategy(error: Error) {
	return errorHandlers[classify(error)].handler(error);
}

function apiError(
	status: number,
	// unknown: each case passes one of the API's error bodies.
	body: unknown = {},
	options: { retryAfter?: number; method?: string } = {},
) {
	return new WebscraperioAPIError(`Web Scraper Cloud ${status}: failed`, {
		status,
		body,
		...options,
	});
}

describe('Web Scraper Cloud error handlers', () => {
	it('retries a 429 with backoff', async () => {
		expect(classify(apiError(429))).toBe('RATE_LIMIT_ERROR');
		expect(await strategy(apiError(429, {}, { retryAfter: 600 }))).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 600,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not retry the invalid token 401', async () => {
		const error = apiError(401, invalidToken);
		expect(classify(error)).toBe('AUTH_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 403', async () => {
		expect(classify(apiError(403, {}))).toBe('PERMISSION_ERROR');
	});

	it('reports a mistyped route as its own case, not as a missing sitemap', async () => {
		const error = apiError(404, routeNotFound);
		// This is the distinction worth keeping: both are 404s, but one is a
		// bad path and the other a real absence.
		expect(classify(error)).toBe('ROUTE_NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('reports a missing sitemap as not found', async () => {
		const error = apiError(404, sitemapNotFound);
		expect(classify(error)).toBe('NOT_FOUND_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it.each([400, 405, 422])('does not retry a %i', async (status) => {
		const error = apiError(status, badRequest);
		expect(classify(error)).toBe('VALIDATION_ERROR');
		expect(await strategy(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a ZodError, which never reached the network', async () => {
		expect(classify(new ZodError([]))).toBe('VALIDATION_ERROR');
	});

	it('replays a 5xx on a read', async () => {
		const error = apiError(500, {}, { method: 'GET' });
		expect(classify(error)).toBe('SERVER_ERROR');
		expect(await strategy(error)).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('does not replay a 5xx on a create', async () => {
		expect(classify(apiError(500, {}, { method: 'POST' }))).toBe('DEFAULT');
	});

	it('falls back to DEFAULT for anything else', async () => {
		expect(classify(new Error('other'))).toBe('DEFAULT');
	});
});
