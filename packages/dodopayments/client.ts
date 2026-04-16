import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class DodoPaymentsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly reason?: string,
		public readonly source?: string,
	) {
		super(message);
		this.name = 'DodoPaymentsAPIError';
	}
}

/**
 * Makes an authenticated request to the Dodo Payments API.
 * @param endpoint - API endpoint path (e.g., 'payments', 'payments/pay_123')
 * @param apiKey - Bearer token credentials
 * @param options - Request options (method, body, query)
 */
export async function makeDodoPaymentsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const apiBase = apiKey.startsWith('test_')
		? 'https://test.dodopayments.com'
		: 'https://live.dodopayments.com';

	const config: OpenAPIConfig = {
		BASE: apiBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
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
			const apiErr = error as {
				body?: {
					error?: {
						code?: string;
						message?: string;
						reason?: string;
						source?: string;
					};
				};
			};
			const dodoError = apiErr.body?.error;
			throw new DodoPaymentsAPIError(
				dodoError?.message ?? error.message,
				dodoError?.code,
				dodoError?.reason,
				dodoError?.source,
			);
		}
		throw new DodoPaymentsAPIError('Unknown error');
	}
}
