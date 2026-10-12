import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const COINMARKETCAL_API_BASE = 'https://api.coinmarketcal.com';

export async function makeCoinmarketcalRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: request body fields vary by endpoint; narrowed by callers
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: COINMARKETCAL_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// CoinMarketCal explains rejections (e.g. plan tier limits) in `{ error }`.
		if (error instanceof ApiError) {
			const detail = providerErrorMessage(error.body);
			if (detail) error.message = `${error.message}: ${detail}`;
		}
		throw error;
	}
}

// unknown: error bodies are arbitrary JSON; narrowed by the checks below
function providerErrorMessage(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null || !('error' in body)) {
		return undefined;
	}
	return typeof body.error === 'string' ? body.error : undefined;
}
