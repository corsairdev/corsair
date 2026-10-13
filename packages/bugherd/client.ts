import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BugherdAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'BugherdAPIError';
	}
}

const BUGHERD_API_BASE = 'https://www.bugherd.com/api_v2';

function getBasicAuthHeader(apiKey: string): string {
	const credentials = `${apiKey}:x`;
	return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

export async function makeBugherdRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		formData?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, formData, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: BUGHERD_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: getBasicAuthHeader(apiKey),
			...(isWrite && !formData ? { 'Content-Type': 'application/json' } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite && !formData ? body : undefined,
		formData: isWrite && formData ? formData : undefined,
		mediaType:
			isWrite && !formData ? 'application/json; charset=utf-8' : undefined,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// ApiError carries status and retryAfter, which error-handlers.ts needs.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new BugherdAPIError(error.message);
		}
		throw new BugherdAPIError('Unknown error');
	}
}
