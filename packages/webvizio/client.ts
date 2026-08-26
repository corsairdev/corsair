import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WebvizioAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number | string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'WebvizioAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const WEBVIZIO_MCP_API_BASE = 'https://app.webvizio.com/api/mcp/v1';
export const WEBVIZIO_WEBHOOK_API_BASE = 'https://app.webvizio.com/api/v1';

const WEBVIZIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function makeWebvizioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = WEBVIZIO_MCP_API_BASE,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: WEBVIZIO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const detail =
				typeof error.body === 'object' && error.body !== null
					? JSON.stringify(error.body)
					: String(error.body ?? '');

			throw new WebvizioAPIError(
				`${error.message} (status=${error.status}, body=${detail})`,
				error.status,
				{ cause: error },
			);
		}

		if (error instanceof WebvizioAPIError) {
			throw error;
		}

		if (error instanceof Error) {
			throw new WebvizioAPIError(error.message, undefined, { cause: error });
		}

		throw new WebvizioAPIError('Unknown Webvizio API error');
	}
}
