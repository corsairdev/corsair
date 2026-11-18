import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type QuickBooksEnvironment = 'production' | 'sandbox';

const API_HOSTS: Record<QuickBooksEnvironment, string> = {
	production: 'https://quickbooks.api.intuit.com',
	sandbox: 'https://sandbox-quickbooks.api.intuit.com',
};

export const QUICKBOOKS_RATE_LIMIT_CONFIG = {
	enabled: true,
	maxRetries: 1,
	initialRetryDelay: 60_000,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
} satisfies RateLimitConfig;

export type QuickBooksRequestOptions = {
	method?: 'GET' | 'POST';
	// unknown values let the request's Zod-validated endpoint body retain its exact fields.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export type QuickBooksAuthenticatedContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

export function quickBooksApiBase(
	environment: QuickBooksEnvironment = 'production',
): string {
	return `${API_HOSTS[environment]}/v3`;
}

/**
 * Sends one authenticated JSON request to the QBO Accounting REST API.
 * OAuth access tokens are supplied by Corsair's OAuth key builder and refresh
 * path; this client never logs the token or request body.
 */
export async function makeQuickBooksRequest<T>(
	path: string,
	accessToken: string,
	options: QuickBooksRequestOptions = {},
	environment?: QuickBooksEnvironment,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: quickBooksApiBase(environment),
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
		...(options.query ? { query: options.query } : {}),
		...(options.body
			? { body: options.body, mediaType: 'application/json' }
			: {}),
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: QUICKBOOKS_RATE_LIMIT_CONFIG,
	});
}

/**
 * Refreshes and retries this one request once after a 401. Core automatically
 * retries reads, but a write must refresh at this request boundary so a failed
 * auth response cannot suppress a safe retry or repeat earlier side effects.
 */
export async function makeAuthenticatedQuickBooksRequest<T>(
	ctx: QuickBooksAuthenticatedContext,
	path: string,
	options: QuickBooksRequestOptions,
	environment?: QuickBooksEnvironment,
): Promise<T> {
	try {
		return await makeQuickBooksRequest<T>(path, ctx.key, options, environment);
	} catch (error: unknown) {
		// unknown because transport rejection values are untrusted; ApiError narrows the retryable case.
		if (
			!(error instanceof ApiError) ||
			error.status !== 401 ||
			!ctx._refreshAuth
		) {
			throw error;
		}
		const freshToken = await ctx._refreshAuth();
		return makeQuickBooksRequest<T>(path, freshToken, options, environment);
	}
}
