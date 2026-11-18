import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

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

export async function makeBuiltWithRequest<S extends z.ZodType>(
	endpoint: string,
	apiKey: string,
	schema: S,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Safe: the body is only serialized with JSON.stringify and never read by field.
		// A narrower type is not practical because no BuiltWith endpoint in this plugin sends a body, so there is no shape to name.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<z.infer<S>> {
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

	// Safe: raw is only passed to parseBody, which narrows it before use.
	// A narrower type is not practical because the transport returns an unvalidated body (string or parsed JSON).
	let raw: unknown;
	try {
		// Safe: same unvalidated transport body as `raw` above.
		// A narrower type is not practical because the response shape differs per endpoint and is only known to the caller.
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
	return schema.parse(parsed);
}

// BuiltWith serves JSON as `text/json`, which core `request` returns as a raw string.
// Safe: the input is only narrowed by typeof and JSON.parse and never read by field here.
// A narrower type is not practical because the response shape differs per endpoint.
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
// Safe: every property is read only after typeof, `in` or Array.isArray narrowing.
// A narrower type is not practical because this runs on an arbitrary provider body before any typing.
function lookupFailure(body: unknown): BuiltWithAPIError | undefined {
	// Some endpoints (e.g. Product API without credits) answer with a bare string message instead of JSON.
	if (typeof body === 'string') return new BuiltWithAPIError(body);
	if (typeof body !== 'object' || body === null || !('Errors' in body)) {
		return undefined;
	}
	const errors = Array.isArray(body.Errors) ? body.Errors : [];
	const results =
		'Results' in body && Array.isArray(body.Results) ? body.Results : [];
	if (errors.length === 0 || results.length > 0) return undefined;
	// Safe: narrowed with typeof and `in` below before any field is read.
	// A narrower type is not practical because elements of the provider's Errors array are unvalidated.
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
