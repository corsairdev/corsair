import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ClickupAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ClickupAPIError';
	}
}

export const CLICKUP_API_V2_BASE = 'https://api.clickup.com/api/v2';
export const CLICKUP_API_V3_BASE = 'https://api.clickup.com/api/v3';

export type ClickupApiVersion = 'v2' | 'v3';

export type ClickupQueryValue =
	| string
	| number
	| boolean
	| ReadonlyArray<string | number>;

export async function makeClickupRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		version?: ClickupApiVersion;
		// unknown: request JSON varies by ClickUp operation; Zod parses at callers.
		body?: Record<string, unknown>;
		query?: Record<string, ClickupQueryValue | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', version = 'v2', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: version === 'v3' ? CLICKUP_API_V3_BASE : CLICKUP_API_V2_BASE,
		VERSION: version === 'v3' ? '3.0.0' : '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: token,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so error-handlers.ts can match 429 status/retryAfter.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ClickupAPIError(error.message);
		}
		throw new ClickupAPIError('Unknown error');
	}
}
