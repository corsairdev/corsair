import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LodgifyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LodgifyAPIError';
	}
}

export const LODGIFY_API_BASE = 'https://api.lodgify.com';

// Let Corsair's endpoint error handler own 429 retries.
// Keep header extraction enabled with zero transport retries so the handler
// still receives Lodgify's Retry-After value instead of a fixed delay.
export const LODGIFY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

function clearObject(value: object): void {
	for (const key of Reflect.ownKeys(value)) {
		Reflect.deleteProperty(value, key);
	}
}

// `unknown` because the provider's error body is untrusted and may contain guest data.
export function sanitizeApiError<T>(error: T, _apiKey?: string): T {
	if (!(error instanceof ApiError)) return error;

	// Keep Corsair's ApiError instance, status and Retry-After intact. Its diagnostic
	// payloads can echo guest PII, so remove payload fields and replace free text.
	error.message = `Lodgify request failed (HTTP ${error.status})`;
	error.stack = `${error.name}: Lodgify request failed (HTTP ${error.status})`;
	if (error.request) {
		if (error.request.headers) clearObject(error.request.headers);
		if (error.request.body && typeof error.request.body === 'object') {
			clearObject(error.request.body);
		} else {
			Reflect.deleteProperty(error.request, 'body');
		}
	}
	if (error.body && typeof error.body === 'object') {
		clearObject(error.body);
	} else {
		Reflect.deleteProperty(error, 'body');
	}

	return error;
}

export async function makeLodgifyRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because JSON request bodies vary by operation and schemas validate them first.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// An explicitly empty key means no credentials are configured (the
	// keyBuilder resolves that case to ''). Public callers pass undefined
	// instead, so only keyed endpoints hit this gate.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('lodgify', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { 'X-ApiKey': apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: LODGIFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
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
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LODGIFY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizeApiError(error, apiKey);
		if (error instanceof Error)
			throw new LodgifyAPIError('Lodgify request failed');
		throw new LodgifyAPIError('Unknown Lodgify error');
	}
}
