import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const COINMARKETCAL_API_BASE = 'https://api.coinmarketcal.com';

export async function makeCoinmarketcalRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', query } = options;

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

// Safe: the value is read only after typeof/`in` narrowing below.
// A narrower type is not practical because error bodies are unvalidated provider JSON.
function providerErrorMessage(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null || !('error' in body)) {
		return undefined;
	}
	return typeof body.error === 'string' ? body.error : undefined;
}
