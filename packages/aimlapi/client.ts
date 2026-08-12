import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class AimlApiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'AimlApiAPIError';
	}
}

const AIMLAPI_API_BASE = 'https://api.aimlapi.com';

/** OpenAI Assistants beta header required by AIMLAPI assistants/threads docs. */
export const ASSISTANTS_BETA_HEADERS: Record<string, string> = {
	'OpenAI-Beta': 'assistants=v2',
};

export async function makeAimlApiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
		/** When set, provider JSON is validated before return. */
		schema?: ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, schema } = options;

	const config: OpenAPIConfig = {
		BASE: AIMLAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...headers,
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
		query,
	};

	try {
		const data = await request<unknown>(config, requestOptions);
		return schema ? schema.parse(data) : (data as T);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new AimlApiAPIError(error.message);
		}
		throw new AimlApiAPIError('Unknown error');
	}
}
