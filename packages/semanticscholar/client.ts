import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SEMANTICSCHOLAR_API_BASE = 'https://api.semanticscholar.org';

export type SemanticScholarQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type SemanticScholarRequestOptions = {
	method?: 'GET' | 'POST';
	body?: Record<string, unknown>;
	query?: SemanticScholarQuery;
};

export type SemanticScholarErrorBody = {
	message?: string;
	error?: string;
	code?: string;
};

function compactQuery(query?: SemanticScholarQuery) {
	if (!query) return undefined;
	const compacted: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return Object.keys(compacted).length > 0 ? compacted : undefined;
}

function asErrorBody(
	body: ApiError['body'],
): SemanticScholarErrorBody | undefined {
	if (!body || typeof body !== 'object') return undefined;
	const record = body as Record<string, unknown>;
	return {
		message: typeof record.message === 'string' ? record.message : undefined,
		error: typeof record.error === 'string' ? record.error : undefined,
		code: typeof record.code === 'string' ? record.code : undefined,
	};
}

export class SemanticScholarAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly retryAfter?: number;
	public readonly body?: SemanticScholarErrorBody;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			retryAfter?: number;
			body?: SemanticScholarErrorBody;
		},
	) {
		super(message, options);
		this.name = 'SemanticScholarAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.retryAfter = options.cause.retryAfter ?? options.retryAfter;
			this.body = options.body ?? asErrorBody(options.cause.body);
		} else {
			this.retryAfter = options?.retryAfter;
			this.body = options?.body;
		}
	}
}

export async function makeSemanticScholarRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SemanticScholarRequestOptions = {},
): Promise<T> {
	const key = apiKey.trim();
	if (!key) {
		throw new SemanticScholarAPIError(
			'API key is required for Semantic Scholar API requests',
		);
	}

	const config: OpenAPIConfig = {
		BASE: SEMANTICSCHOLAR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'x-api-key': key,
		},
	};

	const method = options.method ?? 'GET';
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint.slice(1) : endpoint,
		body: method === 'POST' ? options.body : undefined,
		mediaType:
			method === 'POST' ? 'application/json; charset=utf-8' : undefined,
		query: compactQuery(options.query),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new SemanticScholarAPIError(error.message, {
				cause: error,
				body: asErrorBody(error.body),
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new SemanticScholarAPIError(error.message, { cause: error });
		}
		throw new SemanticScholarAPIError('Unknown Semantic Scholar API error');
	}
}
