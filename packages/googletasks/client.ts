import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

const GOOGLE_TASKS_API_BASE = 'https://tasks.googleapis.com';
const RATE_LIMIT_CONFIG = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
} as const;

export type GoogleTasksRequestContext = {
	key?: string;
};

export type GoogleTasksRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Endpoint-specific strict Zod schemas validate each JSON resource before it reaches this transport.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

// The provider payload is untrusted until the operation-specific output schema parses it.
export async function makeGoogleTasksRequest(
	path: string,
	ctx: GoogleTasksRequestContext,
	options: GoogleTasksRequestOptions = {},
): Promise<unknown> {
	if (!ctx.key) throw new AuthMissingError('googletasks', 'oauth_2');

	const config: OpenAPIConfig = {
		BASE: GOOGLE_TASKS_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${ctx.key}`,
			'Content-Type': 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
		body: options.body,
		mediaType: 'application/json; charset=utf-8',
		query: options.query,
	};

	// Keep provider JSON untrusted here; endpoint output schemas narrow every successful response.
	return request<unknown>(config, requestOptions, {
		rateLimitConfig: RATE_LIMIT_CONFIG,
	});
}
