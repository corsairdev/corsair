import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { FilesDownloadOutput, JsonObject } from './endpoints/types';
import {
	DEFAULT_TRANSFER_TIMEOUT_MS,
	MAX_BINARY_DOWNLOAD_BYTES,
	MAX_BINARY_DOWNLOAD_SIZE_LABEL,
} from './limits';

export class ConversiontoolsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ConversiontoolsAPIError';
	}
}

export class ConversiontoolsDownloadError extends Error {
	constructor(
		public readonly status?: number,
		message?: string,
	) {
		super(
			message ??
				(status === undefined
					? 'Conversion Tools download request failed'
					: `Conversion Tools download failed with HTTP ${status}`),
		);
		this.name = 'ConversiontoolsDownloadError';
	}
}

/**
 * POST /files answers with a JSON body labelled `text/html`, which the shared
 * request parser returns as a string. Parse it here; anything that is not JSON
 * is an error rather than a made-up success.
 */
export function parseJsonTextResponse<T>(response: T | string): T | JsonObject {
	if (typeof response !== 'string') return response;
	try {
		return JSON.parse(response) as JsonObject;
	} catch {
		throw new ConversiontoolsAPIError(
			'Conversion Tools returned a response that is not JSON',
		);
	}
}

const UPLOAD_SESSION_PATH_PREFIX = '/v1/upload-sessions/';
const REDACTED_UPLOAD_SESSION_PATH = `${UPLOAD_SESSION_PATH_PREFIX}[REDACTED]`;

function redactUploadSessionText(
	value: string,
	sessionUrl: string,
	sessionIds: readonly string[],
): string {
	let redacted = value.replaceAll(sessionUrl, '[REDACTED_UPLOAD_SESSION_URL]');
	for (const sessionId of sessionIds) {
		if (sessionId) redacted = redacted.replaceAll(sessionId, '[REDACTED]');
	}
	return redacted;
}

// `unknown` because provider error bodies and request values are arbitrary
// JSON; this helper narrows strings/arrays/objects as it walks them.
function redactUploadSessionValue(
	value: unknown,
	sessionUrl: string,
	sessionIds: readonly string[],
): unknown {
	if (typeof value === 'string') {
		return redactUploadSessionText(value, sessionUrl, sessionIds);
	}
	if (Array.isArray(value)) {
		return value.map((entry) =>
			redactUploadSessionValue(entry, sessionUrl, sessionIds),
		);
	}
	if (typeof value === 'object' && value !== null) {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [
				redactUploadSessionText(key, sessionUrl, sessionIds),
				redactUploadSessionValue(entry, sessionUrl, sessionIds),
			]),
		);
	}
	return value;
}

// `unknown` because a rejected value has no static type; instanceof narrows it
// to ApiError before any error metadata is read.
function sanitizeUploadSessionError(
	error: unknown,
	endpoint: string,
	baseUrl: string,
): Error {
	const sessionId = endpoint.slice(UPLOAD_SESSION_PATH_PREFIX.length);
	let decodedSessionId = sessionId;
	try {
		decodedSessionId = decodeURIComponent(sessionId);
	} catch {
		// Keep the encoded path segment if it is not valid percent-encoding.
	}
	const sessionIds = [...new Set([sessionId, decodedSessionId])];
	const sessionUrl = new URL(endpoint, `${baseUrl}/`).toString();
	const safeUrl = `${baseUrl}${REDACTED_UPLOAD_SESSION_PATH}`;

	if (error instanceof ApiError) {
		return new ApiError(
			{ ...error.request, url: REDACTED_UPLOAD_SESSION_PATH },
			{
				url: safeUrl,
				ok: false,
				status: error.status,
				statusText: redactUploadSessionText(
					error.statusText,
					sessionUrl,
					sessionIds,
				),
				body: redactUploadSessionValue(error.body, sessionUrl, sessionIds),
			},
			redactUploadSessionText(error.message, sessionUrl, sessionIds),
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
	}

	if (error instanceof Error) {
		const sanitized = new Error(
			redactUploadSessionText(error.message, sessionUrl, sessionIds),
		);
		sanitized.name = redactUploadSessionText(
			error.name,
			sessionUrl,
			sessionIds,
		);
		return sanitized;
	}

	return new ConversiontoolsAPIError('Unexpected non-Error failure');
}

/**
 * REST base URL, documented as `https://api.conversiontools.io/v1/`
 * (https://conversiontools.io/api-documentation, "API URL", and
 * https://conversiontools.io/llms-full.txt §2).
 */
export const CONVERSIONTOOLS_API_BASE = 'https://api.conversiontools.io/v1';

export type ConversiontoolsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// Endpoint JSON is parsed with zod before it reaches this wire boundary.
	body?: JsonObject | Blob;
	// POST /files is multipart with one documented Blob field named `file`.
	formData?: Record<string, Blob | string | undefined>;
	query?: Record<string, string | number | boolean | undefined>;
	// The large-file session URL has the same documented API origin but a
	// response-provided path, so callers may override the base origin safely.
	baseUrl?: string;
	timeoutMs?: number;
};

const NO_RETRY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

/**
 * Performs a request against the Conversion Tools REST API.
 *
 * Auth: `Authorization: Bearer <API Token>` on every request except the
 * endpoints the reference marks as token-free (`/conversions`,
 * `/conversions/{type}`, the upload-session PUT, and the temporary-link
 * download). Callers signal
 * "send no credentials" by passing `undefined`; an empty string means a key was
 * expected but is not configured, and fails fast.
 */
export async function makeConversiontoolsRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: ConversiontoolsRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		formData,
		query,
		baseUrl = CONVERSIONTOOLS_API_BASE,
		timeoutMs = 20_000,
	} = options;
	const isUploadSessionPut =
		method === 'PUT' && endpoint.startsWith(UPLOAD_SESSION_PATH_PREFIX);

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('conversiontools', 'api_key');
	}

	const isRawBody = body instanceof Blob;
	const isMultipart = formData !== undefined;
	const isJsonBody = !isMultipart && !isRawBody && body !== undefined;

	const headers: Record<string, string> = {};
	if (apiKey !== undefined && apiKey.length > 0) {
		headers.Authorization = `Bearer ${apiKey}`;
	}
	// FormData and a Blob body set their own Content-Type (the multipart
	// boundary, or the Blob's media type), so only JSON requests declare it.
	if (!isMultipart && !isRawBody) {
		headers['Content-Type'] = 'application/json';
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		// The OpenAPI document's own version (info.version: 1.0.0).
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		TIMEOUT: timeoutMs,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isJsonBody || isRawBody ? body : undefined,
		formData: isMultipart ? formData : undefined,
		mediaType: isJsonBody ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_RETRY_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (isUploadSessionPut) {
			throw sanitizeUploadSessionError(error, endpoint, baseUrl);
		}
		// ApiError carries the status and retryAfter the error handlers route
		// on, so it is rethrown untouched.
		if (error instanceof Error) {
			throw error;
		}
		throw new ConversiontoolsAPIError('Unexpected non-Error failure');
	}
}

async function makeConversiontoolsBinaryDownloadRequest(
	path: string,
	apiKey?: string,
	timeoutMs = DEFAULT_TRANSFER_TIMEOUT_MS,
): Promise<FilesDownloadOutput> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('conversiontools', 'api_key');
	}

	const headers: Record<string, string> = {
		Accept: 'application/octet-stream',
	};
	if (apiKey !== undefined) {
		headers.Authorization = `Bearer ${apiKey}`;
	}

	let response: Response;
	try {
		response = await fetch(`${CONVERSIONTOOLS_API_BASE}${path}`, {
			method: 'GET',
			headers,
			credentials: 'omit',
			signal: AbortSignal.timeout(timeoutMs),
		});
	} catch {
		// Do not forward fetch errors: they can include the secret temporary URL.
		throw new ConversiontoolsDownloadError();
	}

	if (!response.ok) {
		await response.body?.cancel().catch(() => undefined);
		throw new ConversiontoolsDownloadError(response.status);
	}

	const contentLength = response.headers.get('content-length');
	if (
		contentLength !== null &&
		/^\d+$/.test(contentLength) &&
		Number(contentLength) > MAX_BINARY_DOWNLOAD_BYTES
	) {
		await response.body?.cancel().catch(() => undefined);
		throw new ConversiontoolsDownloadError(
			413,
			`Conversion Tools download exceeds the ${MAX_BINARY_DOWNLOAD_SIZE_LABEL} base64 response limit. Create a temporary download link and download larger files directly.`,
		);
	}

	const reader = response.body?.getReader();
	let fileBytes: Buffer;
	if (!reader) {
		fileBytes = Buffer.alloc(0);
	} else {
		const chunks: Uint8Array[] = [];
		let size = 0;
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				size += value.byteLength;
				if (size > MAX_BINARY_DOWNLOAD_BYTES) {
					await reader.cancel().catch(() => undefined);
					throw new ConversiontoolsDownloadError(
						413,
						`Conversion Tools download exceeds the ${MAX_BINARY_DOWNLOAD_SIZE_LABEL} base64 response limit. Create a temporary download link and download larger files directly.`,
					);
				}
				chunks.push(value);
			}
			fileBytes = Buffer.concat(chunks, size);
			chunks.length = 0;
		} catch (error) {
			await reader.cancel().catch(() => undefined);
			if (error instanceof ConversiontoolsDownloadError) throw error;
			throw new ConversiontoolsDownloadError();
		}
	}

	return {
		contentBase64: fileBytes.toString('base64'),
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		contentDisposition:
			response.headers.get('content-disposition') ?? undefined,
		size: fileBytes.byteLength,
	};
}

export function makeConversiontoolsDownloadByIdRequest(
	fileId: string,
	apiKey: string,
	timeoutMs = DEFAULT_TRANSFER_TIMEOUT_MS,
): Promise<FilesDownloadOutput> {
	return makeConversiontoolsBinaryDownloadRequest(
		`/files/${encodeURIComponent(fileId)}`,
		apiKey,
		timeoutMs,
	);
}

export function makeConversiontoolsDownloadFromLinkRequest(
	downloadId: string,
	timeoutMs = DEFAULT_TRANSFER_TIMEOUT_MS,
): Promise<FilesDownloadOutput> {
	return makeConversiontoolsBinaryDownloadRequest(
		`/files/${encodeURIComponent(downloadId)}/download`,
		undefined,
		timeoutMs,
	);
}
