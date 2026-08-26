import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export class GoogleAnalyticsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GoogleAnalyticsAPIError';
	}
}

export const GOOGLE_ANALYTICS_ADMIN_BASE =
	'https://analyticsadmin.googleapis.com';
export const GOOGLE_ANALYTICS_DATA_BASE =
	'https://analyticsdata.googleapis.com';
export const GOOGLE_ANALYTICS_MP_BASE = 'https://www.google-analytics.com';

const REFRESH_RATE_LIMIT_ATTEMPTS = 6;
const REFRESH_RATE_LIMIT_DEFAULT_MS = 1000;
const TOKEN_FETCH_TIMEOUT_MS = 10_000;
const MP_FETCH_TIMEOUT_MS = 15_000;

const GoogleTokenResponse = z.object({
	access_token: z.string().min(1),
	expires_in: z.coerce.number().finite().positive(),
	refresh_token: z.string().min(1).optional(),
});

function isAbortError(error: unknown): boolean {
	return (
		error instanceof Error &&
		(error.name === 'AbortError' || error.name === 'TimeoutError')
	);
}

function retryAfterMsFromResponse(response: Response): number | undefined {
	const retryAfterHeader = response.headers.get('retry-after');
	if (!retryAfterHeader) return undefined;
	const seconds = Number(retryAfterHeader);
	if (Number.isFinite(seconds) && seconds >= 0) {
		return seconds * 1000;
	}
	const when = Date.parse(retryAfterHeader);
	if (!Number.isNaN(when)) {
		return Math.max(0, when - Date.now());
	}
	return undefined;
}

function expiresAtSeconds(
	expiresAt: string | null | undefined,
): number | undefined {
	if (!expiresAt) return undefined;
	const numeric = Number(expiresAt);
	if (Number.isFinite(numeric)) return numeric;
	const parsed = Date.parse(expiresAt);
	if (Number.isNaN(parsed)) return undefined;
	return Math.floor(parsed / 1000);
}

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	let lastError: GoogleAnalyticsAPIError | undefined;
	for (let attempt = 0; attempt < REFRESH_RATE_LIMIT_ATTEMPTS; attempt++) {
		let response: Response;
		try {
			response = await fetch('https://oauth2.googleapis.com/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					refresh_token: refreshToken,
					grant_type: 'refresh_token',
				}),
				signal: AbortSignal.timeout(TOKEN_FETCH_TIMEOUT_MS),
			});
		} catch (error) {
			if (isAbortError(error)) {
				throw new GoogleAnalyticsAPIError(
					'Failed to refresh access token: request timed out',
				);
			}
			throw error;
		}

		if (response.ok) {
			let json: unknown;
			try {
				json = await response.json();
			} catch {
				throw new GoogleAnalyticsAPIError('Invalid token response');
			}
			const parsed = GoogleTokenResponse.safeParse(json);
			if (!parsed.success) {
				throw new GoogleAnalyticsAPIError('Invalid token response');
			}
			return parsed.data;
		}

		const retryAfter = retryAfterMsFromResponse(response);
		const error = await response.text();
		lastError = new GoogleAnalyticsAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
			retryAfter,
		);
		if (response.status === 429 && attempt < REFRESH_RATE_LIMIT_ATTEMPTS - 1) {
			await new Promise((resolve) =>
				setTimeout(resolve, retryAfter ?? REFRESH_RATE_LIMIT_DEFAULT_MS),
			);
			continue;
		}
		throw lastError;
	}
	throw (
		lastError ?? new GoogleAnalyticsAPIError('Failed to refresh access token')
	);
}

export async function getValidAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	clientId: string;
	clientSecret: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	newRefreshToken?: string;
	expiresAt: number;
	refreshed: boolean;
}> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;
	const expiry = expiresAtSeconds(expiresAt);

	if (
		!forceRefresh &&
		accessToken &&
		expiry !== undefined &&
		expiry > now + bufferSeconds
	) {
		return { accessToken, expiresAt: expiry, refreshed: false };
	}

	const tokenData = await refreshAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		newRefreshToken: tokenData.refresh_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

type GoogleAnalyticsRequestOptions = {
	base?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

const MAX_ENDPOINT_LENGTH = 2048;

export async function makeGoogleAnalyticsRequest<T>(
	endpoint: string,
	credentials: string,
	options: GoogleAnalyticsRequestOptions = {},
): Promise<T> {
	if (endpoint.length > MAX_ENDPOINT_LENGTH) {
		throw new GoogleAnalyticsAPIError(
			`Google Analytics endpoint exceeds ${MAX_ENDPOINT_LENGTH} characters`,
		);
	}
	const {
		base = GOOGLE_ANALYTICS_ADMIN_BASE,
		method = 'GET',
		body,
		query,
	} = options;

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: credentials,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json',
		query,
	};

	const response = await request<T>(config, requestOptions);
	return response;
}

function isUnauthorizedError(error: unknown): boolean {
	return error instanceof ApiError && error.status === 401;
}

export function jsonObjectBody(value: unknown): Record<string, unknown> {
	if (value === undefined || value === null) {
		return {};
	}
	if (typeof value === 'object' && !Array.isArray(value)) {
		// arrays/null already excluded; Record is the leftover JSON object shape
		return value as Record<string, unknown>;
	}
	throw new GoogleAnalyticsAPIError('request body must be an object');
}

export async function makeAuthenticatedGoogleAnalyticsRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: GoogleAnalyticsRequestOptions = {},
): Promise<T> {
	try {
		return await makeGoogleAnalyticsRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			ctx.key = freshToken;
			return await makeGoogleAnalyticsRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}

export function encodeResourcePath(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) {
		throw new GoogleAnalyticsAPIError(
			'[googleanalytics] missing resource name',
		);
	}
	const parts = trimmed.split('/');
	if (
		parts.some((part) => part.length === 0 || part === '.' || part === '..')
	) {
		throw new GoogleAnalyticsAPIError(
			'[googleanalytics] invalid resource name',
		);
	}
	return parts.map(encodeURIComponent).join('/');
}

export function propertyPath(property: string): string {
	const trimmed = property.trim();
	const name = trimmed.startsWith('properties/')
		? trimmed
		: `properties/${trimmed}`;
	return encodeResourcePath(name);
}

export function listQuery(input: {
	pageSize?: number;
	pageToken?: string;
	showDeleted?: boolean;
	filter?: string;
}): Record<string, string | number | boolean> {
	const query: Record<string, string | number | boolean> = {};
	if (input.pageSize !== undefined) query.pageSize = input.pageSize;
	if (input.pageToken !== undefined) query.pageToken = input.pageToken;
	if (input.showDeleted !== undefined) query.showDeleted = input.showDeleted;
	if (input.filter !== undefined) query.filter = input.filter;
	return query;
}

export async function callMeasurementProtocol<T>(
	payload: Record<string, unknown>,
	options: {
		validate: boolean;
		apiSecret: string;
		measurementId?: string;
		firebaseAppId?: string;
	},
): Promise<T> {
	const path = options.validate ? '/debug/mp/collect' : '/mp/collect';
	const query = new URLSearchParams({ api_secret: options.apiSecret });
	if (options.measurementId) {
		query.set('measurement_id', options.measurementId);
	}
	if (options.firebaseAppId) {
		query.set('firebase_app_id', options.firebaseAppId);
	}
	const url = `${GOOGLE_ANALYTICS_MP_BASE}${path}?${query.toString()}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
			signal: AbortSignal.timeout(MP_FETCH_TIMEOUT_MS),
		});
	} catch (error) {
		if (isAbortError(error)) {
			throw new GoogleAnalyticsAPIError(
				'Measurement Protocol request timed out',
			);
		}
		throw error;
	}

	const text = await response.text();
	if (!response.ok) {
		throw new GoogleAnalyticsAPIError(
			`Measurement Protocol request failed: ${response.status} ${text}`,
			response.status,
			retryAfterMsFromResponse(response),
		);
	}

	// T is the caller's response type. The Measurement Protocol returns either
	// an empty body (success), JSON (validation report), or non-JSON text, none
	// of which we can construct generically, so each branch narrows to T.
	if (!text) {
		return {} as T;
	}
	try {
		return JSON.parse(text) as T;
	} catch {
		return { rawResponse: text } as T;
	}
}
