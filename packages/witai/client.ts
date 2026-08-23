import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class WitAiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
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
	};

	if (method === 'GET' && query) {
		for (const [key, val] of Object.entries(query)) {
			if (val !== undefined) {
				queryWithVersion[key] = val;
			}
		}
	}

	console.log(
		`[WitAi Request] Calling: ${method} ${WITAI_API_BASE}/${endpoint}`,
	);
	console.log(`[WitAi Request] Query:`, queryWithVersion);
	console.log(`[WitAi Request] Headers:`, {
		...config.HEADERS,
		Authorization: `Bearer ${apiKey ? apiKey.substring(0, 5) + '...' : 'undefined'}`,
	});

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
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
		if (error instanceof Error) {
			throw new WitAiAPIError(error.message);
		}
		throw new WitAiAPIError('Unknown error');
	}
}
