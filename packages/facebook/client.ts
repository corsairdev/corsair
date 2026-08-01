import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** Latest stable Graph API version aligned with the Instagram plugin. */
export const FACEBOOK_GRAPH_API_VERSION = 'v25.0';

export const FACEBOOK_API_BASE = `https://graph.facebook.com/${FACEBOOK_GRAPH_API_VERSION}`;

/** Graph API error codes that indicate rate limiting or throttling. */
export const FACEBOOK_RATE_LIMIT_ERROR_CODES = new Set([4, 17, 32, 613, 80004]);

/** OAuth / permission error — invalid or expired access token. */
export const FACEBOOK_AUTH_ERROR_CODE = 190;

export class FacebookAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly subcode?: number,
		public readonly type?: string,
		public readonly fbtraceId?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'FacebookAPIError';
	}
}

export type FacebookPagingCursors = {
	before?: string;
	after?: string;
};

export type FacebookPaging = {
	cursors?: FacebookPagingCursors;
	next?: string;
	previous?: string;
};

export type FacebookListResponse<T> = {
	data: T[];
	paging?: FacebookPaging;
};

export type FacebookRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	formData?: Record<string, string | Blob>;
};

type GraphErrorBody = {
	error?: {
		message?: string;
		code?: number;
		error_subcode?: number;
		type?: string;
		fbtrace_id?: string;
	};
};

function extractGraphError(
	error: unknown,
): GraphErrorBody['error'] | undefined {
	// corsair/http ApiError shapes vary slightly across transports; check known nests.
	const err = error as {
		body?: GraphErrorBody;
		response?: {
			body?: GraphErrorBody;
			data?: GraphErrorBody;
		};
	};
	return (
		err?.body?.error ?? err?.response?.body?.error ?? err?.response?.data?.error
	);
}

export function isFacebookRateLimitError(error: unknown): boolean {
	if (error instanceof FacebookAPIError && error.code !== undefined) {
		return FACEBOOK_RATE_LIMIT_ERROR_CODES.has(error.code);
	}
	if (error instanceof FacebookAPIError && error.status === 429) {
		return true;
	}
	const msg =
		error instanceof Error ? error.message.toLowerCase() : String(error);
	return (
		msg.includes('rate limit') ||
		msg.includes('too many calls') ||
		msg.includes('request limit') ||
		msg.includes('429')
	);
}

export function isFacebookAuthError(error: unknown): boolean {
	if (error instanceof FacebookAPIError) {
		return error.code === FACEBOOK_AUTH_ERROR_CODE || error.status === 401;
	}
	return false;
}

function toFacebookAPIError(error: unknown): FacebookAPIError {
	if (error instanceof FacebookAPIError) {
		return error;
	}
	const status = error instanceof ApiError ? error.status : undefined;
	const retryAfter = error instanceof ApiError ? error.retryAfter : undefined;
	const graphError = extractGraphError(error);
	if (graphError) {
		return new FacebookAPIError(
			graphError.message ?? 'Unknown Facebook Graph API error',
			graphError.code,
			graphError.error_subcode,
			graphError.type,
			graphError.fbtrace_id,
			status,
			retryAfter,
		);
	}
	if (error instanceof Error) {
		return new FacebookAPIError(
			error.message,
			undefined,
			undefined,
			undefined,
			undefined,
			status,
			retryAfter,
		);
	}
	return new FacebookAPIError('Unknown Facebook Graph API error');
}

export async function makeFacebookRequest<T>(
	endpoint: string,
	accessToken: string,
	options: FacebookRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, formData } = options;

	const normalizedEndpoint = endpoint.startsWith('/')
		? endpoint.slice(1)
		: endpoint;

	const config: OpenAPIConfig = {
		BASE: FACEBOOK_API_BASE,
		VERSION: FACEBOOK_GRAPH_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: normalizedEndpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		formData,
		mediaType: formData ? undefined : 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? { ...query } : query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		throw toFacebookAPIError(error);
	}
}

export type FacebookPageTokenCache = {
	findByEntityId: (
		entityId: string,
	) => Promise<{ data?: { accessToken?: string | null } } | null>;
	upsertByEntityId: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
};

export type FacebookRequestContext = {
	key: string;
	db?: {
		pages?: FacebookPageTokenCache;
	};
};

/**
 * Extract the Page ID from a composite Graph post ID (`PageID_PostID`).
 * Falls back to an explicit `page_id` when provided.
 */
export function resolvePageId(
	pageId: string | undefined,
	objectId: string,
): string {
	if (pageId) return pageId;
	const separator = objectId.indexOf('_');
	if (separator > 0) {
		return objectId.slice(0, separator);
	}
	throw new FacebookAPIError(
		`page_id is required when "${objectId}" is not a composite PageID_PostID identifier.`,
	);
}

/** Clear a stale page access token from the entity cache. */
export async function invalidatePageAccessToken(
	ctx: FacebookRequestContext | undefined,
	pageId: string,
): Promise<void> {
	if (!ctx?.db?.pages) return;
	try {
		const existing = await ctx.db.pages.findByEntityId(pageId);
		await ctx.db.pages.upsertByEntityId(pageId, {
			...(existing?.data ?? {}),
			facebookId: pageId,
			accessToken: undefined,
		});
	} catch {
		// Non-fatal cache clear
	}
}

export async function resolvePageAccessToken(
	userAccessToken: string,
	pageId: string,
	ctx?: FacebookRequestContext,
	options?: { bypassCache?: boolean },
): Promise<string> {
	if (!options?.bypassCache && ctx?.db?.pages) {
		try {
			const cached = await ctx.db.pages.findByEntityId(pageId);
			const cachedToken = cached?.data?.accessToken;
			if (cachedToken) {
				return cachedToken;
			}
		} catch {
			// Non-fatal cache miss — fall through to live Graph resolve
		}
	}

	const page = await makeFacebookRequest<{ access_token?: string }>(
		`/${pageId}`,
		userAccessToken,
		{
			method: 'GET',
			query: { fields: 'access_token' },
		},
	);

	if (!page.access_token) {
		throw new FacebookAPIError(
			`No page access token found for page ${pageId}. Ensure the user has granted pages_show_list and manages this page.`,
		);
	}

	if (ctx?.db?.pages) {
		try {
			const existing = await ctx.db.pages.findByEntityId(pageId);
			await ctx.db.pages.upsertByEntityId(pageId, {
				...(existing?.data ?? {}),
				facebookId: pageId,
				accessToken: page.access_token,
			});
		} catch {
			// Non-fatal cache write
		}
	}

	return page.access_token;
}

export async function makePageFacebookRequest<T>(
	endpoint: string,
	ctx: FacebookRequestContext,
	pageId: string,
	options: FacebookRequestOptions = {},
): Promise<T> {
	const pageToken = await resolvePageAccessToken(ctx.key, pageId, ctx);
	try {
		return await makeFacebookRequest<T>(endpoint, pageToken, options);
	} catch (error: unknown) {
		if (!isFacebookAuthError(error)) {
			throw error;
		}
		// Cached page tokens can go stale — clear and retry once with a fresh resolve.
		await invalidatePageAccessToken(ctx, pageId);
		const freshToken = await resolvePageAccessToken(ctx.key, pageId, ctx, {
			bypassCache: true,
		});
		return makeFacebookRequest<T>(endpoint, freshToken, options);
	}
}
