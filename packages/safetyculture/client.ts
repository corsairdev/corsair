import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SafetyCultureAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SafetyCultureAPIError';
	}
}

const SAFETYCULTURE_API_BASE = 'https://api.safetyculture.io';

/**
 * Performs a request to the SafetyCulture API.
 * Auth: API key via Bearer token in the Authorization header.
 * Docs: https://developer.safetyculture.com/
 */
export async function makeSafetyCultureRequest<T>(
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
		BASE: SAFETYCULTURE_API_BASE,
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
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		// Preserve ApiError so error-handlers can read .status / .retryAfter
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new SafetyCultureAPIError(error.message);
		}
		throw new SafetyCultureAPIError('Unknown error');
	}
}
