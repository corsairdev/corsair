import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ApiBibleAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// The raw provider response payload has a provider-defined shape (never parsed/typed), so
	// `unknown` is the honest type here; callers narrow it only when they need specific fields.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ApiBibleAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/**
 * API.Bible REST API root.
 * Docs: https://api.bible/getting-started (base shown as rest.api.bible/v1)
 */
const APIBIBLE_API_BASE = 'https://rest.api.bible/v1';

const APIBIBLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

/** Query values API.Bible understands (booleans become `true`/`false` strings). */
export type ApiBibleQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Authenticated request against rest.api.bible/v1.
 * Auth is provided through the `api-key` header (the only supported method).
 * All endpoints are GET-only.
 */
export async function makeApiBibleRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: ApiBibleQuery;
	} = {},
): Promise<T> {
	const { query } = options;

	const config: OpenAPIConfig = {
		BASE: APIBIBLE_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: APIBIBLE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ApiBibleAPIError(
				error.message,
				error.status === undefined ? undefined : String(error.status),
				{ cause: error },
			);
		}
		if (error instanceof Error) {
			throw new ApiBibleAPIError(error.message, undefined, { cause: error });
		}
		throw new ApiBibleAPIError('Unknown API.Bible error');
	}
}
