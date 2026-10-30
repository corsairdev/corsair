import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TripadvisorAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// unknown is used here because the provider error payload is untyped wire
	// JSON; it is only stored for inspection and never cast without checks.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, code?: number, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'TripadvisorAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else {
			this.status = code;
		}
	}
}

const TRIPADVISOR_API_BASE = 'https://terra.tripadvisor.com/api';

/** Sends an authenticated request to the Tripadvisor Terra API. */
export async function makeTripadvisorRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown is used here because request bodies carry arbitrary
		// provider JSON; values are serialized as-is and never cast.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | string[] | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: TRIPADVISOR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'X-API-Key': apiKey,
			...(isWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof TripadvisorAPIError) throw error;
		if (error instanceof ApiError) {
			throw new TripadvisorAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new TripadvisorAPIError(error.message, undefined, { cause: error });
		}
		throw new TripadvisorAPIError('Unknown Tripadvisor API error');
	}
}
