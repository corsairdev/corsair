import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GOOGLE_ADS_API_BASE = 'https://googleads.googleapis.com';

/**
 * Google Ads API version. The version is part of every path, and Google
 * supports a few at a time, so it is pinned here rather than by the caller.
 * v26 was the current version when this plugin was built.
 */
export const GOOGLE_ADS_API_VERSION = 'v26';

/** The OAuth scope every Google Ads call requires. */
export const GOOGLE_ADS_SCOPE = 'https://www.googleapis.com/auth/adwords';

/**
 * A 429 RESOURCE_EXHAUSTED is the documented quota rejection. Google's guidance
 * is exponential backoff, and no Retry-After is documented.
 */
const GOOGLE_ADS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Retries belong to error-handlers.ts, which knows a search may be repeated
	// and a mutate may not.
	maxRetries: 0,
	enabled: true,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'retry-after' },
};

export type GoogleAdsRequest = {
	method: 'GET' | 'POST';
	/** A path below the version segment, e.g. `/customers/1/campaigns:mutate`. */
	path: string;
	// unknown: each endpoint builds this from a zod-parsed input.
	body?: unknown; // unknown: each endpoint builds this from a zod-parsed input.
};

/**
 * A failure that never reached Google: a dropped connection, a DNS failure, a
 * timeout or an abort. It carries the method so the error handlers can replay a
 * read and leave a mutate alone, which a bare TypeError cannot.
 */
export class GoogleAdsTransportError extends Error {
	readonly isRead: boolean;

	constructor(message: string, isRead: boolean, cause: Error) {
		super(message, { cause });
		this.name = 'GoogleAdsTransportError';
		this.isRead = isRead;
	}
}

export type GoogleAdsClientConfig = {
	/** The OAuth access token, which core resolves into `ctx.key`. */
	accessToken: string;
	/**
	 * The developer token from the Google Ads API Center. Every call needs it;
	 * without one Google answers a `HeaderError` even with a valid token.
	 */
	developerToken: string;
	/**
	 * The manager account's customer ID, needed only when calling a client
	 * account as its manager. Hyphens must be removed.
	 */
	loginCustomerId?: string;
};

/**
 * Sends one Google Ads request.
 *
 * core's ApiError is rethrown untouched (R8) so the handlers can match its
 * status and core can refresh an expired token after a 401. Anything else
 * failed before a response arrived.
 *
 * unknown: the resolved value is the raw response body; callers parse it with
 * the endpoint's zod output schema.
 */
export async function makeGoogleAdsRequest(
	config: GoogleAdsClientConfig,
	{ method, path, body }: GoogleAdsRequest,
): Promise<unknown> {
	// unknown: parsed by the caller's output schema.
	const headers: Record<string, string> = {
		Accept: 'application/json',
		'developer-token': config.developerToken,
	};
	if (config.loginCustomerId) {
		headers['login-customer-id'] = config.loginCustomerId;
	}

	const requestConfig: OpenAPIConfig = {
		BASE: `${GOOGLE_ADS_API_BASE}/${GOOGLE_ADS_API_VERSION}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: config.accessToken,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'GET' ? undefined : body,
		mediaType: method === 'GET' ? undefined : 'application/json',
	};

	const isRead = isReadRequest(method, path);
	try {
		// unknown: the response body is checked by the caller's output schema.
		return await request<unknown>(requestConfig, requestOptions, {
			rateLimitConfig: GOOGLE_ADS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		// DOMException can fail `instanceof Error` across realms.
		if (error instanceof Error || error instanceof DOMException) {
			throw new GoogleAdsTransportError(error.message, isRead, error);
		}
		throw new GoogleAdsTransportError(
			'Unknown transport failure',
			isRead,
			new Error('Unknown'),
		);
	}
}

/**
 * The POST methods that only read. Google Ads sends a GAQL query in the body,
 * so `googleAds:search`, `googleAds:searchStream` and `googleAdsFields:search`
 * are POSTs that change nothing and are safe to repeat. Every other POST is a
 * mutate.
 */
const READ_ONLY_POST_SUFFIXES = [
	'/googleAds:search',
	'/googleAds:searchStream',
	'/googleAdsFields:search',
] as const;

/** Whether a request only reads, so a 5xx or a dropped connection may be replayed. */
export function isReadRequest(method: string, path: string): boolean {
	if (method.toUpperCase() === 'GET') return true;
	const bare = path.split('?')[0] ?? path;
	return READ_ONLY_POST_SUFFIXES.some((suffix) => bare.endsWith(suffix));
}

/**
 * A customer ID is a bare number in every path and header. Google rejects a
 * hyphenated one with `CLIENT_CUSTOMER_ID_INVALID`, so the plugin strips
 * hyphens rather than failing, which is what the docs ask a caller to do.
 */
export function customerPathId(customerId: string): string {
	const digits = customerId.replace(/-/g, '').trim();
	if (!/^\d+$/.test(digits)) {
		// The value itself is account data, so the message names only the format.
		throw new Error(
			'Invalid Google Ads customer ID: expected digits, optionally hyphenated',
		);
	}
	return digits;
}

/**
 * Builds the resource name an update or remove takes, from either the bare id
 * or the full resource name, e.g. `customers/1/campaigns/2`. The supplied value
 * is account data, so an error names only the expected format.
 */
export function entityResourceName(
	customerId: string,
	id: string,
	collection: 'campaigns' | 'campaignBudgets' | 'adGroups',
): string {
	if (id.startsWith('customers/')) {
		const pattern = new RegExp(`^customers/\\d+/${collection}/\\d+$`);
		if (!pattern.test(id)) {
			throw new Error(
				`Invalid ${collection} resource name: expected customers/<id>/${collection}/<id>`,
			);
		}
		return id;
	}
	if (!/^\d+$/.test(id)) {
		throw new Error(
			`Invalid ${collection} id: expected digits or a full resource name`,
		);
	}
	return `customers/${customerId}/${collection}/${id}`;
}
