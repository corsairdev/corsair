import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { SimlaComOperation } from './endpoints/types';

export const SIMLACOM_API_VERSION = '5';
const MAX_BINARY_BYTES = 20 * 1024 * 1024;
const MAX_BINARY_RATE_LIMIT_RETRIES = 3;

// Request payloads are dynamic JSON narrowed by the per-operation schema before transport.
export type SimlaComRequestInput = {
	path?: Record<string, string | number>;
	query?: Record<string, unknown>;
	body?: unknown;
};

export type SimlaComBinaryOutput = {
	kind: 'binary';
	contentType: string;
	base64: string;
};

const SUBDOMAIN_LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/**
 * The account label from what a person types into the connect form: `acme`,
 * `acme.simla.com` or the full `https://acme.simla.com/` URL. Anything that
 * names another host returns undefined, so the key is only ever sent to
 * `*.simla.com`.
 */
export function normalizeSimlaComSubdomain(value: string): string | undefined {
	const host = value
		.trim()
		.toLowerCase()
		.replace(/^https:\/\//, '')
		.replace(/\/.*$/, '')
		.replace(/\.simla\.com$/, '');
	return SUBDOMAIN_LABEL.test(host) ? host : undefined;
}

export function isValidSimlaComSubdomain(value: string): boolean {
	return normalizeSimlaComSubdomain(value) !== undefined;
}

function resolveHost(subdomain: string | undefined): string {
	const label = subdomain ? normalizeSimlaComSubdomain(subdomain) : undefined;
	if (!label) {
		throw new AuthMissingError(
			'simlacom',
			'api_key',
			'Simla.com subdomain is missing or invalid: connect the account with its subdomain (acme for https://acme.simla.com) or set the subdomain option.',
		);
	}
	return `https://${label}.simla.com`;
}

/**
 * Simla.com is a PHP API: a list only arrives whole as `ids[]=1&ids[]=2`
 * (`ids=1&ids=2` is refused with 400). Most documented list parameters already
 * end in `[]`; this adds it to the few that don't, and to lists nested in an
 * object filter.
 */
// Query values are validated JSON of any shape; each level is narrowed here.
export function simlaComQuery(
	query: Record<string, unknown>,
): Record<
	string,
	string | number | boolean | Array<string | number | boolean>
> {
	const out: Record<
		string,
		string | number | boolean | Array<string | number | boolean>
	> = {};
	// Nested filter values have no fixed shape; recursion narrows each one.
	const add = (name: string, value: unknown): void => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			const key = name.endsWith('[]') ? name : `${name}[]`;
			const scalars: Array<string | number | boolean> = [];
			for (const item of value) {
				if (
					typeof item === 'string' ||
					typeof item === 'number' ||
					typeof item === 'boolean'
				) {
					scalars.push(item);
				} else if (item !== null && item !== undefined) {
					scalars.push(JSON.stringify(item));
				}
			}
			out[key] = scalars;
			return;
		}
		if (isRecord(value)) {
			for (const [key, item] of Object.entries(value)) {
				add(`${name}[${key}]`, item);
			}
			return;
		}
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			out[name] = value;
		}
	};
	for (const [name, value] of Object.entries(query)) add(name, value);
	return out;
}

// Request and response values stay unknown until operation-specific Zod schemas narrow them.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Form fields are dynamic JSON from the strict operation input schema.
function formEncodedBody(body: unknown): string | undefined {
	if (body === undefined) return undefined;
	if (!isRecord(body)) {
		throw new Error('Simla.com form request body must be an object.');
	}
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(body)) {
		if (value === undefined) continue;
		params.set(
			key,
			typeof value === 'string' ? value : (JSON.stringify(value) ?? ''),
		);
	}
	return params.toString();
}

function decodeBase64(value: string): Uint8Array {
	const decoded = atob(value);
	return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function encodeBase64(value: Uint8Array): string {
	const chunkSize = 0x8000;
	let binary = '';
	for (let offset = 0; offset < value.length; offset += chunkSize) {
		binary += String.fromCharCode(
			...value.subarray(offset, offset + chunkSize),
		);
	}
	return btoa(binary);
}

async function readBinaryBody(response: Response): Promise<Uint8Array> {
	const contentLength = Number(response.headers.get('content-length'));
	if (Number.isFinite(contentLength) && contentLength > MAX_BINARY_BYTES) {
		await response.body?.cancel().catch(() => undefined);
		throw new Error(
			'Simla.com binary response exceeds the 20 MiB client limit.',
		);
	}
	const reader = response.body?.getReader();
	if (!reader) return new Uint8Array();
	const chunks: Uint8Array[] = [];
	let totalBytes = 0;
	try {
		while (true) {
			const chunk = await reader.read();
			if (chunk.done) break;
			totalBytes += chunk.value.byteLength;
			if (totalBytes > MAX_BINARY_BYTES) {
				await reader.cancel().catch(() => undefined);
				throw new Error(
					'Simla.com binary response exceeds the 20 MiB client limit.',
				);
			}
			chunks.push(chunk.value);
		}
	} catch (error: unknown) {
		// `unknown` is required because a response stream can reject with any runtime value.
		if (error instanceof Error) throw error;
		throw new Error('Simla.com binary response could not be read.');
	}
	const output = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		output.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return output;
}

function retryAfterMs(response: Response): number | undefined {
	const value = response.headers.get('retry-after');
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
	const timestamp = Date.parse(value);
	return Number.isNaN(timestamp)
		? undefined
		: Math.max(0, timestamp - Date.now());
}

function safeRouteUrl(url: string, route: string, versioned: boolean): string {
	try {
		const origin = new URL(url).origin;
		return `${origin}/${versioned ? 'api/v5/' : ''}${route}`;
	} catch {
		return route;
	}
}

function safeApiError(
	operation: SimlaComOperation,
	url: string,
	requestOptions: ApiRequestOptions,
	response: Response,
	retryAfter?: number,
): ApiError {
	const safeRequest: ApiRequestOptions = {
		...requestOptions,
		path: undefined,
		query: undefined,
		body: undefined,
		formData: undefined,
	};
	const result: ApiResult = {
		url: safeRouteUrl(url, operation.route, operation.versioned),
		ok: false,
		status: response.status,
		statusText: `HTTP ${response.status}`,
		body: {
			message: 'Simla.com request failed; response details were redacted.',
		},
	};
	return new ApiError(
		safeRequest,
		result,
		`Simla.com ${operation.id} failed with HTTP ${response.status}.`,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

/**
 * Simla.com explains a refusal in `errorMsg` (and per-field `errors`), for
 * example "Telephony not enabled" or "Unexpected value for parameter". Those are
 * kept so a caller can fix the request; every other body field is dropped.
 */
// The error body is untrusted provider JSON; only the two documented fields are read.
function providerErrorDetails(body: unknown): {
	errorMsg?: string;
	errors?: JsonErrors;
} {
	if (!isRecord(body)) return {};
	const details: { errorMsg?: string; errors?: JsonErrors } = {};
	if (typeof body.errorMsg === 'string') {
		details.errorMsg = body.errorMsg.slice(0, 500);
	}
	const errors = body.errors;
	if (
		Array.isArray(errors) &&
		errors.every((item) => typeof item === 'string')
	) {
		details.errors = errors.slice(0, 20).map((item) => item.slice(0, 300));
	} else if (isRecord(errors)) {
		const fields: Record<string, string> = {};
		for (const [field, message] of Object.entries(errors).slice(0, 20)) {
			if (typeof message === 'string') fields[field] = message.slice(0, 300);
		}
		details.errors = fields;
	}
	return details;
}

type JsonErrors = string[] | Record<string, string>;

export function sanitizeSimlaComApiError(error: ApiError): ApiError {
	const parsedUrl = new URL(error.url);
	const pathPrefix = parsedUrl.pathname.startsWith('/api/v5/')
		? '/api/v5/'
		: '/';
	const safeUrl = `${parsedUrl.origin}${pathPrefix}${error.request.url.replace(/^\/+/, '')}`;
	const details = providerErrorDetails(error.body);
	const safeMessage = details.errorMsg
		? `Simla.com request failed with HTTP ${error.status}: ${details.errorMsg}`
		: `Simla.com request failed with HTTP ${error.status}.`;
	const requestOptions: ApiRequestOptions = {
		...error.request,
		path: undefined,
		query: undefined,
		body: undefined,
		formData: undefined,
		headers: undefined,
	};
	Object.defineProperties(error, {
		url: {
			value: safeUrl,
			enumerable: true,
			configurable: true,
			writable: true,
		},
		statusText: {
			value: `HTTP ${error.status}`,
			enumerable: true,
			configurable: true,
			writable: true,
		},
		body: {
			value: { success: false, ...details },
			enumerable: true,
			configurable: true,
			writable: true,
		},
		request: {
			value: requestOptions,
			enumerable: true,
			configurable: true,
			writable: true,
		},
	});
	error.message = safeMessage;
	if (error.stack) {
		const stack = error.stack.split('\n');
		stack[0] = `${error.name}: ${safeMessage}`;
		error.stack = stack.join('\n');
	}
	return error;
}

function binaryUrl(
	operation: SimlaComOperation,
	host: string,
	input: SimlaComRequestInput,
): string {
	const path = operation.route.replace(
		/\{([^}]+)\}/g,
		(_match, name: string) => {
			const value = input.path?.[name];
			if (typeof value !== 'string' && typeof value !== 'number') {
				throw new Error(
					`Missing path parameter for Simla.com ${operation.id}.`,
				);
			}
			return encodeURIComponent(String(value));
		},
	);
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(simlaComQuery(input.query ?? {}))) {
		for (const item of Array.isArray(value) ? value : [value]) {
			params.append(key, String(item));
		}
	}
	const suffix = params.toString();
	return `${host}/${operation.versioned ? 'api/v5/' : ''}${path}${suffix ? `?${suffix}` : ''}`;
}

// The transport response stays unknown until the operation output schema parses it.
export async function makeSimlaComRequest(
	operation: SimlaComOperation,
	apiKey: string,
	subdomain: string | undefined,
	input: SimlaComRequestInput,
): Promise<unknown> {
	if (!apiKey) throw new AuthMissingError('simlacom', 'api_key');
	const host = resolveHost(subdomain);
	const apiBase = operation.versioned ? `${host}/api/v5` : host;
	const config: OpenAPIConfig = {
		BASE: apiBase,
		VERSION: SIMLACOM_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		ENCODE_PATH: encodeURIComponent,
		HEADERS: { 'X-API-KEY': apiKey },
	};
	let requestOptions: ApiRequestOptions = {
		method: operation.method,
		url: operation.route,
		...(input.path ? { path: input.path } : {}),
		...(input.query ? { query: simlaComQuery(input.query) } : {}),
	};

	if (operation.request?.mediaType === 'application/octet-stream') {
		if (typeof input.body !== 'string') {
			throw new Error(
				'Simla.com binary uploads require a base64-encoded body.',
			);
		}
		const bytes = decodeBase64(input.body);
		if (bytes.byteLength > MAX_BINARY_BYTES) {
			throw new Error(
				'Simla.com binary upload exceeds the 20 MiB client limit.',
			);
		}
		return requestBinary(operation, host, apiKey, requestOptions, input, bytes);
	}
	if (operation.response.kind === 'binary') {
		return requestBinary(operation, host, apiKey, requestOptions, input);
	}

	if (operation.request?.mediaType === 'application/x-www-form-urlencoded') {
		const body = formEncodedBody(input.body);
		if (body !== undefined) {
			requestOptions = {
				...requestOptions,
				body,
				mediaType: 'application/x-www-form-urlencoded; charset=utf-8',
			};
		}
	}

	try {
		// `unknown` keeps provider JSON untrusted until the endpoint's output schema validates it.
		return await request<unknown>(config, requestOptions);
	} catch (error: unknown) {
		// `unknown` is required because a rejected transport promise may carry any value.
		if (error instanceof ApiError) throw sanitizeSimlaComApiError(error);
		if (error instanceof Error) throw new Error('Simla.com request failed.');
		throw new Error('Simla.com request failed.');
	}
}

// Upload responses are untrusted JSON; downloads become a base64 envelope validated by the endpoint schema.
async function requestBinary(
	operation: SimlaComOperation,
	host: string,
	apiKey: string,
	requestOptions: ApiRequestOptions,
	input: SimlaComRequestInput,
	bytes?: Uint8Array,
): Promise<unknown> {
	const url = binaryUrl(operation, host, input);
	let response: Response;
	let attempt = 0;
	while (true) {
		attempt += 1;
		try {
			response = await fetch(url, {
				method: operation.method,
				headers: {
					'X-API-KEY': apiKey,
					Accept: 'application/json, application/octet-stream',
					...(bytes ? { 'Content-Type': 'application/octet-stream' } : {}),
				},
				body: bytes,
				signal: AbortSignal.timeout(20_000),
			});
		} catch {
			throw new Error(`Simla.com ${operation.id} request failed.`);
		}
		if (response.status !== 429 || attempt > MAX_BINARY_RATE_LIMIT_RETRIES)
			break;
		const retryAfter = retryAfterMs(response);
		await response.body?.cancel().catch(() => undefined);
		const backoff = 1000 * 2 ** (attempt - 1);
		await new Promise((resolve) => setTimeout(resolve, retryAfter ?? backoff));
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => undefined);
		throw safeApiError(
			operation,
			url,
			requestOptions,
			response,
			retryAfterMs(response),
		);
	}
	const contentType =
		response.headers.get('content-type') ?? 'application/octet-stream';
	if (operation.response.kind !== 'binary') {
		// `unknown` is necessary because the provider response is untrusted until the generated output schema validates it.
		const responseBody: unknown = await response.json();
		return responseBody;
	}
	const body = await readBinaryBody(response);
	const output: SimlaComBinaryOutput = {
		kind: 'binary',
		contentType,
		base64: encodeBase64(body),
	};
	return output;
}
