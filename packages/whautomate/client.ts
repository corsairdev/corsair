import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { WhautomateContext } from './index';

export class WhautomateAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly body?: unknown,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'WhautomateAPIError';
	}
}

const WHAUTOMATE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 5,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function resolveApiHost(ctx: WhautomateContext): Promise<string> {
	const fromKeys = await ctx.keys.get_api_host();
	const host = fromKeys ?? ctx.options.apiHost;
	if (!host) {
		throw new WhautomateAPIError(
			'An API host is required for the Whautomate integration (Whautomate account > Settings > API)',
			'MISSING_API_HOST',
		);
	}
	return host;
}

export async function makeWhautomateRequest<T>(
	apiHost: string,
	apiKey: string,
	endpoint: string,
	outputSchema: import('zod').ZodType<T>,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!apiHost) {
		throw new WhautomateAPIError(
			'An API host is required for the Whautomate integration',
			'MISSING_API_HOST',
		);
	}
	if (!apiKey) {
		throw new WhautomateAPIError(
			'An API key is required for the Whautomate integration (Whautomate account > Settings > API)',
			'MISSING_API_KEY',
		);
	}
	const { method = 'GET', body, query } = options;

	const baseUrl = apiHost.replace(/\/$/, '');
	const fullUrl = baseUrl.endsWith('/v1') ? baseUrl : `${baseUrl}/v1`;

	const rateLimitConfig: RateLimitConfig =
		method === 'GET'
			? WHAUTOMATE_RATE_LIMIT_CONFIG
			: { ...WHAUTOMATE_RATE_LIMIT_CONFIG, enabled: false };

	const config: OpenAPIConfig = {
		BASE: fullUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'x-api-key': apiKey,
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
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig,
		});
		const parseResult = outputSchema.safeParse(response);
		if (!parseResult.success) {
			throw new WhautomateAPIError(
				`Whautomate response for ${endpoint} failed schema validation: ${parseResult.error.message}`,
				'SCHEMA_VALIDATION_FAILED',
				parseResult.error.flatten(),
				undefined,
				undefined,
			);
		}
		return parseResult.data;
	} catch (error) {
		if (error instanceof WhautomateAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyMessage =
				error.body?.error?.message ||
				error.body?.message ||
				error.body?.error ||
				error.message;
			throw new WhautomateAPIError(
				bodyMessage,
				String(error.status),
				error.body,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new WhautomateAPIError(error.message);
		}
		throw new WhautomateAPIError('Unknown error');
	}
}
