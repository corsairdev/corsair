import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * One host serves all three APIs, each under its own path prefix and an
 * environment segment: `/edit/v1`, `/ingest/v1`, `/serve/v1` for production
 * and `/edit/stage`, `/ingest/stage`, `/serve/stage` for the sandbox. Every
 * account has one key for each; a key only works on its own environment. On
 * the other one Shotstack answers 403 "Invalid or disabled API key ..."
 * (checked live 11-28, all three services), the same answer as for a wrong key.
 */
export const SHOTSTACK_API_BASE = 'https://api.shotstack.io';

export const SHOTSTACK_ENVIRONMENTS = ['v1', 'stage'] as const;

/** `v1` is production; `stage` is the free, watermarked sandbox. */
export type ShotstackEnvironment = (typeof SHOTSTACK_ENVIRONMENTS)[number];

export type ShotstackService = 'edit' | 'ingest' | 'serve';

export type ShotstackRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	service: ShotstackService;
	/** Path under the service prefix, e.g. `/render`. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: the endpoint's input schema has already validated the body.
	body?: unknown;
	headers?: Record<string, string | undefined>;
	/**
	 * The route with caller-controlled segments as placeholders
	 * (`/probe/{url}`), used in place of `path` in error metadata: a probed
	 * URL can carry its own access token.
	 */
	errorPath?: string;
};

/**
 * What the error handlers need to know about a failed request. They ride
 * beside the error in a WeakMap, so the thrown value stays core's `ApiError`
 * (or the plain transport error) with nothing added to it.
 */
export type ShotstackRequestFacts = {
	method: string;
	/** The request carried an `Idempotency-Key`, so a generate create may be replayed. */
	idempotent: boolean;
	/** No response arrived: a reset, a DNS failure, a timeout or an abort. */
	transport: boolean;
};

const requestFacts = new WeakMap<Error, ShotstackRequestFacts>();

export function shotstackRequestFacts(
	error: Error,
): ShotstackRequestFacts | undefined {
	return requestFacts.get(error);
}

function remember<E extends Error>(error: E, facts: ShotstackRequestFacts): E {
	requestFacts.set(error, facts);
	return error;
}

function readString(
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/**
 * Message and code from Shotstack's three error bodies:
 *
 * - json:api (all services on auth and ingest/serve errors): `{ errors: [{ status, title, detail }] }`
 * - edit envelope (404 class): `{ success: false, message, response }`
 * - generate bare: `{ error, code?, available? }`
 */
export function describeShotstackError(
	status: number | undefined,
	// unknown: error bodies are one of the three shapes above, or proxy text.
	body: unknown,
	fallback: string,
): { message: string; code?: string } {
	const record = asRecord(body);
	const firstError = asRecord(
		Array.isArray(record?.errors) ? record.errors[0] : undefined,
	);
	const detail = readString(firstError, 'detail');
	const code =
		readString(record, 'code') ?? readString(firstError, 'code') ?? undefined;
	const editMessage = readString(record, 'message');
	const generateError = readString(record, 'error');
	const parts = [status].filter((part) => part !== undefined).join(' ');
	const text =
		detail ??
		generateError ??
		editMessage ??
		readString(firstError, 'title') ??
		fallback;
	return { message: parts ? `Shotstack ${parts}: ${text}` : text, code };
}

/**
 * Shotstack refused the key itself: 401, or the 403 "Invalid or disabled API
 * key" it sends for a wrong key and for a key of the other environment. A
 * plan-gated 403 (AiCapabilityNotIncluded) is not this.
 */
export function isKeyRefused(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	if (error.status === 401) return true;
	return (
		error.status === 403 && /invalid or disabled api key/i.test(error.message)
	);
}

/** A 429 that reports an exhausted generation quota: no retry can fix it. */
export function isQuotaExhausted(
	// unknown: the provider's error body.
	body: unknown,
): boolean {
	const { message } = describeShotstackError(undefined, body, '');
	return /quota/i.test(message);
}

// The error handlers own 429 retries (RATE_LIMIT_ERROR, three of them,
// honouring Retry-After), so core makes one attempt and only reads
// Retry-After into the error. Core's own 429 loop would also retry the
// quota 429, which only fails again. Shotstack documents a fixed 60-second
// window per key; the 429 body carries the code `rate_limit_error`.
const SHOTSTACK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
	isRateLimitError: (status, body) =>
		status === 429 ||
		describeShotstackError(status, body, '').code === 'rate_limit_error',
};

/**
 * A path parameter that is a full URL (`media.probe`) or a client-supplied
 * identifier, encoded for one path segment. Core's default encodeURI keeps
 * `/` and `..`, so an id like `../templates` would reach another route.
 */
export function segment(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Rebuilds core's ApiError without the provider's error body: Shotstack
 * echoes request content (timeline text, merge values, URLs) in some
 * validation errors. The message and code stay; status and retryAfter are
 * unchanged, so the 429 handler and core still read them (R8).
 */
function sanitizedApiError(
	error: ApiError,
	req: ShotstackRequest,
	environment: ShotstackEnvironment,
): ApiError {
	// Core's message for an unmapped status is the whole serialized body, so
	// the fallback is the status text, never error.message.
	const { message, code } = describeShotstackError(
		error.status,
		error.body,
		error.statusText || 'request failed',
	);
	const path = `/${req.service}/${environment}${req.errorPath ?? req.path}`;
	return new ApiError(
		{ method: req.method, url: path },
		{
			url: `${SHOTSTACK_API_BASE}${path}`,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: code ? { message, code } : { message },
		},
		message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

/**
 * One request to one environment. Resolves with the parsed JSON body
 * (undefined for the 204 answers of the three deletes). Rejects with core's
 * `ApiError` when Shotstack answered, and with the transport error when no
 * response arrived; `shotstackRequestFacts(error)` tells them apart.
 */
// unknown: callers parse the raw body with the endpoint's zod output schema.
export async function makeShotstackRequest(
	apiKey: string,
	req: ShotstackRequest,
	environment: ShotstackEnvironment = 'v1',
): Promise<unknown> {
	const { method, service, path, query, body, headers } = req;
	const config: OpenAPIConfig = {
		BASE: SHOTSTACK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'x-api-key': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${service}/${environment}${path}`,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
		headers: headers
			? (Object.fromEntries(
					Object.entries(headers).filter(([, value]) => value !== undefined),
				) as Record<string, string>)
			: undefined,
	};

	const idempotent = Boolean(headers?.['Idempotency-Key']);
	try {
		// unknown: the body type is each endpoint's own; the schema parses it.
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: SHOTSTACK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw remember(sanitizedApiError(error, req, environment), {
				method,
				idempotent,
				transport: false,
			});
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			// A DOMException carries name and message like an Error.
			const plain = error as Error;
			throw remember(plain, { method, idempotent, transport: true });
		}
		throw remember(new Error('Shotstack request failed with no response'), {
			method,
			idempotent,
			transport: true,
		});
	}
}

// ── environment ────────────────────────────────────────────────────────────

const NO_DEK_ERROR_PATTERN = /no dek found/i;

/**
 * Reads a stored value. `ctx.keys.get_*()` throws, rather than returning
 * null, when the account has no DEK at all: a valid state for an account that
 * passes the key in plugin options. Anything else thrown propagates.
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
 * `v1` (also `production`, `prod`, `live`) or `stage` (also `sandbox`,
 * `staging`); undefined when unset or blank. Anything else throws, so a typo
 * never sends a production key's calls to the wrong place silently.
 */
export function parseShotstackEnvironment(
	raw: string | null | undefined,
): ShotstackEnvironment | undefined {
	const value = (raw ?? '').trim().toLowerCase();
	if (!value) return undefined;
	if (['v1', 'production', 'prod', 'live'].includes(value)) return 'v1';
	if (['stage', 'sandbox', 'staging'].includes(value)) return 'stage';
	throw new Error(
		'[shotstack] environment must be v1 (production) or stage (sandbox)',
	);
}

/** What a call needs from the endpoint or webhook context. */
export type ShotstackCallContext = {
	key: string;
	options?: { environment?: ShotstackEnvironment | string };
	keys?: {
		get_environment?: () => Promise<string | null | undefined>;
	};
};

/** The plugin option first, then the account's stored `environment`. */
export async function configuredEnvironment(
	ctx: ShotstackCallContext,
): Promise<ShotstackEnvironment | undefined> {
	const fromOptions = parseShotstackEnvironment(ctx.options?.environment);
	if (fromOptions) return fromOptions;
	const getter = ctx.keys?.get_environment;
	return parseShotstackEnvironment(
		getter ? await tryGetStoredKey(() => getter()) : undefined,
	);
}

// Which environment a key answered on, so a key is probed once per process
// rather than on every call. In memory only, like the key in ctx.key; never
// logged or persisted.
const environmentOf = new Map<string, ShotstackEnvironment>();

/** Forget learned environments (tests). */
export function resetShotstackEnvironmentCache(): void {
	environmentOf.clear();
}

/**
 * Sends a request to the account's environment. With none configured, the
 * environment the key answered on before is used; failing that, production
 * first and the sandbox when production refuses the key (isKeyRefused).
 * Shotstack refuses the key before running anything, so the second try
 * cannot repeat a write.
 */
export async function shotstackRequest(
	ctx: ShotstackCallContext,
	req: ShotstackRequest,
): Promise<unknown> {
	const configured = await configuredEnvironment(ctx);
	if (configured) return makeShotstackRequest(ctx.key, req, configured);

	const id = ctx.key;
	const known = environmentOf.get(id);
	if (known) {
		try {
			return await makeShotstackRequest(ctx.key, req, known);
		} catch (error) {
			if (!isKeyRefused(error)) throw error;
			// The key stopped working there (rotated, or a stale guess):
			// forget it and look again below.
			environmentOf.delete(id);
		}
	}

	let lastError: unknown;
	for (const environment of SHOTSTACK_ENVIRONMENTS) {
		try {
			const result = await makeShotstackRequest(ctx.key, req, environment);
			// Only a success proves the key belongs here; a 503 or a 404
			// says nothing about the key.
			environmentOf.set(id, environment);
			return result;
		} catch (error) {
			lastError = error;
			if (isKeyRefused(error)) continue;
			throw error;
		}
	}
	throw lastError;
}

// ── json:api unwraps (ingest and serve) ────────────────────────────────────
// A present envelope with a missing resource must fail loudly, not read as
// an empty page. On the Edit API the output schemas pin `success: literal(true)`,
// so a 2xx body that still says `success: false` fails the parse.
// unknown: the unwraps run before the output schema parse, so the raw 2xx
// body has no static type yet; each function narrows it and throws on the
// shapes the json:api envelope cannot produce.

function malformed(message: string): Error {
	return new Error(`Shotstack: ${message}`);
}

/** The `attributes` of a json:api single-resource response. */
export function attributesOf(raw: unknown): Record<string, unknown> {
	const data = asRecord(asRecord(raw)?.data);
	const attributes = asRecord(data?.attributes);
	if (!attributes) {
		throw malformed('the response has no json:api resource attributes');
	}
	return attributes;
}

/** The `attributes` of each resource in a json:api list response. */
export function attributesList(raw: unknown): Record<string, unknown>[] {
	const data = asRecord(raw)?.data;
	if (!Array.isArray(data)) {
		throw malformed('the response has no json:api resource array');
	}
	return data.map((item) => {
		const attributes = asRecord(asRecord(item)?.attributes);
		if (!attributes) {
			throw malformed('the response has no json:api resource attributes');
		}
		return attributes;
	});
}

/** The `{ id, type }` of a queued json:api resource, which has no attributes yet. */
export function queuedResourceId(raw: unknown): Record<string, unknown> {
	const data = asRecord(asRecord(raw)?.data);
	if (!data || typeof data.id !== 'string') {
		throw malformed('the queued response has no resource id');
	}
	return { id: data.id, type: data.type };
}
