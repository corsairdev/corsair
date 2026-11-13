import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FELT_API_BASE = 'https://felt.com/api/v2';

const SENSITIVE_KEY_NAMES = new Set([
	'accesskeyid',
	'apikey',
	'authorization',
	'clientemail',
	'clientid',
	'clientsecret',
	'connectionstring',
	'credential',
	'key',
	'password',
	'passphrase',
	'privatekey',
	'privatekeypassphrase',
	'projectid',
	'sastoken',
	'secret',
	'secretaccesskey',
	'secretkey',
	'serviceaccountjson',
	'sessiontoken',
	'storageaccesskey',
	'token',
]);

function normalizeKeyName(key: string): string {
	return key.toLowerCase().replace(/[-_]/g, '');
}

/**
 * Recursively extracts all string secret values from request bodies or records
 * (e.g. fields named password, secret, token, apiKey, credential, etc., or nested in credential).
 */
// `unknown` because extractSecretStrings traverses arbitrary JSON request payloads to collect secrets.
export function extractSecretStrings(value: unknown): string[] {
	const secrets: string[] = [];

	// `unknown` because recursive walk inspects arbitrary nested structures.
	function walk(val: unknown, insideSensitiveBranch: boolean) {
		if (val === null || val === undefined) {
			return;
		}
		if (typeof val === 'string') {
			if (insideSensitiveBranch && val.trim().length > 0) {
				secrets.push(val);
			}
			return;
		}
		if (Array.isArray(val)) {
			for (const item of val) {
				walk(item, insideSensitiveBranch);
			}
			return;
		}
		if (typeof val === 'object') {
			// `unknown` because record entries can be arbitrary nested values.
			for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
				const isSensitiveKey = SENSITIVE_KEY_NAMES.has(normalizeKeyName(k));
				const shouldTreatAsSecret = insideSensitiveBranch || isSensitiveKey;
				if (typeof v === 'string') {
					if (shouldTreatAsSecret && v.trim().length > 0) {
						secrets.push(v);
					}
				} else {
					walk(v, shouldTreatAsSecret);
				}
			}
		}
	}

	walk(value, false);
	return secrets;
}

/**
 * Redacts tokens, passwords, and sensitive strings from error messages.
 */
export function sanitizeErrorMessage(
	message: string,
	secrets?: string | (string | undefined)[],
): string {
	let sanitized = message
		.replace(/Bearer\s+[^\s"',]+/gi, 'Bearer [REDACTED]')
		.replace(
			/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
			'[REDACTED_JWT]',
		)
		.replace(
			/(["']?(?:api[_-]?key|token|secret|password|authorization|access_token|client_secret)["']?\s*[:=]\s*["']?)[^"',\s}]+/gi,
			'$1[REDACTED]',
		);

	const secretList: string[] = [];
	if (typeof secrets === 'string') {
		if (secrets.length > 0) {
			secretList.push(secrets);
		}
	} else if (Array.isArray(secrets)) {
		for (const s of secrets) {
			if (typeof s === 'string' && s.length > 0) {
				secretList.push(s);
			}
		}
	}

	// Longest secrets first so longer passwords/tokens are redacted before substrings
	secretList.sort((a, b) => b.length - a.length);

	for (const secret of secretList) {
		sanitized = sanitized.split(secret).join('[REDACTED]');
		const encoded = encodeURIComponent(secret);
		if (encoded !== secret) {
			sanitized = sanitized.split(encoded).join('[REDACTED]');
		}
	}

	return sanitized;
}

/**
 * Recursively redacts credentials and secrets from arbitrary objects,
 * error payloads, and request records before propagation.
 * Also sanitizes string values if any extracted secrets are present.
 */
// `unknown` because arbitrary JSON payloads can contain any nested structure.
export function sanitizeSensitiveValues(
	value: unknown,
	secrets?: string | (string | undefined)[],
): unknown {
	if (value === null || value === undefined) {
		return value;
	}
	if (typeof value === 'string') {
		return sanitizeErrorMessage(value, secrets);
	}
	if (typeof value !== 'object') {
		return value;
	}
	if (Array.isArray(value)) {
		// `unknown` because array items are untyped JSON elements.
		return value.map((item: unknown) => sanitizeSensitiveValues(item, secrets));
	}
	// `unknown` because record values are untrusted JSON until traversed.
	const record = value as Record<string, unknown>;
	const result: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(record)) {
		if (SENSITIVE_KEY_NAMES.has(normalizeKeyName(k))) {
			result[k] = '[REDACTED]';
		} else {
			result[k] = sanitizeSensitiveValues(v, secrets);
		}
	}
	return result;
}

// Keep redactSensitiveData for backwards compatibility / export
// `unknown` because arbitrary JSON payloads can contain any nested structure.
export function redactSensitiveData(value: unknown): unknown {
	return sanitizeSensitiveValues(value);
}

/**
 * Sanitizes cause objects so that raw request bodies or credentials are never exposed.
 */
// `unknown` because underlying error causes can be arbitrary error types or rejection values.
function sanitizeCause(
	cause: unknown,
	secrets?: string | (string | undefined)[],
): Error | undefined {
	if (!cause) {
		return undefined;
	}
	if (cause instanceof Error) {
		// `unknown` because inspecting custom error properties requires untyped record access.
		const causeRecord = cause as unknown as Record<string, unknown>;
		const sanitizedCause = new Error(
			sanitizeErrorMessage(cause.message, secrets),
		);
		sanitizedCause.name = cause.name;
		sanitizedCause.stack = cause.stack;
		// `unknown` because augmenting an Error instance with custom metadata requires untyped record access.
		const sanitizedRecord = sanitizedCause as unknown as Record<
			string,
			unknown
		>;

		for (const [k, v] of Object.entries(causeRecord)) {
			if (k === 'request' && v && typeof v === 'object') {
				const req = { ...(v as Record<string, unknown>) };
				if ('body' in req && req.body !== undefined) {
					req.body = sanitizeSensitiveValues(req.body, secrets);
				}
				sanitizedRecord[k] = req;
			} else if (k === 'body') {
				sanitizedRecord[k] = sanitizeSensitiveValues(v, secrets);
			} else if (k !== 'message') {
				sanitizedRecord[k] = v;
			}
		}
		return sanitizedCause;
	}
	return undefined;
}

export class FeltAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` because Felt error responses contain provider JSON payloads that can vary.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: {
			status?: number;
			statusText?: string;
			// `unknown` because provider error JSON is untrusted until narrowed by callers.
			body?: unknown;
			retryAfter?: number;
			// `unknown` because underlying error causes can be arbitrary error types or rejection values.
			cause?: unknown;
		},
	) {
		const sanitizedCause = sanitizeCause(options?.cause);
		super(message, sanitizedCause ? { cause: sanitizedCause } : undefined);
		this.name = 'FeltAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

export async function makeFeltRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because request bodies are validated by Zod schemas before being sent.
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers = {} } = options;

	// Fail fast on empty key: throws AuthMissingError so tenant connect links work as expected.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('felt', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: FELT_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
			...headers,
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
	} catch (error: unknown) {
		const extractedSecrets = [apiKey, ...extractSecretStrings(body)];
		// `unknown` because catch blocks in TypeScript receive an untyped rejection value.
		if (error instanceof ApiError) {
			const sanitizedBody = sanitizeSensitiveValues(
				error.body,
				extractedSecrets,
			);
			const safeMessage = sanitizeErrorMessage(error.message, extractedSecrets);
			const safeStatusText = error.statusText
				? sanitizeErrorMessage(error.statusText, extractedSecrets)
				: undefined;
			throw new FeltAPIError(safeMessage, String(error.status), {
				status: error.status,
				statusText: safeStatusText,
				body: sanitizedBody,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			const safeMessage = sanitizeErrorMessage(error.message, extractedSecrets);
			throw new FeltAPIError(safeMessage);
		}
		throw new FeltAPIError('Unknown error');
	}
}
