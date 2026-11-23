import { Buffer } from 'node:buffer';
import type {
	ApiRequestOptions,
	ApiResult,
	BinaryResponse,
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
	/** Transport timeout; core's default is 20 s. */
	timeoutMs?: number;
};

export type QuickBooksAuthenticatedContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

/**
 * Rebuilds a QuickBooks ApiError without the request it was sent with. The
 * query string can carry a recipient address (`sendTo` on the send routes) or a
 * query that names customers, and bodies and multipart parts carry customer and
 * file data. The provider's Fault body, the status and the rate-limit fields
 * stay, so callers and core's 401/429 handling see the same error.
 */
// Any local@domain form, dotted or not (pat@localhost).
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)*/g;

// Intuit's fault text can quote a submitted email address (fault 2210); keep the rest of the Fault.
export function redactEmails(value: unknown): unknown {
	if (typeof value === 'string') return value.replace(EMAIL, '[email]');
	if (Array.isArray(value)) return value.map(redactEmails);
	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([key, inner]) => [key, redactEmails(inner)]),
		);
	}
	return value;
}

function sanitizeQuickBooksError(
	error: ApiError,
	path: string,
	options: QuickBooksRequestOptions,
): ApiError {
	const request: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
	};
	const response: ApiResult = {
		url: error.url.split('?')[0] ?? '',
		ok: false,
		status: error.status,
		statusText: error.statusText,
		body: redactEmails(error.body),
	};
	return new ApiError(request, response, String(redactEmails(error.message)), {
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
		...(options.timeoutMs ? { TIMEOUT: options.timeoutMs } : {}),
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
 * QuickBooks can answer 200 with a top-level Fault instead of the entity.
 * Batch and upload answers carry per-item faults next to their results, so
 * only a top-level Fault counts as a failed request.
 */
function throwOnTopLevelFault<T>(
	result: T,
	path: string,
	options: QuickBooksRequestOptions,
): T {
	if (result && typeof result === 'object' && 'Fault' in result) {
		throw sanitizeQuickBooksError(
			new ApiError(
				{ method: options.method ?? 'GET', url: path },
				{
					url: path,
					ok: false,
					status: 200,
					statusText: 'QuickBooks Fault',
					body: result,
				},
				'QuickBooks answered with a Fault',
			),
			path,
			options,
		);
	}
	return result;
}

/**
 * The binary routes are the PDF getters. Core hands back any 200 body as bytes,
 * so a JSON Fault or an empty body would otherwise reach the caller as a file.
 */
function requirePdf(
	result: BinaryResponse,
	path: string,
	options: QuickBooksRequestOptions,
): BinaryResponse {
	const contentType = result.contentType ?? '';
	// unknown because a non-PDF answer is untrusted JSON (or not JSON at all) until the Fault check reads it.
	let body: unknown;
	if (/json/i.test(contentType)) {
		try {
			body = JSON.parse(Buffer.from(result.bytes).toString('utf8'));
		} catch {
			body = undefined;
		}
		throwOnTopLevelFault(body, path, options);
	}
	if (result.bytes.byteLength > 0 && /pdf/i.test(contentType)) return result;
	throw sanitizeQuickBooksError(
		new ApiError(
			{ method: options.method ?? 'GET', url: path },
			{
				url: path,
				ok: false,
				status: 200,
				statusText: 'QuickBooks returned no PDF',
				body,
			},
			`QuickBooks returned ${result.bytes.byteLength === 0 ? 'an empty body' : contentType || 'an unknown content type'} instead of a PDF`,
		),
		path,
		options,
	);
}

export async function makeAuthenticatedQuickBooksRequest<T>(
	ctx: QuickBooksAuthenticatedContext,
	path: string,
	options: QuickBooksRequestOptions,
	environment?: QuickBooksEnvironment,
): Promise<T> {
	const result = await sendAuthenticatedQuickBooksRequest<T>(
		ctx,
		path,
		options,
		environment,
	);
	if (options.responseType === 'binary') {
		return requirePdf(
			result as unknown as BinaryResponse,
			path,
			options,
		) as unknown as T;
	}
	return throwOnTopLevelFault(result, path, options);
}

/**
 * Refreshes and retries this one request once after a 401. Core automatically
 * retries reads, but a write must refresh at this request boundary so a failed
 * auth response cannot suppress a safe retry or repeat earlier side effects.
 */
async function sendAuthenticatedQuickBooksRequest<T>(
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
				// unknown because retry rejection values are untrusted; request data must not escape in ApiError.request.
				if (refreshError instanceof ApiError) {
					throw sanitizeQuickBooksError(refreshError, path, options);
				}
				throw refreshError;
			}
		}
		if (error instanceof ApiError) {
			throw sanitizeQuickBooksError(error, path, options);
		}
		throw error;
	}
}
