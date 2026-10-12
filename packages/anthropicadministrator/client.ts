import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export type AnthropicAdministratorMethod = 'GET' | 'POST' | 'DELETE';

/**
 * Error thrown by every Admin API call.
 *
 * The transport status and rate-limit metadata are copied off the underlying
 * `ApiError` so `error-handlers.ts` can match on them — a wrapper that only
 * carried `message` would make the 429 policy unreachable, because corsair
 * throws a 429 with the message "Too Many Requests" (no status in the text).
 */
export class AnthropicAdministratorAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	/** Admin API error bodies are `{ type: "error", error: { type, message } }`. */
	// Safe: the body is only read through `readErrorType`, which validates it with zod.
	// A narrower type is not practical because gateways and proxies can return non-Anthropic error bodies.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	/** HTTP method of the failed request, so retries can tell reads from writes. */
	public readonly method?: AnthropicAdministratorMethod;
	/** Anthropic error type, e.g. `authentication_error`, `not_found_error`. */
	public readonly errorType?: string;

	constructor(
		message: string,
		options?: { cause?: Error; method?: AnthropicAdministratorMethod },
	) {
		super(message, options);
		this.name = 'AnthropicAdministratorAPIError';
		this.method = options?.method;

		const cause = options?.cause;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.statusText = cause.statusText;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.errorType = readErrorType(cause.body);
		}
	}
}

const ErrorEnvelopeSchema = z.object({ error: z.object({ type: z.string() }) });

/** Pulls `error.type` out of an Anthropic error envelope when present. */
// Safe: the value is validated with `ErrorEnvelopeSchema` before any field is read.
// A narrower type is not practical because the body comes straight off the wire.
export function readErrorType(body: unknown): string | undefined {
	return ErrorEnvelopeSchema.safeParse(body).data?.error.type;
}

const ANTHROPIC_API_BASE = 'https://api.anthropic.com';

/**
 * Version header required on every request to the Anthropic API.
 * https://platform.claude.com/docs/en/api/versioning
 */
const ANTHROPIC_VERSION = '2023-06-01';

/**
 * Which credential `apiKey` holds. Admin API keys authenticate with `x-api-key`;
 * OAuth tokens carrying the `org:admin` scope use `authorization: Bearer`.
 * https://platform.claude.com/docs/en/manage-claude/admin-api
 */
export type AnthropicAdministratorAuthType = 'api_key' | 'oauth_2';

export type AnthropicAdministratorRequestOptions = {
	method?: AnthropicAdministratorMethod;
	authType?: AnthropicAdministratorAuthType;
	/** JSON request payload, already validated by the operation's input schema. */
	// Safe: every body is built from an input that passed its zod schema and is only JSON-serialized.
	// A narrower type is not practical because each of the 26 operations sends a different payload shape.
	body?: Record<string, unknown>;
	/**
	 * Query values are heterogeneous across the Admin API (cursors, limits,
	 * repeated filters), so arrays are allowed for repeatable params.
	 */
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

/**
 * Upper bound on a request path.
 *
 * Every path this plugin builds is a short literal prefix (at most
 * `/v1/organizations/workspaces`) plus one or two percent-encoded resource
 * IDs, so this is far above anything legitimate.
 *
 * It also bounds the work done by the `{placeholder}` substitution in
 * `corsair/http`, whose regex is polynomial in the number of unmatched `{`
 * characters (CodeQL `js/polynomial-redos`). Capping the input length is the
 * documented mitigation when the regex itself is not owned here.
 */
const MAX_ENDPOINT_LENGTH = 512;

/**
 * Non-streaming Messages calls can run for minutes, well past corsair's 20s
 * default, so this matches the official SDK's 10 minute request timeout.
 */
const REQUEST_TIMEOUT_MS = 600_000;

/** Total attempts for a retryable failure (1 initial + 2 retries). */
const MAX_ATTEMPTS = 3;

/** Upper bound on an honoured `Retry-After`, so a hostile header cannot stall a caller. */
const MAX_RETRY_DELAY_MS = 30_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Whether a failed attempt may be replayed.
 *
 * A 429 is safe for any method: the request was rejected before being applied.
 * A 5xx may have been applied server-side, and the Admin API documents no
 * idempotency key, so only GET is replayed.
 */
function isRetryable(
	status: number | undefined,
	method: AnthropicAdministratorMethod,
): boolean {
	if (status === 429) return true;
	if (status !== undefined && status >= 500) return method === 'GET';
	return false;
}

/**
 * Retrying is owned by the loop below, so corsair's built-in 429 retry is
 * limited to the single attempt. Rate-limit detection stays on so a final 429
 * still carries its `Retry-After` value.
 */
const SINGLE_ATTEMPT: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

function retryDelayMs(error: ApiError, attempt: number): number {
	const retryAfter = error.retryAfter;
	if (typeof retryAfter === 'number' && retryAfter > 0) {
		return Math.min(retryAfter, MAX_RETRY_DELAY_MS);
	}
	return Math.min(2 ** (attempt - 1) * 1000, MAX_RETRY_DELAY_MS);
}

/**
 * Performs a request against the Anthropic Admin API.
 *
 * Auth: an Admin API key (`sk-ant-admin…`) in the `x-api-key` header, or an
 * OAuth token with the `org:admin` scope in `authorization: Bearer`. Admin keys
 * are provisioned by organization admins and are distinct from standard API
 * keys.
 *
 * Retries are performed here rather than delegated to the shared endpoint
 * binder, so a request that succeeds on retry returns that result to the
 * caller instead of surfacing the first failure.
 */
// Safe: callers parse the returned body with the operation's zod output schema before use.
// A narrower type is not practical because the response shape depends on which of the 26 endpoints was called.
export async function makeAnthropicAdministratorRequest(
	endpoint: string,
	apiKey: string,
	options: AnthropicAdministratorRequestOptions = {},
): Promise<unknown> {
	const { method = 'GET', body, query, authType = 'api_key' } = options;

	if (endpoint.length > MAX_ENDPOINT_LENGTH) {
		throw new AnthropicAdministratorAPIError(
			`Request path exceeds ${MAX_ENDPOINT_LENGTH} characters`,
			{ method },
		);
	}

	const isWrite = method === 'POST';

	const credential: Record<string, string> =
		authType === 'oauth_2'
			? { authorization: `Bearer ${apiKey}` }
			: { 'x-api-key': apiKey };

	const config: OpenAPIConfig = {
		BASE: ANTHROPIC_API_BASE,
		VERSION: ANTHROPIC_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		TIMEOUT: REQUEST_TIMEOUT_MS,
		HEADERS: {
			...credential,
			'anthropic-version': ANTHROPIC_VERSION,
			...(isWrite ? { 'content-type': 'application/json' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json' : undefined,
		query,
	};

	for (let attempt = 1; ; attempt++) {
		try {
			// Safe: the raw body is validated by the caller's output schema.
			// A narrower type is not practical because this transport is shared by every endpoint.
			return await request<unknown>(config, requestOptions, {
				rateLimitConfig: SINGLE_ATTEMPT,
			});
		} catch (error) {
			if (
				error instanceof ApiError &&
				attempt < MAX_ATTEMPTS &&
				isRetryable(error.status, method)
			) {
				await sleep(retryDelayMs(error, attempt));
				continue;
			}
			throw new AnthropicAdministratorAPIError(
				error instanceof Error ? error.message : 'Unknown error',
				{ cause: error instanceof Error ? error : undefined, method },
			);
		}
	}
}
