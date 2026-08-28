import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TextrazorAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(message: string, options?: { cause?: Error; body?: unknown }) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'TextrazorAPIError';
		this.body = options?.body;

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = this.body ?? options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

/** @see https://www.textrazor.com/docs/rest */
export const TEXTRAZOR_API_BASE = 'https://api.textrazor.com';

const TEXTRAZOR_ERRORS = {
	400: 'Bad Request',
	401: 'Unauthorized',
	413: 'Request too large',
	429: 'Too Many Requests',
	500: 'Internal Server Error',
};

export function appendFormValue(
	params: URLSearchParams,
	key: string,
	value: unknown,
): void {
	if (value === undefined || value === null) return;
	if (Array.isArray(value)) {
		if (value.length === 0) return;
		params.append(key, value.map(String).join(','));
		return;
	}
	if (typeof value === 'boolean') {
		params.append(key, value ? 'true' : 'false');
		return;
	}
	params.append(key, String(value));
}

export function toFormBody(fields: Record<string, unknown>): string {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(fields)) {
		appendFormValue(params, key, value);
	}
	return params.toString();
}

function parseBody<T>(body: unknown): T {
	if (typeof body !== 'string') {
		return body as T;
	}
	const trimmed = body.trim();
	if (trimmed.length === 0) {
		return {} as T;
	}
	try {
		return JSON.parse(trimmed) as T;
	} catch {
		return body as T;
	}
}

function buildConfig(apiKey: string): OpenAPIConfig {
	return {
		BASE: TEXTRAZOR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'X-TextRazor-Key': apiKey,
		},
	};
}

async function send<T>(
	config: OpenAPIConfig,
	requestOptions: ApiRequestOptions,
): Promise<T> {
	try {
		const raw = await request<unknown>(config, requestOptions);
		return parseBody<T>(raw);
	} catch (error) {
		if (error instanceof Error) {
			throw new TextrazorAPIError(error.message, { cause: error });
		}
		throw new TextrazorAPIError('Unknown TextRazor API error');
	}
}

export async function makeTextrazorRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		form?: Record<string, unknown>;
		json?: unknown;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const config = buildConfig(apiKey);
	const form =
		options.form !== undefined ? toFormBody(options.form) : undefined;
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query: options.query,
		errors: TEXTRAZOR_ERRORS,
		body: form ?? options.json,
		mediaType:
			options.form !== undefined
				? 'application/x-www-form-urlencoded'
				: options.json !== undefined
					? 'application/json'
					: undefined,
	};

	return send<T>(config, requestOptions);
}

type Envelope = {
	ok?: boolean;
	error?: string;
	message?: string;
};

export function assertTextrazorOk<T extends Envelope>(body: T): T {
	if (body.ok === false) {
		throw new TextrazorAPIError(
			body.error || body.message || 'TextRazor request failed',
			{ body },
		);
	}
	return body;
}
