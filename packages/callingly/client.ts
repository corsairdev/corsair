import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Normalized error thrown when an HTTP call to Callingly fails.
 */
export class CallinglyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		/**
		 * Raw response payload returned from the Callingly API for debugging.
		 * Typed as unknown because error payloads can be arbitrary JSON objects or error strings.
		 */
		public readonly responseData?: unknown,
		public readonly method?: string,
	) {
		super(message);
		this.name = 'CallinglyAPIError';
	}
}

export const CALLINGLY_API_BASE = 'https://api.callingly.com/v1';

/**
 * Request options for makeCallinglyRequest.
 */
export type MakeCallinglyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	/**
	 * JSON request body payload. Keys and values are serializable properties sent to the Callingly API.
	 */
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	accountId?: string;
};

export async function makeCallinglyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: MakeCallinglyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, accountId } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};

	let finalQuery = query;
	let finalBody = body;

	if (accountId) {
		headers['X-Account-Id'] = accountId;
		if (method === 'GET' || method === 'DELETE') {
			finalQuery = { account_id: accountId, ...query };
		} else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
			finalBody = { account_id: accountId, ...body };
		}
	}

	const config: OpenAPIConfig = {
		BASE: CALLINGLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? finalBody
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: finalQuery,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof CallinglyAPIError) {
			throw error;
		}
		if (error && typeof error === 'object' && 'status' in error) {
			// Type narrowing safely inspects HTTP client error shape with fallback messages
			const errObj = error as {
				status?: unknown;
				message?: string;
				body?: { message?: string } | unknown;
			};
			const status = Number(errObj.status) || undefined;
			const bodyObj =
				errObj.body && typeof errObj.body === 'object'
					? (errObj.body as { message?: string })
					: undefined;
			const message =
				errObj.message ||
				bodyObj?.message ||
				`Callingly API error (${status ?? 'unknown'})`;
			throw new CallinglyAPIError(message, status, errObj.body, method);
		}
		if (error instanceof Error) {
			throw new CallinglyAPIError(error.message, undefined, undefined, method);
		}
		throw new CallinglyAPIError(
			'Unknown error communicating with Callingly API',
			undefined,
			undefined,
			method,
		);
	}
}
