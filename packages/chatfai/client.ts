import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ChatfaiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'ChatfaiAPIError';
	}
}

export class ChatfaiRateLimitError extends ChatfaiAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'ChatfaiRateLimitError';
	}
}

/** Official ChatFAI REST v1. https://chatfai.com/developers/docs */
export const CHATFAI_API_BASE = 'https://api.chatfai.com/v1';

export type ChatfaiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	if (body && typeof body.error === 'string' && body.error.length > 0) {
		return body.error;
	}
	if (body && typeof body.message === 'string' && body.message.length > 0) {
		return body.message;
	}
	return error.message;
}

export async function makeChatfaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ChatfaiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: CHATFAI_API_BASE,
		VERSION: '1.0.0',
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
		body: isWrite ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new ChatfaiRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new ChatfaiAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new ChatfaiAPIError(error.message);
		}
		throw new ChatfaiAPIError('Unknown error');
	}
}
