import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export class LeexiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Provider error payloads are untyped JSON (object, string, or null
	// depending on the endpoint), so `unknown` forces callers to narrow
	// before use instead of trusting `any`.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'LeexiAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const LEEXI_API_BASE = 'https://public-api.leexi.ai/v1';

export type LeexiCredentials = {
	keyId: string;
	keySecret: string;
};

/**
 * Minimal context surface `resolveLeexiCredentials` needs. Declared
 * structurally (not as the full `LeexiContext`) so unit tests can build it
 * with zero type assertions, while the real `LeexiContext` stays assignable
 * at production call sites.
 */
export type LeexiCredentialSource = {
	key: string;
	options: { keySecret?: string };
	keys: { get_key_secret: () => Promise<string | null> };
};

// Upper bound for any provider-supplied text quoted in an error message.
const MAX_ERROR_DETAIL_LENGTH = 200;

// Common provider error shapes. Parsed with zod (never indexed or cast),
// so only a declared short string field is ever quoted — full objects,
// arrays, and non-string payloads stay out of the message.
const ErrorSummarySchema = z
	.object({
		message: z.string(),
		code: z.string(),
		error: z.string(),
	})
	.partial();

/**
 * Extracts a short, safe summary from a provider error payload without
 * dumping the whole body into the message (messages flow into logs, and
 * bodies can carry PII or tokens). Allowed: a short string body, or the
 * short string value of a `message`/`code`/`error` field on a plain object.
 * Anything else yields `undefined` and the caller falls back to the HTTP
 * status text.
 */
function safeErrorSummary(body: unknown): string | undefined {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		return trimmed === '' || trimmed.length > MAX_ERROR_DETAIL_LENGTH
			? undefined
			: trimmed;
	}
	const parsed = ErrorSummarySchema.safeParse(body);
	if (parsed.success) {
		const value = parsed.data.message ?? parsed.data.code ?? parsed.data.error;
		if (value !== undefined) {
			const trimmed = value.trim();
			if (trimmed !== '' && trimmed.length <= MAX_ERROR_DETAIL_LENGTH) {
				return trimmed;
			}
		}
	}
	return undefined;
}

/**
 * Leexi authenticates with HTTP Basic auth using an API Key ID + Key Secret
 * pair (Authorization: Basic base64(KEY_ID:KEY_SECRET)), not a bearer token.
 *
 * `T` defaults to `unknown` at call sites on purpose: the raw JSON is never
 * trusted — every endpoint validates it with its zod output schema before
 * returning, so `unknown` keeps the transport layer honest.
 */
export async function makeLeexiRequest<T>(
	endpoint: string,
	credentials: LeexiCredentials,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// JSON-serializable request body. `unknown` values force each
		// endpoint to pass only zod-parsed input (see calls.ts etc.).
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<T> {
	const { keyId, keySecret } = credentials;
	if (!keyId.trim() || !keySecret.trim()) {
		throw new AuthMissingError('leexi', 'api_key');
	}

	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: LEEXI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: !isWriteMethod ? query : undefined,
	};
	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// Never quote the full body: `safeErrorSummary` allows only a
			// short string (or short message/code/error field). Status and
			// retry metadata still travel on the error for classification.
			const summary = safeErrorSummary(error.body);
			const message = summary
				? `${error.statusText || 'API Error'}: ${summary}`
				: error.statusText || 'Unknown API Error';
			throw new LeexiAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new LeexiAPIError(error.message);
		}
		throw new LeexiAPIError('Unknown error');
	}
}

/**
 * Resolves the Key ID (`ctx.key`, from the `api_key` account field) and Key
 * Secret (from the `key_secret` account field extension) that together form
 * Leexi's Basic auth credentials.
 */
export async function resolveLeexiCredentials(
	ctx: LeexiCredentialSource,
): Promise<LeexiCredentials> {
	// An explicitly blank override ('' or whitespace-only) means "unset",
	// not "use an empty secret": fall back to the stored account secret so
	// a blank option can't shadow it and fail confusingly downstream in
	// `makeLeexiRequest`'s own blank check. Non-blank overrides win and the
	// stored secret is only fetched when needed.
	const override = ctx.options.keySecret;
	const keySecret =
		override !== undefined && override.trim() !== ''
			? override
			: ((await ctx.keys.get_key_secret()) ?? '');
	return { keyId: ctx.key, keySecret };
}
