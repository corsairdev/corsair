/**
 * Which handler catches which Publora failure, and how many retries each
 * one asks for.
 */
import { ApiError } from 'corsair/http';
import {
	errorHandlers,
	isNonIdempotent,
	publoraErrorCode,
} from './error-handlers';

function apiError(status: number, body: unknown): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.publora.com/api/v1/x' },
		{
			url: 'https://api.publora.com/api/v1/x',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		'Publora request failed',
	);
}

type Name = keyof typeof errorHandlers;

function firstMatch(error: Error): Name {
	const found = (Object.keys(errorHandlers) as Name[]).find((name) =>
		errorHandlers[name].match(error),
	);
	return found ?? 'DEFAULT';
}

describe('publoraErrorCode', () => {
	it('reads code from the body and ignores older bodies without it', () => {
		expect(
			publoraErrorCode(
				apiError(400, { error: 'x', code: 'POST_LIMIT_REACHED' }),
			),
		).toBe('POST_LIMIT_REACHED');
		expect(
			publoraErrorCode(apiError(404, { error: 'Post group not found' })),
		).toBeUndefined();
		expect(publoraErrorCode(new Error('plain'))).toBeUndefined();
	});
});

describe('matching', () => {
	it.each([
		[429, 'RATE_LIMIT_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'VALIDATION_ERROR'],
		[409, 'VALIDATION_ERROR'],
		[422, 'VALIDATION_ERROR'],
		[500, 'SERVER_ERROR'],
		[503, 'SERVER_ERROR'],
	] as const)('HTTP %i goes to %s', (status, handler) => {
		expect(firstMatch(apiError(status, { error: 'x' }))).toBe(handler);
	});

	it('a fetch failure goes to NETWORK_ERROR', () => {
		expect(firstMatch(new Error('fetch failed'))).toBe('NETWORK_ERROR');
	});
});

describe('retries', () => {
	const ctx = (operation: string) => ({ operation }) as never;

	it('never retries a 429 again in the handler', async () => {
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('retries a 5xx for reads only', async () => {
		const read = await errorHandlers.SERVER_ERROR.handler(
			apiError(500, {}),
			ctx('posts.list'),
		);
		const write = await errorHandlers.SERVER_ERROR.handler(
			apiError(500, {}),
			ctx('posts.create'),
		);
		expect(read.maxRetries).toBe(2);
		expect(write.maxRetries).toBe(0);
	});

	it('treats every write as non-idempotent', () => {
		expect(isNonIdempotent('posts.create')).toBe(true);
		expect(isNonIdempotent('posts.update')).toBe(true);
		expect(isNonIdempotent('webhooks.create')).toBe(true);
		expect(isNonIdempotent('posts.get')).toBe(false);
		expect(isNonIdempotent('accounts.getContext')).toBe(false);
	});

	it('does not retry auth, permission, not-found or validation errors', async () => {
		for (const [name, status] of [
			['AUTH_ERROR', 401],
			['PERMISSION_ERROR', 403],
			['NOT_FOUND_ERROR', 404],
			['VALIDATION_ERROR', 400],
		] as const) {
			const result = await errorHandlers[name].handler(
				apiError(status, { code: 'SCHEDULE_HORIZON_REACHED' }),
				ctx('posts.create'),
			);
			expect(result.maxRetries).toBe(0);
		}
	});
});
