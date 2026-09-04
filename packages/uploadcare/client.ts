import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class UploadcareAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'UploadcareAPIError';
	}
}

const UPLOADCARE_API_BASE = 'https://api.uploadcare.com';

export async function makeUploadcareRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const authHeader = apiKey.startsWith('Uploadcare.Simple ')
		? apiKey
		: `Uploadcare.Simple ${apiKey}`;

	const config: OpenAPIConfig = {
		BASE: UPLOADCARE_API_BASE,
		VERSION: '0.7.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/vnd.uploadcare-v0.7+json',
			Authorization: authHeader,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: body !== undefined ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: any) {
		if (error instanceof ApiError) {
			const msg =
				typeof error.body === 'object' && error.body && 'detail' in error.body
					? String((error.body as any).detail)
					: typeof error.body === 'object' && error.body && 'message' in error.body
						? String((error.body as any).message)
						: error.message;
			throw new UploadcareAPIError(
				msg || error.message,
				(error.body as any)?.code,
				error.status,
				error.body,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new UploadcareAPIError(error.message);
		}
		throw new UploadcareAPIError('Unknown error');
	}
}

