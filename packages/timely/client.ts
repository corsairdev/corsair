import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class TimelyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		// unknown: the provider's error body is passed through for debugging only.
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'TimelyAPIError';
	}
}

/**
 * Thrown when no workspace id was given and the token does not reach exactly
 * one Timely workspace, so there is no unambiguous `/{account_id}/…` path.
 */
export class TimelyAccountIdMissingError extends Error {
	constructor(public readonly workspaceCount: number) {
		super(
			workspaceCount === 0
				? '[timely] The connected Timely user has no workspace. Pass `accountId` (from timely.api.accounts.list).'
				: `[timely] The connected Timely user can reach ${workspaceCount} workspaces. Pass \`accountId\` on the call, set timely({ accountId }), or store account_id on the account.`,
		);
		this.name = 'TimelyAccountIdMissingError';
	}
}

export const TIMELY_API_BASE = 'https://api.timelyapp.com/1.1';
export const TIMELY_OAUTH_AUTHORIZE_URL = `${TIMELY_API_BASE}/oauth/authorize`;
export const TIMELY_OAUTH_TOKEN_URL = `${TIMELY_API_BASE}/oauth/token`;

/** Timely workspace and record ids are integers; anything else never reaches a URL path. */
export function validateTimelyId(value: string | number, label = 'id'): string {
	const text = String(value).trim();
	if (!/^\d{1,20}$/.test(text)) {
		throw new TimelyAPIError(
			`[timely] ${label} must be a numeric Timely id, got "${text}"`,
		);
	}
	return text;
}

export type TimelyQueryValue = string | number | boolean | undefined;

export type TimelyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	// unknown: request bodies are built from zod-validated inputs per endpoint.
	body?: Record<string, unknown>;
	query?: Record<string, TimelyQueryValue>;
};

function compactQuery(
	query?: Record<string, TimelyQueryValue>,
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const compact: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compact[key] = value;
	}
	return Object.keys(compact).length > 0 ? compact : undefined;
}

/**
 * Calls the Timely API v1.1. `path` starts with `/` and is relative to
 * https://api.timelyapp.com/1.1 (for example `/123/hours`).
 */
export async function makeTimelyRequest<T>(
	path: string,
	token: string,
	options: TimelyRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: TIMELY_API_BASE,
		VERSION: '1.1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'GET' || method === 'DELETE' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query: compactQuery(query),
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new TimelyAPIError(error.message);
		}
		throw new TimelyAPIError('Unknown error');
	}
}
