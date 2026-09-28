import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class BeaconstacAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BeaconstacAPIError';
	}
}

export class BeaconstacRateLimitError extends BeaconstacAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body, retryAfterMs);
		this.name = 'BeaconstacRateLimitError';
	}
}

/** Official Uniqode REST + reporting host. https://apidocs.uniqode.com/ */
export const BEACONSTAC_API_BASE = 'https://api.uniqode.com';

export type BeaconstacRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: ApiError): string {
	const body =
		typeof error.body === 'object' && error.body !== null
			? (error.body as Record<string, unknown>)
			: undefined;
	return (
		(body && typeof body.detail === 'string' ? body.detail : undefined) ||
		(body && 'message' in body ? String(body.message) : undefined) ||
		(body && 'error' in body ? String(body.error) : undefined) ||
		error.message
	);
}

export function compactQuery(
	query: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(query).filter(([, value]) => value !== undefined),
	);
}

export async function makeBeaconstacRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BeaconstacRequestOptions & { method: 'DELETE' },
): Promise<T>;
export async function makeBeaconstacRequest<T>(
	endpoint: string,
	apiKey: string,
	options?: BeaconstacRequestOptions,
): Promise<T | undefined>;
export async function makeBeaconstacRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BeaconstacRequestOptions = {},
): Promise<T | undefined> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: BEACONSTAC_API_BASE,
		VERSION: '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			Authorization: `Token ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite ? body : undefined,
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
				throw new BeaconstacRateLimitError(
					errorMessage(error),
					error.retryAfter,
					error.body,
				);
			}
			throw new BeaconstacAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new BeaconstacAPIError(error.message);
		}
		throw new BeaconstacAPIError('Unknown error');
	}
}
