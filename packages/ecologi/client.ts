import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ECOLOGI_API_BASE = 'https://public.ecologi.com';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function ecologiGet<T>(url: string): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ECOLOGI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url };
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

/**
 * POST to the Impact API with the account's key as a Bearer token. These calls
 * buy trees, carbon or habitat and are billed monthly, unless `test` is true.
 * https://docs.ecologi.com/
 */
export async function ecologiPurchase<T>(
	apiKey: string,
	url: string,
	// JSON body built by the endpoint from its parsed zod input.
	body: Record<string, unknown>,
	idempotencyKey?: string,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: ECOLOGI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		body,
		mediaType: 'application/json',
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		throw withoutPersonalData(error);
	}
}

/** Body fields that can hold a person's name or email address. */
const PERSONAL_FIELDS = ['name', 'recipientEmail'] as const;

/**
 * Core's ApiError keeps `request.body`, which here can hold the funded-by name
 * and a recipient's email. Rebuild it with those fields redacted; status, body,
 * URL and rate-limit fields stay the same, so the error handlers still match it.
 */
export function withoutPersonalData(error: unknown): unknown {
	const sent = error instanceof ApiError ? error.request.body : undefined;
	if (!(error instanceof ApiError) || !sent || typeof sent !== 'object') {
		return error;
	}
	const body: Record<string, unknown> = { ...sent };
	for (const field of PERSONAL_FIELDS) {
		if (body[field] !== undefined) body[field] = '[REDACTED]';
	}
	const rebuilt = new ApiError(
		{ ...error.request, body },
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
	rebuilt.stack = error.stack;
	return rebuilt;
}
