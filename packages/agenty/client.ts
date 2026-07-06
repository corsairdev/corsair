import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { AgentyMethod } from './endpoints/routes';

export class AgentyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// body is unknown because Agenty error payloads vary by endpoint and are not schema-validated here.
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'AgentyAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const AGENTY_API_BASE = 'https://api.agenty.com/v2';

export type AgentyRequestOptions = {
	method?: AgentyMethod;
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeAgentyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AgentyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers, baseUrl } = options;
	const resolvedBase = baseUrl ?? AGENTY_API_BASE;
	const mergedQuery = { ...(query ?? {}) };
	if (!mergedQuery.apikey && !mergedQuery.apiKey) {
		mergedQuery.apikey = apiKey;
	}
	const config: OpenAPIConfig = {
		BASE: resolvedBase,
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
		if (error instanceof ApiError) {
			throw new AgentyAPIError(error.message, { cause: error });
		}
		if (error instanceof Error) {
			throw new AgentyAPIError(error.message, { cause: error });
		}
		throw new AgentyAPIError('Unknown error');
	}
}
