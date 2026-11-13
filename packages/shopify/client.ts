import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/**
 * Shopify versions its Admin API quarterly and keeps each version for a year.
 * `2026-10` is the newest stable version at the time of writing; 2027-01 is a
 * release candidate and would change under callers.
 */
export const SHOPIFY_API_VERSION = '2026-10';

/** Admin API path for one shop. `shopDomain` is the `<shop>.myshopify.com` host. */
export function graphqlUrl(shopDomain: string): string {
	return `/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

/**
 * A typed failure for one GraphQL operation. `extensions.code` is Shopify's
 * own taxonomy (`THROTTLED`, `ACCESS_DENIED`, `SHOP_INACTIVE`, ...), which the
 * error handlers match instead of guessing from HTTP status, because Shopify
 * answers most failures with HTTP 200.
 */
export class ShopifyAPIError extends Error {
	public readonly status?: number;
	public readonly code?: string;
	public readonly retryAfter?: number;
	/** True when the provider never processed the request, so a replay is safe. */
	public readonly transportFailure: boolean;
	/** Read verbs may be replayed on a 5xx; writes may not. */
	public readonly replaySafe: boolean;

	constructor(
		message: string,
		options: {
			status?: number;
			code?: string;
			retryAfter?: number;
			transportFailure?: boolean;
			replaySafe?: boolean;
		} = {},
	) {
		super(message);
		this.name = 'ShopifyAPIError';
		this.status = options.status;
		this.code = options.code;
		this.retryAfter = options.retryAfter;
		this.transportFailure = options.transportFailure ?? false;
		this.replaySafe = options.replaySafe ?? false;
	}
}

type GraphqlErrorEntry = {
	message?: string;
	extensions?: { code?: string };
};

type GraphqlEnvelope<T> = {
	data?: T | null;
	// An auth failure answers `{"errors": "[API] Invalid API key ..."}`: a bare
	// string, not the array every success-shaped payload uses. Both are read.
	errors?: string | GraphqlErrorEntry[];
	extensions?: {
		cost?: {
			requestedQueryCost?: number;
			actualQueryCost?: number | null;
			throttleStatus?: {
				maximumAvailable?: number;
				currentlyAvailable?: number;
				restoreRate?: number;
			};
		};
	};
};

export type ShopifyGraphqlResult<T> = {
	data: T;
	/** Cost points left after this call, when Shopify reported them. */
	currentlyAvailable?: number;
};

// unknown: `errors` is either a string or an array when it is present, and
// absent otherwise, so it is narrowed here rather than at every caller.
function errorEntries(raw: unknown): GraphqlErrorEntry[] {
	if (Array.isArray(raw)) {
		return raw.filter(
			(entry): entry is GraphqlErrorEntry =>
				typeof entry === 'object' && entry !== null,
		);
	}
	if (typeof raw === 'string') return [{ message: raw }];
	return [];
}

/** Shopify's own code for a failed operation, else undefined. */
function errorCode(entries: GraphqlErrorEntry[]): string | undefined {
	for (const entry of entries) {
		const code = entry.extensions?.code;
		if (code) return code;
	}
	return undefined;
}

/**
 * Throttling is the one retryable condition, and Shopify reports it in
 * `extensions.cost.throttleStatus`, not in a header. The wait is however long
 * the bucket needs at its restore rate to cover the query being retried. It is
 * not a full refill: a bucket that is 950 points short can still run a
 * 10-point query after a fifth of a second.
 */
export function throttleDelayMs(
	throttleStatus:
		| {
				maximumAvailable?: number;
				currentlyAvailable?: number;
				restoreRate?: number;
		  }
		| undefined,
	requestedCost: number | undefined,
): number | undefined {
	if (!throttleStatus?.restoreRate || throttleStatus.restoreRate <= 0) {
		return undefined;
	}
	const available = throttleStatus.currentlyAvailable ?? 0;
	const needed = Math.max(0, (requestedCost ?? 0) - available);
	const seconds = Math.ceil(needed / throttleStatus.restoreRate);
	return Math.max(0, seconds) * 1000;
}

export async function makeShopifyGraphqlRequest<T>(input: {
	shopDomain: string;
	accessToken: string;
	query: string;
	// unknown: each operation supplies its own variable object; it is
	// serialised as JSON and never read here.
	variables?: Record<string, unknown>;
	/** Read verbs are replay-safe on a transport failure or 5xx. */
	replaySafe?: boolean;
	/**
	 * Called when Shopify returns data beside a field-level `ACCESS_DENIED`, as
	 * it does for customer PII on a plan that cannot read it. The call still
	 * succeeds; this is where a warning about the nulled fields goes.
	 */
	onPartial?: (message: string) => void;
}): Promise<ShopifyGraphqlResult<T>> {
	const host = normaliseShopDomain(input.shopDomain);

	const config: OpenAPIConfig = {
		BASE: `https://${host}`,
		VERSION: SHOPIFY_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// Shopify's Admin API bearer is a literal header, not `Bearer <token>`.
			'X-Shopify-Access-Token': input.accessToken,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: graphqlUrl(host),
		body: input.variables
			? { query: input.query, variables: input.variables }
			: { query: input.query },
		mediaType: 'application/json',
	};

	const rateLimitConfig: RateLimitConfig = {
		// Retries belong to error-handlers.ts, which reads the cost bucket out
		// of the response body. Shopify reports throttling with HTTP 200, so
		// core's status-based retry would never see it anyway.
		maxRetries: 0,
		enabled: true,
		initialRetryDelay: 1000,
		backoffMultiplier: 2,
		// Kept even with no retries: request.ts reads `headerNames.retryAfter`
		// whenever `enabled` is true and would throw on a missing key.
		headerNames: { retryAfter: 'retry-after' },
	};

	let raw: GraphqlEnvelope<T>;
	try {
		raw = await request<GraphqlEnvelope<T>>(config, requestOptions, {
			rateLimitConfig,
		});
	} catch (error) {
		throw toShopifyError(error, input.replaySafe ?? false);
	}

	// A 200 does not mean the operation ran. Every failure Shopify documents
	// arrives here, so the body decides.
	const entries = errorEntries(raw.errors);
	const hasData = raw.data !== undefined && raw.data !== null;
	if (entries.length > 0) {
		const code = errorCode(entries);
		const message =
			entries[0]?.message ?? 'Shopify returned an error with no message';

		// GraphQL can return usable data beside errors, and Shopify does exactly
		// that for a field-level denial: a store plan that cannot read customer
		// PII answers `data.customers` with the rows and every denied field set
		// to null, plus an ACCESS_DENIED entry. Throwing there would discard
		// rows the caller is allowed to see, so a field-level denial with data
		// present is surfaced as a warning and the call succeeds.
		//
		// Every entry has to be a field-level denial. One permitted code
		// followed by, say, INTERNAL_SERVER_ERROR means the response is
		// incomplete for a reason the caller has to know about, so it fails.
		const allFieldLevel = entries.every(
			(entry) => entry.extensions?.code === 'ACCESS_DENIED',
		);
		if (hasData && allFieldLevel) {
			input.onPartial?.(message);
			return {
				data: raw.data as T,
				currentlyAvailable:
					raw.extensions?.cost?.throttleStatus?.currentlyAvailable,
			};
		}

		const graphqlError = new ShopifyAPIError(message, {
			status: code === 'THROTTLED' ? 429 : 200,
			code,
			// A throttled request was rejected before it ran, so replaying it
			// cannot apply anything twice, even for a mutation.
			replaySafe: code === 'THROTTLED' || (input.replaySafe ?? false),
			retryAfter: delayFromRawError(raw),
		});
		replayMeta.set(graphqlError, {
			replaySafe: graphqlError.replaySafe,
			transportFailure: false,
		});
		throw graphqlError;
	}

	if (!hasData) {
		throw new ShopifyAPIError(
			'Shopify returned no data and no errors for this operation',
			{ status: 200, replaySafe: input.replaySafe ?? false },
		);
	}

	return {
		data: raw.data as T,
		currentlyAvailable:
			raw.extensions?.cost?.throttleStatus?.currentlyAvailable,
	};
}

/** Reads the documented backoff out of a throttled response body. */
// unknown: only `errors` and `extensions` are read here, and both are
// narrowed below; the data half belongs to the caller's output schema.
function delayFromRawError(raw: GraphqlEnvelope<unknown>): number | undefined {
	// MAX_COST_EXCEEDED and THROTTLED carry the cost detail under the first
	// error's extensions when they are reported as an array.
	if (Array.isArray(raw.errors)) {
		const cost = raw.extensions?.cost;
		if (cost) {
			return throttleDelayMs(cost.throttleStatus, cost.requestedQueryCost);
		}
	}
	return undefined;
}

/**
 * Replay safety per error, keyed by the error object.
 *
 * Core's `ApiError` must reach callers unchanged (R8: its `status` and
 * `retryAfter` are what the 429 handler matches), so the plugin cannot add a
 * field to it. A WeakMap carries the one extra fact the handlers need without
 * altering the error's identity, and entries are collected with the error.
 */
type ReplayMeta = {
	/** Safe to send the same request again without changing provider state. */
	replaySafe: boolean;
	/** The request never reached the provider. */
	transportFailure: boolean;
};

const replayMeta = new WeakMap<Error, ReplayMeta>();

/** Replay metadata for an error, or undefined when it was not recorded. */
export function getReplayMeta(error: Error): ReplayMeta | undefined {
	return replayMeta.get(error);
}

/**
 * Records replay safety for an error. Exported so a test can reproduce what
 * the client does for an error it cannot attach a field to, such as core's
 * `ApiError`.
 */
export function recordReplayMeta(error: Error, meta: ReplayMeta): void {
	replayMeta.set(error, meta);
}

/**
 * `shopDomain` is stored as the `<shop>.myshopify.com` host. Accepting a bare
 * handle or a full admin URL keeps a pasted value from failing at request time
 * with a DNS error that reads like a bad token.
 *
 * The result must be a real Shopify host: the access token is attached to the
 * request, so a typo or a tampered stored value would otherwise send that token
 * to whatever server the value names.
 */
export function normaliseShopDomain(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) {
		throw new ShopifyAPIError(
			'A shop domain is required, e.g. my-store.myshopify.com',
		);
	}
	if (trimmed.includes('@')) {
		// `https://user:pass@host` would put credentials in front of the host.
		throw new ShopifyAPIError('A shop domain cannot contain credentials');
	}
	const withoutScheme = trimmed.replace(/^https?:\/\//i, '');
	const host = (withoutScheme.split('/')[0] ?? '').toLowerCase();
	if (host.includes(':')) {
		// A port is not part of a Shopify admin host, and `host:port` would send
		// the token to an address the caller did not mean.
		throw new ShopifyAPIError('A shop domain cannot include a port');
	}
	const cleaned = host.includes('.') ? host : `${host}.myshopify.com`;
	if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(cleaned)) {
		throw new ShopifyAPIError(
			`"${value}" is not a Shopify shop domain; it must end in .myshopify.com`,
		);
	}
	return cleaned;
}

// unknown: a thrown value can be an ApiError, a transport Error, or anything
// else, so each case is narrowed by an instanceof check.
function toShopifyError(
	error: unknown,
	replaySafe: boolean,
): ApiError | ShopifyAPIError {
	if (error instanceof ApiError) {
		// Passed through unchanged, as R8 requires. A Shopify error body can
		// echo request fields, but `ApiError.body` is already redacted by core
		// for the query params it knows, and the token travels in a header.
		replayMeta.set(error, { replaySafe, transportFailure: false });
		return error;
	}
	if (error instanceof ShopifyAPIError) {
		replayMeta.set(error, {
			replaySafe,
			transportFailure: error.transportFailure,
		});
		return error;
	}
	// A reset, DNS failure or abort may still have reached Shopify before the
	// connection dropped for a write, so replay safety follows the operation:
	// only reads and explicitly replayable calls are safe to send again.
	const wrapped = new ShopifyAPIError(
		error instanceof Error ? error.message : 'Unknown error',
		{
			transportFailure: true,
			replaySafe,
		},
	);
	replayMeta.set(wrapped, { replaySafe, transportFailure: true });
	return wrapped;
}
