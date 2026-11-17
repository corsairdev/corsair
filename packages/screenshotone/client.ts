import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const SCREENSHOTONE_API_BASE = 'https://api.screenshotone.com';

/** ScreenshotOne's own render timeout goes up to 90 s (animations record up to 30 s), so wait longer than core's 20 s default. */
export const SCREENSHOTONE_TIMEOUT_MS = 100_000;

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export async function screenshotoneRequest<T>(
	apiKey: string | undefined,
	method: 'GET' | 'POST',
	url: string,
	query?: Record<string, string | number | boolean | undefined>,
	// unknown: any JSON-serialisable request body; each endpoint builds it from parsed input.
	body?: unknown,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SCREENSHOTONE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: SCREENSHOTONE_TIMEOUT_MS,
		// The key goes in the documented X-Access-Key header, not the access_key query
		// parameter: core's error redaction doesn't know access_key, so a query key would
		// end up in ApiError.url and ApiError.request.
		HEADERS: { Accept: 'application/json', 'X-Access-Key': apiKey ?? '' },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		...(query ? { query } : {}),
		...(body === undefined ? {} : { body, mediaType: 'application/json' }),
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

// Responses arrive as untyped JSON; callers narrow each field before use.
export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object'
		? (value as Record<string, unknown>)
		: undefined;
}

/** Drop access_key if a returned URL copied the request query. */
export function withoutAccessKey(value: string): string | undefined {
	try {
		const url = new URL(value);
		url.searchParams.delete('access_key');
		return url.toString();
	} catch {
		if (value.toLowerCase().includes('access_key')) return undefined;
		return value;
	}
}
