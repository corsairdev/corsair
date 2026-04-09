import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class RazorpayAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly reason?: string,
		public readonly source?: string,
	) {
		super(message);
		this.name = 'RazorpayAPIError';
	}
}

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

/**
 * Makes an authenticated request to the Razorpay API.
 * @param endpoint - API endpoint path (e.g., 'orders', 'payments/pay_123')
 * @param apiKey - Credentials in format 'keyId:keySecret' for Basic auth
 * @param options - Request options (method, body, query)
 */
export async function makeRazorpayRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	// Razorpay uses Basic auth with keyId:keySecret
	const config: OpenAPIConfig = {
		BASE: RAZORPAY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: !isWriteMethod ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			// Type assertion: corsair/http's `request` throws a generic Error, but Razorpay
			// error responses carry a `body` property with structured error details that are
			// not exposed by the Error base class.
			const apiErr = error as {
				body?: {
					error?: {
						code?: string;
						description?: string;
						reason?: string;
						source?: string;
					};
				};
			};
			const razorpayError = apiErr.body?.error;
			throw new RazorpayAPIError(
				razorpayError?.description ?? error.message,
				razorpayError?.code,
				razorpayError?.reason,
				razorpayError?.source,
			);
		}
		throw new RazorpayAPIError('Unknown error');
	}
}
