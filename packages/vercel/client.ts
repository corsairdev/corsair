import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export const VERCEL_API_BASE = 'https://api.vercel.com';

// Core's request() retries a 429 itself (three times, honouring Retry-After),
// so the plugin's own 429 handler doesn't retry again. X-RateLimit-Reset is
// left out: Vercel's windows can run an hour, too long to wait inside a call.
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type VercelQueryValue = string | number | boolean | string[] | undefined;
export type VercelQuery = Record<string, VercelQueryValue>;

export interface VercelRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	query?: VercelQuery;
	// Each endpoint sends its own JSON shape; request() serializes it as is.
	body?: unknown;
	/** A team id (`team_…`) or a team slug. Leave out for the token's own scope. */
	teamId?: string;
	/**
	 * false: send no teamId/slug at all, not even the connection's stored team.
	 * For routes that name the team in the path (/v2/teams/{id}) or aren't
	 * team-scoped (/v2/user).
	 */
	teamScope?: false;
}

/**
 * What the request helpers need from an endpoint's context: the key the binder
 * resolved (`ctx.key`), the stored team for OAuth connections, and the
 * plugin-wide default team.
 */
export type VercelRequestContext = {
	key: string;
	options: { teamId?: string };
	keys?: object;
};

/** A team id goes in `teamId`; anything else is taken as the team's slug. */
export function teamScopeQuery(team: string | undefined): VercelQuery {
	const value = team?.trim();
	if (!value) return {};
	return value.startsWith('team_') ? { teamId: value } : { slug: value };
}

async function storedTeamId(
	ctx: VercelRequestContext,
): Promise<string | undefined> {
	const getter = (ctx.keys as { get_team_id?: () => Promise<string | null> })
		?.get_team_id;
	if (typeof getter !== 'function') return undefined;
	const value = await getter.call(ctx.keys);
	return value?.trim() || undefined;
}

/**
 * The team a call runs against: the call's own `teamId`, then the team an
 * OAuth install was made for (saved on the connection), then the plugin's
 * `teamId` option. None of them means the token's own scope (a personal
 * account, or the default team of a full-account token).
 */
export async function resolveTeam(
	ctx: VercelRequestContext,
	inputTeamId?: string,
): Promise<string | undefined> {
	return inputTeamId?.trim() || (await storedTeamId(ctx)) || ctx.options.teamId;
}

/**
 * Sends one request to the Vercel REST API. Errors are core's `ApiError`,
 * passed through unchanged so its status and Retry-After reach the error
 * handlers and core's refresh-after-401.
 */
export async function makeVercelRequest<T>(
	path: string,
	accessToken: string,
	options: VercelRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, teamId } = options;

	const finalQuery: VercelQuery = {};
	for (const [key, value] of Object.entries({
		...query,
		...teamScopeQuery(teamId),
	})) {
		if (value !== undefined) finalQuery[key] = value;
	}

	const config: OpenAPIConfig = {
		BASE: VERCEL_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	// Writes always send a JSON body; a DELETE sends one only when given
	// (a few Vercel deletes take options in the body).
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';
	const sendBody = isWrite || (method === 'DELETE' && body !== undefined);
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: sendBody ? (body ?? {}) : undefined,
		mediaType: sendBody ? 'application/json' : undefined,
		query: Object.keys(finalQuery).length > 0 ? finalQuery : undefined,
	};

	return request<T>(config, requestOptions, {
		rateLimitConfig: RATE_LIMIT_CONFIG,
	});
}

/** `makeVercelRequest` with the endpoint's key and resolved team. */
export async function makeAuthenticatedVercelRequest<T>(
	path: string,
	ctx: VercelRequestContext,
	options: VercelRequestOptions = {},
): Promise<T> {
	const teamId =
		options.teamScope === false
			? undefined
			: await resolveTeam(ctx, options.teamId);
	return makeVercelRequest<T>(path, ctx.key, { ...options, teamId });
}

/** Encodes one path segment (ids, names, domains, keys). */
export function seg(value: string | number): string {
	return encodeURIComponent(String(value));
}
