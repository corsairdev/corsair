import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GetProspectAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GetProspectAPIError';
	}
}

// TODO: Update with your API base URL
const GETPROSPECT_API_BASE = 'https://api.example.com';

export async function makeGetProspectRequest<T>(
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
		BASE: GETPROSPECT_API_BASE,
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
		// Rethrow core's ApiError as is: its status and retryAfter are what the
		// error handlers match (429 retries) and what core reads to refresh an
		// OAuth token after a 401. Wrapping it in a new error loses both.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new GetProspectAPIError(error.message);
		}
		throw new GetProspectAPIError('Unknown error');
	}
}
