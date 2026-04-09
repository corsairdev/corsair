import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DropboxAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DropboxAPIError';
	}
}

const DROPBOX_API_BASE = 'https://api.dropboxapi.com/2';
export const DROPBOX_CONTENT_BASE = 'https://content.dropboxapi.com/2';

const DROPBOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function extractDropboxError(error: ApiError): string {
	// any cast needed because ApiError.body is typed as `any` (untyped API response)
	const body = error.body as
		| Record<string, unknown>
		| string
		| undefined
		| null;
	if (!body) return `[${error.status}] ${error.message}`;

	// Dropbox error responses with a string body (e.g. HTML error pages from gateway)
	if (typeof body === 'string') {
		const preview = body.length > 300 ? `${body.slice(0, 300)}...` : body;
		return `[${error.status}] ${preview}`;
	}

	if (typeof body.error_summary === 'string')
		return `[${error.status}] ${body.error_summary}`;

	// Dropbox wraps structured errors in an `error` object with `.tag`
	const errObj = body.error;
	if (errObj && typeof errObj === 'object') {
		// unknown cast needed because body.error is typed as `unknown` (value of Record<string, unknown>)
		const tag = (errObj as Record<string, unknown>)['.tag'];
		if (typeof tag === 'string') return `[${error.status}] ${tag}`;
	}

	// Fallback: surface the full body for debugging
	try {
		return `[${error.status}] ${JSON.stringify(body)}`;
	} catch {
		return `[${error.status}] ${error.message}`;
	}
}

export async function makeDropboxRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
		extraHeaders?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'POST', body, query, baseUrl, extraHeaders } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? DROPBOX_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
			...extraHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType:
			typeof body === 'string'
				? 'application/octet-stream'
				: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: DROPBOX_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DropboxAPIError(
				extractDropboxError(error),
				String(error.status),
			);
		}
		if (error instanceof Error) {
			throw new DropboxAPIError(error.message);
		}
		throw new DropboxAPIError('Unknown error');
	}
}
