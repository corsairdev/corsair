import { AbuseIPDBAPIError } from './client';
import { errorHandlers } from './error-handlers';

function apiErrorWithBody(
	status: number,
	body: {
		errors?: Array<{ detail?: string; status?: number; source?: unknown }>;
	},
): AbuseIPDBAPIError {
	const error = new AbuseIPDBAPIError('placeholder', status);
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

const serverErrorHandler = errorHandlers.SERVER_ERROR.handler as (
	error: Error,
	context: {
		pluginId: string;
		operation: string;
		input: Record<string, unknown>;
		originalError: Error;
	},
) => Promise<{ maxRetries?: number; retryStrategy?: string }>;

describe('errorHandlers', () => {
	it('classifies a 429 as RATE_LIMIT_ERROR', () => {
		const error = apiErrorWithBody(429, {});
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});

	it('exposes the Retry-After header for rate-limit errors', async () => {
		const error = apiErrorWithBody(429, {});
		Object.assign(error, { retryAfter: 60_000 });

		const handler = errorHandlers.RATE_LIMIT_ERROR?.handler as
			| ((
					error: Error,
					context: {
						pluginId: string;
						operation: string;
						input: Record<string, unknown>;
						originalError: Error;
					},
			  ) => Promise<{
					maxRetries?: number;
					retryStrategy?: string;
					headersRetryAfterMs?: number;
			  }>)
			| undefined;
		const result = await handler?.(error, {
			pluginId: 'abuseipdb',
			operation: 'check.ip',
			input: { ipAddress: '1.1.1.1' },
			originalError: error,
		});
		expect(result).toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 60_000,
		});
	});

	it('classifies a 401 as AUTH_ERROR', () => {
		const error = apiErrorWithBody(401, {
			errors: [{ detail: 'Invalid API key', status: 401 }],
		});
		expect(matchedHandlerName(error)).toBe('AUTH_ERROR');
	});

	it('classifies a 422 as VALIDATION_ERROR', () => {
		const error = apiErrorWithBody(422, {
			errors: [
				{
					detail: 'ipAddress is a required field',
					status: 422,
					source: { parameter: 'ipAddress' },
				},
			],
		});
		expect(matchedHandlerName(error)).toBe('VALIDATION_ERROR');
	});

	it('classifies a 402 as PAYMENT_REQUIRED_ERROR', () => {
		const error = apiErrorWithBody(402, {
			errors: [
				{
					detail: 'This plan tier does not support blocks larger than /24',
					status: 402,
				},
			],
		});
		expect(matchedHandlerName(error)).toBe('PAYMENT_REQUIRED_ERROR');
	});

	it('classifies a 5xx as SERVER_ERROR', () => {
		const error = apiErrorWithBody(500, {
			errors: [{ detail: 'Internal Server Error', status: 500 }],
		});
		expect(matchedHandlerName(error)).toBe('SERVER_ERROR');
	});

	it('does not retry read endpoints on 5xx at the binder', async () => {
		const error = apiErrorWithBody(500, {});
		const result = await serverErrorHandler(error, {
			pluginId: 'abuseipdb',
			operation: 'check.ip',
			input: { ipAddress: '1.1.1.1' },
			originalError: error,
		});
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('does not retry report.ip on 5xx', async () => {
		const error = apiErrorWithBody(500, {});
		const result = await serverErrorHandler(error, {
			pluginId: 'abuseipdb',
			operation: 'report.ip',
			input: { ip: '1.1.1.1', categories: [18] },
			originalError: error,
		});
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('does not retry address.clear on 5xx', async () => {
		const error = apiErrorWithBody(500, {});
		const result = await serverErrorHandler(error, {
			pluginId: 'abuseipdb',
			operation: 'address.clear',
			input: { ipAddress: '1.1.1.1' },
			originalError: error,
		});
		expect(result).toEqual({ maxRetries: 0 });
	});

	it('falls through to DEFAULT for anything else', () => {
		const error = apiErrorWithBody(418, {});
		expect(matchedHandlerName(error)).toBe('DEFAULT');
	});

	it('treats a raw message about rate limiting as RATE_LIMIT_ERROR', () => {
		const error = new AbuseIPDBAPIError('Rate limit exceeded', 429);
		expect(matchedHandlerName(error)).toBe('RATE_LIMIT_ERROR');
	});
});
