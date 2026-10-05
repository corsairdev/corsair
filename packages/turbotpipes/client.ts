import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TurbotPipesAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown: Turbot Pipes error bodies are JSON objects, strings, or omitted.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

	constructor(
		message: string,
		options?: {
			cause?: Error;
			code?: string;
			status?: number;
			// unknown: same as body above. The provider does not fix an error shape.
			body?: unknown;
			retryAfter?: number;
			method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'TurbotPipesAPIError';
		this.code = options?.code;
		this.status = options?.status;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
		this.method = options?.method;

		if (options?.cause instanceof ApiError) {
			this.status = this.status ?? options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = this.retryAfter ?? options.cause.retryAfter;
		}
	}
}

const TURBOTPIPES_API_BASE = 'https://pipes.turbot.com/api/v1';

/**
 * Performs an HTTP request to the Turbot Pipes API.
 * Auth: Bearer Token in Authorization header (e.g., Bearer tpt_...).
 */
export async function makeTurbotPipesRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown: endpoint bodies are per-operation objects validated by zod input schemas.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const formattedToken =
		apiKey.startsWith('Bearer ') || apiKey.startsWith('api key ')
			? apiKey
			: `Bearer ${apiKey}`;

	const config: OpenAPIConfig = {
		BASE: TURBOTPIPES_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: formattedToken,
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
		query: query,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new TurbotPipesAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new TurbotPipesAPIError('Unknown Turbot Pipes API error', {
			method,
		});
	}
}
