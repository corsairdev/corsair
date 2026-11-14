import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	ApiResult,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { E2bOperationRoute } from './endpoints/routes';

export const E2B_API_BASE = 'https://api.e2b.app';
export const E2B_SANDBOX_BASE = 'https://sandbox.e2b.app';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

const PAGINATED_OPERATION_IDS = new Set([
	'sandboxes.list',
	'sandboxes.listSnapshots',
	'templates.list',
	'templates.get',
	'secrets.list',
]);

const SENSITIVE_FIELD_NAMES = new Set([
	'accesskeyid',
	'accesstoken',
	'apikey',
	'authorization',
	'awssecretaccesskey',
	'e2baccesstoken',
	'privatekey',
	'password',
	'secret',
	'secretaccesskey',
	'secretvalue',
	'serviceaccountjson',
	'token',
	'xaccesstoken',
	'value',
]);

// Every value in these maps is treated as a secret: environment variables and
// injected network headers commonly carry API keys under arbitrary names.
const SENSITIVE_MAP_FIELD_NAMES = new Set(['envs', 'envvars']);

function isSensitiveMapField(
	name: string,
	value: unknown,
	parentName: string | undefined,
): boolean {
	if (!isRecord(value)) return false;
	const field = normalizedFieldName(name);
	// Network rule transforms inject request headers, usually credentials.
	if (field === 'headers' && parentName === 'transform') return true;
	return SENSITIVE_MAP_FIELD_NAMES.has(field);
}

function normalizedFieldName(name: string): string {
	return name.toLowerCase().replace(/[_-]/g, '');
}

// `unknown` keeps provider JSON untrusted until it is narrowed to a record.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` is needed because provider errors can contain arbitrary JSON shapes.
function redactSensitive(
	value: unknown,
	sensitiveValues: string[] = [],
	parentName?: string,
): unknown {
	if (typeof value === 'string') return redactMessage(value, sensitiveValues);
	if (Array.isArray(value)) {
		return value.map((item) =>
			redactSensitive(item, sensitiveValues, parentName),
		);
	}
	if (!isRecord(value)) return value;
	return Object.fromEntries(
		Object.entries(value).map(([key, item]) => [
			key,
			SENSITIVE_FIELD_NAMES.has(normalizedFieldName(key))
				? '[REDACTED]'
				: isSensitiveMapField(key, item, parentName)
					? redactMapValues(item)
					: redactSensitive(item, sensitiveValues, normalizedFieldName(key)),
		]),
	);
}

// Map values are unknown until narrowed; keys stay visible so errors remain debuggable.
function redactMapValues(value: unknown): unknown {
	if (!isRecord(value)) return value;
	return Object.fromEntries(
		Object.keys(value).map((key) => [key, '[REDACTED]']),
	);
}

// `unknown` headers are narrowed before being copied into a sanitized error.
function redactRecord(value: unknown): Record<string, unknown> | undefined {
	if (!isRecord(value)) return undefined;
	const redacted = redactSensitive(value);
	return isRecord(redacted) ? redacted : undefined;
}

// `unknown` is needed to recursively inspect request JSON without trusting its shape.
function collectSensitiveValues(value: unknown, parentName?: string): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((item) => collectSensitiveValues(item, parentName));
	}
	if (!isRecord(value)) return [];
	return Object.entries(value).flatMap(([key, item]) => {
		if (SENSITIVE_FIELD_NAMES.has(normalizedFieldName(key))) {
			return typeof item === 'string' && item.length > 0 ? [item] : [];
		}
		if (isSensitiveMapField(key, item, parentName) && isRecord(item)) {
			return Object.values(item).filter(
				(entry): entry is string =>
					typeof entry === 'string' && entry.length > 0,
			);
		}
		return collectSensitiveValues(item, normalizedFieldName(key));
	});
}

function redactMessage(message: string, sensitiveValues: string[]): string {
	// Longest first, so a secret that is a prefix of another cannot leave the longer one's tail behind.
	return [...sensitiveValues]
		.sort((a, b) => b.length - a.length)
		.reduce((result, value) => result.split(value).join('[REDACTED]'), message);
}

function withoutQuery(url: string): string {
	try {
		const parsed = new URL(url);
		parsed.search = '';
		parsed.hash = '';
		return parsed.toString();
	} catch {
		return url.split(/[?#]/)[0] ?? '';
	}
}

function sanitizeApiError(
	error: ApiError,
	sensitiveValues: string[],
): ApiError {
	const safeRequest: ApiRequestOptions = {
		...error.request,
		// Query values such as sandbox metadata can hold personal data.
		query: undefined,
		body: redactSensitive(error.request.body, sensitiveValues),
		headers: redactRecord(error.request.headers),
	};
	return new ApiError(
		safeRequest,
		{
			url: withoutQuery(error.url),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: redactSensitive(error.body, sensitiveValues),
		},
		redactMessage(error.message, sensitiveValues),
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// Parsed route fields remain heterogeneous until their scalar type is checked here.
function isScalar(value: unknown): value is string | number | boolean {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	);
}

// Query values differ by operation; this record preserves arrays for OpenAPI serialization.
function serializeQuery(
	query: Record<string, unknown> | undefined,
	route: E2bOperationRoute,
): Record<string, unknown> | undefined {
	if (!query) return undefined;
	return Object.fromEntries(
		Object.entries(query).map(([name, value]) => {
			const style = route.queryStyle.find((entry) => entry.name === name);
			if (Array.isArray(value) && style?.explode === false) {
				return [name, value.map((item) => String(item)).join(',')];
			}
			return [name, value];
		}),
	);
}

function buildUrl(base: string, options: ApiRequestOptions): URL {
	const pathParams = isRecord(options.path) ? options.path : {};
	const path = options.url.replace(/\{([^}]+)\}/g, (_match, name: string) => {
		const value = pathParams[name];
		return encodeURIComponent(isScalar(value) ? String(value) : '');
	});
	const url = new URL(path, base);
	const query = isRecord(options.query) ? options.query : {};
	for (const [name, value] of Object.entries(query)) {
		appendQueryValue(url.searchParams, name, value);
	}
	return url;
}

// Query schema variants are narrowed recursively before URL serialization.
function appendQueryValue(
	params: URLSearchParams,
	name: string,
	value: unknown,
): void {
	if (value === undefined || value === null) return;
	if (Array.isArray(value)) {
		for (const item of value) appendQueryValue(params, name, item);
		return;
	}
	if (isRecord(value)) {
		for (const [key, nestedValue] of Object.entries(value)) {
			appendQueryValue(params, `${name}[${key}]`, nestedValue);
		}
		return;
	}
	if (isScalar(value)) params.append(name, String(value));
}

function responseNumberHeader(
	response: Response,
	name: string,
): number | undefined {
	const header = response.headers.get(name);
	if (!header) return undefined;
	const value = Number(header);
	return Number.isFinite(value) ? value : undefined;
}

// Error response bodies vary by status and remain unknown until field checks below.
function responseErrorMessage(
	body: unknown,
	status: number,
	statusText: string,
): string {
	if (isRecord(body) && typeof body.message === 'string') return body.message;
	return `E2B API returned HTTP ${status}${statusText ? ` ${statusText}` : ''}`;
}

// Page output is unknown until route.output validates the body and cursor wrapper.
async function requestPaginatedPage(
	route: E2bOperationRoute,
	config: OpenAPIConfig,
	options: ApiRequestOptions,
	baseHeaders: Record<string, string>,
): Promise<unknown> {
	const url = buildUrl(config.BASE, options);
	const headers = new Headers(baseHeaders);
	if (isRecord(options.headers)) {
		for (const [name, value] of Object.entries(options.headers)) {
			if (isScalar(value)) headers.set(name, String(value));
		}
	}
	const response = await fetch(url, {
		method: options.method,
		headers,
		...(options.body === undefined
			? {}
			: { body: JSON.stringify(options.body) }),
		credentials: config.CREDENTIALS,
		signal: AbortSignal.timeout(config.TIMEOUT ?? 20_000),
	});
	const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
	// Paginated response JSON is untrusted until the operation output schema parses it.
	const responseBody: unknown =
		response.status === 204
			? undefined
			: contentType.includes('json')
				? await response.json()
				: await response.text();
	const retryAfterSeconds = responseNumberHeader(response, 'Retry-After');
	const rateLimitInfo = {
		retryAfter:
			retryAfterSeconds === undefined ? undefined : retryAfterSeconds * 1000,
		rateLimitRemaining: responseNumberHeader(response, 'RateLimit-Remaining'),
		rateLimitLimit: responseNumberHeader(response, 'RateLimit-Limit'),
	};
	if (!response.ok) {
		const result: ApiResult = {
			url: url.toString(),
			ok: false,
			status: response.status,
			statusText: response.statusText,
			body: responseBody,
		};
		throw new ApiError(
			options,
			result,
			responseErrorMessage(responseBody, response.status, response.statusText),
			rateLimitInfo,
		);
	}

	const nextToken = response.headers.get('X-Next-Token') ?? undefined;
	const totalRunning = responseNumberHeader(response, 'X-Total-Running');
	if (route.id === 'templates.get') {
		if (!isRecord(responseBody)) return responseBody;
		return {
			...responseBody,
			...(nextToken === undefined ? {} : { nextToken }),
		};
	}
	return {
		items: responseBody,
		...(nextToken === undefined ? {} : { nextToken }),
		...(totalRunning === undefined ? {} : { totalRunning }),
	};
}

/** Execute one OpenAPI-backed operation; output is unknown because the route union varies by operation. */
export async function makeE2bRequest(
	route: E2bOperationRoute,
	apiKey: string | undefined,
	rawInput: unknown,
): Promise<unknown> {
	// Operation inputs are unknown at the transport boundary and are parsed before use.
	const input: unknown = route.input.parse(rawInput);
	const inputRecord = isRecord(input) ? input : {};
	const path = isRecord(inputRecord.path) ? inputRecord.path : undefined;
	const query = isRecord(inputRecord.query) ? inputRecord.query : undefined;
	const inputHeaders = isRecord(inputRecord.headers)
		? inputRecord.headers
		: undefined;
	const body = inputRecord.body;
	const sensitiveValues = collectSensitiveValues(input);
	for (const [name, value] of Object.entries(path ?? {})) {
		// '.' or '..' survives encodeURIComponent and URL normalization would move the request to another route.
		if (value === '.' || value === '..') {
			throw new Error(`E2B path parameter ${name} cannot be '.' or '..'`);
		}
	}

	if (route.auth === 'apiKey' && (!apiKey || apiKey.length === 0)) {
		throw new AuthMissingError('e2b', 'api_key');
	}

	const headers: Record<string, string> = {};
	for (const header of route.headers) {
		const value = inputHeaders?.[header.inputName];
		if (value !== undefined && isScalar(value)) {
			headers[header.name] = String(value);
		}
	}
	if (route.connectProtocol) {
		headers['Connect-Protocol-Version'] = '1';
	}
	if (route.auth === 'sandboxAccessToken') {
		const accessToken = inputHeaders?.e2bAccessToken;
		if (typeof accessToken !== 'string' || accessToken.length === 0) {
			throw new AuthMissingError('e2b', 'sandbox_access_token');
		}
		headers['X-Access-Token'] = accessToken;
	}

	const baseHeaders: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(route.auth === 'apiKey' && apiKey ? { 'X-API-Key': apiKey } : {}),
	};
	const config: OpenAPIConfig = {
		BASE: route.host === 'api' ? E2B_API_BASE : E2B_SANDBOX_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: baseHeaders,
		// encodeURI (core's default) keeps '/', so an ID like '../volumes/x' would change the route.
		ENCODE_PATH: encodeURIComponent,
	};
	const requestOptions: ApiRequestOptions = {
		method: route.method,
		url: route.path,
		path,
		query: serializeQuery(query, route),
		headers,
		body,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		// The E2B response is untrusted JSON; the route's output schema narrows it.
		const response: unknown = PAGINATED_OPERATION_IDS.has(route.id)
			? await requestPaginatedPage(route, config, requestOptions, baseHeaders)
			: await request<unknown>(config, requestOptions, {
					rateLimitConfig: RATE_LIMIT_CONFIG,
				});
		return route.output.parse(response);
	} catch (error: unknown) {
		// A caught rejection has no static type; only ApiError carries provider details to sanitize.
		if (error instanceof ApiError) {
			throw sanitizeApiError(error, sensitiveValues);
		}
		throw error;
	}
}
