import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';

import { request } from 'corsair/http';

const COUNTDOWNAPI_API_BASE = 'https://api.countdownapi.com';

export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> {
	return Object.fromEntries(
		Object.entries(query).filter(
			(entry): entry is [string, string | number | boolean] =>
				entry[1] !== undefined,
		),
	);
}

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
			...compactQuery(query),
			api_key: apiKey,
		},
	};

	return await request<T>(config, requestOptions);
}
