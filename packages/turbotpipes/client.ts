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
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const formattedToken =
		apiKey.startsWith('Bearer ') || apiKey.startsWith('api key ')
			? apiKey
			: `Bearer ${apiKey}`;

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
		return response;
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
	const formattedToken =
		apiKey.startsWith('Bearer ') || apiKey.startsWith('api key ')
			? apiKey
			: `Bearer ${apiKey}`;

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
