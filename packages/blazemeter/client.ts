import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const BLAZEMETER_BASE_URLS = {
	core: 'https://a.blazemeter.com/api/v4',
	asset: 'https://ar.blazemeter.com/api/v1',
	tdm: 'https://tdm.blazemeter.com/api/v1',
	mock: 'https://mock.blazemeter.com/api/v1',
} as const;

export type BlazemeterApi = keyof typeof BLAZEMETER_BASE_URLS;
export type BlazemeterMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class BlazemeterAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(message: string, options?: { cause?: unknown }) {
		super(message, options);
		this.name = 'BlazemeterAPIError';
		const cause = options?.cause;
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.statusText = cause.statusText;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
		}
	}
}

const READ_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		remaining: 'X-RateLimit-Remaining',
		limit: 'X-RateLimit-Limit',
		resetTime: 'X-RateLimit-Reset',
	},
};

const NO_RETRY_CONFIG: RateLimitConfig = {
	...READ_RATE_LIMIT_CONFIG,
	maxRetries: 0,
};

export type BlazemeterCredentials = {
	apiKeyId: string;
	apiKeySecret: string;
};

export function parseBlazemeterCredentials(key: string): BlazemeterCredentials {
	const separator = key.indexOf(':');
	if (separator <= 0 || separator === key.length - 1) {
		throw new BlazemeterAPIError(
			'BlazeMeter credentials must contain both API key ID and secret',
		);
	}
	return {
		apiKeyId: key.slice(0, separator),
		apiKeySecret: key.slice(separator + 1),
	};
}

export function basicAuthorization(key: string): string {
	const credentials = parseBlazemeterCredentials(key);
	const encoded = Buffer.from(
		`${credentials.apiKeyId}:${credentials.apiKeySecret}`,
	).toString('base64');
	return `Basic ${encoded}`;
}

export type BlazemeterRequestOptions = {
	api: BlazemeterApi;
	method: BlazemeterMethod;
	body?: Record<string, unknown>;
	formData?: Record<string, unknown>;
	query?: Record<string, unknown>;
	idempotent: boolean;
};

export function compactRecord(
	value: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
	if (!value) return undefined;
	const compacted = Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined),
	);
	return Object.keys(compacted).length > 0 ? compacted : undefined;
}

function makeConfig(
	api: BlazemeterApi,
	key: string,
	isJsonWrite: boolean,
): OpenAPIConfig {
	return {
		BASE: BLAZEMETER_BASE_URLS[api],
		VERSION: api === 'core' ? '4' : '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			Authorization: basicAuthorization(key),
			...(isJsonWrite ? { 'Content-Type': 'application/json' } : {}),
		},
	};
}

export async function makeBlazemeterRequest<T>(
	endpoint: string,
	key: string,
	options: BlazemeterRequestOptions,
): Promise<T> {
	const body = compactRecord(options.body);
	const formData = compactRecord(options.formData);
	const query = compactRecord(options.query);
	const isJsonWrite =
		options.method !== 'GET' &&
		options.method !== 'DELETE' &&
		!formData &&
		body !== undefined;

	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: endpoint,
		body: isJsonWrite ? body : undefined,
		formData: formData,
		mediaType: isJsonWrite ? 'application/json; charset=utf-8' : undefined,
		query: query,
	};

	try {
		return await request<T>(
			makeConfig(options.api, key, isJsonWrite),
			requestOptions,
			{
				rateLimitConfig: options.idempotent
					? READ_RATE_LIMIT_CONFIG
					: NO_RETRY_CONFIG,
			},
		);
	} catch (error) {
		if (error instanceof BlazemeterAPIError) throw error;
		if (error instanceof Error) {
			throw new BlazemeterAPIError(error.message, { cause: error });
		}
		throw new BlazemeterAPIError('Unknown BlazeMeter API error');
	}
}
