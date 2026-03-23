import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import type { RateLimitConfig } from '../../async-core/rate-limit';
import { request } from '../../async-core/request';

export class JiraAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'JiraAPIError';
	}
}

const JIRA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/**
 * Makes a request to the Jira REST API v3.
 * The apiKey should be in "email:apiToken" format for Basic auth (Jira Cloud).
 */
export async function makeJiraRequest<T>(
	endpoint: string,
	apiKey: string,
	cloudUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: `${cloudUrl}/rest/api/3`,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			// Jira Cloud uses Basic auth: base64(email:apiToken)
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
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
		// Allow query params for GET and DELETE (DELETE with query is used by Jira for some endpoints)
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: JIRA_RATE_LIMIT_CONFIG,
	});

	return response;
}

/**
 * Makes a request to the Jira Agile REST API v1.0 (for boards/sprints).
 * The apiKey should be in "email:apiToken" format for Basic auth (Jira Cloud).
 */
export async function makeJiraAgileRequest<T>(
	endpoint: string,
	apiKey: string,
	cloudUrl: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: `${cloudUrl}/rest/agile/1.0`,
		VERSION: '1.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
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
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: JIRA_RATE_LIMIT_CONFIG,
	});

	return response;
}
