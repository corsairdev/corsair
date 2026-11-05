import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const BASECAMP_API_BASE = 'https://3.basecampapi.com';
export const BASECAMP_AUTH_BASE = 'https://launchpad.37signals.com';
export const BASECAMP_AUTH_URL =
	'https://launchpad.37signals.com/authorization/new';
export const BASECAMP_DEFAULT_USER_AGENT =
	'Corsair Basecamp Integration (https://corsair.dev)';

function rateLimitConfig(retrySafe: boolean): RateLimitConfig {
	return {
		enabled: true,
		maxRetries: retrySafe ? 3 : 0,
		initialRetryDelay: 1000,
		backoffMultiplier: 2,
		headerNames: { retryAfter: 'Retry-After' },
	};
}

export class BasecampAccountIdMissingError extends Error {
	constructor() {
		super(
			'Basecamp requires one selected account. Set accountId in the plugin options or store account_id for the OAuth account.',
		);
		this.name = 'BasecampAccountIdMissingError';
	}
}

export class BasecampOAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BasecampOAuthError';
	}
}

export class BasecampAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BasecampAPIError';
	}
}

export type BasecampSchemaIssue = { path: string; message: string };

/** Raised when an endpoint input or a Basecamp response fails its zod schema. */
export class BasecampSchemaError extends Error {
	constructor(
		message: string,
		public readonly direction: 'input' | 'output',
		public readonly issues: BasecampSchemaIssue[] = [],
	) {
		super(message);
		this.name = 'BasecampSchemaError';
	}
}

export function validateAccountId(value: string): string {
	if (!/^[0-9]+$/.test(value)) {
		throw new BasecampAccountIdMissingError();
	}
	return value;
}

export function compactObject(
	value: Record<string, unknown>,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(value)
			.filter(([, item]) => item !== undefined)
			.map(([key, item]) => [
				key,
				item !== null && typeof item === 'object' && !Array.isArray(item)
					? compactObject(item as Record<string, unknown>)
					: item,
			]),
	);
}

type AuthorizationAccount = {
	id?: number | string;
	product?: string;
	href?: string;
	resource?: string;
};

export async function discoverBasecampAccountId(
	accessToken: string,
	userAgent = BASECAMP_DEFAULT_USER_AGENT,
): Promise<string> {
	const config: OpenAPIConfig = {
		BASE: BASECAMP_AUTH_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: 'Bearer ' + accessToken,
			'User-Agent': userAgent,
			Accept: 'application/json',
		},
	};
	const payload = await request<{ accounts?: AuthorizationAccount[] }>(
		config,
		{ method: 'GET', url: '/authorization.json' },
		{ rateLimitConfig: rateLimitConfig(true) },
	);
	const accounts = (payload.accounts ?? []).filter((account) => {
		if (account.product && account.product !== 'bc3') return false;
		return (
			account.id !== undefined &&
			account.href?.startsWith(BASECAMP_API_BASE + '/')
		);
	});
	if (accounts.length !== 1) throw new BasecampAccountIdMissingError();
	return validateAccountId(String(accounts[0]?.id));
}

export type BasecampRequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown> | Blob;
	query?: Record<string, string | number | boolean | undefined>;
	mediaType?: string;
	retrySafe?: boolean;
	authenticated?: boolean;
};

export async function makeBasecampRequest<T>(
	endpoint: string,
	accessToken: string,
	userAgent: string,
	options: BasecampRequestOptions,
): Promise<T> {
	const authenticated = options.authenticated ?? true;
	const config: OpenAPIConfig = {
		BASE: BASECAMP_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...(authenticated && accessToken
				? { Authorization: 'Bearer ' + accessToken }
				: {}),
			'User-Agent': userAgent,
			Accept: 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: endpoint,
		body: options.body,
		query: options.query,
		mediaType: options.body
			? (options.mediaType ?? 'application/json; charset=utf-8')
			: undefined,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: rateLimitConfig(options.retrySafe ?? false),
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new BasecampAPIError(
				'Basecamp API request failed with status ' + error.status,
				error.status,
				error.retryAfter,
			);
		}
		throw error;
	}
}

export type BasecampAuthContext = {
	key: string;
	/**
	 * Attached ad hoc by the plugin keyBuilder (see index.ts) so a rejected token
	 * can be force-refreshed here; absent when the caller supplies a static key.
	 */
	_refreshAuth?: () => Promise<string>;
};

/**
 * Wrapper around makeBasecampRequest that retries once on 401 by force-refreshing
 * the access token. Covers tokens Basecamp rejects before their stored `expires_at`
 * (revoked, or rotated out of band), which the keyBuilder's expiry check cannot see.
 */
export async function makeAuthenticatedBasecampRequest<T>(
	endpoint: string,
	ctx: BasecampAuthContext,
	userAgent: string,
	options: BasecampRequestOptions,
): Promise<T> {
	try {
		return await makeBasecampRequest<T>(endpoint, ctx.key, userAgent, options);
	} catch (error) {
		// Keyed chatbot calls send no bearer token, so a 401 there is not refreshable.
		if (
			options.authenticated !== false &&
			error instanceof BasecampAPIError &&
			error.status === 401 &&
			ctx._refreshAuth
		) {
			const freshToken = await ctx._refreshAuth();
			return await makeBasecampRequest<T>(
				endpoint,
				freshToken,
				userAgent,
				options,
			);
		}
		throw error;
	}
}
