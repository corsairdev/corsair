import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	ApiResult,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const THINKIFIC_API_BASE = 'https://api.thinkific.com/api/public/v1';

/**
 * Thinkific limits each site to 120 requests a minute. Its guide calls `RateLimit-Reset` both an
 * epoch time and "the amount of time (in milliseconds) until the rate limit resets". Core reads the
 * header as an epoch; a millisecond duration reads as a time in the past and core falls back to
 * this backoff, so the backoff alone spans the one-minute window (15 s, 30 s, 60 s).
 */
export const THINKIFIC_RATE_LIMIT_CONFIG = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 15_000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		resetTime: 'RateLimit-Reset',
	},
} satisfies RateLimitConfig;

export type ThinkificHttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ThinkificQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Turns what a user may paste for the site (`acme`, `acme.thinkific.com`,
 * `https://acme.thinkific.com/`) into the bare subdomain the `X-Auth-Subdomain` header takes.
 * The API host is fixed, so the value only selects the site and never becomes a URL.
 */
export function normalizeThinkificSubdomain(
	value: string | null | undefined,
): string | undefined {
	const trimmed = value
		?.trim()
		.toLowerCase()
		.replace(/^https?:\/\//, '')
		.replace(/\/.*$/, '')
		.replace(/\.thinkific\.com$/, '');
	return trimmed || undefined;
}

/**
 * Thinkific answers errors with `{ error: "..." }` or `{ errors: { field: ["message"] } }`. The
 * text names fields and rules, not submitted values, so it is kept for the caller to act on.
 */
function thinkificErrorText(
	// `unknown` because the error body is untrusted provider JSON.
	body: unknown,
): string | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const record = body as { error?: unknown; errors?: unknown };
	const describe = (
		// `unknown` because error values can be strings, arrays or nested objects.
		value: unknown,
	): string | undefined => {
		if (typeof value === 'string') return value;
		if (Array.isArray(value)) {
			const parts = value.map(describe).filter(Boolean);
			return parts.length ? parts.join('; ') : undefined;
		}
		if (typeof value === 'object' && value !== null) {
			const parts = Object.entries(value).map(([field, detail]) => {
				const text = describe(detail);
				return text ? `${field} ${text}` : field;
			});
			return parts.length ? parts.join('; ') : undefined;
		}
		return undefined;
	};
	const text = describe(record.error) ?? describe(record.errors);
	// Email addresses are masked in case a message quotes the submitted value.
	return text
		? text.replace(/[^\s@;:,"']+@[^\s@;:,"']+/g, '[email]').slice(0, 500)
		: undefined;
}

// `unknown` because the provider response remains untrusted until the operation output schema parses it.
export async function makeThinkificRequest(
	endpoint: string,
	apiKey: string | undefined,
	subdomain: string | undefined,
	options: {
		method: ThinkificHttpMethod;
		query?: ThinkificQuery;
		// `unknown` because endpoint request bodies have distinct Zod-inferred shapes and are validated before transport.
		body?: unknown;
	},
): Promise<unknown> {
	if (!apiKey) {
		throw new AuthMissingError('thinkific', 'api_key');
	}
	const site = normalizeThinkificSubdomain(subdomain);
	if (!site) {
		throw new AuthMissingError('thinkific', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: THINKIFIC_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Auth-API-Key': apiKey,
			'X-Auth-Subdomain': site,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: endpoint,
		body: options.body,
		mediaType: 'application/json; charset=utf-8',
		query: options.query,
	};

	try {
		// `unknown` because the shared transport returns unvalidated provider JSON.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: THINKIFIC_RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` because transport failures are not guaranteed to be Error instances.
		if (error instanceof ApiError) {
			const sanitizedRequest: ApiRequestOptions = {
				...error.request,
				url: '/thinkific/request',
				path: undefined,
				query: undefined,
				cookies: undefined,
				headers: undefined,
				formData: undefined,
				body: undefined,
			};
			const sanitizedResponse: ApiResult = {
				url: '/thinkific/request',
				ok: false,
				status: error.status,
				statusText: error.statusText,
				body: undefined,
			};
			const providerText = thinkificErrorText(error.body);

			throw new ApiError(
				sanitizedRequest,
				sanitizedResponse,
				providerText
					? `Thinkific API request failed with status ${error.status}: ${providerText}`
					: `Thinkific API request failed with status ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}

		throw new Error('Thinkific API request failed');
	}
}
