import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BuildkiteAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BuildkiteAPIError';
	}
}

export class BuildkiteRateLimitError extends BuildkiteAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'BuildkiteRateLimitError';
	}
}

const BUILDKITE_API_BASE = 'https://api.buildkite.com';

export type BuildkiteRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const bodyObj =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	return (
		(bodyObj && 'message' in bodyObj ? String(bodyObj.message) : undefined) ||
		error.message
	);
}

export async function makeBuildkiteRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: BuildkiteRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: BUILDKITE_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey ?? '',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new BuildkiteRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new BuildkiteAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new BuildkiteAPIError(error.message);
		}
		throw new BuildkiteAPIError('Unknown error');
	}
}
