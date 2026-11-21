import type { ErrorContext } from 'corsair/core';
import { PiloterrAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function piloterrError(status: number, message?: string): PiloterrAPIError {
	return new PiloterrAPIError(message ?? `Piloterr ${status}`, {
		method: 'GET',
		path: '/v2/usage',
		status,
	});
}

function contextFor(error: Error): ErrorContext {
	return {
		pluginId: 'piloterr',
		operation: 'test',
		input: {},
		originalError: error,
	};
}

async function retriesFor(error: Error): Promise<number> {
	const context = contextFor(error);
	// The runtime calls every match/handler with (error, context); the
	// builtin literals declare fewer parameters, so the cast restores the
	// interface view of them.
	const entries = Object.entries(errorHandlers) as Array<
		[
			string,
			{
				match: (error: Error, context: ErrorContext) => boolean;
				handler: (
					error: Error,
					context: ErrorContext,
				) => Promise<{ maxRetries?: number }>;
			},
		]
	>;
	for (const [name, entry] of entries) {
		if (name !== 'DEFAULT' && !entry.match(error, context)) continue;
		const decision = await entry.handler(error, context);
		return decision.maxRetries ?? 0;
	}
	return 0;
}

describe('errorHandlers', () => {
	it('retries the 401 rate-limit form, which Piloterr uses instead of 429', async () => {
		expect(
			await retriesFor(
				piloterrError(
					401,
					"Rate limit exceeded: You've exceeded the search rate limit on your subscription",
				),
			),
		).toBe(2);
		expect(
			await retriesFor(
				piloterrError(401, 'Rate limit exceeded for the API key: quota daily'),
			),
		).toBe(2);
	});

	it('does not retry an auth 401', async () => {
		expect(await retriesFor(piloterrError(401, 'Invalid API Key'))).toBe(0);
		expect(await retriesFor(piloterrError(401, 'Expired API Key'))).toBe(0);
	});

	it('does not retry auth 403 or payment 402', async () => {
		expect(await retriesFor(piloterrError(403))).toBe(0);
		expect(await retriesFor(piloterrError(402))).toBe(0);
	});

	it('does not retry validation errors', async () => {
		expect(await retriesFor(piloterrError(400))).toBe(0);
		expect(await retriesFor(piloterrError(404))).toBe(0);
	});

	it('retries a 5xx with backoff, as the docs prescribe', async () => {
		expect(await retriesFor(piloterrError(500))).toBe(2);
		expect(await retriesFor(piloterrError(503))).toBe(2);
	});

	it('does not retry a plain Error', async () => {
		expect(await retriesFor(new Error('network down'))).toBe(0);
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins unchanged without caller handlers', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('lets a caller handler run before the builtins it does not name', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			NOT_FOUND_ERROR: {
				match: (error) =>
					error instanceof PiloterrAPIError && error.status === 404,
				handler: async () => ({ maxRetries: 3 }),
			},
		});
		const names = Object.keys(merged);
		expect(names[0]).toBe('NOT_FOUND_ERROR');
		expect(names.at(-1)).toBe('DEFAULT');

		const error = piloterrError(404);
		const decision = await merged.NOT_FOUND_ERROR!.handler(
			error,
			contextFor(error),
		);
		expect(decision.maxRetries).toBe(3);
	});

	it('lets a caller override a builtin key and keep DEFAULT last', async () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			SERVER_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		});
		const error = new Error('any');
		const decision = await merged.SERVER_ERROR!.handler(
			error,
			contextFor(error),
		);
		expect(decision.maxRetries).toBe(9);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});
