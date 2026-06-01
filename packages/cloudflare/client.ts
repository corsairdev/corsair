import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { CloudflareAPIError } from './api-error';
import type { CloudflareApiResponse } from './response';
import {
	cloudflareErrorFromApiErrorBody,
	unwrapCloudflareResponse,
} from './response';

export { CloudflareAPIError } from './api-error';

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

export async function makeCloudflareRequest<T>(
	path: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		// JSON bodies use loose records because each endpoint accepts different fields.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		rawBody?: string;
		mediaType?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, formData, rawBody, mediaType } = options;

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const isMultipart = formData != null;

	const config: OpenAPIConfig = {
		BASE: CLOUDFLARE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${token}`,
			...(isMultipart || rawBody != null
				? {}
				: { 'Content-Type': 'application/json' }),
		},
	};

	const requestOptions: ApiRequestOptions = isMultipart
		? {
				method,
				url: path,
				query,
				// Multipart fields are strings or Blobs; corsair/http accepts a loose record.
				formData: formData as Record<string, unknown>,
			}
		: rawBody != null
			? {
					method,
					url: path,
					query,
					body: rawBody,
					mediaType: mediaType ?? 'application/javascript',
				}
			: {
					method,
					url: path,
					query,
					body: isWriteMethod ? body : undefined,
					mediaType: 'application/json',
				};

	try {
		const response = await request<CloudflareApiResponse<T> | T>(
			config,
			requestOptions,
		);
		return unwrapCloudflareResponse<T>(response);
	} catch (error) {
		if (error instanceof CloudflareAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const mapped = cloudflareErrorFromApiErrorBody(error.body);
			if (mapped) {
				throw mapped;
			}
			throw new CloudflareAPIError(error.message, error.status);
		}
		if (error instanceof Error) {
			throw new CloudflareAPIError(error.message);
		}
		throw new CloudflareAPIError('Unknown error');
	}
}
