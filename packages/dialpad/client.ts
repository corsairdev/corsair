import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { DialpadOperationDefinition } from './endpoints/definitions';

export const DIALPAD_API_BASES = {
	production: 'https://dialpad.com',
	sandbox: 'https://sandbox.dialpad.com',
} as const;

export const DIALPAD_REPORT_TIMEOUT_MS = 20_000;
export const DIALPAD_REPORT_MAX_BYTES = 25 * 1024 * 1024;
const DIALPAD_REPORT_ERROR_MAX_BYTES = 64 * 1024;

export type DialpadBinaryResponse = {
	kind: 'binary';
	contentType: string;
	base64: string;
	sizeBytes: number;
};

const SENSITIVE_FIELD_NAMES = new Set([
	'accesskeyid',
	'accesstoken',
	'apikey',
	'authorization',
	'clientemail',
	'clientsecret',
	'password',
	'privatekey',
	'projectid',
	'refreshtoken',
	'sastoken',
	'secret',
	'secretaccesskey',
	'secretkey',
	'sessiontoken',
	'token',
	'webhooksecret',
]);

function normalizedFieldName(field: string): string {
	return field.toLowerCase().replace(/[_-]/g, '');
}

// `unknown` is needed because error bodies can contain arbitrary provider JSON.
function sanitizeSensitiveFields(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((entry) => sanitizeSensitiveFields(entry));
	}
	if (typeof value !== 'object' || value === null) return value;

	const sanitized: Record<string, unknown> = {};
	for (const [field, entry] of Object.entries(value)) {
		if (SENSITIVE_FIELD_NAMES.has(normalizedFieldName(field))) {
			sanitized[field] = '[REDACTED]';
		} else {
			sanitized[field] = sanitizeSensitiveFields(entry);
		}
	}
	return sanitized;
}

// `unknown` is needed because caller input may contain nested provider credentials.
function sensitiveValues(value: unknown, fieldName = ''): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => sensitiveValues(entry, fieldName));
	}
	if (typeof value !== 'object' || value === null) {
		return SENSITIVE_FIELD_NAMES.has(normalizedFieldName(fieldName)) &&
			typeof value === 'string' &&
			value.length > 0
			? [value]
			: [];
	}
	return Object.entries(value).flatMap(([field, entry]) =>
		sensitiveValues(entry, field),
	);
}

export function redactSensitiveValues(
	message: string,
	secrets: readonly string[],
): string {
	return secrets.reduce(
		(result, secret) => result.split(secret).join('[REDACTED]'),
		message,
	);
}

// `unknown` is needed because provider error bodies can be arbitrary JSON or plain text.
function sanitizeErrorBody(
	value: unknown,
	secrets: readonly string[],
): unknown {
	const sanitized = sanitizeSensitiveFields(value);
	if (typeof sanitized === 'string') {
		return redactSensitiveValues(sanitized, secrets);
	}
	if (Array.isArray(sanitized)) {
		return sanitized.map((entry) => sanitizeErrorBody(entry, secrets));
	}
	if (typeof sanitized !== 'object' || sanitized === null) return sanitized;
	return Object.fromEntries(
		Object.entries(sanitized).map(([field, entry]) => [
			field,
			sanitizeErrorBody(entry, secrets),
		]),
	);
}

// Unknown input values are narrowed by per-operation Zod schemas before transport.
export type DialpadRequestInput = {
	path?: Record<string, unknown>;
	query?: Record<string, unknown>;
	body?: unknown;
};

export type DialpadClientOptions = {
	apiKey?: string;
	environment?: 'production' | 'sandbox';
};

export const DIALPAD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export function createDialpadConfig(
	options: DialpadClientOptions = {},
): OpenAPIConfig {
	if (options.apiKey !== undefined && options.apiKey.length === 0) {
		throw new AuthMissingError('dialpad', 'api_key');
	}
	return {
		BASE: DIALPAD_API_BASES[options.environment ?? 'production'],
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: options.apiKey,
		HEADERS: { 'Content-Type': 'application/json' },
	};
}

function retryAfterMilliseconds(response: Response): number | undefined {
	const retryAfter = response.headers.get('retry-after');
	if (!retryAfter) return undefined;
	const seconds = Number.parseInt(retryAfter, 10);
	if (Number.isFinite(seconds)) return Math.max(0, seconds) * 1000;
	const retryAt = Date.parse(retryAfter);
	return Number.isNaN(retryAt) ? undefined : Math.max(0, retryAt - Date.now());
}

async function readCappedBody(
	response: Response,
	maxBytes: number,
): Promise<Uint8Array> {
	const reader = response.body?.getReader();
	if (!reader) return new Uint8Array();
	const chunks: Uint8Array[] = [];
	let size = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (!value) continue;
		size += value.byteLength;
		if (size > maxBytes) {
			await reader.cancel().catch(() => undefined);
			throw new Error(`Dialpad report response exceeded ${maxBytes} bytes`);
		}
		chunks.push(value);
	}
	const bytes = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}

// `unknown` is needed because the provider documents JSON error responses without a closed error schema.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function makeScheduledStatsDownload(
	definition: DialpadOperationDefinition,
	input: DialpadRequestInput,
	config: OpenAPIConfig,
	apiKey: string | undefined,
): Promise<DialpadBinaryResponse> {
	const query = input.query ?? {};
	const reportType = query.t;
	const reportDate = query.d;
	if (reportType !== 'user_voiceline' || typeof reportDate !== 'string') {
		throw new Error(
			'Dialpad scheduled stats requires t=user_voiceline and a report date',
		);
	}
	const url = new URL(definition.path, config.BASE);
	url.searchParams.set('t', reportType);
	url.searchParams.set('d', reportDate);
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: definition.path,
		query: { t: reportType, d: reportDate },
	};
	const headers = new Headers({ Accept: '*/*' });
	if (apiKey) headers.set('Authorization', `Bearer ${apiKey}`);
	const response = await fetch(url, {
		method: 'GET',
		headers,
		signal: AbortSignal.timeout(DIALPAD_REPORT_TIMEOUT_MS),
	});

	if (!response.ok) {
		// `unknown` because the provider's JSON error body has no closed documented schema.
		let errorBody: unknown;
		try {
			const errorBytes = await readCappedBody(
				response,
				DIALPAD_REPORT_ERROR_MAX_BYTES,
			);
			const errorText = new TextDecoder().decode(errorBytes);
			if (response.headers.get('content-type')?.includes('json')) {
				try {
					errorBody = JSON.parse(errorText);
				} catch {
					errorBody = errorText;
				}
			} else {
				errorBody = errorText;
			}
		} catch {
			await response.body?.cancel().catch(() => undefined);
		}
		const message =
			isRecord(errorBody) && typeof errorBody.message === 'string'
				? errorBody.message
				: `Dialpad report download failed (HTTP ${response.status})`;
		const secrets = apiKey ? [apiKey] : [];
		const safeBody = sanitizeErrorBody(errorBody, secrets);
		throw new ApiError(
			requestOptions,
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: safeBody,
			},
			redactSensitiveValues(message, secrets),
			{ retryAfter: retryAfterMilliseconds(response) },
		);
	}

	const bytes = await readCappedBody(response, DIALPAD_REPORT_MAX_BYTES);
	return {
		kind: 'binary',
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		base64: Buffer.from(bytes).toString('base64'),
		sizeBytes: bytes.byteLength,
	};
}

async function makeRecordingDownload(
	definition: DialpadOperationDefinition,
	input: DialpadRequestInput,
	apiKey: string | undefined,
	environment: 'production' | 'sandbox' | undefined,
): Promise<DialpadBinaryResponse> {
	if (environment === 'sandbox') {
		throw new Error(
			'Dialpad documents recording download URLs only on the production host',
		);
	}
	const pathValues = input.path ?? {};
	const path = definition.path.replace(
		/\{([^}]+)\}/g,
		(_match, field: string) => {
			const value = pathValues[field];
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new Error(`Missing or invalid Dialpad path parameter: ${field}`);
			}
			return encodeURIComponent(String(value));
		},
	);
	const url = new URL(path, DIALPAD_API_BASES.production);
	const requestOptions: ApiRequestOptions = { method: 'GET', url: path };
	const headers = new Headers({ Accept: 'audio/mpeg' });
	if (apiKey) headers.set('Authorization', `Bearer ${apiKey}`);
	const response = await fetch(url, {
		method: 'GET',
		headers,
		signal: AbortSignal.timeout(DIALPAD_REPORT_TIMEOUT_MS),
	});

	if (!response.ok) {
		// `unknown` because Dialpad documents an error body but not a closed schema for every status.
		let errorBody: unknown;
		try {
			const errorBytes = await readCappedBody(
				response,
				DIALPAD_REPORT_ERROR_MAX_BYTES,
			);
			const errorText = new TextDecoder().decode(errorBytes);
			if (response.headers.get('content-type')?.includes('json')) {
				try {
					errorBody = JSON.parse(errorText);
				} catch {
					errorBody = errorText;
				}
			} else {
				errorBody = errorText;
			}
		} catch {
			await response.body?.cancel().catch(() => undefined);
		}
		const message =
			isRecord(errorBody) && typeof errorBody.message === 'string'
				? errorBody.message
				: `Dialpad recording download failed (HTTP ${response.status})`;
		throw new ApiError(
			requestOptions,
			{
				url: url.toString(),
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body: sanitizeErrorBody(errorBody, apiKey ? [apiKey] : []),
			},
			redactSensitiveValues(message, apiKey ? [apiKey] : []),
			{ retryAfter: retryAfterMilliseconds(response) },
		);
	}

	// A key Dialpad does not accept (or one without recordings_export) is redirected to
	// the HTML login page, which answers 200; that is an auth failure, not audio.
	if (response.headers.get('content-type')?.includes('text/html')) {
		await response.body?.cancel().catch(() => undefined);
		throw new ApiError(
			requestOptions,
			{
				url: url.toString(),
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: undefined,
			},
			'Dialpad returned its login page instead of the recording; the key needs the recordings_export scope',
		);
	}

	const bytes = await readCappedBody(response, DIALPAD_REPORT_MAX_BYTES);
	return {
		kind: 'binary',
		contentType: response.headers.get('content-type') ?? 'audio/mpeg',
		base64: Buffer.from(bytes).toString('base64'),
		sizeBytes: bytes.byteLength,
	};
}

// Unknown return type is necessary because provider response JSON varies by operation until Zod parses it.
export async function makeDialpadRequest(
	definition: DialpadOperationDefinition,
	input: DialpadRequestInput,
	options: DialpadClientOptions = {},
): Promise<unknown> {
	const config = createDialpadConfig(options);
	if (definition.path === '/dl/stats/scheduledstats') {
		return makeScheduledStatsDownload(
			definition,
			input,
			config,
			options.apiKey,
		);
	}
	if (
		definition.path.startsWith('/r/') ||
		definition.path.startsWith('/v/') ||
		definition.path.startsWith('/recording/admincallrecording/')
	) {
		return makeRecordingDownload(
			definition,
			input,
			options.apiKey,
			options.environment,
		);
	}
	const pathValues = input.path ?? {};
	const url = definition.path.replace(
		/\{([^}]+)\}/g,
		(_match, field: string) => {
			const value = pathValues[field];
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new Error(`Missing or invalid Dialpad path parameter: ${field}`);
			}
			return encodeURIComponent(String(value));
		},
	);
	const requestOptions: ApiRequestOptions = {
		method: definition.method,
		url,
		query: input.query,
		body: definition.hasBody ? input.body : undefined,
		mediaType: 'application/json; charset=utf-8',
	};

	// `unknown` because provider responses are untrusted until the operation output schema parses them.
	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: DIALPAD_RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` because rejected values have no static type and need runtime narrowing.
		if (error instanceof ApiError) {
			// Path values can be personal too (`blockednumbers.get` puts a phone
			// number in the path), so the provider's echo of them is redacted.
			const pathSecrets = Object.values(pathValues)
				.filter(
					(value): value is string | number =>
						typeof value === 'string' || typeof value === 'number',
				)
				.map(String)
				.filter((value) => value.length >= 5)
				.flatMap((value) => [value, encodeURIComponent(value)]);
			const secrets = [
				...sensitiveValues(input.body),
				...pathSecrets,
				...(options.apiKey ? [options.apiKey] : []),
			];
			const sanitizedBody = sanitizeErrorBody(error.body, secrets);
			// The request body, query and path can hold customer data (emails,
			// names, phone numbers, message text, contacts.search values), so the
			// propagated error leaves out the body and query, and both URLs carry
			// the route template (`/api/v2/blockednumbers/{number}`) instead of
			// the filled-in path and query string.
			const sanitizedRequest = {
				...error.request,
				url: definition.path,
				body: undefined,
				query: undefined,
			};
			const sanitizedError = new ApiError(
				sanitizedRequest,
				{
					url: `${config.BASE.replace(/\/$/, '')}${definition.path}`,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: sanitizedBody,
				},
				redactSensitiveValues(error.message, secrets),
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
			if (error.stack) {
				sanitizedError.stack = redactSensitiveValues(error.stack, secrets);
			}
			throw sanitizedError;
		}
		if (error instanceof Error) throw error;
		throw new Error('Dialpad request failed with a non-Error value');
	}
}
