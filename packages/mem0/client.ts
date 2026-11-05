import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MEM0_API_BASE = 'https://api.mem0.ai';

const MEM0_TIMEOUT_MS = 60_000;

// unknown: error bodies are usually JSON objects but a proxy can answer with
// HTML or plain text.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// The webhook endpoints answer a 400 with field-keyed errors, such as
// `{ name: ["This field is required."] }`. This reads the first such message.
// unknown: the record is an untyped error body; read one field at a time.
function readFieldError(
	record: Record<string, unknown> | null | undefined,
): string | undefined {
	for (const [field, value] of Object.entries(record ?? {})) {
		if (!Array.isArray(value)) continue;
		const message = value.find(
			(item): item is string => typeof item === 'string',
		);
		if (message) return `${field}: ${message}`;
	}
	return undefined;
}

export class Mem0APIError extends Error {
	readonly status?: number;
	readonly retryAfter?: number;
	readonly method?: string;
	// unknown: error bodies are usually the shapes below, but a proxy can
	// answer with HTML or text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open error body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'Mem0APIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: see Mem0APIError.
export function describeMem0Error(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const details = asRecord(record?.details);
	const text =
		readString(details, 'message') ??
		readString(record, 'error') ??
		readString(record, 'message') ??
		readString(record, 'detail') ??
		readFieldError(record) ??
		fallback;
	return status ? `Mem0 ${status}: ${text}` : text;
}

// unknown: a metadata filter carries caller-defined JSON values; Mem0 reads the
// map as a deepObject, one query key per metadata key.
type Mem0MetadataQuery = Record<string, unknown>;

export type Mem0Query = Record<
	string,
	string | number | boolean | Mem0MetadataQuery | undefined
>;

export type Mem0Request = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: Mem0Query;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Mem0 documents a per-project rate limit only as an HTTP 429, and does not
// document a Retry-After header. error-handlers.ts owns retries, so the client
// makes a single attempt.
const MEM0_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMem0Request(
	apiKey: string,
	{ method, path, query, body }: Mem0Request,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MEM0_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: MEM0_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: `Token ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: MEM0_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Mem0APIError(
				describeMem0Error(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		if (error instanceof Error || error instanceof DOMException) {
			throw new Mem0APIError(error.message, { cause: error, method });
		}
		throw new Mem0APIError('Unknown Mem0 error', { method });
	}
}
