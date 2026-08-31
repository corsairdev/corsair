import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export const WINSTONAI_API_BASE = 'https://api.gowinston.ai/v2';

export const WINSTONAI_NO_RETRY: RateLimitConfig = {
	enabled: false,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) {
			compacted[key] = value;
		}
	}
	return compacted;
}

export async function makeWinstonaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		schema: ZodType<T>;
		body?: Record<string, unknown>;
	},
): Promise<T> {
	if (!apiKey?.trim()) {
		throw new AuthMissingError('winstonai', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: WINSTONAI_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey.trim(),
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: endpoint,
		body: options.body ? compactBody(options.body) : undefined,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const raw = await request(config, requestOptions, {
			rateLimitConfig: WINSTONAI_NO_RETRY,
		});
		return options.schema.parse(raw);
	} catch (error) {
		if (error instanceof ApiError || error instanceof AuthMissingError) {
			throw error;
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Unknown Winston AI request error');
	}
}
