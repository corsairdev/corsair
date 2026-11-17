import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ECHTPOST_API_BASE = 'https://api.echtpost.de/v2';

function configFor(apiKey: string): OpenAPIConfig {
	return {
		BASE: ECHTPOST_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-Api-Key': apiKey,
		},
	};
}

export type EchtpostQuery = Record<string, string | number | undefined>;

/**
 * Sends one request. Bodies are JSON. A failed request keeps its body on
 * core's ApiError, and card and contact bodies hold names and postal
 * addresses, so the body is dropped before the error leaves the plugin; the
 * error itself (RFC 7807 problem details from EchtPost), status and retry data
 * stay. Core retries a 429 using Retry-After.
 * https://api.echtpost.de/v2/docs
 */
export async function echtpostRequest<T>(
	apiKey: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	url: string,
	options: {
		query?: EchtpostQuery;
		// unknown: each endpoint's JSON body, validated by its input schema.
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const query = options.query
		? Object.fromEntries(
				Object.entries(options.query)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => [key, String(value)]),
			)
		: undefined;
	const requestOptions: ApiRequestOptions = {
		method,
		url,
		query,
		...(options.body
			? { body: options.body, mediaType: 'application/json' }
			: {}),
	};
	try {
		return await request<T>(configFor(apiKey), requestOptions);
	} catch (error) {
		if (error instanceof ApiError && error.request) {
			(error.request as { body?: unknown }).body = undefined;
		}
		throw error;
	}
}

export async function echtpostGet<T>(
	apiKey: string,
	url: string,
	query?: Record<string, string | undefined>,
): Promise<T> {
	return echtpostRequest<T>(apiKey, 'GET', url, { query });
}
