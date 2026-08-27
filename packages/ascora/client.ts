import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ASCORA_API_BASE = 'https://api.ascora.com.au';

export class AscoraAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'AscoraAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else if (typeof code === 'number') {
			this.status = code;
		}
	}
}

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> | undefined {
	const compacted: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return Object.keys(compacted).length > 0 ? compacted : undefined;
}

export function ascoraPathSegment(value: string): string {
	if (value.includes('{') || value.includes('}')) {
		throw new AscoraAPIError('Invalid request path');
	}
	return encodeURIComponent(value);
}

export function assertAscoraSuccess(payload: unknown): void {
	if (
		payload === null ||
		typeof payload !== 'object' ||
		Array.isArray(payload)
	) {
		return;
	}
	const record = payload as {
		success?: unknown;
		message?: unknown;
		code?: unknown;
	};
	if (record.success === false) {
		throw new AscoraAPIError(
			typeof record.message === 'string' && record.message.length > 0
				? record.message
				: 'Ascora request failed',
		);
	}
}

export async function makeAscoraRequest<T>(
	apiKey: string,
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, formData } = options;

	if (endpoint.includes('{') || endpoint.includes('}')) {
		throw new AscoraAPIError('Invalid request path');
	}

	const config: OpenAPIConfig = {
		BASE: ASCORA_API_BASE,
		VERSION: '1.7',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Auth: apiKey,
			Accept: 'application/json',
		},
	};

	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWrite && !formData ? body : undefined,
		formData: isWrite && formData ? formData : undefined,
		mediaType:
			isWrite && !formData ? 'application/json; charset=utf-8' : undefined,
		query: compactQuery(query ?? {}),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new AscoraAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new AscoraAPIError(error.message, undefined, { cause: error });
		}
		throw new AscoraAPIError('Unknown error');
	}
}
