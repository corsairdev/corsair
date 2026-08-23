import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class SecuritytrailsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SecuritytrailsAPIError';
	}
}

/**
 * SecurityTrails exposes two independent surfaces under one API key:
 *
 * - `v1` — the classic domain/DNS/IP intelligence API and the SQL API.
 * - `v2` — the Attack Surface Intelligence (ASI) project API and the company
 *   endpoints. Its OpenAPI document declares its own server URL, so these are
 *   not reachable by appending a path to the v1 base.
 *
 * Docs: https://docs.securitytrails.com/llms.txt
 */
export const SECURITYTRAILS_API_BASES = {
	v1: 'https://api.securitytrails.com/v1',
	v2: 'https://api.securitytrails.com/v2',
} as const;

export type SecuritytrailsApiVersion = keyof typeof SECURITYTRAILS_API_BASES;

export const REDACTED_API_KEY = '[REDACTED]';

type QueryValue = string | number | boolean | undefined;

/**
 * The paginated v1 endpoints echo the request back under `meta.query`, and that
 * echo includes the caller's `apikey` verbatim — see the documented 200 example
 * for `GET /v1/domain/{hostname}/ssl`. Corsair hands endpoint output to agents,
 * logs and the entity store, so leaving it in place would copy a live
 * credential into every one of those sinks. The caller already holds the key,
 * so replacing it loses nothing.
 */
export function redactEchoedApiKey<T>(payload: T): T {
	if (!payload || typeof payload !== 'object') return payload;

	const meta = (payload as { meta?: unknown }).meta;
	if (!meta || typeof meta !== 'object') return payload;

	const query = (meta as { query?: unknown }).query;
	if (!query || typeof query !== 'object') return payload;

	if (!('apikey' in (query as Record<string, unknown>))) return payload;

	return {
		...(payload as Record<string, unknown>),
		meta: {
			...(meta as Record<string, unknown>),
			query: {
				...(query as Record<string, unknown>),
				apikey: REDACTED_API_KEY,
			},
		},
	} as T;
}

export async function makeSecuritytrailsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue>;
		version?: SecuritytrailsApiVersion;
		schema?: ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, version = 'v1', schema } = options;

	if (!apiKey) {
		throw new SecuritytrailsAPIError('SecurityTrails API key is required');
	}

	const config: OpenAPIConfig = {
		BASE: SECURITYTRAILS_API_BASES[version],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Deliberately no TOKEN: the shared transport turns TOKEN into an
		// `Authorization: Bearer …` header. SecurityTrails authenticates with the
		// `APIKEY` header alone, so sending one would copy the key into a second
		// header the provider never reads.
		HEADERS: {
			'Content-Type': 'application/json',
			APIKEY: apiKey,
		},
	};

	// Drop undefined entries so optional parameters are omitted rather than
	// serialised as the string "undefined".
	const definedQuery = query
		? Object.fromEntries(
				Object.entries(query).filter(([, value]) => value !== undefined),
			)
		: undefined;

	const sendsBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: sendsBody ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query:
			definedQuery && Object.keys(definedQuery).length > 0
				? definedQuery
				: undefined,
	};

	let response: unknown;
	try {
		response = await request<T>(config, requestOptions);
	} catch (error) {
		// ApiError carries the status, body and rate-limit headers that
		// error-handlers.ts matches on; rethrow it untouched.
		if (error instanceof ApiError) {
			throw error;
		}

		if (error instanceof Error) {
			throw new SecuritytrailsAPIError(error.message);
		}

		throw new SecuritytrailsAPIError('Unknown error');
	}

	const safe = redactEchoedApiKey(response);

	if (!schema) {
		return safe as T;
	}

	const parsed = schema.safeParse(safe);
	if (!parsed.success) {
		throw new SecuritytrailsAPIError(
			`SecurityTrails returned a response that did not match the documented schema for ${endpoint}: ${parsed.error.message}`,
		);
	}

	return parsed.data;
}
