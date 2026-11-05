import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

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
	return JSON.stringify({ apiKey, storeUrl: normalizeStoreUrl(storeUrl) });
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

/**
 * Normalizes a store URL for credential packing so the same store always
 * packs to the same key regardless of trailing slashes or casing.
 */
function normalizeStoreUrl(storeUrl: string): string {
	return stripTrailingSlashes(storeUrl.trim());
}

/**
 * Strips trailing slashes without a regex: avoids polynomial-backtracking
 * warnings on uncontrolled input and keeps the intent obvious.
 */
function stripTrailingSlashes(value: string): string {
	let end = value.length;
	while (end > 0 && value[end - 1] === '/') {
		end -= 1;
	}
	return value.slice(0, end);
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

	const host = parsed.hostname.toLowerCase();
	if (
		host !== 'cloudcart.com' &&
		!host.endsWith('.cloudcart.com') &&
		host !== 'cloudcart.net' &&
		!host.endsWith('.cloudcart.net')
	) {
		throw new CloudcartAPIError(
			'Store URL must be a CloudCart host',
			'INVALID_STORE_URL',
		);
	}

	const path = stripTrailingSlashes(parsed.pathname);
	if (path === '' || path === '/') {
		return `${parsed.origin}/api/v2`;
	}
	if (path.endsWith('/api/v2') || path.endsWith('/v2')) {
		return `${parsed.origin}${path}`;
	}
	if (path === '/api' || path.endsWith('/api')) {
		return `${parsed.origin}${path}/v2`;
	}
	// Migrate legacy v1 base paths forward to the current v2 API.
	if (path.endsWith('/api/v1')) {
		return `${parsed.origin}${path.slice(0, -'/api/v1'.length)}/api/v2`;
	}
	if (path.endsWith('/v1')) {
		return `${parsed.origin}${path.slice(0, -'/v1'.length)}/v2`;
	}
	return `${parsed.origin}${path}/api/v2`;
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
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Auth is the X-CloudCart-ApiKey header only. TOKEN must stay
		// undefined: any truthy value also sends Authorization: Bearer,
		// which the CloudCart API does not document or expect.
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/vnd.api+json',
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
		mediaType: 'application/vnd.api+json',
		query: method === 'GET' ? query : undefined,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig:
			method === 'GET'
				? CLOUDCART_RATE_LIMIT_CONFIG
				: { ...CLOUDCART_RATE_LIMIT_CONFIG, enabled: false, maxRetries: 0 },
	});
}
