import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FaradayAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'FaradayAPIError';
	}
}

export class FaradayRateLimitError extends FaradayAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'FaradayRateLimitError';
	}
}

/** Official Faraday REST API. https://faraday.ai/docs/reference */
export const FARADAY_API_BASE = 'https://api.faraday.ai/v1';

export type FaradayRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | string[] | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	return (
		(body && typeof body.note === 'string' ? body.note : undefined) ||
		(body && typeof body.error === 'string' ? body.error : undefined) ||
		(body && typeof body.message === 'string' ? body.message : undefined) ||
		error.message
	);
}

export async function makeFaradayRequest<T>(
	endpoint: string,
	apiKey: string,
	options: FaradayRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: FARADAY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new FaradayRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new FaradayAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new FaradayAPIError(error.message);
		}
		throw new FaradayAPIError('Unknown error');
	}
}
