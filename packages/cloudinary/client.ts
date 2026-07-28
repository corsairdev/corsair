import { createHash, timingSafeEqual } from 'node:crypto';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CloudinaryAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'CloudinaryAPIError';
	}
}

export type CloudinaryCredentials = {
	apiKey: string;
	apiSecret: string;
	cloudName: string;
};

const CLOUDINARY_ADMIN_BASE = 'https://api.cloudinary.com/v1_1';
const CLOUDINARY_LIVE_BASE = 'https://api.cloudinary.com/v2/video';

/** Fields Cloudinary excludes from upload signature strings. */
const UNSIGNED_UPLOAD_KEYS = new Set([
	'file',
	'cloud_name',
	'resource_type',
	'api_key',
	'signature',
]);

const CLOUDINARY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		remaining: 'X-FeatureRateLimit-Remaining',
		resetTime: 'X-FeatureRateLimit-Reset',
	},
};

/** Reject notification signatures older than one hour (Cloudinary's documented window). */
const NOTIFICATION_MAX_AGE_SEC = 60 * 60;

export function parseCloudinaryCredentials(key: string): {
	apiKey: string;
	apiSecret: string;
} {
	const separator = key.indexOf(':');
	if (separator === -1) {
		throw new CloudinaryAPIError(
			'Cloudinary credentials must be in api_key:api_secret format',
		);
	}
	return {
		apiKey: key.slice(0, separator),
		apiSecret: key.slice(separator + 1),
	};
}

/**
 * Build a Cloudinary authentication signature (SHA-1 by default).
 * Excludes file/cloud_name/resource_type/api_key/signature; arrays become
 * comma-separated values matching Cloudinary's REST signing rules.
 */
export function signCloudinaryParams(
	params: Record<string, unknown>,
	apiSecret: string,
	algorithm: 'sha1' | 'sha256' = 'sha1',
): string {
	const sorted = Object.keys(params)
		.filter(
			(key) =>
				!UNSIGNED_UPLOAD_KEYS.has(key) &&
				params[key] !== undefined &&
				params[key] !== null,
		)
		.sort()
		.map((key) => {
			const value = params[key];
			if (Array.isArray(value)) {
				return `${key}=${value.map((item) => flattenFormValue(item)).join(',')}`;
			}
			return `${key}=${flattenFormValue(value)}`;
		})
		.join('&');

	return createHash(algorithm)
		.update(sorted + apiSecret)
		.digest('hex');
}

function adminBaseUrl(cloudName: string): string {
	return `${CLOUDINARY_ADMIN_BASE}/${cloudName}`;
}

function uploadBaseUrl(cloudName: string, resourceType: string): string {
	return `${CLOUDINARY_ADMIN_BASE}/${cloudName}/${resourceType}`;
}

function liveBaseUrl(cloudName: string): string {
	return `${CLOUDINARY_LIVE_BASE}/${cloudName}`;
}

function basicAuthHeader(credentials: CloudinaryCredentials): string {
	return `Basic ${Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64')}`;
}

function flattenFormValue(value: unknown): string {
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

function toUrlSearchParams(body: Record<string, unknown>): URLSearchParams {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		// Upload/Admin form params use comma-separated multi-values, not key[].
		if (Array.isArray(value)) {
			params.append(key, value.map((item) => flattenFormValue(item)).join(','));
			continue;
		}
		params.append(key, flattenFormValue(value));
	}
	return params;
}

export function encodeCloudinaryFormBody(
	body: Record<string, unknown>,
): string {
	return toUrlSearchParams(body).toString();
}

function methodSendsBody(
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
): boolean {
	// Cloudinary Admin DELETE endpoints (e.g. delete resources) require a body.
	return (
		method === 'POST' ||
		method === 'PUT' ||
		method === 'PATCH' ||
		method === 'DELETE'
	);
}

function unwrapLiveResponse<T>(response: unknown): T {
	if (
		response !== null &&
		typeof response === 'object' &&
		!Array.isArray(response) &&
		'data' in response
	) {
		return (response as { data: T }).data;
	}
	return response as T;
}

export async function makeCloudinaryAdminRequest<T>(
	endpoint: string,
	credentials: CloudinaryCredentials,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: adminBaseUrl(credentials.cloudName),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: basicAuthHeader(credentials),
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: methodSendsBody(method) ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: CLOUDINARY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw normalizeCloudinaryError(error);
	}
}

export async function makeCloudinaryLiveRequest<T>(
	endpoint: string,
	credentials: CloudinaryCredentials,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: liveBaseUrl(credentials.cloudName),
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: basicAuthHeader(credentials),
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: methodSendsBody(method) ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		const response = await request<unknown>(config, requestOptions, {
			rateLimitConfig: CLOUDINARY_RATE_LIMIT_CONFIG,
		});
		// Live Streaming API wraps payloads as { request_id, data }.
		return unwrapLiveResponse<T>(response);
	} catch (error) {
		throw normalizeCloudinaryError(error);
	}
}

export async function makeCloudinaryUploadRequest<T>(
	endpoint: string,
	credentials: CloudinaryCredentials,
	resourceType: string,
	options: {
		method?: 'POST';
		body?: Record<string, unknown>;
		bodyKind?: 'form' | 'multipart';
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const {
		method = 'POST',
		body = {},
		bodyKind = 'form',
		headers = {},
	} = options;
	const baseUrl = uploadBaseUrl(credentials.cloudName, resourceType);
	const authHeader = basicAuthHeader(credentials);

	if (bodyKind === 'multipart') {
		const formData = new FormData();
		for (const [key, value] of Object.entries(body)) {
			if (value === undefined || value === null) continue;
			if (key === 'file' && (value instanceof Blob || value instanceof File)) {
				formData.append('file', value);
				continue;
			}
			if (Array.isArray(value)) {
				formData.append(
					key,
					value.map((item) => flattenFormValue(item)).join(','),
				);
				continue;
			}
			formData.append(key, flattenFormValue(value));
		}

		const response = await fetch(`${baseUrl}${endpoint}`, {
			method,
			headers: {
				Authorization: authHeader,
				...headers,
			},
			body: formData,
		});

		if (!response.ok) {
			const text = await response.text();
			throw new CloudinaryAPIError(
				`Upload failed (${response.status}): ${text}`,
			);
		}

		return response.json() as Promise<T>;
	}

	const response = await fetch(`${baseUrl}${endpoint}`, {
		method,
		headers: {
			Authorization: authHeader,
			'Content-Type': 'application/x-www-form-urlencoded',
			...headers,
		},
		body: encodeCloudinaryFormBody(body),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new CloudinaryAPIError(`Upload failed (${response.status}): ${text}`);
	}

	return response.json() as Promise<T>;
}

function normalizeCloudinaryError(error: unknown): CloudinaryAPIError {
	if (error instanceof CloudinaryAPIError) return error;
	if (error instanceof ApiError) {
		// ApiError.body is `unknown` in corsair/http — Cloudinary error JSON shape is not modeled on the shared type.
		const body = error.body as { error?: { message?: string } } | undefined;
		return new CloudinaryAPIError(
			body?.error?.message ?? error.message,
			String(error.status),
		);
	}
	if (error instanceof Error) {
		return new CloudinaryAPIError(error.message);
	}
	return new CloudinaryAPIError('Unknown Cloudinary API error');
}

function digestEqualsHex(expectedHex: string, signature: string): boolean {
	const normalized = signature.toLowerCase();
	if (normalized.length !== expectedHex.length) {
		return false;
	}
	try {
		return timingSafeEqual(
			Buffer.from(expectedHex, 'hex'),
			Buffer.from(normalized, 'hex'),
		);
	} catch {
		return false;
	}
}

export function verifyCloudinaryNotificationSignature(
	payload: string,
	timestamp: string,
	signature: string,
	apiSecret: string,
): boolean {
	const ts = Number(timestamp);
	if (!Number.isFinite(ts)) {
		return false;
	}
	const ageSec = Math.abs(Math.floor(Date.now() / 1000) - ts);
	if (ageSec > NOTIFICATION_MAX_AGE_SEC) {
		return false;
	}

	const signed = payload + timestamp + apiSecret;
	const sha1 = createHash('sha1').update(signed).digest('hex');
	if (digestEqualsHex(sha1, signature)) {
		return true;
	}
	const sha256 = createHash('sha256').update(signed).digest('hex');
	return digestEqualsHex(sha256, signature);
}
