import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type DigicertApiFamily =
	| 'certcentral'
	| 'accountManager'
	| 'privateCA'
	| 'reportLibrary'
	| 'trustLifecycle'
	| 'contentTrust';
export type DigiCertOneRegion = 'us' | 'jp' | 'ch' | 'nl' | 'au' | 'in';

export const DIGICERT_ONE_HOSTS: Record<DigiCertOneRegion, string> = {
	us: 'one.digicert.com',
	jp: 'one.digicert.co.jp',
	ch: 'one.ch.digicert.com',
	nl: 'one.nl.digicert.com',
	au: 'one.au.digicert.com',
	in: 'one.digicert.co.in',
};

export class DigicertAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DigicertAPIError';
	}
}

export const CERTCENTRAL_BASES = {
	us: 'https://www.digicert.com/services/v2',
	eu: 'https://certcentral.digicert.eu/services/v2',
} as const;
export const REPORT_LIBRARY_BASES = {
	us: 'https://api.digicert.com/reports/v1',
	eu: 'https://report.digicert.eu/reports/v1',
} as const;
export const DIGICERT_ONE_BASE = 'https://one.digicert.com';
export const CONTENT_TRUST_BASE = `${DIGICERT_ONE_BASE}/documentmanager`;

export async function makeDigicertRequest<T>(
	family: DigicertApiFamily,
	endpoint: string,
	apiKey: string | undefined,
	options: {
		region?: 'us' | 'eu';
		reportRegion?: 'us' | 'eu';
		digicertOneRegion?: DigiCertOneRegion;
		public?: boolean;
		authScheme?: 'api_key' | 'oauth_2';
		method?: ApiRequestOptions['method'];
		path?: ApiRequestOptions['path'];
		query?: ApiRequestOptions['query'];
		headers?: ApiRequestOptions['headers'];
		cookies?: ApiRequestOptions['cookies'];
		body?: ApiRequestOptions['body'];
		formData?: ApiRequestOptions['formData'];
		mediaType?: ApiRequestOptions['mediaType'];
		/** Return the raw response bytes instead of decoding a JSON/text body. */
		binary?: boolean;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		region = 'us',
		reportRegion = 'us',
		digicertOneRegion = 'us',
		authScheme = 'api_key',
		path,
		query,
		headers: extraHeaders,
		cookies,
		body,
		formData,
		mediaType,
		binary = false,
	} = options;
	const publicRoute = options.public === true;
	if (!publicRoute && apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('digicert', 'api_key');
	}
	if (!publicRoute && apiKey === undefined) {
		throw new AuthMissingError('digicert', 'api_key');
	}

	const oneBase = `https://${DIGICERT_ONE_HOSTS[digicertOneRegion]}`;
	const base =
		family === 'certcentral'
			? CERTCENTRAL_BASES[region]
			: family === 'reportLibrary'
				? REPORT_LIBRARY_BASES[reportRegion]
				: family === 'contentTrust'
					? `${oneBase}/documentmanager`
					: oneBase;
	const authHeader =
		authScheme === 'oauth_2'
			? 'Authorization'
			: family === 'certcentral' || family === 'reportLibrary'
				? 'X-DC-DEVKEY'
				: 'x-api-key';
	const defaultHeaders: Record<string, string> = {
		...(formData || binary ? {} : { 'Content-Type': 'application/json' }),
		...(apiKey && !publicRoute
			? {
					[authHeader]: authScheme === 'oauth_2' ? `Bearer ${apiKey}` : apiKey,
				}
			: {}),
	};
	if (binary) {
		return requestBinary<T>({
			base,
			endpoint,
			method,
			path,
			query,
			headers: { ...defaultHeaders, ...stringHeaders(extraHeaders) },
			body,
			mediaType,
		});
	}
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: defaultHeaders,
		ENCODE_PATH: encodePathSegment,
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		headers: extraHeaders,
		cookies,
		body,
		formData,
		mediaType,
	};
	return request<T>(config, requestOptions);
}

const MAX_BINARY_BYTES = 32 * 1024 * 1024;
const MAX_BINARY_RATE_LIMIT_RETRIES = 3;
const MAX_BINARY_BACKOFF_DELAY_MS = 30_000;

function stringHeaders(
	headers: ApiRequestOptions['headers'],
): Record<string, string> {
	const normalized: Record<string, string> = {};
	if (!headers) return normalized;
	for (const [key, value] of Object.entries(headers)) {
		if (value === undefined || value === null) continue;
		normalized[key] = String(value);
	}
	return normalized;
}

// The shared transport decodes every non-JSON response with `response.text()`,
// which corrupts binary downloads (for example certificate DER bytes). Binary
// operations therefore bypass it and read the response stream as bounded chunks.
async function requestBinary<T>(options: {
	base: string;
	endpoint: string;
	method: ApiRequestOptions['method'];
	path?: ApiRequestOptions['path'];
	query?: ApiRequestOptions['query'];
	headers: Record<string, string>;
	body?: ApiRequestOptions['body'];
	mediaType?: ApiRequestOptions['mediaType'];
}): Promise<T> {
	const url = buildUrl(
		options.base,
		options.endpoint,
		options.path,
		options.query,
	);
	const headers = new Headers(options.headers);
	if (options.mediaType) headers.set('Content-Type', options.mediaType);
	if (!headers.has('Accept')) headers.set('Accept', '*/*');
	let response: Response;
	for (let attempt = 0; ; attempt++) {
		response = await fetch(url, {
			method: options.method,
			headers,
			body: requestBody(options.body, options.mediaType),
			signal: AbortSignal.timeout(20_000),
		});
		if (
			options.method !== 'GET' ||
			response.status !== 429 ||
			attempt >= MAX_BINARY_RATE_LIMIT_RETRIES
		) {
			break;
		}
		const retryAfter = retryAfterMs(response);
		// Best-effort cancellation releases the rate-limited response before retrying.
		await response.body?.cancel().catch(() => undefined);
		const backoff = 1000 * 2 ** attempt;
		// Preserve an explicit provider Retry-After; only cap our fallback backoff.
		const retryDelay =
			retryAfter === undefined
				? Math.min(backoff, MAX_BINARY_BACKOFF_DELAY_MS)
				: Math.max(0, retryAfter);
		await sleep(retryDelay);
	}
	if (!response.ok) {
		const retryAfter = retryAfterMs(response);
		const body = await readErrorBody(response);
		const message =
			typeof body === 'string' && body.length > 0 ? body : response.statusText;
		throw new ApiError(
			{ method: options.method, url: options.endpoint },
			{
				url,
				ok: false,
				status: response.status,
				statusText: response.statusText,
				body,
			},
			message,
			retryAfter === undefined ? undefined : { retryAfter },
		);
	}
	const declaredLength = Number(response.headers.get('content-length'));
	if (Number.isFinite(declaredLength) && declaredLength > MAX_BINARY_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw new Error(
			`DigiCert binary response exceeds ${MAX_BINARY_BYTES} bytes`,
		);
	}
	const reader = response.body?.getReader();
	if (!reader) return [] as T;
	const chunks: Uint8Array[] = [];
	let byteLength = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			byteLength += value.byteLength;
			if (byteLength > MAX_BINARY_BYTES) {
				await reader.cancel().catch(() => undefined);
				throw new Error(
					`DigiCert binary response exceeds ${MAX_BINARY_BYTES} bytes`,
				);
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}
	const bytes = new Uint8Array(byteLength);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return Array.from(bytes) as T;
}

function retryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('retry-after');
	if (!header) return undefined;
	const seconds = Number(header);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const date = Date.parse(header);
	if (Number.isNaN(date)) return undefined;
	return Math.max(0, date - Date.now());
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// `unknown`: provider error JSON is untrusted and has no shared documented shape.
async function readErrorBody(response: Response): Promise<unknown> {
	const text = await response.text();
	if (!text) return undefined;
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.toLowerCase().includes('json')) return text;
	try {
		// Error payloads are untrusted provider JSON; callers only need status and message.
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

function requestBody(
	body: ApiRequestOptions['body'],
	mediaType?: string,
): string | Blob | FormData | URLSearchParams | ArrayBuffer | undefined {
	if (body === undefined || body === null) return undefined;
	if (
		typeof body === 'string' ||
		body instanceof Blob ||
		body instanceof FormData ||
		body instanceof URLSearchParams ||
		body instanceof ArrayBuffer
	) {
		return body;
	}
	if (ArrayBuffer.isView(body)) {
		return new Blob([
			new Uint8Array(body.buffer, body.byteOffset, body.byteLength),
		]);
	}
	if (mediaType?.includes('/json') || typeof body === 'object') {
		return JSON.stringify(body);
	}
	return undefined;
}

function buildUrl(
	base: string,
	endpoint: string,
	path?: ApiRequestOptions['path'],
	query?: ApiRequestOptions['query'],
): string {
	// `unknown`: path values are provider-defined scalars; each becomes one URL segment.
	const pathParts: Record<string, unknown> = path ?? {};
	const resolved = endpoint.replace(/{(.*?)}/g, (match, key: string) =>
		Object.hasOwn(pathParts, key) ? encodePathSegment(pathParts[key]) : match,
	);
	const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
	const relative = resolved.startsWith('/') ? resolved.slice(1) : resolved;
	const queryString = serializeQuery(query);
	return `${baseUrl}/${relative}${queryString}`;
}

function encodePathSegment(value: unknown): string {
	// `unknown`: path values are provider-defined scalars validated per operation.
	const segment = String(value);
	if (segment === '.' || segment === '..') {
		throw new Error('DigiCert path parameters cannot be dot segments');
	}
	return encodeURIComponent(segment);
}

function serializeQuery(query?: ApiRequestOptions['query']): string {
	if (!query) return '';
	const pairs: string[] = [];
	// `unknown`: query values are provider-defined JSON scalars or arrays, stringified here.
	const append = (key: string, value: unknown): void => {
		pairs.push(
			`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
		);
	};
	// `unknown`: nested query objects are flattened; the operation schema already validated them.
	const process = (key: string, value: unknown): void => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			for (const item of value) process(key, item);
		} else if (typeof value === 'object') {
			for (const [nestedKey, nestedValue] of Object.entries(value)) {
				process(`${key}[${nestedKey}]`, nestedValue);
			}
		} else {
			append(key, value);
		}
	};
	for (const [key, value] of Object.entries(query)) process(key, value);
	return pairs.length > 0 ? `?${pairs.join('&')}` : '';
}
