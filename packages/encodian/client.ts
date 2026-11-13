import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { EncodianOperationRoutes } from './endpoints/generated';

const ENCODIAN_API_BASE = 'https://api.apps-encodian.com';
const REDACTED = '[REDACTED]';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

type EncodianRoute =
	(typeof EncodianOperationRoutes)[keyof typeof EncodianOperationRoutes];

// `unknown` because provider responses stay untrusted until the operation output schema parses them.
export async function makeEncodianRequest(
	route: EncodianRoute,
	apiKey: string,
	input: {
		// `unknown` because each route has a different request DTO validated before reaching this transport.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		path?: Record<string, string | number>;
	},
): Promise<unknown> {
	const path = route.path.replace(
		/\{([^}]+)\}/g,
		(_match, parameter: string) => {
			const value = input.path?.[parameter];
			return encodeURIComponent(String(value ?? ''));
		},
	);
	const config: OpenAPIConfig = {
		BASE: ENCODIAN_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-ApiKey': apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: route.method,
		url: path,
		body: input.body,
		mediaType: 'application/json; charset=utf-8',
		query: input.query,
	};

	try {
		// `unknown` because HTTP JSON is untrusted until the operation output schema parses it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
		// `unknown` because transport rejections do not have a guaranteed runtime class.
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw new ApiError(
				{
					...error.request,
					body: error.request.body === undefined ? undefined : REDACTED,
				},
				{
					url: error.url,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: REDACTED,
				},
				`Encodian request failed with HTTP ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		throw error;
	}
}
