import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const XQUIK_API_BASE = 'https://xquik.com/api/v1';
const XQUIK_API_CONTRACT = '2026-04-29';

export type XquikQuery = Record<string, string | number | boolean | undefined>;

export type XquikBody = Record<string, unknown>;

export class XquikAPIError extends Error {
	public readonly body?: unknown;
	public readonly rateLimitLimit?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitReset?: number;
	public readonly retryAfter?: number;
	public readonly status?: number;
	public readonly statusText?: string;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'XquikAPIError';

		if (options?.cause instanceof ApiError) {
			this.body = options.cause.body;
			this.rateLimitLimit = options.cause.rateLimitLimit;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.retryAfter = options.cause.retryAfter;
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
		}
	}
}

export async function makeXquikRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		baseUrl?: string;
		body?: XquikBody;
		method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
		query?: XquikQuery;
	} = {},
): Promise<T> {
	const { baseUrl = XQUIK_API_BASE, body, method = 'GET', query } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'xquik-api-contract': XQUIK_API_CONTRACT,
		},
		TOKEN: undefined,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
	};

	const requestOptions: ApiRequestOptions = {
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		method,
		query: method === 'GET' ? query : undefined,
		url: endpoint,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new XquikAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new XquikAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new XquikAPIError('Unknown Xquik API error');
	}
}
