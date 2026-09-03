import { errorHandlers, isNonIdempotent } from './error-handlers';

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {
		status: number;
		retryAfter?: number;
		constructor(message: string, status: number, retryAfter?: number) {
			super(message);
			this.status = status;
			this.retryAfter = retryAfter;
			this.name = 'ApiError';
		}
	},
}));

const { ApiError } = jest.requireMock('corsair/http') as {
	ApiError: new (
		message: string,
		status: number,
		retryAfter?: number,
	) => Error & {
		status: number;
		retryAfter?: number;
	};
};

const mockContext = (operation: string) => ({
	operation,
	pluginId: 'botbaba',
	input: {},
	originalError: new Error(operation),
});

describe('isNonIdempotent', () => {
	it('flags WhatsApp send and Shopify forwards', () => {
		expect(isNonIdempotent('messages.sendWhatsappTemplate')).toBe(true);
		expect(isNonIdempotent('shopify.cartCreation')).toBe(true);
		expect(isNonIdempotent('contacts.get')).toBe(false);
	});
});

describe('errorHandlers', () => {
	it('matches 429 and skips retries on non-idempotent ops', async () => {
		const error = new ApiError('Too Many Requests', 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const blocked = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			mockContext('messages.sendWhatsappTemplate'),
		);
		expect(blocked.maxRetries).toBe(0);
		const allowed = await errorHandlers.RATE_LIMIT_ERROR.handler(
			error,
			mockContext('contacts.get'),
		);
		expect(allowed.maxRetries).toBe(3);
	});

	it('matches auth, permission, not-found, and validation statuses', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(new ApiError('Unauthorized', 401)),
		).toBe(true);
		expect(
			errorHandlers.PERMISSION_ERROR.match(new ApiError('Forbidden', 403)),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new ApiError('Not Found', 404)),
		).toBe(true);
		expect(
			errorHandlers.VALIDATION_ERROR.match(new ApiError('Bad Request', 400)),
		).toBe(true);
	});

	it('retries network errors only for idempotent ops', async () => {
		expect(errorHandlers.NETWORK_ERROR.match(new Error('fetch failed'))).toBe(
			true,
		);
		const blocked = await errorHandlers.NETWORK_ERROR.handler(
			new Error('network error'),
			mockContext('actions.execute'),
		);
		expect(blocked.maxRetries).toBe(0);
		const allowed = await errorHandlers.NETWORK_ERROR.handler(
			new Error('network error'),
			mockContext('templates.list'),
		);
		expect(allowed.maxRetries).toBe(3);
	});
});
