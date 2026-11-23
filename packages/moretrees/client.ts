import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MORETREES_HOSTS = {
	user_management:
		'https://user-management-service.platform.moretrees.eco/user-management-api/external',
	project_management:
		'https://project-management-service.platform.moretrees.eco/project-management-api/external',
	transaction_management:
		'https://transaction-management-service.platform.moretrees.eco/transaction-management-api/external',
} as const;

export type MoreTreesService =
	| 'user_management'
	| 'project_management'
	| 'transaction_management';

/**
 * The account code that selects the payment account. Stored on the account
 * (Settings > Account Settings) and required by account.get and trees.plant.
 */
export type MoreTreesCallContext = {
	key: string;
	options: { accountCode?: string };
	keys: {
		get_account_code: () => Promise<string | null | undefined>;
	};
};

/** Resolves the account code: the inline option wins over the stored field. */
export async function resolveAccountCode(
	ctx: MoreTreesCallContext,
): Promise<string> {
	const value = ctx.options.accountCode ?? (await ctx.keys.get_account_code());
	if (!value) {
		throw new Error(
			'More Trees account_code is required: pass accountCode in the plugin options or save it on the account.',
		);
	}
	return value;
}

/**
 * More Trees errors: the documented response codes are plain HTTP statuses
 * (200/201/400/401/403/404/406/429/500). The live API answers failures with
 * a JSON envelope: `{"status":400,"error":"Bad Request","message":"...",
 * "path":"..."}` (probed unauthenticated).
 */
export class MoreTreesAPIError extends Error {
	readonly status?: number;
	/** The envelope's `error` field, e.g. `Bad Request`. */
	readonly moreTreesError?: string;
	/** The envelope's `message` field. */
	readonly message2?: string;
	/** The envelope's `path` field. */
	readonly path?: string;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;
	// unknown: the error body is an untyped envelope until narrowed below.
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
		this.name = 'MoreTreesAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		const envelope = asRecord(this.body);
		this.moreTreesError =
			typeof envelope?.error === 'string' ? envelope.error : undefined;
		this.message2 =
			typeof envelope?.message === 'string' ? envelope.message : undefined;
		this.path = typeof envelope?.path === 'string' ? envelope.path : undefined;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.replayable = options.replayable;
	}
}

// unknown: the record is an untyped error body; read one field at a time.
function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function describeMoreTreesError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'message') ?? readString(record, 'error') ?? fallback;
	const label = [status].filter((part) => part !== undefined).join(' ');
	return label ? `More Trees ${label}: ${text}` : `More Trees: ${text}`;
}

export type MoreTreesQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MoreTreesRequest = {
	service: MoreTreesService;
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	query?: MoreTreesQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** True when a 5xx or a network drop can replay the request: reads only. */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. More Trees documents 429 under its
// response codes without a window.
const MORETREES_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMoreTreesRequest(
	ctx: MoreTreesCallContext,
	{ service, method, path, query, body, replayable }: MoreTreesRequest,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MORETREES_HOSTS[service],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': ctx.key,
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
			rateLimitConfig: MORETREES_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MoreTreesAPIError(
				describeMoreTreesError(error.status, error.body, error.message),
				{ cause: error, replayable },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MoreTreesAPIError(error.message, { method, replayable });
		}
		throw new MoreTreesAPIError('Unknown More Trees error', {
			method,
			replayable,
		});
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
