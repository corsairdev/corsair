import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

export class FixerAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly code?: string | number;

	constructor(
		message: string,
		code?: string | number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'FixerAPIError';
		this.code = code;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

export interface FixerErrorPayload {
	success: false;
	error: {
		code: number | string;
		type?: string;
		info?: string;
	};
}

function isFixerErrorPayload(data: unknown): data is FixerErrorPayload {
	return (
		typeof data === 'object' &&
		data !== null &&
		'success' in data &&
		(data as { success: unknown }).success === false &&
		'error' in data &&
		typeof (data as { error: unknown }).error === 'object' &&
		(data as { error: unknown }).error !== null
	);
}

const FIXER_API_BASE = 'https://api.apilayer.com/fixer';

export async function makeFixerRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		schema?: z.ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, schema } = options;

	const config: OpenAPIConfig = {
		BASE: FIXER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			apikey: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const rawResponse = await request<unknown>(config, requestOptions);

		if (isFixerErrorPayload(rawResponse)) {
			throw new FixerAPIError(
				rawResponse.error.info || rawResponse.error.type || 'Fixer API error',
				rawResponse.error.code,
			);
		}

		if (schema) {
			return schema.parse(rawResponse);
		}

		return rawResponse as T;
	} catch (error) {
		if (error instanceof ApiError || error instanceof FixerAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new FixerAPIError(error.message, undefined, { cause: error });
		}
		throw new FixerAPIError('Unknown error');
	}
}
