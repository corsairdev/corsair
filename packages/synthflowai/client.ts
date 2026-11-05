import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SynthflowAiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'SynthflowAiAPIError';
	}
}

export class SynthflowAiRateLimitError extends SynthflowAiAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'SynthflowAiRateLimitError';
	}
}

const SYNTHFLOW_AI_API_BASE = 'https://api.synthflow.ai/v2';

export type SynthflowAiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const bodyObj =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	const detailObj =
		bodyObj && typeof bodyObj.detail === 'object' && bodyObj.detail !== null
			? (bodyObj.detail as Record<string, unknown>)
			: undefined;
	return (
		(detailObj && 'description' in detailObj
			? String(detailObj.description)
			: undefined) ||
		(bodyObj && typeof bodyObj.detail === 'string'
			? bodyObj.detail
			: undefined) ||
		(bodyObj && 'message' in bodyObj ? String(bodyObj.message) : undefined) ||
		(bodyObj && 'error' in bodyObj ? String(bodyObj.error) : undefined) ||
		error.message
	);
}

export async function makeSynthflowAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SynthflowAiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: SYNTHFLOW_AI_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? (body as Record<string, unknown>) : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new SynthflowAiRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new SynthflowAiAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new SynthflowAiAPIError(error.message);
		}
		throw new SynthflowAiAPIError('Unknown error');
	}
}
