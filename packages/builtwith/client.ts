import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BuiltWithAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'BuiltWithAPIError';
	}
}

const BUILTWITH_API_BASE = 'https://api.builtwith.com';

export async function makeBuiltWithRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Request bodies are arbitrary JSON per endpoint; they are only serialized with JSON.stringify.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BUILTWITH_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// BuiltWith authenticates with `Authorization: API <key>` — not Bearer.
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `API ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	// `unknown` is safe because raw is only passed to parseBody, which narrows it; the transport returns
	// an unvalidated body (string or parsed JSON), so no more specific type is available.
	let raw: unknown;
	try {
		raw = await request<unknown>(config, requestOptions);
	} catch (error) {
		// ApiError carries status and rate-limit headers for error-handlers.ts.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new BuiltWithAPIError(error.message);
		}
		throw new BuiltWithAPIError('Unknown error');
	}

	const parsed = parseBody(raw);
	const failure = lookupFailure(parsed);
	if (failure) throw failure;
	// Safe: callers validate the parsed JSON with their endpoint's zod output schema before using it.
	// A better type was not practical because T is chosen per call site and the provider JSON shape is only known there.
	return parsed as T;
}

// BuiltWith serves JSON as `text/json`, which core `request` returns as a raw string.
// `unknown` is safe because the input is only narrowed by typeof/JSON.parse and never read by field here;
// no better type exists because the response shape is unverified until the caller's zod schema runs.
function parseBody(raw: unknown): unknown {
	if (typeof raw !== 'string') return raw;
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}

// BuiltWith reports failures (e.g. depleted credits, bad key) as HTTP 200 with
// `{ Errors: [{ Message, Code }] }` and no results.
// `unknown` is safe because every property is read only after typeof/`in`/Array.isArray narrowing;
// no better type exists because this runs before any schema validation, on an arbitrary provider body.
function lookupFailure(body: unknown): BuiltWithAPIError | undefined {
	if (typeof body !== 'object' || body === null || !('Errors' in body)) {
		return undefined;
	}
	const errors = Array.isArray(body.Errors) ? body.Errors : [];
	const results =
		'Results' in body && Array.isArray(body.Results) ? body.Results : [];
	if (errors.length === 0 || results.length > 0) return undefined;
	// Safe: narrowed with typeof/`in` below before any field read; elements of the provider's Errors array are unvalidated.
	const first: unknown = errors[0];
	const message =
		typeof first === 'object' &&
		first !== null &&
		'Message' in first &&
		typeof first.Message === 'string'
			? first.Message
			: 'BuiltWith returned an error';
	const code =
		typeof first === 'object' && first !== null && 'Code' in first
			? String(first.Code)
			: undefined;
	return new BuiltWithAPIError(message, code);
}
