import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ReplicateAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ReplicateAPIError';
	}
}

const REPLICATE_API_BASE = 'https://api.replicate.com/v1';

const REPLICATE_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

function buildConfig(token: string): OpenAPIConfig {
	return {
		BASE: REPLICATE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${token}`,
		},
	};
}

async function rawRequest<T>(
	token: string,
	options: ApiRequestOptions,
): Promise<T> {
	try {
		return await request<T>(buildConfig(token), options, {
			rateLimitConfig: REPLICATE_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ReplicateAPIError(error.message);
		}
		throw new ReplicateAPIError('Unknown Replicate API error');
	}
}

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type RequestInit = {
	method?: RequestMethod;
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, unknown>;
	headers?: Record<string, string | undefined>;
	mediaType?: string;
	formData?: Record<string, unknown>;
};

export async function makeReplicateRequest<T>(
	endpoint: string,
	apiKey: string,
	init: RequestInit = {},
): Promise<T> {
	const { method = 'GET', query, body, headers, mediaType, formData } = init;

	const options: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		headers,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType:
			mediaType ??
			(method === 'POST' || method === 'PATCH'
				? 'application/json; charset=utf-8'
				: undefined),
		formData,
	};

	return rawRequest<T>(apiKey, options);
}
