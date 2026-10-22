import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

export class ClaidAiAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ClaidAiAPIError';
	}
}

const CLAIDAI_API_BASE = 'https://api.claid.ai/v1';

// Claid.ai sends RateLimit-Reset as seconds until the quota resets, which is
// the same unit Retry-After uses, so it drives the retry delay on a 429.
const CLAIDAI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'ratelimit-reset',
		remaining: 'ratelimit-remaining',
	},
};

export async function makeClaidAiRequest<S extends z.ZodType>(
	endpoint: string,
	apiKey: string,
	responseSchema: S,
	options: {
		method?: 'GET' | 'POST' | 'DELETE' | 'PATCH';
		body?: object;
	} = {},
): Promise<z.infer<S>> {
	const { method = 'GET', body } = options;

	if (!apiKey) {
		throw new ClaidAiAPIError('Missing Claid.ai API key');
	}

	const config: OpenAPIConfig = {
		BASE: CLAIDAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		// Generative edits run synchronously and often outlast the 20s default.
		TIMEOUT: 120_000,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body,
		mediaType: body ? 'application/json' : undefined,
	};

	let raw: Awaited<ReturnType<typeof request>>;
	try {
		raw = await request(config, requestOptions, {
			rateLimitConfig: CLAIDAI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ClaidAiAPIError(error.message);
		}
		throw new ClaidAiAPIError('Unknown Claid.ai API error');
	}

	return responseSchema.parse(raw);
}
