import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CalAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		// Error response body from Cal.com API - can be string, object, or other formats
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'CalAPIError';
	}
}

const CAL_API_BASE = 'https://api.cal.com/v2';

export async function makeCalRequest<T>(
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
		BASE: CAL_API_BASE,
		VERSION: '2024-08-13',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'cal-api-version': '2024-08-13',
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
			throw new CalAPIError(bodyMessage, String(error.status), error.body);
		}
		if (error instanceof Error) {
			throw new CalAPIError(error.message);
		}
		throw new CalAPIError('Unknown error');
	}
}
