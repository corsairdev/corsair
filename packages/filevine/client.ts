import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FilevineAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'FilevineAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const FILEVINE_API_BASE_US = 'https://api.filevineapp.com';
export const FILEVINE_API_BASE_CA = 'https://api.filevineapp.ca';
export const FILEVINE_IDENTITY_BASE = 'https://identity.filevine.io';

export const FILEVINE_RATE_LIMIT_CONFIG: RateLimitConfig = {
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

type OrgContext = { orgId: string; userId: string; orgIds: string[] };

// Per-credential org context — keyed by bearer token so Tenant A can never
// reuse Tenant B's x-fv-orgid/x-fv-userid in the shared Corsair runtime.
// See https://support.filevine.com/hc/en-us/articles/27944810461851-Authenticate-Requests-to-the-API-Gateway
const orgContextCache = new Map<string, OrgContext>();

export function setFilevineOrgContext(
	apiKey: string,
	orgId: string | number,
	userId: string | number,
): void {
	const org = String(orgId);
	const user = String(userId);
	const existing = orgContextCache.get(apiKey);
	const orgIds = existing
		? Array.from(new Set([...existing.orgIds, org]))
		: [org];
	orgContextCache.set(apiKey, { orgId: org, userId: user, orgIds });
}

export function getFilevineOrgContext(apiKey: string): {
	orgId?: string;
	userId?: string;
} {
	return orgContextCache.get(apiKey) ?? {};
}

export function clearFilevineOrgContext(apiKey?: string): void {
	if (apiKey) orgContextCache.delete(apiKey);
	else orgContextCache.clear();
}

export async function exchangePatForBearer(
	pat: string,
): Promise<{ access_token: string; expires_in?: number; scope?: string }> {
	const body: Record<string, string> = {
		grant_type: 'personal_access_token',
		token: pat,
		scope:
			'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
	};
	return makeFilevineIdentityRequest('/connect/token', body);
}

async function fetchFilevineOrgContext(
	apiKey: string,
): Promise<OrgContext | null> {
	try {
		const result = await makeFilevineRequest<{
			UserId?: { Native?: number };
			Orgs?: Array<{ OrgId?: number }>;
			userId?: number;
			orgs?: Array<{ orgId?: number }>;
		}>('/fv-app/v2/utils/GetUserOrgsWithToken', apiKey, { method: 'POST' });
		const raw = result as unknown as Record<string, unknown>;
		const userId =
			(raw.UserId as { Native?: number } | undefined)?.Native ??
			(raw as { userId?: number }).userId ??
			(raw as { UserId?: number }).UserId;
		const orgs =
			(raw.Orgs as Array<Record<string, unknown>> | undefined) ??
			(raw as { orgs?: Array<Record<string, unknown>> }).orgs;
		const orgIds = (orgs ?? [])
			.map(
				(o) =>
					(o.OrgId as number | undefined) ?? (o.orgId as number | undefined),
			)
			.filter((v): v is number => typeof v === 'number')
			.map(String);
		const orgId = orgIds[0];
		if (!orgId) return null;
		// Default user to org when user lookup fails — headers still require both values
		const user = userId ? String(userId) : orgId;
		return { orgId, userId: user, orgIds };
	} catch {
		return null;
	}
}

export async function ensureFilevineOrgContext(
	apiKey: string,
): Promise<OrgContext | null> {
	const cached = orgContextCache.get(apiKey);
	if (cached) return cached;
	const fetched = await fetchFilevineOrgContext(apiKey);
	if (fetched) orgContextCache.set(apiKey, fetched);
	return fetched;
}

export async function resolveFilevineOrgContext(
	apiKey: string,
	explicitOrgId?: string | number,
	explicitUserId?: string | number,
): Promise<{ orgId?: string; userId?: string }> {
	const cached = await ensureFilevineOrgContext(apiKey);
	if (explicitOrgId === undefined && explicitUserId === undefined) {
		return cached ?? {};
	}
	const org =
		explicitOrgId !== undefined ? String(explicitOrgId) : cached?.orgId;
	const user =
		explicitUserId !== undefined ? String(explicitUserId) : cached?.userId;
	// Validate explicit org against the authenticated user's org membership when known.
	// Skip validation when discovery failed (no cached orgIds) so tests and degraded mode still pass through.
	if (
		explicitOrgId !== undefined &&
		cached &&
		cached.orgIds.length > 0 &&
		!cached.orgIds.includes(String(explicitOrgId))
	) {
		throw new FilevineAPIError(
			`orgId ${explicitOrgId} does not belong to the authenticated Filevine user`,
			'ORG_MISMATCH',
		);
	}
	return { orgId: org, userId: user };
}

export async function makeFilevineRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: Record<string, unknown>;
		headers?: Record<string, string>;
		baseUrl?: string;
		orgId?: string | number;
		userId?: string | number;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		formData,
		headers,
		baseUrl,
		orgId,
		userId,
	} = options;

	// Explicit per-request override wins; otherwise use the per-credential cache.
	// No global fallback — a missing context means no scope headers for this credential.
	const cached = orgContextCache.get(apiKey);
	const effectiveOrgId = orgId ?? cached?.orgId;
	const effectiveUserId = userId ?? cached?.userId;

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? FILEVINE_API_BASE_US,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			...(effectiveOrgId !== undefined
				? { 'x-fv-orgid': String(effectiveOrgId) }
				: {}),
			...(effectiveUserId !== undefined
				? { 'x-fv-userid': String(effectiveUserId) }
				: {}),
			...headers,
		},
	};

	// Content-Type is set via mediaType; for JSON we set application/json,
	// for FormData we let fetch set the multipart boundary automatically.
	const isFormData = !!formData;
	if (!isFormData && !headers?.['Content-Type']) {
		(config.HEADERS as Record<string, string>)['Content-Type'] =
			'application/json';
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isFormData
			? undefined
			: method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		formData: isFormData ? formData : undefined,
		mediaType: isFormData ? 'multipart/form-data' : 'application/json',
		query,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: FILEVINE_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error: unknown) {
		// Preserve the original ApiError so plugin error-handlers keep
		// instanceof ApiError status/retryAfter matching. Wrap only
		// non-ApiError failures with Filevine context.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new FilevineAPIError(error.message, undefined, { cause: error });
		}
		throw new FilevineAPIError('Unknown Filevine error');
	}
}

export async function makeFilevineIdentityRequest<T>(
	endpoint: string,
	body: Record<string, string>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: FILEVINE_IDENTITY_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	const formBody = new URLSearchParams(body).toString();

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: endpoint,
		body: formBody as unknown as Record<string, unknown>,
		mediaType: 'application/x-www-form-urlencoded',
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: FILEVINE_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error: unknown) {
		// Preserve ApiError for status-based handling upstream.
		if (error instanceof ApiError) throw error;
		if (error instanceof Error) {
			throw new FilevineAPIError(error.message, undefined, { cause: error });
		}
		throw new FilevineAPIError('Unknown Filevine identity error');
	}
}
