import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ASYNCINTERVIEW_API_BASE = 'https://app.asyncinterview.ai/api';

export type AsyncInterviewRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string | number>;
};

/**
 * Async Interview REST client.
 *
 * Auth: `Authorization: Bearer <token>` (Laravel Sanctum). Confirmed on
 * GET /api/jobs. `TOKEN` is also set so corsair/http can attach it.
 *
 * Path ids go through `options.path` and `{job_id}` templates, never
 * concatenated into the URL string.
 */
export async function makeAsyncInterviewRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AsyncInterviewRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, path } = options;

	const config: OpenAPIConfig = {
		BASE: ASYNCINTERVIEW_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		ENCODE_PATH: encodeURIComponent,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		path,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw error instanceof Error ? error : new Error('Unknown error');
	}
}
