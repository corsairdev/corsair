import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Storeganise documents no rate-limit contract for the API, so the plugin
 * keeps one retry layer: the transport does not retry (maxRetries: 0, no
 * plugin handler for 429 either), and a 429 fails immediately. headerNames
 * stays filled so a real Retry-After still reaches the error for callers.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export class StoreganiseAPIError extends Error {
	readonly status?: number;
	/** The unmodified response body, when there was one. */
	// unknown: error bodies can be the { error: { type, message } } envelope,
	// a validation { errors } object, or non-JSON from a proxy.
	readonly body?: unknown;
	/** Milliseconds to wait before retrying, from Retry-After. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'StoreganiseAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}
}

/**
 * Extracts the readable part of a Storeganise error body. Errors are
 * `{"error":{"type":"Unauthorized","message":"Not authorized"}}` (verified
 * live on every admin route); 400 validation errors additionally carry an
 * `errors` object. https://help.storeganise.com/article/331-system-error-list
 */
export function describeStoreganiseError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const error = asRecord(record?.error);
	const text =
		(typeof error?.message === 'string' && error.message.length > 0
			? error.message
			: undefined) ??
		(typeof error?.type === 'string' && error.type.length > 0
			? error.type
			: undefined) ??
		(typeof record?.error === 'string' && record.error.length > 0
			? record.error
			: undefined) ??
		fallback;
	return text;
}

/**
 * Builds the API base for one business code. The code is interpolated into a
 * URL, so anything outside the slug alphabet Storeganise issues is rejected
 * here instead of producing a malformed request.
 */
export function baseForBusiness(businessCode: string): string {
	if (!/^[a-z0-9][a-z0-9-]*$/i.test(businessCode)) {
		throw new StoreganiseAPIError(
			`Invalid Storeganise business code: ${JSON.stringify(
				businessCode,
			)} is not a subdomain slug`,
		);
	}
	return `https://${businessCode.toLowerCase()}.storeganise.com/api/v1`;
}

export type StoreganiseQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type StoreganiseRequest = {
	method: 'GET' | 'PUT';
	/** Full API base for this account's business code. */
	base: string;
	path: string;
	query?: StoreganiseQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across PUT shapes.
	body?: unknown;
};

// unknown: callers parse the response with the endpoint's zod output schema,
// so the client cannot name a stricter return type.
/**
 * Authenticated Storeganise request. Admin API keys authenticate with a
 * literal-scheme header, `Authorization: ApiKey <key>`, where "ApiKey" is
 * the scheme itself and must not be replaced.
 * https://help.storeganise.com/article/33-developer-settings
 */
export async function makeStoreganiseRequest(
	apiKey: string,
	{ method, base, path, query, body }: StoreganiseRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `ApiKey ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: method === 'GET' ? query : undefined,
		body: method === 'PUT' ? body : undefined,
		mediaType: method === 'PUT' ? 'application/json' : undefined,
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Rethrow our own error untouched; the branches below would re-wrap it
		// and drop its fields.
		if (error instanceof StoreganiseAPIError) throw error;
		if (error instanceof ApiError) {
			const detail = describeStoreganiseError(error.body, error.message);
			throw new StoreganiseAPIError(
				error.status === undefined
					? detail
					: `Storeganise ${error.status}: ${detail}`,
				{ cause: error, status: error.status, body: error.body, method },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new StoreganiseAPIError(error.message, { cause: error, method });
		}
		throw new StoreganiseAPIError('Unknown Storeganise error', { method });
	}
}
