import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AgentQLAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because AgentQL API error response bodies vary by endpoint
	// and error type, making a strict type infeasible without per-endpoint handling.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AgentQLAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const AGENTQL_API_BASE = 'https://api.agentql.com';

const AGENTQL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeAgentQLRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Using unknown because request bodies vary by endpoint (query-data JSON vs
		// query-document multipart fields assembled at the call site).
		body?: Record<string, unknown>;
		formData?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: AGENTQL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(isWrite && !formData ? { 'Content-Type': 'application/json' } : {}),
			'X-API-Key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite && !formData ? body : undefined,
		formData: isWrite && formData ? formData : undefined,
		mediaType:
			isWrite && !formData ? 'application/json; charset=utf-8' : undefined,
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: AGENTQL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AgentQLAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AgentQLAPIError(error.message, undefined, { cause: error });
		}
		throw new AgentQLAPIError('Unknown error');
	}
}
