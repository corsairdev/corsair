import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PROOFLY_API_BASE = 'https://proofly.io/api';

const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export async function prooflyGet<T>(apiKey: string, path: string): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: PROOFLY_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Api-Key': apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
	};
	return await request<T>(config, requestOptions, {
		rateLimitConfig: NO_TRANSPORT_RETRIES,
	});
}

export function isProoflyFailure(body: unknown): boolean {
	return (
		typeof body === 'object' &&
		body !== null &&
		'ok' in body &&
		(body as { ok: unknown }).ok === false
	);
}

export function prooflyFailure(path: string, body: unknown): ApiError {
	const record =
		typeof body === 'object' && body !== null
			? (body as Record<string, unknown>)
			: {};
	const status = typeof record.status === 'number' ? record.status : 400;
	const message =
		typeof record.error === 'string' ? record.error : 'Proofly request failed';
	return new ApiError(
		{ method: 'GET', url: path },
		{
			url: `${PROOFLY_API_BASE}${path}`,
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		message,
	);
}
