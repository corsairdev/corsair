import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ArynAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ArynAPIError';
	}
}

const ARYN_API_BASE = 'https://api.aryn.ai';

/**
 * Parse Aryn's `Retry-After` header (seconds) into milliseconds so the
 * rate-limit error handler can feed `headersRetryAfterMs` for raw-fetch paths.
 */
export function parseArynRetryAfterMs(response: Response): number | undefined {
	const raw = response.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number.parseInt(raw, 10);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return seconds * 1000;
}

export async function makeArynBinaryRequest(
	endpoint: string,
	apiKey: string,
	baseUrl = ARYN_API_BASE,
): Promise<ArrayBuffer> {
	const url = `${baseUrl}${endpoint}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});
	if (!res.ok) {
		const bodyText = await res.text();
		throw new ArynAPIError(
			`Request failed with status ${res.status}: ${res.statusText}; body: "${bodyText}"`,
			undefined,
			res.status,
			parseArynRetryAfterMs(res),
		);
	}
	return res.arrayBuffer();
}

export async function makeArynRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		formData,
		baseUrl = ARYN_API_BASE,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			!formData && (method === 'POST' || method === 'PUT' || method === 'PATCH')
				? body
				: undefined,
		formData,
		mediaType: formData ? undefined : 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve status / Retry-After so error-handlers can classify and retry.
		if (error instanceof ApiError) {
			throw new ArynAPIError(
				error.message,
				undefined,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new ArynAPIError(error.message);
		}
		throw new ArynAPIError('Unknown error');
	}
}
