import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Melo (melo.io) is the brand; its API is published as Stream Estate and
 * served from api.stream.estate (docs.melo.io redirects to docs.stream.estate).
 */
export const MELO_API_BASE = 'https://api.stream.estate';

/**
 * The API answers `Accept: application/json` with a bare array, without the
 * `hydra:member` / `hydra:totalItems` / `hydra:view` envelope that every
 * documented response schema describes. Only `application/ld+json` returns the
 * documented shape, so that is what the client asks for.
 */
const MELO_ACCEPT = 'application/ld+json';

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads Retry-After into the error. Melo documents a 429 but no header.
const MELO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type MeloQueryValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| MeloQueryValue[]
	| { [key: string]: MeloQueryValue };

export type MeloQuery = Record<string, MeloQueryValue>;

export type MeloJson =
	| string
	| number
	| boolean
	| null
	| MeloJson[]
	| { [key: string]: MeloJson | undefined };

export type MeloRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: MeloQuery;
	body?: { [key: string]: MeloJson | undefined };
	/**
	 * Whether sending the same request twice is harmless. A GET is replay safe
	 * unless it acts: `webhook-tester` is a GET that delivers a payload.
	 */
	replaySafe?: boolean;
	/**
	 * The documented answer has no body (204 on delete, a bare 200 on
	 * webhook-tester), so a 2xx body is dropped unread instead of being parsed:
	 * a text body on a call that already succeeded must not read as a failure.
	 */
	bodyless?: boolean;
};

/**
 * Flattens a query into the PHP/Symfony notation the API reads. A top-level
 * array of scalars becomes `key[]=a&key[]=b`, nested arrays use their index
 * (`geoShapes[0][1][0]`), objects use their keys (`order[createdAt]`), and
 * `null` is sent as an empty value, which is how `withCoherentPrice` is
 * switched off.
 */
export function buildMeloQuery(
	query: MeloQuery | undefined,
): Record<string, string | string[]> | undefined {
	if (!query) return undefined;
	const flat: Record<string, string | string[]> = {};

	const isScalar = (value: MeloQueryValue): boolean =>
		value === null || typeof value !== 'object';

	const add = (key: string, value: MeloQueryValue, topLevel: boolean): void => {
		if (value === undefined) return;
		if (value === null) {
			flat[key] = '';
			return;
		}
		if (Array.isArray(value)) {
			if (topLevel && value.every(isScalar)) {
				const items = value
					.filter((item) => item !== undefined && item !== null)
					.map((item) => String(item));
				if (items.length > 0) flat[`${key}[]`] = items;
				return;
			}
			value.forEach((item, index) => {
				add(`${key}[${index}]`, item, false);
			});
			return;
		}
		if (typeof value === 'object') {
			for (const [name, item] of Object.entries(value)) {
				add(`${key}[${name}]`, item, false);
			}
			return;
		}
		flat[key] = String(value);
	};

	for (const [key, value] of Object.entries(query)) {
		add(key, value, true);
	}
	return Object.keys(flat).length > 0 ? flat : undefined;
}

// unknown: an error body is whatever the API or a proxy sent: JSON text,
// plain text or HTML. Callers narrow it with asRecord or typeof.
function readJsonText(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	const text = body.trim();
	if (!(text.startsWith('{') || text.startsWith('['))) return body;
	try {
		return JSON.parse(text);
	} catch {
		return body;
	}
}

function readString(
	// unknown: a decoded JSON object whose fields are read one by one.
	record: Record<string, unknown> | null | undefined,
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

const MAX_MESSAGE_LENGTH = 300;

// unknown: see readJsonText.
export function describeMeloError(
	status: number | undefined,
	// unknown: see readJsonText.
	body: unknown,
	fallback: string,
): string {
	const parsed = readJsonText(body);
	const record = asRecord(parsed);
	let text =
		readString(record, 'hydra:description') ??
		readString(record, 'message') ??
		readString(record, 'detail') ??
		readString(record, 'hydra:title') ??
		readString(record, 'title');
	// 401 for a wrong key is the plain text "Authentication failed". A 404 or
	// 405 is a Symfony HTML page, which is noise rather than a message.
	if (!text && typeof parsed === 'string') {
		const trimmed = parsed.trim();
		if (trimmed && !trimmed.startsWith('<')) {
			text = trimmed.slice(0, MAX_MESSAGE_LENGTH);
		}
	}
	const message = text ?? fallback;
	return status === undefined ? message : `Melo ${status}: ${message}`;
}

export class MeloAPIError extends Error {
	readonly status?: number;
	/** Milliseconds from a Retry-After header, when Melo sent one. */
	readonly retryAfter?: number;
	/** The HTTP method of the failed request. */
	readonly method?: string;
	/** True when repeating the request cannot repeat a side effect. */
	readonly replaySafe: boolean;
	/** True when the request never got an HTTP answer (reset, DNS, timeout). */
	readonly transport: boolean;
	// unknown: error bodies are JSON, plain text or HTML depending on the route.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			retryAfter?: number;
			method?: string;
			replaySafe?: boolean;
			transport?: boolean;
			// unknown: same open error body as the field above.
			body?: unknown;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'MeloAPIError';
		const cause = options.cause instanceof ApiError ? options.cause : undefined;
		this.status = options.status ?? cause?.status;
		this.retryAfter = options.retryAfter ?? cause?.retryAfter;
		this.method = options.method ?? cause?.request.method;
		this.body = options.body ?? cause?.body;
		this.replaySafe = options.replaySafe ?? false;
		this.transport = options.transport ?? false;
	}

	/** True for an HTTP 429. */
	get isRateLimit(): boolean {
		return this.status === 429;
	}
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the result with the endpoint's zod output schema. It is
// undefined when the body is empty, as for the 204 that DELETE /searches/{id}
// answers, and a `bodyless` request accepts any non-JSON body as success.
export async function makeMeloRequest(
	apiKey: string,
	{ method, path, query, body, replaySafe, bodyless }: MeloRequest,
	// unknown: the decoded body is untyped until the output schema parses it.
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: MELO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Accept: MELO_ACCEPT, 'X-API-KEY': apiKey },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: buildMeloQuery(query),
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};
	const safeToReplay = replaySafe ?? method === 'GET';

	// unknown: the raw body, a string for `application/ld+json` because
	// corsair/http only decodes `application/json` itself.
	let raw: unknown;
	try {
		// unknown: see the declaration of raw above.
		raw = await request<unknown>(config, requestOptions, {
			rateLimitConfig: MELO_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new MeloAPIError(
				describeMeloError(error.status, error.body, error.message),
				{
					cause: error,
					body: readJsonText(error.body),
					replaySafe: safeToReplay,
				},
			);
		}
		// DOMException (fetch timeouts) can fail instanceof Error across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new MeloAPIError(error.message, {
				cause: error,
				method,
				replaySafe: safeToReplay,
				transport: true,
			});
		}
		throw new MeloAPIError('Unknown Melo error', {
			method,
			replaySafe: safeToReplay,
			transport: true,
		});
	}

	return bodyless ? undefined : parseMeloBody(raw, method);
}

/** Decodes a 2xx body: JSON text becomes a value and an empty body undefined. */
// unknown: the decoded body is untyped until the output schema parses it.
export function parseMeloBody(raw: unknown, method?: string): unknown {
	if (typeof raw !== 'string') return raw;
	if (raw.trim() === '') return undefined;
	try {
		return JSON.parse(raw);
	} catch (cause) {
		throw new MeloAPIError('Melo answered a 2xx with a body that is not JSON', {
			cause: cause instanceof Error ? cause : undefined,
			method,
		});
	}
}
