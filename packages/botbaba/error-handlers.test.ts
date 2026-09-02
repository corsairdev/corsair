import { errorHandlers, isNonIdempotent } from './error-handlers';

/* -------------------------------------------------------------------------- */
/* mock corsair/http so ApiError is available                                  */
/* -------------------------------------------------------------------------- */

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {
		status: number;
		retryAfter?: number;
		constructor(
			message: string,
			status: number,
			retryAfter?: number,
		) {
			super(message);
			this.status = status;
			this.retryAfter = retryAfter;
			this.name = 'ApiError';
		}
	},
}));

// biome-ignore lint/suspicious/noExplicitAny: test utility
const { ApiError } = jest.requireMock('corsair/http') as any;

const mockContext = (operation: string) => ({ operation });

describe('isNonIdempotent', () => {
	it('flags bots.create as non-idempotent', () => {
		expect(isNonIdempotent('bots.create')).toBe(true);
	});

	it('flags messages.send as non-idempotent', () => {
		expect(isNonIdempotent('messages.send')).toBe(true);
	});

	it('flags deployments.deploy as non-idempotent', () => {
		expect(isNonIdempotent('deployments.deploy')).toBe(true);
	});

	it('does not flag bots.list', () => {
		expect(isNonIdempotent('bots.list')).toBe(false);
	});

	it('does not flag bots.get', () => {
		expect(isNonIdempotent('bots.get')).toBe(false);
	});
});

describe('errorHandlers', () => {
	describe('RATE_LIMIT_ERROR', () => {
		it('matches a 429 ApiError', () => {
			const error = new ApiError('Too Many Requests', 429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('matches "too many requests" in message', () => {
			const error = new Error('too many requests');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		});

		it('does not retry non-idempotent operations', async () => {
			const error = new ApiError('Too Many Requests', 429);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				error,
				mockContext('bots.create'),
			);
			expect(result.maxRetries).toBe(0);
		});

		it('retries idempotent operations up to 3 times', async () => {
			const error = new ApiError('Too Many Requests', 429);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				error,
				mockContext('bots.list'),
			);
			expect(result.maxRetries).toBe(3);
		});
	});

	describe('AUTH_ERROR', () => {
		it('matches a 401 ApiError', () => {
			const error = new ApiError('Unauthorized', 401);
			expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		});

		it('never retries', async () => {
			const error = new ApiError('Unauthorized', 401);
			const result = await errorHandlers.AUTH_ERROR.handler(
				error,
				mockContext('bots.list'),
			);
			expect(result.maxRetries).toBe(0);
		});
	});

	describe('PERMISSION_ERROR', () => {
		it('matches a 403 ApiError', () => {
			const error = new ApiError('Forbidden', 403);
			expect(errorHandlers.PERMISSION_ERROR.match(error)).toBe(true);
		});
	});

	describe('NOT_FOUND_ERROR', () => {
		it('matches a 404 ApiError', () => {
			const error = new ApiError('Not Found', 404);
			expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
		});
	});

	describe('VALIDATION_ERROR', () => {
		it('matches a 400 ApiError', () => {
			const error = new ApiError('Bad Request', 400);
			expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
		});
	});

	describe('NETWORK_ERROR', () => {
		it('matches network-related messages', () => {
			expect(
				errorHandlers.NETWORK_ERROR.match(new Error('network error')),
			).toBe(true);
			expect(
				errorHandlers.NETWORK_ERROR.match(new Error('ECONNREFUSED')),
			).toBe(true);
			expect(
				errorHandlers.NETWORK_ERROR.match(new Error('fetch failed')),
			).toBe(true);
		});

		it('does not retry non-idempotent on network error', async () => {
			const result = await errorHandlers.NETWORK_ERROR.handler(
				new Error('network error'),
				mockContext('messages.send'),
			);
			expect(result.maxRetries).toBe(0);
		});

		it('retries idempotent on network error', async () => {
			const result = await errorHandlers.NETWORK_ERROR.handler(
				new Error('network error'),
				mockContext('bots.get'),
			);
			expect(result.maxRetries).toBe(3);
		});
	});

	describe('DEFAULT', () => {
		it('matches anything', () => {
			expect(errorHandlers.DEFAULT.match(new Error('anything'))).toBe(true);
		});

		it('never retries', async () => {
			const result = await errorHandlers.DEFAULT.handler(
				new Error('unknown'),
				mockContext('bots.list'),
			);
			expect(result.maxRetries).toBe(0);
		});
	});
});
