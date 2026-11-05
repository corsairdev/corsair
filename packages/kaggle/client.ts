import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class KaggleAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'KaggleAPIError';
	}
}

/** Official Kaggle REST base used by the public API / CLI. */
const KAGGLE_API_BASE = 'https://www.kaggle.com/api/v1';
const KAGGLE_REQUEST_TIMEOUT_MS = 30_000;
const KAGGLE_MAX_ERROR_BODY_BYTES = 4096;
export const KAGGLE_MAX_BINARY_PAYLOAD_BYTES = 100 * 1024 * 1024;

const SIGNED_OUTPUT_HOSTS = new Set([
	'storage.googleapis.com',
	'kaggleusercontent.com',
	'www.kaggle.com',
	'kaggle.com',
]);

export function kagglePath(...segments: string[]): string {
	return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`;
}

/**
 * Parse credentials for HTTP Basic auth.
 * Accepts `username:key` or a bare API token (Bearer) when no colon is present
 * and no username override is supplied.
 */
export function parseKaggleCredentials(
	credential: string,
	usernameOverride?: string,
):
	| { kind: 'basic'; username: string; key: string }
	| { kind: 'bearer'; token: string } {
	if (usernameOverride) {
		return { kind: 'basic', username: usernameOverride, key: credential };
	}
	const colon = credential.indexOf(':');
	if (colon > 0) {
		return {
			kind: 'basic',
			username: credential.slice(0, colon),
			key: credential.slice(colon + 1),
		};
	}
	// Newer Kaggle tokens (KAGGLE_API_TOKEN) are used as Bearer secrets.
	return { kind: 'bearer', token: credential };
}

function authHeaders(
	credential: string,
	usernameOverride?: string,
): Record<string, string> {
	const parsed = parseKaggleCredentials(credential, usernameOverride);
	if (parsed.kind === 'basic') {
		const token = Buffer.from(
			`${parsed.username}:${parsed.key}`,
			'utf8',
		).toString('base64');
		return { Authorization: `Basic ${token}` };
	}
	return { Authorization: `Bearer ${parsed.token}` };
}

function isAllowedSignedOutputHost(hostname: string): boolean {
	const host = hostname.toLowerCase();
	if (SIGNED_OUTPUT_HOSTS.has(host)) return true;
	return (
		host.endsWith('.storage.googleapis.com') ||
		host.endsWith('.kaggleusercontent.com')
	);
}

async function readCappedText(
	res: Response,
	maxBytes: number,
): Promise<string> {
	if (!res.body) return '';
	const chunks: Buffer[] = [];
	let totalBytes = 0;
	const reader = res.body.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = Buffer.from(value);
			if (totalBytes + chunk.length > maxBytes) {
				chunks.push(chunk.subarray(0, maxBytes - totalBytes));
				totalBytes = maxBytes;
				await reader.cancel();
				break;
			}
			chunks.push(chunk);
			totalBytes += chunk.length;
		}
	} finally {
		reader.releaseLock();
	}
	return Buffer.concat(chunks, totalBytes).toString('utf8');
}

export type KaggleQueryValue = string | number | boolean | undefined;

/**
 * JSON request against the Kaggle API.
 * Auth: HTTP Basic (`username:key`) or Bearer for newer API tokens.
 */
export async function makeKaggleRequest<T>(
	endpoint: string,
	credential: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// body shape varies per endpoint and is validated by callers via typed Zod input schemas
		body?: Record<string, unknown>;
		query?: Record<string, KaggleQueryValue>;
		username?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, username } = options;

	const config: OpenAPIConfig = {
		BASE: KAGGLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders(credential, username),
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
		// Preserve ApiError so error-handlers can read status / Retry-After.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new KaggleAPIError(error.message);
		}
		throw new KaggleAPIError('Unknown Kaggle API error');
	}
}

/**
 * Binary/download request (zip/csv/file bytes). Returns base64 so agents do not
 * depend on host filesystem paths.
 */
export async function makeKaggleBinaryRequest(
	endpoint: string,
	credential: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, KaggleQueryValue>;
		username?: string;
	} = {},
): Promise<{
	contentType: string;
	size: number;
	dataBase64: string;
	fileName?: string;
}> {
	const { method = 'GET', query, username } = options;
	const url = new URL(
		endpoint.startsWith('http')
			? endpoint
			: `${KAGGLE_API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
	);
	if (query) {
		for (const [k, v] of Object.entries(query)) {
			if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
		}
	}

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			headers: { ...authHeaders(credential, username), Accept: '*/*' },
			signal: AbortSignal.timeout(KAGGLE_REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		throw new KaggleAPIError(
			error instanceof Error ? error.message : 'Kaggle binary request failed',
		);
	}

	if (!res.ok) {
		const text = await readCappedText(res, KAGGLE_MAX_ERROR_BODY_BYTES);
		// Forward rate-limit headers so error-handlers RATE_LIMIT_ERROR can back off.
		const retryAfterHeader = res.headers.get('retry-after');
		let retryAfterMs: number | undefined;
		if (retryAfterHeader) {
			const asNum = Number(retryAfterHeader);
			retryAfterMs = Number.isFinite(asNum)
				? asNum * 1000
				: Date.parse(retryAfterHeader) - Date.now();
			if (retryAfterMs !== undefined && !Number.isFinite(retryAfterMs))
				retryAfterMs = undefined;
			if (retryAfterMs !== undefined && !(retryAfterMs >= 0)) {
				retryAfterMs = undefined;
			}
		}
		const rateLimitReset = res.headers.get('x-ratelimit-reset');
		const rateLimitRemaining = res.headers.get('x-ratelimit-remaining');
		const rateLimitLimit = res.headers.get('x-ratelimit-limit');
		throw new ApiError(
			{ method, url: endpoint },
			{
				// Store only the path (strip query params) so API secrets that may
				// appear in query strings never leak into the error object.
				url: endpoint,
				ok: false,
				status: res.status,
				statusText: res.statusText,
				body: text,
			},
			`Kaggle download failed: ${res.status} ${res.statusText}`,
			{
				retryAfter: retryAfterMs,
				rateLimitReset: rateLimitReset ? Number(rateLimitReset) : undefined,
				rateLimitRemaining: rateLimitRemaining
					? Number(rateLimitRemaining)
					: undefined,
				rateLimitLimit: rateLimitLimit ? Number(rateLimitLimit) : undefined,
			},
		);
	}

	const contentLength = Number(res.headers.get('content-length'));
	if (
		Number.isFinite(contentLength) &&
		contentLength > KAGGLE_MAX_BINARY_PAYLOAD_BYTES
	) {
		throw new KaggleAPIError(
			`Kaggle binary payload exceeds ${KAGGLE_MAX_BINARY_PAYLOAD_BYTES} bytes`,
		);
	}
	if (!res.body) {
		throw new KaggleAPIError('Kaggle binary response has no body');
	}
	const chunks: Buffer[] = [];
	let totalBytes = 0;
	const reader = res.body.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = Buffer.from(value);
			totalBytes += chunk.length;
			if (totalBytes > KAGGLE_MAX_BINARY_PAYLOAD_BYTES) {
				await reader.cancel();
				throw new KaggleAPIError(
					`Kaggle binary payload exceeds ${KAGGLE_MAX_BINARY_PAYLOAD_BYTES} bytes`,
				);
			}
			chunks.push(chunk);
		}
	} catch (error) {
		if (error instanceof KaggleAPIError) throw error;
		throw new KaggleAPIError(
			error instanceof Error
				? error.message
				: 'Kaggle binary stream read failed',
		);
	} finally {
		reader.releaseLock();
	}
	const buf = Buffer.concat(chunks, totalBytes);
	const contentType =
		res.headers.get('content-type') ?? 'application/octet-stream';
	const disposition = res.headers.get('content-disposition') ?? '';
	const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(disposition);
	const rawFileName = match?.[1]?.replace(/"/g, '');
	let fileName: string | undefined;
	if (rawFileName) {
		try {
			fileName = decodeURIComponent(rawFileName);
		} catch {
			fileName = rawFileName;
		}
	}

	return {
		contentType,
		size: buf.length,
		dataBase64: buf.toString('base64'),
		fileName,
	};
}

export async function downloadKaggleOutputFile(
	url: string,
	fileName?: string,
): Promise<{
	contentType: string;
	size: number;
	dataBase64: string;
	fileName?: string;
}> {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		throw new KaggleAPIError('Unsupported signed output url');
	}
	if (
		parsed.protocol !== 'https:' ||
		!isAllowedSignedOutputHost(parsed.hostname)
	) {
		throw new KaggleAPIError('Unsupported signed output url');
	}

	let res: Response;
	try {
		res = await fetch(parsed, {
			method: 'GET',
			headers: { Accept: '*/*' },
			signal: AbortSignal.timeout(KAGGLE_REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		throw new KaggleAPIError(
			error instanceof Error ? error.message : 'Kaggle output download failed',
		);
	}

	if (!res.ok) {
		await readCappedText(res, KAGGLE_MAX_ERROR_BODY_BYTES);
		throw new KaggleAPIError(
			`Kaggle output download failed: ${res.status} ${res.statusText}`,
		);
	}

	const contentLength = Number(res.headers.get('content-length'));
	if (
		Number.isFinite(contentLength) &&
		contentLength > KAGGLE_MAX_BINARY_PAYLOAD_BYTES
	) {
		throw new KaggleAPIError(
			`Kaggle binary payload exceeds ${KAGGLE_MAX_BINARY_PAYLOAD_BYTES} bytes`,
		);
	}
	if (!res.body) {
		throw new KaggleAPIError('Kaggle binary response has no body');
	}
	const chunks: Buffer[] = [];
	let totalBytes = 0;
	const reader = res.body.getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = Buffer.from(value);
			totalBytes += chunk.length;
			if (totalBytes > KAGGLE_MAX_BINARY_PAYLOAD_BYTES) {
				await reader.cancel();
				throw new KaggleAPIError(
					`Kaggle binary payload exceeds ${KAGGLE_MAX_BINARY_PAYLOAD_BYTES} bytes`,
				);
			}
			chunks.push(chunk);
		}
	} catch (error) {
		if (error instanceof KaggleAPIError) throw error;
		throw new KaggleAPIError(
			error instanceof Error
				? error.message
				: 'Kaggle binary stream read failed',
		);
	} finally {
		reader.releaseLock();
	}
	const buf = Buffer.concat(chunks, totalBytes);
	const contentType =
		res.headers.get('content-type') ?? 'application/octet-stream';

	return {
		contentType,
		size: buf.length,
		dataBase64: buf.toString('base64'),
		fileName,
	};
}
