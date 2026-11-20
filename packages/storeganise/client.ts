import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Storeganise documents no rate-limit contract, so 429s get core's standard
 * handling: up to three retries honouring Retry-After (R8: the plugin does
 * not retry a 429 again on top). The provider refused those requests before
 * running them, so a retry is safe for the one write too.
 */
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * A failed call throws this: core's `ApiError` (R8: core and the handlers
 * read `status` and `retryAfter` from it), rebuilt without the request body
 * and query. Unit-rental custom fields carry access codes, and user lookups
 * carry email addresses, which core's own ApiError keeps on the request.
 */
export class StoreganiseAPIError extends ApiError {
	/** The HTTP method of the failed request, for replay-safety decisions. */
	readonly method: string;

	constructor(
		message: string,
		options: {
			method: string;
			/** Request path, without query. */
			path: string;
			status: number;
			statusText?: string;
			// unknown: error bodies can be the { error: { type, message } }
			// envelope, a validation { errors } object, or non-JSON from a proxy.
			body?: unknown;
			retryAfter?: number;
		},
	) {
		// users.get takes an email address as the id; keep it out of the URL.
		const url = options.path.replace(/[^/]*(?:@|%40)[^/]*/g, '[email]');
		super(
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
		this.name = 'StoreganiseAPIError';
		this.method = options.method;
	}
}

const EMAIL = /[^\s@"'<>(),;:]+@[^\s@"'<>(),;:]+\.[a-z]{2,}/gi;

/**
 * Validation errors can echo what was sent (a 400 naming the email that is
 * taken), so every string in an error body or message has email addresses
 * replaced before it goes on the error. Structure and other text stay.
 */
// unknown: error bodies are arbitrary JSON; the same shape comes back.
export function maskEmails<T>(value: T): T {
	if (typeof value === 'string') return value.replace(EMAIL, '[email]') as T;
	if (Array.isArray(value)) return value.map((item) => maskEmails(item)) as T;
	const record = asRecord(value);
	if (!record) return value;
	return Object.fromEntries(
		Object.entries(record).map(([key, item]) => [key, maskEmails(item)]),
	) as T;
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
		throw new Error(
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
		if (error instanceof ApiError) {
			// Rebuilt without the request (access codes in PUT bodies, emails in
			// user paths). Core's fallback message embeds the whole response
			// body, so the text comes from the provider's error or the status.
			// A short plain-text body (the gateway's "Not Found") is shown as is.
			const textBody =
				typeof error.body === 'string' && error.body.length <= 200
					? error.body
					: undefined;
			const detail = describeStoreganiseError(
				error.body,
				textBody || error.statusText || 'request failed',
			);
			throw new StoreganiseAPIError(
				`Storeganise ${error.status}: ${maskEmails(detail)}`,
				{
					method,
					path,
					status: error.status,
					statusText: error.statusText,
					body: maskEmails(error.body),
					retryAfter: error.retryAfter,
				},
			);
		}
		// Timeouts and network failures carry no request data; let them through.
		throw error;
	}
}
