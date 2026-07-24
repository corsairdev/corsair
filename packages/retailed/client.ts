import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RetailedAPIError extends Error {
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
		this.name = 'RetailedAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type RetailedCredentials = {
	authType: 'api_key' | 'oauth_2';
	credential: string;
};

export function packRetailedKey(credentials: RetailedCredentials): string {
	return JSON.stringify(credentials);
}

export function parseRetailedKey(key: string): RetailedCredentials {
	try {
		const parsed = JSON.parse(key);

		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			'authType' in parsed &&
			'credential' in parsed
		) {
			return parsed as RetailedCredentials;
		}
	} catch {
		// Backward compatibility: treat a plain string as an API key.
	}

	return {
		authType: 'api_key',
		credential: key,
	};
}

const RETAILED_API_BASE = 'https://app.retailed.io/api/v1';

export async function makeRetailedRequest<T>(
	endpoint: string,
	key: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	const { authType, credential } = parseRetailedKey(key);

	if (authType === 'api_key') {
		headers['x-api-key'] = credential;
	} else {
		headers.Authorization = `Bearer ${credential}`;
	}

	const config: OpenAPIConfig = {
		BASE: RETAILED_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: '',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RetailedAPIError(error.message, String(error.status), {
				cause: error,
			});
		}

		if (error instanceof Error) {
			throw new RetailedAPIError(error.message, undefined, {
				cause: error,
			});
		}

		throw new RetailedAPIError('Unknown error');
	}
}
