import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DocsbotaiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'DocsbotaiAPIError';
	}
}

const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

/** Admin requests always require a user API key; public chat bots may not. */
export async function makeDocsbotaiRequest<T>(
	host: 'admin' | 'chat',
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Validated request bodies have different shapes across operations.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (host === 'admin' && !apiKey)
		throw new AuthMissingError('docsbotai', 'api_key');
	const config: OpenAPIConfig = {
		BASE:
			host === 'admin' ? 'https://docsbot.ai/api' : 'https://api.docsbot.ai',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey || undefined,
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: endpoint,
		body: options.body,
		query: options.query,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		return await request<T>(config, requestOptions, { rateLimitConfig });
	} catch (error) {
		if (error instanceof ApiError) {
			// Error payloads come from the provider and must be narrowed before use.
			const body: unknown = error.body;
			// Arbitrary provider error fields have no documented shared value type.
			const record =
				body && typeof body === 'object'
					? (body as Record<string, unknown>)
					: undefined;
			const message =
				typeof record?.message === 'string'
					? record.message
					: typeof record?.error === 'string'
						? record.error
						: error.message;
			throw new DocsbotaiAPIError(message, error.status, error.retryAfter);
		}
		throw error;
	}
}
