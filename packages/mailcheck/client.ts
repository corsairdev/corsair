import { ApiError, type ApiRequestOptions, type OpenAPIConfig, request } from 'corsair/http';

export class MailcheckAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MailcheckAPIError';
	}
}

const MAILCHECK_API_BASE = 'https://api.mailcheck.ing/v1';

export async function makeMailcheckRequest<T>(
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
		BASE: MAILCHECK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
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
		// ApiError carries status and retryAfter that error-handlers.ts
		// needs for rate-limit and auth matching. Re-throw as-is.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new MailcheckAPIError(error.message);
		}
		throw new MailcheckAPIError('Unknown error');
	}
}
