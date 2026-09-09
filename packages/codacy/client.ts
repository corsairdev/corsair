import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class CodacyAPIError extends Error {
	public status?: number;
	public retryAfter?: string | number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { status?: number; retryAfter?: string | number },
	) {
		super(message);
		this.name = 'CodacyAPIError';
		if (options) {
			this.status = options.status;
			this.retryAfter = options.retryAfter;
		}
	}
}

const CODACY_API_BASE = 'https://api.codacy.com/api/v3';

export async function makeCodacyRequest<T>(
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
		BASE: CODACY_API_BASE,
		VERSION: '3.1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'api-token': apiKey,
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
		if (error instanceof Error) {
			const anyError = error as any;
			throw new CodacyAPIError(error.message, undefined, {
				status: anyError.status,
				retryAfter:
					anyError.retryAfter || anyError.response?.headers?.['retry-after'],
			});
		}
		throw new CodacyAPIError('Unknown error');
	}
}
