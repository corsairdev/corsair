import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GristAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'GristAPIError';
	}
}

export const DEFAULT_GRIST_API_BASE = 'https://docs.getgrist.com/api';

/**
 * Validates and normalizes a Grist site URL (`https://docs.getgrist.com`,
 * `https://<team>.getgrist.com`, or a self-hosted origin, optionally with a
 * path prefix such as `/o/<team>`) into its API base, ending in `/api`.
 *
 * The URL receives the API key as a Bearer token, so it must be HTTPS and may
 * not carry credentials, a query string or a fragment. The base is rebuilt from
 * the parsed origin and path, so the host is exactly what the URL parser sees.
 */
export function normalizeGristBaseUrl(url: string | undefined): string {
	const trimmed = (url ?? '').trim();
	if (!trimmed) {
		throw new Error('[grist] base URL is required');
	}
	let parsed: URL;
	try {
		parsed = new URL(trimmed);
	} catch {
		throw new Error('[grist] base URL must be an absolute https:// URL');
	}
	if (parsed.protocol !== 'https:') {
		throw new Error('[grist] base URL must use https');
	}
	if (!parsed.hostname) {
		throw new Error('[grist] base URL must include a host');
	}
	if (parsed.username || parsed.password) {
		throw new Error('[grist] base URL must not include credentials');
	}
	if (
		parsed.search ||
		parsed.hash ||
		trimmed.includes('?') ||
		trimmed.includes('#')
	) {
		throw new Error('[grist] base URL must not include a query or fragment');
	}
	let path = parsed.pathname;
	// avoid /\/+$/ — CodeQL flags it as ReDoS on long slash runs
	while (path.endsWith('/')) {
		path = path.slice(0, -1);
	}
	if (!path.endsWith('/api')) {
		path = `${path}/api`;
	}
	return `${parsed.origin}${path}`;
}

/**
 * Resolves the API base for a call: the `baseUrl` plugin option when set,
 * otherwise the connected account's stored `base_url` field.
 */
export async function resolveGristBaseUrl(ctx: {
	options?: { baseUrl?: string };
	keys?: { get_base_url?: () => Promise<string | null | undefined> };
}): Promise<string> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return normalizeGristBaseUrl(fromOptions);
	const fromAccount = (await ctx.keys?.get_base_url?.())?.trim();
	if (fromAccount) return normalizeGristBaseUrl(fromAccount);
	throw new AuthMissingError(
		'grist',
		'api_key',
		'[grist] base URL is not set: connect the account with its Grist site URL (for example https://docs.getgrist.com)',
	);
}

const SENSITIVE_KEY_PATTERNS = [
	'apikey',
	'token',
	'secret',
	'password',
	'authorization',
	'key',
	'accesskeyid',
	'secretaccesskey',
	'cookie',
];

// unknown because recursive error bodies and JSON payloads can be arbitrary JSON data
export function redactValue(value: unknown, secrets: string[]): unknown {
	if (typeof value === 'string') {
		let result = value;
		for (const secret of secrets) {
			if (secret && secret.length > 0) {
				result = result.split(secret).join('[REDACTED]');
			}
		}
		return result;
	}
	if (Array.isArray(value)) {
		return value.map((item) => redactValue(item, secrets));
	}
	if (value !== null && typeof value === 'object') {
		const res: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			const normalizedKey = k.toLowerCase().replace(/[_-]/g, '');
			if (
				SENSITIVE_KEY_PATTERNS.some((pattern) =>
					normalizedKey.includes(pattern),
				)
			) {
				res[k] = '[REDACTED]';
			} else {
				res[k] = redactValue(v, secrets);
			}
		}
		return res;
	}
	return value;
}

// unknown because HTTP response payload must be validated by callers via Zod schema before use
export async function makeGristRequest<T = unknown>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown because request body may be an array, object, or primitives
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl } = options;

	if (apiKey !== undefined && apiKey.trim().length === 0) {
		throw new AuthMissingError('grist', 'api_key');
	}
	if (!apiKey) {
		throw new AuthMissingError('grist', 'api_key');
	}

	const resolvedBase = normalizeGristBaseUrl(baseUrl);

	const config: OpenAPIConfig = {
		BASE: resolvedBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Grist reads DELETE bodies too (DELETE /users/{userId} needs a `name` confirmation)
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// In-place credential and sensitive data redaction preserving ApiError identity and stack
		if (error instanceof ApiError) {
			const secrets = [apiKey].filter(Boolean);
			if (error.request && typeof error.request === 'object') {
				// unknown because request payload is arbitrary untrusted object
				const req = error.request as Record<string, unknown>;
				if (req.body !== undefined) {
					req.body = redactValue(req.body, secrets);
				}
				if (req.headers && typeof req.headers === 'object') {
					const headers = req.headers as Record<string, unknown>;
					if (headers.Authorization) {
						headers.Authorization = '[REDACTED]';
					}
					if (headers.authorization) {
						headers.authorization = '[REDACTED]';
					}
				}
			}
			if (error.body !== undefined) {
				Object.assign(error, { body: redactValue(error.body, secrets) });
			}
			if (typeof error.message === 'string' && apiKey) {
				error.message = error.message.split(apiKey).join('[REDACTED]');
			}
			throw error;
		}
		if (error instanceof Error) {
			const sanitizedMessage = apiKey
				? error.message.split(apiKey).join('[REDACTED]')
				: error.message;
			throw new GristAPIError(sanitizedMessage);
		}
		throw new GristAPIError('Unknown error');
	}
}
