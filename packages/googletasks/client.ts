import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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
	// Set by core's OAuth keyBuilder; refreshes the access token after a 401.
	_refreshAuth?: () => Promise<string>;
};

export type GoogleTasksRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Endpoint-specific strict Zod schemas validate each JSON resource before it reaches this transport.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function isUnauthorized(error: unknown): boolean {
	return error instanceof ApiError && error.status === 401;
}

function sendGoogleTasksRequest(
	path: string,
	key: string,
	options: GoogleTasksRequestOptions,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GOOGLE_TASKS_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${key}`,
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

// The provider payload is untrusted until the operation-specific output schema parses it.
// A 401 refreshes the OAuth token once and retries only the request that failed, the
// same as the other Google plugins: Google rejected it before running it, so writes are
// safe to resend.
export async function makeGoogleTasksRequest(
	path: string,
	ctx: GoogleTasksRequestContext,
	options: GoogleTasksRequestOptions = {},
): Promise<unknown> {
	if (!ctx.key) throw new AuthMissingError('googletasks', 'oauth_2');
	try {
		return await sendGoogleTasksRequest(path, ctx.key, options);
	} catch (error) {
		if (!isUnauthorized(error) || !ctx._refreshAuth) throw error;
		const freshKey = await ctx._refreshAuth();
		return sendGoogleTasksRequest(path, freshKey, options);
	}
}
