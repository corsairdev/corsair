import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const HYPEAUDITOR_API_BASE = 'https://hypeauditor.com/api/method';

/**
 * The documented version parameter. It is optional and defaults to the latest,
 * so it is sent explicitly: a caller's stored prompt IDs and field names keep
 * working when the default moves.
 *
 * `v=1` was deprecated on 2024-08-01 and is not selectable here.
 */
export const HYPEAUDITOR_API_VERSION = '2';

/** Both headers are required; there is no single-key form. */
export const HYPEAUDITOR_HEADERS = {
	id: 'X-Auth-Id',
	token: 'X-Auth-Token',
} as const;

/**
 * One attempt: retries belong to error-handlers.ts. HypeAuditor documents a
 * limit just under 100 requests a minute but no rate-limit headers, so only
 * `retry-after` is read, for a gateway that sends one.
 */
const HYPEAUDITOR_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/** A value JSON can carry; every body this API returns is JSON. */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

/** A JSON object, which is what both the request and response bodies are. */
export type JsonObject = { [key: string]: JsonValue };

export type HypeAuditorQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type HypeAuditorCredentials = {
	/** The Client ID, sent as `X-Auth-Id`. */
	clientId: string;
	/** The API token, sent as `X-Auth-Token`. */
	apiToken: string;
};

export type HypeAuditorRequest = {
	method: 'GET' | 'POST';
	/** The action, such as `auditor.report/`, without a leading slash. */
	action: string;
	query?: HypeAuditorQuery;
	/**
	 * A request body. A field set to `undefined` is omitted by `JSON.stringify`,
	 * which is how a caller leaves out a filter it did not set.
	 */
	body?: { [key: string]: JsonValue | undefined };
	/**
	 * Whether sending the same request twice is safe. Defaults to `method ===
	 * 'GET'`. A report read is a GET but spends a credit the first time, so it
	 * sets this explicitly.
	 */
	replayable?: boolean;
};

function isReplayable({ method, replayable }: HypeAuditorRequest): boolean {
	return replayable ?? method === 'GET';
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** Narrows a JSON value to an object, which is the only shape worth reading. */
function asRecord(value: JsonValue | undefined): JsonObject | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? value
		: undefined;
}

/**
 * The provider's failure body is `{ error: { code, description } }`. The code is
 * a number and is stable; the description is written for a person.
 *
 * Codes documented across the pages and seen live:
 *
 * - `3` `Unknown method passed`, answered 405. The action name is wrong.
 * - `4` `Invalid token`, answered 403. The token is wrong, or the account is
 *   private or has no posts.
 * - `31` `Account has not enough followers`.
 */
export type HypeAuditorErrorBody = {
	code?: number;
	description?: string;
};

export function readErrorBody(
	body: JsonValue | undefined,
): HypeAuditorErrorBody {
	const error = asRecord(asRecord(body)?.error);
	if (!error) return {};
	const code = error.code;
	const description = error.description;
	return {
		code: typeof code === 'number' ? code : undefined,
		description:
			typeof description === 'string' && description.length > 0
				? description
				: undefined,
	};
}

/**
 * A provider failure. The status, the numeric code and the message are kept
 * because they are what the handlers and the caller read. The body is dropped:
 * it can echo the channel a caller asked about, and the rest of it is the
 * envelope this type already describes.
 */
export class HypeAuditorAPIError extends Error {
	/** The `error.code` the provider sent, when the body carried one. */
	readonly code?: number;
	readonly status?: number;
	/** Milliseconds from `Retry-After`, when a gateway sent one. */
	readonly retryAfter?: number;
	readonly method: string;
	/** Whether replaying this exact request is safe. */
	readonly replayable: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: number;
			retryAfter?: number;
			method: string;
			replayable: boolean;
		},
	) {
		super(message);
		this.name = 'HypeAuditorAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable;
	}
}

/**
 * A failure that never reached the provider: a reset connection, a DNS failure,
 * or the client's own timeout.
 */
export class HypeAuditorTransportError extends Error {
	readonly timedOut: boolean;
	readonly replayable: boolean;

	constructor(
		message: string,
		timedOut: boolean,
		replayable: boolean,
		cause?: Error,
	) {
		super(message, cause ? { cause } : undefined);
		this.name = 'HypeAuditorTransportError';
		this.timedOut = timedOut;
		this.replayable = replayable;
	}
}

/** Renders a failure for a message a person reads. */
export function describeFailure(
	status: number | undefined,
	{ code, description }: HypeAuditorErrorBody,
	fallback: string,
): string {
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const text = description ?? fallback;
	return label ? `HypeAuditor ${label}: ${text}` : `HypeAuditor: ${text}`;
}

export function configWith(credentials: HypeAuditorCredentials): OpenAPIConfig {
	return {
		BASE: HYPEAUDITOR_API_BASE,
		VERSION: HYPEAUDITOR_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Set on the config rather than on the request headers, which keeps both
		// credentials out of `ApiError.request`, an enumerable field on the error.
		HEADERS: {
			Accept: 'application/json',
			[HYPEAUDITOR_HEADERS.id]: credentials.clientId,
			[HYPEAUDITOR_HEADERS.token]: credentials.apiToken,
		},
	};
}

/**
 * Sends one request. `v` is added to every call, because the API's default
 * version moves and the plugin's schemas are written against v2.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeHypeAuditorRequest(
	credentials: HypeAuditorCredentials,
	request_: HypeAuditorRequest,
): Promise<JsonValue | undefined> {
	const replayable = isReplayable(request_);
	const requestOptions: ApiRequestOptions = {
		method: request_.method,
		url: `/${request_.action}`,
		query: { ...request_.query, v: HYPEAUDITOR_API_VERSION },
		body: request_.body,
		mediaType: request_.body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<JsonValue>(configWith(credentials), requestOptions, {
			rateLimitConfig: HYPEAUDITOR_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		const exception =
			error instanceof Error || error instanceof DOMException
				? error
				: undefined;
		if (error instanceof ApiError) {
			const body = readErrorBody(error.body);
			throw new HypeAuditorAPIError(
				describeFailure(error.status, body, error.statusText || error.message),
				{
					status: error.status,
					code: body.code,
					retryAfter: error.retryAfter,
					method: request_.method,
					replayable,
				},
			);
		}
		if (exception) {
			throw new HypeAuditorTransportError(
				exception.message,
				exception.name === 'TimeoutError',
				replayable,
				exception,
			);
		}
		throw new HypeAuditorTransportError(
			'Unknown HypeAuditor error',
			false,
			replayable,
		);
	}
}

/**
 * Reads the account manager through the fields this plugin declared. The
 * generated getters depend on `authConfig`, which the generic manager type
 * cannot see, so this is the one place that narrows it.
 */
export function asHypeAuditorKeys(keys: object): HypeAuditorKeyManager {
	return keys as HypeAuditorKeyManager;
}

/** The slice of the account key manager this plugin reads. */
export type HypeAuditorKeyManager = {
	/** The Client ID, from the account's `client_id` field. */
	get_client_id: () => Promise<string | null | undefined>;
	/** The API token, from the account's `access_token` field. */
	get_access_token: () => Promise<string | null | undefined>;
};

/**
 * Reads the two credentials. Both are account fields, not integration fields:
 * an `api_key` account only builds getters for its own `authConfig.account`
 * list (core's `createFieldAccessors`), so a pair declared under `integration`
 * would have no getter for this auth type.
 *
 * Either one missing is reported as missing auth, because neither works alone.
 */
export async function resolveCredentials(
	keys: HypeAuditorKeyManager,
	pluginId: string,
): Promise<HypeAuditorCredentials> {
	const clientId = await keys.get_client_id();
	const apiToken = await keys.get_access_token();
	if (!clientId || !apiToken) {
		throw new AuthMissingError(pluginId, 'api_key');
	}
	return { clientId, apiToken };
}
