import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

// Square sends this header on every request; without it Square falls back to
// the version pinned on the seller's application in the Developer Console.
export const SQUARE_API_VERSION = '2026-09-16';

// Square's production and sandbox hosts. Sandbox access tokens only work on
// the sandbox host and production tokens only on production.
export const SQUARE_BASE_URLS = {
	production: 'https://connect.squareup.com',
	sandbox: 'https://connect.squareupsandbox.com',
} as const;

export type SquareEnvironment = keyof typeof SQUARE_BASE_URLS;

// Retries are the error handlers' call (error-handlers.ts), so the transport
// makes one attempt. Core's default would retry every 429 three times on its
// own and stack with the handler's retries.
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

// Square error bodies are `{ errors: [{ category, code, detail?, field? }] }`.
const SquareErrorBodySchema = z.object({
	errors: z.array(
		z.object({
			category: z.string(),
			code: z.string(),
			detail: z.string().optional(),
			field: z.string().optional(),
		}),
	),
});

export type SquareErrorEntry = z.infer<
	typeof SquareErrorBodySchema
>['errors'][number];

export class SquareAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		// unknown: Square's raw error body, kept as received for the caller.
		public readonly body?: unknown,
		public readonly errors: SquareErrorEntry[] = [],
		// True when sending the same request again after a 5xx or a timeout
		// cannot repeat a side effect (see isRetrySafe). It does not govern 429s:
		// those were rejected before running, so every method may be retried.
		public readonly retrySafe: boolean = false,
	) {
		super(message);
		this.name = 'SquareAPIError';
	}
}

type QueryValue = string | number | boolean | undefined;

export type SquareRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// unknown: a request body is whatever JSON the operation's input schema
	// produced; it is validated before it gets here.
	body?: Record<string, unknown>;
	/** Sent as multipart/form-data; fetch sets the boundary. */
	formData?: FormData;
	/** Values for `{name}` placeholders in the endpoint; each is URI-encoded. */
	path?: Record<string, string | number>;
	query?: Record<string, QueryValue>;
	environment?: SquareEnvironment;
	// Set for read-only POSTs (search, calculate, bulk retrieve), which can be
	// repeated safely even though they have no idempotency_key.
	readOnly?: boolean;
};

// Whether a request may be sent again after a 5xx or a timeout, when the first
// attempt may or may not have run. GET, PUT and DELETE are idempotent by
// definition. A POST is safe only with the caller's idempotency_key (Square
// returns the first result for a repeated key) or when it only reads. A keyless
// mutating POST is never retried. The plugin never generates a key: the caller
// supplies it and it is sent unchanged on every attempt, so a retry cannot
// charge twice.
function isRetrySafe(options: SquareRequestOptions): boolean {
	const method = options.method ?? 'GET';
	if (method === 'GET' || method === 'PUT' || method === 'DELETE') return true;
	if (options.readOnly) return true;
	const key = options.body?.idempotency_key;
	return typeof key === 'string' && key.length > 0;
}

// One line per entry: `CODE: detail (field)`.
function describeSquareErrors(errors: SquareErrorEntry[]): string {
	return errors
		.map(
			(e) =>
				`${e.code}${e.detail ? `: ${e.detail}` : ''}${e.field ? ` (${e.field})` : ''}`,
		)
		.join('\n');
}

export async function makeSquareRequest<T>(
	endpoint: string,
	token: string,
	options: SquareRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		formData,
		path,
		query,
		environment = 'production',
	} = options;

	// `request` turns TOKEN into `Authorization: Bearer <token>`.
	const config: OpenAPIConfig = {
		BASE: SQUARE_BASE_URLS[environment],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: { 'Square-Version': SQUARE_API_VERSION },
		ENCODE_PATH: encodeURIComponent,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		// A FormData body goes out as is; fetch sets the multipart boundary.
		...(formData
			? { body: formData }
			: body !== undefined
				? { body, mediaType: 'application/json' }
				: {}),
	};

	const retrySafe = isRetrySafe(options);

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const parsed = SquareErrorBodySchema.safeParse(error.body);
			const errors = parsed.success ? parsed.data.errors : [];
			throw new SquareAPIError(
				errors.length > 0 ? describeSquareErrors(errors) : error.message,
				error.status,
				error.retryAfter,
				error.body,
				errors,
				retrySafe,
			);
		}
		if (error instanceof Error) {
			throw new SquareAPIError(
				error.message,
				undefined,
				undefined,
				undefined,
				[],
				retrySafe,
			);
		}
		// A thrown value that is not an Error (for example a timeout DOMException
		// from another realm) still gets the right retry flag.
		throw new SquareAPIError(
			'Unknown error',
			undefined,
			undefined,
			undefined,
			[],
			retrySafe,
		);
	}
}

/** What the endpoints pass in: the resolved token and, for OAuth, a way to refresh it. */
export type SquareAuthContext = {
	key: string;
	/**
	 * Set by the plugin's keyBuilder for OAuth connections (core's
	 * getOAuthAccessToken); absent for an API key or a static `key` option.
	 */
	_refreshAuth?: () => Promise<string>;
};

/**
 * Sends the request with `auth.key`. On a 401 with a refresh available it
 * refreshes the token and sends the request once more; a second 401 is the
 * caller's error. A 401 means Square rejected the request before running it,
 * so sending it again cannot repeat a side effect, keyless POSTs included.
 */
export async function makeAuthenticatedSquareRequest<T>(
	endpoint: string,
	auth: SquareAuthContext,
	options: SquareRequestOptions = {},
): Promise<T> {
	try {
		return await makeSquareRequest<T>(endpoint, auth.key, options);
	} catch (error) {
		if (
			error instanceof SquareAPIError &&
			error.status === 401 &&
			auth._refreshAuth
		) {
			const freshToken = await auth._refreshAuth();
			return await makeSquareRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
