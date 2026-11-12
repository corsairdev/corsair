import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export type DigicertApiFamily =
	| 'certcentral'
	| 'accountManager'
	| 'privateCA'
	| 'reportLibrary'
	| 'trustLifecycle'
	| 'contentTrust';
export type DigiCertOneRegion = 'us' | 'jp' | 'ch' | 'nl' | 'au';

export const DIGICERT_ONE_HOSTS: Record<DigiCertOneRegion, string> = {
	us: 'one.digicert.com',
	jp: 'one.digicert.co.jp',
	ch: 'one.ch.digicert.com',
	nl: 'one.nl.digicert.com',
	au: 'one.au.digicert.com',
};

export class DigicertAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DigicertAPIError';
	}
}

export const CERTCENTRAL_BASES = {
	us: 'https://www.digicert.com/services/v2',
	eu: 'https://certcentral.digicert.eu/services/v2',
} as const;
export const REPORT_LIBRARY_BASES = {
	us: 'https://api.digicert.com/reports/v1',
	eu: 'https://report.digicert.eu/reports/v1',
} as const;
export const DIGICERT_ONE_BASE = 'https://one.digicert.com';
export const CONTENT_TRUST_BASE = `${DIGICERT_ONE_BASE}/documentmanager`;

export async function makeDigicertRequest<T>(
	family: DigicertApiFamily,
	endpoint: string,
	apiKey: string | undefined,
	options: {
		region?: 'us' | 'eu';
		reportRegion?: 'us' | 'eu';
		digicertOneRegion?: DigiCertOneRegion;
		public?: boolean;
		authScheme?: 'api_key' | 'oauth_2';
		method?: ApiRequestOptions['method'];
		path?: ApiRequestOptions['path'];
		query?: ApiRequestOptions['query'];
		headers?: ApiRequestOptions['headers'];
		cookies?: ApiRequestOptions['cookies'];
		body?: ApiRequestOptions['body'];
		formData?: ApiRequestOptions['formData'];
		mediaType?: ApiRequestOptions['mediaType'];
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		region = 'us',
		reportRegion = 'us',
		digicertOneRegion = 'us',
		authScheme = 'api_key',
		path,
		query,
		headers,
		cookies,
		body,
		formData,
		mediaType,
	} = options;
	const publicRoute = options.public === true;
	if (!publicRoute && apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('digicert', 'api_key');
	}
	if (!publicRoute && apiKey === undefined) {
		throw new AuthMissingError('digicert', 'api_key');
	}

	const oneBase = `https://${DIGICERT_ONE_HOSTS[digicertOneRegion]}`;
	const base =
		family === 'certcentral'
			? CERTCENTRAL_BASES[region]
			: family === 'reportLibrary'
				? REPORT_LIBRARY_BASES[reportRegion]
				: family === 'contentTrust'
					? `${oneBase}/documentmanager`
					: oneBase;
	const authHeader =
		authScheme === 'oauth_2'
			? 'Authorization'
			: family === 'certcentral' || family === 'reportLibrary'
				? 'X-DC-DEVKEY'
				: 'x-api-key';
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			...(formData ? {} : { 'Content-Type': 'application/json' }),
			...(apiKey && !publicRoute
				? {
						[authHeader]:
							authScheme === 'oauth_2' ? `Bearer ${apiKey}` : apiKey,
					}
				: {}),
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path,
		query,
		headers,
		cookies,
		body,
		formData,
		mediaType,
	};
	return request<T>(config, requestOptions);
}
