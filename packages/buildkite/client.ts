import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { convertKeysToCamelCase, convertQueryKeysToSnakeCase } from './utils';

export class BuildkiteAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'BuildkiteAPIError';
	}
}

// TODO: Update with your API base URL
const BUILDKITE_API_BASE = 'https://api.buildkite.com';

export async function makeBuildkiteRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BUILDKITE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey ?? '',
		HEADERS: {
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
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
		query:
			method === 'GET' && query
				? convertQueryKeysToSnakeCase(query)
				: undefined,
	};

	try {
		const response = await request<unknown>(config, requestOptions);
		return convertKeysToCamelCase(response) as T;
	} catch (error) {
		if (
			error &&
			typeof error === 'object' &&
			'status' in error &&
			typeof error.status === 'number'
		) {
			throw new BuildkiteAPIError(
				error instanceof Error ? error.message : 'Buildkite API error',
				error.status,
			);
		}
		throw new BuildkiteAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}
