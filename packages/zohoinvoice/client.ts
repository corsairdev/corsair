import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

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

// Zoho's Canada data center signs in on zohocloud.ca; its API stays on
// www.zohoapis.ca.
function accountsHost(region: ZohoInvoiceRegion = 'us'): string {
	return region === 'ca'
		? 'accounts.zohocloud.ca'
		: `accounts.zoho.${regionTld(region)}`;
}

export function zohoInvoiceOAuthAuthUrl(region?: ZohoInvoiceRegion): string {
	return `https://${accountsHost(region)}/oauth/v2/auth`;
}

export function zohoInvoiceOAuthTokenUrl(region?: ZohoInvoiceRegion): string {
	return `https://${accountsHost(region)}/oauth/v2/token`;
}

export type ZohoInvoiceRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	// Caller-built JSON body; Zoho takes free-form resource fields.
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	region?: ZohoInvoiceRegion;
	/** Sent as X-com-zoho-invoice-organizationid. Left out for GET /organizations. */
	organizationId?: string;
};

/**
 * One call to the Zoho Invoice API. Core's ApiError passes through unchanged:
 * its status and Retry-After are what the error handlers and core's OAuth
 * refresh read. Zoho's own error `code` and `message` stay on `error.body`.
 */
export async function makeZohoInvoiceRequest<T>(
	endpoint: string,
	token: string,
	options: ZohoInvoiceRequestOptions,
): Promise<T> {
	const { method = 'GET', body, query, region, organizationId } = options;

	const config: OpenAPIConfig = {
		BASE: zohoInvoiceApiBase(region),
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: `Zoho-oauthtoken ${token}`,
			...(organizationId
				? { 'X-com-zoho-invoice-organizationid': organizationId }
				: {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		query,
		...(body && (method === 'POST' || method === 'PUT')
			? { body, mediaType: 'application/json' }
			: {}),
	};

	return request<T>(config, requestOptions);
}
