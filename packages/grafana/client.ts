import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class GrafanaAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GrafanaAPIError';
	}
}

const GRAFANA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Makes a JSON request to the Grafana REST API.
 * bearerToken is the Grafana Service Account Token.
 * baseUrl is the Grafana instance domain (e.g. https://example.grafana.net).
 */
export async function makeGrafanaRequest<T>(
	endpoint: string,
	bearerToken: string,
	baseUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${bearerToken}`,
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

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: GRAFANA_RATE_LIMIT_CONFIG,
	});

	return response;
}

/**
 * Makes a raw (text/HTML) request to the Grafana API.
 * Used for endpoints that return HTML pages (ring status, HA tracker, etc.).
 * Returns an object with content and content_type.
 */
export async function makeGrafanaRawRequest(
	endpoint: string,
	bearerToken: string,
	baseUrl: string,
	options: {
		method?: 'GET' | 'POST';
		// body is typed as unknown here because form-encoded SAML payloads are not plain JSON objects
		body?: unknown;
		contentType?: string;
	} = {},
): Promise<{ content: string; content_type: string; status_code: number }> {
	const { method = 'GET', body, contentType = 'application/json' } = options;

	const url = `${baseUrl}${endpoint}`;

	const headers: Record<string, string> = {
		Authorization: `Bearer ${bearerToken}`,
		Accept: 'text/html,application/json,*/*',
	};

	if (method === 'POST' && body !== undefined) {
		headers['Content-Type'] = contentType;
	}

	const fetchOptions: RequestInit = {
		method,
		headers,
	};

	if (method === 'POST' && body !== undefined) {
		// body is typed as unknown from the caller; convert to string for the fetch body
		fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
	}

	const response = await fetch(url, fetchOptions);
	const content = await response.text();
	const content_type = response.headers.get('content-type') ?? 'text/html';

	return { content, content_type, status_code: response.status };
}
