import { createHash } from 'node:crypto';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ContentfulGraphqlAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly statusText?: string;
	// Contentful returns GraphQL errors in the JSON body, so we carry the raw
	// body as `unknown` and let callers narrow per-request.
	public readonly body?: unknown;
	public readonly retryAfter?: number | string;

	constructor(message: string, options?: { code?: string; cause?: Error }) {
		super(message, options);
		this.name = 'ContentfulGraphqlAPIError';
		this.code = options?.code;
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const CONTENTFUL_GRAPHQL_API_BASE = 'https://graphql.contentful.com';

const CONTENTFUL_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'X-Contentful-RateLimit-Reset',
	},
};

export function buildContentfulGraphqlPath(
	spaceId: string,
	environmentId?: string,
): string {
	const base = `/content/v1/spaces/${encodeURIComponent(spaceId)}`;
	return environmentId
		? `${base}/environments/${encodeURIComponent(environmentId)}`
		: base;
}

export function sha256(input: string): string {
	return createHash('sha256').update(input).digest('hex');
}

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{
		message: string;
		extensions?: { code?: string };
	}>;
}

export interface ContentfulGraphqlPersistedQueryOptions {
	sha256Hash: string;
	query?: string;
	variables?: Record<string, unknown>;
	operationName?: string;
}

export function isPersistedQueryNotFound(
	error: ContentfulGraphqlAPIError,
): boolean {
	return (
		error.code === 'PERSISTED_QUERY_NOT_FOUND' ||
		error.message.includes('PersistedQueryNotFound')
	);
}

export async function makeContentfulGraphqlRequest<T>(
	path: string,
	apiKey: string,
	body: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: CONTENTFUL_GRAPHQL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: path,
		body,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<GraphQLResponse<T>>(config, requestOptions, {
			rateLimitConfig: CONTENTFUL_RATE_LIMIT_CONFIG,
		});

		if (response.errors && response.errors.length > 0) {
			// non-null assertion safe: length > 0 check above
			const firstError = response.errors[0]!;
			throw new ContentfulGraphqlAPIError(firstError.message, {
				code: firstError.extensions?.code,
			});
		}

		if (response.data === undefined || response.data === null) {
			throw new ContentfulGraphqlAPIError(
				'No data returned from Contentful GraphQL API',
			);
		}

		return response.data;
	} catch (error) {
		if (error instanceof ContentfulGraphqlAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			// Include the response body for richer error messages (e.g. GraphQL validation errors)
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText}: ${bodyDetail}`
				: error.statusText || 'Unknown API Error';
			throw new ContentfulGraphqlAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new ContentfulGraphqlAPIError(error.message, { cause: error });
		}
		throw new ContentfulGraphqlAPIError('Unknown error');
	}
}

export async function makeContentfulGraphqlPersistedQueryRequest<T>(
	path: string,
	apiKey: string,
	options: ContentfulGraphqlPersistedQueryOptions,
): Promise<T> {
	const { sha256Hash, query, variables, operationName } = options;

	const buildBody = (includeQuery: boolean): Record<string, unknown> => ({
		...(includeQuery && query ? { query } : {}),
		...(variables ? { variables } : {}),
		...(operationName ? { operationName } : {}),
		extensions: {
			persistedQuery: { version: 1, sha256Hash },
		},
	});

	try {
		// Hash-only first: already-registered queries skip sending the query text.
		return await makeContentfulGraphqlRequest<T>(
			path,
			apiKey,
			buildBody(false),
		);
	} catch (error) {
		// PersistedQueryNotFound: re-send with the full query to register it (APQ protocol).
		if (
			query &&
			error instanceof ContentfulGraphqlAPIError &&
			isPersistedQueryNotFound(error)
		) {
			return await makeContentfulGraphqlRequest<T>(
				path,
				apiKey,
				buildBody(true),
			);
		}
		throw error;
	}
}
