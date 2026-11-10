import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** The management host: workspaces, projects, versions, training. */
export const ROBOFLOW_API_BASE = 'https://api.roboflow.com';

/**
 * The inference host. A model runs here, not on the management host, and the
 * request shape is the Inference server's rather than the Platform API's.
 */
export const ROBOFLOW_INFERENCE_BASE = 'https://serverless.roboflow.com';

/**
 * A failure is `{error: {message, status, type, hint}}` on the management host and
 * `{status, message}` on the inference host:
 *
 * ```json
 * {"error":{"message":"This API key does not exist (or has been revoked).","status":401,"type":"OAuthException","hint":"…"}}
 * {"status":401,"message":"Unauthorized api_key"}
 * ```
 *
 * Both were captured live. `hint` is kept because it names the fix.
 */
export class RoboflowAPIError extends Error {
	readonly status?: number;
	/** The `type` on a management error, such as OAuthException. */
	readonly type?: string;
	/** The `hint` a management error adds. */
	readonly hint?: string;
	/** Milliseconds from a Retry-After header, when Roboflow sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** Whether the failing call may be sent again; declared per operation. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			type?: string;
			hint?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RoboflowAPIError';
		this.status = options.status;
		this.type = options.type;
		this.hint = options.hint;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The key is missing, wrong or revoked. */
	get isAuthError(): boolean {
		return this.status === 401 || this.type === 'OAuthException';
	}

	/** The key works but the workspace or project is not reachable with it. */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** No such workspace, project or version. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/** A body or parameter Roboflow refused. */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}

	/** The plan does not include the feature, or a training run conflicts. */
	get isConflict(): boolean {
		return this.status === 409;
	}
}

/**
 * Reads a failure body from either host.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	message?: string;
	status?: number;
	type?: string;
	hint?: string;
} {
	const record = asRecord(body);
	if (!record) return {};

	// The management host nests everything under `error`; the inference host puts
	// `status` and `message` at the top level.
	const inner = asRecord(record.error);
	const source = inner ?? record;
	const message = source.message ?? record.message;
	const status = source.status ?? record.status;
	const type = source.type;
	const hint = source.hint;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		status: typeof status === 'number' ? status : undefined,
		type: typeof type === 'string' && type.length > 0 ? type : undefined,
		hint: typeof hint === 'string' && hint.length > 0 ? hint : undefined,
	};
}

/**
 * Builds the message for an error body, keeping Roboflow's `hint` because it names
 * the fix.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRoboflowError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, status: bodyStatus, hint } = failure(body);
	const text = message ?? fallback;
	const label = status ?? bodyStatus;
	const head = label === undefined ? text : `Roboflow ${label}: ${text}`;
	return hint ? `${head} (${hint})` : head;
}

/** A query value. The inference route takes only scalars. */
export type RoboflowQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RoboflowRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	/** Path below the host, starting with a slash. */
	path: string;
	query?: RoboflowQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
	/** Which host the call goes to; defaults to the management host. */
	host?: 'api' | 'inference';
};

/**
 * Roboflow documents no per-second request limit for the management API, but
 * inference is billed per image, so a runaway retry loop costs money. A 429 is
 * honoured if one arrives.
 */
const ROBOFLOW_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key goes in `Authorization: Bearer`, which the docs call the recommended
 * transport; `api_key` as a query parameter is the legacy channel and is never
 * used, since it puts the key in URLs and logs.
 */
function configWith(apiKey: string, host: 'api' | 'inference'): OpenAPIConfig {
	return {
		BASE: host === 'inference' ? ROBOFLOW_INFERENCE_BASE : ROBOFLOW_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRoboflowRequest(
	apiKey: string,
	{ method, path, query, body, replayable, host = 'api' }: RoboflowRequest,
): Promise<unknown> {
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		return await request<unknown>(configWith(apiKey, host), requestOptions, {
			rateLimitConfig: ROBOFLOW_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RoboflowAPIError(
				describeRoboflowError(error.status, error.body, error.message),
				{
					status: error.status,
					type: fields.type,
					hint: fields.hint,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RoboflowAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RoboflowAPIError('Unknown Roboflow error', {
			method,
			replayable,
		});
	}
}

/** Encodes one path segment; a workspace or project slug is URL-safe but not assumed so. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
