/**
 * Base client interface and utilities for plugin API clients
 */

/**
 * Base API error class for plugin clients
 * Plugins can extend this for their specific error types
 */
export class BaseAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = 'BaseAPIError';
	}
}

/**
 * Base API client interface
 * Plugin-specific clients should extend this interface
 */
export interface BaseAPIClient {
	/**
	 * Make a request to the API
	 * This is a generic method that can be used for any API call
	 */
	request?<T>(endpoint: string, options?: RequestOptions): Promise<T>;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	headers?: Record<string, string>;
	body?: unknown;
	params?: Record<string, string>;
}

/**
 * Base HTTP request configuration
 */
export interface BaseHTTPConfig {
	baseURL: string;
	headers?: Record<string, string>;
	timeout?: number;
}

/**
 * Create a base HTTP client factory
 * This provides common functionality for REST API clients
 */
export function createBaseHTTPClient(config: BaseHTTPConfig) {
	const { baseURL, headers = {}, timeout = 30000 } = config;

	/**
	 * Make an HTTP request
	 */
	async function makeRequest<T>(
		endpoint: string,
		options: RequestOptions = {},
	): Promise<T> {
		const { method = 'GET', body, params, headers: requestHeaders = {} } = options;

		let url = `${baseURL}${endpoint}`;
		if (params && Object.keys(params).length > 0) {
			const searchParams = new URLSearchParams(params);
			url += `?${searchParams.toString()}`;
		}

		const allHeaders: Record<string, string> = {
			...headers,
			...requestHeaders,
		};

		if (body && !allHeaders['Content-Type']) {
			allHeaders['Content-Type'] = 'application/json';
		}

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				method,
				headers: allHeaders,
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new BaseAPIError(
					errorData.message || `HTTP error! status: ${response.status}`,
					errorData.code || `http_${response.status}`,
					response.status,
				);
			}

			return response.json() as Promise<T>;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof BaseAPIError) {
				throw error;
			}
			if (error instanceof Error && error.name === 'AbortError') {
				throw new BaseAPIError('Request timeout', 'timeout', 408);
			}
			throw new BaseAPIError(
				error instanceof Error ? error.message : 'Unknown error occurred',
				'unknown',
			);
		}
	}

	return {
		makeRequest,
	};
}

/**
 * Create a base GraphQL client factory
 * This provides common functionality for GraphQL API clients
 */
export function createBaseGraphQLClient(config: BaseHTTPConfig) {
	const { baseURL, headers = {}, timeout = 30000 } = config;

	/**
	 * Make a GraphQL request
	 */
	async function makeRequest<T>(
		query: string,
		variables?: Record<string, unknown>,
	): Promise<T> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(baseURL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...headers,
				},
				body: JSON.stringify({
					query,
					variables: variables || {},
				}),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new BaseAPIError(
					`HTTP error! status: ${response.status}`,
					`http_${response.status}`,
					response.status,
				);
			}

			const result = await response.json();

			if (result.errors && result.errors.length > 0) {
				throw new BaseAPIError(
					result.errors[0].message || 'GraphQL error',
					result.errors[0].extensions?.code,
				);
			}

			return result.data as T;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof BaseAPIError) {
				throw error;
			}
			if (error instanceof Error && error.name === 'AbortError') {
				throw new BaseAPIError('Request timeout', 'timeout', 408);
			}
			throw new BaseAPIError(
				error instanceof Error ? error.message : 'Unknown error occurred',
				'unknown',
			);
		}
	}

	return {
		makeRequest,
	};
}

