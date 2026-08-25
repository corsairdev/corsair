import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TavilyMcpAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because Tavily error response bodies vary by endpoint and
	// error type, making a strict type infeasible without per-endpoint handling.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'TavilyMcpAPIError';

		// Carry the transport-level rate limit and status metadata forward so
		// the plugin error handlers can still see it after the wrap.
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

const TAVILYMCP_API_BASE = 'https://api.tavily.com';

/**
 * Performs a request to the Tavily API.
 * Auth: API key via Bearer token (only supported auth type).
 */
export async function makeTavilyMcpRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body } = options;

	const config: OpenAPIConfig = {
		BASE: TAVILYMCP_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// request.ts derives `Authorization: Bearer <key>` from TOKEN and applies
		// it after config.HEADERS, so setting the header here too is dead weight.
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof Error) {
			throw new TavilyMcpAPIError(error.message, undefined, { cause: error });
		}
		throw new TavilyMcpAPIError('Unknown Tavily API error');
	}
}
