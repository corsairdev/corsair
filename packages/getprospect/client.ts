import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	ApiResult,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import { SchemaErrorCode, SchemaErrorName } from './schema/api';

export const GETPROSPECT_API_BASE = 'https://api.getprospect.com';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export type GetProspectRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: object;
	// Per-route query fields differ; values are schema-validated before reaching this transport boundary.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	timeout?: number;
};

const ProviderErrorEnvelopeSchema = z
	.object({
		errors: z
			.array(
				z
					.object({
						name: z.string().optional(),
						payload: z.record(z.string(), z.json()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

type SafeProviderErrorBody = {
	success: false;
	data: null;
	errors?: Array<{
		name?: string;
		payload?: Record<string, string | number | boolean>;
	}>;
};

// `unknown` because ApiError bodies contain untrusted provider JSON that must be whitelisted before exposure.
function safeProviderErrorBody(
	body: unknown,
): SafeProviderErrorBody | undefined {
	const parsed = ProviderErrorEnvelopeSchema.safeParse(body);
	if (!parsed.success || !parsed.data.errors) return undefined;
	const errors = parsed.data.errors.map((providerError) => {
		const safeError: NonNullable<SafeProviderErrorBody['errors']>[number] = {};
		const name = SchemaErrorName.safeParse(providerError.name);
		if (name.success) safeError.name = name.data;
		const providerPayload = providerError.payload;
		if (providerPayload) {
			const safePayload: Record<string, string | number | boolean> = {};
			const code = SchemaErrorCode.safeParse(providerPayload.code);
			if (code.success) safePayload.code = code.data;
			for (const key of [
				'needed',
				'remaining',
				'limit',
				'reset_seconds',
				'needed_usd',
				'available_usd',
			]) {
				const value = providerPayload[key];
				if (typeof value === 'number' && Number.isFinite(value)) {
					safePayload[key] = value;
				}
			}
			if (
				typeof providerPayload.bucket === 'string' &&
				['search', 'enrich', 'email', 'jobs', 'poll'].includes(
					providerPayload.bucket,
				)
			) {
				safePayload.bucket = providerPayload.bucket;
			}
			if (
				typeof providerPayload.window === 'string' &&
				['minute', 'day'].includes(providerPayload.window)
			) {
				safePayload.window = providerPayload.window;
			}
			if (Object.keys(safePayload).length > 0) safeError.payload = safePayload;
		}
		return safeError;
	});
	return { success: false, data: null, errors };
}

function safeApiError(
	error: ApiError,
	method: NonNullable<GetProspectRequestOptions['method']>,
): ApiError {
	const safeRequest: ApiRequestOptions = {
		method,
		url: '/v2/[redacted]',
	};
	const safeResponse: ApiResult = {
		url: `${GETPROSPECT_API_BASE}/v2/`,
		ok: false,
		status: error.status,
		statusText: '',
		body: safeProviderErrorBody(error.body),
	};
	return new ApiError(
		safeRequest,
		safeResponse,
		`GetProspect request failed (HTTP ${error.status})`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeGetProspectRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: GetProspectRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, timeout = 20_000 } = options;
	if (apiKey === undefined || apiKey.length === 0) {
		throw new AuthMissingError('getprospect', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: GETPROSPECT_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: Math.min(Math.max(timeout, 1_000), 95_000),
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			...headers,
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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// Core ApiError retains body and request details, which may contain prospect PII.
		if (error instanceof ApiError) throw safeApiError(error, method);
		// Network errors may include full URLs or transport details; expose only a safe summary.
		throw new Error('GetProspect request failed');
	}
}
