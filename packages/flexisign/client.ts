import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

type FlexisignAPIErrorOptions = {
	cause?: Error;
	status?: number;
	statusText?: string;
	// Body shape varies by FlexiSign endpoint, so it stays broadly typed;
	// narrowed only to extract message/code strings when present.
	body?: unknown;
	retryAfter?: number;
};

export class FlexisignAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Mirrors ApiError.body from corsair/http, which is itself broadly typed;
	// read only through typeof-narrowed access in the client below.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options: FlexisignAPIErrorOptions = {},
	) {
		super(message, options);
		this.name = 'FlexisignAPIError';

		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else {
			this.status = options.status;
			this.statusText = options.statusText;
			this.body = options.body;
			this.retryAfter = options.retryAfter;
		}
	}
}

const FLEXISIGN_API_BASE = 'https://api.flexisign.io';

export async function makeFlexisignRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Request payloads differ per endpoint with no shared shape, so this
		// stays a record of unknown values; callers pass zod-validated input.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('flexisign', 'api_key');
	}

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: FLEXISIGN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'api-key': apiKey,
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const errorBody = error.body;
			const message =
				typeof errorBody === 'object' &&
				errorBody !== null &&
				'message' in errorBody &&
				typeof errorBody.message === 'string'
					? errorBody.message
					: error.message;

			const code =
				typeof errorBody === 'object' &&
				errorBody !== null &&
				'code' in errorBody &&
				typeof errorBody.code === 'string'
					? errorBody.code
					: error.status?.toString();

			throw new FlexisignAPIError(message, code, { cause: error });
		}

		if (error instanceof Error) {
			throw new FlexisignAPIError(error.message);
		}

		throw new FlexisignAPIError('Unknown error');
	}
}
