import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
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

/** Total attempts for a rate-limited call, including the first one. */
export const RATE_LIMIT_MAX_ATTEMPTS = 3;
const MAX_RETRY_DELAY_MS = 30_000;

const RATE_LIMIT_TEXT = /rate.?limit|too many requests|\b429\b/i;

/**
 * Astica reports most failures as HTTP 200 with `{status:'error'}`, so a rate
 * limit can arrive either as a 429 or in the body.
 */
function bodyReportsRateLimit(body: unknown): boolean {
	if (typeof body !== 'object' || body === null) return false;
	const { status, error } = body as { status?: unknown; error?: unknown };
	if (typeof status !== 'string' || status.toLowerCase() !== 'error') {
		return false;
	}
	return typeof error === 'string' && RATE_LIMIT_TEXT.test(error);
}

function retryDelayMs(attempt: number, retryAfter?: number): number {
	const delay = retryAfter ?? 2 ** (attempt - 1) * 1000;
	return Math.min(delay, MAX_RETRY_DELAY_MS);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
 *
 * Rate limits are retried here rather than through the endpoint binder: the
 * binder awaits its retry, discards the result and rethrows the original error
 * (core/endpoints/bind.ts, the `await call(newAttempt, …)` before `throw
 * error`), so a retry driven from there can never return a success.
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

	for (let attempt = 1; ; attempt++) {
		const canRetry = attempt < RATE_LIMIT_MAX_ATTEMPTS;

		try {
			const result = await request<T>(config, requestOptions);

			if (canRetry && bodyReportsRateLimit(result)) {
				await sleep(retryDelayMs(attempt));
				continue;
			}

			return result;
		} catch (error) {
			if (error instanceof ApiError) {
				if (canRetry && error.status === 429) {
					await sleep(retryDelayMs(attempt, error.retryAfter));
					continue;
				}
				throw new AsticaAiAPIError(
					redactKey(error.message, apiKey),
					undefined,
					{
						status: error.status,
						statusText: error.statusText,
						retryAfter: error.retryAfter,
					},
				);
			}
			if (error instanceof Error) {
				throw new AsticaAiAPIError(redactKey(error.message, apiKey));
			}
			throw new AsticaAiAPIError('Unknown Astica AI API error');
		}
	}
}
