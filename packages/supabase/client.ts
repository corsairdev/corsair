import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { SupabaseMethod } from './endpoints/operations';

export class SupabaseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'SupabaseAPIError';
	}
}

const SUPABASE_API_BASE = 'https://api.supabase.com';

export type SupabaseRequestOptions = {
	method?: SupabaseMethod;
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	mediaType?: string;
	baseUrl?: string;
};

export async function makeSupabaseRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SupabaseRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers,
		baseUrl = SUPABASE_API_BASE,
	} = options;
	const mediaType = options.mediaType ?? 'application/json; charset=utf-8';

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': mediaType.startsWith('application/x-www-form-urlencoded')
				? 'application/x-www-form-urlencoded'
				: 'application/json',
			Authorization: `Bearer ${apiKey}`,
			...headers,
		},
	};

	const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new SupabaseAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}
