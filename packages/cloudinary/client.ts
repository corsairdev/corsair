import { createHash } from 'node:crypto';
import type { ApiRequestOptions, OpenAPIConfig, RateLimitConfig } from 'corsair/http';
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

export function signCloudinaryParams(
	params: Record<string, unknown>,
	apiSecret: string,
): string {
	const sorted = Object.keys(params)
		.filter((key) => params[key] !== undefined && params[key] !== null)
		.sort()
		.map((key) => {
			const value = params[key];
			if (Array.isArray(value)) {
				return value.map((item) => `${key}[]=${item}`).join('&');
			}
			return `${key}=${value}`;
		})
		.join('&');

	return createHash('sha1').update(sorted + apiSecret).digest('hex');
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
	return String(value);
}

function toFormBody(body: Record<string, unknown>): Record<string, string> {
	const form: Record<string, string> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) {
				form[`${key}[]`] = flattenFormValue(item);
			}
			continue;
		}
		form[key] = flattenFormValue(value);
	}
	return form;
}

function appendSignedUploadParams(
	body: Record<string, unknown>,
	credentials: CloudinaryCredentials,
): Record<string, unknown> {
	const signed: Record<string, unknown> = {
		...body,
		api_key: credentials.apiKey,
		timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
	};
	signed.signature = signCloudinaryParams(signed, credentials.apiSecret);
	return signed;
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
	const isWrite =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

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
		body: isWrite ? body : undefined,
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
	const isWrite =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

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
		body: isWrite ? body : undefined,
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

export async function makeCloudinaryUploadRequest<T>(
	endpoint: string,
	credentials: CloudinaryCredentials,
	resourceType: string,
	options: {
		method?: 'POST';
		body?: Record<string, unknown>;
		bodyKind?: 'form' | 'multipart';
	} = {},
): Promise<T> {
	const { method = 'POST', body = {}, bodyKind = 'form' } = options;
	const signedBody = appendSignedUploadParams(body, credentials);
	const baseUrl = uploadBaseUrl(credentials.cloudName, resourceType);

	if (bodyKind === 'multipart') {
		const formData = new FormData();
		for (const [key, value] of Object.entries(signedBody)) {
			if (value === undefined || value === null) continue;
			if (key === 'file' && (value instanceof Blob || value instanceof File)) {
				formData.append('file', value);
				continue;
			}
			if (Array.isArray(value)) {
				for (const item of value) formData.append(`${key}[]`, flattenFormValue(item));
				continue;
			}
			formData.append(key, flattenFormValue(value));
		}

		const response = await fetch(`${baseUrl}${endpoint}`, {
			method,
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

	const formBody = toFormBody(signedBody);
	const response = await fetch(`${baseUrl}${endpoint}`, {
		method,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams(formBody).toString(),
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

export function verifyCloudinaryNotificationSignature(
	payload: string,
	timestamp: string,
	signature: string,
	apiSecret: string,
): boolean {
	const expected = createHash('sha1')
		.update(payload + timestamp + apiSecret)
		.digest('hex');
	return expected === signature;
}
