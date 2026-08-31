import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DripcelAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'DripcelAPIError';
	}
}

export class DripcelRateLimitError extends DripcelAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'DripcelRateLimitError';
	}
}

const DRIPCEL_API_BASE = 'https://api.dripcel.com';

export type DripcelRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

function formatError(error: unknown): string {
	if (typeof error === 'string') return error;
	if (Array.isArray(error)) {
		try {
			return JSON.stringify(error);
		} catch {
			return 'Dripcel request failed';
		}
	}
	if (error && typeof error === 'object') {
		const record = error as Record<string, unknown>;
		if (typeof record.message === 'string') return record.message;
		if (typeof record.error === 'string') return record.error;
		try {
			return JSON.stringify(error);
		} catch {
			return 'Dripcel request failed';
		}
	}
	return 'Dripcel request failed';
}

function errorMessage(error: ApiError): string {
	return formatError(error.body) !== 'Dripcel request failed'
		? formatError(error.body)
		: error.message;
}

function retryAfterMs(error: ApiError): number | undefined {
	if (error.retryAfter !== undefined) return error.retryAfter;
	const body =
		error.body && typeof error.body === 'object'
			? (error.body as Record<string, unknown>)
			: undefined;
	const nested =
		body?.error && typeof body.error === 'object'
			? (body.error as Record<string, unknown>)
			: undefined;
	const resetsAt =
		typeof nested?.resetsAt === 'number' ? nested.resetsAt : undefined;
	if (resetsAt === undefined) return undefined;
	return Math.max(0, resetsAt * 1000 - Date.now());
}

function unwrapData<T>(raw: unknown): T {
	if (raw && typeof raw === 'object' && 'ok' in raw) {
		const envelope = raw as { ok: boolean; data?: T; error?: unknown };
		if (!envelope.ok) {
			throw new DripcelAPIError(formatError(envelope.error));
		}
		return envelope.data as T;
	}
	return raw as T;
}

export async function makeDripcelRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DripcelRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: DRIPCEL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body: isWriteMethod ? (body as Record<string, unknown>) : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return unwrapData<T>(await request<unknown>(config, requestOptions));
	} catch (error: unknown) {
		if (error instanceof DripcelAPIError) throw error;
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new DripcelRateLimitError(
					errorMessage(error),
					retryAfterMs(error),
					error.body,
				);
			}
			throw new DripcelAPIError(
				errorMessage(error),
				error.status,
				error.status,
				error.body,
			);
		}
		if (error instanceof Error) {
			throw new DripcelAPIError(error.message);
		}
		throw new DripcelAPIError('Unknown error');
	}
}
