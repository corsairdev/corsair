import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ClickmeetingAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ClickmeetingAPIError';
	}
}

const CLICKMEETING_API_BASE = 'https://api.clickmeeting.com/v1';

export async function makeClickmeetingRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: any;
		mediaType?: string;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, mediaType } = options;

	const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
	const resolvedMediaType =
		mediaType !== undefined
			? mediaType
			: isFormData
				? undefined
				: 'application/json; charset=utf-8';

	const config: OpenAPIConfig = {
		BASE: CLICKMEETING_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'X-Api-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: resolvedMediaType,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ClickmeetingAPIError(error.message);
		}
		throw new ClickmeetingAPIError('Unknown error');
	}
}
