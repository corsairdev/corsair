import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Canvas LMS is per-institution — every school/self-hosted instance has its
 * own host. Callers must pass `baseUrl` (plugin option or account `base_url`).
 */
export function normalizeCanvasBaseUrl(baseUrl: string): string {
	const trimmed = baseUrl.trim().replace(/\/+$/, '');
	if (!trimmed) {
		throw new Error('[canvas] baseUrl is required');
	}
	return trimmed;
}

const CANVAS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Resolve path template placeholders like `{course_id}` into real values.
 */
function resolvePath(
	template: string,
	pathParams?: Record<string, string>,
): string {
	if (!pathParams) return template;
	let resolved = template;
	for (const [key, value] of Object.entries(pathParams)) {
		resolved = resolved.replace(`{${key}}`, encodeURIComponent(value));
	}
	return resolved;
}

export async function makeCanvasRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
		path?: Record<string, string>;
		baseUrl: string;
	},
): Promise<T> {
	const { method = 'GET', body, query, path: pathParams, baseUrl } = options;

	const base = normalizeCanvasBaseUrl(baseUrl);
	const resolvedEndpoint = resolvePath(endpoint, pathParams);

	const config: OpenAPIConfig = {
		BASE: base,
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
		url: resolvedEndpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: query as Record<string, unknown> | undefined,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: CANVAS_RATE_LIMIT_CONFIG,
	});
}
