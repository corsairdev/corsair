import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LeverAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'LeverAPIError';
	}
}

// Lever authenticates API keys with HTTP Basic (key as username, empty
// password) and OAuth 2.0 access tokens as bearer credentials.
export type LeverAuthType = 'api_key' | 'oauth_2';

const LEVER_API_BASE = 'https://api.lever.co/v1';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

const encodeBasicCredential = (apiKey: string): string => {
	const credentials = `${apiKey}:`;
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(credentials, 'utf8').toString('base64');
	}
	return btoa(credentials);
};

// Retry-After is either delta-seconds or an HTTP-date. The shared retry path
// expects milliseconds, so normalize both forms before surfacing the error.
const parseRetryAfterMs = (value: string | null): number | undefined => {
	if (!value) return undefined;
	const seconds = Number(value);
	if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
	const retryAt = Date.parse(value);
	if (Number.isNaN(retryAt)) return undefined;
	return Math.max(0, retryAt - Date.now());
};

export const resolveLeverAuthorizationHeader = (
	credential: string,
	authType: LeverAuthType,
): string =>
	authType === 'oauth_2'
		? `Bearer ${credential}`
		: `Basic ${encodeBasicCredential(credential)}`;

export async function makeLeverRequest<T>(
	ctx: { key: string; options?: { authType?: LeverAuthType } },
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Lever request bodies differ by operation and are validated by the
		// corresponding endpoint schema before reaching this transport boundary.
		// unknown: the endpoint schemas validate each provider-specific body.
		body?: Record<string, unknown>;
		query?: Record<string, string | string[] | number | boolean | undefined>;
		headers?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, headers } = options;
	const authType: LeverAuthType = ctx.options?.authType ?? 'api_key';

	const config: OpenAPIConfig = {
		BASE: LEVER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: resolveLeverAuthorizationHeader(ctx.key, authType),
			...headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		// Lever accepts JSON bodies on DELETE too (e.g. requisition field
		// option removal), so bodies are sent for every non-GET method.
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		// Writes carry query parameters too: Lever reads perform_as (and a few
		// flags such as send_confirmation_email) from the URL on POST/PUT/DELETE.
		query,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new LeverAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new LeverAPIError(error.message);
		}
		throw new LeverAPIError('Unknown Lever API error');
	}
}

// Binary downloads cannot ride the shared JSON client: it reads every
// non-JSON response with response.text(), which corrupts bytes that are not
// valid UTF-8 (PDF, DOCX). This path fetches raw bytes and returns them
// base64-encoded so the payload survives the JSON transport intact.
export async function makeLeverBinaryRequest(
	ctx: { key: string; options?: { authType?: LeverAuthType } },
	endpoint: string,
	options: {
		headers?: Record<string, string>;
		query?: Record<string, string | undefined>;
	} = {},
): Promise<{ data: string; contentType: string }> {
	const authType: LeverAuthType = ctx.options?.authType ?? 'api_key';
	const params = new URLSearchParams();
	for (const [name, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) params.append(name, value);
	}
	const search = params.size > 0 ? `?${params.toString()}` : '';
	const response = await fetch(`${LEVER_API_BASE}${endpoint}${search}`, {
		method: 'GET',
		headers: {
			Accept: 'application/octet-stream',
			Authorization: resolveLeverAuthorizationHeader(ctx.key, authType),
			...options.headers,
		},
	});
	if (!response.ok) {
		throw new LeverAPIError(
			`Lever binary download failed with status ${response.status}`,
			response.status,
			undefined,
			parseRetryAfterMs(response.headers.get('retry-after')),
		);
	}
	const contentType =
		response.headers.get('content-type') ?? 'application/octet-stream';
	const buffer = await response.arrayBuffer();
	const data = Buffer.from(buffer).toString('base64');
	return { data, contentType };
}
