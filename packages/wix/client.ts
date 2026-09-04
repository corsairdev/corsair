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

export type WixRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	baseUrl?: string;
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
	} = options;
	const resolvedBase = resolveWixBase(baseUrl);

	// Wix REST authenticates with the raw token in the Authorization header
	// (`Authorization: <token>`, no Bearer prefix). Do NOT set TOKEN here:
	// corsair's request() overwrites Authorization with `Bearer ${TOKEN}`,
	// which Wix rejects.
	const config: OpenAPIConfig = {
		BASE: resolvedBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: token,
			...headers,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: WIX_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError || error instanceof Error) {
			throw new WixAPIError(error.message, { cause: error });
		}
		throw new WixAPIError('Unknown error');
	}
}
