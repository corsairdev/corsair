import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class KibanaAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'KibanaAPIError';
	}
}

export async function makeKibanaRequest<T>(
	endpoint: string,
	baseUrl: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Payloads vary per endpoint (validated by zod schemas upstream),
		// so the transport stays generic.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	if (!baseUrl) {
		throw new KibanaAPIError('Base URL is required', 'MISSING_BASE_URL');
	}

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'kbn-xsrf': 'true', // Required for many Kibana API endpoints
	};

	// Pass through prefixed credentials, else default to ApiKey.
	if (
		apiKey.startsWith('Basic ') ||
		apiKey.startsWith('ApiKey ') ||
		apiKey.startsWith('Bearer ')
	) {
		headers.Authorization = apiKey;
	} else {
		headers.Authorization = `ApiKey ${apiKey}`;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl.replace(/\/$/, ''),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Do NOT set TOKEN: the shared HTTP layer would rewrite Authorization
		// to Bearer and clobber the ApiKey/Basic scheme in HEADERS.
		HEADERS: headers,
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
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new KibanaAPIError(error.message);
		}
		throw new KibanaAPIError('Unknown error');
	}
}
