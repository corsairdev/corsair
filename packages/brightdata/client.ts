import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BrightDataAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BrightDataAPIError';
	}
}

const BRIGHTDATA_API_BASE = 'https://api.brightdata.com';

export async function makeBrightDataRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;

	const trimmedKey = apiKey?.trim();
	if (!trimmedKey) {
		throw new BrightDataAPIError('Bright Data API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: BRIGHTDATA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: trimmedKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${trimmedKey}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const msg =
				typeof error.body === 'object' && error.body && 'message' in error.body
					? String((error.body as Record<string, unknown>).message)
					: error.message;
			throw new BrightDataAPIError(
				msg || error.message,
				(error.body as Record<string, unknown>)?.code as string | undefined,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new BrightDataAPIError(error.message);
		}
		throw new BrightDataAPIError('Unknown error');
	}
}
