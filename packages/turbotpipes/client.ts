import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// Writes are not idempotent (creates, commands, chat), so the shared HTTP
// client must not replay them internally on 429. Reads keep default retries.
const NO_RETRY: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export class TurbotPipesAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown: Turbot Pipes error bodies are JSON objects, strings, or omitted.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

	constructor(
		message: string,
		options?: {
			cause?: Error;
			code?: string;
			status?: number;
			// unknown: same as body above. The provider does not fix an error shape.
			body?: unknown;
			retryAfter?: number;
			method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'TurbotPipesAPIError';
		this.code = options?.code;
		this.status = options?.status;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
		this.method = options?.method;

		if (options?.cause instanceof ApiError) {
			this.status = this.status ?? options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = this.retryAfter ?? options.cause.retryAfter;
		}
	}
}

const TURBOTPIPES_API_BASE = 'https://pipes.turbot.com/api/v1';

/**
 * Encodes one caller value as a single URL path segment.
 *
 * Handles and ids come from callers, and Corsair checks permissions by
 * endpoint name, not by URL. A raw value such as `../../../../acme` would
 * otherwise retarget the request after URL normalization (for example from a
 * permission delete to `DELETE /org/acme`).
 *
 * Empty values, dot segments and path separators are rejected outright: no
 * Pipes handle or id contains them, and some servers decode `%2F` before
 * routing, so encoding alone is not enough. Everything else is encoded.
 */
export function pathSegment(value: string | number): string {
	const segment = String(value);
	if (
		segment === '' ||
		segment === '.' ||
		segment === '..' ||
		/[/\\]/.test(segment)
	) {
		throw new Error(
			`Invalid Turbot Pipes path segment ${JSON.stringify(segment)}: handles and ids must be non-empty, cannot be "." or "..", and cannot contain "/" or "\\".`,
		);
	}
	return encodeURIComponent(segment);
}

function authorizationHeader(apiKey: string): string {
	return apiKey.startsWith('Bearer ') || apiKey.startsWith('api key ')
		? apiKey
		: `Bearer ${apiKey}`;
}

type QueryValue = string | number | boolean | undefined;

/**
 * Picks the named query parameters from an endpoint input. Only these keys
 * reach the query string, so path handles and body fields never leak into it.
 */
export function pickQuery<T extends object, K extends keyof T & string>(
	input: T,
	keys: readonly K[],
): Record<string, QueryValue> {
	const query: Record<string, QueryValue> = {};
	for (const key of keys) {
		const value = input[key];
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key] = value;
		}
	}
	return query;
}

/**
 * Performs an HTTP request to the Turbot Pipes API.
 * Auth: Bearer Token in Authorization header (e.g., Bearer tpt_...).
 */
export async function makeTurbotPipesRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: endpoint bodies are per-operation objects validated by zod input schemas.
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const formattedToken = authorizationHeader(apiKey);

	const config: OpenAPIConfig = {
		BASE: TURBOTPIPES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: formattedToken,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: query,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			// undefined selects the shared default (retries on) for reads.
			rateLimitConfig: method === 'GET' ? undefined : NO_RETRY,
		});
		// 204 No Content (and other empty bodies) come back undefined; callers
		// always get an object instead. A JSON null body stays null.
		return (response === undefined ? {} : response) as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new TurbotPipesAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new TurbotPipesAPIError('Unknown Turbot Pipes API error', {
			method,
		});
	}
}

/**
 * Resolves an avatar endpoint to a directly usable image URL.
 *
 * Avatar endpoints answer with a redirect to the hosted image (or the bytes
 * themselves). The shared JSON HTTP client would read binary bodies as text
 * and corrupt them, so this helper never downloads the body: it follows the
 * redirect chain manually and returns the final public URL instead.
 */
export async function getTurbotPipesAvatarUrl(
	endpoint: string,
	apiKey: string,
): Promise<{ avatar_url: string }> {
	const formattedToken = authorizationHeader(apiKey);

	const response = await fetch(`${TURBOTPIPES_API_BASE}/${endpoint}`, {
		method: 'GET',
		headers: {
			Authorization: formattedToken,
		},
		redirect: 'manual',
	});

	if (response.status >= 200 && response.status < 400) {
		const location = response.headers.get('location');
		if (location) {
			// Location may be relative; resolve it against the API origin so
			// callers always receive an absolute, directly usable URL.
			return {
				avatar_url: new URL(location, `${TURBOTPIPES_API_BASE}/${endpoint}`)
					.href,
			};
		}
		return { avatar_url: `${TURBOTPIPES_API_BASE}/${endpoint}` };
	}

	throw new TurbotPipesAPIError(
		`Failed to resolve avatar: ${response.status} ${response.statusText}`,
		{ status: response.status, method: 'GET' },
	);
}

/**
 * GETs a text body, such as a process log (`application/jsonlines+json`).
 *
 * The shared HTTP client parses any `application/json*` content type as one
 * JSON document, so a JSON-lines body with more than one line fails to parse
 * and comes back empty. This reads the raw text instead; 204 gives ''.
 */
export async function makeTurbotPipesTextRequest(
	endpoint: string,
	apiKey: string,
	accept: string,
): Promise<string> {
	const response = await fetch(`${TURBOTPIPES_API_BASE}/${endpoint}`, {
		method: 'GET',
		headers: { Authorization: authorizationHeader(apiKey), Accept: accept },
	});
	if (response.status === 204) {
		return '';
	}
	const text = await response.text();
	if (!response.ok) {
		const retryAfterSeconds = Number(response.headers.get('retry-after'));
		throw new TurbotPipesAPIError(
			`Turbot Pipes request failed: ${response.status} ${response.statusText}`,
			{
				status: response.status,
				body: text,
				retryAfter:
					Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
						? retryAfterSeconds * 1000
						: undefined,
				method: 'GET',
			},
		);
	}
	return text;
}
