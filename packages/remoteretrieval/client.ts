import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * The API lives on the main site rather than a separate host, under `/api/v1`.
 * There is no `api.remoteretrieval.com`.
 */
export const REMOTERETRIEVAL_API_BASE =
	'https://www.remoteretrieval.com/api/v1';

/**
 * A failure carries both a `code` and a `custom_code`, and `status: "Fail"`:
 *
 * ```json
 * {"message":"Invalid Key!","status":"Fail","code":401,"custom_code":401}
 * ```
 *
 * That is the live answer for a missing key, a wrong key and — as far as the probe
 * could tell — every route, so an invalid token is caught before routing.
 */
export class RemoteRetrievalAPIError extends Error {
	readonly status?: number;
	/** The body's `code`, which repeats the HTTP status. */
	readonly code?: number;
	/** The body's `custom_code`, which the API sends alongside `code`. */
	readonly customCode?: number;
	/** The body's `status`: Success or Fail. */
	readonly resultStatus?: string;
	/** Milliseconds from a Retry-After header, when the host sent one. */
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
			code?: number;
			customCode?: number;
			resultStatus?: string;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'RemoteRetrievalAPIError';
		this.status = options.status;
		this.code = options.code;
		this.customCode = options.customCode;
		this.resultStatus = options.resultStatus;
		this.retryAfter = options.retryAfter;
		this.method = options.method;
		this.replayable = options.replayable ?? false;
	}

	/**
	 * The key was refused. The API answers `Invalid Key!` with a 401 for both a
	 * missing key and a wrong one, so the message cannot tell them apart.
	 */
	get isAuthError(): boolean {
		return this.status === 401 || this.code === 401 || this.customCode === 401;
	}

	/** The order, company or device the caller asked about does not exist. */
	get isNotFound(): boolean {
		return this.status === 404 || this.code === 404;
	}

	/** A body the API refused, such as an order missing a required address field. */
	get isValidationError(): boolean {
		return (
			this.status === 400 ||
			this.status === 422 ||
			this.code === 400 ||
			this.code === 422
		);
	}
}

/**
 * Reads a failure body.
 * unknown: the body is provider JSON until this reader narrows it.
 */
function failure(body: unknown): {
	message?: string;
	code?: number;
	customCode?: number;
	status?: string;
} {
	const record = asRecord(body);
	const message = record?.message;
	const code = record?.code;
	const customCode = record?.custom_code;
	const status = record?.status;
	return {
		message:
			typeof message === 'string' && message.length > 0 ? message : undefined,
		code: typeof code === 'number' ? code : undefined,
		customCode: typeof customCode === 'number' ? customCode : undefined,
		status:
			typeof status === 'string' && status.length > 0 ? status : undefined,
	};
}

/**
 * True when a body is the API's failure envelope. Both codes match the HTTP status
 * on every documented failure, so `status: "Fail"` is the reliable marker; a
 * successful create answers `status: "Success"`.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function isRemoteRetrievalFailure(body: unknown): boolean {
	return failure(body).status === 'Fail';
}

/**
 * Builds the message for an error body. The `message` is short and specific
 * ("Invalid Key!"), so it is kept verbatim with the status prefixed.
 * unknown: the body is untyped until `failure` narrows it.
 */
export function describeRemoteRetrievalError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const { message, code } = failure(body);
	const text = message ?? fallback;
	const label = status ?? code;
	return label === undefined ? text : `Remote Retrieval ${label}: ${text}`;
}

/** A query value; the list routes take `page` or `cursor` and nothing else. */
export type RemoteRetrievalQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type RemoteRetrievalRequest = {
	method: 'GET' | 'POST';
	/** Path below `/api/v1`, starting with a slash. */
	path: string;
	query?: RemoteRetrievalQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** Declared per operation so a write is never replayed. */
	replayable: boolean;
};

/**
 * The API documents no rate limit and no Retry-After, only that orders are created
 * at a real logistics company, so a 429 is honoured if one ever arrives and the
 * backoff is exponential otherwise.
 */
const REMOTERETRIEVAL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0, // retries belong to error-handlers.ts
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * The key is a bearer token obtained from the Enterprise Remote Retriever portal
 * and sent as `Authorization: Bearer <key>`.
 */
function config(): OpenAPIConfig {
	return {
		BASE: REMOTERETRIEVAL_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: 'application/json' },
	};
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeRemoteRetrievalRequest(
	apiKey: string,
	{ method, path, query, body, replayable }: RemoteRetrievalRequest,
): Promise<unknown> {
	const configWithKey = config();
	configWithKey.HEADERS = {
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	let raw: unknown;
	try {
		// unknown: the body is provider JSON until the caller's output schema
		// parses it; `request` cannot know the operation's shape.
		raw = await request<unknown>(configWithKey, requestOptions, {
			rateLimitConfig: REMOTERETRIEVAL_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const fields = failure(error.body);
			// The cause holds the request, and with it the bearer token, so the
			// fields the handlers need are copied and the cause is dropped.
			throw new RemoteRetrievalAPIError(
				describeRemoteRetrievalError(error.status, error.body, error.message),
				{
					status: error.status,
					code: fields.code,
					customCode: fields.customCode,
					resultStatus: fields.status,
					retryAfter: error.retryAfter,
					method,
					replayable,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new RemoteRetrievalAPIError(error.message, {
				cause: error,
				method,
				replayable,
			});
		}
		throw new RemoteRetrievalAPIError('Unknown Remote Retrieval error', {
			method,
			replayable,
		});
	}

	// A failure that arrived with a 200 is thrown here rather than handed to the
	// output schema, which would accept it as a record.
	if (isRemoteRetrievalFailure(raw)) {
		const fields = failure(raw);
		throw new RemoteRetrievalAPIError(
			describeRemoteRetrievalError(undefined, raw, 'refused'),
			{
				code: fields.code,
				customCode: fields.customCode,
				resultStatus: fields.status,
				method,
				replayable,
			},
		);
	}

	return raw;
}
