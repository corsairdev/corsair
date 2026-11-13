import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * RudderStack runs two regions on separate hosts, and a token is only valid on
 * the region its workspace lives in. The region is a plugin option rather than a
 * credential, because the token itself carries no region marker.
 */
export const RUDDERSTACK_TRANSFORMATION_HOSTS = {
	us: 'https://api.rudderstack.com',
	eu: 'https://api.eu.rudderstack.com',
} as const;

export type RudderStackTransformationRegion =
	keyof typeof RUDDERSTACK_TRANSFORMATION_HOSTS;

/** The US host, which is the default and the one every example in the docs uses. */
export const RUDDERSTACK_TRANSFORMATION_BASE =
	RUDDERSTACK_TRANSFORMATION_HOSTS.us;

/**
 * RudderStack answers a failure with a lone `message`:
 *
 * ```json
 * {"message":"Invalid Access Token"}
 * {"message":"Unauthorised"}
 * {"message":"Transformation is not published"}
 * ```
 *
 * There is no numeric code in the body and no error slug, so the HTTP status is
 * the only structured signal. The first two were captured live against
 * `api.rudderstack.com` and `api.eu.rudderstack.com`; the third is the `400` the
 * docs document for connecting an unpublished transformation.
 */
export class RudderStackTransformationAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when RudderStack sent one. */
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
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RudderStackTransformationAPIError';
		this.status = options.status;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/** The token is missing, wrong, or for the other region's workspace. */
	get isAuthError(): boolean {
		return this.status === 401 || this.status === 403;
	}

	/**
	 * A `403` is a token that exists but lacks the scope the route needs, which
	 * the docs list per resource: Transformations need Create & Delete, Connect
	 * and Edit; Libraries need Edit; destinations need Connect.
	 */
	get isPermissionError(): boolean {
		return this.status === 403;
	}

	/** A transformation or library ID that does not exist in this workspace. */
	get isNotFound(): boolean {
		return this.status === 404;
	}

	/**
	 * A body RudderStack refused. `connectToDestination` answers `400` with
	 * "Transformation is not published", and the Publish API answers a failed
	 * test the same way, so this read is worth surfacing verbatim.
	 */
	get isValidationError(): boolean {
		return this.status === 400 || this.status === 422;
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): { message?: string } {
	const record = asRecord(body);
	const message = record?.message;
	const error = record?.error;
	return {
		message:
			typeof message === 'string' && message.length > 0
				? message
				: typeof error === 'string' && error.length > 0
					? error
					: undefined,
	};
}

/**
 * Builds the message for an error body. RudderStack's `message` is short and
 * specific ("Transformation is not published"), so it is prefixed with the status
 * and left otherwise intact.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRudderStackTransformationError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message } = failure(body);
	const text = message ?? fallback;
	return status === undefined ? text : `RudderStack ${status}: ${text}`;
}

/** A query value; the versions routes take only `count` and `orderBy`. */
export type RudderStackTransformationQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RudderStackTransformationRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	/** Path below the host, starting with a slash. */
	path: string;
	query?: RudderStackTransformationQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * RudderStack documents no numeric rate limit for this API, only that requests
 * are rate limited. There is no `Retry-After` documented either, so the handler
 * backs off on its own and reads the header only if one arrives.
 */
const RUDDERSTACK_TRANSFORMATION_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The token is a bearer token: a workspace-level Service Access Token, or a
 * Personal Access Token for testing. RudderStack recommends the service token,
 * because a personal one stops working when its user leaves the organization.
 */
function configFor(
	apiKey: string,
	region: RudderStackTransformationRegion,
): OpenAPIConfig {
	return {
		BASE: RUDDERSTACK_TRANSFORMATION_HOSTS[region],
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
export async function makeRudderStackTransformationRequest(
	apiKey: string,
	region: RudderStackTransformationRegion,
	{ method, path, query, body, replayable }: RudderStackTransformationRequest,
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
		return await request<unknown>(configFor(apiKey, region), requestOptions, {
			rateLimitConfig: RUDDERSTACK_TRANSFORMATION_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RudderStackTransformationAPIError(
				describeRudderStackTransformationError(
					error.status,
					error.body,
					error.message,
				),
				{
					status: error.status,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RudderStackTransformationAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RudderStackTransformationAPIError('Unknown RudderStack error', {
			method,
			replayable,
		});
	}
}
