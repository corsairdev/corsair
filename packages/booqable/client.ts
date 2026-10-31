import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { BooqableMethod } from './endpoints/routes';

export class BooqableAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` is intentional here: the body is the raw provider error
	// payload (JSON:API errors object or anything the API returned), so no
	// narrower type can be guaranteed and consumers must narrow it.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'BooqableAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type BooqableRequestOptions = {
	method?: BooqableMethod;
	// `unknown` is intentional here: bodies are provider-defined JSON:API
	// payloads, so the client forwards them without claiming a shape.
	body?: unknown;
	// `unknown` values are intentional here: query params are provider-defined
	// filter/sort/page values forwarded as-is to the Booqable API.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeBooqableRequest<T>(
	endpoint: string,
	apiKey: string,
	companySlug: string,
	options: BooqableRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;

	const config: OpenAPIConfig = {
		BASE: `https://${companySlug}.booqable.com/api/4`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		if (error instanceof ApiError || error instanceof Error) {
			throw new BooqableAPIError(error.message, { cause: error });
		}
		throw new BooqableAPIError('Unknown error');
	}
}
