import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * CraftMyPDF runs the same API in several regions, and the docs recommend
 * picking the one nearest the caller. Singapore is the default.
 * https://support.craftmypdf.com/regional-api-endpoints
 */
export const CRAFTMYPDF_API_BASE = 'https://api.craftmypdf.com/v1';

export type CraftmypdfRegion = 'sg' | 'de' | 'us' | 'au';

const CRAFTMYPDF_HOSTS: Record<CraftmypdfRegion, string> = {
	sg: 'https://api.craftmypdf.com/v1',
	de: 'https://api-de.craftmypdf.com/v1',
	us: 'https://api-us.craftmypdf.com/v1',
	au: 'https://api-au.craftmypdf.com/v1',
};

/**
 * A synchronous PDF call can take up to 100 seconds on the primary regional
 * hosts, so the 20 second default would abort a call that was going to succeed.
 */
const CRAFTMYPDF_TIMEOUT_MS = 120_000;

// error-handlers.ts owns retries, so the transport makes one attempt and only
// reads Retry-After into the error.
const CRAFTMYPDF_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the body is an untyped error body until asRecord narrows it.
function readMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const message = readString(record, 'message');
	// Some failures add a `details` explanation, for example
	// "Failed to load from remote URL" beside the message.
	const details = readString(record, 'details');
	if (!message) return undefined;
	return details ? `${message} (${details})` : message;
}

// unknown: same open error body as readMessage.
function readStatus(body: unknown): string | undefined {
	const status = asRecord(body)?.status;
	return typeof status === 'string' ? status : undefined;
}

// unknown: same open error body as readMessage.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * CraftMyPDF answers every failure with `{ status: 'error', message }`, and a
 * bad key is a **400**, not a 401, so the status alone cannot tell an auth
 * failure from a malformed body. `message` is the only thing that separates
 * them, which is why it is matched in error-handlers.ts.
 */
export class CraftmypdfAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	/** Milliseconds from a Retry-After header, when CraftMyPDF sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** CraftMyPDF's own `status` field, `error` on every failure seen so far. */
	readonly envelopeStatus?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			envelopeStatus?: string;
		} = {},
	) {
		// Only the numeric fields and the message survive: an ApiError cause
		// carries the request body, and a create call body holds the template
		// data.
		super(message);
		this.name = 'CraftmypdfAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.envelopeStatus = options.envelopeStatus;
	}

	/** True for a throttled call: an HTTP 429 with no message of its own. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** True when CraftMyPDF rejected the API key. */
	get isAuthFailure(): boolean {
		return this.status === 400 && isAuthMessage(this.message);
	}
}

/** The wordings CraftMyPDF uses for a rejected key, across its two handlers. */
export function isAuthMessage(message: string): boolean {
	const lower = message.toLowerCase();
	return (
		lower.includes('invalid api key') ||
		lower.includes('invalid api key or token') ||
		lower.includes('api key is missing') ||
		lower.includes('missing api key')
	);
}

export type CraftmypdfQueryValue = string | number | boolean | undefined;

export type CraftmypdfRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: Record<string, CraftmypdfQueryValue>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

export type CraftmypdfClientOptions = {
	region?: CraftmypdfRegion;
};

/** Builds the base URL for a region; unknown ids fall back to the default. */
export function resolveBase(region?: string): string {
	if (region && region in CRAFTMYPDF_HOSTS) {
		return CRAFTMYPDF_HOSTS[region as CraftmypdfRegion];
	}
	return CRAFTMYPDF_API_BASE;
}

// unknown: callers parse the body with the endpoint's zod output schema, so
// the transport returns it unvalidated.
export async function makeCraftmypdfRequest(
	apiKey: string,
	{ method, path, query, body }: CraftmypdfRequest,
	options: CraftmypdfClientOptions = {},
): Promise<unknown> {
	const hasBody = method === 'POST';

	const config: OpenAPIConfig = {
		BASE: resolveBase(options.region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: CRAFTMYPDF_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', 'X-API-KEY': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body: hasBody ? (body ?? {}) : undefined,
		mediaType: hasBody ? 'application/json' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: CRAFTMYPDF_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const message =
				readMessage(error.body) ?? `CraftMyPDF HTTP ${error.status}`;
			throw new CraftmypdfAPIError(message, {
				status: error.status,
				retryAfter: error.retryAfter,
				method: error.request.method,
				envelopeStatus: readStatus(error.body),
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new CraftmypdfAPIError(error.message, { method });
		}
		throw new CraftmypdfAPIError('Unknown CraftMyPDF error', { method });
	}
}
