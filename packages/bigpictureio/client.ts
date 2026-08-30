import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BigpictureioAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BigpictureioAPIError';
	}
}

export const BIGPICTUREIO_COMPANY_API_BASE = 'https://company.bigpicture.io';
export const BIGPICTUREIO_IP_API_BASE = 'https://ip.bigpicture.io';
export const BIGPICTUREIO_STREAM_TIMEOUT_MS = 210_000;

const BIGPICTUREIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type BigpictureioRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	base?: string;
	timeoutMs?: number;
	acceptPending?: boolean;
};

export async function makeBigpictureioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BigpictureioRequestOptions = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('bigpictureio', 'api_key');
	}

	const {
		method = 'GET',
		body,
		query,
		base = BIGPICTUREIO_COMPANY_API_BASE,
		timeoutMs,
		acceptPending = false,
	} = options;

	const sendsBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeoutMs,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: sendsBody ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
		errors: acceptPending ? {} : { 202: 'Company lookup is still processing' },
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BIGPICTUREIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof AuthMissingError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BigpictureioAPIError(error.message);
		}
		throw new BigpictureioAPIError('Unknown error');
	}
}
