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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 0,
				backoffMultiplier: 1,
				headerNames: {
					retryAfter: 'retry-after',
				},
			},
		});
	} catch (error: unknown) {
		if (
			error instanceof CloseAPIError ||
			error instanceof CloseRateLimitError
		) {
			throw error;
		}

		if (error && typeof error === 'object') {
			const apiErr = error as {
				status?: number;
				body?: unknown;
				headers?: Headers | Record<string, string>;
				response?: { headers?: Headers | Record<string, string> };
				message?: string;
				retryAfter?: number;
			};
			const status = apiErr.status;
			const errBody = apiErr.body;
			let message = apiErr.message || 'Close API Error';

			if (typeof errBody === 'object' && errBody !== null) {
				const record = errBody as Record<string, unknown>;
				if (typeof record['error'] === 'string') {
					message = record['error'];
				} else if (typeof record['message'] === 'string') {
					message = record['message'];
				}
			}

			if (status === 429) {
				let retryAfterMs: number | undefined =
					typeof apiErr.retryAfter === 'number' ? apiErr.retryAfter : undefined;
				if (!retryAfterMs) {
					const hdrs = apiErr.headers || apiErr.response?.headers;
					if (hdrs) {
						const getHeader = (name: string): string | null | undefined => {
							if (typeof (hdrs as Headers).get === 'function') {
								return (
									(hdrs as Headers).get(name) ||
									(hdrs as Headers).get(name.toLowerCase())
								);
							}
							const rec = hdrs as Record<string, string>;
							return rec[name] || rec[name.toLowerCase()];
						};
						const retryHeader =
							getHeader('retry-after') || getHeader('Retry-After');
						if (retryHeader) {
							const seconds = parseInt(retryHeader, 10);
							if (!isNaN(seconds)) retryAfterMs = seconds * 1000;
						}
					}
				}
				throw new CloseRateLimitError(message, retryAfterMs, errBody);
			}

			throw new CloseAPIError(message, status, undefined, errBody);
		}

		if (error instanceof Error) {
			throw new CloseAPIError(error.message);
		}
		throw new CloseAPIError('Unknown Close API error');
	}
}
