import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GRAFBASE_API_BASE = 'https://api.grafbase.com';

// A publish blocks on composition and a gateway deployment, so corsair/http's
// 20 second default is too tight.
const GRAFBASE_TIMEOUT_MS = 60_000;

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Grafbase does not document rate limits.
const GRAFBASE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type GrafbaseOperationKind = 'query' | 'mutation';

export type GrafbaseGraphQLError = {
	message: string;
	// unknown: the path carries string and number segments on execution errors,
	// and is absent on validation and auth errors.
	path?: unknown[];
};

export type GrafbaseRequest = {
	query: string;
	// unknown: variable values come from the endpoint's parsed input schema.
	variables?: Record<string, unknown>;
	operationKind: GrafbaseOperationKind;
};

// unknown: the errors value is an untyped GraphQL array until narrowed here.
function readErrors(value: unknown): GrafbaseGraphQLError[] {
	if (!Array.isArray(value)) return [];
	const errors: GrafbaseGraphQLError[] = [];
	for (const item of value) {
		const record = asRecord(item);
		if (record && typeof record.message === 'string' && record.message) {
			errors.push({
				message: record.message,
				// unknown: see GrafbaseGraphQLError.path.
				path: Array.isArray(record.path) ? record.path : undefined,
			});
		}
	}
	return errors;
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeGrafbaseError(
	status: number | undefined,
	body: unknown,
	errors: GrafbaseGraphQLError[],
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		errors.map((error) => error.message).join('; ') ||
		readString(record, 'message') ||
		readString(record, 'detail') ||
		fallback;
	return status === undefined ? text : `Grafbase ${status}: ${text}`;
}

export class GrafbaseAPIError extends Error {
	readonly status?: number;
	readonly errors: GrafbaseGraphQLError[];
	/** Milliseconds from a Retry-After header, when Grafbase sent one. */
	readonly retryAfter?: number;
	readonly operationKind?: GrafbaseOperationKind;
	// unknown: the raw response body, kept for diagnosis.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open body as the field above.
			body?: unknown;
			errors?: GrafbaseGraphQLError[];
			retryAfter?: number;
			operationKind?: GrafbaseOperationKind;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'GrafbaseAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.errors = options.errors ?? [];
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.operationKind = options.operationKind;
	}

	/** True for an HTTP 429. GraphQL-level failures arrive with HTTP 200. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

// unknown: the endpoint's output schema parses the returned data object.
export async function makeGrafbaseRequest(
	apiKey: string,
	{ query, variables, operationKind }: GrafbaseRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: GRAFBASE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: GRAFBASE_TIMEOUT_MS,
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/graphql',
		body: { query, variables },
		mediaType: 'application/json',
	};

	try {
		const raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: GRAFBASE_RATE_LIMIT_CONFIG,
		});
		const envelope = asRecord(raw);
		const errors = readErrors(envelope?.errors);
		if (errors.length > 0) {
			throw new GrafbaseAPIError(
				describeGrafbaseError(undefined, raw, errors, 'GraphQL request failed'),
				{ body: raw, errors, operationKind },
			);
		}
		return envelope?.data ?? raw;
	} catch (error) {
		if (error instanceof GrafbaseAPIError) throw error;
		if (error instanceof ApiError) {
			const envelope = asRecord(error.body);
			const errors = readErrors(envelope?.errors);
			throw new GrafbaseAPIError(
				describeGrafbaseError(error.status, error.body, errors, error.message),
				{
					cause: error,
					status: error.status,
					body: error.body,
					errors,
					retryAfter: error.retryAfter,
					operationKind,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GrafbaseAPIError(error.message, {
				cause: error,
				operationKind,
			});
		}
		throw new GrafbaseAPIError('Unknown Grafbase error', { operationKind });
	}
}
