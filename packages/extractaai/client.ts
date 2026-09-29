import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import type { ExtractaJsonValue } from './endpoints/types';

type ExtractaaiAPIErrorOptions = {
	cause?: Error;
	status?: number;
	statusText?: string;
	retryAfter?: number;
};

export class ExtractaaiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options: ExtractaaiAPIErrorOptions = {},
	) {
		super(message, options);
		this.name = 'ExtractaaiAPIError';

		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.retryAfter = options.cause.retryAfter;
		} else {
			this.status = options.status;
			this.statusText = options.statusText;
			this.retryAfter = options.retryAfter;
		}
	}
}

// Shape of the provider error payloads documented at docs.extracta.ai
// (for example `{ "status": "error", "message": "Language is required" }`).
// Parsed with zod so no manual narrowing of the response body is needed.
const ExtractaErrorBodySchema = z.object({
	message: z.string().optional(),
	error: z.string().optional(),
});

export const EXTRACTAAI_API_BASE = 'https://api.extracta.ai/api/v1';

export const EXTRACTAAI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeExtractaaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: ExtractaJsonValue;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (apiKey.trim() === '') {
		throw new AuthMissingError('extractaai', 'api_key');
	}

	const { method = 'GET', body, query } = options;

	// The transport injects `Authorization: Bearer <TOKEN>` (see
	// packages/corsair/async-core/request.ts), which is exactly the auth
	// scheme documented at docs.extracta.ai/api-reference/authentication.
	const config: OpenAPIConfig = {
		BASE: EXTRACTAAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		// The Extracta delete endpoints require JSON bodies (extractionId and
		// optional batchId/fileId), so DELETE carries a body here, unlike the
		// default scaffold which only sent bodies for POST/PUT/PATCH.
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: EXTRACTAAI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// ApiError is rethrown as ExtractaaiAPIError with status/retryAfter
		// preserved so the binder error-handlers can match on status codes.
		if (error instanceof ApiError) {
			const parsedBody = ExtractaErrorBodySchema.safeParse(error.body);
			const message = parsedBody.success
				? (parsedBody.data.message ?? parsedBody.data.error ?? error.message)
				: error.message;
			throw new ExtractaaiAPIError(message, error.status?.toString(), {
				cause: error,
			});
		}

		if (error instanceof Error) {
			throw new ExtractaaiAPIError(error.message);
		}

		throw new ExtractaaiAPIError('Unknown error');
	}
}
