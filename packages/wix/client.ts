import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WixAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'WixAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

export const WIX_API_BASE = 'https://www.wixapis.com';

const WIX_ALLOWED_HOSTS = new Set(['www.wixapis.com']);

function resolveWixBase(baseUrl?: string): string {
	const resolvedBase = baseUrl ?? WIX_API_BASE;
	let url: URL;
	try {
		url = new URL(resolvedBase);
	} catch {
		throw new WixAPIError(`[wix] invalid baseUrl: ${resolvedBase}`);
	}

	const hostname = url.hostname.replace(/\.$/, '').toLowerCase();
	if (
		url.protocol !== 'https:' ||
		(url.port !== '' && url.port !== '443') ||
		!WIX_ALLOWED_HOSTS.has(hostname)
	) {
		throw new WixAPIError(
			`[wix] baseUrl host not allowed: ${hostname || resolvedBase}`,
		);
	}

	return resolvedBase;
}

const WIX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type WixAuthType = 'api_key' | 'oauth_2';

export type WixRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
	/**
	 * Which credential `token` holds. OAuth access tokens authenticate as
	 * `Authorization: Bearer <token>`; API keys authenticate as the raw
	 * `Authorization: <token>` value. Defaults to the plugin default
	 * (`oauth_2`).
	 */
	authType?: WixAuthType;
	/**
	 * Site-level scoping for API key auth. Sent as the `wix-site-id` header.
	 * Required on site-level calls when authenticating with an API key.
	 */
	siteId?: string;
	/**
	 * Account-level scoping for API key auth. Sent as the `wix-account-id` header.
	 * Use instead of `siteId` for account-level calls; never send both.
	 */
	accountId?: string;
};

export async function makeWixRequest<T>(
	endpoint: string,
	token: string,
	options: WixRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		headers,
		baseUrl,
		siteId,
		accountId,
		authType = 'oauth_2',
	} = options;
	const resolvedBase = resolveWixBase(baseUrl);

	// Wix requires exactly one scope header per API-key request; sending both
	// is undefined behavior and may be rejected by the API.
	if (siteId && accountId) {
		throw new WixAPIError(
			'[wix] siteId and accountId are mutually exclusive; set only one scope',
		);
	}

	// Auth: OAuth access tokens use `Authorization: Bearer <token>` while API
	// keys use the raw `Authorization: <token>` value (no Bearer prefix).
	// Do NOT set TOKEN here: corsair's request() overwrites Authorization
	// with `Bearer ${TOKEN}`, which breaks API-key auth. Custom headers are
	// merged first and any case-insensitive Authorization entry is stripped
	// so a caller-supplied header can never replace the credential.
	const customHeaders: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers ?? {})) {
		// Authorization is always derived from the stored token, and the
		// scope headers are always derived from the validated siteId /
		// accountId options. WHATWG `Headers` merges case variants into a
		// comma-separated value, so any caller-supplied casing of these
		// three headers would corrupt the real one and is dropped here.
		const lowerKey = key.toLowerCase();
		if (
			lowerKey === 'authorization' ||
			lowerKey === 'wix-site-id' ||
			lowerKey === 'wix-account-id'
		) {
			continue;
		}
		customHeaders[key] = value;
	}
	const config: OpenAPIConfig = {
		BASE: resolvedBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...customHeaders,
			Authorization: authType === 'oauth_2' ? `Bearer ${token}` : token,
			...(siteId ? { 'wix-site-id': siteId } : {}),
			...(accountId ? { 'wix-account-id': accountId } : {}),
		},
	};

	const hasBody =
		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: hasBody ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		// Wix DELETE endpoints accept required query parameters (e.g.
		// `revision` on delete-loyalty-coupon), so query is sent for every
		// method, not just GET.
		query,
	};

	try {
		// Automatic 429 retries are limited to safe (GET/HEAD/OPTIONS) and
		// idempotent (DELETE) methods. POST/PUT/PATCH bodies such as
		// bulkCreateProductsWithInventory and bulkDeleteProducts are not
		// idempotent and Wix offers no stable idempotency key here, so a
		// throttled write must surface instead of silently re-executing.
		const retryable = ['GET', 'HEAD', 'OPTIONS', 'DELETE'].includes(method);
		return await request<T>(config, requestOptions, {
			rateLimitConfig: retryable
				? WIX_RATE_LIMIT_CONFIG
				: { ...WIX_RATE_LIMIT_CONFIG, enabled: false, maxRetries: 0 },
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof Error) {
			throw new WixAPIError(error.message, { cause: error });
		}
		throw new WixAPIError('Unknown error');
	}
}
