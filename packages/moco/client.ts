import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Moco serves every account from its own subdomain. The subdomain is stored
 * beside the API key, and the base URL is built from it per request.
 */
export type MocoCallContext = {
	key: string;
	options: { subdomain?: string };
	keys: {
		get_subdomain: () => Promise<string | null | undefined>;
	};
};

/** Throws before sending when no subdomain is configured. */
export async function resolveSubdomain(ctx: MocoCallContext): Promise<string> {
	const value = ctx.options.subdomain ?? (await ctx.keys.get_subdomain());
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(
			'Moco subdomain is required: pass subdomain in the plugin options or save it on the account.',
		);
	}
	if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(value)) {
		throw new Error(`Moco subdomain must be a DNS label, got "${value}"`);
	}
	return value.toLowerCase();
}

export function mocoBase(subdomain: string): string {
	return `https://${subdomain}.mocoapp.com/api/v1`;
}

/**
 * Moco errors: 401/403/404 answer `{"message": string}` (the probed unknown
 * subdomain answers exactly that), 422 validation answers
 * `{"errors": {field: [messages]}}`, and 429 is the documented rate limit
 * (120 requests per 2 minutes).
 */
export class MocoAPIError extends Error {
	readonly status?: number;
	/** Field -> messages from a 422 validation body, when present. */
	readonly errors?: Record<string, string[]>;
	/** Milliseconds from a Retry-After header, when Moco sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;
	// unknown: the body is an untyped error body until narrowed below.
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
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MocoAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.errors = readErrors(this.body);
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.replayable = options.replayable;
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readErrors(body: unknown): Record<string, string[]> | undefined {
	const record = asRecord(body);
	const errors = record?.errors;
	if (!asRecord(errors)) return undefined;
	const out: Record<string, string[]> = {};
	for (const [field, value] of Object.entries(
		errors as Record<string, unknown>,
	)) {
		if (Array.isArray(value)) {
			out[field] = value.map((entry) => String(entry));
		} else {
			out[field] = [String(value)];
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

// unknown: the body is an untyped error body; read one field at a time.
function readMessage(body: unknown): string | undefined {
	const record = asRecord(body);
	const value = record?.message;
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeMocoError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const message = readMessage(body);
	if (message) {
		return status === undefined
			? `Moco: ${message}`
			: `Moco ${status}: ${message}`;
	}
	const errors = readErrors(body);
	if (errors) {
		const summary = Object.entries(errors)
			.map(([field, messages]) => `${field}: ${messages.join(', ')}`)
			.join('; ');
		return status === undefined
			? `Moco: ${summary}`
			: `Moco ${status}: ${summary}`;
	}
	return status === undefined
		? `Moco: ${fallback}`
		: `Moco ${status}: ${fallback}`;
}

export type MocoQuery = Record<string, string | number | boolean | undefined>;

export type MocoRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	path: string;
	query?: MocoQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/**
	 * True when a 5xx or a network drop can replay the request: reads only.
	 * Moco writes have no documented idempotency keys.
	 */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. The documented limit is 120 requests
// per 2 minutes with HTTP 429 on exceed.
const MOCO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMocoRequest(
	ctx: MocoCallContext,
	{ method, path, query, body, replayable }: MocoRequest,
): Promise<unknown> {
	const subdomain = await resolveSubdomain(ctx);
	const config: OpenAPIConfig = {
		BASE: mocoBase(subdomain),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			// The Token form of Moco's API key auth, per the TokenAuth scheme.
			Authorization: `Token token=${ctx.key}`,
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
			rateLimitConfig: MOCO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MocoAPIError(
				describeMocoError(error.status, error.body, error.message),
				{ cause: error, replayable },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MocoAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new MocoAPIError('Unknown Moco error', { method, replayable });
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
