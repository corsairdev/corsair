import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class CloseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'CloseAPIError';
	}
}

export class CloseRateLimitError extends CloseAPIError {
	constructor(
		message = 'Rate limit exceeded',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 'RATE_LIMIT_EXCEEDED', body);
		this.name = 'CloseRateLimitError';
	}
}

export const CLOSE_API_BASE = 'https://api.close.com/api/v1';

export type CloseRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function formatAuthHeader(key: string): string {
	if (!key) return '';
	if (key.startsWith('Bearer ') || key.startsWith('Basic ')) {
		return key;
	}
	// If key contains OAuth token format or regular Close API key:
	// Close API Key uses HTTP Basic auth with API key as username and empty password.
	if (key.startsWith('api_') || key.includes('_')) {
		const encoded = Buffer.from(`${key}:`).toString('base64');
		return `Basic ${encoded}`;
	}
	return `Bearer ${key}`;
}

export async function makeCloseRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CloseRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const authHeader = formatAuthHeader(apiKey);

	const config: OpenAPIConfig = {
		BASE: CLOSE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(authHeader ? { Authorization: authHeader } : {}),
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
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (
			error instanceof CloseAPIError ||
			error instanceof CloseRateLimitError
		) {
			throw error;
		}
		if (error instanceof Error) {
			throw new CloseAPIError(error.message);
		}
		throw new CloseAPIError('Unknown Close API error');
	}
}
