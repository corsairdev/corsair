import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AgentMailAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because AgentMail error response bodies vary by endpoint
	// and status code; no single schema covers all failure payloads.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AgentMailAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const AGENTMAIL_API_BASE = 'https://api.agentmail.to/v0';

const AGENTMAIL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type QueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| readonly number[]
	| readonly boolean[]
	| undefined;

export async function makeAgentMailRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Using unknown values because request bodies vary by endpoint and are
		// assembled at the call site from Zod-validated input fields.
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: AGENTMAIL_API_BASE,
		VERSION: 'v0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		// Pass query for all methods so write endpoints can use URL params if needed.
		query,
	};

	try {
		// No rate-limit retries on writes — send is not idempotent without a key.
		return await request<T>(config, requestOptions, {
			rateLimitConfig: isWriteMethod
				? { ...AGENTMAIL_RATE_LIMIT_CONFIG, enabled: false, maxRetries: 0 }
				: AGENTMAIL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AgentMailAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new AgentMailAPIError(error.message, undefined, { cause: error });
		}
		throw new AgentMailAPIError('Unknown error');
	}
}
