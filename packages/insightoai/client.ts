import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class InsightoaiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'InsightoaiAPIError';
	}
}

const INSIGHTOAI_API_BASE = 'https://api.insighto.ai';

export type InsightoaiQueryValue = string | number | boolean | undefined;

type InsightoaiRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// body shape varies per endpoint and is validated by callers via typed Zod input schemas before being passed here
	body?: Record<string, unknown>;
	query?: Record<string, InsightoaiQueryValue>;
	// Insighto.ai's API key scheme (per docs.insighto.ai/api/ragify) is passed as an
	// `api_key` query parameter, not a header — distinct from the oauth_2 Bearer token below.
	// Defaults to 'api_key' since that's this plugin's default auth type.
	authType?: 'api_key' | 'oauth_2';
};

export async function makeInsightoaiRequest<T>(
	endpoint: string,
	key: string,
	options: InsightoaiRequestOptions,
): Promise<T> {
	const { method = 'GET', body, query, authType = 'api_key' } = options;

	const config: OpenAPIConfig = {
		BASE: INSIGHTOAI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// oauth_2 tokens are forwarded as `Authorization: Bearer <token>` by the shared
		// request core when TOKEN is set; api_key auth is sent as a query param instead.
		TOKEN: authType === 'oauth_2' ? key : undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// DELETE requests can carry a JSON body here (e.g. deleteContactsInBulk,
		// deleteBulkFormsByIds send their ID list in the DELETE body), so only GET — which
		// never has a body — is excluded.
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query: authType === 'api_key' ? { ...query, api_key: key } : query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError (status, retryAfter) unchanged so error-handlers.ts can inspect it.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new InsightoaiAPIError(error.message);
		}
		throw new InsightoaiAPIError('Unknown Insighto.ai API error');
	}
}
