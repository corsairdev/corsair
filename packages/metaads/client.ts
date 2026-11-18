import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const METAADS_API_BASE = 'https://graph.facebook.com';
export const METAADS_API_VERSION = 'v27.0';

// `unknown` because parsed provider JSON may be any JSON array shape.
function isUnknownArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

// `unknown` because parsed provider JSON may be any JSON object shape.
function isUnknownRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// `unknown` because provider error JSON can contain echoed request values at arbitrary nested paths.
function redactErrorValue(value: unknown, sensitiveValues: string[]): unknown {
	if (typeof value === 'string') {
		return sensitiveValues.reduce(
			(message, sensitive) =>
				sensitive.length > 0
					? message.split(sensitive).join('[REDACTED]')
					: message,
			value,
		);
	}
	if (isUnknownArray(value)) {
		return value.map((item) => redactErrorValue(item, sensitiveValues));
	}
	if (isUnknownRecord(value)) {
		return Object.fromEntries(
			Object.entries(value).map(([key, nested]) => [
				key,
				redactErrorValue(nested, sensitiveValues),
			]),
		);
	}
	return value;
}

// Request payloads stay generic because each strict endpoint schema defines its own JSON/form fields.
// `unknown` is returned because Graph responses are untrusted until the operation output schema validates them.
export async function makeMetaAdsRequest(
	endpoint: string,
	apiKey: string | undefined,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` is needed for provider-defined nested form values such as targeting.
		body?: Record<string, unknown>;
		encodedBody?: string;
		query?: Record<string, string | number | boolean | undefined>;
		idempotencyKey?: string;
		redactBodyOnError?: boolean;
		redactQueryOnError?: boolean;
		sensitiveValues?: string[];
	} = {},
): Promise<unknown> {
	const { method = 'GET', body, encodedBody, query } = options;
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('metaads', 'oauth_2');
	}
	if (!apiKey) throw new AuthMissingError('metaads', 'oauth_2');

	const config: OpenAPIConfig = {
		BASE: METAADS_API_BASE,
		VERSION: METAADS_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: `/${METAADS_API_VERSION}${endpoint}`,
		formData: method !== 'GET' && encodedBody === undefined ? body : undefined,
		body: encodedBody,
		mediaType:
			encodedBody === undefined
				? undefined
				: 'application/x-www-form-urlencoded',
		query: { ...query, access_token: apiKey },
		headers: options.idempotencyKey
			? { 'X-Client-Idempotent-Key': options.idempotencyKey }
			: undefined,
	};

	try {
		// `unknown` because Graph API JSON is untrusted until the operation output schema validates it.
		return await request<unknown>(config, requestOptions, {
			// Meta documents many distinct quotas, including exhausted quotas;
			// mutations are never retried automatically by this adapter.
			rateLimitConfig: {
				enabled: true,
				maxRetries: 0,
				initialRetryDelay: 0,
				backoffMultiplier: 1,
				headerNames: { retryAfter: 'retry-after' },
			},
		});
	} catch (error: unknown) {
		// `unknown` because caught transport failures are untrusted; only core ApiError has request metadata to sanitize.
		if (!(error instanceof ApiError)) throw error;
		const safeQuery = error.request.query
			? { ...error.request.query }
			: undefined;
		if (safeQuery) safeQuery.access_token = undefined;
		const sensitiveValues = [apiKey, ...(options.sensitiveValues ?? [])].filter(
			(value): value is string => typeof value === 'string' && value.length > 0,
		);
		if (
			!options.redactBodyOnError &&
			!options.redactQueryOnError &&
			!error.request.query?.access_token
		) {
			throw error;
		}
		const safeRequest: ApiRequestOptions = {
			...error.request,
			query: options.redactQueryOnError ? undefined : safeQuery,
			...(options.redactBodyOnError
				? { body: undefined, formData: undefined }
				: {}),
		};
		throw new ApiError(
			safeRequest,
			{
				url: String(redactErrorValue(error.url, sensitiveValues)),
				ok: false,
				status: error.status,
				statusText: error.statusText,
				body: redactErrorValue(error.body, sensitiveValues),
			},
			String(redactErrorValue(error.message, sensitiveValues)),
			{
				retryAfter: error.retryAfter,
				rateLimitReset: error.rateLimitReset,
				rateLimitRemaining: error.rateLimitRemaining,
				rateLimitLimit: error.rateLimitLimit,
			},
		);
	}
}
