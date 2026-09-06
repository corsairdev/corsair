import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';

import { request } from 'corsair/http';

const COUNTDOWNAPI_API_BASE = 'https://api.countdownapi.com';

export async function makeCountdownApiRequest<T>(
	endpoint: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: COUNTDOWNAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: {
			...query,
			api_key: apiKey,
		},
	};

	// No try/catch deliberately: `request()` throws a `corsair/http`
	// `ApiError` (with `.status`/`.retryAfter`) on failure, and
	// `error-handlers.ts`'s matchers depend on that concrete type. Wrapping
	// it in a generic error class here would strip the status code before
	// any handler ever saw it.
	return await request<T>(config, requestOptions);
}
