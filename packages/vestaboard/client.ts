import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class VestaboardAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'VestaboardAPIError';
	}
}

/**
 * Official Vestaboard Read/Write API Base.
 * Used for direct board reading and writing via Read/Write key.
 */
export const VESTABOARD_RW_API_BASE = 'https://rw.vestaboard.com';

/**
 * Official Vestaboard Platform API Base.
 * Used for multi-board subscriptions and viewer inspection.
 */
export const VESTABOARD_PLATFORM_API_BASE = 'https://platform.vestaboard.com';

export const VESTABOARD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type VestaboardRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	baseUrl?: string;
	apiSecret?: string;
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
};

/**
 * Builds OpenAPI configuration for Vestaboard requests.
 */
function buildConfig(
	key: string,
	baseUrl: string = VESTABOARD_RW_API_BASE,
	apiSecret?: string,
	extraHeaders?: Record<string, string>,
): OpenAPIConfig {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		...extraHeaders,
	};

	if (apiSecret) {
		headers['X-Vestaboard-Api-Key'] = key;
		headers['X-Vestaboard-Api-Secret'] = apiSecret;
	} else if (baseUrl.includes('rw.vestaboard.com')) {
		headers['X-Vestaboard-Read-Write-Key'] = key;
	} else {
		headers['X-Vestaboard-Token'] = key;
	}

	return {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: key,
		HEADERS: headers,
	};
}

/**
 * Dispatches an authenticated request to Vestaboard APIs.
 */
export async function makeVestaboardRequest<T>(
	endpoint: string,
	apiKey: string,
	options: VestaboardRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = VESTABOARD_RW_API_BASE,
		apiSecret,
		headers,
	} = options;

	const config = buildConfig(apiKey, baseUrl, apiSecret, headers);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? (body as Record<string, unknown>)
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: VESTABOARD_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new VestaboardAPIError(error.message);
		}
		throw new VestaboardAPIError('Unknown Vestaboard API error');
	}
}
