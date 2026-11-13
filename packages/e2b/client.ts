import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
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
): unknown {
	if (typeof value === 'string') return redactMessage(value, sensitiveValues);
	if (Array.isArray(value)) {
		return value.map((item) => redactSensitive(item, sensitiveValues));
	}
	if (!isRecord(value)) return value;
	return Object.fromEntries(
		Object.entries(value).map(([key, item]) => [
			key,
			SENSITIVE_FIELD_NAMES.has(normalizedFieldName(key))
				? '[REDACTED]'
				: redactSensitive(item, sensitiveValues),
		]),
	);
}

// `unknown` headers are narrowed before being copied into a sanitized error.
function redactRecord(value: unknown): Record<string, unknown> | undefined {
	if (!isRecord(value)) return undefined;
	const redacted = redactSensitive(value);
	return isRecord(redacted) ? redacted : undefined;
}

// `unknown` is needed to recursively inspect request JSON without trusting its shape.
function collectSensitiveValues(value: unknown): string[] {
	if (Array.isArray(value)) return value.flatMap(collectSensitiveValues);
	if (!isRecord(value)) return [];
	return Object.entries(value).flatMap(([key, item]) => {
		if (SENSITIVE_FIELD_NAMES.has(normalizedFieldName(key))) {
			return typeof item === 'string' && item.length > 3 ? [item] : [];
		}
		return collectSensitiveValues(item);
	});
}

function redactMessage(message: string, sensitiveValues: string[]): string {
	return sensitiveValues.reduce(
		(result, value) => result.split(value).join('[REDACTED]'),
		message,
	);
}

function sanitizeApiError(
	error: ApiError,
	sensitiveValues: string[],
): ApiError {
	const safeRequest: ApiRequestOptions = {
		...error.request,
		body: redactSensitive(error.request.body, sensitiveValues),
		headers: redactRecord(error.request.headers),
	};
	return new ApiError(
		safeRequest,
		{
			url: error.url,
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

	const config: OpenAPIConfig = {
		BASE: route.host === 'api' ? E2B_API_BASE : E2B_SANDBOX_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(route.auth === 'apiKey' && apiKey ? { 'X-API-Key': apiKey } : {}),
		},
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
		const response: unknown = await request<unknown>(config, requestOptions, {
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
