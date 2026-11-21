import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { z } from 'zod';

const JsonValueSchema = z.json();
const DEFAULT_REQUEST_TIMEOUT_MS = 20_000;
const MAX_REQUEST_TIMEOUT_MS = 120_000;
const DEFAULT_MAX_RESPONSE_BYTES = 20 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 100 * 1024 * 1024;
const DEFAULT_MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const MAX_RATE_LIMIT_RETRIES = 3;
const MAX_RETRY_AFTER_MS = 60_000;

export type JsonValue = z.infer<typeof JsonValueSchema>;
export type JsonObject = { [key: string]: JsonValue };
export type QueryValue = JsonValue | undefined;
export type QueryParameterStyle = {
	style?: 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
	explode?: boolean;
};

export type MetabaseBinaryResponse = {
	kind: 'binary';
	contentType: string | null;
	base64: string;
	size: number;
	headers: {
		contentDisposition?: string;
		contentSecurityPolicy?: string;
		cacheControl?: string;
		etag?: string;
	};
};

export const MetabaseBinaryResponseSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string().nullable(),
		base64: z.base64(),
		size: z.number().int().nonnegative(),
		headers: z
			.object({
				contentDisposition: z.string().optional(),
				contentSecurityPolicy: z.string().optional(),
				cacheControl: z.string().optional(),
				etag: z.string().optional(),
			})
			.strict(),
	})
	.strict();

export type MetabaseResponse = JsonValue | MetabaseBinaryResponse;
export type MetabaseMultipartFileInput = {
	filename: string;
	size: number;
	tempfile: Blob;
};

export type MetabaseRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	query?: Record<string, QueryValue>;
	queryParameterStyles?: Record<string, QueryParameterStyle>;
	body?: JsonValue;
	formData?: FormData;
	responseType?: 'binary';
	requestTimeoutMs?: number;
	maxResponseBytes?: number;
	maxUploadBytes?: number;
};

export class MetabaseAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MetabaseAPIError';
	}
}

export function createMetabaseMultipartFileForm(
	file: MetabaseMultipartFileInput,
): FormData {
	if (file.size !== file.tempfile.size) {
		throw new MetabaseAPIError(
			'Metabase file size does not match the binary part',
		);
	}
	const formData = new FormData();
	formData.append('file', file.tempfile, file.filename);
	return formData;
}

export function normalizeMetabaseBaseUrl(baseUrl: string | undefined): URL {
	if (!baseUrl) {
		throw new MetabaseAPIError('Metabase baseUrl must be configured');
	}

	let url: URL;
	try {
		url = new URL(baseUrl);
	} catch {
		throw new MetabaseAPIError('Metabase baseUrl must be an absolute URL');
	}

	const localHttpHosts = new Set(['localhost', '127.0.0.1', '[::1]']);
	const isLocalHttp =
		url.protocol === 'http:' && localHttpHosts.has(url.hostname);
	if (
		(url.protocol !== 'https:' && !isLocalHttp) ||
		url.username.length > 0 ||
		url.password.length > 0 ||
		url.search.length > 0 ||
		url.hash.length > 0 ||
		url.pathname !== '/'
	) {
		throw new MetabaseAPIError(
			'Metabase baseUrl must be an HTTPS instance origin without credentials, path, query, or fragment',
		);
	}

	return url;
}

function appendQuery(
	url: URL,
	query: MetabaseRequestOptions['query'],
	styles: MetabaseRequestOptions['queryParameterStyles'],
): void {
	if (!query) return;
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;
		const { style = 'form', explode = true } = styles?.[key] ?? {};
		if (Array.isArray(value)) {
			if (style === 'spaceDelimited' || style === 'pipeDelimited') {
				const delimiter = style === 'spaceDelimited' ? ' ' : '|';
				url.searchParams.append(key, value.map(queryScalar).join(delimiter));
			} else if (explode) {
				for (const item of value)
					url.searchParams.append(key, queryScalar(item));
			} else {
				url.searchParams.append(key, value.map(queryScalar).join(','));
			}
		} else if (isJsonObject(value)) {
			if (style === 'deepObject') {
				for (const [property, item] of Object.entries(value)) {
					url.searchParams.append(`${key}[${property}]`, queryScalar(item));
				}
			} else if (explode) {
				for (const [property, item] of Object.entries(value)) {
					url.searchParams.append(property, queryScalar(item));
				}
			} else {
				const fields = Object.entries(value).flatMap(([property, item]) => [
					property,
					queryScalar(item),
				]);
				url.searchParams.append(key, fields.join(','));
			}
		} else {
			url.searchParams.append(key, queryScalar(value));
		}
	}
}

function isJsonObject(value: JsonValue): value is JsonObject {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function queryScalar(value: JsonValue): string {
	if (value === null) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

function retryAfterMs(value: string | null, now: number): number | undefined {
	if (!value) return undefined;
	const seconds = Number(value);
	const requestedDelay = Number.isFinite(seconds)
		? seconds * 1000
		: Date.parse(value) - now;
	if (!Number.isFinite(requestedDelay) || requestedDelay < 0) return undefined;
	return Math.min(requestedDelay, MAX_RETRY_AFTER_MS);
}

function wait(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function releaseResponse(response: Response): Promise<void> {
	await response.body?.cancel().catch(() => undefined);
}

async function readBinaryResponse(
	response: Response,
	maxBytes: number,
): Promise<MetabaseBinaryResponse> {
	const reader = response.body?.getReader();
	const chunks: Uint8Array[] = [];
	let size = 0;
	if (reader) {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			size += chunk.value.byteLength;
			if (size > maxBytes) {
				await reader.cancel().catch(() => undefined);
				throw new MetabaseAPIError(
					`Metabase binary response exceeds the ${maxBytes}-byte limit`,
				);
			}
			chunks.push(chunk.value);
		}
	}
	const bytes = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	const headerValues = {
		contentDisposition: response.headers.get('Content-Disposition'),
		contentSecurityPolicy: response.headers.get('Content-Security-Policy'),
		cacheControl: response.headers.get('Cache-Control'),
		etag: response.headers.get('ETag'),
	};
	return MetabaseBinaryResponseSchema.parse({
		kind: 'binary',
		contentType: response.headers.get('Content-Type'),
		base64: Buffer.from(bytes).toString('base64'),
		size,
		headers: Object.fromEntries(
			Object.entries(headerValues).filter(([, value]) => value !== null),
		),
	});
}

function sanitizedApiError(
	method: NonNullable<MetabaseRequestOptions['method']>,
	status: number,
	retryAfter: number | undefined,
): ApiError {
	// The public ApiError retains its request and response. Use a fixed path and empty body so
	// query text, collection data, and caller-supplied values cannot escape through a rejection.
	const safeRequest: ApiRequestOptions = {
		method,
		url: '/api/metabase',
	};
	const safeResponse: ApiResult = {
		url: '/api/metabase',
		ok: false,
		status,
		statusText: `HTTP ${status}`,
		body: {},
	};
	return new ApiError(
		safeRequest,
		safeResponse,
		`Metabase returned HTTP ${status}`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

export async function makeMetabaseRequest(
	endpoint: string,
	apiKey: string,
	baseUrl: string | undefined,
	options: MetabaseRequestOptions = {},
): Promise<MetabaseResponse> {
	if (apiKey.length === 0) throw new AuthMissingError('metabase', 'api_key');
	if (
		!endpoint.startsWith('/api/') ||
		endpoint.includes('?') ||
		endpoint.includes('#') ||
		endpoint.includes('\\') ||
		endpoint.split('/').some((segment) => segment === '.' || segment === '..')
	) {
		throw new MetabaseAPIError(
			'Metabase endpoint must be an internal API path',
		);
	}

	const base = normalizeMetabaseBaseUrl(baseUrl);
	const url = new URL(endpoint, base);
	if (url.origin !== base.origin || !url.pathname.startsWith('/api/')) {
		throw new MetabaseAPIError(
			'Metabase endpoint escaped the configured instance',
		);
	}
	appendQuery(url, options.query, options.queryParameterStyles);

	const method = options.method ?? 'GET';
	const headers = new Headers({
		Accept: options.responseType === 'binary' ? '*/*' : 'application/json',
		'X-API-Key': apiKey,
	});
	if (options.body !== undefined)
		headers.set('Content-Type', 'application/json');
	if (options.body !== undefined && options.formData !== undefined) {
		throw new MetabaseAPIError(
			'Metabase request cannot combine JSON and multipart bodies',
		);
	}
	const timeout = options.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
	const maxResponseBytes =
		options.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES;
	const maxUploadBytes = options.maxUploadBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
	if (
		!Number.isInteger(timeout) ||
		timeout < 1_000 ||
		timeout > MAX_REQUEST_TIMEOUT_MS ||
		!Number.isInteger(maxResponseBytes) ||
		maxResponseBytes < 1 ||
		maxResponseBytes > MAX_RESPONSE_BYTES ||
		!Number.isInteger(maxUploadBytes) ||
		maxUploadBytes < 1 ||
		maxUploadBytes > MAX_UPLOAD_BYTES
	) {
		throw new MetabaseAPIError(
			'Metabase request limits are outside supported bounds',
		);
	}
	if (options.formData) {
		let uploadSize = 0;
		for (const value of options.formData.values()) {
			uploadSize +=
				typeof value === 'string'
					? new TextEncoder().encode(value).byteLength
					: value.size;
		}
		if (uploadSize > maxUploadBytes) {
			throw new MetabaseAPIError(
				`Metabase multipart request exceeds the ${maxUploadBytes}-byte limit`,
			);
		}
	}

	for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt += 1) {
		let response: Response;
		try {
			response = await fetch(url, {
				method,
				headers,
				body:
					options.body === undefined
						? options.formData
						: JSON.stringify(options.body),
				credentials: 'omit',
				redirect: 'manual',
				signal: AbortSignal.timeout(timeout),
			});
		} catch (error: unknown) {
			// `unknown` because fetch rejects with runtime-specific values; never propagate their URL-bearing messages.
			if (error instanceof ApiError || error instanceof MetabaseAPIError)
				throw error;
			if (error instanceof DOMException && error.name === 'TimeoutError') {
				throw new MetabaseAPIError('Metabase request timed out');
			}
			throw new MetabaseAPIError('Metabase request failed');
		}

		const retryAfter = retryAfterMs(
			response.headers.get('Retry-After'),
			Date.now(),
		);
		if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
			await releaseResponse(response);
			await wait(retryAfter ?? 250 * 2 ** attempt);
			continue;
		}
		if (!response.ok) {
			await releaseResponse(response);
			throw sanitizedApiError(method, response.status, retryAfter);
		}
		if (response.status === 204) {
			if (options.responseType === 'binary') {
				return MetabaseBinaryResponseSchema.parse({
					kind: 'binary',
					contentType: response.headers.get('Content-Type'),
					base64: '',
					size: 0,
					headers: {},
				});
			}
			return null;
		}
		if (options.responseType === 'binary') {
			try {
				return await readBinaryResponse(response, maxResponseBytes);
			} catch {
				await releaseResponse(response);
				throw new MetabaseAPIError(
					'Metabase binary response could not be read',
				);
			}
		}

		const contentType = response.headers.get('Content-Type') ?? '';
		if (!contentType.toLowerCase().includes('application/json')) {
			await releaseResponse(response);
			throw new MetabaseAPIError(
				'Metabase returned a non-JSON success response',
			);
		}

		try {
			// `unknown` because decoded provider JSON is untrusted until the endpoint output schema validates it.
			const payload: unknown = await response.json();
			return JsonValueSchema.parse(payload);
		} catch {
			throw new MetabaseAPIError('Metabase returned invalid JSON');
		}
	}

	throw new MetabaseAPIError('Metabase rate-limit retry budget was exhausted');
}
