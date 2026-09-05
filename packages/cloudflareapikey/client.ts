import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

type CloudflareEnvelope<T> = {
	result: T;
	success: boolean;
	errors?: Array<{ code?: number; message: string }>;
};

function unwrapCloudflareResponse<T>(response: unknown): T {
	if (typeof response === 'string') return response as T;
	if (
		response !== null &&
		typeof response === 'object' &&
		'success' in response &&
		'result' in response
	) {
		const envelope = response as CloudflareEnvelope<T>;
		if (!envelope.success) {
			throw new CloudflareApiKeyAPIError(
				envelope.errors?.map((error) => error.message).join('; ') ||
					'Cloudflare API request failed',
			);
		}
		return envelope.result;
	}
	return response as T;
}

export class CloudflareApiKeyAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { status?: number; retryAfter?: number; cause?: Error },
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'CloudflareApiKeyAPIError';
		this.status = options?.status;
		this.retryAfter = options?.retryAfter;
	}
}

const CLOUDFLAREAPIKEY_API_BASE = 'https://api.cloudflare.com/client/v4';

export async function makeCloudflareApiKeyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		rawBody?: string;
		mediaType?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, formData, rawBody, mediaType } = options;
	const isWriteMethod = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: CLOUDFLAREAPIKEY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			...(formData ? {} : { 'Content-Type': 'application/json' }),
			Authorization: `Bearer ${apiKey}`,
		},
	};
	const requestOptions: ApiRequestOptions = formData
		? { method, url: endpoint, query, formData }
		: rawBody != null
			? { method, url: endpoint, query, body: rawBody, mediaType: mediaType ?? 'application/javascript' }
			: {
					method,
					url: endpoint,
					body: isWriteMethod ? body : undefined,
					mediaType: isWriteMethod ? 'application/json' : undefined,
					query,
				};

	try {
		const response = await request<CloudflareEnvelope<T> | T>(config, requestOptions);
		return unwrapCloudflareResponse<T>(response);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CloudflareApiKeyAPIError(error.message, String(error.status), {
				status: error.status,
				retryAfter: error.retryAfter,
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new CloudflareApiKeyAPIError(error.message);
		}
		throw new CloudflareApiKeyAPIError('Unknown error');
	}
}
