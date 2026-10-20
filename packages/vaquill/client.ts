import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class VaquillAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: string | null,
	) {
		super(message);
		this.name = 'VaquillAPIError';
	}
}

const VAQUILL_API_BASE = 'https://api.vaquill.ai/api/v1';

// Retrieval runs a hybrid dense+sparse search with a rerank, so a cold
// search is seconds, and includeBody pages pull up to 50 full statute texts
// alongside it. Well above the shared 20s default.
const VAQUILL_TIMEOUT_MS = 60_000;

// 429 policy belongs to error-handlers.ts, which replays within the
// endpoint's retry budget, so the transport makes a single attempt.
// Retry-After is still read into the thrown ApiError for the handlers.
const NO_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeVaquillRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Validated endpoint bodies are specific objects; a record type would
		// force a cast at every call.
		body?: object;
		query?: Record<string, string | number | boolean | undefined | string[]>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: VAQUILL_API_BASE,
		VERSION: '1.0.0',
		TIMEOUT: VAQUILL_TIMEOUT_MS,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_RETRY,
		});
		// The shared request throws ApiError, aborts, and network failures
		// alike, so the catch normalizes them below.
	} catch (error: unknown) {
		const status = error instanceof ApiError ? error.status : undefined;
		const retryAfter =
			error instanceof ApiError && error.retryAfter !== undefined
				? String(error.retryAfter)
				: undefined;

		if (error instanceof Error) {
			throw new VaquillAPIError(error.message, undefined, status, retryAfter);
		}
		throw new VaquillAPIError('Unknown error', undefined, status, retryAfter);
	}
}
