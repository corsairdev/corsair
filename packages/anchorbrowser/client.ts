import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AnchorBrowserMethod } from './endpoints/routes';

export class AnchorBrowserAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// body is unknown because Anchor Browser error payloads vary by endpoint and are not schema-validated here.
	public readonly body?: unknown;
	/** HTTP method of the failed request, so retry policy can tell safe reads from mutations. */
	public readonly method?: AnchorBrowserMethod;

	constructor(
		message: string,
		options?: { cause?: Error; method?: AnchorBrowserMethod },
	) {
		super(message, options);
		this.name = 'AnchorBrowserAPIError';
		this.method = options?.method;
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const ANCHORBROWSER_API_BASE = 'https://api.anchorbrowser.io/v1';

export type AnchorBrowserRequestOptions = {
	method?: AnchorBrowserMethod;
	// body is unknown because request payloads vary per Anchor Browser endpoint and are built dynamically.
	body?: unknown;
	// query values are heterogeneous (pagination, filters); not fully typed across 64 ops.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeAnchorBrowserRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AnchorBrowserRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const config: OpenAPIConfig = {
		BASE: ANCHORBROWSER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			'anchor-api-key': apiKey,
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
		if (error instanceof Error) {
			throw new AnchorBrowserAPIError(error.message, { cause: error, method });
		}
		throw new AnchorBrowserAPIError('Unknown error', { method });
	}
}
