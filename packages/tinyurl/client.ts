import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TinyurlAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'TinyurlAPIError';
	}
}

const TINYURL_API_BASE = 'https://api.tinyurl.com';

// API error response bodies vary by HTTP status and endpoint; typing as unknown
// forces callers to narrow the payload at runtime before accessing properties.
function extractErrorMessage(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const bodyObj = body as { errors?: unknown; message?: unknown };
	if (Array.isArray(bodyObj.errors) && bodyObj.errors.length > 0) {
		const first = bodyObj.errors[0];
		if (typeof first === 'string') return first;
		if (typeof first === 'object' && first !== null) {
			const detail =
				(first as { message?: unknown; detail?: unknown }).message ??
				(first as { detail?: unknown }).detail;
			if (typeof detail === 'string') return detail;
		}
	}
	if (typeof bodyObj.message === 'string') {
		return bodyObj.message;
	}
	return undefined;
}

// Extracts optional numeric or string error code from untyped error response bodies.
function extractErrorCode(body: unknown): string | number | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const code = (body as { code?: unknown }).code;
	if (typeof code === 'string' || typeof code === 'number') return code;
	return undefined;
}

export async function makeTinyurlRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TINYURL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TinyurlAPIError(
				extractErrorMessage(error.body) || error.message,
				extractErrorCode(error.body),
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new TinyurlAPIError(error.message);
		}
		throw new TinyurlAPIError('Unknown TinyURL API error');
	}
}
