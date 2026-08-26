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

export type WebvizioApiPath = '/projects' | '/webhook';

const WEBVIZIO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export function unwrapWebvizioList(payload: unknown): unknown[] {
	if (Array.isArray(payload)) return payload;
	if (
		payload !== null &&
		typeof payload === 'object' &&
		Array.isArray((payload as { data?: unknown }).data)
	) {
		return (payload as { data: unknown[] }).data;
	}
	throw new WebvizioAPIError('Webvizio list response was not a JSON array');
}

export async function makeWebvizioRequest<T>(
	endpoint: WebvizioApiPath,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		body?: Record<string, unknown>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, baseUrl = WEBVIZIO_MCP_API_BASE } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json',
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
