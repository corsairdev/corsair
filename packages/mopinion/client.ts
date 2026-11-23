import { createHmac } from 'node:crypto';
import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MOPINION_API_BASE = 'https://api.mopinion.com';

/** Mopinion serves 2.5.5 by default; this pins the documented v3 API. */
const MOPINION_VERSION_HEADER = '3.0.0';

/**
 * Mopinion signs every request with an `x-auth-token`:
 * `BASE64(PUBLIC_KEY : HMAC_SHA256_hex(RESOURCE_URI | JSON_BODY))`, keyed
 * with the signature token. RESOURCE_URI excludes query parameters, and the
 * JSON_BODY is the exact request body string (empty for GETs). Verified
 * against the docs' worked example.
 */
export function mopinionAuthToken(
	publicKey: string,
	signatureToken: string,
	resourceUri: string,
	jsonBody: string,
): string {
	const hmac = createHmac('sha256', signatureToken)
		.update(`${resourceUri}|${jsonBody}`)
		.digest('hex');
	return Buffer.from(`${publicKey}:${hmac}`).toString('base64');
}

/** The Mopinion credentials the account stores, resolved per call. */
export type MopinionCallContext = {
	key: string;
	options: {
		publicKey?: string;
		signatureToken?: string;
	};
	keys: {
		get_public_key: () => Promise<string | null | undefined>;
		get_signature_token: () => Promise<string | null | undefined>;
	};
};

/**
 * Resolves the signing credentials. The inline options win over the stored
 * account fields; the keyBuilder has already thrown AuthMissingError when
 * neither side has them, so this only guards the composite's shape.
 */
export async function resolveSigningCredentials(
	ctx: MopinionCallContext,
): Promise<{ publicKey: string; signatureToken: string }> {
	// Inline options win and short-circuit the stored-credential reads.
	if (ctx.options.publicKey && ctx.options.signatureToken) {
		return {
			publicKey: ctx.options.publicKey,
			signatureToken: ctx.options.signatureToken,
		};
	}
	const [storedPublicKey, storedSignatureToken] = await Promise.all([
		ctx.keys.get_public_key(),
		ctx.keys.get_signature_token(),
	]);
	const publicKey = ctx.options.publicKey ?? storedPublicKey;
	const signatureToken = ctx.options.signatureToken ?? storedSignatureToken;
	if (!publicKey || !signatureToken) {
		throw new Error(
			'Mopinion public_key and signature_token are both required: pass publicKey/signatureToken in the plugin options or save them on the account.',
		);
	}
	return { publicKey, signatureToken };
}

/**
 * Mopinion errors follow RFC 7807 (application/problem+json):
 * `{status, error_code, title, type, details?}`. Probed 401 for unsigned
 * requests: error_code 18, "The credentials you provided are not valid".
 */
export class MopinionAPIError extends Error {
	readonly status?: number;
	/** The RFC 7807 `error_code`, e.g. 18 for invalid credentials. */
	readonly errorCode?: number;
	/** The RFC 7807 `type` URL. */
	readonly type?: string;
	/** Field details from a validation failure, when present. */
	// unknown: the RFC 7807 details list is provider-defined.
	readonly details?: unknown;
	/** Milliseconds from a Retry-After header, when one was sent. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when the failed request can be sent again after a 5xx. */
	readonly replayable?: boolean;
	// unknown: the problem body is untyped until narrowed below.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: same open problem body as the field above.
			body?: unknown;
			retryAfter?: number;
			method?: string;
			replayable?: boolean;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MopinionAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.body = options.body ?? cause?.body;
		// A gateway can serve the problem document as raw text; parse it so
		// the typed fields survive.
		const parsedBody =
			typeof this.body === 'string'
				? asRecord(JSON.parse(this.body))
				: asRecord(this.body);
		const problem = parsedBody;
		this.errorCode =
			typeof problem?.error_code === 'number' ? problem.error_code : undefined;
		this.type = typeof problem?.type === 'string' ? problem.type : undefined;
		this.details = problem?.details;
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

export function describeMopinionError(
	status: number | undefined,
	body: unknown,
	fallback: string,
): string {
	const record = asRecord(body);
	const text =
		readString(record, 'title') ?? readString(record, 'message') ?? fallback;
	const errorCode = record?.error_code;
	const label = [status, typeof errorCode === 'number' ? errorCode : undefined]
		.filter((part) => part !== undefined)
		.join(' ');
	return label ? `Mopinion ${label}: ${text}` : `Mopinion: ${text}`;
}

export type MopinionQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type MopinionRequest = {
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
	/** The path with a leading slash, WITHOUT query parameters. */
	path: string;
	query?: MopinionQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	/** True when a 5xx or a network drop can replay the request: reads only. */
	replayable?: boolean;
};

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Mopinion documents no rate limit.
const MOPINION_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeMopinionRequest(
	ctx: MopinionCallContext,
	{ method, path, query, body, replayable }: MopinionRequest,
): Promise<unknown> {
	const { publicKey, signatureToken } = await resolveSigningCredentials(ctx);
	// The signature covers the body string exactly as sent, so the client
	// serializes once and passes the string through verbatim.
	// JSON.stringify is deterministic for the zod-parsed objects the
	// endpoints build, so signing this string covers the exact bytes
	// corsair/http sends for the application/json body.
	const jsonBody = body === undefined ? '' : JSON.stringify(body);
	const authToken = mopinionAuthToken(
		publicKey,
		signatureToken,
		path,
		jsonBody,
	);

	const config: OpenAPIConfig = {
		BASE: MOPINION_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-auth-token': authToken,
			// Mopinion serves an older API unless the version is pinned.
			version: MOPINION_VERSION_HEADER,
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
			rateLimitConfig: MOPINION_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MopinionAPIError(
				describeMopinionError(error.status, error.body, error.message),
				{ cause: error, replayable },
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MopinionAPIError(error.message, { method, replayable });
		}
		throw new MopinionAPIError('Unknown Mopinion error', {
			method,
			replayable,
		});
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}
