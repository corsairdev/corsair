import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PROOFLY_API_BASE = 'https://proofly.io/api';

/**
 * One call to https://proofly.io/api with the key in `X-Api-Key`. Core
 * retries an HTTP 429 (free accounts get 10 requests a minute).
 * https://proofly.io/developers
 */
export async function prooflyRequest<T>(
	apiKey: string,
	method: 'GET' | 'PUT',
	path: string,
): Promise<T> {
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
	const requestOptions: ApiRequestOptions = { method, url: path };
	return await request<T>(config, requestOptions);
}

export async function prooflyGet<T>(apiKey: string, path: string): Promise<T> {
	return prooflyRequest<T>(apiKey, 'GET', path);
}

// unknown: any response body; only `ok: false` is checked.
export function isProoflyFailure(body: unknown): boolean {
	return (
		typeof body === 'object' &&
		body !== null &&
		'ok' in body &&
		// unknown: only `ok` is read from the body.
		(body as { ok: unknown }).ok === false
	);
}

export function prooflyFailure(
	path: string,
	// unknown: the provider's `{ ok: false, error }` body.
	body: unknown,
	method: 'GET' | 'PUT' = 'GET',
): ApiError {
	const record =
		typeof body === 'object' && body !== null
			? // unknown: the error body is provider JSON, read field by field.
				(body as Record<string, unknown>)
			: {};
	const status = typeof record.status === 'number' ? record.status : 400;
	const message =
		typeof record.error === 'string' ? record.error : 'Proofly request failed';
	return new ApiError(
		{ method, url: path },
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
