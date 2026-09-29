import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BreatheHrAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BreatheHrAPIError';
	}
}

export class BreatheHrRateLimitError extends BreatheHrAPIError {
	constructor(
		message = 'Rate Limit Reached',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body, retryAfterMs);
		this.name = 'BreatheHrRateLimitError';
	}
}

/** Official production host. https://developer.breathehr.com/documentation/environments */
export const BREATHE_HR_API_BASE = 'https://api.breathehr.com/v1';

/** Official sandbox host. https://developer.breathehr.com/documentation/environments */
export const BREATHE_HR_SANDBOX_API_BASE =
	'https://api.sandbox.breathehr.info/v1';

export function breatheHrBaseUrl(apiKey: string): string {
	return apiKey.startsWith('sandbox-')
		? BREATHE_HR_SANDBOX_API_BASE
		: BREATHE_HR_API_BASE;
}

export type BreatheHrRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown;
	query?: Record<string, unknown>;
};

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	const nested =
		body && typeof body.error === 'object' && body.error !== null
			? (body.error as Record<string, unknown>)
			: undefined;
	return (
		(nested && 'message' in nested ? String(nested.message) : undefined) ||
		(nested && 'type' in nested ? String(nested.type) : undefined) ||
		(body && typeof body.message === 'string' ? body.message : undefined) ||
		error.message
	);
}

export function compactQuery(
	query: Record<string, unknown> = {},
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	) as Record<string, string | number | boolean | undefined>;
}

export async function makeBreatheHrRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BreatheHrRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: breatheHrBaseUrl(apiKey),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-API-KEY': apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? (body as Record<string, unknown>) : undefined,
		mediaType: isWrite ? 'application/json; charset=utf-8' : undefined,
		query: compactQuery(query),
	};

	try {
		const result = await request<T>(config, requestOptions);
		if (result === undefined && method === 'DELETE') {
			return { deleted: true } as T;
		}
		return result;
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new BreatheHrRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new BreatheHrAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new BreatheHrAPIError(error.message);
		}
		throw new BreatheHrAPIError('Unknown error');
	}
}
