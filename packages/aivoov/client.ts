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
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		formEncoded?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, formEncoded = false } = options;

	const config: OpenAPIConfig = {
		BASE: AIVOOV_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'X-API-KEY': apiKey,
			...(formEncoded
				? {
						'Content-Type': 'application/x-www-form-urlencoded',
					}
				: {
						'Content-Type': 'application/json',
					}),
		},
	};

	const requestBody = formEncoded
		? (() => {
				const params = new URLSearchParams();

				for (const [key, value] of Object.entries(body ?? {})) {
					params.append(key, String(value));
				}

				return params.toString();
			})()
		: body;

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? requestBody
				: undefined,
		mediaType: formEncoded
			? 'application/x-www-form-urlencoded'
			: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
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
