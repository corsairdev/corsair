import type { CorsairErrorHandler } from 'corsair/core';
import { KlazifyAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { planRequired, unauthorized } from './test-fixtures';

/** Builds the error the client would raise for a documented response. */
function apiError(
	status: number,
	options: {
		errorLabel?: string;
		detail?: string;
		method?: string;
	} = {},
): KlazifyAPIError {
	return new KlazifyAPIError(`Klazify ${status}`, {
		status,
		method: options.method ?? 'POST',
		errorLabel: options.errorLabel,
		detail: options.detail,
	});
}

/** Finds the first handler that matches, the way core resolves them. */
type RetryStrategy = Awaited<
	ReturnType<NonNullable<CorsairErrorHandler['DEFAULT']>['handler']>
>;

/**
 * The context core passes to a handler. Built out rather than cast so the test
 * matches the real call signature.
 */
function handlerContext(error: Error) {
	return {
		pluginId: 'klazify',
		operation: 'test',
		input: {},
		originalError: error,
	};
}

async function resolve(
	error: Error,
): Promise<{ name: string; result: RetryStrategy }> {
	// Typed through the interface so each entry carries the real two-argument
	// handler signature. The inferred literal types below it collapse to the
	// narrowest handler, which takes no context.
	const handlers: CorsairErrorHandler = errorHandlers;
	const context = handlerContext(error);
	for (const name of Object.keys(handlers)) {
		const entry = handlers[name as keyof CorsairErrorHandler];
		if (!entry) continue;
		if (!entry.match(error, context)) continue;
		const result = await entry.handler(error, context);
		return { name, result };
	}
	throw new Error('No handler matched, which DEFAULT should prevent');
}

describe('error handler classification', () => {
	// The plan block and a bad key share a 401, so the body has to decide. The
	// plan handler sits first because both match the same status.
	it('routes a plan restriction to PLAN_REQUIRED_ERROR', async () => {
		const { name, result } = await resolve(
			apiError(401, {
				errorLabel: planRequired.error,
				detail: planRequired.message,
			}),
		);

		expect(name).toBe('PLAN_REQUIRED_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('routes a rejected key to AUTH_ERROR', async () => {
		const { name, result } = await resolve(
			apiError(401, {
				errorLabel: unauthorized.error,
				detail: unauthorized.message,
			}),
		);

		expect(name).toBe('AUTH_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('never confuses the two 401 meanings', async () => {
		const plan = await resolve(
			apiError(401, { errorLabel: planRequired.error }),
		);
		const auth = await resolve(
			apiError(401, { errorLabel: unauthorized.error }),
		);

		expect(plan.name).not.toBe(auth.name);
	});

	it('retries a 429 with backoff', async () => {
		const { name, result } = await resolve(apiError(429));

		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	// Both classification failures are unbilled and neither clears on a retry.
	it('does not retry an unreachable site', async () => {
		const { name, result } = await resolve(
			new KlazifyAPIError('Error category: /Unreachable'),
		);

		expect(name).toBe('CLASSIFICATION_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a page with no indexable content', async () => {
		const { name } = await resolve(
			new KlazifyAPIError('Error category: /No indexable content'),
		);

		expect(name).toBe('CLASSIFICATION_ERROR');
	});

	it('does not retry a rejected body', async () => {
		const { name, result } = await resolve(apiError(400));

		expect(name).toBe('VALIDATION_ERROR');
		expect(result.maxRetries).toBe(0);
	});

	it('does not retry a schema failure before any request', async () => {
		const zodLike = Object.assign(new Error('Invalid input'), {
			name: 'ZodError',
		});

		expect((await resolve(zodLike)).name).toBe('VALIDATION_ERROR');
	});
});

describe('server failures', () => {
	it('retries a 5xx', async () => {
		const { name, result } = await resolve(apiError(502));

		expect(name).toBe('SERVER_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});

	// The client copies the provider's message into the error, so a gateway
	// body that mentions "unreachable" must still reach the 5xx retry.
	it('retries a 5xx whose body says unreachable', async () => {
		const error = new KlazifyAPIError('Klazify 503: upstream unreachable', {
			status: 503,
			detail: 'upstream unreachable',
		});
		const { name, result } = await resolve(error);

		expect(name).toBe('SERVER_ERROR');
		expect(result.maxRetries).toBeGreaterThan(0);
	});
});

describe('unrecognised failures', () => {
	it('falls back to no retry', async () => {
		const { name, result } = await resolve(new Error('something odd'));

		expect(name).toBe('DEFAULT');
		expect(result.maxRetries).toBe(0);
	});

	it('keeps DEFAULT last so a specific handler is reached first', () => {
		expect(Object.keys(errorHandlers).at(-1)).toBe('DEFAULT');
	});

	// The plan handler must precede AUTH_ERROR or the specific match is lost.
	it('orders PLAN_REQUIRED_ERROR before AUTH_ERROR', () => {
		const names = Object.keys(errorHandlers);
		expect(names.indexOf('PLAN_REQUIRED_ERROR')).toBeLessThan(
			names.indexOf('AUTH_ERROR'),
		);
	});
});

describe('mergeErrorHandlers', () => {
	it('returns the builtins unchanged when the caller adds nothing', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});

	it('puts a caller handler before DEFAULT so it can match', () => {
		const custom = {
			CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 7 }) },
		} as CorsairErrorHandler;

		const names = Object.keys(mergeErrorHandlers(errorHandlers, custom));

		expect(names[0]).toBe('CUSTOM');
		expect(names.at(-1)).toBe('DEFAULT');
	});

	it('keeps the caller value for a handler both declare', async () => {
		const custom = {
			AUTH_ERROR: {
				match: () => true,
				handler: async () => ({ maxRetries: 9 }),
			},
		} as CorsairErrorHandler;

		const merged = mergeErrorHandlers(errorHandlers, custom);
		const result = await merged.AUTH_ERROR?.handler(
			new Error('x'),
			handlerContext(new Error('x')),
		);

		expect(result).toEqual({ maxRetries: 9 });
	});

	it('keeps every builtin the caller did not name', () => {
		const merged = mergeErrorHandlers(errorHandlers, {} as CorsairErrorHandler);

		for (const name of Object.keys(errorHandlers)) {
			expect(merged).toHaveProperty(name);
		}
	});
});
