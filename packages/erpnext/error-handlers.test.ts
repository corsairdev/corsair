import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { ErpnextAPIError, makeErpnextRequest } from './client';
import { errorHandlers } from './error-handlers';

const BASE_URL = 'https://test.example.com';

// Minimal shared-transport config; the fetch seam below captures what the
// transport sends and answers with the scripted status.
const CONFIG: OpenAPIConfig = {
	BASE: BASE_URL,
	VERSION: '1.0.0',
	WITH_CREDENTIALS: false,
	CREDENTIALS: 'omit',
};

const OPTIONS: ApiRequestOptions = {
	method: 'GET',
	url: '/api/method/frappe.auth.get_logged_user',
};

// unknown: the handler context only needs the fields the error handlers
// read (pluginId and the dotted operation id); the input and originalError
// round out the Corsair ErrorContext shape.
function contextOf(
	operation: string,
	originalError: Error,
): {
	pluginId: string;
	operation: string;
	input: Record<string, unknown>;
	originalError: Error;
} {
	return {
		pluginId: 'erpnext',
		operation,
		input: {},
		originalError,
	};
}

function wrappedError(status: number, retryAfter?: number): ErpnextAPIError {
	// Direct construction mirrors what makeErpnextRequest produces for the
	// same response: the wrapped error carries status and the millisecond
	// Retry-After so the handlers below can match and price retries.
	return new ErpnextAPIError(`ERPNext API error ${status}`, {
		cause: new Error(String(status)),
		status,
		retryAfter,
	});
}

describe('ERPNext error handlers', () => {
	it('lets core ApiError through unchanged, with status and Retry-After', async () => {
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => {
				return new Response('{"exc_type": "PermissionError"}', {
					status: 403,
					headers: { 'content-type': 'application/json' },
				});
			});
		try {
			const error = (await makeErpnextRequest(
				OPTIONS.url ?? '',
				BASE_URL,
				'test-key:test-secret',
			).catch((caught: unknown) => caught)) as ApiError;
			expect(error).toBeInstanceOf(ApiError);
			expect(error).not.toBeInstanceOf(ErpnextAPIError);
			expect(error.status).toBe(403);
			expect(error.body).toEqual({ exc_type: 'PermissionError' });
			const context = contextOf('documents.list', error);
			expect(errorHandlers.PERMISSION_ERROR?.match(error, context)).toBe(true);
		} finally {
			mockFetch.mockRestore();
		}
	});

	it('keeps core 429 retries in the transport, honouring Retry-After', async () => {
		jest.useFakeTimers();
		let calls = 0;
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => {
				calls++;
				if (calls === 1) {
					return new Response('Too Many Requests', {
						status: 429,
						headers: { 'content-type': 'text/plain', 'Retry-After': '1' },
					});
				}
				return new Response('{"message": "Administrator"}', {
					status: 200,
					headers: { 'content-type': 'application/json' },
				});
			});
		try {
			const pending = makeErpnextRequest<{ message: string }>(
				OPTIONS.url ?? '',
				BASE_URL,
				'test-key:test-secret',
			);
			await jest.runAllTimersAsync();
			await expect(pending).resolves.toEqual({ message: 'Administrator' });
			expect(calls).toBe(2);
		} finally {
			mockFetch.mockRestore();
			jest.useRealTimers();
		}
	});

	it('matches the wrapped error class, not message substrings', () => {
		const rateLimit = wrappedError(429);
		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(
				rateLimit,
				contextOf('documents.list', rateLimit),
			),
		).toBe(true);
		// The shared transport throws ApiError subclasses too; the matcher
		// must not misclassify them through statusOf (undefined status).
		const plain = new Error('Something else');
		expect(
			errorHandlers.RATE_LIMIT_ERROR?.match(
				plain,
				contextOf('documents.list', plain),
			),
		).toBe(false);
	});

	it.each([
		{ status: 401, handler: 'AUTH_ERROR' as const, label: 'auth' },
		{ status: 403, handler: 'PERMISSION_ERROR' as const, label: 'permission' },
		{ status: 404, handler: 'NOT_FOUND_ERROR' as const, label: 'not found' },
		{ status: 400, handler: 'VALIDATION_ERROR' as const, label: 'validation' },
		{ status: 422, handler: 'VALIDATION_ERROR' as const, label: 'validation' },
	])(
		'classifies HTTP $status as $handler and never retries it',
		async ({ status, handler }) => {
			const error = wrappedError(status);
			expect(
				errorHandlers[handler]?.match(
					error,
					contextOf('documents.list', error),
				),
			).toBe(true);
			await expect(
				errorHandlers[handler]?.handler(
					error,
					contextOf('documents.list', error),
				),
			).resolves.toEqual({ maxRetries: 0 });
		},
	);

	it('does not misclassify other statuses into the wrong class', () => {
		const cases: Array<{
			status: number;
			handler: keyof typeof errorHandlers;
		}> = [
			{ status: 429, handler: 'RATE_LIMIT_ERROR' },
			{ status: 401, handler: 'AUTH_ERROR' },
			{ status: 403, handler: 'PERMISSION_ERROR' },
			{ status: 404, handler: 'NOT_FOUND_ERROR' },
			{ status: 400, handler: 'VALIDATION_ERROR' },
			{ status: 422, handler: 'VALIDATION_ERROR' },
			{ status: 500, handler: 'SERVER_ERROR' },
			{ status: 502, handler: 'SERVER_ERROR' },
		];
		for (const { status, handler } of cases) {
			const error = wrappedError(status);
			const context = contextOf('documents.list', error);
			// Every registered class except DEFAULT answers exactly one status;
			// DEFAULT always matches as the fallback.
			for (const [name, entry] of Object.entries(errorHandlers)) {
				if (!entry) continue;
				if (name === 'DEFAULT') {
					expect(entry.match(error, context)).toBe(true);
					continue;
				}
				if (name === handler) {
					expect(entry.match(error, context)).toBe(true);
				} else {
					expect(entry.match(error, context)).toBe(false);
				}
			}
		}
	});

	it('does not replay a 429 on top of the transport retries', async () => {
		const rateLimit = wrappedError(429, 7000);
		for (const operation of [
			'documents.list',
			'documents.create',
			'documents.delete',
		]) {
			expect(
				await errorHandlers.RATE_LIMIT_ERROR?.handler(
					rateLimit,
					contextOf(operation, rateLimit),
				),
			).toEqual({ maxRetries: 0 });
		}
	});

	it('retries only read-risk operations on server errors', async () => {
		const serverError = wrappedError(503);
		expect(
			await errorHandlers.SERVER_ERROR?.handler(
				serverError,
				contextOf('documents.list', serverError),
			),
		).toEqual({ maxRetries: 2, retryStrategy: 'exponential_backoff' });
		expect(
			await errorHandlers.SERVER_ERROR?.handler(
				serverError,
				contextOf('documents.update', serverError),
			),
		).toEqual({ maxRetries: 0 });
	});

	it('answers the DEFAULT class without retries', async () => {
		const unknownStatus = wrappedError(418);
		expect(
			errorHandlers.DEFAULT?.match(
				unknownStatus,
				contextOf('documents.list', unknownStatus),
			),
		).toBe(true);
		expect(
			await errorHandlers.DEFAULT?.handler(
				unknownStatus,
				contextOf('documents.list', unknownStatus),
			),
		).toEqual({ maxRetries: 0 });
	});
});
