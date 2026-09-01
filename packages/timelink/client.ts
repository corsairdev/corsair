import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TimelinkAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'TimelinkAPIError';
	}
}

export const TIMELINK_API_BASE = 'https://api.timelink.io/api/v1';

export async function makeTimelinkRequest<T>(
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
		BASE: TIMELINK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
			throw new TimelinkAPIError(error.message, error.status);
		}
		if (error instanceof Error) {
			throw new TimelinkAPIError(error.message);
		}
		throw new TimelinkAPIError('Unknown error');
	}
}
