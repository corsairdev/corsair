import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GoogleAddressValidationAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'GoogleAddressValidationAPIError';

		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

const GOOGLEADDRESSVALIDATION_API_BASE =
	'https://addressvalidation.googleapis.com';

export async function makeGoogleAddressValidationRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'POST', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: GOOGLEADDRESSVALIDATION_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': apiKey,
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
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new GoogleAddressValidationAPIError(
				error.message,
				String(error.status),
				{
					status: error.status,
					statusText: error.statusText,
					body: error.body,
					retryAfter: error.retryAfter,
				},
			);
		}

		if (error instanceof Error) {
			throw new GoogleAddressValidationAPIError(error.message, undefined, {
				cause: error,
			});
		}

		throw new GoogleAddressValidationAPIError('Unknown error');
	}
}
