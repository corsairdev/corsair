import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PLATE_API_BASE = 'https://api.platerecognizer.com';

// No rateLimitConfig override: core's default retries a 429 up to three times
// with backoff. Snapshot's free plan allows one call a second and answers a
// burst with 429 ("Expected available in 1 second"); an exhausted monthly
// allowance is a 403, which is not retried.

function config(apiKey: string, timeoutMs?: number): OpenAPIConfig {
	return {
		BASE: PLATE_API_BASE,
		...(timeoutMs ? { TIMEOUT: timeoutMs } : {}),
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token ${apiKey}`,
		},
	};
}

export async function plateGet<T>(apiKey: string, url: string): Promise<T> {
	const requestOptions: ApiRequestOptions = { method: 'GET', url };
	return await request<T>(config(apiKey), requestOptions);
}

export async function platePostForm<T>(
	apiKey: string,
	url: string,
	formData: Record<string, string | string[] | undefined>,
	/** Override core's 20 s default; the OCR reader takes 20 to 30 s per image. */
	timeoutMs?: number,
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		formData,
	};
	try {
		return await request<T>(config(apiKey, timeoutMs), requestOptions);
	} catch (error) {
		throw withoutImageData(error);
	}
}

/** Form fields that carry the customer's image, where it lives, or which camera took it. */
const PRIVATE_FIELDS = ['upload', 'upload_url', 'camera_id'] as const;

/**
 * Core's ApiError keeps `request.formData`, which here holds the whole base64
 * image. Rebuild it with those fields redacted; status, body, URL and rate-limit
 * fields stay the same, so the error handlers still match it.
 */
export function withoutImageData(error: unknown): unknown {
	if (!(error instanceof ApiError) || !error.request.formData) return error;
	const formData = { ...error.request.formData };
	for (const field of PRIVATE_FIELDS) {
		if (formData[field] !== undefined) formData[field] = '[REDACTED]';
	}
	const rebuilt = new ApiError(
		{ ...error.request, formData },
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
	rebuilt.stack = error.stack;
	return rebuilt;
}
