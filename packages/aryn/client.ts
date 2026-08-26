import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ArynAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ArynAPIError';
	}
}

const ARYN_API_BASE = 'https://api.aryn.ai';

export async function makeArynRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		baseUrl?: string;
		responseType?: 'json' | 'binary';
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		formData,
		baseUrl = ARYN_API_BASE,
		responseType = 'json',
	} = options;

	if (responseType === 'binary') {
		const url = `${baseUrl}${endpoint}`;
		const res = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		if (!res.ok) {
			throw new ArynAPIError(
				`Request failed with status ${res.status}: ${res.statusText}`,
			);
		}
		return Buffer.from(await res.arrayBuffer()) as T;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			!formData && (method === 'POST' || method === 'PUT' || method === 'PATCH')
				? body
				: undefined,
		formData,
		mediaType: formData ? undefined : 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new ArynAPIError(error.message);
		}
		throw new ArynAPIError('Unknown error');
	}
}
