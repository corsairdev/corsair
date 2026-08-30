import { AuthMissingError } from 'corsair/core';
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

export function parseArynRetryAfterMs(response: Response): number | undefined {
	const raw = response.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number.parseInt(raw, 10);
	if (!Number.isFinite(seconds) || seconds < 0) return undefined;
	return seconds * 1000;
}

const BINARY_MAX_RETRIES = 3;
const BINARY_INITIAL_RETRY_DELAY_MS = 1000;

export async function makeArynBinaryRequest(
	endpoint: string,
	apiKey: string,
	baseUrl = ARYN_API_BASE,
): Promise<ArrayBuffer> {
	if (!apiKey) {
		throw new AuthMissingError('aryn', 'api_key');
	}
	const url = `${baseUrl}${endpoint}`;
	let attempt = 0;
	while (true) {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		});
		if (res.status === 429 && attempt < BINARY_MAX_RETRIES) {
			const retryAfterMs = parseArynRetryAfterMs(res);
			const delayMs =
				retryAfterMs ?? BINARY_INITIAL_RETRY_DELAY_MS * 2 ** attempt;
			await new Promise((resolve) => setTimeout(resolve, delayMs));
			attempt += 1;
			continue;
		}
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
	if (!apiKey) {
		throw new AuthMissingError('aryn', 'api_key');
	}

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
		if (error instanceof ApiError) {
			throw new ArynAPIError(
				error.message,
				undefined,
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof AuthMissingError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new ArynAPIError(error.message);
		}
		throw new ArynAPIError('Unknown error');
	}
}
