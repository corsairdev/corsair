import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BonsaiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'BonsaiAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const BONSAI_API_BASE = 'https://api.bonsai.io';

export async function makeBonsaiRequest<T>(
	endpoint: string,
	credentialsString: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	let credentials: { apiKey: string; apiSecret: string };

	try {
		const parsed = JSON.parse(credentialsString);
		if (
			parsed &&
			typeof parsed === 'object' &&
			typeof parsed.apiKey === 'string' &&
			typeof parsed.apiSecret === 'string'
		) {
			if (!parsed.apiKey || !parsed.apiSecret) {
				throw new Error('API key and secret must not be empty');
			}
			credentials = { apiKey: parsed.apiKey, apiSecret: parsed.apiSecret };
		} else {
			throw new Error('Invalid credentials format');
		}
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === 'API key and secret must not be empty'
		) {
			throw error;
		}
		throw new Error(
			'Invalid Bonsai credentials: both api_key and api_secret are required',
		);
	}

	const config: OpenAPIConfig = {
		BASE: BONSAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		USERNAME: credentials.apiKey,
		PASSWORD: credentials.apiSecret,
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
		if (error instanceof ApiError) {
			throw new BonsaiAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new BonsaiAPIError(error.message, undefined, { cause: error });
		}
		throw new BonsaiAPIError('Unknown error');
	}
}
