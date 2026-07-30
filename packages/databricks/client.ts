import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DatabricksAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;
	public readonly code?: string;

	constructor(
		message: string,
		status?: number,
		retryAfter?: number,
		code?: string,
	) {
		super(message);
		this.name = 'DatabricksAPIError';
		this.status = status;
		this.retryAfter = retryAfter;
		this.code = code;
	}
}

const DEFAULT_DATABRICKS_HOST = 'https://localhost.cloud.databricks.com';

export async function makeDatabricksRequest<T>(
	endpoint: string,
	keyOrCtx:
		| string
		| { key: string; options?: { host?: string; baseUrl?: string } },
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		baseUrl?: string;
		host?: string;
		responseType?: 'json' | 'text';
	} = {},
): Promise<T> {
	const apiKey = typeof keyOrCtx === 'string' ? keyOrCtx : keyOrCtx.key;
	const ctxHost =
		typeof keyOrCtx === 'object' && keyOrCtx !== null
			? keyOrCtx.options?.host || keyOrCtx.options?.baseUrl
			: undefined;

	const {
		method = 'GET',
		body,
		query,
		headers = {},
		baseUrl,
		host,
		responseType = 'json',
	} = options;

	let fullUrl = endpoint;
	let configBase =
		baseUrl ||
		host ||
		ctxHost ||
		process.env.DATABRICKS_HOST ||
		DEFAULT_DATABRICKS_HOST;

	if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
		const parsed = new URL(endpoint);
		configBase = parsed.origin;
		fullUrl = parsed.pathname + parsed.search;
	} else if (!fullUrl.startsWith('/')) {
		fullUrl = `/api/2.0/${fullUrl}`;
	}

	const config: OpenAPIConfig = {
		BASE: configBase,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: fullUrl,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
		responseHeader: responseType === 'text' ? 'text' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const body = error.body as { error_code?: string } | undefined;
			throw new DatabricksAPIError(
				error.message,
				error.status,
				error.retryAfter,
				body?.error_code,
			);
		}
		if (error instanceof Error) {
			throw new DatabricksAPIError(error.message);
		}
		throw new DatabricksAPIError('Unknown Databricks error');
	}
}
