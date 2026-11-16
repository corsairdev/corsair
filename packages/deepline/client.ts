import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const DEEPLINE_API_BASE = 'https://code.deepline.com';
export type DeeplineQuery = Record<
	string,
	string | number | boolean | undefined
>;
export interface DeeplineRequestOptions {
	method?: 'GET' | 'POST';
	query?: DeeplineQuery;
	// Tools and Plays each define their own JSON input contract at runtime.
	body?: unknown;
	headers?: Record<string, string | undefined>;
}

export function segment(value: string): string {
	if (!value || value === '.' || value === '..') {
		throw new Error('Invalid Deepline path identifier');
	}
	return encodeURIComponent(value);
}

/** Uses only the key resolved by Corsair's binder. Never retries a 5xx/write. */
export async function makeDeeplineRequest(
	path: string,
	key: string,
	options: DeeplineRequestOptions = {},
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: DEEPLINE_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: `Bearer ${key}` },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: path,
		query: options.query,
		body: options.body,
		headers: options.headers,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		return await request(config, requestOptions, {
			rateLimitConfig: {
				enabled: true,
				maxRetries: 3,
				initialRetryDelay: 1000,
				backoffMultiplier: 2,
				headerNames: { retryAfter: 'Retry-After' },
			},
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Provider errors can echo payloads, keys and lead data. Keep the same
			// ApiError instance/status/retry metadata for core, but drop raw content.
			Object.assign(error, {
				message: `Deepline API request failed (HTTP ${error.status})`,
				body: undefined,
				request: { method: requestOptions.method, url: '/api/v2' },
				url: `${DEEPLINE_API_BASE}/api/v2`,
				statusText: '',
			});
			// Error.stack captures the original message when constructed.
			error.stack = `${error.name}: ${error.message}`;
		}
		throw error;
	}
}
