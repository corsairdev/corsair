import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DynapicturesAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DynapicturesAPIError';
	}
}

export const DYNAPICTURES_API_BASE = 'https://api.dynapictures.com';

export async function makeDynapicturesRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		formData?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;
	const isForm = formData !== undefined;

	const config: OpenAPIConfig = {
		BASE: DYNAPICTURES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			...(isForm ? {} : { 'Content-Type': 'application/json' }),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: !isForm ? body : undefined,
		formData: isForm ? formData : undefined,
		mediaType: isForm ? undefined : 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DynapicturesAPIError(
				error.message,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new DynapicturesAPIError(error.message);
		}
		throw new DynapicturesAPIError('Unknown Dynapictures API error');
	}
}
