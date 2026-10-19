import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OctenAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'OctenAPIError';
	}
}

// Matches only corsair's "no DEK on this account" error
// (packages/corsair/core/auth/key-manager.ts: `No DEK found for account
// (tenant: "...", integration: "...")`). No dedicated error class exists for
// this state, so message matching is the only handle available; kept narrow on
// purpose so it can't accidentally swallow an unrelated failure.
const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Safely reads the stored API key from the account key manager.
 *
 * `ctx.keys.get_api_key()` throws (rather than returning null) when the
 * account has no DEK at all — a fully valid state for accounts that only ever
 * configure the key via plugin options and never touch the key manager, and
 * must resolve to "no stored key" rather than abort the call. Anything else
 * thrown (decryption failure, database error, ...) is a real operational
 * problem, not an absent key, and must propagate.
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

export const OCTEN_API_BASE = 'https://api.octen.ai';

export type OctenRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// Bodies are endpoint-specific JSON that the zod input schemas already
	// validated, so the shared transport stays generic over a JSON record.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	/** Values used to fill `{name}` segments in the endpoint path. */
	path?: Record<string, string>;
	/**
	 * Octen's search, extract and embedding endpoints wrap their payload in
	 * `{ code, msg, data, request_id }`; the Answer and generation endpoints
	 * return the resource directly. Defaults to true.
	 */
	envelope?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

/**
 * Validates the shared Octen envelope and returns its `data` payload. Octen can
 * report a business error with HTTP 200 and a non-zero `code`, so an envelope
 * error is thrown as an ApiError whose `status` mirrors `code`; the
 * status-based handlers in error-handlers.ts then classify it (401/403 → auth,
 * 429 → rate limit, 400/422 → bad request) instead of the caller receiving a
 * silently "successful" envelope.
 */
function unwrapOctenEnvelope(
	value: unknown,
	requestOptions: ApiRequestOptions,
): unknown {
	if (!isRecord(value)) {
		throw new OctenAPIError('Octen returned a non-object response body');
	}

	const code = value.code;
	if (typeof code !== 'number') {
		throw new OctenAPIError('Octen response is missing the numeric code field');
	}

	if (code !== 0) {
		const message =
			typeof value.msg === 'string' && value.msg.length > 0
				? value.msg
				: `Octen request failed with code ${code}`;
		throw new ApiError(
			requestOptions,
			{
				url: requestOptions.url,
				ok: false,
				status: code,
				statusText: message,
				body: value,
			},
			message,
		);
	}

	return value.data;
}

/**
 * The transport's own retry loop is disabled (`maxRetries: 0`) so the plugin's
 * error handlers are the single owner of retries (core drives them in
 * `core/endpoints/bind.ts`); this keeps a sustained 429 to one request per
 * handler attempt instead of stacking the transport's default retries on top.
 * `isRateLimitError` also treats 503 as retryable so the transport still
 * attaches `Retry-After` to the `ApiError` for service-unavailable responses,
 * which the 503 handler needs.
 */
const TRANSPORT_RETRY_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
	isRateLimitError: (status) => status === 429 || status === 503,
};

/**
 * Issues one Octen request and returns its JSON body. For enveloped endpoints
 * this is the unwrapped `data` payload. The return type is `unknown` because
 * Octen responses are unbounded wire JSON: the caller narrows them with the
 * endpoint's zod output schema.
 */
export async function makeOctenRequest(
	endpoint: string,
	apiKey: string,
	options: OctenRequestOptions = {},
): Promise<unknown> {
	const { method = 'GET', body, query, path, envelope = true } = options;

	// An empty key means no credentials are configured (the keyBuilder throws
	// AuthMissingError before reaching here; direct callers can still pass an
	// empty key). Fail fast with Corsair's missing-auth error instead of
	// sending a keyless request.
	if (apiKey.length === 0) {
		throw new AuthMissingError('octen', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: OCTEN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Octen authenticates with the key in the `x-api-key` header. TOKEN is
		// deliberately left unset: request.ts would turn it into
		// `Authorization: Bearer <key>`, which Octen only accepts as an
		// alternative to the header used here.
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	// ApiError carries status and retryAfter, which error-handlers.ts needs, so
	// transport errors are propagated untouched.
	const response = await request<unknown>(config, requestOptions, {
		rateLimitConfig: TRANSPORT_RETRY_CONFIG,
	});

	if (!envelope) {
		return response;
	}

	return unwrapOctenEnvelope(response, requestOptions);
}
