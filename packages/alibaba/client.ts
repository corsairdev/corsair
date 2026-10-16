import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// The shared international domain. Model Studio recommends a workspace domain,
// https://{WorkspaceId}.{region}.maas.aliyuncs.com, set with the baseUrl option.
export const DASHSCOPE_API_BASE = 'https://dashscope-intl.aliyuncs.com';

export class AlibabaAPIError extends Error {
	readonly status?: number;
	/** DashScope error code, e.g. InvalidApiKey or Throttling.RateQuota. */
	readonly code?: string;
	readonly requestId?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are { request_id, code, message } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'AlibabaAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.code = readString(cause.body, 'code');
			this.requestId = readString(cause.body, 'request_id');
		}
	}
}

// unknown: error body shape is not guaranteed.
function readString(body: unknown, key: string): string | undefined {
	if (body && typeof body === 'object' && key in body) {
		const value = (body as Record<string, unknown>)[key];
		return typeof value === 'string' ? value : undefined;
	}
	return undefined;
}

/** Accepts the origin with or without the /api/v1 suffix the console shows. */
export function normalizeBaseUrl(baseUrl: string | undefined): string {
	return (baseUrl ?? DASHSCOPE_API_BASE)
		.replace(/\/+$/, '')
		.replace(/\/api\/v1$/, '');
}

export async function makeDashScopeRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		path?: Record<string, string>;
		body?: object;
		/** Video synthesis only accepts asynchronous calls. */
		async?: boolean;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body } = options;

	const config: OpenAPIConfig = {
		BASE: normalizeBaseUrl(options.baseUrl),
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
			...(options.async ? { 'X-DashScope-Async': 'enable' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: options.path,
		body,
		mediaType: body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const code = readString(error.body, 'code');
			const message = readString(error.body, 'message');
			throw new AlibabaAPIError(
				code || message
					? `${error.status} ${[code, message].filter(Boolean).join(': ')}`
					: error.message,
				error,
			);
		}
		if (error instanceof Error) {
			throw new AlibabaAPIError(error.message, error);
		}
		throw new AlibabaAPIError('Unknown DashScope API error');
	}
}
