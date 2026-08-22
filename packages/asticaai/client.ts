import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type AsticaAiErrorMeta = {
	status?: number;
	statusText?: string;
	retryAfter?: number;
};

export class AsticaAiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		meta: AsticaAiErrorMeta = {},
	) {
		super(message);
		this.name = 'AsticaAiAPIError';
		this.status = meta.status;
		this.statusText = meta.statusText;
		this.retryAfter = meta.retryAfter;
	}
}

export const ASTICAAI_VISION_API_BASE = 'https://vision.astica.ai';
export const ASTICAAI_LISTEN_API_BASE = 'https://listen.astica.ai';

const RATE_LIMIT_TEXT = /rate.?limit|too many requests|\b429\b/i;

/**
 * Astica reports failures as HTTP 200 with `{status:'error'}`, so a rate limit
 * can arrive in the body rather than as a 429.
 */
export function bodyReportsRateLimit(body: unknown): boolean {
	if (typeof body !== 'object' || body === null) return false;
	const { status, error } = body as { status?: unknown; error?: unknown };
	if (typeof status !== 'string' || status.toLowerCase() !== 'error') {
		return false;
	}
	return typeof error === 'string' && RATE_LIMIT_TEXT.test(error);
}

/**
 * Retries stay in the transport, which already backs off on 429 and honours
 * Retry-After. Only the matcher is widened, so a body-reported rate limit is
 * retried by the same loop; adding a second loop here would multiply one
 * operation into transport attempts × local attempts against a throttled API.
 *
 * Values mirror the transport defaults, which corsair/http does not export.
 */
export const ASTICA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
	isRateLimitError: (status, body) =>
		status === 429 || bodyReportsRateLimit(body),
};

/** Astica echoes the submitted body in some failures; keep the key out of it. */
function redactKey(message: string, apiKey: string): string {
	if (!apiKey) return message;
	return message.split(apiKey).join('[REDACTED]');
}

/**
 * Astica authenticates with the API key in the request body as `tkn`, so on
 * failure the key sits in ApiError.request.body. The core redactor only scrubs
 * the URL and query string, never the body, so the ApiError is deliberately not
 * kept as `cause` here — only status, statusText and retryAfter cross over.
 */
export async function makeAsticaAiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		body?: Record<string, unknown>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { body, baseUrl = ASTICAAI_VISION_API_BASE } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: endpoint,
		body: { ...body, tkn: apiKey },
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: ASTICA_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AsticaAiAPIError(redactKey(error.message, apiKey), undefined, {
				status: error.status,
				statusText: error.statusText,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new AsticaAiAPIError(redactKey(error.message, apiKey));
		}
		throw new AsticaAiAPIError('Unknown Astica AI API error');
	}
}
