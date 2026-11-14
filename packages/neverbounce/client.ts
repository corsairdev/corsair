import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { CheckInput } from './endpoints/types';

export class NeverBounceAPIError extends Error {
	constructor(
		public readonly status: string,
		message: string,
	) {
		super(message);
		this.name = 'NeverBounceAPIError';
	}
}

const NEVERBOUNCE_BASE = 'https://api.neverbounce.com/v4.2';
// Core's own default; a longer verification `timeout` stretches it below.
const DEFAULT_TRANSPORT_TIMEOUT_MS = 20_000;
// Room for network latency on top of NeverBounce's verification time.
const TRANSPORT_MARGIN_MS = 5_000;
const EMAIL_PATTERN = /[^\s'"<>@]+@[^\s'"<>@]+/g;

/**
 * NeverBounce error messages echo what they were given: an `auth_failure`
 * reads "Invalid API key '<key>'". The key and the checked address are cut
 * out, so the rest of the provider's explanation can stay.
 */
function redactMessage(message: string, secrets: string[]): string {
	let redacted = message;
	for (const secret of secrets) {
		if (secret) redacted = redacted.split(secret).join('[REDACTED]');
	}
	return redacted.replace(EMAIL_PATTERN, '[REDACTED]');
}

function redactEmailInUrl(url: string): string {
	return url.replace(/([?&]email=)[^&#]*/g, '$1[REDACTED]');
}

/**
 * Core's `ApiError` already redacts `key`, but keeps the checked address in
 * the URL and query. It is rebuilt with the same status and rate-limit fields
 * so the error handlers still match it, minus the address.
 */
function sanitizeApiError(error: ApiError, email: string): ApiError {
	const query = error.request.query
		? Object.fromEntries(
				Object.entries(error.request.query).map(([name, value]) => [
					name,
					name === 'email' ? '[REDACTED]' : value,
				]),
			)
		: undefined;
	// unknown: an error body is untyped (JSON from NeverBounce or text from a proxy).
	const body: unknown =
		typeof error.body === 'string'
			? redactMessage(error.body, [email])
			: error.body;
	return new ApiError(
		{
			...error.request,
			url: redactEmailInUrl(error.request.url),
			...(query ? { query } : {}),
		},
		{
			url: redactEmailInUrl(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body,
		},
		redactMessage(error.message, [email]),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// HTTP responses are untrusted; the endpoint validates success data with Zod,
// so assigning a more specific return type here would assume that validation.
export async function makeNeverBounceRequest(
	apiKey: string,
	query: CheckInput,
): Promise<unknown> {
	if (!apiKey) throw new AuthMissingError('neverbounce', 'api_key');
	// `timeout` is how long NeverBounce may spend verifying; the fetch must
	// outlast it or a slow but successful check is cut off on our side.
	const transportTimeout = Math.max(
		DEFAULT_TRANSPORT_TIMEOUT_MS,
		(query.timeout ?? 0) * 1000 + TRANSPORT_MARGIN_MS,
	);
	// Keep the raw response unknown until the endpoint's Zod schema validates it.
	let result: unknown;
	try {
		// Core retries an HTTP 429 itself (three times, honouring Retry-After):
		// NeverBounce refused the request before verifying, so nothing was spent.
		result = await request(
			{
				BASE: NEVERBOUNCE_BASE,
				VERSION: '4.2',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				TIMEOUT: transportTimeout,
			},
			{ method: 'GET', url: '/single/check', query: { ...query, key: apiKey } },
		);
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error, query.email);
		throw error;
	}
	// NeverBounce reports its own failures (bad key, throttling, bad input) as
	// HTTP 200 with a `status` other than `success` and a `message`.
	if (typeof result === 'object' && result !== null && 'status' in result) {
		const status = result.status;
		if (typeof status === 'string' && status !== 'success') {
			const providerMessage =
				'message' in result && typeof result.message === 'string'
					? redactMessage(result.message, [apiKey, query.email])
					: 'request failed';
			throw new NeverBounceAPIError(
				status,
				`NeverBounce ${status}: ${providerMessage}`,
			);
		}
	}
	return result;
}
