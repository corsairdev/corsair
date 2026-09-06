import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CarboneAPIError extends Error {
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
		this.name = 'CarboneAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const CARBONE_API_BASE = 'https://api.carbone.io';
export const CARBONE_API_VERSION = '5';

export type CarboneRequestOptions = {
	apiKey?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
};

function buildConfig(
	apiKey?: string,
	customHeaders: Record<string, string> = {},
): OpenAPIConfig {
	return {
		BASE: CARBONE_API_BASE,
		VERSION: '5.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'carbone-version': CARBONE_API_VERSION,
			...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			...customHeaders,
		},
	};
}

async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError) {
		throw new CarboneAPIError(error.message, error.status, {
			cause: error,
		});
	}
	if (error instanceof Error) {
		throw new CarboneAPIError(error.message, undefined, { cause: error });
	}
	throw new CarboneAPIError('Unknown Carbone API error');
}

export async function makeCarboneRequest<T>(
	endpoint: string,
	options: CarboneRequestOptions = {},
): Promise<T> {
	const { apiKey, method = 'GET', body, query = {}, headers = {} } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config = buildConfig(apiKey, {
		...(isWrite ? { 'Content-Type': 'application/json' } : {}),
		...headers,
	});

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
		return handleRequestError(error);
	}
}

export function assertCarboneSuccess<
	T extends { success?: boolean; error?: unknown; message?: string },
>(response: T): T {
	if (response.success === false) {
		const message =
			typeof response.error === 'string'
				? response.error
				: typeof response.message === 'string'
					? response.message
					: 'Carbone API request returned failure';
		throw new CarboneAPIError(message);
	}
	return response;
}
