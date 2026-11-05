import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AffindaMethod } from './endpoints/routes';

export class AffindaAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// body is unknown because Affinda error payloads vary by endpoint and are not schema-validated here.
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'AffindaAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const AFFINDA_API_BASE = 'https://api.affinda.com/v3';

export type AffindaRequestOptions = {
	method?: AffindaMethod;
	// body is unknown because request payloads vary per Affinda endpoint and are built dynamically.
	body?: unknown;
	// query values are heterogeneous (pagination, filters); not fully typed across 119 ops.
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeAffindaRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AffindaRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const config: OpenAPIConfig = {
		BASE: AFFINDA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// Caller headers first; plugin-owned Authorization/Content-Type always win.
		HEADERS: {
			...headers,
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
			throw new AffindaAPIError(error.message, { cause: error });
		}
		throw new AffindaAPIError('Unknown error');
	}
}
