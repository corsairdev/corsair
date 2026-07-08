import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GoogleAdsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GoogleAdsAPIError';
	}
}

const GOOGLEADS_API_BASE = 'https://googleads.googleapis.com/v18';

export async function makeGoogleAdsRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Using `unknown` because request bodies differ per endpoint; callers are responsible for constructing valid payloads.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		developerToken?: string;
		loginCustomerId?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		developerToken,
		loginCustomerId,
	} = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (developerToken) {
		headers['developer-token'] = developerToken;
	}

	if (loginCustomerId) {
		headers['login-customer-id'] = loginCustomerId;
	}

	const config: OpenAPIConfig = {
		BASE: GOOGLEADS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: headers,
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
			throw new GoogleAdsAPIError(
				error.message,
				String(error.status),
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new GoogleAdsAPIError(error.message);
		}
		throw new GoogleAdsAPIError('Unknown error');
	}
}
