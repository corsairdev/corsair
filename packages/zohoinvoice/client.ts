import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class ZohoInvoiceAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string | number,
	) {
		super(message);
		this.name = 'ZohoInvoiceAPIError';
	}
}

export type ZohoInvoiceRegion =
	| 'us'
	| 'eu'
	| 'in'
	| 'au'
	| 'jp'
	| 'ca'
	| 'cn'
	| 'sa';

const REGION_TLD: Record<ZohoInvoiceRegion, string> = {
	us: 'com',
	eu: 'eu',
	in: 'in',
	au: 'com.au',
	jp: 'jp',
	ca: 'ca',
	cn: 'com.cn',
	sa: 'sa',
};

function regionTld(region: ZohoInvoiceRegion = 'us'): string {
	return REGION_TLD[region];
}

export function zohoInvoiceApiBase(region?: ZohoInvoiceRegion): string {
	return `https://www.zohoapis.${regionTld(region)}/invoice/v3`;
}

export function zohoInvoiceOAuthAuthUrl(region?: ZohoInvoiceRegion): string {
	return `https://accounts.zoho.${regionTld(region)}/oauth/v2/auth`;
}

export function zohoInvoiceOAuthTokenUrl(region?: ZohoInvoiceRegion): string {
	return `https://accounts.zoho.${regionTld(region)}/oauth/v2/token`;
}

export type ZohoInvoiceRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	region?: ZohoInvoiceRegion;
	organizationId: string;
};

export async function makeZohoInvoiceRequest<T>(
	endpoint: string,
	token: string,
	options: ZohoInvoiceRequestOptions,
): Promise<T> {
	const { method = 'GET', body, query, region, organizationId } = options;
	if (!organizationId) {
		throw new ZohoInvoiceAPIError('Zoho Invoice organizationId is required');
	}

	const config: OpenAPIConfig = {
		BASE: zohoInvoiceApiBase(region),
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Zoho-oauthtoken ${token}`,
			'X-com-zoho-invoice-organizationid': organizationId,
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

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const status =
				'status' in error && typeof error.status === 'number'
					? error.status
					: undefined;
			const code =
				'body' in error &&
				typeof error.body === 'object' &&
				error.body !== null &&
				'code' in error.body &&
				(typeof error.body.code === 'string' ||
					typeof error.body.code === 'number')
					? error.body.code
					: undefined;
			throw new ZohoInvoiceAPIError(error.message, status, code);
		}
		throw new ZohoInvoiceAPIError('Unknown Zoho Invoice API error');
	}
}
