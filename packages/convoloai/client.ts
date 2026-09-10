import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ConvoloAiAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly body?: unknown,
		options?: { cause?: Error },
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'ConvoloAiAPIError';
		this.status = status;
		this.body = body;
	}
}

const CONVOLOAI_API_BASE = 'https://app.brightcall.ai';

export async function makeConvoloAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CONVOLOAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'api-key': apiKey,
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
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ConvoloAiAPIError(error.message, undefined, undefined, {
				cause: error,
			});
		}
		throw new ConvoloAiAPIError('Unknown error');
	}
}
