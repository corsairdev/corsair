import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WhautomateAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'WhautomateAPIError';
	}
}

export async function makeWhautomateRequest<T>(
	apiHost: string,
	apiKey: string,
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: apiHost.replace(/\/$/, ''),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'APPOINTO-TOKEN': apiKey,
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
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			const bodyMessage =
				error.body?.error?.message ||
				error.body?.message ||
				error.body?.error ||
				error.message;
			throw new WhautomateAPIError(
				bodyMessage,
				String(error.status),
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new WhautomateAPIError(error.message);
		}
		throw new WhautomateAPIError('Unknown error');
	}
}
