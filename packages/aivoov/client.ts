import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AivoovAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Using unknown because AiVOOV returns `{ status: false, error: string }` on
	// auth failures but plain text on gateway errors, so no single body type fits.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AivoovAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const AIVOOV_API_BASE = 'https://aivoov.com/api/v8';

/**
 * AiVOOV envelopes every response in a `status` boolean and reports some
 * failures (quota exhausted, unknown voice_id) as `status: false` on an
 * otherwise successful HTTP response, where `request` would not raise. Convert
 * those into the same error type as a non-2xx so `error-handlers.ts` sees both.
 */
export function assertAivoovSuccess(
	payload: { status?: boolean; message?: string; error?: string },
	operation: string,
): void {
	if (payload.status === false) {
		throw new AivoovAPIError(
			payload.error ?? payload.message ?? `AiVOOV ${operation} failed`,
		);
	}
}

// AiVOOV documents its limits in prose only (75 rpm on `create`, 100 rpm on GET
// endpoints, 5000 requests/day) and returns no `X-RateLimit-*` headers, so
// `Retry-After` is the only header worth reading.
const AIVOOV_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type AivoovQueryValue = string | number | boolean | undefined;

export async function makeAivoovRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, AivoovQueryValue>;
		form?: URLSearchParams;
	} = {},
): Promise<T> {
	const { method = 'GET', query, form } = options;

	// TOKEN is intentionally unset: `request` turns it into an
	// `Authorization: Bearer` header, and AiVOOV authenticates on `X-API-KEY`
	// alone. Setting both would send the key twice.
	const config: OpenAPIConfig = {
		BASE: AIVOOV_API_BASE,
		VERSION: '8.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-API-KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		// AiVOOV's `create` endpoint only accepts form-encoded input and repeats
		// keys (`voice_id[]`) to build its arrays, which JSON cannot express.
		// URLSearchParams is pre-serialised here so `request` forwards it verbatim.
		body: form ? form.toString() : undefined,
		mediaType: form ? 'application/x-www-form-urlencoded' : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: AIVOOV_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AivoovAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new AivoovAPIError(error.message, undefined, { cause: error });
		}
		throw new AivoovAPIError('Unknown AiVOOV API error');
	}
}
