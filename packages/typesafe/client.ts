import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TYPESAFE_API_BASE = 'https://api.typesafe.ai';

// Jev answers most requests in well under a second; long-context and image
// requests take longer.
const TYPESAFE_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. 529 is TypeSafe's "overloaded" status and
// carries Retry-After the same way 429 does.
const TYPESAFE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status: number) => status === 529,
};

/**
 * TypeSafe error bodies look like
 * `{ detail: { error_type, message } }`, except 422 validation errors, where
 * `detail` is FastAPI's list of `{ loc, msg, type }` field errors.
 */
export class TypeSafeAPIError extends Error {
	readonly status?: number;
	readonly errorType?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are usually the `detail` shapes above, but a proxy
	// can answer with text.
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
		this.name = 'TypeSafeAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.errorType = readString(asRecord(detailOf(this.body)), 'error_type');
	}
}

// unknown: the body is untrusted until these guards run.
function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

// unknown: `detail` is an object, a list of field errors, or a string.
function detailOf(body: unknown): unknown {
	return asRecord(body)?.detail;
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: one entry of a 422 `detail` list.
function describeFieldError(entry: unknown): string | undefined {
	const record = asRecord(entry);
	const msg = readString(record, 'msg');
	if (!msg) return undefined;
	const loc = Array.isArray(record?.loc)
		? record.loc
				.filter((part) => part !== 'body')
				.map((part) => String(part))
				.join('.')
		: '';
	return loc ? `${loc}: ${msg}` : msg;
}

// unknown: see detailOf.
export function describeTypeSafeError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const detail = detailOf(body);
	let text: string | undefined;
	if (typeof detail === 'string' && detail.length > 0) {
		text = detail;
	} else if (Array.isArray(detail)) {
		const fields = detail
			.map(describeFieldError)
			.filter((field): field is string => field !== undefined);
		text = fields.length > 0 ? fields.join('; ') : undefined;
	} else {
		text = readString(asRecord(detail), 'message');
	}
	const message = text ?? fallback;
	return status !== undefined ? `TypeSafe ${status}: ${message}` : message;
}

export type TypeSafeRequest = {
	method: 'GET' | 'POST';
	path: string;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	headers?: Record<string, string>;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeTypeSafeRequest(
	apiKey: string,
	{ method, path, body, headers }: TypeSafeRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: TYPESAFE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: TYPESAFE_TIMEOUT_MS,
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json', ...headers },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: TYPESAFE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new TypeSafeAPIError(
				describeTypeSafeError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || (error as Error)?.message !== undefined) {
			throw new TypeSafeAPIError((error as Error).message, {
				cause: error as Error,
			});
		}
		throw new TypeSafeAPIError('Unknown TypeSafe API error');
	}
}
