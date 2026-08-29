import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ZohoInventoryAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: number | string,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'ZohoInventoryAPIError';
	}
}

/**
 * Zoho operates region-specific datacenters.
 * The OAuth (accounts.zoho.*) and Inventory API (zohoapis.*) hosts share the same top-level domain per region.
 * @see https://www.zoho.com/inventory/api/v1/
 */
export type ZohoInventoryRegion =
	| 'us'
	| 'eu'
	| 'in'
	| 'au'
	| 'jp'
	| 'ca'
	| 'cn'
	| 'sa';

const REGION_TLD: Record<ZohoInventoryRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	ca: 'ca',
	cn: 'com.cn',
	sa: 'sa',
};

function regionTld(region?: ZohoInventoryRegion): string {
	return REGION_TLD[region ?? 'us'] ?? REGION_TLD.us;
}

export function zohoInventoryApiBase(
	region?: ZohoInventoryRegion,
	apiDomain?: string,
): string {
	if (apiDomain) {
		const cleanDomain = apiDomain.replace(/\/+$/, '');
		return `${cleanDomain}/inventory/v1`;
	}
	return `https://www.zohoapis.${regionTld(region)}/inventory/v1`;
}

export function zohoInventoryOAuthAuthUrl(
	region?: ZohoInventoryRegion,
): string {
	return `https://accounts.zoho.${regionTld(region)}/oauth/v2/auth`;
}

export function zohoInventoryOAuthTokenUrl(
	region?: ZohoInventoryRegion,
): string {
	return `https://accounts.zoho.${regionTld(region)}/oauth/v2/token`;
}

export type ZohoInventoryRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	region?: ZohoInventoryRegion;
	apiDomain?: string;
};

/**
 * Zoho Inventory authenticates with `Authorization: Zoho-oauthtoken <token>`.
 */
export async function makeZohoInventoryRequest<T>(
	endpoint: string,
	token: string,
	options: ZohoInventoryRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, region, apiDomain } = options;

	const config: OpenAPIConfig = {
		BASE: zohoInventoryApiBase(region, apiDomain),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Zoho-oauthtoken ${token}`,
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
		query: method === 'GET' ? query : undefined,
	};

	try {
		const res = await request<T>(config, requestOptions);

		// Check if Zoho returned an error payload wrapped inside a 200 response
		if (
			res &&
			typeof res === 'object' &&
			'code' in res &&
			typeof (res as { code: unknown }).code === 'number' &&
			(res as { code: number }).code !== 0
		) {
			const zohoError = res as { code: number; message?: string };
			throw new ZohoInventoryAPIError(
				zohoError.message || `Zoho Inventory error code ${zohoError.code}`,
				undefined,
				zohoError.code,
				res,
			);
		}

		return res;
	} catch (error) {
		if (error instanceof ZohoInventoryAPIError) {
			throw error;
		}

		if (error instanceof ApiError) {
			let message = error.message;
			let zohoCode: number | string | undefined;
			if (error.body && typeof error.body === 'object') {
				const errorBody = error.body as Record<string, unknown>;
				if (typeof errorBody.message === 'string') {
					message = errorBody.message;
				}
				if (
					typeof errorBody.code === 'number' ||
					typeof errorBody.code === 'string'
				) {
					zohoCode = errorBody.code;
				}
			}
			throw new ZohoInventoryAPIError(
				message,
				error.status,
				zohoCode,
				error.body,
			);
		}

		if (error instanceof Error) {
			const status =
				'status' in error &&
				typeof (error as { status: unknown }).status === 'number'
					? (error as { status: number }).status
					: undefined;
			throw new ZohoInventoryAPIError(error.message, status);
		}

		throw new ZohoInventoryAPIError('Unknown error');
	}
}

export function isUnauthorizedError(error: unknown): boolean {
	if (error instanceof ZohoInventoryAPIError) {
		if (error.status === 401) return true;
		if (error.code === 57 || error.code === '57') return true;
		const msg = error.message.toLowerCase();
		return (
			msg.includes('invalid_oauthtoken') ||
			msg.includes('invalid oauthtoken') ||
			msg.includes('invalid_token') ||
			msg.includes('unauthorized')
		);
	}
	if (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	) {
		return true;
	}
	return false;
}

export type ZohoInventoryRequestContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

/**
 * Wrapper around makeZohoInventoryRequest that retries once on 401 by force-refreshing
 * the access token via ctx._refreshAuth.
 */
export async function makeAuthenticatedZohoInventoryRequest<T>(
	endpoint: string,
	ctx: ZohoInventoryRequestContext,
	options: ZohoInventoryRequestOptions = {},
): Promise<T> {
	try {
		return await makeZohoInventoryRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeZohoInventoryRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
