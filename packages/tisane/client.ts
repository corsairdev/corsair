import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TisaneAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'TisaneAPIError';
	}
}

export const TISANE_API_BASE = 'https://api.tisane.ai';

export async function makeTisaneRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'POST', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TISANE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': apiKey,
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
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw new TisaneAPIError(
				error.message,
				undefined,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			const status =
				'status' in error ? (error as { status?: number }).status : undefined;
			const retryAfter =
				'retryAfter' in error
					? (error as { retryAfter?: number }).retryAfter
					: undefined;
			throw new TisaneAPIError(error.message, undefined, status, retryAfter);
		}
		throw new TisaneAPIError('Unknown Tisane API error');
	}
}
