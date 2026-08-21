import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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

/** Pulls `error.type` out of an Anthropic error envelope when present. */
function readErrorType(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const error = (body as { error?: unknown }).error;
	if (typeof error !== 'object' || error === null) return undefined;
	const type = (error as { type?: unknown }).type;
	return typeof type === 'string' ? type : undefined;
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
	/** Request payloads differ per operation; validated by per-op zod schemas. */
	body?: Record<string, unknown>;
	/**
	 * Query values are heterogeneous across the Admin API (cursors, limits,
	 * repeated filters), so arrays are allowed for repeatable params.
	 */
	query?: Record<string, string | number | boolean | string[] | undefined>;
};

/**
 * Performs a request against the Anthropic Admin API.
 *
 * Auth: an Admin API key (`sk-ant-admin…`) in the `x-api-key` header, or an
 * OAuth token with the `org:admin` scope in `authorization: Bearer`. Admin keys
 * are provisioned by organization admins and are distinct from standard API
 * keys.
 */
export async function makeAnthropicAdministratorRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AnthropicAdministratorRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, authType = 'api_key' } = options;
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

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new AnthropicAdministratorAPIError(error.message, {
				cause: error,
				method,
			});
		}
		throw new AnthropicAdministratorAPIError('Unknown error', { method });
	}
}
