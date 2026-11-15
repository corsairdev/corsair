import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { HoneyHiveContext } from './index';

export class HoneyHiveAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HoneyHiveAPIError';
	}
}

// HoneyHive splits its API into a Data Plane (traces, datasets, runs, metrics)
// and a Control Plane (workspaces, projects). `api.honeyhive.ai` no longer resolves.
export const HONEYHIVE_API_BASE = 'https://api.dp1.us.honeyhive.ai';
export const HONEYHIVE_CONTROL_PLANE_BASE = 'https://api.cp.us.honeyhive.ai';
export const HONEYHIVE_DEFAULT_TIMEOUT = 20000;

const SENSITIVE_KEY_NAMES = new Set([
	'accesskeyid',
	'secretaccesskey',
	'sessiontoken',
	'privatekey',
	'clientemail',
	'password',
	'authorization',
	'storageaccesskey',
	'sastoken',
	'apikey',
	'token',
	'secret',
]);

function isSensitiveKey(key: string): boolean {
	const normalized = key.toLowerCase().replace(/[_-]/g, '');
	return SENSITIVE_KEY_NAMES.has(normalized);
}

// `unknown` because payload data is arbitrary JSON that must be inspected and sanitized recursively.
export function redactSensitiveData(value: unknown, apiKey?: string): unknown {
	if (value === null || value === undefined) return value;
	if (typeof value === 'string') {
		if (apiKey && apiKey.length > 0 && value.includes(apiKey)) {
			return value.split(apiKey).join('[REDACTED]');
		}
		return value;
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactSensitiveData(item, apiKey));
	}
	if (typeof value === 'object') {
		// `unknown` because record properties are untyped incoming JSON.
		const record = value as Record<string, unknown>;
		const sanitized: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(record)) {
			if (isSensitiveKey(k)) {
				sanitized[k] = '[REDACTED]';
			} else {
				sanitized[k] = redactSensitiveData(v, apiKey);
			}
		}
		return sanitized;
	}
	return value;
}

export function redactApiErrorInPlace(
	error: ApiError,
	apiKey?: string,
): ApiError {
	// In-place credential redaction preserves the original ApiError instance and prototype.
	if (error.body !== undefined && error.body !== null) {
		// `unknown` because error.body has an unconstrained shape that is mutated in-place here.
		const mutableError = error as unknown as { body: unknown };
		mutableError.body = redactSensitiveData(error.body, apiKey);
	}
	if (error.request?.body !== undefined && error.request?.body !== null) {
		// Request bodies carry trace inputs/outputs and dataset rows (customer data),
		// so the copy kept on the error is dropped rather than pattern-redacted.
		// `unknown` because error.request.body has an unconstrained shape that is mutated in-place here.
		const mutableRequest = error.request as unknown as { body: unknown };
		mutableRequest.body = undefined;
	}
	if (error.request?.query !== undefined && error.request?.query !== null) {
		// Query values carry customer data too (event and metric filters with
		// emails or user properties), so the copy kept on the error is dropped.
		// `unknown` because error.request.query is read-only on the class declaration and mutated here.
		const mutableRequest = error.request as unknown as { query: unknown };
		mutableRequest.query = undefined;
	}
	const queryStart = error.url?.indexOf('?') ?? -1;
	if (queryStart !== -1) {
		// `unknown` because error.url is read-only on the class declaration and mutated here.
		const mutableError = error as unknown as { url: string };
		mutableError.url = error.url.slice(0, queryStart);
	}
	if (apiKey && apiKey.length > 0 && error.message.includes(apiKey)) {
		// `unknown` because error.message is read-only on the class declaration and mutated here.
		const mutableError = error as unknown as { message: string };
		mutableError.message = error.message.split(apiKey).join('[REDACTED]');
	}
	return error;
}

export type HoneyHiveRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	baseUrl?: string;
	// `unknown` because bodies are endpoint-specific payloads validated before transport.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | undefined>;
	timeout?: number;
};

export async function makeHoneyHiveRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: HoneyHiveRequestOptions = {},
): Promise<T> {
	const { method = 'GET', baseUrl, body, query, timeout } = options;

	// Fail fast when an empty string key is provided on authenticated endpoints.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('honeyhive', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? HONEYHIVE_API_BASE,
		VERSION: '1.17.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: timeout ?? HONEYHIVE_DEFAULT_TIMEOUT,
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// `unknown` cast because ApiRequestOptions.body accepts arbitrary serializable payload.
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? (body as Record<string, unknown>)
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
		// `unknown` because a caught rejection value has no static type; runtime checks narrow it below.
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw redactApiErrorInPlace(error, apiKey);
		}
		if (error instanceof Error) {
			throw error;
		}
		// `unknown` because a non-Error caught value has no static type.
		throw new HoneyHiveAPIError('Unknown error');
	}
}

/**
 * Validates a user-supplied HoneyHive URL (dedicated or self-hosted data plane).
 * The bearer key is sent to this host, so only absolute https URLs are accepted.
 */
export function normalizeHoneyHiveBaseUrl(raw: string): string {
	let trimmed = raw.trim();
	while (trimmed.endsWith('/')) trimmed = trimmed.slice(0, -1);
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error('[honeyhive] base_url must be an absolute https URL');
	}
	if (parsed.protocol !== 'https:' || !parsed.hostname) {
		throw new Error('[honeyhive] base_url must be an absolute https URL');
	}
	if (parsed.username || parsed.password || parsed.search || parsed.hash) {
		throw new Error(
			'[honeyhive] base_url must not contain credentials, a query or a fragment',
		);
	}
	return trimmed;
}

/** Data plane URL: plugin option, then the account's `base_url`, then HoneyHive's US data plane. */
export async function resolveDataPlaneUrl(
	ctx: HoneyHiveContext,
): Promise<string> {
	const raw = ctx.options?.baseUrl ?? (await ctx.keys?.get_base_url?.());
	return raw ? normalizeHoneyHiveBaseUrl(raw) : HONEYHIVE_API_BASE;
}

/** Control plane URL: plugin option, then HoneyHive's control plane (shared by SaaS and dedicated). */
export function resolveControlPlaneUrl(ctx: HoneyHiveContext): string {
	const raw = ctx.options?.controlPlaneUrl;
	return raw ? normalizeHoneyHiveBaseUrl(raw) : HONEYHIVE_CONTROL_PLANE_BASE;
}

/**
 * Key for the project-scoped data plane routes (`/v1/projects/{project_id}/...`).
 * HoneyHive accepts only data plane fine-grained keys (`hh_fgdp_`) there and answers
 * 404 to a classic project key, so a classic `api_key` is never sent to these routes.
 */
export async function resolveDataPlaneKey(
	ctx: HoneyHiveContext,
): Promise<string> {
	const stored =
		ctx.options?.dataPlaneKey ?? (await ctx.keys?.get_data_plane_api_key?.());
	if (stored) return stored;
	if (ctx.key?.startsWith('hh_fgdp_')) return ctx.key;
	throw new AuthMissingError(
		'honeyhive',
		'api_key',
		'[honeyhive] project-scoped operations need a data plane API key (hh_fgdp_...): set the data_plane_api_key account field',
	);
}

/**
 * Key for the control plane project routes. HoneyHive accepts only control plane
 * fine-grained keys (`hh_fgcp_`) there.
 */
export async function resolveControlPlaneKey(
	ctx: HoneyHiveContext,
): Promise<string> {
	const stored =
		ctx.options?.controlPlaneKey ??
		(await ctx.keys?.get_control_plane_api_key?.());
	if (stored) return stored;
	if (ctx.key?.startsWith('hh_fgcp_')) return ctx.key;
	throw new AuthMissingError(
		'honeyhive',
		'api_key',
		'[honeyhive] project operations need a control plane API key (hh_fgcp_...): set the control_plane_api_key account field',
	);
}
