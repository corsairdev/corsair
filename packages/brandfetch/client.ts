import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const BRANDFETCH_API_BASE = 'https://api.brandfetch.io';
export const BRANDFETCH_GRAPHQL_BASE = 'https://graphql.brandfetch.io';
export const BRANDFETCH_CDN_BASE = 'https://cdn.brandfetch.io';

export class BrandfetchAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'BrandfetchAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const NO_DEK_ERROR_PATTERN = /no dek found/i;

export async function resolveClientId(input: {
	inputClientId?: string;
	optionClientId?: string;
	storedClientId?: string;
}): Promise<string> {
	const clientId =
		input.inputClientId ?? input.optionClientId ?? input.storedClientId;
	if (!clientId) {
		throw new BrandfetchAPIError(
			'Brandfetch clientId is required for Brand Search and Logo CDN',
		);
	}
	return clientId;
}

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> | undefined {
	const compacted: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return Object.keys(compacted).length > 0 ? compacted : undefined;
}

export async function makeBrandfetchRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		base?: string;
		bearer?: boolean;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		base = BRANDFETCH_API_BASE,
		bearer = true,
	} = options;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: bearer ? apiKey : undefined,
		HEADERS: {
			Accept: 'application/json',
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
		query: compactQuery(query ?? {}),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BrandfetchAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new BrandfetchAPIError(error.message, undefined, { cause: error });
		}
		throw new BrandfetchAPIError('Unknown error');
	}
}

type GraphqlResponse<T> = {
	data?: T;
	errors?: Array<{ message?: string }>;
};

export async function makeBrandfetchGraphqlRequest<T>(
	apiKey: string,
	query: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const result = await makeBrandfetchRequest<GraphqlResponse<T>>('/', apiKey, {
		method: 'POST',
		body: variables ? { query, variables } : { query },
		base: BRANDFETCH_GRAPHQL_BASE,
	});

	if (result.errors?.length) {
		throw new BrandfetchAPIError(
			result.errors[0]?.message ?? 'GraphQL request failed',
		);
	}
	if (result.data === undefined) {
		throw new BrandfetchAPIError('Empty GraphQL response');
	}
	return result.data;
}
