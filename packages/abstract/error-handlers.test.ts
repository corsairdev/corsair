import { AbstractAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiErrorWithBody(
	status: number,
	body: { error?: { message?: string; code?: string } },
): AbstractAPIError {
	const error = new AbstractAPIError('placeholder', status);
	Object.assign(error, { status, body });
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
	it('classifies a 422 with quota wording as QUOTA_ERROR, not VALIDATION_ERROR', () => {
		// Confirmed against live keys: Email Reputation returns 422 (not 429)
		// when the account's plan quota is exhausted.
		const error = apiErrorWithBody(422, {
			error: {
				message: 'You have exceeded the request quota for your plan.',
				code: 'quota_exceeded',
			},
		});

		expect(matchedHandlerName(error)).toBe('QUOTA_ERROR');
	});

	it('still classifies a genuine 422 malformed-parameter response as VALIDATION_ERROR', () => {
		const error = apiErrorWithBody(422, {
			error: {
				message: 'email is a required field',
				code: 'validation_error',
			},
		});

		expect(matchedHandlerName(error)).toBe('VALIDATION_ERROR');
	});

	it('classifies a 429 as RATE_LIMIT_ERROR regardless of body content', () => {
		const error = apiErrorWithBody(429, {});
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});
});
