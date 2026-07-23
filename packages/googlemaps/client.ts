import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleMapsAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GoogleMapsAPIError';
	}
}

const DEFAULT_MAPS_BASE = 'https://maps.googleapis.com';

export type GoogleMapsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeGoogleMapsRequest<T>(
	endpoint: string,
	ctx: { key?: string; authType?: 'api_key' | 'oauth_2' },
	options: GoogleMapsRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query = {}, headers = {}, baseUrl } = options;

	const apiBase = baseUrl ?? DEFAULT_MAPS_BASE;
	const token = ctx.key ?? '';
	const isOAuth = ctx.authType === 'oauth_2';

	const requestHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...headers,
	};

	const requestQuery: Record<string, string | number | boolean | undefined> = {
		...query,
	};

	if (isOAuth) {
		requestHeaders.Authorization = `Bearer ${token}`;
	} else if (token) {
		requestHeaders['X-Goog-Api-Key'] = token;
		if (!requestQuery.key) {
			requestQuery.key = token;
		}
	}

	const config: OpenAPIConfig = {
		BASE: apiBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: requestHeaders,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: requestQuery,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		const err = error as {
			status?: number;
			statusCode?: number;
			response?: {
				status?: number;
				data?: { error?: { message?: string; code?: string } };
			};
			body?: { error?: { message?: string; code?: string } };
			message?: string;
		};

		const status = err?.status ?? err?.statusCode ?? err?.response?.status;
		const message =
			err?.body?.error?.message ??
			err?.response?.data?.error?.message ??
			err?.message ??
			'Unknown Google Maps API Error';
		const code = err?.body?.error?.code ?? err?.response?.data?.error?.code;

		throw new GoogleMapsAPIError(message, status, code);
	}
}
