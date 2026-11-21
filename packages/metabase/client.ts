import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';
import { z } from 'zod';

const JsonValueSchema = z.json();
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RATE_LIMIT_RETRIES = 3;
const MAX_RETRY_AFTER_MS = 60_000;

export type JsonValue = z.infer<typeof JsonValueSchema>;
export type JsonObject = { [key: string]: JsonValue };
export type QueryValue =
	| string
	| number
	| boolean
	| readonly (string | number | boolean)[]
	| null
	| undefined;

export type MetabaseRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	query?: Record<string, QueryValue>;
	body?: JsonValue;
};

export class MetabaseAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MetabaseAPIError';
	}
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

function appendQuery(url: URL, query: MetabaseRequestOptions['query']): void {
	if (!query) return;
	for (const [key, value] of Object.entries(query)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			for (const item of value) url.searchParams.append(key, String(item));
		} else {
			url.searchParams.append(key, String(value));
		}
	}
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
): Promise<JsonValue> {
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
	appendQuery(url, options.query);

	const method = options.method ?? 'GET';
	const headers = new Headers({
		Accept: 'application/json',
		'X-API-Key': apiKey,
	});
	if (options.body !== undefined)
		headers.set('Content-Type', 'application/json');

	for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt += 1) {
		let response: Response;
		try {
			response = await fetch(url, {
				method,
				headers,
				body:
					options.body === undefined ? undefined : JSON.stringify(options.body),
				credentials: 'omit',
				redirect: 'manual',
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
		if (response.status === 204) return null;

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
