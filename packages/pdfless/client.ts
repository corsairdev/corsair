import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PDFLESS_API_BASE = 'https://api.pdfless.com';

export type PdflessRequest = {
	method?: 'GET' | 'POST';
	url: string;
	query?: Record<string, string | number | undefined>;
	// unknown: each operation's zod input schema has already checked the body.
	body?: Record<string, unknown>;
	/** Strip the body from errors (it can hold PDF passwords and personal data). */
	redactBodyInErrors?: boolean;
};

/**
 * PDFLess takes the key in the `apikey` header. Core's `request()` keeps its
 * default 429 retries (it honours Retry-After).
 */
export async function pdflessRequest<T>(
	apiKey: string,
	req: PdflessRequest,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: PDFLESS_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			apikey: apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: req.method ?? 'GET',
		url: req.url,
		query: req.query,
		...(req.body !== undefined
			? { body: req.body, mediaType: 'application/json' }
			: {}),
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (!req.redactBodyInErrors || !(error instanceof ApiError)) throw error;
		// Core redacts keys in URLs and query strings, not request bodies.
		// Rebuild the error without the body; status and retryAfter stay.
		throw new ApiError(
			{ ...error.request, body: '[REDACTED]' },
			{
				url: error.url,
				ok: false,
				status: error.status,
				statusText: error.statusText,
				body: error.body,
			},
			error.message,
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
	}
}

export async function pdflessGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | number | undefined>,
): Promise<T> {
	return pdflessRequest<T>(apiKey, { url, query });
}
