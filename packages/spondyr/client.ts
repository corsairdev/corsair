import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SPONDYR_API_BASE = 'https://client.spondyr.io/api/v1.0.0';

// error-handlers.ts owns retries. The object has to be complete: request.ts
// replaces its defaults wholesale with whatever it is handed, so a partial one
// either skips the rate-limit block or throws reading `headerNames`.
const SPONDYR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** Spondyr credentials. Both are required on every request. */
export type SpondyrCredentials = { apiKey: string; applicationToken: string };

/**
 * Spondyr answers every failure, including a bad key, with HTTP 400 and a body
 * that still carries `APIStatus: 'ERROR'`. Some routes answer 404 for the same
 * reason, and a 200 can carry `APIStatus: 'ERROR'` too (the endpoints call
 * `assertApiStatus` on every body for that).
 *
 * Failures surface as core's `ApiError`, rebuilt so the message is Spondyr's
 * `ErrorMessage` and nothing from the request survives: document `Data` carries
 * names and addresses. Status, `retryAfter` and the method stay, so the error
 * handlers and core's management layer still see them.
 */
export function spondyrApiError(params: {
	method: SpondyrRequest['method'];
	path: string;
	status: number;
	statusText?: string;
	// unknown: provider or proxy bodies have no fixed shape.
	body: unknown;
	fallback: string;
	/** Replaces the described message, e.g. to name the refused operation. */
	message?: string;
	retryAfter?: number;
	rateLimit?: Pick<
		ApiError,
		'rateLimitReset' | 'rateLimitRemaining' | 'rateLimitLimit'
	>;
}): ApiError {
	const described = describeSpondyrError(
		params.status,
		params.body,
		params.fallback,
	);
	const record = asRecord(params.body);
	return new ApiError(
		{ method: params.method, url: params.path },
		{
			url: `${SPONDYR_API_BASE}/${params.path}`,
			ok: false,
			status: params.status,
			statusText: params.statusText ?? '',
			body: {
				APIStatus: described.apiStatus,
				ErrorMessage:
					typeof record?.ErrorMessage === 'string'
						? record.ErrorMessage
						: undefined,
			},
		},
		params.message ?? described.message,
		{
			retryAfter: params.retryAfter,
			rateLimitReset: params.rateLimit?.rateLimitReset,
			rateLimitRemaining: params.rateLimit?.rateLimitRemaining,
			rateLimitLimit: params.rateLimit?.rateLimitLimit,
		},
	);
}

/**
 * Spondyr's database errors quote the stored document back, e.g. "Conversion
 * failed when converting the nvarchar value '{"OrderNumber":12345,...}'" (seen
 * live on a status call right after a send). Quoted JSON is replaced so
 * document data stays out of error messages.
 */
export function redactEchoedData(message: string): string {
	// A plain scan rather than a regex: the text comes from the provider.
	let out = '';
	let index = 0;
	while (index < message.length) {
		const start = message.indexOf("'", index);
		const opener = message[start + 1];
		if (start === -1 || (opener !== '{' && opener !== '[')) {
			out += message.slice(index, start === -1 ? undefined : start + 1);
			if (start === -1) break;
			index = start + 1;
			continue;
		}
		const close = opener === '{' ? "}'" : "]'";
		const end = message.lastIndexOf(close);
		if (end <= start) {
			out += message.slice(index);
			break;
		}
		out += `${message.slice(index, start)}'<document data>'`;
		index = end + close.length;
	}
	return out;
}

/** Reads `ErrorMessage` and `APIStatus` out of a Spondyr envelope. */
export function describeSpondyrError(
	status: number | undefined,
	// unknown: provider or proxy bodies have no fixed shape.
	body: unknown, // unknown: the provider or a proxy decides the body shape.
	fallback: string,
): { message: string; apiStatus?: string } {
	const record = asRecord(body);
	const errorMessage = record?.ErrorMessage;
	const apiStatus = record?.APIStatus;
	const raw =
		typeof errorMessage === 'string' && errorMessage.length > 0
			? errorMessage
			: (typeof record?.Message === 'string' && record.Message) || fallback;
	const text = redactEchoedData(raw);
	return {
		message: status === undefined ? text : `Spondyr ${status}: ${text}`,
		apiStatus: typeof apiStatus === 'string' ? apiStatus : undefined,
	};
}

export type SpondyrQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SpondyrRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: SpondyrQuery;
	body?: unknown; // unknown: the operation's input schema validated it.
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Spondyr takes its two credentials as `APIKey` and `ApplicationToken`. Both
 * work as query parameters or as JSON body fields, and both also work as
 * headers, which is what this client uses: a header keeps them out of the URL,
 * where a proxy log or an ApiError would otherwise capture them.
 *
 * The read routes send only a query string, so without the headers there is no
 * body to carry them.
 */
export async function makeSpondyrRequest(
	credentials: SpondyrCredentials,
	{ method, path, query, body }: SpondyrRequest,
): Promise<unknown> {
	// unknown: each operation's output schema types the answer.
	const config: OpenAPIConfig = {
		BASE: SPONDYR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			APIKey: credentials.apiKey,
			ApplicationToken: credentials.applicationToken,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			// unknown: see above.
			rateLimitConfig: SPONDYR_RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// unknown: request() rejects with ApiError or a runtime network error.
		if (error instanceof ApiError) {
			throw spondyrApiError({
				method,
				path,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
				fallback: error.message,
				retryAfter: error.retryAfter,
				rateLimit: error,
			});
		}
		// Network errors and timeouts go through unchanged.
		throw error;
	}
}
