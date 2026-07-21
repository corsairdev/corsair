import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AlgoliaMethod } from './endpoints/routes';

export class AlgoliaAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Algolia returns a heterogeneous error shape across endpoints (RFC 7807
	// for some, plain { message } for others, plus per-endpoint metadata), so
	// we carry the raw body as `unknown` and let callers narrow per-route.
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'AlgoliaAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

export type AlgoliaRequestOptions = {
	method?: AlgoliaMethod;
	// Each Algolia operation carries its own Zod-validated input shape; this
	// layer just forwards whatever body/query the route produced without
	// re-modeling them, hence `unknown` for the per-call surface.
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeAlgoliaRequest<T>(
	endpoint: string,
	applicationId: string,
	apiKey: string,
	options: AlgoliaRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, baseUrl } = options;
	if (!baseUrl) {
		throw new AlgoliaAPIError('[algolia] baseUrl is required');
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Algolia-Application-Id': applicationId,
			'X-Algolia-API-Key': apiKey,
			...headers,
		},
	};

	const hasBody =
		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AlgoliaAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new AlgoliaAPIError(error.message, { cause: error });
		}
		throw new AlgoliaAPIError('Unknown error');
	}
}
