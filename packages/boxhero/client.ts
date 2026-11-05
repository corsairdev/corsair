import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import type { z } from 'zod';

/**
 * Official Open API host. Paths include the `/v1` prefix.
 *
 * @see https://rest.boxhero-app.com/docs/api
 */
export const BOXHERO_API_BASE = 'https://rest.boxhero-app.com';

export const BOXHERO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type BoxheroQueryValue =
	| string
	| number
	| boolean
	| Array<string | number | boolean>
	| undefined;

export type BoxheroRequestOptions<T> = {
	schema: z.ZodType<T>;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown>;
	query?: Record<string, BoxheroQueryValue>;
};

function buildConfig(apiKey: string): OpenAPIConfig {
	return {
		BASE: BOXHERO_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};
}

export function compactQuery(
	query: Record<string, BoxheroQueryValue>,
): Record<string, BoxheroQueryValue> | undefined {
	const compacted: Record<string, BoxheroQueryValue> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return Object.keys(compacted).length > 0 ? compacted : undefined;
}

export async function makeBoxheroRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BoxheroRequestOptions<T>,
): Promise<T> {
	const { schema, method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	const raw = await request(buildConfig(apiKey), requestOptions, {
		rateLimitConfig: BOXHERO_RATE_LIMIT_CONFIG,
	});
	return schema.parse(raw ?? {});
}
