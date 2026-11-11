import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';
import type { FilesDownloadOutput, JsonObject } from './endpoints/types';

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
	constructor(public readonly status?: number) {
		super(
			status === undefined
				? 'Conversion Tools download request failed'
				: `Conversion Tools download failed with HTTP ${status}`,
		);
		this.name = 'ConversiontoolsDownloadError';
	}
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
			signal: AbortSignal.timeout(20_000),
		});
	} catch {
		// Do not forward fetch errors: they can include the secret temporary URL.
		throw new ConversiontoolsDownloadError();
	}

	if (!response.ok) {
		await response.body?.cancel().catch(() => undefined);
		throw new ConversiontoolsDownloadError(response.status);
	}

	let bytes: ArrayBuffer;
	try {
		bytes = await response.arrayBuffer();
	} catch {
		throw new ConversiontoolsDownloadError();
	}

	const fileBytes = Buffer.from(bytes);
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
): Promise<FilesDownloadOutput> {
	return makeConversiontoolsBinaryDownloadRequest(
		`/files/${encodeURIComponent(fileId)}`,
		apiKey,
	);
}

export function makeConversiontoolsDownloadFromLinkRequest(
	downloadId: string,
): Promise<FilesDownloadOutput> {
	return makeConversiontoolsBinaryDownloadRequest(
		`/files/${encodeURIComponent(downloadId)}/download`,
	);
}
