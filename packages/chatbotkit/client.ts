import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ChatbotkitAPIError extends Error {
	readonly status?: number;
	readonly body?: unknown;

	constructor(
		message: string,
		options: { status?: number; body?: unknown } = {},
	) {
		super(message);
		this.name = 'ChatbotkitAPIError';
		this.status = options.status;
		this.body = options.body;
	}
}

// https://chatbotkit.com/manuals/spec-introduction — v1 REST API, secret-key
// bearer auth (`sk-...`), envelope response shape `{ success, data, meta }`.
const CHATBOTKIT_API_BASE = 'https://api.chatbotkit.com/api/v1';

export type ChatbotkitEnvelope<TData> = {
	data: TData;
	meta?: Record<string, unknown>;
};

export async function makeChatbotkitRequest<TData>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<ChatbotkitEnvelope<TData>> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: CHATBOTKIT_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		const envelope = await request<{
			success: boolean;
			data?: TData;
			meta?: Record<string, unknown>;
			error?: string;
		}>(config, requestOptions);

		if (!envelope.success) {
			throw new ChatbotkitAPIError(
				envelope.error ?? 'Chatbotkit request failed',
				{ body: envelope },
			);
		}

		return { data: envelope.data as TData, meta: envelope.meta };
	} catch (error) {
		if (error instanceof ApiError || error instanceof ChatbotkitAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ChatbotkitAPIError(error.message);
		}
		throw new ChatbotkitAPIError('Unknown error');
	}
}
