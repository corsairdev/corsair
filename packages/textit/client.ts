import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const TEXTIT_API_BASE = 'https://textit.com/api/v2';

// Core retries a 429 three times, honouring Retry-After. TextIt's throttle sends
// Retry-After; no reset-time header is read, so a long window never becomes the delay.
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type TextItRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// Different endpoints submit different validated JSON bodies; no single shape fits.
	body?: unknown;
	formData?: { file: Blob };
};

/** The endpoint's output schema narrows this untrusted, endpoint-specific JSON or 204 response. */
export async function makeTextItRequest(
	key: string,
	spec: TextItRequest,
): Promise<unknown> {
	if (!key?.trim()) throw new AuthMissingError('textit', 'api_key');
	const config: OpenAPIConfig = {
		BASE: TEXTIT_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Token ${key}` },
	};
	const options: ApiRequestOptions = {
		method: spec.method,
		url: spec.path,
		query: spec.query,
		body: spec.body,
		formData: spec.formData,
		mediaType: spec.body === undefined ? undefined : 'application/json',
	};
	// The generic transport sees all resource shapes; the endpoint validates the result.
	// Core's ApiError passes through unchanged so handlers and Corsair see its status and body.
	return request<unknown>(config, options, { rateLimitConfig });
}
