import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const BART_API_BASE = 'https://api.bart.gov/api';

export class BartAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error; retryAfter?: number; body?: unknown },
	) {
		super(message, options);
		this.name = 'BartAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else if (code !== undefined) {
			this.status = code;
			this.retryAfter = options?.retryAfter;
			this.body = options?.body;
		}
	}
}

export function compactQuery(
	query: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			out[key] = value;
		}
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

export type BartRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, unknown>;
	headers?: Record<string, string>;
};

function extractErrorMessage(payload: unknown): string | null {
	if (!payload || typeof payload !== 'object') return null;

	const record = payload as Record<string, unknown>;

	// Check for root.message.error.text or root.message.error
	if (record.message && typeof record.message === 'object') {
		const msg = record.message as Record<string, unknown>;
		if (msg.error && typeof msg.error === 'object') {
			const err = msg.error as Record<string, unknown>;
			if (typeof err.text === 'string' && err.text.trim().length > 0) {
				return err.text.trim();
			}
		}
		if (typeof msg.error === 'string' && msg.error.trim().length > 0) {
			return msg.error.trim();
		}
	}

	// Check for root.error.text or root.error
	if (record.error && typeof record.error === 'object') {
		const err = record.error as Record<string, unknown>;
		if (typeof err.text === 'string' && err.text.trim().length > 0) {
			return err.text.trim();
		}
	}
	if (typeof record.error === 'string' && record.error.trim().length > 0) {
		return record.error.trim();
	}

	return null;
}

export async function makeBartRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: BartRequestOptions = {},
): Promise<T> {
	const { method = 'GET', query = {}, body, headers: extraHeaders } = options;

	if (!apiKey || apiKey.trim().length === 0) {
		throw new BartAPIError('API key is required for BART API requests', 401);
	}

	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		key: apiKey.trim(),
		json: 'y',
	};

	const config: OpenAPIConfig = {
		BASE: BART_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			...extraHeaders,
		},
	};

	const urlPath = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

	const requestOptions: ApiRequestOptions = {
		method,
		url: urlPath,
		query: compactQuery(queryWithAuth),
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json',
	};

	let rawResponse: unknown;
	try {
		rawResponse = await request<unknown>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const errorMsg = extractErrorMessage(error.body) ?? error.message;
			throw new BartAPIError(errorMsg, error.status, {
				cause: error,
				body: error.body,
				retryAfter: error.retryAfter,
			});
		}
		if (error instanceof Error) {
			throw new BartAPIError(error.message, undefined, { cause: error });
		}
		throw new BartAPIError('Unknown error');
	}

	// Unwrap BART root object if present
	let data: unknown = rawResponse;
	if (rawResponse && typeof rawResponse === 'object' && 'root' in rawResponse) {
		data = (rawResponse as { root: unknown }).root;
	}

	// Detect in-body error messages from BART even with 200 HTTP status
	const errorMessage =
		extractErrorMessage(data) ?? extractErrorMessage(rawResponse);
	if (errorMessage) {
		throw new BartAPIError(errorMessage, undefined, { body: rawResponse });
	}

	return data as T;
}
