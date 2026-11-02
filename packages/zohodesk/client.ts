import { getOAuthAccessToken } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import type { ZohoDeskContext } from './index';

/**
 * Data centers Zoho Desk lists under "API Endpoints by Data Center".
 * @see https://desk.zoho.com/DeskAPIDocument
 */
export type ZohoDeskRegion =
	| 'us'
	| 'eu'
	| 'in'
	| 'au'
	| 'jp'
	| 'cn'
	| 'ca'
	| 'sa'
	| 'sg'
	| 'ae';

const REGION_TLD: Record<ZohoDeskRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	cn: 'com.cn',
	ca: 'ca',
	sa: 'sa',
	sg: 'sg',
	ae: 'ae',
};

const REGIONS = Object.keys(REGION_TLD).filter(isZohoDeskRegion);

// unknown: `region` reaches the factory from plain JS config, and `location`
// from the OAuth callback query string.
function isZohoDeskRegion(value: unknown): value is ZohoDeskRegion {
	return typeof value === 'string' && Object.hasOwn(REGION_TLD, value);
}

/** Canada is the one data center outside the `zoho.*` domains. */
function zohoHost(service: 'desk' | 'accounts', region: ZohoDeskRegion) {
	return region === 'ca'
		? `${service}.zohocloud.ca`
		: `${service}.zoho.${REGION_TLD[region]}`;
}

/**
 * Zoho's token responses name the API host differently per document:
 * `https://api.zoho.eu`, `https://www.zohoapis.in`, and the Desk reference
 * implies `https://desk.zoho.eu`. Only the last serves `/api/v1`, so
 * `api_domain` identifies a data center and is never used as a URL itself.
 */
function apiDomainHosts(region: ZohoDeskRegion): string[] {
	const tld = REGION_TLD[region];
	return [
		zohoHost('desk', region),
		`www.zohoapis.${tld}`,
		`zohoapis.${tld}`,
		`api.zoho.${tld}`,
	];
}

function hostnameOf(domain: string): string | undefined {
	try {
		const url = new URL(domain.includes('://') ? domain : `https://${domain}`);
		return url.protocol === 'https:' ? url.hostname.toLowerCase() : undefined;
	} catch {
		return undefined;
	}
}

export function regionFromApiDomain(
	apiDomain: string,
): ZohoDeskRegion | undefined {
	const host = hostnameOf(apiDomain.trim());
	if (!host) return undefined;
	return REGIONS.find((region) => apiDomainHosts(region).includes(host));
}

/**
 * Turns the plugin's `region` / `apiDomain` options into one data center.
 * The access token only ever goes to a host from the table above, so neither
 * option can redirect it. Bad values throw here rather than falling back to
 * the US data center, where every call would fail with a confusing 401.
 */
export function resolveZohoDeskRegion(options: {
	region?: ZohoDeskRegion;
	apiDomain?: string;
}): ZohoDeskRegion {
	if (options.apiDomain !== undefined) {
		const region = regionFromApiDomain(options.apiDomain);
		if (!region) {
			throw new Error(
				`[zohodesk] apiDomain must be an https Zoho Desk or Zoho API host, got '${options.apiDomain}'`,
			);
		}
		return region;
	}
	if (options.region === undefined) return 'us';
	if (!isZohoDeskRegion(options.region)) {
		throw new Error(
			`[zohodesk] unknown region '${String(options.region)}', expected one of ${REGIONS.join(', ')}`,
		);
	}
	return options.region;
}

/** The data center named by a token response or OAuth callback, if any. */
export function regionFromTokenData(
	// unknown: the provider's open-ended token payload.
	data: Record<string, unknown>,
): ZohoDeskRegion | undefined {
	if (typeof data.api_domain === 'string') {
		const region = regionFromApiDomain(data.api_domain);
		if (region) return region;
	}
	return isZohoDeskRegion(data.location) ? data.location : undefined;
}

export function zohoDeskApiBase(region: ZohoDeskRegion = 'us'): string {
	return `https://${zohoHost('desk', region)}/api/v1`;
}

export function zohoDeskOAuthAuthUrl(region: ZohoDeskRegion = 'us'): string {
	return `https://${zohoHost('accounts', region)}/oauth/v2/auth`;
}

export function zohoDeskOAuthTokenUrl(region: ZohoDeskRegion = 'us'): string {
	return `https://${zohoHost('accounts', region)}/oauth/v2/token`;
}

const ZohoDeskErrorBody = z.looseObject({
	errorCode: z.string().optional(),
	message: z.string().optional(),
});

/** A failed Zoho Desk call, carrying Zoho's machine-readable `errorCode`. */
export class ZohoDeskAPIError extends Error {
	readonly status?: number;
	readonly code?: string;
	/** Milliseconds, from `Retry-After`. */
	readonly retryAfter?: number;
	/** Credits left today, from `X-Rate-Limit-Remaining-v3`. */
	readonly creditsRemaining?: number;
	// unknown: usually the JSON error body, but a proxy can answer with text.
	readonly body?: unknown;

	constructor(
		message: string,
		options: {
			cause?: Error;
			status?: number;
			// unknown: see the field above.
			body?: unknown;
			retryAfter?: number;
			creditsRemaining?: number;
		} = {},
	) {
		super(message, options.cause ? { cause: options.cause } : undefined);
		this.name = 'ZohoDeskAPIError';
		this.status = options.status;
		this.body = options.body;
		this.retryAfter = options.retryAfter;
		this.creditsRemaining = options.creditsRemaining;
		this.code = ZohoDeskErrorBody.safeParse(options.body).data?.errorCode;
	}
}

const ErrorMessage = z.looseObject({ message: z.string() });

// unknown: see ZohoDeskAPIError.body.
function describeError(status: number, body: unknown, fallback: string) {
	const parsed = ZohoDeskErrorBody.safeParse(body).data;
	const label = parsed?.errorCode ? `${status} ${parsed.errorCode}` : status;
	return `Zoho Desk ${label}: ${parsed?.message ?? fallback}`;
}

// error-handlers.ts owns retries, so the client makes one attempt and only
// reads the rate limit headers into the error. The transport's own retry
// sleeps for Retry-After with no upper bound, and Zoho sends that header when
// the daily credits run out.
const ZOHO_DESK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		remaining: 'x-rate-limit-remaining-v3',
	},
};

const FILE_TIMEOUT_MS = 60_000;

export type ZohoDeskQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type ZohoDeskRequest = {
	method?: 'GET' | 'POST';
	path: string;
	query?: ZohoDeskQuery;
	// unknown: the endpoint's input schema has already validated the body.
	body?: Record<string, unknown>;
	formData?: Record<string, Blob>;
	/** `GET /organizations` is the one route Zoho documents without `orgId`. */
	withoutOrg?: boolean;
};

export type ZohoDeskFile = {
	contentType: string;
	contentBase64: string;
	size: number;
};

function authHeaders(token: string, orgId?: string): Record<string, string> {
	return {
		Authorization: `Zoho-oauthtoken ${token}`,
		...(orgId ? { orgId } : {}),
	};
}

// unknown: anything can be thrown through fetch and the transport.
function wrapError(error: unknown): ZohoDeskAPIError {
	if (error instanceof ZohoDeskAPIError) return error;
	if (error instanceof ApiError) {
		return new ZohoDeskAPIError(
			describeError(error.status, error.body, error.message),
			{
				cause: error,
				status: error.status,
				body: error.body,
				retryAfter: error.retryAfter,
				creditsRemaining: error.rateLimitRemaining,
			},
		);
	}
	// DOMException (fetch timeouts) can fail instanceof Error across realms, so
	// the message is read by shape.
	const message = ErrorMessage.safeParse(error).data?.message;
	return new ZohoDeskAPIError(message ?? 'Unknown Zoho Desk error', {
		cause: error instanceof Error ? error : undefined,
	});
}

/**
 * One JSON or multipart call. Returns undefined for an empty answer: Zoho
 * replies 204 when a list has nothing in it.
 */
// unknown: callers parse the body with the endpoint's zod output schema.
export async function makeZohoDeskRequest(
	token: string,
	region: ZohoDeskRegion | undefined,
	{ method = 'GET', path, query, body, formData }: ZohoDeskRequest,
	orgId?: string,
): Promise<unknown> {
	const config: OpenAPIConfig = {
		BASE: zohoDeskApiBase(region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		// TOKEN would be sent as `Bearer`; Zoho documents `Zoho-oauthtoken`.
		TOKEN: undefined,
		HEADERS: authHeaders(token, orgId),
		...(formData ? { TIMEOUT: FILE_TIMEOUT_MS } : {}),
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query,
		body,
		formData,
		mediaType: body === undefined ? undefined : 'application/json',
	};

	try {
		return await request<unknown>(config, requestOptions, {
			rateLimitConfig: ZOHO_DESK_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		throw wrapError(error);
	}
}

/**
 * Downloads a binary response. The shared transport decodes every non-JSON
 * body as text, which corrupts images, so this goes to fetch directly.
 */
export async function downloadZohoDeskFile(
	token: string,
	region: ZohoDeskRegion | undefined,
	{ path, query }: ZohoDeskRequest,
	orgId?: string,
): Promise<ZohoDeskFile> {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined) params.set(key, String(value));
	}
	const search = params.toString() ? `?${params}` : '';

	let response: Response;
	try {
		response = await fetch(`${zohoDeskApiBase(region)}${path}${search}`, {
			method: 'GET',
			headers: authHeaders(token, orgId),
			signal: AbortSignal.timeout(FILE_TIMEOUT_MS),
		});
	} catch (error) {
		throw wrapError(error);
	}

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		const body = parseJson(text);
		const retryAfter = Number(response.headers.get('retry-after'));
		const remaining = Number(response.headers.get('x-rate-limit-remaining-v3'));
		throw new ZohoDeskAPIError(
			describeError(response.status, body, response.statusText),
			{
				status: response.status,
				body,
				retryAfter: retryAfter > 0 ? retryAfter * 1000 : undefined,
				creditsRemaining: response.headers.has('x-rate-limit-remaining-v3')
					? remaining
					: undefined,
			},
		);
	}

	const bytes = Buffer.from(await response.arrayBuffer());
	return {
		contentType:
			response.headers.get('content-type') ?? 'application/octet-stream',
		contentBase64: bytes.toString('base64'),
		size: bytes.length,
	};
}

// unknown: a body is only JSON if it parses.
function parseJson(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

/** True for the 401s a new access token can fix. */
export function isExpiredTokenError(error: unknown): boolean {
	return (
		error instanceof ZohoDeskAPIError &&
		error.status === 401 &&
		error.code !== 'SCOPE_MISMATCH' &&
		error.code !== 'OAUTH_ORG_MISMATCH'
	);
}

type OAuthAccess = Parameters<typeof getOAuthAccessToken>[0];

/**
 * Mints a new access token after a 401, even though the stored one still looks
 * valid (Zoho revokes tokens early, and caps a user at 15 live ones per refresh
 * token). `getOAuthAccessToken` installs the forced refresh on the object it is
 * given, but core hands endpoints a separate copy of the context from the one
 * the key builder saw, so `ctx._refreshAuth` is never set here. Building the
 * access context locally reaches the same refresh path.
 */
async function forceTokenRefresh(
	ctx: ZohoDeskContext,
): Promise<string | undefined> {
	if (ctx.options.key || !ctx.keys || !ctx.tenantId) return undefined;
	const access: OAuthAccess & { _refreshAuth?: () => Promise<string> } = {
		keys: ctx.keys,
		hub: ctx.hub,
		tenantId: ctx.tenantId,
	};
	await getOAuthAccessToken(access, {
		plugin: 'zohodesk',
		tokenUrl: zohoDeskOAuthTokenUrl(ctx.options.region),
		tokenAuthMethod: 'body',
	});
	return access._refreshAuth?.();
}

const OrganizationIds = z.object({
	data: z.array(z.looseObject({ id: z.union([z.string(), z.number()]) })),
});

/**
 * The org ID when the user belongs to exactly one organization. With several
 * there is no way to tell which one the token was bound to at consent:
 * `isDefault` is the user's default, not the token's org.
 */
// unknown: the raw `GET /organizations` body.
export function soleOrganizationId(body: unknown): string | undefined {
	const organizations = OrganizationIds.safeParse(body).data?.data;
	return organizations?.length === 1 ? String(organizations[0]?.id) : undefined;
}

// Endpoint contexts are rebuilt per call, so a lookup result cannot live on
// one. The key manager (or, for a static key, the options object) lasts as long
// as the tenant's client. null records "several orgs" so that case does not pay
// 3 credits for a lookup on every call.
const discoveredOrgs = new WeakMap<object, string | null>();

async function discoverOrgId(
	ctx: ZohoDeskContext,
	token: string,
): Promise<string | undefined> {
	const cacheKey = ctx.keys ?? ctx.options;
	const cached = discoveredOrgs.get(cacheKey);
	if (cached !== undefined) return cached ?? undefined;

	let body: unknown;
	try {
		body = await makeZohoDeskRequest(token, ctx.options.region, {
			path: '/organizations',
		});
	} catch (error) {
		if (isExpiredTokenError(error)) throw error;
		// An org-bound token works without the header, so a failed lookup should
		// not fail the call it was only preparing. Not cached: it may be transient.
		return undefined;
	}

	const orgId = soleOrganizationId(body);
	discoveredOrgs.set(cacheKey, orgId ?? null);
	// Only saves a later lookup, so a failed write must not fail this call.
	if (orgId)
		await ctx.keys?.set_tenant_external_id(orgId).catch(() => undefined);
	return orgId;
}

/**
 * `orgId` option, then the stored `tenant_external_id`, then a one-time lookup.
 * Undefined means send no header: Zoho reads the org from the token, whereas a
 * guess that names the wrong org fails with OAUTH_ORG_MISMATCH.
 */
export async function resolveOrgId(
	ctx: ZohoDeskContext,
	token: string,
): Promise<string | undefined> {
	if (ctx.options.orgId) return ctx.options.orgId;
	const stored = await ctx.keys?.get_tenant_external_id();
	return stored || discoverOrgId(ctx, token);
}

// unknown: whatever the request rejected with.
function isOrgMismatchError(error: unknown): boolean {
	return (
		error instanceof ZohoDeskAPIError && error.code === 'OAUTH_ORG_MISMATCH'
	);
}

async function forgetOrgId(ctx: ZohoDeskContext): Promise<void> {
	discoveredOrgs.delete(ctx.keys ?? ctx.options);
	// Only spares later calls this retry, so a failed write must not fail this one.
	await ctx.keys?.set_tenant_external_id('').catch(() => undefined);
}

/**
 * Runs `send` with the current token and org, and once more with a new token if
 * Zoho rejects it. The new token goes back on `ctx` because a rate limit retry
 * re-runs the endpoint with this same context.
 *
 * A remembered org can outlive its connection: reconnecting to another org
 * leaves the old ID stored when `soleOrganizationId` can't name the new one, and
 * core gives the plugin no way to clear it then. So a mismatch on a remembered
 * ID drops it and retries without the header, letting Zoho read the org from
 * the token. A mismatch on the `orgId` option is a config error and surfaces.
 */
export async function withZohoDeskAuth<T>(
	ctx: ZohoDeskContext,
	req: ZohoDeskRequest,
	send: (token: string, orgId: string | undefined) => Promise<T>,
): Promise<T> {
	const attempt = async (token: string) => {
		if (req.withoutOrg) return send(token, undefined);

		const orgId = await resolveOrgId(ctx, token);
		try {
			return await send(token, orgId);
		} catch (error) {
			if (!orgId || ctx.options.orgId || !isOrgMismatchError(error))
				throw error;
			await forgetOrgId(ctx);
			return send(token, undefined);
		}
	};

	try {
		return await attempt(ctx.key);
	} catch (error) {
		if (!isExpiredTokenError(error)) throw error;
		const freshToken = await forceTokenRefresh(ctx);
		if (!freshToken) throw error;
		ctx.key = freshToken;
		return await attempt(freshToken);
	}
}
