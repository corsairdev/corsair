import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const LINGUAPOP_API_BASE = 'https://app.linguapop.eu';

/** Both documented operations live under this prefix. */
export const LINGUAPOP_ACTIONS_PATH = '/api/actions';

// Retries live in error-handlers.ts, so the client makes one attempt and only
// reads Retry-After into the error. Linguapop documents no rate limit and no
// Retry-After header; the config stays complete anyway because corsair/http
// replaces its defaults wholesale and throws on a partial `headerNames`.
const LINGUAPOP_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

const MAX_DETAIL_LENGTH = 300;

/**
 * Linguapop authenticates with an `apiKey` field inside the JSON request body.
 * corsair/http redacts query parameters in an `ApiError` but never the body, and
 * `ApiError.request.body` holds the key. So this error copies only `status`,
 * `method` and `retryAfter` off the `ApiError`, keeps no body, and attaches a
 * `cause` for transport failures only (a dropped connection never held one).
 */
export class LinguapopAPIError extends Error {
	readonly status?: number;
	/** The HTTP method of the failed request; replay safety depends on it. */
	readonly method?: string;
	/** Milliseconds from a Retry-After header, when Linguapop sent one. */
	readonly retryAfter?: number;
	/** True when Linguapop answered that no active integration owns the key. */
	readonly invalidApiKey: boolean;
	/** True when no HTTP response arrived: DNS, reset, abort or timeout. */
	readonly transport: boolean;
	/** True when the request was aborted or timed out. */
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			// Only ever a transport error; see the class comment.
			cause?: Error;
			status?: number;
			method?: string;
			retryAfter?: number;
			invalidApiKey?: boolean;
			transport?: boolean;
			timedOut?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'LinguapopAPIError';
		this.status = options.status;
		this.method = options.method;
		this.retryAfter = options.retryAfter;
		this.invalidApiKey = options.invalidApiKey ?? false;
		this.transport = options.transport ?? false;
		this.timedOut = options.timedOut ?? false;
	}

	/** True for a 429. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** True for a bad or archived key, or a 401/403. */
	get isAuthError(): boolean {
		return this.invalidApiKey || this.status === 401 || this.status === 403;
	}
}

/**
 * Linguapop answers 400 with `text/plain` for a key it does not recognise
 * ("No active integration with specified apiKey found.", seen live) and with an
 * ASP.NET `application/problem+json` body for a failed validation
 * (`{ title, errors: { Field: [message] } }`, also seen live).
 */
const INVALID_KEY_PATTERN = /no active integration/i;

/**
 * A response body: a JSON array or object, plain text, problem+json, or an HTML
 * page from the app's fallback route or a proxy, depending on the route and the
 * status. Callers narrow it with a zod schema or a `typeof` check.
 */
export type LinguapopResponseBody = unknown; // unknown: the shape depends on the route and status, so no stricter type fits.

export function isInvalidApiKeyBody(
	status: number,
	body: LinguapopResponseBody,
): boolean {
	return (
		status === 400 && typeof body === 'string' && INVALID_KEY_PATTERN.test(body)
	);
}

function detailOf(body: LinguapopResponseBody): string | undefined {
	if (typeof body === 'string') {
		const text = body.trim();
		// A proxy's HTML page says nothing a caller can act on.
		return text && !text.startsWith('<') ? text : undefined;
	}
	if (typeof body !== 'object' || body === null) return undefined;
	const record = body as Record<string, unknown>; // unknown: narrowed per field below.
	const messages: string[] = [];
	const errors = record.errors;
	if (typeof errors === 'object' && errors !== null) {
		for (const [field, value] of Object.entries(errors)) {
			const list = Array.isArray(value) ? value : [value];
			for (const message of list) {
				if (typeof message === 'string') {
					messages.push(field ? `${field}: ${message}` : message);
				}
			}
		}
	}
	if (messages.length > 0) return messages.join('; ');
	return typeof record.title === 'string' ? record.title : undefined;
}

/**
 * Builds the message from the response body, with the key scrubbed in case
 * Linguapop ever echoes a submitted value back.
 */
export function describeLinguapopError(
	status: number,
	body: LinguapopResponseBody,
	apiKey: string,
): string {
	let detail = detailOf(body);
	if (detail && apiKey) detail = detail.split(apiKey).join('[redacted]');
	if (detail && detail.length > MAX_DETAIL_LENGTH) {
		detail = `${detail.slice(0, MAX_DETAIL_LENGTH)}...`;
	}
	return detail ? `Linguapop ${status}: ${detail}` : `Linguapop HTTP ${status}`;
}

type LinguapopBody = Record<string, string | number | boolean | undefined>;

export type LinguapopRequest = {
	method: 'GET' | 'POST';
	/** Action name under `/api/actions`, such as `getLanguages`. */
	action: string;
	/** POST only. The `apiKey` field is added here and always wins. */
	body?: LinguapopBody;
};

// Callers parse the body with the endpoint's zod output schema, which rejects
// the 200 `text/html` Linguapop answers for a route that does not exist.
export async function makeLinguapopRequest(
	apiKey: string,
	{ method, action, body }: LinguapopRequest,
): Promise<LinguapopResponseBody> {
	const config: OpenAPIConfig = {
		BASE: LINGUAPOP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};

	// The key goes in the body, after the caller's fields so none can replace
	// it. GET sends no key: getLanguages answered without one on a live probe,
	// and a GET has no body to hold it without putting it in the URL.
	const requestOptions: ApiRequestOptions = {
		method,
		url: `${LINGUAPOP_ACTIONS_PATH}/${action}`,
		body: method === 'POST' ? { ...body, apiKey } : undefined,
		mediaType: method === 'POST' ? 'application/json' : undefined,
	};

	try {
		return await request<LinguapopResponseBody>(config, requestOptions, {
			rateLimitConfig: LINGUAPOP_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new LinguapopAPIError(
				describeLinguapopError(error.status, error.body, apiKey),
				{
					status: error.status,
					method,
					retryAfter: error.retryAfter,
					invalidApiKey: isInvalidApiKeyBody(error.status, error.body),
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new LinguapopAPIError(error.message, {
				cause: error,
				method,
				transport: true,
				timedOut: error.name === 'TimeoutError' || error.name === 'AbortError',
			});
		}
		throw new LinguapopAPIError('Unknown Linguapop transport error', {
			method,
			transport: true,
		});
	}
}
