import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Yandex Translate, part of Yandex Cloud, on its v2 JSON API. */
export const YANDEX_TRANSLATE_BASE = 'https://translate.api.cloud.yandex.net';

/**
 * Two credentials are accepted, and they are different kinds of key:
 *
 * - a **service-account API key**, sent as `Authorization: Api-Key <key>`, which
 *   is what a server-side integration uses;
 * - an **IAM token**, sent as `Authorization: Bearer <token>`, which expires and
 *   has to be refreshed.
 *
 * The plugin sends `Api-Key` because that is the long-lived one, and accepts a
 * key that already carries the scheme so an IAM token can be used instead.
 */
export const YANDEX_AUTH_SCHEME = 'Api-Key';

const YANDEX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status) => status === 429,
};

/** The gRPC code for "unauthenticated", which a bad key answers with. */
const GRPC_UNAUTHENTICATED = 16;

// unknown: the body is an untyped error body until asRecord narrows it.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Yandex Cloud answers a failure in **gRPC's JSON mapping**, not plain HTTP:
 *
 * ```
 * {
 *   "code": 16,
 *   "message": "Unknown api key '****'",
 *   "details": [{ "@type": ".../RequestInfo", "requestId": "..." }]
 * }
 * ```
 *
 * `code` is a gRPC status, so 3 is a bad argument, 5 not found, 7 permission
 * denied, 16 unauthenticated and 8 resource exhausted — not HTTP statuses. The
 * `requestId` is what Yandex support asks for, so it is kept.
 */
export class YandexAPIError extends Error {
	/** The HTTP status Yandex mapped from the gRPC code, e.g. 401 for 16. */
	readonly status?: number;
	/** The gRPC code, e.g. 16 for unauthenticated. */
	readonly grpcCode?: number;
	/** Yandex's request id, which their support asks for. */
	readonly requestId?: string;
	/** Milliseconds from a Retry-After header, when Yandex sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	// unknown: error bodies are usually the shape above, but a proxy can answer
	// with HTML or text.
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
		this.name = 'YandexAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;

		const record = asRecord(this.body);
		const code = record?.code;
		this.grpcCode = typeof code === 'number' ? code : undefined;
		this.requestId = readRequestId(record?.details);
	}

	/** True for a missing, unknown or expired key, or a bad IAM token. */
	get isAuthError(): boolean {
		return this.status === 401 || this.grpcCode === GRPC_UNAUTHENTICATED;
	}

	/** True when a required field is missing or a language code is unknown. */
	get isValidationError(): boolean {
		return this.grpcCode === 3;
	}

	/** True when the resource does not exist. */
	get isNotFound(): boolean {
		return this.grpcCode === 5 || this.status === 404;
	}

	/** True when the quota or rate limit is exhausted. */
	get isResourceExhausted(): boolean {
		return this.grpcCode === 8 || this.status === 429;
	}
}

/**
 * Reads `requestId` out of the gRPC `details` array.
 * unknown: the array holds heterogeneous `@type`-tagged objects from Google's
 * error model, so each entry is narrowed by `asRecord` here.
 */
function readRequestId(details: unknown): string | undefined {
	if (!Array.isArray(details)) return undefined;
	for (const entry of details) {
		const id = readString(asRecord(entry), 'requestId');
		if (id) return id;
	}
	return undefined;
}

// unknown: see YandexAPIError.
export function describeYandexError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text = readString(record, 'message') ?? fallback;
	const code = record?.code;
	const label =
		code !== undefined && typeof code === 'number'
			? `grpc ${code}`
			: `${status ?? ''}`;
	const trimmed = label.trim();
	return trimmed ? `Yandex ${trimmed}: ${text}` : text;
}

export type YandexQuery = Record<string, string | number | boolean | undefined>;

export type YandexRequest = {
	method: 'POST';
	path: string;
	query?: YandexQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
};

/**
 * A cloud resource is scoped to a folder, and the header identifies which one.
 * A service account's key already implies its folder; a user account's IAM
 * token needs the folder named on every call.
 */
export function folderHeader(
	folderId: string | undefined,
): Record<string, string> {
	return folderId ? { 'x-folder-id': folderId } : {};
}

/** The authorization header, honouring a key that names its own scheme. */
export function authHeader(apiKey: string): string {
	const trimmed = apiKey.trim();
	// An IAM token is passed as `Bearer`, which the caller writes explicitly.
	if (/^(Bearer|Api-Key)\s+/i.test(trimmed)) return trimmed;
	return `${YANDEX_AUTH_SCHEME} ${trimmed}`;
}

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeYandexRequest(
	apiKey: string,
	{ path, query, body }: YandexRequest,
	folderId?: string,
	// unknown: callers parse the body with the operation's output schema.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: YANDEX_TRANSLATE_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: authHeader(apiKey),
			...folderHeader(folderId),
		},
	};

	const requestOptions: ApiRequestOptions = {
		// Every Yandex Translate call is a POST, including the reads.
		method: 'POST',
		url: path,
		query,
		body,
		mediaType: 'application/json',
	};

	try {
		// unknown: the body is provider JSON until the caller's output schema parses
		// it; `request` cannot know the operation's shape.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: YANDEX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new YandexAPIError(
				describeYandexError(error.status, error.body, error.message),
				{ cause: error },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new YandexAPIError(error.message, { cause: error, method: 'POST' });
		}
		throw new YandexAPIError('Unknown Yandex error', { method: 'POST' });
	}
}

/** Narrows a caught value to this plugin's error. */
// unknown: a catch block can receive any value, which is what this narrows.
export function isYandexFailure(error: unknown): error is YandexAPIError {
	return error instanceof YandexAPIError;
}
