import { MailboxLayerAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiErrorWithCode(
	apiCode: number,
	status?: number,
): MailboxLayerAPIError {
	const error = new MailboxLayerAPIError('placeholder', { apiCode });
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
	it('classifies apiCode 101 (invalid_access_key) as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode(101))).toBe('AUTH_ERROR');
	});

	it('classifies apiCode 106 (inactive_user) as AUTH_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode(106))).toBe('AUTH_ERROR');
	});

	it('classifies apiCode 104 (usage_limit_reached) as QUOTA_ERROR, not AUTH_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode(104))).toBe('QUOTA_ERROR');
	});

	it('classifies apiCode 105 (https_access_restricted) as HTTPS_RESTRICTED_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode(105))).toBe(
			'HTTPS_RESTRICTED_ERROR',
		);
	});

	it('classifies apiCode 210 (no_email_address_supplied) as VALIDATION_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode(210))).toBe('VALIDATION_ERROR');
	});

	it('classifies apiCode 211 (invalid_email_address) as VALIDATION_ERROR', () => {
		expect(matchedHandlerName(apiErrorWithCode(211))).toBe('VALIDATION_ERROR');
	});

	it('classifies a 429 as RATE_LIMIT_ERROR regardless of apiCode', () => {
		const error = new MailboxLayerAPIError('rate limited');
		Object.assign(error, { status: 429 });
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('classifies Too Many Requests as RATE_LIMIT_ERROR', () => {
		expect(matchedHandlerName(new Error('Too Many Requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
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
		await errorHandlers.HTTPS_RESTRICTED_ERROR.handler();
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
