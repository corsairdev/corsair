import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

const ALLOWED_API_HOST =
	/^(www\.)?zohoapis\.(com|eu|in|com\.au|jp|ca|com\.cn|sa)$/;

export class ZohoInventoryAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: number | string,
		public readonly body?: unknown,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ZohoInventoryAPIError';
	}
}

/**
 * Zoho Inventory datacenters.
 * @see https://www.zoho.com/inventory/api/v1/introduction/
 * @see https://www.zoho.com/inventory/api/v1/oauth/
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

/** Canada OAuth uses accounts.zohocloud.ca; API stays on zohoapis.ca. */
const OAUTH_HOST: Record<ZohoInventoryRegion, string> = {
	us: 'accounts.zoho.com',
	eu: 'accounts.zoho.eu',
	in: 'accounts.zoho.in',
	au: 'accounts.zoho.com.au',
	jp: 'accounts.zoho.jp',
	ca: 'accounts.zohocloud.ca',
	cn: 'accounts.zoho.com.cn',
	sa: 'accounts.zoho.sa',
};

function regionTld(region?: ZohoInventoryRegion): string {
	return REGION_TLD[region ?? 'us'] ?? REGION_TLD.us;
}

export function stripTrailingSlashes(str: string): string {
	let end = str.length;
	while (end > 0 && str.charCodeAt(end - 1) === 47) {
		end--;
	}
	return str.slice(0, end);
}

export function isAllowedZohoApiDomain(apiDomain: string): boolean {
	try {
		const parsed = new URL(
			apiDomain.includes('://') ? apiDomain : `https://${apiDomain}`,
		);
		return (
			parsed.protocol === 'https:' && ALLOWED_API_HOST.test(parsed.hostname)
		);
	} catch {
		return false;
	}
}

export function zohoInventoryApiBase(
	region?: ZohoInventoryRegion,
	apiDomain?: string,
): string {
	const trimmedDomain = apiDomain?.trim();
	if (trimmedDomain && isAllowedZohoApiDomain(trimmedDomain)) {
		const parsed = new URL(
			trimmedDomain.includes('://')
				? stripTrailingSlashes(trimmedDomain)
				: `https://${stripTrailingSlashes(trimmedDomain)}`,
		);
		return `${parsed.origin}/inventory/v1`;
	}
	return `https://www.zohoapis.${regionTld(region)}/inventory/v1`;
}

export function zohoInventoryOAuthAuthUrl(
	region?: ZohoInventoryRegion,
): string {
	return `https://${OAUTH_HOST[region ?? 'us']}/oauth/v2/auth`;
}

export function zohoInventoryOAuthTokenUrl(
	region?: ZohoInventoryRegion,
): string {
	return `https://${OAUTH_HOST[region ?? 'us']}/oauth/v2/token`;
}

export type ZohoInventoryRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string>;
	formData?: Record<string, string | Blob>;
	region?: ZohoInventoryRegion;
	apiDomain?: string;
	binary?: boolean;
};

/** Fill `{name}` tokens without a regex so user ids never hit a ReDoS pattern. */
export function applyPathTemplate(
	template: string,
	path?: Record<string, string>,
): string {
	if (!path) return template;
	let out = template;
	for (const [key, value] of Object.entries(path)) {
		out = out.split(`{${key}}`).join(encodeURIComponent(value));
	}
	return out;
}

function headersFor(token: string): Record<string, string> {
	return { Authorization: `Zoho-oauthtoken ${token}` };
}

function throwIfZohoError(res: unknown): void {
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
}

function wrapError(error: unknown): never {
	if (error instanceof ZohoInventoryAPIError) throw error;
	if (error instanceof ApiError) {
		let message = error.message;
		let zohoCode: number | string | undefined;
		if (error.body && typeof error.body === 'object') {
			const errorBody = error.body as Record<string, unknown>;
			if (typeof errorBody.message === 'string') message = errorBody.message;
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
			error.retryAfter,
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

export async function makeZohoInventoryRequest<T>(
	endpoint: string,
	token: string,
	options: ZohoInventoryRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		formData,
		path,
		region,
		apiDomain,
		binary,
	} = options;
	const base = zohoInventoryApiBase(region, apiDomain);

	if (binary) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(query ?? {})) {
			if (value !== undefined) params.set(key, String(value));
		}
		const qs = params.toString();
		const url = `${base}${applyPathTemplate(endpoint, path)}${qs ? `?${qs}` : ''}`;
		const response = await fetch(url, {
			method,
			headers: headersFor(token),
		});
		if (!response.ok) {
			let zohoCode: number | string | undefined;
			let message = response.statusText;
			try {
				const errBody = (await response.json()) as {
					code?: number | string;
					message?: string;
				};
				if (typeof errBody.message === 'string') message = errBody.message;
				zohoCode = errBody.code;
			} catch {
				// PDF/error body was not JSON
			}
			const retryAfterHeader = response.headers.get('retry-after');
			const retryAfter =
				retryAfterHeader && !Number.isNaN(Number(retryAfterHeader))
					? Number(retryAfterHeader) * 1000
					: undefined;
			throw new ZohoInventoryAPIError(
				message,
				response.status,
				zohoCode,
				undefined,
				retryAfter,
			);
		}
		const bytes = Buffer.from(await response.arrayBuffer());
		return {
			content_type: response.headers.get('content-type') ?? 'application/pdf',
			content_base64: bytes.toString('base64'),
		} as T;
	}

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			...headersFor(token),
			...(formData ? {} : { 'Content-Type': 'application/json' }),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		body:
			!formData && (method === 'POST' || method === 'PUT' || method === 'PATCH')
				? body
				: undefined,
		formData,
		mediaType: formData ? undefined : 'application/json',
		query,
	};

	try {
		const res = await request<T>(config, requestOptions);
		throwIfZohoError(res);
		return res;
	} catch (error) {
		wrapError(error);
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
