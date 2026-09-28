import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BannerbearAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BannerbearAPIError';
	}
}

export const BANNERBEAR_API_BASE = 'https://api.bannerbear.com';

export function encodeBannerbearUid(uid: string): string {
	return encodeURIComponent(uid);
}

const READ_MAX_ATTEMPTS = 6;

const NO_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

function isRetryableBannerbearError(error: unknown): error is ApiError {
	if (!(error instanceof ApiError) || error.status === undefined) {
		return false;
	}
	return error.status === 429 || error.status >= 500;
}

function retryDelayMs(error: ApiError, attempt: number): number {
	if (typeof error.retryAfter === 'number' && error.retryAfter >= 0) {
		return error.retryAfter;
	}
	return 2 ** attempt * 1000;
}

export async function makeBannerbearRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		retries?: boolean;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, retries = method === 'GET' } = options;

	const config: OpenAPIConfig = {
		BASE: BANNERBEAR_API_BASE,
		VERSION: '5.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		query,
	};

	const send = async (): Promise<T> => {
		try {
			return await request<T>(config, requestOptions, {
				rateLimitConfig: NO_RETRY,
			});
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}
			if (error instanceof Error) {
				throw new BannerbearAPIError(error.message);
			}
			throw new BannerbearAPIError('Unknown error');
		}
	};

	if (!retries) {
		return await send();
	}

	let lastError: unknown;
	for (let attempt = 0; attempt < READ_MAX_ATTEMPTS; attempt++) {
		try {
			return await send();
		} catch (error) {
			lastError = error;
			if (
				!isRetryableBannerbearError(error) ||
				attempt === READ_MAX_ATTEMPTS - 1
			) {
				throw error;
			}
			await new Promise((resolve) =>
				setTimeout(resolve, retryDelayMs(error, attempt)),
			);
		}
	}
	throw lastError;
}
