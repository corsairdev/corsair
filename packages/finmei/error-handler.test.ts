import { ApiError } from 'corsair/http';
import { FinmeiAPIError } from './client';
import { errorHandlers } from './error-handlers';

function makeApiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/invoices' },
		{
			url: 'https://app.finmei.com/api/invoices',
			ok: false,
			status,
			statusText: message,
			body: {},
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

function route(error: Error): string {
	const match = Object.entries(errorHandlers).find(([, entry]) =>
		entry.match(error),
	);
	if (!match) throw new Error('No error handler matched');
	return match[0];
}

describe('Finmei errorHandlers', () => {
	it('routes 429 to RATE_LIMIT_ERROR and enforces single owner pattern (transport owns, maxRetries: 0)', async () => {
		const error = makeApiError(429, 'Too Many Requests', 2000);
		expect(route(error)).toBe('RATE_LIMIT_ERROR');
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		const finmeiErr = new FinmeiAPIError('Rate limited', 429);
		expect(route(finmeiErr)).toBe('RATE_LIMIT_ERROR');
	});

	it('routes 401 and 403 to AUTH_ERROR with maxRetries: 0', async () => {
		const unauth = makeApiError(401, 'Unauthorized');
		expect(route(unauth)).toBe('AUTH_ERROR');
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		const forbidden = makeApiError(403, 'Forbidden');
		expect(route(forbidden)).toBe('AUTH_ERROR');

		const textAuthErr = new Error('Invalid API key provided');
		expect(route(textAuthErr)).toBe('AUTH_ERROR');
	});

	it('routes 404 to NOT_FOUND_ERROR with maxRetries: 0', async () => {
		const notFound = makeApiError(404, 'Resource not found');
		expect(route(notFound)).toBe('NOT_FOUND_ERROR');
		await expect(errorHandlers.NOT_FOUND_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('routes 400 and 422 to BAD_REQUEST_ERROR with maxRetries: 0', async () => {
		const badRequest = makeApiError(400, 'Bad Request');
		expect(route(badRequest)).toBe('BAD_REQUEST_ERROR');
		await expect(errorHandlers.BAD_REQUEST_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		const unprocessable = makeApiError(422, 'Unprocessable Entity');
		expect(route(unprocessable)).toBe('BAD_REQUEST_ERROR');
	});

	it('routes 500 and unexpected errors to DEFAULT with maxRetries: 0', async () => {
		const serverError = makeApiError(500, 'Internal Server Error');
		expect(route(serverError)).toBe('DEFAULT');
		await expect(errorHandlers.DEFAULT.handler()).resolves.toEqual({
			maxRetries: 0,
		});

		const generic = new Error('Network dropped connection');
		expect(route(generic)).toBe('DEFAULT');
	});

	it('preserves first-match dispatch order when caller supplies custom handlers', () => {
		const callerHandlers: Record<
			string,
			{
				match: (e: Error) => boolean;
				handler: () => Promise<{ maxRetries: number }>;
			}
		> = {
			CUSTOM_AUTH: {
				match: (e: Error) => e.message.includes('custom auth'),
				handler: async () => ({ maxRetries: 1 }),
			},
		};

		const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
		const { DEFAULT: callerDefault, ...callers } = callerHandlers;
		const merged = {
			...callers,
			...builtIns,
			DEFAULT: callerDefault ?? builtInDefault,
		};

		const keys = Object.keys(merged);
		expect(keys[0]).toBe('CUSTOM_AUTH');
		expect(keys[keys.length - 1]).toBe('DEFAULT');
	});
});
