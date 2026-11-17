import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const SYMPLA_API_BASE = 'https://api.sympla.com.br';

/** The API version in Sympla's current reference (developers.sympla.com.br). */
export const SYMPLA_API_VERSION = 'v1.6.0';

export type SymplaRequest = {
	method?: 'GET' | 'POST';
	/** Path after `/public/v1.6.0`, with every path value already encoded. */
	path: string;
	query?: Record<string, string | number | boolean | undefined>;
	// unknown: each operation's zod input schema has already checked the body.
	body?: Record<string, unknown>;
};

/** Encode one path value so ids cannot add path segments. */
export function pathPart(value: string | number): string {
	return encodeURIComponent(String(value));
}

/**
 * Sympla takes the key in the `s_token` header. Core's `request()` keeps its
 * default 429 retries (it honours Retry-After).
 */
export async function makeSymplaRequest<T>(
	apiKey: string,
	req: SymplaRequest,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SYMPLA_API_BASE,
		VERSION: SYMPLA_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			s_token: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: req.method ?? 'GET',
		url: `/public/${SYMPLA_API_VERSION}${req.path}`,
		query: req.query,
		...(req.body !== undefined
			? { body: req.body, mediaType: 'application/json' }
			: {}),
	};

	return await request<T>(config, requestOptions);
}
