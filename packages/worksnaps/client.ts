import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The API base: `/api` on the host, with `.xml` on each resource. */
export const WORKSNAPS_BASE = 'https://api.worksnaps.com/api';

/**
 * The API is XML over HTTP with **HTTP Basic auth**, where the API token is the
 * *username* and the password is ignored entirely. There is no header-based
 * key, and the docs are explicit that only the token is used to authenticate.
 */
export const WORKSNAPS_AUTH_NOTE = 'token as basic-auth username';

const WORKSNAPS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

/**
 * The API has **no error body**: a 401 is a bare status with an empty
 * response, which is why there is no message to parse here. The status is the
 * whole diagnosis, so it is what the error carries.
 */
export class WorksnapsAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** The name of the operation that failed, e.g. `projects.list`. */
	readonly operation?: string;
	// unknown: usually empty, but a proxy can answer with HTML or text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
			operation?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'WorksnapsAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.operation = options.operation;
	}

	/**
	 * True for 401. The docs also mention a **partner token** for privileged
	 * calls such as creating a user, so a 403 means the token is a normal user's
	 * rather than a partner's — still an authorisation problem, but not a bad
	 * key.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/** True when a normal user token was used for a partner-only call. */
	get isPartnerOnly(): boolean {
		return this.status === 403;
	}

	/** True when the project, task or time entry does not exist. */
	get isNotFound(): boolean {
		return this.status === 404;
	}
}

// unknown: the body, read for a message if one ever appears.
export function describeWorksnapsError(
	status: number | undefined,
	// unknown: usually empty.
	body: unknown,
	fallback: string,
): string {
	const text = typeof body === 'string' && body.length > 0 ? body : fallback;
	return status ? `Worksnaps ${status}: ${text}` : text;
}

export type WorksnapsQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type WorksnapsRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: WorksnapsQuery;
	/** The XML request body, already serialized. */
	body?: string;
};

/** Encodes one path segment; ids are numbers in the API's routes. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Base64 of `token:`, which is what Basic auth sends. */
export function basicAuthHeader(token: string): string {
	// The password is ignored by the API, but Basic auth requires the colon.
	return `Basic ${Buffer.from(`${token}:`, 'utf8').toString('base64')}`;
}

// unknown: callers parse the text with the endpoint's zod output schema.
export async function makeWorksnapsRequest(
	apiKey: string,
	{ method, path, query, body }: WorksnapsRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: WORKSNAPS_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/xml',
			authorization: basicAuthHeader(apiKey),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/xml',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: WORKSNAPS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new WorksnapsAPIError(
				describeWorksnapsError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new WorksnapsAPIError(error.message, { cause: error, method });
		}
		throw new WorksnapsAPIError('Unknown Worksnaps error', { method });
	}
}

/** Narrows a caught value to this plugin's error. */
export function isWorksnapsFailure(error: unknown): error is WorksnapsAPIError {
	return error instanceof WorksnapsAPIError;
}
