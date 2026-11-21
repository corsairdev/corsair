import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Payhip documents no rate-limit retry contract, so 429s get core's
 * standard handling: up to three retries honouring Retry-After (R8: the
 * plugin adds no second retry layer). A 429 is refused before the call
 * runs, so a retry is safe for the writes too.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A failed call throws core's `ApiError` (R8: core and the handlers read
 * `status` and `retryAfter` from it), rebuilt with only the method and the
 * path. License keys and buyer emails ride in the request query and form
 * body, which core's own ApiError keeps on `request`.
 */
function strippedApiError(
	error: ApiError,
	method: PayhipRequest['method'],
	path: string,
	message: string,
): ApiError {
	return new ApiError(
		{ method, url: path },
		{
			url: path,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		message,
		{ retryAfter: error.retryAfter },
	);
}

/**
 * Extracts the readable part of a Payhip error body. Errors are
 * `{"code":"authentication_fail","message":"failed to authenticate","success":false}`
 * (verified live with an invalid key on coupons and license routes).
 */
export function describePayhipError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.message === 'string' && record.message.length > 0
			? record.message
			: undefined) ??
		(typeof record?.code === 'string' && record.code.length > 0
			? record.code
			: undefined) ??
		// License routes answer an unknown key (or a key from another
		// product) with a bare 400 {"data":[],"error":true}, seen live.
		(record?.error === true
			? "refused; for a license call the key is not one of this product's license keys"
			: undefined) ??
		fallback;
	return text;
}

export type PayhipQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PayhipRequest = {
	method: 'GET' | 'POST' | 'PUT';
	path: string;
	query?: PayhipQuery;
	/**
	 * Form-encoded body, built with URLSearchParams; the API takes
	 * form-encoded bodies, not JSON.
	 */
	form?: Record<string, string>;
	/** Which credential authenticates this request. */
	auth: 'account' | 'product';
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Payhip request. Coupon operations authenticate with the
 * account API key in the payhip-api-key header; license-key operations
 * authenticate with the per-product secret in the product-secret-key
 * header, as the reference documents separately for each group.
 * https://payhip.com/api-reference
 */
export async function makePayhipRequest(
	/** The account API key for coupon calls, the product secret for license calls. */
	credential: string,
	{ method, path, query, form, auth }: PayhipRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://payhip.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The literal header names are the API's own spellings; TOKEN would
		// render Bearer, which Payhip does not use. Each request carries only
		// the credential its route takes.
		HEADERS: {
			Accept: 'application/json',
			...(auth === 'product'
				? { 'product-secret-key': credential }
				: { 'payhip-api-key': credential }),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body: form ? new URLSearchParams(form).toString() : undefined,
		mediaType: form ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (license keys, buyer emails). Core's
			// fallback message embeds the whole response body, so the text
			// comes from the provider's error or the status. A short
			// plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describePayhipError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw strippedApiError(
				error,
				method,
				path,
				`Payhip ${error.status}: ${detail}`,
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
