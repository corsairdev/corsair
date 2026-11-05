import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SuzanneAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Error envelopes put an object at `error`. Kept raw so handlers match `code`.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly method?: SuzanneRequestOptions['method'];
	public readonly code?: string;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			body?: unknown;
			method?: SuzanneRequestOptions['method'];
			status?: number;
			retryAfter?: number;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'SuzanneAPIError';
		this.body = options?.body;
		this.method = options?.method;
		this.status = options?.status;
		this.retryAfter = options?.retryAfter;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
		this.code = readCode(this.body);
	}
}

const NO_DEK_ERROR_PATTERN = /no dek found/i;

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

// https://console.suzanne3d.com/documentation — bearer auth, version prefix /v1.
export const SUZANNE_API_BASE = 'https://api.suzanne3d.com';

const NO_TRANSPORT_RETRY: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type SuzanneQueryValue = string | number | boolean | undefined;

export type SuzanneRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: object;
	query?: Record<string, SuzanneQueryValue>;
	path?: Record<string, string>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

// `error` is an object `{ type, code, message, request_id }`, not a string.
function readEnvelope(body: unknown):
	| {
			code?: string;
			message?: string;
	  }
	| undefined {
	if (typeof body !== 'object' || body === null || !('error' in body)) {
		return undefined;
	}
	const envelope = body.error;
	if (typeof envelope !== 'object' || envelope === null) return undefined;
	const code = 'code' in envelope ? envelope.code : undefined;
	const message = 'message' in envelope ? envelope.message : undefined;
	return {
		code: typeof code === 'string' ? code : undefined,
		message: typeof message === 'string' ? message : undefined,
	};
}

function readCode(body: unknown): string | undefined {
	return readEnvelope(body)?.code;
}

function describeFailure(status: number | undefined, body: unknown): string {
	const envelope = readEnvelope(body);
	if (envelope?.code) {
		const detail = envelope.message ? `: ${envelope.message}` : '';
		return `Suzanne ${status ?? 'error'} ${envelope.code}${detail}`;
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return `Suzanne request failed (${status ?? 'unknown'})`;
}

function retryAfterMs(response: Response): number | undefined {
	const header = response.headers.get('retry-after');
	if (!header) return undefined;
	const seconds = Number.parseInt(header, 10);
	if (!Number.isFinite(seconds)) return undefined;
	return seconds * 1000;
}

function buildConfig(baseUrl: string, apiKey: string): OpenAPIConfig {
	return {
		BASE: baseUrl,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
}

export async function makeSuzanneRequest<T>(
	endpoint: string,
	apiKey: string,
	options: SuzanneRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, path, headers } = options;
	const config = buildConfig(options.baseUrl ?? SUZANNE_API_BASE, apiKey);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		headers,
		body,
		mediaType:
			body !== undefined ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRY,
		});
	} catch (error) {
		if (error instanceof SuzanneAPIError) throw error;
		if (error instanceof ApiError) {
			throw new SuzanneAPIError(describeFailure(error.status, error.body), {
				cause: error,
				method,
			});
		}
		if (error instanceof Error) {
			throw new SuzanneAPIError(error.message, { cause: error, method });
		}
		throw new SuzanneAPIError('Suzanne request failed', { method });
	}
}

export type DownloadResult = { url: string };

// Docs: 302 to a 15-minute presigned URL. Read Location ourselves.
export async function makeSuzanneDownloadRequest(
	apiKey: string,
	options: {
		baseUrl?: string;
		jobId: string;
		format: string;
	},
): Promise<DownloadResult> {
	const base = options.baseUrl ?? SUZANNE_API_BASE;
	const jobId = encodeURIComponent(options.jobId);
	const format = encodeURIComponent(options.format);
	const url = `${base}/v1/models/${jobId}/download?format=${format}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			redirect: 'manual',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new SuzanneAPIError(error.message, { cause: error, method: 'GET' });
		}
		throw new SuzanneAPIError('Suzanne request failed', { method: 'GET' });
	}

	if (response.status >= 300 && response.status < 400) {
		const location = response.headers.get('location');
		if (!location) {
			throw new SuzanneAPIError(
				`Suzanne download redirect ${response.status} had no Location`,
				{ method: 'GET', status: response.status },
			);
		}
		return { url: location };
	}

	const text = await response.text();
	// Redirect errors are JSON text until parsed.
	let body: unknown;
	try {
		body = text.length > 0 ? JSON.parse(text) : undefined;
	} catch {
		body = text;
	}

	throw new SuzanneAPIError(describeFailure(response.status, body), {
		body,
		method: 'GET',
		status: response.status,
		retryAfter: response.status === 429 ? retryAfterMs(response) : undefined,
	});
}
