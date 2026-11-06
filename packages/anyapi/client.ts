import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ANYAPI_API_BASE = 'https://api.getanyapi.com';

// AnyAPI fails over across sources inside one request, so a slow run can take
// tens of seconds (the slowest endpoints report a p99 near a minute).
const ANYAPI_TIMEOUT_MS = 90_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. 409 idempotency_in_progress also carries
// Retry-After.
const ANYAPI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status: number) => status === 409,
};

export type AnyApiQuery = Record<string, string | number | boolean | undefined>;

/**
 * AnyAPI error bodies look like `{ error, code?, requestId?, payment? }`.
 * `payment` is present when the request may have been charged although no
 * result came back (`charged_undelivered` or `indeterminate`), so a retry
 * could pay twice. A 422 adds `alternatives`, the SKUs that can serve the
 * target instead.
 */
export class AnyApiAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	readonly requestId?: string;
	readonly retryAfter?: number;
	/** True when the body reports a payment for a request that failed. */
	readonly charged: boolean;
	// unknown: error bodies are usually the shape above, but a proxy can
	// answer with text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'AnyApiAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		const record = asRecord(this.body);
		this.code = readString(record, 'code');
		this.requestId = readString(record, 'requestId');
		this.charged = asRecord(record?.payment) !== undefined;
	}
}

// unknown: the body is untrusted until these guards run.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: `alternatives` entries are SKU strings or objects with a slug.
function alternativeSkus(body: unknown): string[] {
	const list = asRecord(body)?.alternatives;
	if (!Array.isArray(list)) return [];
	return list
		.map((entry) =>
			typeof entry === 'string'
				? entry
				: (readString(asRecord(entry), 'slug') ??
					readString(asRecord(entry), 'id')),
		)
		.filter((sku): sku is string => sku !== undefined);
}

// unknown: see AnyApiAPIError.
export function describeAnyApiError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'error') ?? fallback;
	const parts = [status !== undefined ? `AnyAPI ${status}: ${text}` : text];
	const alternatives = alternativeSkus(body);
	if (alternatives.length > 0) {
		parts.push(`Try: ${alternatives.join(', ')}`);
	}
	const requestId = readString(record, 'requestId');
	if (requestId) parts.push(`(request ${requestId})`);
	return parts.join(' ');
}

export type AnyApiRequest = {
	method: 'GET' | 'POST';
	path: string;
	query?: AnyApiQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	headers?: Record<string, string>;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeAnyApiRequest(
	apiKey: string,
	{ method, path, query, body, headers }: AnyApiRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: ANYAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: ANYAPI_TIMEOUT_MS,
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json', ...headers },
	};

	// A durable run that is still working answers 202 with a request snapshot;
	// that is a success, and the caller polls requests.get.
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: ANYAPI_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AnyApiAPIError(
				describeAnyApiError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new AnyApiAPIError((error as Error).message, {
				cause: error as Error,
			});
		}
		throw new AnyApiAPIError('Unknown AnyAPI error');
	}
}
