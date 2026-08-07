import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OllamaAPIError extends Error {
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
		this.name = 'OllamaAPIError';
		this.status = status;
		this.retryAfter = retryAfter;
		this.code = code;
	}
}

const DEFAULT_OLLAMA_HOST = 'http://localhost:11434';

export async function makeOllamaRequest<T>(
	endpoint: string,
	keyOrCtx?:
		| string
		| { key?: string; options?: { host?: string; baseUrl?: string } },
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		baseUrl?: string;
		host?: string;
	} = {},
): Promise<T> {
	const apiKey = typeof keyOrCtx === 'string' ? keyOrCtx : keyOrCtx?.key || '';
	const ctxHost =
		typeof keyOrCtx === 'object' && keyOrCtx !== null
			? keyOrCtx.options?.host || keyOrCtx.options?.baseUrl
			: undefined;

	const { method = 'GET', body, query, headers = {}, baseUrl, host } = options;

	let configBase =
		baseUrl ||
		host ||
		ctxHost ||
		process.env.OLLAMA_HOST ||
		DEFAULT_OLLAMA_HOST;

	configBase = configBase.replace(/\/+$/, '');

	let fullUrl = endpoint;
	if (!fullUrl.startsWith('/')) {
		fullUrl = `/${fullUrl}`;
	}

	const reqHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...headers,
	};
	if (apiKey) {
		reqHeaders.Authorization = apiKey.startsWith('Bearer ')
			? apiKey
			: `Bearer ${apiKey}`;
	}

	const config: OpenAPIConfig = {
		BASE: configBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey || undefined,
		HEADERS: reqHeaders,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: fullUrl,
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
			throw new OllamaAPIError(error.message, error.status, error.retryAfter);
		}
		if (error instanceof Error) {
			throw new OllamaAPIError(error.message);
		}
		throw new OllamaAPIError('Unknown error');
	}
}
