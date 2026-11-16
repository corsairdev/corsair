import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Honeybadger runs one app per region and an account belongs to one of them: a
 * US token is answered 401 by the EU host and the reverse. The region is an
 * option because only the account holder knows which app their account is on.
 */
export const HONEYBADGER_HOSTS = {
	us: 'https://app.honeybadger.io/v3',
	eu: 'https://eu-app.honeybadger.io/v3',
} as const;

export type HoneybadgerRegion = keyof typeof HONEYBADGER_HOSTS;

export const HONEYBADGER_DEFAULT_REGION: HoneybadgerRegion = 'us';

/**
 * One attempt only: retries belong to error-handlers.ts, so a single place
 * decides whether a call is repeated.
 *
 * Only `retry-after` is read. Core also reads `x-ratelimit-reset` when it is
 * named, and turns it into the retry delay; Honeybadger resets its 360-per-hour
 * budget on the hour, so a 429 answered just after the hour would stall the
 * call for most of an hour. Its `Retry-After` is the documented wait.
 */
const HONEYBADGER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type HoneybadgerQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * A value JSON can carry. Request bodies are built from an endpoint's parsed
 * input and responses are parsed by its output schema, so every value crossing
 * this boundary is JSON and nothing stricter is needed.
 */
export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

/** A JSON object, which is what every documented body and envelope is. */
export type JsonObject = { [key: string]: JsonValue };

/**
 * A request body. A field set to `undefined` is omitted by `JSON.stringify`,
 * which is how an endpoint leaves out a field the caller did not send while
 * still passing `null` through, since `null` clears a nullable field.
 */
export type HoneybadgerBody = { [key: string]: JsonValue | undefined };

export type HoneybadgerRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	query?: HoneybadgerQuery;
	body?: HoneybadgerBody;
	/**
	 * Whether sending the same request twice is safe. Defaults to `method ===
	 * 'GET'`. Set it for a POST that only reads, which Honeybadger uses for
	 * BadgerQL queries.
	 */
	replayable?: boolean;
};

function isReplayable({ method, replayable }: HoneybadgerRequest): boolean {
	return replayable ?? method === 'GET';
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

/** The `error` object Honeybadger puts in every failure body. */
export type HoneybadgerErrorBody = {
	code?: string;
	message?: string;
	details?: JsonValue;
};

/** Narrows a JSON value to an object, which is the only shape worth reading. */
function asRecord(value: JsonValue | undefined): JsonObject | undefined {
	return value !== null && typeof value === 'object' && !Array.isArray(value)
		? value
		: undefined;
}

export function readErrorBody(
	body: JsonValue | undefined,
): HoneybadgerErrorBody {
	const error = asRecord(asRecord(body)?.error);
	if (!error) return {};
	const code = error.code;
	const message = error.message;
	return {
		code: typeof code === 'string' ? code : undefined,
		message: typeof message === 'string' ? message : undefined,
		details: error.details,
	};
}

/**
 * Renders `details`, one of three documented shapes: a list of
 * `{field, message}` for a validation failure, `{required_scope, token_scopes}`
 * for a scope refusal, or `{merged_into, location}` for a merge. Only field
 * names and codes are printed, never a value the caller sent.
 */
function describeDetails(details: JsonValue | undefined): string | undefined {
	if (Array.isArray(details)) {
		const parts = details
			.map((entry) => {
				const record = asRecord(entry);
				const field = record?.field;
				const message = record?.message;
				if (typeof field !== 'string') return undefined;
				return typeof message === 'string' ? `${field}: ${message}` : field;
			})
			.filter((part): part is string => part !== undefined);
		return parts.length > 0 ? parts.join('; ') : undefined;
	}
	const record = asRecord(details);
	if (!record) return undefined;
	const mergedInto = record.merged_into;
	if (typeof mergedInto === 'string') return `merged into fault ${mergedInto}`;
	const required = record.required_scope;
	if (typeof required === 'string') {
		const held = Array.isArray(record.token_scopes)
			? record.token_scopes.filter((s): s is string => typeof s === 'string')
			: [];
		return held.length > 0
			? `needs scope ${required}; token has ${held.join(', ')}`
			: `needs scope ${required}`;
	}
	return undefined;
}

/**
 * Honeybadger failures are core `ApiError`s with the stable code in
 * `body.error.code`. The body itself is dropped: it carries the fault message
 * and, on a validation failure, the submitted values. `status`, `retryAfter`
 * and the code are kept because those are what the handlers match on.
 */
export class HoneybadgerAPIError extends Error {
	/** HTTP status, absent on a failure that never reached the provider. */
	readonly status?: number;
	/** Stable code from `body.error.code`, e.g. `insufficient_scope`. */
	readonly code?: string;
	/** Milliseconds from `Retry-After`, when Honeybadger sent one. */
	readonly retryAfter?: number;
	readonly method: string;
	/** Whether replaying this exact request is safe. */
	readonly replayable: boolean;
	/**
	 * True when the client gave up waiting. A timeout never reached the
	 * provider, and it is otherwise indistinguishable from a reset connection:
	 * both arrive with no status.
	 */
	readonly timedOut: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			method: string;
			replayable: boolean;
			timedOut?: boolean;
		},
	) {
		super(message);
		this.name = 'HoneybadgerAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable;
		this.timedOut = options.timedOut ?? false;
	}
}

/** Renders a failure for a message a person reads. */
export function describeFailure(
	status: number | undefined,
	{ code, message, details }: HoneybadgerErrorBody,
	fallback: string,
): string {
	const label = [status, code].filter((part) => part !== undefined).join(' ');
	const text = message ?? fallback;
	const base = label ? `Honeybadger ${label}: ${text}` : `Honeybadger: ${text}`;
	const extra = describeDetails(details);
	return extra ? `${base} (${extra})` : base;
}

/**
 * Sends one request and normalises every failure into `HoneybadgerAPIError`.
 * The token is sent as a Bearer header and never in the URL or the body, so it
 * is absent from the error and from the request the error describes.
 */
/**
 * Resolves with the response body, or `undefined` for the bodyless answers: a
 * 204 from any delete. Callers parse it with the endpoint's output schema.
 */
export async function makeHoneybadgerRequest(
	token: string,
	request_: HoneybadgerRequest,
	region: HoneybadgerRegion = HONEYBADGER_DEFAULT_REGION,
): Promise<JsonValue | undefined> {
	const { method, path, query, body } = request_;
	const replayable = isReplayable(request_);

	const config: OpenAPIConfig = {
		BASE: HONEYBADGER_HOSTS[region],
		VERSION: '3.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Renders as `Authorization: Bearer <token>`. Set on the config rather
		// than on the request headers so the token is not copied into
		// ApiError.request, which is enumerable on the error.
		TOKEN: token,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<JsonValue>(config, requestOptions, {
			rateLimitConfig: HONEYBADGER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			// Read once: `describeFailure` joins the code and the details into
			// the message, and the code is also kept as a field to match on.
			const body = readErrorBody(error.body);
			throw new HoneybadgerAPIError(
				describeFailure(error.status, body, error.statusText || error.message),
				{
					status: error.status,
					code: body.code,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// A transport failure never reached the provider, so no status and no
		// code. DOMException (which `AbortSignal.timeout` throws) can fail
		// instanceof Error across realms, which is why both are checked.
		//
		// `AbortSignal.timeout` raises a DOMException named `TimeoutError`, and
		// that name is what tells a timeout from a reset connection. It is
		// recorded here because the error below is a new object: without this,
		// no handler could tell the two apart.
		const timedOut =
			(error instanceof Error || error instanceof DOMException) &&
			error.name === 'TimeoutError';
		const message =
			(error instanceof Error && error.message) ||
			(error instanceof DOMException && error.message) ||
			'Unknown Honeybadger error';
		throw new HoneybadgerAPIError(message, {
			method,
			replayable,
			timedOut,
		});
	}
}
