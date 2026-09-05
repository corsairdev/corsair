import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class CampaynAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CampaynAPIError';
	}
}

export const CAMPAYN_API_BASE = 'https://campayn.com/api/v1';

function extractErrorMessage(body: unknown): string | undefined {
	if (typeof body !== 'object' || body === null) return undefined;

	const payload = body as {
		message?: unknown;
		msg?: unknown;
		error?: unknown;
		errors?: unknown;
	};

	if (typeof payload.message === 'string' && payload.message.length > 0) {
		return payload.message;
	}

	if (typeof payload.msg === 'string' && payload.msg.length > 0) {
		return payload.msg;
	}

	if (typeof payload.error === 'string' && payload.error.length > 0) {
		return payload.error;
	}

	if (Array.isArray(payload.errors)) {
		const first = payload.errors[0];
		if (typeof first === 'string') {
			return first;
		}
	}

	return undefined;
}

function extractErrorCode(body: unknown): string | number | undefined {
	if (typeof body !== 'object' || body === null) return undefined;

	const payload = body as { code?: unknown; errorCode?: unknown };
	if (typeof payload.code === 'string' || typeof payload.code === 'number') {
		return payload.code;
	}

	if (
		typeof payload.errorCode === 'string' ||
		typeof payload.errorCode === 'number'
	) {
		return payload.errorCode;
	}

	return undefined;
}

export async function makeCampaynRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, baseUrl = CAMPAYN_API_BASE } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `TRUEREST apikey=${apiKey}`,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CampaynAPIError(
				extractErrorMessage(error.body) ?? error.message,
				extractErrorCode(error.body),
				error.status,
				error.retryAfter,
			);
		}

		if (error instanceof Error) {
			throw new CampaynAPIError(error.message);
		}

		throw new CampaynAPIError('Unknown Campayn API error');
	}
}
