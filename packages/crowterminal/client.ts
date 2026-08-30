import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CrowterminalAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CrowterminalAPIError';
	}
}

export const CROWTERMINAL_API_BASE = 'https://api.crowterminal.com';

/**
 * Escapes a value being spliced into a request path. Without this a clientId of
 * `../status` retargets the credentialed request at a different endpoint, and
 * one containing `?` appends a query string.
 */
export function pathSegment(value: string): string {
	return encodeURIComponent(value);
}

export async function makeCrowterminalRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = CROWTERMINAL_API_BASE,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// request.ts applies TOKEN after HEADERS, so the bearer goes here rather
		// than being set twice.
		TOKEN: apiKey,
		HEADERS: { 'Content-Type': 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType: 'application/json',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// ApiError carries status and retryAfter, which error-handlers.ts needs to
		// classify auth and rate-limit failures. Rewrapping would strip both.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) throw new CrowterminalAPIError(error.message);
		throw new CrowterminalAPIError('Unknown error');
	}
}
