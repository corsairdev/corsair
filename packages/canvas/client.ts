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
	let trimmed = baseUrl.trim();
	// avoid /\/+$/ — CodeQL flags it as ReDoS on long slash runs
	while (trimmed.endsWith('/')) {
		trimmed = trimmed.slice(0, -1);
	}
	if (!trimmed) {
		throw new Error('[canvas] baseUrl is required');
	}

	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error('[canvas] baseUrl must be a valid absolute HTTPS URL');
	}
	if (parsed.protocol !== 'https:') {
		throw new Error('[canvas] baseUrl must use https');
	}
	if (!parsed.host) {
		throw new Error('[canvas] baseUrl must include a valid host');
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
export function resolvePath(
	template: string,
	pathParams?: Record<string, string>,
): string {
	const resolved = template.replace(/\{([^}]+)\}/g, (_match, key: string) => {
		const value = pathParams?.[key];
		if (value === undefined || value === '') {
			throw new Error(`[canvas] Missing path param: ${key}`);
		}
		return encodeURIComponent(value);
	});
	// Fail closed — never send literal `{placeholder}` segments to Canvas.
	if (resolved.includes('{') || resolved.includes('}')) {
		throw new Error(`[canvas] Unresolved path placeholder in URL: ${resolved}`);
	}
	return resolved;
}

function toCanvasQuery(
	query?: Record<string, string | number | boolean | string[] | undefined>,
): Record<string, unknown> | undefined {
	if (!query) return undefined;
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined) continue;
		if (Array.isArray(value)) {
			const bracketKey = key.endsWith('[]') ? key : `${key}[]`;
			out[bracketKey] = value;
		} else {
			out[key] = value;
		}
	}
	return out;
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
		query: toCanvasQuery(query),
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: CANVAS_RATE_LIMIT_CONFIG,
	});
}
