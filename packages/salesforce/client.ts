import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class SalesforceAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SalesforceAPIError';
	}
}

const DEFAULT_SALESFORCE_API_BASE = 'https://login.salesforce.com';

export async function makeSalesforceRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		baseUrl?: string;
		responseType?: 'json' | 'text' | 'arraybuffer';
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers = {},
		baseUrl,
		responseType = 'json',
	} = options;

	let fullUrl = endpoint;
	let configBase =
		baseUrl ||
		process.env.SALESFORCE_INSTANCE_URL ||
		DEFAULT_SALESFORCE_API_BASE;

	if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
		const parsed = new URL(endpoint);
		configBase = parsed.origin;
		fullUrl = parsed.pathname + parsed.search;
	} else if (!fullUrl.startsWith('/')) {
		fullUrl = `/services/data/v60.0/${fullUrl}`;
	}

	const config: OpenAPIConfig = {
		BASE: configBase,
		VERSION: '60.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: fullUrl,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
		responseHeader: responseType === 'text' ? 'text' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new SalesforceAPIError(error.message);
		}
		throw new SalesforceAPIError('Unknown error');
	}
}
