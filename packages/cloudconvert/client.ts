import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Base URL of the CloudConvert API v2, documented at
 * https://cloudconvert.com/docs/getting-started/introduction#base-url-and-region-endpoints
 */
export const CLOUDCONVERT_API_BASE = 'https://api.cloudconvert.com/v2';

/** Base URL for CloudConvert's synchronous job and task endpoints. */
export const CLOUDCONVERT_SYNC_API_BASE =
	'https://sync.api.cloudconvert.com/v2';

/** Default per-request timeout for CloudConvert's synchronous endpoints. */
export const DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS = 5 * 60_000;

/** Synchronous requests remain bounded so callers can prefer async jobs for long work. */
export const MAX_CLOUDCONVERT_SYNC_TIMEOUT_MS = 10 * 60_000;

/**
 * A CloudConvert failure the shared client could not represent.
 *
 * `corsair/http` throws `ApiError` for every HTTP status it maps, so this only
 * wraps a rejection that was not an `Error` at all.
 */
export class CloudConvertAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CloudConvertAPIError';
	}
}

export type CloudConvertQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type CloudConvertRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	host?: 'sync';
	timeoutMs?: number;
	query?: CloudConvertQuery;
	/** Built from schema-validated inputs and server-side tenant credentials. */
	body?: object;
};

/**
 * Sends one request to CloudConvert.
 *
 * Auth is `Authorization: Bearer <API key>`, documented at
 * https://cloudconvert.com/docs/getting-started/introduction#authentication
 * (not set through `TOKEN`, so the exact header is asserted in tests).
 *
 * An `undefined` key sends no credentials for the discovery routes; an
 * explicitly empty key is missing credentials and fails fast with Corsair's
 * `AuthMissingError`.
 */
export async function makeCloudConvertRequest<T>(
	apiKey: string | undefined,
	{ method, path, host, timeoutMs, query, body }: CloudConvertRequest,
): Promise<T> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('cloudconvert', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: host === 'sync' ? CLOUDCONVERT_SYNC_API_BASE : CLOUDCONVERT_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT:
			host === 'sync'
				? (timeoutMs ?? DEFAULT_CLOUDCONVERT_SYNC_TIMEOUT_MS)
				: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const requestBody = redactCredentialFields(error.request.body);
			if (requestBody.changed) {
				const sanitizedError = new ApiError(
					{ ...error.request, body: requestBody.value },
					{
						url: error.url,
						ok: false,
						status: error.status,
						statusText: error.statusText,
						body: error.body,
					},
					error.message,
					{
						retryAfter: error.retryAfter,
						rateLimitReset: error.rateLimitReset,
						rateLimitRemaining: error.rateLimitRemaining,
						rateLimitLimit: error.rateLimitLimit,
					},
				);
				sanitizedError.stack = error.stack;
				throw sanitizedError;
			}
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new CloudConvertAPIError('Unknown error');
	}
}

// Credential names that may appear in an echoed request body: stored export
// credentials, plus inline task credentials CloudConvert accepts for generic
// tasks (Azure storage keys/SAS tokens, SFTP passwords, custom headers).
const SENSITIVE_REQUEST_FIELDS = new Set([
	'accesskeyid',
	'authorization',
	'clientemail',
	'password',
	'privatekey',
	'projectid',
	'sastoken',
	'secretaccesskey',
	'sessiontoken',
	'storageaccesskey',
]);

function normalizedFieldName(field: string): string {
	return field.replace(/[_-]/g, '').toLowerCase();
}

// `unknown` because provider/request JSON is untrusted until runtime-checked.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because request bodies contain arbitrary nested JSON; this helper
// walks and narrows values recursively without assuming a concrete shape.
function redactCredentialFields(value: unknown): {
	value: unknown;
	changed: boolean;
} {
	if (Array.isArray(value)) {
		const items = value.map(redactCredentialFields);
		if (!items.some((item) => item.changed)) return { value, changed: false };
		return { value: items.map((item) => item.value), changed: true };
	}
	if (!isRecord(value)) return { value, changed: false };

	let changed = false;
	const entries = Object.entries(value).map(([field, fieldValue]) => {
		if (SENSITIVE_REQUEST_FIELDS.has(normalizedFieldName(field))) {
			changed = true;
			return [field, '[REDACTED]'] as const;
		}
		const redacted = redactCredentialFields(fieldValue);
		changed ||= redacted.changed;
		return [field, redacted.value] as const;
	});
	return changed
		? { value: Object.fromEntries(entries), changed }
		: { value, changed };
}
