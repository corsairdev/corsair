import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class NextDNSAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'NextDNSAPIError';
	}
}

/**
 * Confirmed from the provider's own API docs (nextdns.github.io/api) - the
 * REST API (currently in beta) is served from a single host, distinct from
 * the `my.nextdns.io` dashboard and `nextdns.io` marketing site.
 */
const NEXTDNS_API_BASE = 'https://api.nextdns.io';

export async function makeNextDNSRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: NEXTDNS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Left unset deliberately: the shared request layer injects
		// `Authorization: Bearer {TOKEN}` whenever this is set, which would be
		// wrong here - auth travels as `X-Api-Key` instead (set below).
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			// Confirmed from the provider's docs: "Pass your API key via the
			// X-Api-Key header for every call" - not a Bearer token.
			'X-Api-Key': apiKey,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new NextDNSAPIError(error.message);
		}
		throw new NextDNSAPIError('Unknown error');
	}
}
