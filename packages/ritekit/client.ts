import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const RITEKIT_API_BASE = 'https://api.ritekit.com';

/**
 * RiteKit has no error-body standard: a refusal is `result: false` alongside a
 * `message`, an optional `code` that repeats the HTTP status, and sometimes an
 * `info` string pointing at the docs. Live:
 *
 * ```json
 * {"result":false,"message":"Endpoint is not accessible","info":"Please make sure you authenticate…","code":401}
 * {"result":false,"message":"Verification failed","code":401}
 * ```
 *
 * Note the shape: `result: false` and `code: 401` in the body of a 401. A key
 * that RiteKit does not recognise gets "Verification failed"; a call with no key
 * at all gets "Endpoint is not accessible". Neither is a 200, so the status is
 * still the first signal.
 */
export class RiteKitAPIError extends Error {
	readonly status?: number;
	/** The body's `code`, which repeats the HTTP status when present. */
	readonly code?: number;
	/** A hint RiteKit adds, such as a link to the auth docs. */
	readonly info?: string;
	/** Milliseconds from a Retry-After header, when RiteKit sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: number;
			info?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RiteKitAPIError';
		this.status = options.status;
		this.code = options.code;
		this.info = options.info;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * A rejected Client ID, or a call with none. RiteKit answers both with 401,
	 * so the message is the only way to tell them apart.
	 */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** The Client ID is valid but the plan does not cover this endpoint. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** The endpoint, hashtag, domain or URL RiteKit was asked about is unknown. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A parameter RiteKit refused, including an unusable URL or email. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}

	/**
	 * Out of monthly credits, which retrying cannot fix. A 429 is the per-second
	 * rate limit instead, which a short wait clears.
	 */
	get isQuotaExhausted(): boolean {
		return this.status === 402;
	}
}

/**
 * Reads a refusal body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function refusal(body: unknown): {
	message?: string;
	code?: number;
	info?: string;
	result?: boolean;
} {
	const record = asRecord(body);
	const message = record?.message;
	const info = record?.info;
	const code = record?.code;
	const result = record?.result;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		info: typeof info === 'string' && info.length > 0 ? info : undefined,
		code: typeof code === 'number' ? code : undefined,
		result: typeof result === 'boolean' ? result : undefined,
	};
}

/**
 * Builds the message for an error body, keeping RiteKit's `info` hint because it
 * usually names the fix.
 * unknown: the body is untyped until `refusal` narrows it.
 */
export function describeRiteKitError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, info, code } = refusal(body);
	const text = message ?? fallback;
	const parts = [status];
	// RiteKit's code repeats the status, so it is only added when it differs.
	if (code !== undefined && code !== status) parts.push(code);
	const label = parts.filter((part) => part !== undefined).join(' ');
	const head = label ? `RiteKit ${label}: ${text}` : text;
	return info ? `${head} (${info})` : head;
}

/**
 * A query value. RiteKit's parameters are all scalars, and a repeated key such as
 * `tags=jobs,hello` is a joined string rather than an array, because the API
 * splits on commas itself.
 */
export type RiteKitQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RiteKitRequest = {
	method: 'GET' | 'POST';
	/** Path below the host, starting with a slash. */
	path: string;
	query?: RiteKitQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
	/** Overrides the JSON accept header, for an endpoint that answers with a URL. */
	accept?: string;
	/** Overrides corsair/http's 20 s default, for a route RiteKit answers slowly. */
	timeoutMs?: number;
	/**
	 * The route answers with the image itself rather than JSON. corsair/http reads
	 * a non-JSON body as text, which corrupts the bytes, so these calls are
	 * fetched here and returned as a data URL.
	 */
	binary?: boolean;
};

/** What a binary route resolves to: the image as a data URL. */
export type RiteKitImage = {
	url: string;
	contentType: string;
	bytes: number;
};

const RITEKIT_IMAGE_TIMEOUT_MS = 60_000;

/**
 * Fetches a route that answers with an image. A refusal still arrives as JSON
 * and goes through the same error mapping as every other call; the URL, which
 * carries the Client ID, is never put in an error.
 */
async function fetchRiteKitImage(
	apiKey: string,
	path: string,
	query: RiteKitQuery | undefined,
	replayable: boolean,
): Promise<RiteKitImage> {
	const url = new URL(path, RITEKIT_API_BASE);
	for (const [name, value] of Object.entries(query ?? {})) {
		if (value !== undefined && name !== 'client_id') {
			url.searchParams.set(name, String(value));
		}
	}
	url.searchParams.set('client_id', apiKey);

	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method: 'GET',
			headers: { Accept: 'image/*, application/json' },
			signal: AbortSignal.timeout(RITEKIT_IMAGE_TIMEOUT_MS),
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Unknown RiteKit error';
		throw new RiteKitAPIError(message, { method: 'GET', replayable });
	}

	const contentType = response.headers.get('content-type') ?? '';
	if (!response.ok || !contentType.startsWith('image/')) {
		// unknown: a refusal body is provider JSON, or text when it is not JSON.
		let body: unknown;
		try {
			body = contentType.includes('json')
				? await response.json()
				: await response.text();
		} catch {
			body = undefined;
		}
		const fields = refusal(body);
		const fallback = response.ok
			? `RiteKit answered ${contentType || 'no content type'} where an image was expected`
			: response.statusText || 'Request failed';
		throw new RiteKitAPIError(
			describeRiteKitError(response.status, body, fallback),
			{
				status: response.status,
				code: fields.code,
				info: fields.info,
				method: 'GET',
				replayable,
			},
		);
	}

	const bytes = Buffer.from(await response.arrayBuffer());
	const type = contentType.split(';')[0]?.trim() || 'image/png';
	return {
		url: `data:${type};base64,${bytes.toString('base64')}`,
		contentType: type,
		bytes: bytes.length,
	};
}

/**
 * RiteKit allows **100 calls per second** across all endpoints. It documents no
 * Retry-After, so the handler backs off on its own and reads the header only if
 * one arrives. Running out of monthly credits is a separate problem and is not
 * retried.
 */
const RITEKIT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The Client ID travels as the `client_id` query parameter. RiteKit documents
 * that as the transport for every call, and the SDK does the same, so it is put
 * here rather than in a header. It is the one credential the plugin needs; there
 * is no token exchange.
 */
function configWith(apiKey: string): OpenAPIConfig {
	return {
		BASE: RITEKIT_API_BASE,
		VERSION: 'v1/v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRiteKitRequest(
	apiKey: string,
	{
		method,
		path,
		query,
		body,
		replayable,
		accept,
		timeoutMs,
		binary,
	}: RiteKitRequest,
): Promise<unknown> {
	if (binary) return fetchRiteKitImage(apiKey, path, query, replayable);

	const config = configWith(apiKey);
	if (accept) config.HEADERS = { Accept: accept };
	if (timeoutMs) config.TIMEOUT = timeoutMs;

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		// The Client ID is added to every call, after the caller's own parameters so
		// a stray `client_id` in an input cannot replace it.
		query: { ...query, client_id: apiKey },
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RITEKIT_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = refusal(error.body);
			// The cause holds the request, and with it the Client ID, so the fields
			// the handlers need are copied and the cause is dropped.
			throw new RiteKitAPIError(
				describeRiteKitError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					info: fields.info,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RiteKitAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RiteKitAPIError('Unknown RiteKit error', { method, replayable });
	}
}
