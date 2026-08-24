import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AltTextAiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// API error bodies vary by endpoint; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AltTextAiAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const ALTTEXT_AI_API_BASE = 'https://alttext.ai/api/v1';

export type AltTextAiRequestOptions = {
	apiKey?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	formData?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function buildConfig(apiKey?: string, isJsonWrite = false): OpenAPIConfig {
	return {
		BASE: ALTTEXT_AI_API_BASE,
		VERSION: '1.9.6',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(apiKey ? { 'X-API-Key': apiKey } : {}),
			...(isJsonWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};
}

// Catch values are untyped at runtime; narrow to ApiError/Error before rethrowing.
async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError) {
		throw new AltTextAiAPIError(error.message, error.status, {
			cause: error,
		});
	}
	if (error instanceof Error) {
		throw new AltTextAiAPIError(error.message, undefined, { cause: error });
	}
	throw new AltTextAiAPIError('Unknown error');
}

/**
 * Performs a request to the AltText.ai REST API.
 *
 * Auth: API key via the `X-API-Key` request header.
 */
export async function makeAltTextAiRequest<T>(
	endpoint: string,
	options: AltTextAiRequestOptions = {},
): Promise<T> {
	const { apiKey, method = 'GET', body, formData, query = {} } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';
	const isJsonWrite = isWrite && !formData;

	const config = buildConfig(apiKey, isJsonWrite);

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isJsonWrite ? body : undefined,
		formData: isWrite && formData ? formData : undefined,
		mediaType: isJsonWrite ? 'application/json' : undefined,
		query:
			method === 'GET' || method === 'DELETE' || method === 'PUT'
				? query
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}
