import type { ApiRequestOptions } from 'corsair/http';
import type { OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ApifyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'ApifyAPIError';
	}
}

const APIFY_API_BASE = 'https://api.apify.com/v2';

export type ApifyApiEnvelope<T> = { data: T };
export type ApifyApiErrorBody = {
	error?: {
		type?: string;
		message?: string;
	};
};

function getApifyErrorType(error: unknown): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = error.body as ApifyApiErrorBody | undefined;
	return body?.error?.type;
}

export async function makeApifyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: APIFY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw new ApifyAPIError(
				error.message,
				getApifyErrorType(error) ??
					(error instanceof ApiError ? String(error.status) : undefined),
			);
		}
		throw new ApifyAPIError('Unknown error');
	}
}

export async function makeApifyRequestData<T>(
	endpoint: string,
	apiKey: string,
	options: Parameters<typeof makeApifyRequest<unknown>>[2] = {},
): Promise<T> {
	const envelope = await makeApifyRequest<ApifyApiEnvelope<T>>(endpoint, apiKey, options);
	return envelope.data;
}
