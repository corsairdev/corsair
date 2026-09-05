import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class CallinglyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly responseData?: unknown,
	) {
		super(message);
		this.name = 'CallinglyAPIError';
	}
}

export const CALLINGLY_API_BASE = 'https://api.callingly.com/v1';

export type MakeCallinglyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
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

	if (accountId) {
		headers['X-Account-Id'] = accountId;
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
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof CallinglyAPIError) {
			throw error;
		}
		if (error && typeof error === 'object' && 'status' in error) {
			const status =
				Number((error as { status?: unknown }).status) || undefined;
			const message =
				(error as { message?: string }).message ||
				(error as { body?: { message?: string } }).body?.message ||
				`Callingly API error (${status ?? 'unknown'})`;
			throw new CallinglyAPIError(
				message,
				status,
				(error as { body?: unknown }).body,
			);
		}
		if (error instanceof Error) {
			throw new CallinglyAPIError(error.message);
		}
		throw new CallinglyAPIError(
			'Unknown error communicating with Callingly API',
		);
	}
}
