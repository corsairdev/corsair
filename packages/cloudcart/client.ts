import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CloudcartAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'CloudcartAPIError';
	}
}

const CLOUDCART_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export function packCloudcartKey(apiKey: string, storeUrl: string): string {
	return JSON.stringify({ apiKey, storeUrl });
}

export function unpackCloudcartKey(packed: string): {
	apiKey: string;
	storeUrl: string;
} {
	try {
		const parsed: unknown = JSON.parse(packed);
		if (
			parsed !== null &&
			typeof parsed === 'object' &&
			!Array.isArray(parsed)
		) {
			const record = parsed as { apiKey?: unknown; storeUrl?: unknown };
			if (
				typeof record.apiKey === 'string' &&
				record.apiKey.length > 0 &&
				typeof record.storeUrl === 'string' &&
				record.storeUrl.length > 0
			) {
				return { apiKey: record.apiKey, storeUrl: record.storeUrl };
			}
		}
	} catch {
		throw new CloudcartAPIError(
			'CloudCart credentials must include an API key and store URL',
			'INVALID_CREDENTIALS',
		);
	}
	throw new CloudcartAPIError(
		'CloudCart credentials must include an API key and store URL',
		'INVALID_CREDENTIALS',
	);
}

export function buildCloudcartStoreUrl(storeUrl: string): string {
	const trimmed = storeUrl.trim();
	if (!trimmed) {
		throw new CloudcartAPIError('Store URL is required', 'INVALID_STORE_URL');
	}

	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new CloudcartAPIError('Store URL is invalid', 'INVALID_STORE_URL');
	}

	if (parsed.protocol !== 'https:') {
		throw new CloudcartAPIError(
			'Store URL must use HTTPS',
			'INVALID_STORE_URL',
		);
	}

	const path = parsed.pathname.replace(/\/+$/, '');
	if (path === '' || path === '/') {
		return `${parsed.origin}/api/v1`;
	}
	if (path.includes('/api')) {
		return `${parsed.origin}${path}`;
	}
	return `${parsed.origin}${path}/api/v1`;
}

export async function makeCloudcartRequest<T>(
	endpoint: string,
	packedKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!packedKey) {
		throw new CloudcartAPIError(
			'API key is required for CloudCart integration',
			'MISSING_API_KEY',
		);
	}

	const { apiKey, storeUrl } = unpackCloudcartKey(packedKey);
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: buildCloudcartStoreUrl(storeUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'X-CloudCart-ApiKey': apiKey,
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
			rateLimitConfig: CLOUDCART_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof CloudcartAPIError) {
			throw error;
		}
		throw error;
	}
}
