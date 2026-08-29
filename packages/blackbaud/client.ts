import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class BlackbaudAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BlackbaudAPIError';
	}
}

// Update to official Blackbaud SKY API URL
const BLACKBAUD_API_BASE = 'https://api.sky.blackbaud.com';

export async function makeBlackbaudRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: any;
		query?: Record<string, string | number | boolean | undefined>;
		subscriptionKey?: string;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, subscriptionKey, headers } = options;

	const isAbsolute = endpoint.startsWith('http');

	const config: OpenAPIConfig = {
		BASE: isAbsolute ? '' : BLACKBAUD_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...(subscriptionKey
				? { 'Bb-Api-Subscription-Key': subscriptionKey }
				: {}),
			...headers,
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
		if (error instanceof Error) {
			throw new BlackbaudAPIError(error.message);
		}
		throw new BlackbaudAPIError('Unknown error');
	}
}
