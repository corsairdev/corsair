import { asRecord } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { JsonObject, UnknownJson } from './json';

/**
 * One host for every account: unlike the Classic API, the host does not vary by
 * subdomain, and the bearer token identifies the tenant.
 */
export const SIMPLEKPI_API_BASE = 'https://api.simplekpi.com';

/**
 * Two limits apply and a request has to satisfy both: 300 per 60 seconds per
 * client and 600 per 60 seconds per key. Both answer 429 with a Retry-After.
 * Core's request() retries a 429 three times honouring it, so the 429 handler
 * in error-handlers.ts does not retry again.
 */
const SIMPLEKPI_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Failures are RFC 7807 problem details, served as `application/problem+json`:
 *
 * ```json
 * { "type", "title", "status", "detail", "instance", "trace_id" }
 * ```
 *
 * A 400 caused by the request contents adds `errors`, a map from field name to
 * the list of things wrong with it. That map is the part worth showing a
 * caller, so it is exposed directly.
 *
 * https://support.simplekpi.com/ai-core/api/errors
 */
export type SimplekpiProblem = {
	/** The problem type URI, when the API sent one. */
	type?: string;
	/** The generic title, e.g. "One or more validation errors occurred". */
	title?: string;
	/** What went wrong with this request, as opposed to its type. */
	detail?: string;
	/** Field name to messages, from a 400 validation failure. */
	fieldErrors?: Record<string, string[]>;
	/** The server's trace id, for a support request. */
	traceId?: string;
};

/**
 * Errors are core's ApiError, passed through unchanged (plugin rules R8). This
 * reads the problem-details body off one, or returns undefined for anything
 * else.
 */
export function simplekpiProblem(
	// unknown: any thrown value; only core's ApiError carries a problem body.
	error: unknown,
): SimplekpiProblem | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const record = asRecord(error.body as UnknownJson);
	if (!record) return undefined;
	return {
		type: readString(record, 'type'),
		title: readString(record, 'title'),
		detail: readString(record, 'detail'),
		fieldErrors: readFieldErrors(record.errors),
		traceId: readString(record, 'trace_id'),
	};
}

// The record is an untyped problem body; read one field at a time.
function readString(
	record: JsonObject | null | undefined, // unknown: untyped problem body
	key: string,
): string | undefined {
	const value = record?.[key];
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** A 400 `errors` object maps a field name to a list of messages. */
function readFieldErrors(
	value: UnknownJson, // unknown: `errors` maps fields to message arrays
): Record<string, string[]> | undefined {
	const record = asRecord(value);
	if (!record) return undefined;

	const out: Record<string, string[]> = {};
	for (const [field, messages] of Object.entries(record)) {
		if (typeof messages === 'string') {
			out[field] = [messages];
		} else if (Array.isArray(messages)) {
			const strings = messages.filter(
				(entry): entry is string => typeof entry === 'string',
			);
			if (strings.length > 0) out[field] = strings;
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export type SimplekpiQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SimplekpiRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: SimplekpiQuery;
	/** A JSON body, serialized with the JSON media type. */
	body?: UnknownJson; // unknown: the endpoint's input schema validated it
};

/** Encodes one path segment. */
export function segment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Callers parse the body with the endpoint's zod output schema. It is undefined
// for the 204 every delete answers. unknown: the shape differs per route, which
// is what the endpoint's output schema is for.
export async function makeSimplekpiRequest(
	apiKey: string,
	{ method, path, query, body }: SimplekpiRequest,
): Promise<UnknownJson> {
	const config: OpenAPIConfig = {
		BASE: SIMPLEKPI_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// A literal header, because the token is not a Bearer value the core
			// client can build from a resolver: sending it this way keeps the
			// exact `Bearer <key>` shape the API documents.
			Authorization: `Bearer ${apiKey}`,
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	// Core's ApiError goes through unchanged (plugin rules R8). The key travels
	// in the config's headers, which ApiError does not keep.
	// unknown: see the note on makeSimplekpiRequest.
	return request<UnknownJson>(config, requestOptions, {
		rateLimitConfig: SIMPLEKPI_RATE_LIMIT_CONFIG,
	});
}
