import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class AivoovAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AivoovAPIError';
	}
}

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
		body: form,
		mediaType:
			method === 'POST' ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new AivoovAPIError(error.message);
		}

		throw new AivoovAPIError('Unknown error');
	}
}
