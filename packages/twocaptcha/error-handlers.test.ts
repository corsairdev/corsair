import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { TwoCaptchaAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

const context = {
	pluginId: 'twocaptcha',
	operation: 'tasks.result',
	input: {},
	originalError: new Error('x'),
};

function apiError(status: number, path: string) {
	return new ApiError(
		{ method: 'POST', url: path },
		{
			url: `https://api.2captcha.com${path}`,
			ok: false,
			status,
			statusText: 'error',
			body: {},
		},
		'failed',
	);
}

function firstMatch(error: Error) {
	// Each built-in matcher declares only the parameters it reads.
	const handlers: CorsairErrorHandler = errorHandlers;
	return Object.entries(handlers).find(([, entry]) =>
		entry?.match(error, { ...context, originalError: error }),
	)?.[0];
}

describe('2Captcha error handlers', () => {
	it('retries a full queue, because nothing was created', async () => {
		const error = new TwoCaptchaAPIError('x', {
			code: 'ERROR_NO_SLOT_AVAILABLE',
			method: 'createTask',
		});
		expect(firstMatch(error)).toBe('RATE_LIMIT_ERROR');
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(),
		).resolves.toMatchObject({ maxRetries: 3 });
	});

	it.each([
		['ERROR_ZERO_BALANCE', 'INSUFFICIENT_BALANCE_ERROR'],
		['ERROR_CAPTCHA_UNSOLVABLE', 'VALIDATION_ERROR'],
		['ERROR_BAD_PARAMETERS', 'VALIDATION_ERROR'],
		['ERROR_KEY_DOES_NOT_EXIST', 'AUTH_ERROR'],
		['ERROR_IP_NOT_ALLOWED', 'AUTH_ERROR'],
	])('does not retry %s', async (code, handler) => {
		const error = new TwoCaptchaAPIError('x', { code });
		expect(firstMatch(error)).toBe(handler);
	});

	it('retries a 5xx on a read but never on createTask', () => {
		expect(firstMatch(apiError(502, '/getTaskResult'))).toBe('SERVER_ERROR');
		expect(firstMatch(apiError(502, '/createTask'))).toBe('DEFAULT');
	});

	it('puts caller handlers first and keeps one DEFAULT last', () => {
		const custom = { match: () => true, handler: async () => ({}) };
		const merged = mergeErrorHandlers(errorHandlers, { AUTH_ERROR: custom });
		expect(merged.AUTH_ERROR).toBe(custom);
		expect(Object.keys(merged).at(-1)).toBe('DEFAULT');
	});
});
