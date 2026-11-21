import type {
	ApiRequestOptions,
	ApiResult,
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
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
	formData?: Record<string, string | Blob | Array<string | Blob> | undefined>;
	headers?: Record<string, string>;
	responseType?: 'binary';
	basePath?: 'v3' | 'manage';
};

export type QuickBooksAuthenticatedContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

function sanitizeFormDataError(
	error: ApiError,
	path: string,
	options: QuickBooksRequestOptions,
): ApiError {
	const request: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
		mediaType: 'multipart/form-data',
		...(options.query ? { query: options.query } : {}),
		...(options.headers ? { headers: options.headers } : {}),
	};
	const response: ApiResult = {
		url: error.url,
		ok: false,
		status: error.status,
		statusText: error.statusText,
		body: error.body,
	};
	return new ApiError(request, response, error.message, {
		...(error.retryAfter !== undefined ? { retryAfter: error.retryAfter } : {}),
		...(error.rateLimitReset !== undefined
			? { rateLimitReset: error.rateLimitReset }
			: {}),
		...(error.rateLimitRemaining !== undefined
			? { rateLimitRemaining: error.rateLimitRemaining }
			: {}),
		...(error.rateLimitLimit !== undefined
			? { rateLimitLimit: error.rateLimitLimit }
			: {}),
	});
}

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
	const basePath = options.basePath ?? 'v3';
	const config: OpenAPIConfig = {
		BASE: `${API_HOSTS[environment ?? 'production']}/${basePath}`,
		VERSION: basePath === 'v3' ? '3' : '',
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
		...(options.formData ? { formData: options.formData } : {}),
		...(options.headers ? { headers: options.headers } : {}),
		...(options.responseType ? { responseType: options.responseType } : {}),
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
		if (error instanceof ApiError && error.status === 401 && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			try {
				return await makeQuickBooksRequest<T>(
					path,
					freshToken,
					options,
					environment,
				);
			} catch (refreshError: unknown) {
				// unknown because retry rejection values are untrusted; form data must not escape in ApiError.request.
				if (options.formData && refreshError instanceof ApiError) {
					throw sanitizeFormDataError(refreshError, path, options);
				}
				throw refreshError;
			}
		}
		if (options.formData && error instanceof ApiError) {
			throw sanitizeFormDataError(error, path, options);
		}
		throw error;
	}
}
