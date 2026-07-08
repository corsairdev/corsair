import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleAnalyticsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
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

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch('https://oauth2.googleapis.com/token', {
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
	});

	if (!response.ok) {
		const error = await response.text();
		throw new GoogleAnalyticsAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	// response.json() is typed as unknown; Google's token endpoint has a fixed
	// shape, so we narrow it directly rather than parse defensively.
	return (await response.json()) as {
		access_token: string;
		expires_in: number;
		refresh_token?: string;
	};
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

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return { accessToken, expiresAt: Number(expiresAt), refreshed: false };
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

export async function makeGoogleAnalyticsRequest<T>(
	endpoint: string,
	credentials: string,
	options: GoogleAnalyticsRequestOptions = {},
): Promise<T> {
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
	// corsair/http's ApiError carries a numeric status but is typed as Error here,
	// so narrow to read it rather than importing the concrete class.
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
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

// GA property identifiers can arrive as "properties/123" or a bare "123".
// The REST paths expect the "properties/{id}" form.
export function propertyPath(property: string): string {
	const trimmed = property.trim();
	return trimmed.startsWith('properties/') ? trimmed : `properties/${trimmed}`;
}

// Build a query string from the common list parameters, dropping any that are
// unset so they are not sent to the API.
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

// The Measurement Protocol lives on a different host and authenticates with a
// per-stream api_secret query param (NOT the OAuth token). It does not return a
// resource body, so it gets its own fetch-based path instead of corsair/http.
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

	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const text = await response.text();
	if (!response.ok && response.status !== 204) {
		throw new GoogleAnalyticsAPIError(
			`Measurement Protocol request failed: ${response.status} ${text}`,
			response.status,
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
