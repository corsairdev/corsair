import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText || 'API Error'}: ${bodyDetail}`
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
	const keySecret =
		ctx.options.keySecret ?? (await ctx.keys.get_key_secret()) ?? '';
	return { keyId: ctx.key, keySecret };
}
