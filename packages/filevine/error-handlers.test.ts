import { errorHandlers } from './error-handlers';

const mockCtx = {
	pluginId: 'filevine',
	operation: 'test',
	input: {},
	originalError: new Error('test'),
} as unknown as Parameters<typeof errorHandlers.RATE_LIMIT_ERROR.match>[1];

describe('Filevine error handlers', () => {
	it('rate limit matches 429 and message', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('429 rate_limited'),
				mockCtx,
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('too many requests'),
				mockCtx,
			),
		).toBe(true);
	});

	it('auth error matches unauthorized', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(new Error('unauthorized'), mockCtx),
		).toBe(true);
		expect(
			errorHandlers.AUTH_ERROR.match(new Error('invalid_auth'), mockCtx),
		).toBe(true);
	});

	it('permission error matches permission strings', () => {
		expect(
			errorHandlers.PERMISSION_ERROR.match(
				new Error('permission_denied'),
				mockCtx,
			),
		).toBe(true);
		expect(
			errorHandlers.PERMISSION_ERROR.match(new Error('forbidden'), mockCtx),
		).toBe(true);
	});

	it('not found matches', () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new Error('not found'), mockCtx),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new Error('not_found'), mockCtx),
		).toBe(true);
	});

	it('rate limit handler returns retry config', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('429'),
			mockCtx,
		);
		expect(result.maxRetries).toBe(5);
	});

	it('auth handler disables retries', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler(
			new Error('unauthorized'),
			mockCtx,
		);
		expect(result.maxRetries).toBe(0);
	});

	it('validation error matches 400', () => {
		expect(
			errorHandlers.VALIDATION_ERROR.match(
				new Error('validation error'),
				mockCtx,
			),
		).toBe(true);
	});
});
