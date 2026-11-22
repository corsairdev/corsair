import type { ErrorContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

function pipelineCrmError(
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	status: number,
): ApiError {
	return new ApiError(
		{ method, url: '/api/v3/deals' },
		{ url: '/api/v3/deals', ok: false, status, statusText: '', body: null },
		`Pipeline CRM ${status}`,
	);
}

function contextFor(error: Error): ErrorContext {
	return {
		pluginId: 'pipelinecrm',
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
	it('does not retry auth errors', async () => {
		expect(await retriesFor(pipelineCrmError('GET', 401))).toBe(0);
		expect(await retriesFor(pipelineCrmError('GET', 403))).toBe(0);
	});

	it('does not retry validation errors', async () => {
		expect(await retriesFor(pipelineCrmError('POST', 400))).toBe(0);
		expect(await retriesFor(pipelineCrmError('GET', 404))).toBe(0);
		expect(await retriesFor(pipelineCrmError('POST', 422))).toBe(0);
	});

	it('replays only GET requests on a 5xx', async () => {
		expect(await retriesFor(pipelineCrmError('GET', 503))).toBe(2);
		expect(await retriesFor(pipelineCrmError('POST', 503))).toBe(0);
		expect(await retriesFor(pipelineCrmError('DELETE', 500))).toBe(0);
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
			TOO_MANY_REQUESTS: {
				match: (error) => error instanceof ApiError && error.status === 429,
				handler: async () => ({ maxRetries: 5 }),
			},
		});
		const names = Object.keys(merged);
		expect(names[0]).toBe('TOO_MANY_REQUESTS');
		expect(names.at(-1)).toBe('DEFAULT');

		const error = pipelineCrmError('GET', 429);
		const decision = await merged.TOO_MANY_REQUESTS!.handler(
			error,
			contextFor(error),
		);
		expect(decision.maxRetries).toBe(5);
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
