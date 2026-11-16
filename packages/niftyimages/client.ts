import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NIFTYIMAGES_API_BASE = 'https://api.niftyimages.com/v1';

// Retries belong to error-handlers.ts. NiftyImages documents no Retry-After, so
// the name is kept only so a proxy that sends one is honoured.
const NIFTYIMAGES_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * NiftyImages documents five status codes and one error body:
 * `{ "message": "Your API Key does not appear to be valid" }` on a 401. A 404
 * answers an ASP.NET HTML page rather than JSON, so the absence of a message is
 * itself the signal that the path was wrong rather than the key.
 *
 * Every unauthenticated request answers 401 whatever the path, so a wrong route
 * cannot be told from a wrong key without a working key.
 */
export class NiftyimagesAPIError extends Error {
	readonly status?: number;
	/** The provider's `message`, when the body was JSON. */
	readonly detail?: string;
	/** True when the answer was an HTML page rather than the JSON API. */
	readonly htmlResponse: boolean;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			detail?: string;
			htmlResponse?: boolean;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NiftyimagesAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.htmlResponse = options.htmlResponse ?? false;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A 401 is a missing or invalid key; there is no other 401. */
	get isAuthError(): boolean {
		return this.status === 401;
	}
}

// unknown: see NiftyimagesAPIError.
export function describeNiftyimagesError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	if (typeof body === 'string' && body.trimStart().startsWith('<')) {
		return `NiftyImages ${status ?? ''}: the API answered an HTML page instead of JSON, which means the path does not exist.`.trim();
	}
	const message = readString(asRecord(body), 'message');
	const text = message ?? fallback;
	const label = status === undefined ? '' : `NiftyImages ${status}: `;
	return `${label}${text}`;
}

export type NiftyimagesQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type NiftyimagesRequest = {
	method: 'GET';
	path: string;
	query?: NiftyimagesQuery;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNiftyimagesRequest(
	apiKey: string,
	{ method, path, query }: NiftyimagesRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NIFTYIMAGES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// The header form, rather than the query or Basic alternatives the docs
		// also allow, so the key stays out of a URL that a proxy would log.
		HEADERS: { Accept: 'application/json', ApiKey: apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: NIFTYIMAGES_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const isHtml =
				typeof error.body === 'string' &&
				error.body.trimStart().startsWith('<');
			throw new NiftyimagesAPIError(
				describeNiftyimagesError(error.status, error.body, error.message),
				{
					status: error.status,
					detail: readString(asRecord(error.body), 'message'),
					htmlResponse: isHtml,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NiftyimagesAPIError(error.message, { cause: error, method });
		}
		throw new NiftyimagesAPIError('Unknown NiftyImages error', { method });
	}
}

/** Encodes one path segment. Widget keys are GUIDs but user ids may not be. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
