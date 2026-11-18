import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const LINKUP_API_BASE = 'https://api.linkup.so';

// Deep searches and linkup-deep responses can take 30 s or more; core's
// default timeout is 20 s.
export const LINKUP_TIMEOUT_MS = 90_000;

function config(apiKey: string | undefined): OpenAPIConfig {
	return {
		BASE: LINKUP_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TIMEOUT: LINKUP_TIMEOUT_MS,
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey ?? ''}`,
		},
	};
}

// Core's request() retries a 429 itself, honouring Retry-After.
export async function linkupGet<T>(
	apiKey: string | undefined,
	url: string,
	// Arrays become repeated query keys (type=search&type=fetch).
	query?: Record<string, string | number | string[] | undefined>,
): Promise<T> {
	const requestOptions: ApiRequestOptions = { method: 'GET', url, query };
	return await request<T>(config(apiKey), requestOptions);
}

export async function linkupPost<T>(
	apiKey: string | undefined,
	url: string,
	// JSON body built by the endpoint from its validated input.
	body: Record<string, unknown> | unknown[],
): Promise<T> {
	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url,
		body,
		mediaType: 'application/json',
	};
	return await request<T>(config(apiKey), requestOptions);
}

// Narrows untyped provider JSON; callers check each field they read.
export function asRecord(value: unknown): Record<string, unknown> | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: undefined;
}

/** Path segment from caller input, escaped. */
export function seg(value: string): string {
	return encodeURIComponent(value);
}

/** Drop undefined fields so the body only carries what the caller set. */
// fields are already-validated inputs of mixed types, copied through unchanged.
export function defined(fields: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);
}
