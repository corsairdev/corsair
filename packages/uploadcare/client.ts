import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Provider error/request JSON: string, number, boolean, null, array, or object. */
type ProviderJson =
	| string
	| number
	| boolean
	| null
	| ProviderJson[]
	| { [key: string]: ProviderJson | undefined };

export class UploadcareAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: ProviderJson,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'UploadcareAPIError';
	}
}

const REST_BASE = 'https://api.uploadcare.com';
const UPLOAD_BASE = 'https://upload.uploadcare.com';

export function publicKeyFromAuth(apiKey: string): string {
	const raw = apiKey.startsWith('Uploadcare.Simple ')
		? apiKey.slice('Uploadcare.Simple '.length)
		: apiKey;
	return raw.split(':')[0] ?? raw;
}

function simpleAuthHeader(apiKey: string): string {
	return apiKey.startsWith('Uploadcare.Simple ')
		? apiKey
		: `Uploadcare.Simple ${apiKey}`;
}

function errorMessage(
	body: ProviderJson | undefined,
	fallback: string,
): string {
	if (body && typeof body === 'object' && !Array.isArray(body)) {
		if (body.detail != null) return String(body.detail);
		if (body.message != null) return String(body.message);
		if (body.error != null) return String(body.error);
	}
	return fallback;
}

function errorCode(body: ProviderJson | undefined): string | undefined {
	if (
		body &&
		typeof body === 'object' &&
		!Array.isArray(body) &&
		body.code != null
	) {
		return String(body.code);
	}
	return undefined;
}

// value is unknown because `request()` / `ApiError.body` is untyped JSON that
// varies by Uploadcare endpoint and error type, making a strict type
// infeasible without per-endpoint handling.
function asProviderJson(value: unknown): ProviderJson | undefined {
	if (value === undefined) return undefined;
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map((item) => asProviderJson(item) ?? null);
	}
	if (typeof value === 'object') {
		const out: { [key: string]: ProviderJson | undefined } = {};
		for (const [key, item] of Object.entries(value)) {
			out[key] = asProviderJson(item);
		}
		return out;
	}
	return String(value);
}

// error is unknown because fetch/request can throw ApiError, Error, or a
// non-Error value, making a strict type infeasible at this catch boundary.
function wrapRequestError(error: unknown): never {
	if (error instanceof ApiError) {
		throw new UploadcareAPIError(
			errorMessage(asProviderJson(error.body), error.message),
			errorCode(asProviderJson(error.body)),
			error.status,
			asProviderJson(error.body),
			error.retryAfter,
		);
	}
	if (error instanceof Error) {
		throw new UploadcareAPIError(error.message);
	}
	throw new UploadcareAPIError('Unknown error');
}

export async function makeUploadcareRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// REST bodies are arrays (batch UUIDs) or objects depending on the op.
		body?: ProviderJson | ProviderJson[];
		query?: Record<string, string | number | boolean | undefined>;
		mediaType?: string;
		formData?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, mediaType, formData } = options;

	const config: OpenAPIConfig = {
		BASE: REST_BASE,
		VERSION: '0.7.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/vnd.uploadcare-v0.7+json',
			Authorization: simpleAuthHeader(apiKey),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: body !== undefined ? body : undefined,
		formData,
		mediaType:
			mediaType ??
			(body !== undefined ? 'application/json; charset=utf-8' : undefined),
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		// error is unknown because request() rejects with mixed throw types,
		// making a strict type infeasible here.
		wrapRequestError(error);
	}
}

export async function makeUploadcareUploadRequest<T>(
	endpoint: string,
	options: {
		method?: 'GET' | 'POST';
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'POST', query, formData } = options;

	const config: OpenAPIConfig = {
		BASE: UPLOAD_BASE,
		VERSION: '0.7.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		formData,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		// error is unknown because request() rejects with mixed throw types,
		// making a strict type infeasible here.
		wrapRequestError(error);
	}
}
