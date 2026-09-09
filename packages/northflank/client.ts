import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class NorthflankAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'NorthflankAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

export const NORTHFLANK_API_BASE = 'https://api.northflank.com/v1';

export type NorthflankMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type NorthflankRequestOptions = {
	method?: NorthflankMethod;
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export async function makeNorthflankRequest<T>(
	endpoint: string,
	apiKey: string,
	options: NorthflankRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const config: OpenAPIConfig = {
		BASE: NORTHFLANK_API_BASE,
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
		url: cleanEndpoint,
		body: hasBody ? body : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			let message = error.message;
			const bodyData = error.body;
			if (
				bodyData &&
				typeof bodyData === 'object' &&
				'error' in bodyData &&
				typeof (bodyData as Record<string, unknown>).error === 'object' &&
				(bodyData as Record<string, unknown>).error !== null
			) {
				const nested = (bodyData as Record<string, unknown>).error as Record<
					string,
					unknown
				>;
				if (typeof nested.message === 'string') {
					message = nested.message;
				}
			} else if (
				bodyData &&
				typeof bodyData === 'object' &&
				'message' in bodyData &&
				typeof (bodyData as Record<string, unknown>).message === 'string'
			) {
				message = (bodyData as Record<string, unknown>).message as string;
			}
			throw new NorthflankAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new NorthflankAPIError(error.message, { cause: error });
		}
		throw new NorthflankAPIError('Unknown Northflank API error');
	}
}
