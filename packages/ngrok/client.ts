import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const NGROK_API_BASE = 'https://api.ngrok.com';

// Retries belong to error-handlers.ts. ngrok documents no Retry-After, so the
// name is kept only so a proxy that sends one is honoured.
const NGROK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: the record is an untyped error body; one field is read at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Every ngrok error has a globally unique code such as `ERR_NGROK_202`, and the
 * same 403 carries two different ones: 200 for a missing Authorization header,
 * 202 for a credential that is not a valid key. Only the code tells them apart,
 * so it is what the handlers classify on.
 */
export class NgrokAPIError extends Error {
	readonly status?: number;
	/** Machine-readable code, e.g. `ERR_NGROK_202`. */
	readonly code?: string;
	/** ngrok's operation id for the failed request, quoted to their support. */
	readonly operationId?: string;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			code?: string;
			operationId?: string;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NgrokAPIError';
		this.status = options.status;
		this.code = options.code;
		this.operationId = options.operationId;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/**
	 * 200 is a missing Authorization header and 202 a credential shape ngrok
	 * does not recognise. A 401 with 201 is a revoked key and has its own getter,
	 * so it is excluded here; otherwise that more specific case would never be
	 * reachable, because core takes the first handler whose match passes.
	 */
	get isAuthError(): boolean {
		if (this.isRevokedKey) return false;
		return (
			this.status === 401 ||
			this.code === 'ERR_NGROK_200' ||
			this.code === 'ERR_NGROK_202'
		);
	}

	/** 201 is a key that is well-formed but revoked or expired. */
	get isRevokedKey(): boolean {
		return this.code === 'ERR_NGROK_201';
	}
}

/**
 * Reads ngrok's `{ error_code, status_code, msg, details: { operation_id } }`.
 * Transport-level failures omit the code and carry only `msg`.
 */
// unknown: the body is whatever the edge or the API sent.
export function readNgrokError(body: unknown): {
	code?: string;
	message?: string;
	operationId?: string;
} {
	const record = asRecord(body);
	return {
		code: readString(record, 'error_code'),
		message: readString(record, 'msg'),
		operationId: readString(asRecord(record?.details), 'operation_id'),
	};
}

// unknown: see readNgrokError.
export function describeNgrokError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { code, message, operationId } = readNgrokError(body);
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const text = message ?? fallback;
	const where = operationId ? ` (operation ${operationId})` : '';
	return label ? `ngrok ${label}: ${text}${where}` : `${text}${where}`;
}

export type NgrokQuery = Record<
	string,
	string | number | boolean | readonly string[] | undefined
>;

export type NgrokRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	path: string;
	query?: NgrokQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema. It is
// undefined for a 204.
export async function makeNgrokRequest(
	apiKey: string,
	{ method, path, query, body }: NgrokRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NGROK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			// ngrok requires this on every v2 request; without it the API
			// answers a version error that reads like an auth failure.
			'Ngrok-Version': '2',
		},
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
			rateLimitConfig: NGROK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const parsed = readNgrokError(error.body);
			throw new NgrokAPIError(
				describeNgrokError(error.status, error.body, error.message),
				{
					status: error.status,
					code: parsed.code,
					operationId: parsed.operationId,
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NgrokAPIError(error.message, { cause: error, method });
		}
		throw new NgrokAPIError('Unknown ngrok error', { method });
	}
}

/** Encodes one path segment. */
export function segment(value: string): string {
	return encodeURIComponent(value);
}
