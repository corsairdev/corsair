import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

/** Brightspace APIs are hosted on the customer's HTTPS instance origin. */
export function normalizeD2LBrightspaceBaseUrl(
	baseUrl: string | undefined,
): string {
	let url: URL;
	try {
		if (!baseUrl) throw new Error('Missing base URL');
		url = new URL(baseUrl);
	} catch {
		throw new Error('[d2lbrightspace] baseUrl must be a valid HTTPS origin');
	}
	if (
		url.protocol !== 'https:' ||
		url.username ||
		url.password ||
		url.pathname !== '/' ||
		url.search ||
		url.hash
	) {
		throw new Error('[d2lbrightspace] baseUrl must be a valid HTTPS origin');
	}
	return url.origin;
}

/** Follow D2L's self-contained ObjectListPage Next URL only for the same route. */
export function resolveNextPage(
	baseUrl: string | undefined,
	expectedPath: string,
	next: string,
): string {
	const origin = normalizeD2LBrightspaceBaseUrl(baseUrl);
	const url = new URL(next, origin);
	if (
		url.origin !== origin ||
		url.pathname !== expectedPath ||
		url.hash ||
		url.username ||
		url.password
	) {
		throw new Error('[d2lbrightspace] Invalid next page URL');
	}
	return `${url.pathname}${url.search}`;
}

export async function makeD2LBrightspaceRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		baseUrl: string | undefined;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: unknown;
		query?: Record<string, unknown>;
	},
): Promise<T> {
	if (!accessToken?.trim()) {
		throw new Error('[d2lbrightspace] OAuth access token is required');
	}
	const config: OpenAPIConfig = {
		BASE: normalizeD2LBrightspaceBaseUrl(options.baseUrl),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: endpoint,
		query: options.query,
		body: options.body,
		mediaType: 'application/json',
	};
	return request<T>(config, requestOptions, {
		rateLimitConfig: {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 1000,
			backoffMultiplier: 2,
			headerNames: { retryAfter: 'Retry-After' },
		},
	});
}
