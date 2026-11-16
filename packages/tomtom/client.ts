import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TOMTOM_API_BASE = 'https://api.tomtom.com';

// Core retries a 429 three times, honouring Retry-After (R8). `resetTime` is
// left out: a daily-quota reset header would turn into a day-long wait.
const TOMTOM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A request that never reached TomTom (DNS, reset, timeout). HTTP failures are
 * not wrapped: core's `ApiError` passes through unchanged, so its `status`,
 * `retryAfter` and `body` (TomTom's `detailedError` envelope) reach core and
 * the caller. The key travels as the `key` query parameter, which ApiError
 * redacts.
 */
export class TomTomAPIError extends Error {
	/** The HTTP method of the failed request. */
	readonly method?: string;

	constructor(
		message: string,
		options: { cause?: Error; method?: string } = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'TomTomAPIError';
		this.method = options.method;
	}
}

/** TomTom's own error code from an ApiError body, e.g. `Unauthorized`. */
// unknown: the error body is untyped until the nested objects are read.
export function tomTomErrorCode(body: unknown): string | undefined {
	return readCode(body);
}

// unknown: the error body is untyped until the nested objects are read.
function readCode(body: unknown): string | undefined {
	const record = asRecord(body);
	const detailed = asRecord(record?.detailedError);
	if (typeof detailed?.code === 'string') return detailed.code;
	const error = asRecord(record?.error);
	return typeof error?.code === 'string' ? error.code : undefined;
}

export function describeTomTomError(
	status: number | undefined,
	// unknown: the body is the documented detailedError envelope, or a proxy page.
	body: unknown,
	fallback: string,
): { message: string; code?: string } {
	const record = asRecord(body);
	const detailed = asRecord(record?.detailedError);
	const error = asRecord(record?.error);
	const text =
		(typeof detailed?.message === 'string' && detailed.message) ||
		(typeof error?.description === 'string' && error.description) ||
		(typeof record?.message === 'string' && record.message) ||
		fallback;
	const code =
		(typeof detailed?.code === 'string' && detailed.code) ||
		(typeof error?.code === 'string' && error.code) ||
		undefined;
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	return { message: label ? `TomTom ${label}: ${text}` : text, code };
}

export type TomTomQuery = Record<
	string,
	string | number | boolean | string[] | undefined
>;

export type TomTomRequest = {
	method: 'GET';
	path: string;
	query?: TomTomQuery;
};

/**
 * TomTom takes the key as the `key` query parameter, which `ApiError` redacts,
 * so core's error passes through unchanged.
 */
export async function makeTomTomRequest(
	apiKey: string,
	{ method, path, query }: TomTomRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TOMTOM_API_BASE,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: { ...query, key: apiKey },
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TOMTOM_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof TomTomAPIError || error instanceof ApiError) {
			throw error;
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new TomTomAPIError(error.message, { cause: error, method });
		}
		throw new TomTomAPIError('Unknown TomTom error', { method });
	}
}

/**
 * Raster tiles are PNG bytes, which core's `request()` would decode as text and
 * corrupt, so the tile route is fetched here and returned as base64. A failure
 * still throws core's `ApiError` (with the key redacted by its URL handling) so
 * the same handlers apply.
 */
export async function fetchTomTomTile(
	apiKey: string,
	path: string,
): Promise<{ content_type: string; base64: string }> {
	const url = new URL(path, `${TOMTOM_API_BASE}/`);
	url.searchParams.set('key', apiKey);
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query: { key: apiKey },
	};
	let response: Response;
	try {
		response = await fetch(url, { headers: { Accept: 'image/png' } });
	} catch (error) {
		throw new TomTomAPIError(
			error instanceof Error ? error.message : 'TomTom tile request failed',
			{ method: 'GET' },
		);
	}
	if (!response.ok) {
		const type = response.headers.get('Content-Type') ?? '';
		const text = await response.text();
		let body: unknown = text; // unknown: JSON error envelope or plain text
		if (type.includes('json')) {
			try {
				body = JSON.parse(text);
			} catch {
				body = text;
			}
		}
		const seconds = Number(response.headers.get('Retry-After'));
		throw new ApiError(
			requestOptions,
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body,
			},
			describeTomTomError(response.status, body, response.statusText).message,
			{
				retryAfter:
					Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined,
			},
		);
	}
	const bytes = Buffer.from(await response.arrayBuffer());
	return {
		content_type: response.headers.get('Content-Type') ?? 'image/png',
		base64: bytes.toString('base64'),
	};
}

/** Joins two coordinates as `lat,lon`, which every TomTom path parameter takes. */
export function point(latitude: number, longitude: number): string {
	return `${latitude},${longitude}`;
}
