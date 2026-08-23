import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class UniswapApiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'UniswapApiAPIError';
	}
}

const UNISWAPAPI_API_BASE = 'https://trade-api.gateway.uniswap.org';

export async function makeUniswapApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: UNISWAPAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'x-permit2-disabled': 'false',
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
		if (error instanceof ApiError) {
			// UniswapApi error responses use { errorCode, detail } instead of the
			// generic { code, message } shape — extract those fields explicitly,
			// falling back to error.message / error.status if the body doesn't match.
			const body = error.body;

			const message =
				typeof body === 'object' &&
				body !== null &&
				'detail' in body &&
				typeof body.detail === 'string'
					? body.detail
					: error.message;

			const code =
				typeof body === 'object' &&
				body !== null &&
				'errorCode' in body &&
				typeof body.errorCode === 'string'
					? body.errorCode
					: error.status?.toString();
			throw new UniswapApiAPIError(message, code);
		}

		if (error instanceof Error) {
			throw new UniswapApiAPIError(error.message);
		}

		throw new UniswapApiAPIError('Unknown error');
	}
}
