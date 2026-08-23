import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WitAiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'WitAiAPIError';
	}
}

// Wit.ai API base URL
const WITAI_API_BASE = 'https://api.wit.ai';

// Current stable Wit.ai API version
const WITAI_API_VERSION = '20240304';

const WITAI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeWitAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: WITAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	// Wit.ai requires a version query param on every request
	const queryWithVersion: Record<
		string,
		string | number | boolean | undefined
	> = {
		v: WITAI_API_VERSION,
		...(method === 'GET' ? query : {}),
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: queryWithVersion,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: WITAI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Preserve ApiError as-is so status/retryAfter stay available to
		// error-handlers.ts (e.g. the 429 rate-limit matcher relies on
		// `error instanceof ApiError` and `error.status`/`error.retryAfter`).
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new WitAiAPIError(error.message);
		}
		throw new WitAiAPIError('Unknown error');
	}
}
