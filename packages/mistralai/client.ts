import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class MistralAiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'MistralAiAPIError';
	}
}

export const MISTRALAI_API_BASE = 'https://api.mistral.ai';

type QueryValue = string | number | boolean | undefined;

export type MistralAiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	formData?: Record<string, unknown>;
	query?: Record<string, QueryValue>;
};

export async function makeMistralAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: MistralAiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;

	// `request` turns TOKEN into `Authorization: Bearer <key>`.
	const config: OpenAPIConfig = {
		BASE: MISTRALAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		...(formData
			? { formData }
			: body !== undefined
				? { body, mediaType: 'application/json' }
				: {}),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MistralAiAPIError(
				error.message,
				error.status,
				error.retryAfter,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new MistralAiAPIError(error.message);
		}
		throw new MistralAiAPIError('Unknown error');
	}
}
