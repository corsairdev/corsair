import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class AgentMailAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AgentMailAPIError';
	}
}

// TODO: Update with your API base URL
const AGENTMAIL_API_BASE = 'https://api.example.com';

export async function makeAgentMailRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: AGENTMAIL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			// TODO: Add authentication headers
			// 'Authorization': \`Bearer \${apiKey}\`
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
			throw new AgentMailAPIError(error.message);
		}
		throw new AgentMailAPIError('Unknown error');
	}
}
