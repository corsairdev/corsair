import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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

const MP_FETCH_TIMEOUT_MS = 15_000;

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
