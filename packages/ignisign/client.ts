import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class IgnisignAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'IgnisignAPIError';
	}
}

export const IGNISIGN_API_BASE = 'https://api.ignisign.io';

const APP_ENVS = ['DEVELOPMENT', 'STAGING', 'PRODUCTION'] as const;
export type IgnisignAppEnv = (typeof APP_ENVS)[number];

function isAppEnv(value: string): value is IgnisignAppEnv {
	return (APP_ENVS as readonly string[]).includes(value);
}

/**
 * IgniSign API keys carry their application and environment:
 * `skv2_<env>_<appId without the appId_ prefix>_<secret>` (the official SDK
 * reads them the same way). Returns undefined for keys in another format.
 */
export function appScopeFromKey(
	apiKey?: string,
): { appId: string; appEnv: IgnisignAppEnv } | undefined {
	if (!apiKey) return undefined;
	const parts = apiKey.split('_');
	if (parts.length < 4) return undefined;
	const appEnv = (parts[1] ?? '').toUpperCase();
	const appIdSuffix = parts[2];
	if (!appIdSuffix || !isAppEnv(appEnv)) return undefined;
	return { appId: `appId_${appIdSuffix}`, appEnv };
}

/** The application id: the input's override, else the one in the key. */
export function resolveAppId(apiKey: string | undefined, appId?: string) {
	const resolved = appId ?? appScopeFromKey(apiKey)?.appId;
	if (!resolved) {
		throw new IgnisignAPIError(
			'appId is required: the connected API key does not include an application id',
			'MISSING_APP_ID',
		);
	}
	return resolved;
}

/** The environment: the input's override, else the one in the key. */
export function resolveAppEnv(
	apiKey: string | undefined,
	appEnv?: IgnisignAppEnv,
) {
	const resolved = appEnv ?? appScopeFromKey(apiKey)?.appEnv;
	if (!resolved) {
		throw new IgnisignAPIError(
			'appEnv is required: the connected API key does not include an environment',
			'MISSING_APP_ENV',
		);
	}
	return resolved;
}

/** `/v4/applications/:appId/envs/:appEnv` for the key's application. */
export function appEnvPath(
	apiKey: string | undefined,
	scope: { appId?: string; appEnv?: IgnisignAppEnv },
) {
	const appId = resolveAppId(apiKey, scope.appId);
	const appEnv = resolveAppEnv(apiKey, scope.appEnv);
	return `/v4/applications/${encodeURIComponent(appId)}/envs/${encodeURIComponent(appEnv)}`;
}
export const IGNISIGN_TIMEOUT_MS = 30000;
const BINARY_MAX_RETRIES = 2;
const BINARY_MAX_RETRY_DELAY_MS = 30_000;

// Set of field names to sanitize in error outputs and request logs.
const SENSITIVE_FIELD_NAMES = new Set([
	'apikey',
	'token',
	'secret',
	'password',
	'authorization',
	'privatekey',
	'codeverifier',
	'clientsecret',
	'authsecret',
]);

// Signer and user email addresses echoed back in provider errors.
const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// `unknown` because untrusted input is inspected recursively before narrowing.
export function sanitizeData(value: unknown): unknown {
	if (value === null || value === undefined) {
		return value;
	}
	if (typeof value === 'string') {
		return value.replace(EMAIL_PATTERN, '[REDACTED_EMAIL]');
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return value;
	}
	if (Array.isArray(value)) {
		// `unknown` because array elements must be sanitized recursively.
		return value.map((item: unknown) => sanitizeData(item));
	}
	if (typeof value === 'object') {
		const result: Record<string, unknown> = {};
		// `unknown` because object values must be sanitized recursively.
		for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
			const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
			if (SENSITIVE_FIELD_NAMES.has(normalizedKey)) {
				result[key] = '[REDACTED]';
			} else {
				result[key] = sanitizeData(val);
			}
		}
		return result;
	}
	return value;
}

// `unknown` because error bodies returned from the provider are untrusted JSON.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// IgniSign errors are `{ errorCode, message?, context? }` (ignisign-public-models
// `IgnisignError`). `context` is free-form and can echo the signer or document
// that was sent, so only these scalar fields stay in the thrown error. The rest
// covers gateway errors that don't use IgniSign's shape.
const ERROR_BODY_FIELDS = [
	'errorCode',
	'code',
	'statusCode',
	'message',
	'error',
	'detail',
] as const;

/**
 * The string values the caller sent (body, query and multipart fields, nested
 * ones included). IgniSign's error message can repeat a signer's name or phone
 * number from the request, so these are masked in the thrown error. Short
 * numbers are skipped: masking `1` would mangle every number in the message.
 */
export function requestValues(
	// `unknown` because request bodies are endpoint-specific JSON walked here.
	...sources: unknown[]
): string[] {
	const values = new Set<string>();
	// `unknown` because nested request members are walked before narrowing.
	const walk = (value: unknown) => {
		if (typeof value === 'string') {
			if (value.length === 0 || (value.length < 3 && /^\d+$/.test(value))) {
				return;
			}
			values.add(value);
		} else if (Array.isArray(value)) {
			for (const item of value) walk(item);
		} else if (isRecord(value)) {
			for (const item of Object.values(value)) walk(item);
		}
	};
	for (const source of sources) walk(source);
	return [...values].sort((a, b) => b.length - a.length);
}

/**
 * Replaces one sent value in `text`. A value under three characters is matched
 * only where no letter or digit touches it, so `EN` is masked without turning
 * `ENTITY` into `[REDACTED]TITY`.
 */
function maskValue(text: string, value: string): string {
	if (value.length >= 3) return text.split(value).join('[REDACTED]');
	const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	return text.replace(
		new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'gu'),
		'[REDACTED]',
	);
}

/** Emails and the caller's own values masked out of one error string. */
function maskErrorText(text: string, sent: readonly string[]): string {
	return sent.reduce(
		maskValue,
		text.replace(EMAIL_PATTERN, '[REDACTED_EMAIL]'),
	);
}

/**
 * The error body with only the allowlisted scalar fields, emails and the
 * caller's own values (`sent`) masked.
 */
// `unknown` because error bodies returned from the provider are untrusted JSON.
export function safeErrorBody(
	rawBody: unknown,
	sent: readonly string[] = [],
): unknown {
	if (typeof rawBody === 'string') return maskErrorText(rawBody, sent);
	if (!isRecord(rawBody)) return undefined;
	const result: Record<string, string | number | boolean> = {};
	for (const field of ERROR_BODY_FIELDS) {
		const value = rawBody[field];
		if (typeof value === 'string') {
			result[field] = maskErrorText(value, sent);
		} else if (typeof value === 'number' || typeof value === 'boolean') {
			result[field] = value;
		}
	}
	return result;
}

/**
 * Core builds ApiError.message from the raw body (`message`, `error`, `detail`,
 * or the whole body as JSON), so the message is rebuilt from the redacted body.
 */
function buildErrorMessage(
	// `unknown` because the redacted body keeps the provider's untrusted shape.
	sanitizedBody: unknown,
	status: number,
	statusText: string,
): string {
	if (isRecord(sanitizedBody)) {
		for (const field of ['message', 'error', 'detail']) {
			const value = sanitizedBody[field];
			if (typeof value === 'string' && value.length > 0) {
				return value;
			}
		}
	}
	if (typeof sanitizedBody === 'string' && sanitizedBody.length > 0) {
		return `Ignisign request failed with status ${status}: ${sanitizedBody}`;
	}
	let bodyText = '';
	try {
		bodyText = sanitizedBody === undefined ? '' : JSON.stringify(sanitizedBody);
	} catch {
		bodyText = '';
	}
	return `Ignisign request failed with status ${status} ${statusText}${
		bodyText ? `: ${bodyText}` : ''
	}`;
}

function parseRetryAfterMs(headerValue: string | null): number | undefined {
	if (!headerValue) return undefined;
	const seconds = Number.parseInt(headerValue, 10);
	if (Number.isFinite(seconds) && seconds >= 0) {
		return seconds * 1000;
	}
	const dateMs = Date.parse(headerValue);
	if (Number.isFinite(dateMs)) {
		const diff = dateMs - Date.now();
		return diff > 0 ? diff : 0;
	}
	return undefined;
}

/** A multipart `file` field from base64 content. */
export function fileFromBase64(
	base64: string,
	fileName: string,
	mimeType: string,
): File {
	return new File([Buffer.from(base64, 'base64')], fileName, {
		type: mimeType,
	});
}

export type BinaryResponse = {
	kind: 'binary';
	contentType: string;
	base64: string;
	size?: number;
};

export async function makeIgnisignRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies are endpoint-specific JSON validated by Zod schemas before send.
		body?: Record<string, unknown>;
		// Multipart fields for file uploads; sent instead of `body`.
		formData?: Record<string, Blob | string>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;

	// An explicitly empty key means missing credentials.
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('ignisign', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: IGNISIGN_API_BASE,
		VERSION: '4.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// No Content-Type for multipart: fetch sets it with the boundary.
		HEADERS: formData
			? { Accept: 'application/json', ...authHeaders }
			: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					...authHeaders,
				},
	};

	const requestOptions: ApiRequestOptions = formData
		? { method, url: endpoint, formData, query }
		: {
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
		if (error instanceof ApiError) {
			// `unknown` because error.body has no static type from corsair/http.
			const rawBody: unknown = error.body;
			const sanitizedBody = safeErrorBody(
				rawBody,
				requestValues(body, query, formData),
			);
			const errorMessage = buildErrorMessage(
				sanitizedBody,
				error.status,
				error.statusText,
			);
			throw new ApiError(
				{ method, url: endpoint },
				{
					url: `${config.BASE}${endpoint}`,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: sanitizedBody,
				},
				errorMessage,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new IgnisignAPIError('Unknown error');
	}
}

export async function makeIgnisignBinaryRequest(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<BinaryResponse> {
	const { method = 'GET', query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('ignisign', 'api_key');
	}

	const url = new URL(`${IGNISIGN_API_BASE}${endpoint}`);
	if (query) {
		for (const [key, val] of Object.entries(query)) {
			if (val !== undefined) {
				url.searchParams.set(key, String(val));
			}
		}
	}

	const headers: Record<string, string> = {
		Accept: '*/*',
	};
	if (apiKey) {
		headers.Authorization = `Bearer ${apiKey}`;
	}

	for (let attempt = 0; ; attempt += 1) {
		const response = await fetch(url.toString(), {
			method,
			headers,
			signal: AbortSignal.timeout(IGNISIGN_TIMEOUT_MS),
		});

		if (response.ok) {
			const buffer = Buffer.from(await response.arrayBuffer());
			const contentType =
				response.headers.get('content-type') || 'application/octet-stream';

			return {
				kind: 'binary',
				contentType,
				base64: buffer.toString('base64'),
				size: buffer.byteLength,
			};
		}

		const retryAfter =
			response.status === 429
				? parseRetryAfterMs(response.headers.get('retry-after'))
				: undefined;
		// A Retry-After longer than our wait budget: give the 429 back rather than
		// spending the retries before the provider allows another request.
		const canRetry =
			method === 'GET' &&
			response.status === 429 &&
			attempt < BINARY_MAX_RETRIES &&
			(retryAfter === undefined || retryAfter <= BINARY_MAX_RETRY_DELAY_MS);

		// Best-effort body cancellation so stream is released.
		// `unknown` because cancellation rejection has no static type.
		await response.body?.cancel().catch((_e: unknown) => undefined);

		if (canRetry) {
			const fallbackDelay = 250 * 2 ** attempt;
			const delay = retryAfter ?? fallbackDelay;
			await new Promise<void>((resolve) => setTimeout(resolve, delay));
			continue;
		}

		throw new ApiError(
			{ method, url: endpoint },
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: { status: response.status, statusText: response.statusText },
			},
			`Ignisign binary download failed with status ${response.status}`,
			retryAfter !== undefined ? { retryAfter } : undefined,
		);
	}
}
