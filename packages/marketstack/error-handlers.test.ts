import { MarketstackAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiErrorWithCode(
	apiCode: string,
	status?: number,
): MarketstackAPIError {
	const error = new MarketstackAPIError('placeholder', { apiCode });
	if (status !== undefined) {
		Object.assign(error, { status });
	}
	return error;
}

function matchedHandlerName(error: Error): string {
	const name = Object.keys(errorHandlers).find((key) =>
		errorHandlers[key as keyof typeof errorHandlers].match(error),
	);
	if (!name) throw new Error('no handler matched');
	return name;
}

describe('errorHandlers', () => {
	it('classifies invalid_access_key as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode('invalid_access_key'))).toBe(
			'AUTH_ERROR',
		);
	});

	it('classifies a 401 status as AUTH_ERROR regardless of apiCode', () => {
		const error = new MarketstackAPIError('unauthorized');
		Object.assign(error, { status: 401 });
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies usage_limit_reached as QUOTA_ERROR, not AUTH_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode('usage_limit_reached'))).toBe(
			'QUOTA_ERROR',
		);
	});

	it('classifies https_access_restricted as PLAN_RESTRICTED_ERROR', () => {
		expect(
			matchedHandlerName(apiErrorWithCode('https_access_restricted')),
		).toBe('PLAN_RESTRICTED_ERROR');
	});

	it('classifies a 403 status as PLAN_RESTRICTED_ERROR', () => {
		const error = new MarketstackAPIError('forbidden');
		Object.assign(error, { status: 403 });
		expect(matchedHandlerName(error)).toBe('PLAN_RESTRICTED_ERROR');
	});

	it('classifies validation_error as VALIDATION_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode('validation_error'))).toBe(
			'VALIDATION_ERROR',
		);
	});

	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		const error = new MarketstackAPIError('rate limited');
		Object.assign(error, { status: 429 });
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies Too Many Requests as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(new Error('Too Many Requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
	});

	it('classifies a 500 status as SERVER_ERROR', () => {
		const error = new MarketstackAPIError('server exploded');
		Object.assign(error, { status: 500 });
		expect(matchedHandlerName(error)).toBe('SERVER_ERROR');
	});

	it('falls back to DEFAULT for an unrecognized error', () => {
		const error = new Error('something unexpected');
		expect(matchedHandlerName(error)).toBe('DEFAULT');
	});

	it('does not log from handlers', async () => {
		const log = jest.spyOn(console, 'log').mockImplementation(() => {});
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const error = jest.spyOn(console, 'error').mockImplementation(() => {});

		await errorHandlers.AUTH_ERROR.handler();
		await errorHandlers.QUOTA_ERROR.handler();
		await errorHandlers.PLAN_RESTRICTED_ERROR.handler();
		await errorHandlers.VALIDATION_ERROR.handler();
		await errorHandlers.DEFAULT.handler();

		expect(log).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
		expect(error).not.toHaveBeenCalled();
		log.mockRestore();
		warn.mockRestore();
		error.mockRestore();
	});
});
