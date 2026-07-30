import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleMapsAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GoogleMapsAPIError';
	}
}

const DEFAULT_MAPS_BASE = 'https://maps.googleapis.com';

export type GoogleMapsRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export type GoogleMapsRequestContext = {
	key?: string;
	authType?: 'api_key' | 'oauth_2';
	options?: { authType?: 'api_key' | 'oauth_2' };
};

export function getGoogleMapsAuthType(
	ctx: GoogleMapsRequestContext,
): 'api_key' | 'oauth_2' | undefined {
	return ctx.authType ?? ctx.options?.authType;
}

export function isGoogleMapsOAuth(ctx: GoogleMapsRequestContext): boolean {
	return getGoogleMapsAuthType(ctx) === 'oauth_2';
}

function buildPhotoAuth(
	ctx: GoogleMapsRequestContext,
	url: URL,
): { headers: Record<string, string> } {
	const token = ctx.key ?? '';
	const isOAuth = isGoogleMapsOAuth(ctx);
	const headers: Record<string, string> = {};

	if (isOAuth) {
		if (!token) {
			throw new GoogleMapsAPIError(
				'OAuth access token is required',
				401,
				'UNAUTHENTICATED',
			);
		}
		headers.Authorization = `Bearer ${token}`;
	} else if (token) {
		headers['X-Goog-Api-Key'] = token;
		if (url.hostname === 'maps.googleapis.com') {
			url.searchParams.set('key', token);
		}
	}

	return { headers };
}

/** Resolves an authenticated photo without embedding secrets in the returned URL. */
export async function resolvePlacePhotoUrl(
	ctx: GoogleMapsRequestContext,
	photoRequestUrl: string,
): Promise<string> {
	const url = new URL(photoRequestUrl);
	const { headers } = buildPhotoAuth(ctx, url);

	if (url.hostname === 'maps.googleapis.com') {
		url.searchParams.set('skipHttpRedirect', 'true');
		const response = await fetch(url.toString(), { method: 'GET', headers });
		if (!response.ok) {
			throw new GoogleMapsAPIError(
				`Failed to resolve place photo URL (${response.status})`,
				response.status,
			);
		}
		const payload = (await response.json()) as { photoUri?: string };
		if (!payload.photoUri) {
			throw new GoogleMapsAPIError('Place photo response missing photoUri');
		}
		return payload.photoUri;
	}

	const response = await fetch(url.toString(), {
		method: 'GET',
		headers,
		redirect: 'follow',
	});
	if (!response.ok) {
		throw new GoogleMapsAPIError(
			`Failed to resolve place photo URL (${response.status})`,
			response.status,
		);
	}

	const contentType = response.headers.get('content-type') ?? '';
	if (contentType.startsWith('image/')) {
		const buffer = Buffer.from(await response.arrayBuffer());
		return `data:${contentType};base64,${buffer.toString('base64')}`;
	}

	return response.url;
}

export async function makeGoogleMapsRequest<T>(
	endpoint: string,
	ctx: GoogleMapsRequestContext,
	options: GoogleMapsRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query = {}, headers = {}, baseUrl } = options;

	const apiBase = baseUrl ?? DEFAULT_MAPS_BASE;
	const token = ctx.key ?? '';
	const isOAuth = isGoogleMapsOAuth(ctx);

	const requestHeaders: Record<string, string> = {
		'Content-Type': 'application/json',
		...headers,
	};

	const requestQuery: Record<string, string | number | boolean | undefined> = {
		...query,
	};

	if (isOAuth) {
		if (!token) {
			throw new GoogleMapsAPIError(
				'OAuth access token is required',
				401,
				'UNAUTHENTICATED',
			);
		}
		requestHeaders.Authorization = `Bearer ${token}`;
	} else if (token) {
		requestHeaders['X-Goog-Api-Key'] = token;
		if (!requestQuery.key) {
			requestQuery.key = token;
		}
	}

	const config: OpenAPIConfig = {
		BASE: apiBase,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: requestHeaders,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: requestQuery,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error: unknown) {
		const err = error as {
			status?: number;
			statusCode?: number;
			retryAfter?: number;
			headers?: Record<string, unknown>;
			response?: {
				status?: number;
				headers?: Record<string, unknown>;
				data?: { error?: { message?: string; code?: string } };
			};
			body?: { error?: { message?: string; code?: string } };
			message?: string;
		};

		const status = err?.status ?? err?.statusCode ?? err?.response?.status;
		const message =
			err?.body?.error?.message ??
			err?.response?.data?.error?.message ??
			err?.message ??
			'Unknown Google Maps API Error';
		const code = err?.body?.error?.code ?? err?.response?.data?.error?.code;

		const retryHeader =
			err?.headers?.['retry-after'] ?? err?.response?.headers?.['retry-after'];
		const retryAfter =
			err?.retryAfter ??
			(retryHeader ? parseInt(String(retryHeader), 10) : undefined);

		throw new GoogleMapsAPIError(message, status, code, retryAfter);
	}
}
