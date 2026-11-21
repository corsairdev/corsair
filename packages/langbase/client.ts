import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class LangbaseAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string | number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'LangbaseAPIError';
	}
}

export const LANGBASE_API_BASE = 'https://api.langbase.com/v1';

export const LANGBASE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

export async function makeLangbaseRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: object;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('langbase', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: LANGBASE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LANGBASE_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		// `error` is untrusted because fetch implementations may reject with any value.
		if (error instanceof Error) {
			throw error;
		}
		throw new LangbaseAPIError(
			'Unknown error occurred during Langbase request',
		);
	}
}

function parseRetryAfterMs(value: string | null): number | undefined {
	if (value === null) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

export async function uploadLangbaseDocument(
	signedUrl: string,
	content: Blob,
	contentType: string,
): Promise<{ ok: boolean; status: number; statusText: string }> {
	const absoluteUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(signedUrl)
		? signedUrl
		: `https://${signedUrl}`;
	let uploadUrl: URL;
	try {
		uploadUrl = new URL(absoluteUrl);
	} catch {
		throw new LangbaseAPIError(
			'Langbase returned an invalid document upload URL',
		);
	}
	if (
		uploadUrl.protocol !== 'https:' ||
		!uploadUrl.hostname.toLowerCase().endsWith('.langbase.com') ||
		uploadUrl.username.length > 0 ||
		uploadUrl.password.length > 0
	) {
		throw new LangbaseAPIError(
			'Langbase returned an invalid document upload URL',
		);
	}

	let response: Response;
	try {
		response = await fetch(uploadUrl, {
			method: 'PUT',
			headers: { 'Content-Type': contentType },
			body: content,
			credentials: 'omit',
			redirect: 'error',
			signal: AbortSignal.timeout(60_000),
		});
	} catch {
		// The signed URL is a temporary credential; do not propagate fetch errors
		// that can contain it.
		throw new LangbaseAPIError(
			'Langbase document upload failed before a response',
		);
	}

	if (!response.ok) {
		throw new LangbaseAPIError(
			`Langbase document upload failed (HTTP ${response.status})`,
			response.status,
			undefined,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}

	return {
		ok: response.ok,
		status: response.status,
		statusText: response.statusText,
	};
}
