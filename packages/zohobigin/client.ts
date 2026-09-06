import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ZohoBiginAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ZohoBiginAPIError';
	}
}

const ZOHOBIGIN_API_BASE = 'https://www.zohoapis.com/bigin/v1';

export type ZohoBiginRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	mediaType?: string;
	baseUrl?: string;
};

export async function makeZohoBiginRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ZohoBiginRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, mediaType, baseUrl } = options;

	const isFormData =
		typeof FormData !== 'undefined' && body instanceof FormData;

	const defaultHeaders: Record<string, string> = {
		Authorization: `Zoho-oauthtoken ${apiKey}`,
		...headers,
	};

	if (!isFormData && !defaultHeaders['Content-Type']) {
		defaultHeaders['Content-Type'] = 'application/json';
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? ZOHOBIGIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: defaultHeaders,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: isFormData
			? undefined
			: (mediaType ?? 'application/json; charset=utf-8'),
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new ZohoBiginAPIError('Unknown error');
	}
}
