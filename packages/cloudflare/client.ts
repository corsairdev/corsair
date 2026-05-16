import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CloudflareAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'CloudflareAPIError';
	}
}

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

type CloudflareApiResponse<T> = {
	result: T;
	success: boolean;
	errors: Array<{ code: number; message: string }>;
	messages: unknown[];
};

function unwrapCloudflareResponse<T>(response: unknown): T {
	if (
		response &&
		typeof response === 'object' &&
		'success' in response &&
		'result' in response
	) {
		const wrapped = response as CloudflareApiResponse<T>;
		if (!wrapped.success) {
			const message =
				wrapped.errors?.map((e) => e.message).join('; ') ||
				'Cloudflare API request failed';
			const code = wrapped.errors?.[0]?.code;
			throw new CloudflareAPIError(message, code);
		}
		return wrapped.result;
	}
	return response as T;
}

export async function makeCloudflareRequest<T>(
	path: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
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
				formData: formData as Record<string, unknown>,
			}
		: rawBody != null
			? {
					method,
					url: path,
					body: rawBody,
					mediaType: mediaType ?? 'application/javascript',
				}
			: {
					method,
					url: path,
					body: isWriteMethod ? body : undefined,
					mediaType: 'application/json',
					query: method === 'GET' ? query : undefined,
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
			const apiError = error;
			const errorBody = apiError.body as
				| CloudflareApiResponse<unknown>
				| undefined;
			if (
				errorBody &&
				typeof errorBody === 'object' &&
				'errors' in errorBody &&
				Array.isArray(errorBody.errors) &&
				errorBody.errors.length > 0
			) {
				const message = errorBody.errors.map((e) => e.message).join('; ');
				throw new CloudflareAPIError(
					message,
					errorBody.errors[0]?.code ?? apiError.status,
				);
			}
			throw new CloudflareAPIError(apiError.message, apiError.status);
		}
		if (error instanceof Error) {
			throw new CloudflareAPIError(error.message);
		}
		throw new CloudflareAPIError('Unknown error');
	}
}
