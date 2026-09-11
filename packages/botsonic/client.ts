import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class BotsonicAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BotsonicAPIError';
	}
}

const BOTSONIC_API_BASE = 'https://api.botsonic.ai';

type BotsonicAuthType = 'token' | 'bot-key';

export async function makeBotsonicRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		authType?: BotsonicAuthType;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, authType = 'token' } = options;

	const authHeaders: Record<string, string> =
		authType === 'token' ? { token: apiKey } : { 'X-BOT-KEY': apiKey };

	const config: OpenAPIConfig = {
		BASE: BOTSONIC_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}

		throw new BotsonicAPIError('Unknown error');
	}
}
