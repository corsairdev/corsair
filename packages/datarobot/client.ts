import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { DatarobotQueryValue } from './utils';

export class DatarobotAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'DatarobotAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

export const DEFAULT_DATAROBOT_ORIGIN = 'https://app.datarobot.com';

function resolveOrigin(raw?: string): string {
	const value = (raw ?? DEFAULT_DATAROBOT_ORIGIN).trim();
	if (!value) {
		return DEFAULT_DATAROBOT_ORIGIN;
	}
	const withScheme = value.includes('://') ? value : `https://${value}`;
	try {
		return new URL(withScheme).origin;
	} catch {
		return DEFAULT_DATAROBOT_ORIGIN;
	}
}

export async function makeDatarobotRequest<T>(
	endpoint: string,
	keyOrCtx:
		| string
		| {
				key: string;
				options?: { baseUrl?: string; host?: string };
		  },
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, DatarobotQueryValue>;
	} = {},
): Promise<T> {
	const apiKey = typeof keyOrCtx === 'string' ? keyOrCtx : keyOrCtx.key;
	if (!apiKey?.trim()) {
		throw new DatarobotAPIError('DataRobot API key is missing');
	}

	const ctxBase =
		typeof keyOrCtx === 'object'
			? keyOrCtx.options?.baseUrl || keyOrCtx.options?.host
			: undefined;

	const { method = 'GET', body, query } = options;
	const origin = resolveOrigin(ctxBase);

	const config: OpenAPIConfig = {
		BASE: origin,
		VERSION: '2.47.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`,
			...(method === 'GET' || method === 'DELETE'
				? {}
				: { 'Content-Type': 'application/json' }),
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
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new DatarobotAPIError(error.message, { cause: error });
		}
		throw new DatarobotAPIError('Unknown DataRobot error');
	}
}
