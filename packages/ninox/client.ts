import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Ninox serves the public API from `go.ninox.com`, not `api.ninox.com`: the
 * latter answers "End-point not found" and the app host answers a Cloudflare
 * page. The docs' own Swagger instance is on `go.ninox.com/api/docs`.
 */
export const NINOX_API_BASE = 'https://go.ninox.com/api/v1';

// Retries belong to error-handlers.ts. Ninox documents no Retry-After, so the
// name is kept only so a proxy that sends one is honoured.
const NINOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
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
 * Ninox sends `{ "error": { "message": "..." } }` for a JSON failure, but its
 * edge answers a bare `401 text/plain "Unauthorized"` when the key is missing,
 * so both shapes are read. A 403 is the key lacking the grant for the resource,
 * not a bad key, and a 409 is the `_expected` conflict or an ambiguous upsert.
 */
export class NinoxAPIError extends Error {
	readonly status?: number;
	/** The provider's own message, from either body shape. */
	readonly detail?: string;
	readonly method?: string;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			detail?: string;
			method?: string;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'NinoxAPIError';
		this.status = options.status;
		this.detail = options.detail;
		this.method = options.method;
	}

	get isRateLimit(): boolean {
		return this.status === 429;
	}

	/** A 401 is a missing or invalid workspace key; there is no other 401. */
	get isAuthError(): boolean {
		return this.status === 401;
	}

	/** A 403 is the key lacking the grant the route needs, not a bad key. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}
}

// unknown: see NinoxAPIError.
export function describeNinoxError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message =
		readString(asRecord(asRecord(body)?.error), 'message') ??
		// The edge answers a bare text body for a missing key.
		(typeof body === 'string' && body.length > 0
			? body.slice(0, 200)
			: undefined) ??
		fallback;
	const label = status === undefined ? '' : `Ninox ${status}: `;
	return `${label}${message}`;
}

export type NinoxQuery = Record<string, string | number | boolean | undefined>;

export type NinoxRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** The path after the workspace id, or the whole path for a workspace read. */
	path: string;
	query?: NinoxQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeNinoxRequest(
	apiKey: string,
	{ method, path, query, body }: NinoxRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: NINOX_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` },
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
			rateLimitConfig: NINOX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new NinoxAPIError(
				describeNinoxError(error.status, error.body, error.message),
				{
					status: error.status,
					detail:
						readString(asRecord(asRecord(error.body)?.error), 'message') ??
						(typeof error.body === 'string' ? error.body : undefined),
					method,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new NinoxAPIError(error.message, { cause: error, method });
		}
		throw new NinoxAPIError('Unknown Ninox error', { method });
	}
}

/**
 * Encodes one path segment. A module or table name is user-chosen and can hold
 * spaces or an ampersand, and Ninox addresses them by name rather than by id.
 */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Builds the workspace-scoped path every resource route shares. Ninox repeats
 * the same five segments on every call, so one helper keeps them in step.
 */
export function workspacePath(workspaceId: string): string {
	return `/workspace/${segment(workspaceId)}`;
}
