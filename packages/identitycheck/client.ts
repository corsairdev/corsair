import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';

// StackGo has not published field-level request or response schemas, so the
// body must remain open and the response unknown until the endpoint validates it.
export async function makeIdentityCheckRequest(
	method: 'GET' | 'POST',
	url: string,
	key: string,
	body?: Record<string, unknown>,
	responseType?: 'binary',
): Promise<unknown> {
	if (!key.trim()) throw new AuthMissingError('identitycheck', 'api_key');
	try {
		return await request(
			{
				BASE: 'https://identity.stackgo.io',
				VERSION: '1',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				HEADERS: { Authorization: `Basic ${key}` },
			},
			{
				method,
				url,
				...(body === undefined ? {} : { body, mediaType: 'application/json' }),
				...(responseType ? { responseType } : {}),
			},
			{
				rateLimitConfig: {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: 1000,
					backoffMultiplier: 2,
					headerNames: { retryAfter: 'retry-after' },
				},
			},
		);
	} catch (error) {
		throw withoutRequestBody(error);
	}
}

/**
 * Core keeps the request body on ApiError.request, and verification bodies
 * hold names, emails and phone numbers. Rebuild the error without the body;
 * status, response body and rate-limit data stay as they were.
 */
function withoutRequestBody(error: unknown): unknown {
	if (!(error instanceof ApiError) || error.request?.body === undefined)
		return error;
	return new ApiError(
		{ ...error.request, body: undefined },
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}
