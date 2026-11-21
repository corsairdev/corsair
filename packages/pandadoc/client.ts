import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * PandaDoc documents rate limits per API plan and answers 429 when a plan's
 * quota is exceeded. The 429 is refused before the call runs, so the
 * transport's retry with Retry-After is safe for the writes too; the plugin
 * error handlers add no second retry layer (R8).
 * https://developers.pandadoc.com/reference/limits
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
 * `status` and `retryAfter` from it, and management maps errors named
 * ApiError to their status), rebuilt without the request body and query.
 * Recipients and contact lookups carry email addresses, which core's own
 * ApiError keeps on the request.
 */
export function buildPandadocApiError(
	message: string,
	options: {
		method: string;
		/** Request path, without query. */
		path: string;
		status: number;
		statusText?: string;
		// unknown: error bodies can be the { type, detail } envelope or
		// non-JSON from a proxy.
		body?: unknown;
		retryAfter?: number;
	},
): ApiError {
	// Ids are opaque, but a path part that looks like an email is masked.
	const url = options.path
		.split('/')
		.map((part) =>
			part.includes('@') || part.toLowerCase().includes('%40')
				? '[email]'
				: part,
		)
		.join('/');
	return new ApiError(
		{ method: options.method as ApiRequestOptions['method'], url },
		{
			url,
			ok: false,
			status: options.status,
			statusText: options.statusText ?? '',
			body: options.body,
		},
		message,
		{ retryAfter: options.retryAfter },
	);
}

/**
 * Keeps only the diagnostic part of an error body: PandaDoc's `type` and
 * `detail` strings (emails masked), or a short plain-text body. Other keys a
 * validation error can echo (phone numbers, names, addresses) are dropped.
 */
// unknown: error bodies are arbitrary JSON until narrowed here.
export function safeErrorBody(body: unknown): unknown {
	if (typeof body === 'string') {
		return body.length <= 200 ? maskEmails(body) : undefined;
	}
	const record = asRecord(body);
	if (!record) return undefined;
	const safe: Record<string, string> = {};
	if (typeof record.type === 'string') safe.type = maskEmails(record.type);
	if (typeof record.detail === 'string')
		safe.detail = maskEmails(record.detail);
	return safe;
}

/**
 * Validation errors can echo what was sent (a 400 naming a bad recipient
 * email), so every string in an error body or message has email addresses
 * replaced before it goes on the error. Structure and other text stay.
 */
// unknown: error bodies are arbitrary JSON; the same shape comes back.
export function maskEmails<T>(value: T): T {
	if (typeof value === 'string') {
		// Token by token, no backtracking regex: any word with an @ is masked.
		return value
			.split(/(\s+)/)
			.map((token) => (token.includes('@') ? '[email]' : token))
			.join('') as T;
	}
	if (Array.isArray(value)) return value.map((item) => maskEmails(item)) as T;
	const record = asRecord(value);
	if (!record) return value;
	return Object.fromEntries(
		Object.entries(record).map(([key, item]) => [key, maskEmails(item)]),
	) as T;
}

/**
 * Extracts the readable part of a PandaDoc error body. Errors are
 * `{"type":"authentication_error","detail":"..."}` (verified live on
 * /public/v1/documents with and without credentials); validation answers use
 * the same envelope with a 400.
 */
export function describePandadocError(
	// unknown: the body is untyped until asRecord narrows it.
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		(typeof record?.detail === 'string' && record.detail.length > 0
			? record.detail
			: undefined) ??
		(typeof record?.type === 'string' && record.type.length > 0
			? record.type
			: undefined) ??
		fallback;
	return text;
}

export type PandadocQuery = Record<
	string,
	string | number | boolean | (string | number | boolean)[] | undefined
>;

export type PandadocRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: PandadocQuery;
	/** JSON body. Undefined sends no body. */
	// unknown: callers send whatever the input schema parsed; the client
	// cannot name a stricter body type across POST/PUT/PATCH shapes.
	body?: unknown;
	/** Set for the two document download routes, which answer application/pdf. */
	binary?: boolean;
};

/**
 * Authenticated PandaDoc request. API keys authenticate with a
 * literal-scheme header, `Authorization: API-Key <key>`, where "API-Key" is
 * the scheme itself and must not be replaced with Bearer.
 * https://developers.pandadoc.com/reference/api-key-authentication-process
 */
export async function makePandadocRequest(
	apiKey: string,
	{ method, path, query, body, binary }: PandadocRequest,
	// unknown: callers parse the response with the endpoint's zod output
	// schema, so the client cannot name a stricter return type.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: 'https://api.pandadoc.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `API-Key ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// documents.delete takes a `forever` query flag, so DELETE carries
		// query too, not just GET.
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? 'application/json'
				: undefined,
		responseType: binary ? 'binary' : undefined,
	};

	try {
		// unknown: the parsed body is whatever the endpoint's output schema
		// validates next; request() itself cannot name it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Rebuilt without the request (emails in recipient bodies, contact
			// list queries). Core's fallback message embeds the whole response
			// body, so the text comes from the provider's error or the status.
			// A short plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describePandadocError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw buildPandadocApiError(
				`PandaDoc ${error.status}: ${maskEmails(detail)}`,
				{
					method,
					path,
					status: error.status,
					statusText: error.statusText,
					body: safeErrorBody(error.body),
					retryAfter: error.retryAfter,
				},
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
