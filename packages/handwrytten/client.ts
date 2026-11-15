import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HandwryttenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HandwryttenAPIError';
	}
}

export const HANDWRYTTEN_API_BASE = 'https://api.handwrytten.com/v2';

export const PUBLIC_ROUTES = new Set([
	'/fonts/list',
	'fonts/list',
	'/cards/list',
	'cards/list',
	'/cards/view',
	'cards/view',
	'/cards/list/sections',
	'cards/list/sections',
	'/categories/list',
	'categories/list',
	'/design/dimensions',
	'design/dimensions',
	'/design/presetImages',
	'design/presetImages',
	'/templateCategories/list',
	'templateCategories/list',
	'/shipping/stampOptions',
	'shipping/stampOptions',
	'/giftCards/list',
	'giftCards/list',
	'/inserts/list',
	'inserts/list',
	'/bundles/list',
	'bundles/list',
	'/countries/list',
	'countries/list',
	'/countries/listStates',
	'countries/listStates',
	'/profile/signatures',
	'profile/signatures',
	'/qrCode/frames',
	'qrCode/frames',
]);

// Request bodies carry recipient names, mailing addresses, card messages and
// credentials. Every string value is replaced before an error leaves the client;
// numbers and booleans (ids, flags) stay so failures remain debuggable.
// `unknown` because request payloads can be arbitrary JSON primitives, arrays, or objects.
function redactValue(value: unknown): unknown {
	if (typeof value === 'string') return '[REDACTED]';
	if (Array.isArray(value)) return value.map(redactValue);
	if (value !== null && typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			result[k] = redactValue(v);
		}
		return result;
	}
	return value;
}

export async function makeHandwryttenRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON (already validated by the zod
		// input schemas before send), so the shared transport stays generic
		// over a JSON record instead of a closed per-endpoint union.
		body?: Record<string, unknown>;
		// Multipart parts (strings or Blobs); used by the image upload.
		formData?: Record<string, string | Blob | undefined>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
		isPublic?: boolean;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		formData,
		query,
		baseUrl = HANDWRYTTEN_API_BASE,
		isPublic,
	} = options;

	const normalizedEndpoint = endpoint.replace(/^\/+/, '');
	const isPublicRoute =
		isPublic ??
		(PUBLIC_ROUTES.has(endpoint) || PUBLIC_ROUTES.has(normalizedEndpoint));

	const trimmedKey = (apiKey ?? '').trim();

	// An empty key on a non-public endpoint fails fast with Corsair's missing-auth error
	if (!isPublicRoute && trimmedKey.length === 0) {
		throw new AuthMissingError('handwrytten', 'api_key');
	}

	const authHeaders: Record<string, string> =
		trimmedKey.length > 0 ? { Authorization: trimmedKey } : {};

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			...(formData ? {} : { 'Content-Type': 'application/json' }),
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			!formData && (method === 'POST' || method === 'PUT' || method === 'PATCH')
				? body
				: undefined,
		formData,
		mediaType: formData ? undefined : 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Redact sensitive credentials in-place without replacing ApiError, preserving status, retryAfter, etc.
		if (error instanceof ApiError) {
			if (error.request) {
				// `unknown` because request.body contains untrusted request JSON.
				const req = error.request as { body?: unknown; formData?: unknown };
				if (req.body !== undefined) req.body = redactValue(req.body);
				if (req.formData !== undefined) req.formData = '[REDACTED]';
			}
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new HandwryttenAPIError('Unknown error');
	}
}
