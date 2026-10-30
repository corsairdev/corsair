import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HeygenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HeygenAPIError';
	}
}

const HEYGEN_API_BASE = 'https://api.heygen.com';
const HEYGEN_UPLOAD_BASE = 'https://upload.heygen.com';

const HEYGEN_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		limit: 'X-RateLimit-Limit',
		remaining: 'X-RateLimit-Remaining',
		resetTime: 'X-RateLimit-Reset',
	},
};

export type HeygenQueryValue =
	| string
	| number
	| boolean
	| (string | number)[]
	| undefined;

type HeygenRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// body shape varies per endpoint and is validated by callers via typed Zod input schemas before being passed here
	body?: Record<string, unknown>;
	query?: Record<string, HeygenQueryValue>;
	headers?: Record<string, string>;
};

export async function makeHeygenRequest<T>(
	endpoint: string,
	apiKey: string,
	options: HeygenRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;

	const config: OpenAPIConfig = {
		BASE: HEYGEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-Api-Key': apiKey,
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
		query,
		headers,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: HEYGEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// Preserve ApiError (status, retryAfter) unchanged so error-handlers.ts can inspect it.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new HeygenAPIError(error.message);
		}
		throw new HeygenAPIError('Unknown HeyGen API error');
	}
}

// The shared `request()` core JSON.stringify's any body that isn't already a string,
// Blob, or FormData — which would corrupt raw bytes. Converting to a Blob up front lets
// it pass through untouched and sends the exact bytes over the wire.
export function base64ToBlob(base64: string, contentType: string): Blob {
	const bytes = Buffer.from(base64, 'base64');
	return new Blob([bytes], { type: contentType });
}

/**
 * Sends a `multipart/form-data` request with a `file` field, used by the v3 asset upload
 * endpoint (`POST /v3/assets`), which — unlike the legacy v1/v2 upload host — expects a real
 * multipart body rather than raw bytes as the request body.
 */
export async function makeHeygenMultipartRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'POST' | 'PUT';
		file: Blob;
		query?: Record<string, HeygenQueryValue>;
	},
): Promise<T> {
	const { method = 'POST', file, query } = options;

	const config: OpenAPIConfig = {
		BASE: HEYGEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-Api-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		formData: { file },
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: HEYGEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new HeygenAPIError(error.message);
		}
		throw new HeygenAPIError('Unknown HeyGen API error');
	}
}

/**
 * Sends a raw binary body (image/video/audio bytes) to HeyGen's upload host, used by
 * asset upload and talking-photo upload, which take the file contents directly rather
 * than a JSON envelope.
 */
export async function makeHeygenUploadRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'POST' | 'PUT';
		body: Blob;
		contentType: string;
		query?: Record<string, HeygenQueryValue>;
	},
): Promise<T> {
	const { method = 'POST', body, contentType, query } = options;

	const config: OpenAPIConfig = {
		BASE: HEYGEN_UPLOAD_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-Api-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: contentType,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: HEYGEN_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new HeygenAPIError(error.message);
		}
		throw new HeygenAPIError('Unknown HeyGen API error');
	}
}
