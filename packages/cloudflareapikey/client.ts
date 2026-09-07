import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { CloudflareApiKeyAPIError } from './api-error';
import type { CloudflareApiResponse } from './response';
import {
	cloudflareErrorFromApiErrorBody,
	unwrapCloudflareResponse,
} from './response';

export { CloudflareApiKeyAPIError } from './api-error';

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

export async function makeCloudflareApiKeyRequest<T>(
	path: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		body?: Record<string, unknown>; // endpoint Zod already validated this JSON body
		query?: Record<string, string | number | boolean | undefined>;
		rawBody?: string;
		mediaType?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, rawBody, mediaType } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: CLOUDFLARE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${token}`,
			...(rawBody != null ? {} : { 'Content-Type': 'application/json' }),
		},
	};

	const requestOptions: ApiRequestOptions =
		rawBody != null
			? {
					method,
					url: path,
					query,
					body: rawBody,
					mediaType: mediaType ?? 'application/octet-stream',
				}
			: {
					method,
					url: path,
					query,
					body: isWriteMethod ? body : undefined,
					mediaType: isWriteMethod ? 'application/json' : undefined,
				};

	try {
		const response = await request<CloudflareApiResponse<T> | T>(
			config,
			requestOptions,
		);
		return unwrapCloudflareResponse<T>(response);
	} catch (error) {
		if (error instanceof CloudflareApiKeyAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const mapped = cloudflareErrorFromApiErrorBody(error.body);
			if (mapped) {
				throw new CloudflareApiKeyAPIError(
					mapped.message,
					mapped.code,
					error.status,
					error.retryAfter,
				);
			}
			throw new CloudflareApiKeyAPIError(
				error.message,
				undefined,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new CloudflareApiKeyAPIError(error.message);
		}
		throw new CloudflareApiKeyAPIError('Unknown error');
	}
}
