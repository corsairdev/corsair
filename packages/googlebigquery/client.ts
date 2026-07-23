import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GoogleBigqueryAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GoogleBigqueryAPIError';
	}
}

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
		throw new GoogleBigqueryAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	// OAuth token endpoint returns untyped JSON; cast to the known Google token fields
	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};

	return json;
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
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {
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
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

/**
 * BigQuery's operations are split across five distinct Google Cloud API hosts.
 * `host` selects which one a given request targets.
 */
export type GoogleBigqueryHost =
	| 'bigquery'
	| 'reservation'
	| 'analyticsHub'
	| 'analyticsHubBeta'
	| 'connection'
	| 'dataPolicy';

const GOOGLEBIGQUERY_API_BASES: Record<GoogleBigqueryHost, string> = {
	bigquery: 'https://bigquery.googleapis.com/bigquery/v2',
	reservation: 'https://bigqueryreservation.googleapis.com/v1',
	analyticsHub: 'https://analyticshub.googleapis.com/v1',
	analyticsHubBeta: 'https://analyticshub.googleapis.com/v1beta1',
	connection: 'https://bigqueryconnection.googleapis.com/v1',
	dataPolicy: 'https://bigquerydatapolicy.googleapis.com/v1',
};

type GoogleBigqueryRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<
		string,
		string | number | boolean | (string | number)[] | undefined
	>;
	host?: GoogleBigqueryHost;
};

export async function makeGoogleBigqueryRequest<T>(
	endpoint: string,
	accessToken: string,
	options: GoogleBigqueryRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, host = 'bigquery' } = options;

	const config: OpenAPIConfig = {
		BASE: GOOGLEBIGQUERY_API_BASES[host],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
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
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	return request<T>(config, requestOptions);
}

/**
 * Sends a pre-built multipart/related body (metadata JSON part + raw media part) to
 * BigQuery's upload endpoints, e.g. `jobs.insert` with `uploadType=multipart` for load
 * jobs that carry an inline file. `request()` passes string bodies through verbatim
 * when `mediaType` isn't `*\/json`, so the caller is responsible for assembling the
 * multipart body and boundary.
 */
export async function makeGoogleBigqueryUploadRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'POST' | 'PUT';
		rawBody: string;
		boundary: string;
		query?: Record<
			string,
			string | number | boolean | (string | number)[] | undefined
		>;
	},
): Promise<T> {
	const { method = 'POST', rawBody, boundary, query } = options;

	const config: OpenAPIConfig = {
		BASE: 'https://bigquery.googleapis.com',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: rawBody,
		mediaType: `multipart/related; boundary=${boundary}`,
		query,
	};

	return request<T>(config, requestOptions);
}

function isUnauthorizedError(error: unknown): boolean {
	return error instanceof ApiError && error.status === 401;
}

export async function makeAuthenticatedGoogleBigqueryRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: GoogleBigqueryRequestOptions = {},
): Promise<T> {
	try {
		return await makeGoogleBigqueryRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeGoogleBigqueryRequest<T>(endpoint, freshToken, options);
		}
		// Preserve ApiError (status, retryAfter) for error-handlers.ts to inspect.
		throw error;
	}
}

export async function makeAuthenticatedGoogleBigqueryUploadRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: {
		method?: 'POST' | 'PUT';
		rawBody: string;
		boundary: string;
		query?: Record<
			string,
			string | number | boolean | (string | number)[] | undefined
		>;
	},
): Promise<T> {
	try {
		return await makeGoogleBigqueryUploadRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeGoogleBigqueryUploadRequest<T>(
				endpoint,
				freshToken,
				options,
			);
		}
		throw error;
	}
}
