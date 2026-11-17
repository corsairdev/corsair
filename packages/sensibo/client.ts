import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const SENSIBO_API_BASE = 'https://home.sensibo.com';

/** Sensibo serves the timer and schedule routes from v1 and the rest from v2. */
export type SensiboApiVersion = 'v1' | 'v2';

export type SensiboRequest = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	/** Path after `/api/<version>`, with every path value already encoded. */
	path: string;
	version?: SensiboApiVersion;
	query?: Record<string, string | number | undefined>;
	body?: Record<string, unknown>;
};

/** Encode one path value so ids cannot add path segments. */
export function pathPart(value: string): string {
	return encodeURIComponent(value);
}

/**
 * Sensibo takes the key as the `apiKey` query parameter, not a header.
 * Core's `request()` keeps its default 429 retries (it honours Retry-After).
 */
export async function makeSensiboRequest<T>(
	apiKey: string,
	req: SensiboRequest,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: SENSIBO_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const method = req.method ?? 'GET';
	const requestOptions: ApiRequestOptions = {
		method,
		url: `/api/${req.version ?? 'v2'}${req.path}`,
		query: {
			apiKey,
			...req.query,
		},
		...(req.body !== undefined
			? { body: req.body, mediaType: 'application/json' }
			: {}),
	};

	return await request<T>(config, requestOptions);
}
