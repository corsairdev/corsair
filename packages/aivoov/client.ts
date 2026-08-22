import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const AIVOOV_API_BASE = 'https://aivoov.com/api/v8';

export async function makeAivoovRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
		form?: Record<string, string | string[] | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query, form } = options;

	// Serialize form fields as a URL-encoded string so the corsair/http
	// request helper sends them correctly. Passing a plain object with
	// mediaType 'application/x-www-form-urlencoded' causes the helper to
	// JSON.stringify the body instead of URL-encoding it.
	let body: string | undefined;
	if (method === 'POST' && form) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(form)) {
			if (value === undefined) continue;
			if (Array.isArray(value)) {
				for (const v of value) {
					params.append(key, v);
				}
			} else {
				params.append(key, value);
			}
		}
		body = params.toString();
	}

	const config: OpenAPIConfig = {
		BASE: AIVOOV_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'X-API-KEY': apiKey,
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		body,
		mediaType:
			method === 'POST' ? 'application/x-www-form-urlencoded' : undefined,
	};

	// Re-throw ApiError directly so error-handlers.ts can inspect
	// error.status (e.g. 429) and error.retryAfter for rate-limit retries.
	// Wrapping in a custom error class would discard that metadata.
	return await request<T>(config, requestOptions);
}
