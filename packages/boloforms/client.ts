import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BoloformsAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'BoloformsAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

/**
 * BoloForms Signature API root.
 * Docs: https://bolosign-developer-docs.readme.io/reference/get_get-documents-1
 * Server URL in OpenAPI: https://sapi.boloforms.com/signature
 */
const BOLOFORMS_API_BASE = 'https://sapi.boloforms.com';

const BOLOFORMS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type BoloformsQuery = Record<
	string,
	string | number | boolean | undefined
>;

/**
 * Authenticated request against sapi.boloforms.com.
 * Auth is x-api-key only (ApiKeyAuth). workspaceid is required by get-documents.
 */
export async function makeBoloformsRequest<T>(
	endpoint: string,
	apiKey: string,
	workspaceId: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: BoloformsQuery;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: BOLOFORMS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'x-api-key': apiKey,
			workspaceid: workspaceId,
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
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BOLOFORMS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BoloformsAPIError(
				error.message,
				error.status === undefined ? undefined : String(error.status),
				{ cause: error },
			);
		}
		if (error instanceof Error) {
			throw new BoloformsAPIError(error.message, undefined, { cause: error });
		}
		throw new BoloformsAPIError('Unknown Boloforms error');
	}
}
