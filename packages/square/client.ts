import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
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

/**
 * Square's `errors[]` from a failed call: core's ApiError keeps Square's body
 * as `body`, and its message is only the HTTP status text. Returns no entries
 * for anything else, or for a body that is not in Square's shape. Reads the
 * error; never changes it.
 */
// unknown: callers pass whatever a rejected call threw.
export function squareErrors(error: unknown): SquareErrorEntry[] {
	if (!(error instanceof ApiError)) return [];
	const parsed = SquareErrorBodySchema.safeParse(error.body);
	return parsed.success ? parsed.data.errors : [];
}

/** A system error code such as ECONNRESET or UND_ERR_CONNECT_TIMEOUT. */
const SYSTEM_CODE = /^[A-Z][A-Z0-9_]{1,63}$/;

/** A JavaScript error name such as TypeError or AbortError. */
const ERROR_NAME = /^[A-Za-z]{1,64}$/;

/**
 * The `code` of a failure, or of its cause (undici puts it there), when it
 * looks like a system error code; anything else is dropped.
 */
// unknown: a rejection, or its cause, can be any value.
function systemCode(failure: unknown): string | undefined {
	const nested =
		typeof failure === 'object' && failure !== null && 'cause' in failure
			? failure.cause
			: undefined;
	for (const candidate of [failure, nested]) {
		if (typeof candidate !== 'object' || candidate === null) continue;
		const code = 'code' in candidate ? candidate.code : undefined;
		if (typeof code === 'string' && SYSTEM_CODE.test(code)) return code;
	}
	return undefined;
}

/**
 * The request got no response from Square: the connection dropped or timed
 * out. Square may or may not have run it. The message and `cause` carry only
 * the failure's error name and system code: fetch's own messages can quote
 * the request's headers, the access token included.
 */
export class SquareNetworkError extends Error {
	// unknown: whatever fetch rejected with (a TypeError, a DOMException, ...).
	// Only its name and system code are read; its message is never kept.
	constructor(failure: unknown) {
		const name =
			failure instanceof Error && ERROR_NAME.test(failure.name)
				? failure.name
				: 'Error';
		const code = systemCode(failure);
		const label = code ? `${name} ${code}` : name;
		const cause = Object.assign(new Error(label), {
			name,
			...(code ? { code } : {}),
		});
		super(`Square request got no response (${label})`, { cause });
		this.name = 'SquareNetworkError';
	}
}

/**
 * Refuses a token with a CR, LF or NUL, which no HTTP header can carry. fetch
 * would reject it with a message that quotes the header, token and all, so it
 * is stopped here with a message that does not.
 */
function assertSendableToken(token: string): void {
	if (/[\r\n\0]/.test(token)) {
		throw new Error(
			'The Square access token contains a line break or control character; check how it was stored.',
		);
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
};

/**
 * Sends one request to Square. Core's request() retries a 429 up to three
 * times and honours Retry-After; any other failure is thrown as core's
 * ApiError, unchanged, so its status and retryAfter reach the error handlers
 * and core. A request that got no response at all becomes a
 * SquareNetworkError. A token no header can carry is refused before
 * anything is sent. Whether a 5xx or a network failure is retried is the
 * error handlers' call (error-handlers.ts), by operation.
 */
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

	assertSendableToken(token);
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new SquareNetworkError(error);
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
			error instanceof ApiError &&
			error.status === 401 &&
			auth._refreshAuth
		) {
			const freshToken = await auth._refreshAuth();
			return await makeSquareRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
