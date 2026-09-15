import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GiphyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` (not `any`): the shared transport types response bodies as
	// `any`, so the exact shape is unknowable here. Callers must narrow it
	// with a zod schema before reading any property.
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		fields: {
			status?: number;
			statusText?: string;
			// `unknown` (not `any`): accepts whatever the transport attached
			// without letting unvalidated data flow into typed code.
			body?: unknown;
			retryAfter?: number;
			rateLimitReset?: number;
			rateLimitRemaining?: number;
			rateLimitLimit?: number;
		} = {},
	) {
		super(message);
		this.name = 'GiphyAPIError';
		this.status = fields.status;
		this.statusText = fields.statusText;
		this.body = fields.body;
		this.retryAfter = fields.retryAfter;
		this.rateLimitReset = fields.rateLimitReset;
		this.rateLimitRemaining = fields.rateLimitRemaining;
		this.rateLimitLimit = fields.rateLimitLimit;
	}
}

// Bases from https://developers.giphy.com/docs/api/#endpoint:
// - v1 for GIFs, Stickers, Tags, Channels, Categories, Random ID
// - v2 for Emoji (a separate versioned surface, not under /v1)
// - upload.giphy.com for the Upload endpoint (multipart POST)
export const GIPHY_API_BASE = 'https://api.giphy.com/v1';
export const GIPHY_API_V2_BASE = 'https://api.giphy.com/v2';
export const GIPHY_UPLOAD_BASE = 'https://upload.giphy.com/v1';
// Allow-listed by AnalyticsRegisterInputSchema; re-checked here so the
// analytics helper can never be pointed at an arbitrary host.
export const GIPHY_ANALYTICS_HOST = 'giphy-analytics.giphy.com';

export type GiphyRequestBase = 'v1' | 'v2' | 'upload';

const BASE_URLS: Record<GiphyRequestBase, string> = {
	v1: GIPHY_API_BASE,
	v2: GIPHY_API_V2_BASE,
	upload: GIPHY_UPLOAD_BASE,
};

export type GiphyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` values (not `any`): JSON bodies are string-keyed objects whose
	// leaf values are only serialized, never read back as typed data.
	body?: Record<string, unknown>;
	// Multipart parts for the Upload endpoint: binary parts as Blob/File,
	// text fields as string. Values are only appended to FormData, never
	// consumed as typed data, so `unknown` is intentionally avoided here in
	// favour of the exact accepted part types.
	formData?: Record<string, Blob | string>;
	query?: Record<string, string | number | boolean | undefined>;
	base?: GiphyRequestBase;
};

function buildConfig(base: GiphyRequestBase): OpenAPIConfig {
	return {
		BASE: BASE_URLS[base],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		// No hardcoded Content-Type here on purpose: the shared transport
		// spreads config HEADERS into every request, and a fixed
		// `application/json` header would stick to multipart (formData)
		// requests too, breaking the boundary `fetch` generates itself.
		// JSON requests set `mediaType` per request below instead.
		HEADERS: {},
	};
}

// `unknown` (not `any`): `catch` variables and rejected values have no
// statically known type. Each branch narrows with `instanceof` before
// touching the value, so no assertion or narrowing-by-cast is needed.
function wrapError(error: unknown): GiphyAPIError {
	if (error instanceof GiphyAPIError) return error;
	if (error instanceof ApiError) {
		return new GiphyAPIError(error.message, {
			status: error.status,
			statusText: error.statusText,
			body: error.body,
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		});
	}
	if (error instanceof Error) {
		return new GiphyAPIError(error.message);
	}
	return new GiphyAPIError('Unknown error');
}

export async function makeGiphyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: GiphyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, formData, query = {}, base = 'v1' } = options;

	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		api_key: apiKey,
	};

	// formData and body are mutually exclusive: when formData is present,
	// `body`/`mediaType` stay unset so `fetch` generates the multipart
	// boundary itself (same reasoning as the bigmailer plugin's upload).
	const requestOptions: ApiRequestOptions = formData
		? { method, url: endpoint, formData, query: queryWithAuth }
		: {
				method,
				url: endpoint,
				body:
					method === 'POST' || method === 'PUT' || method === 'PATCH'
						? body
						: undefined,
				mediaType: 'application/json; charset=utf-8',
				query: queryWithAuth,
			};

	try {
		return await request<T>(buildConfig(base), requestOptions);
	} catch (error) {
		throw wrapError(error);
	}
}

/**
 * Calls a GIPHY analytics pingback URL from a GIF response's `analytics`
 * object (onload/onclick/onsent).
 * See https://developers.giphy.com/docs/api/endpoint/#action-register.
 *
 * The shared transport always prefixes `config.BASE`, so the pingback URL is
 * split into origin (as BASE) and pathname, with its embedded tracking
 * params merged into the query. The host is re-validated here even though
 * the endpoint input schema already allow-lists it, because this helper is
 * exported and could otherwise fetch an arbitrary URL.
 */
export async function makeGiphyAnalyticsRequest(
	pingbackUrl: string,
	params: {
		customer_id: string;
		ts: number;
	},
): Promise<void> {
	let parsed: URL;
	try {
		parsed = new URL(pingbackUrl);
	} catch {
		throw new GiphyAPIError('Invalid analytics pingback URL');
	}
	if (parsed.hostname.toLowerCase() !== GIPHY_ANALYTICS_HOST) {
		throw new GiphyAPIError(
			'Analytics pingback URL must point to giphy-analytics.giphy.com',
		);
	}

	const config: OpenAPIConfig = {
		BASE: parsed.origin,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {},
	};

	const query: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of parsed.searchParams) {
		query[key] = value;
	}
	query.ts = params.ts;
	query.customer_id = params.customer_id;

	try {
		// `unknown` response type: the pingback returns an empty 200 body,
		// so no shape is assumed — only success (no throw) is observed.
		await request<unknown>(config, {
			method: 'GET',
			url: parsed.pathname,
			query,
		});
	} catch (error) {
		throw wrapError(error);
	}
}
