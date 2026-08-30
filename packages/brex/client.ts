import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BrexAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BrexAPIError';
	}
}

export class BrexRateLimitError extends BrexAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'BrexRateLimitError';
	}
}

/** Official production host: https://developer.brex.com/guides/authentication */
export const BREX_API_BASE = 'https://api.brex.com';
export const BREX_OAUTH_AUTHORIZE_URL =
	'https://accounts-api.brex.com/oauth2/default/v1/authorize';
export const BREX_OAUTH_TOKEN_URL =
	'https://accounts-api.brex.com/oauth2/default/v1/token';

export type BrexRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	return (
		(body && typeof body.message === 'string' ? body.message : undefined) ||
		(body && typeof body.error === 'string' ? body.error : undefined) ||
		error.message
	);
}

export async function makeBrexRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BrexRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const hasBody = body !== undefined;

	const config: OpenAPIConfig = {
		BASE: BREX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...(hasBody ? { 'Content-Type': 'application/json' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new BrexRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new BrexAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new BrexAPIError(error.message);
		}
		throw new BrexAPIError('Unknown error');
	}
}
