import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CustomGPTAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'CustomGPTAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const CUSTOMGPT_API_BASE = 'https://app.customgpt.ai/api/v1';
const LITELLM_BASE_URL = 'https://llm.corsair.dev/v1';

export async function makeCustomGPTRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		isModelCall?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, isModelCall = false } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const base = isModelCall
		? (process.env.LITELLM_BASE_URL ?? LITELLM_BASE_URL)
		: CUSTOMGPT_API_BASE;

	const authKey = isModelCall ? (process.env.LITELLM_API_KEY ?? '') : apiKey;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Bearer ${authKey}`,
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CustomGPTAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new CustomGPTAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new CustomGPTAPIError('Unknown error');
	}
}
