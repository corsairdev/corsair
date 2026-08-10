import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EpicGamesAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'EpicGamesAPIError';
	}
}

/** Fortnite Creative / Ecosystem public API host. */
export const FORTNITE_ECOSYSTEM_BASE = 'https://api.fortnite.com/ecosystem/v1';

/** Default Unreal Engine Web Remote Control HTTP endpoint. */
export const DEFAULT_REMOTE_CONTROL_BASE = 'http://127.0.0.1:30010';

export type EpicGamesQueryValue = string | number | boolean | undefined;

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	// body shape varies per endpoint and is validated by callers via typed Zod input schemas
	body?: unknown;
	// arrays use OpenAPI form+explode (metrics=a&metrics=b) via corsair/http getQueryString
	query?: Record<string, EpicGamesQueryValue | EpicGamesQueryValue[]>;
	/** Override base URL (Remote Control often uses a local UE host). */
	baseUrl?: string;
	/** When true, send Authorization: Bearer <token>. */
	bearer?: boolean;
	/** Abort timeout for the raw OPTIONS preflight, in milliseconds. */
	timeoutMs?: number;
};

/**
 * HTTP helper for Epic Games surfaces (Fortnite ecosystem + UE Remote Control).
 * OAuth access tokens are sent as Bearer when `bearer` is true (default for island APIs).
 */
export async function makeEpicGamesRequest<T>(
	endpoint: string,
	accessToken: string | undefined,
	options: RequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = FORTNITE_ECOSYSTEM_BASE,
		bearer = true,
		timeoutMs = 10_000,
	} = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	};
	if (bearer && accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl.replace(/\/$/, ''),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	if (method === 'OPTIONS') {
		const url = new URL(
			`${config.BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
		);
		if (query) {
			for (const [k, v] of Object.entries(query)) {
				if (v === undefined || v === null) continue;
				if (Array.isArray(v)) {
					for (const item of v) {
						if (item !== undefined && item !== null) {
							url.searchParams.append(k, String(item));
						}
					}
				} else {
					url.searchParams.set(k, String(v));
				}
			}
		}
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), timeoutMs);
		let res: Response;
		try {
			res = await fetch(url, {
				method: 'OPTIONS',
				headers,
				signal: controller.signal,
			});
		} finally {
			clearTimeout(timeout);
		}
		const text = await res.text();
		let json: unknown = {};
		try {
			json = text ? JSON.parse(text) : {};
		} catch {
			json = {
				status: res.status,
				allow: res.headers.get('allow') ?? undefined,
				// raw preflight body is non-JSON on many servers
				raw: text.slice(0, 500),
			};
		}
		if (!res.ok) {
			throw new ApiError(
				{ method: 'OPTIONS', url: endpoint },
				{
					url: url.toString(),
					ok: false,
					status: res.status,
					statusText: res.statusText,
					body: text,
				},
				`Epic Games OPTIONS failed: ${res.status}`,
			);
		}
		// cast: OPTIONS body is unknown (JSON or synthetic status object); caller
		// generic T is validated by endpoint Zod output schemas when used.
		return json as T;
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		// Preserve ApiError so error-handlers can inspect status / Retry-After.
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new EpicGamesAPIError(error.message);
		}
		throw new EpicGamesAPIError('Unknown Epic Games API error');
	}
}
