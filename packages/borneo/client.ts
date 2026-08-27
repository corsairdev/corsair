import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export function normalizeBorneoBaseUrl(baseUrl: string): string {
	let trimmed = baseUrl.trim();
	while (trimmed.endsWith('/')) {
		trimmed = trimmed.slice(0, -1);
	}

	if (!trimmed) {
		throw new Error('[borneo] baseUrl is required');
	}

	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error('[borneo] baseUrl must be a valid absolute HTTPS URL');
	}

	if (parsed.protocol !== 'https:') {
		throw new Error('[borneo] baseUrl must use https');
	}

	if (!parsed.host) {
		throw new Error('[borneo] baseUrl must include a valid host');
	}

	return trimmed;
}

const BORNEO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeBorneoRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
		baseUrl: string;
	},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl } = options;
	const base = normalizeBorneoBaseUrl(baseUrl);

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
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return await request<T>(config, requestOptions, {
		rateLimitConfig: BORNEO_RATE_LIMIT_CONFIG,
	});
}
