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
 * Normalizes a Grist base URL, ensuring no trailing slash and an `/api` suffix
 * for custom subdomains, team sites, or self-hosted instances.
 */
export function normalizeGristBaseUrl(url?: string): string {
	if (!url) return DEFAULT_GRIST_API_BASE;
	let trimmed = url.trim();
	while (trimmed.endsWith('/')) {
		trimmed = trimmed.slice(0, -1);
	}
	if (!trimmed) return DEFAULT_GRIST_API_BASE;
	if (!trimmed.endsWith('/api')) {
		trimmed = `${trimmed}/api`;
	}
	return trimmed;
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

export async function makeGristRequest<T>(
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
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
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
