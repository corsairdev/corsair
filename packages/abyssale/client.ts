import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AbyssaleAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AbyssaleAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const ABYSSALE_API_BASE = 'https://api.abyssale.com';

/** Attempts for a server-error GET (1 initial + 1 retry). */
const MAX_ATTEMPTS = 2;

/**
 * Cap on the backoff between server-error retries. Rate limits are handled by
 * the transport, so `Retry-After` is honoured there, not here.
 */
const MAX_RETRY_DELAY_MS = 30_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Rate limits are deliberately NOT handled here: `corsair/http` already retries
 * them internally (`DEFAULT_RATE_LIMIT_CONFIG.maxRetries = 3`, honouring
 * `Retry-After`) and returns the successful attempt. Retrying 429 again at this
 * layer would multiply the two budgets — up to twelve requests for one
 * operation, including repeated non-idempotent `POST /projects`.
 *
 * The transport does not retry 5xx, so that gap is covered here, and only for
 * GET: a 5xx may have been applied server-side and Abyssale documents no
 * idempotency key.
 */
function isRetryable(status: number | undefined, method: string): boolean {
	if (status !== undefined && status >= 500) return method === 'GET';
	return false;
}

function retryDelayMs(error: ApiError, attempt: number): number {
	const retryAfter = error.retryAfter;
	if (typeof retryAfter === 'number' && retryAfter > 0) {
		return Math.min(retryAfter, MAX_RETRY_DELAY_MS);
	}
	return Math.min(2 ** (attempt - 1) * 1000, MAX_RETRY_DELAY_MS);
}

export async function makeAbyssaleRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ABYSSALE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
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

	// Retries happen here rather than in the shared endpoint binder: the binder
	// awaits a successful recursive attempt without returning it and then
	// rethrows the original error, so a call that succeeded on retry would still
	// be reported to the caller as a failure.
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		try {
			return await request<T>(config, requestOptions);
		} catch (error) {
			lastError = error;
			const canRetry =
				error instanceof ApiError &&
				attempt < MAX_ATTEMPTS &&
				isRetryable(error.status, method);
			if (!canRetry) break;
			await sleep(retryDelayMs(error as ApiError, attempt));
		}
	}

	if (lastError instanceof ApiError) {
		throw new AbyssaleAPIError(lastError.message, undefined, {
			cause: lastError,
		});
	}
	if (lastError instanceof Error) {
		throw new AbyssaleAPIError(lastError.message);
	}
	throw new AbyssaleAPIError('Unknown error');
}
