import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Error thrown for any non-2xx Bubble response. Copies the HTTP status,
 * response body, and rate-limit headers from the underlying `ApiError` so
 * `error-handlers.ts` can classify without re-requesting.
 *
 * Bubble error bodies vary by endpoint family (the Data API returns
 * `{"statusCode": ..., "body": {...}}`, the Workflow API `{"error_class":
 * ...}`), so `body` is deliberately `unknown` - no handler here reads it
 * for classification, only the HTTP status.
 */
export class BubbleAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'BubbleAPIError';
		this.status = code;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists
// for this state, so message matching is the only handle available; kept
// narrow on purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all - a fully valid state for accounts that only
 * ever configure the key via plugin options and never touch the key
 * manager, and must resolve to "no stored key" rather than abort the
 * request.
 *
 * Anything else thrown (decryption failure, database error, ...) is a real
 * operational problem, not an absent key, and must propagate.
 */
export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

/**
 * Bubble documents no fixed request-per-second cap for the Data API the way
 * e.g. BigMailer does; plan-tier capacity is enforced with 429 responses.
 * Transport does not retry 429s — that lives in error-handlers.ts so POST
 * creates/workflows are never replayed. `retry-after` is still parsed from
 * the response for the interceptor.
 */
const BUBBLE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export type BubbleRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/**
	 * An object (create/update/replace, default content-type
	 * `application/json`) or a pre-serialized string (bulk create, which
	 * Bubble requires as `text/plain`, one JSON object per line).
	 */
	body?: string | Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	/** Content-Type to send with `body`. Defaults to `text/plain` for string bodies, `application/json` otherwise. */
	mediaType?: string;
	/** Overrides the shared 20s request timeout. Bulk create is allowed up to 4 minutes. */
	timeout?: number;
	/**
	 * Overrides the `https://{appName}.bubbleapps.io` base URL - use for
	 * custom-domain deployments or the `/version-test` development branch
	 * (e.g. `https://app.bubbleapps.io/version-test`).
	 */
	baseUrl?: string;
};

/** Bubble allows a bulk create request to run up to 4 minutes before timing out. */
export const BUBBLE_BULK_TIMEOUT_MS = 260_000;

const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * Bubble app slugs are a single DNS label (`letters`, `digits`, `hyphens`;
 * e.g. `rentalunits`). Enforced before any origin is built so a crafted
 * `appName` (e.g. `x@evil.example#`) can never repoint the request host and
 * have the bearer token sent to it (SSRF via URL userinfo/hash).
 */
const APP_NAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

function apiBase(appName: string, baseUrl?: string): string {
	if (baseUrl) {
		if (!baseUrl.toLowerCase().startsWith('https://')) {
			throw new BubbleAPIError(
				'Bubble base URL must use HTTPS so the API token is never sent in plaintext',
				400,
			);
		}
		return baseUrl.replace(/\/+$/, '');
	}
	if (!APP_NAME_PATTERN.test(appName)) {
		throw new BubbleAPIError(
			`Invalid Bubble app name "${appName}": expected a single DNS label (letters, digits, hyphens)`,
			400,
		);
	}
	return `https://${appName}.bubbleapps.io`;
}

/**
 * Issues a request against a Bubble app's Data API / Workflow API.
 *
 * Auth is an admin-level API token (or the app's Private API key, which is
 * equivalent) sent as `Authorization: Bearer <apiKey>` on every request -
 * confirmed from the manual's 401 troubleshooting ("including the right
 * credentials in the authentication, such as the bearer token").
 * https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests.md
 *
 * Both APIs live at `/api/1.1` on the app's own subdomain:
 * - Data API: `GET/POST /obj/{typename}[/{uid}|/bulk]`
 * - Workflow API: `POST /wf/{workflowName}`
 * https://manual.bubble.io/core-resources/api/the-bubble-api/the-workflow-api.md
 */
export async function makeBubbleRequest<T>(
	endpoint: string,
	appName: string,
	apiKey: string,
	options: BubbleRequestOptions = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new BubbleAPIError('Bubble API key is required', 401);
	}
	if (!options.baseUrl && !appName.trim()) {
		throw new BubbleAPIError('Bubble app name is required', 401);
	}

	const { method = 'GET', body, query, mediaType, timeout, baseUrl } = options;

	const config: OpenAPIConfig = {
		BASE: apiBase(appName, baseUrl),
		VERSION: '1.1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {},
		...(timeout !== undefined ? { TIMEOUT: timeout } : {}),
	};

	const hasBody = body !== undefined && method !== 'GET' && method !== 'DELETE';

	// `corsair/http` only substitutes `{api-version}` placeholders - it never
	// appends a version path - so the `/api/1.1` prefix must be part of the
	// path itself. Both the Data API (`/obj/...`) and the Workflow API
	// (`/wf/...`) live under it: `https://{appName}.bubbleapps.io/api/1.1/...`.
	const apiPath = `/api/1.1/${endpoint.replace(/^\/+/, '')}`;

	const requestOptions: ApiRequestOptions = {
		method,
		url: apiPath,
		body: hasBody ? body : undefined,
		mediaType: hasBody
			? (mediaType ?? (isString(body) ? 'text/plain' : 'application/json'))
			: undefined,
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BUBBLE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof BubbleAPIError) throw error;
		if (error instanceof ApiError) {
			throw new BubbleAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new BubbleAPIError(error.message, undefined, { cause: error });
		}
		throw new BubbleAPIError('Unknown error');
	}
}

export { BUBBLE_RATE_LIMIT_CONFIG };
