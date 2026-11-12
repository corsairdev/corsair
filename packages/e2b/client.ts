import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class E2bAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'E2bAPIError';
	}
}

// TODO: Replace with the real base URL from the E2b API docs
const E2B_API_BASE = 'https://api.TODO_e2b.com';

export async function makeE2bRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// TODO: Update HEADERS to match the E2b API auth format.
	// Common patterns:
	//   Bearer token:  'Authorization': `Bearer ${apiKey}`
	//   API key header: 'X-Api-Key': apiKey  (or 'X-E2b-Key', 'Api-Key', etc.)
	//   Query param:   add apiKey to the `query` object below (some APIs use ?api_key=...)
	const config: OpenAPIConfig = {
		BASE: E2B_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			// TODO: Replace with correct auth header for E2b
			'Authorization': `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) throw new E2bAPIError(error.message);
		throw new E2bAPIError('Unknown error');
	}
}
