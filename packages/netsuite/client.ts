import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export type NetSuiteBase = 'account' | 'system' | 'datacenter';

export type NetSuiteRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: Record<string, unknown> | string;
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string>;
	headers?: Record<string, string>;
	formBody?: Record<string, string | number | boolean | undefined>;
	base?: NetSuiteBase;
	accountId?: string;
	auth?: 'bearer' | 'none';
	basicAuth?: [string, string];
	accept?: string;
};

export function normalizeAccountHost(accountId: string): string {
	return accountId.trim().toLowerCase().replace(/_/g, '-');
}

export function netSuiteAccountBase(accountId: string): string {
	return `https://${normalizeAccountHost(accountId)}.suitetalk.api.netsuite.com`;
}

export function netSuiteSystemBase(accountId: string): string {
	return `https://${normalizeAccountHost(accountId)}.app.netsuite.com`;
}

export function netSuiteOAuthTokenUrl(accountId: string): string {
	return `${netSuiteAccountBase(accountId)}/services/rest/auth/oauth2/v1/token`;
}

export function netSuiteOAuthRevokeUrl(accountId: string): string {
	return `${netSuiteAccountBase(accountId)}/services/rest/auth/oauth2/v1/revoke`;
}

export function netSuiteOAuthKeysUrl(accountId: string): string {
	return `${netSuiteAccountBase(accountId)}/services/rest/auth/oauth2/v1/keys`;
}

export function netSuiteOAuthLogoutUrl(accountId: string): string {
	return `${netSuiteAccountBase(accountId)}/services/rest/auth/oauth2/v1/logout`;
}

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

function baseFor(base: NetSuiteBase, accountId: string): string {
	if (base === 'datacenter') return 'https://rest.netsuite.com';
	if (base === 'system') return netSuiteSystemBase(accountId);
	return `${netSuiteAccountBase(accountId)}/services/rest`;
}

function compactQuery(
	query: NetSuiteRequestOptions['query'],
): Record<string, string | number | boolean> | undefined {
	if (!query) return undefined;
	const out: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) out[key] = value;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}

function compactForm(
	form: NetSuiteRequestOptions['formBody'],
): string | undefined {
	if (!form) return undefined;
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(form)) {
		if (value !== undefined) params.set(key, String(value));
	}
	return params.toString();
}

/** Calls NetSuite with an OAuth 2 bearer token (or no auth for public endpoints). */
export async function makeNetSuiteRequest<T>(
	endpoint: string,
	token: string,
	options: NetSuiteRequestOptions = {},
): Promise<T> {
	const accountId = options.accountId?.trim();
	if (!accountId) {
		throw new Error(
			'[auth-missing:netsuite]: NetSuite accountId is required. Set `accountId` on the plugin options or store it under the `account_id` account key.',
		);
	}
	const base = baseFor(options.base ?? 'account', accountId);
	const headers: Record<string, string> = {
		Accept: options.accept ?? 'application/json',
		...(options.basicAuth
			? {
					Authorization: `Basic ${Buffer.from(
						`${options.basicAuth[0]}:${options.basicAuth[1]}`,
					).toString('base64')}`,
				}
			: options.auth === 'none'
				? {}
				: { Authorization: `Bearer ${token}` }),
		...options.headers,
	};
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		ENCODE_PATH: encodeURIComponent,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};
	const formBody = compactForm(options.formBody);
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: endpoint,
		path: options.path,
		query: compactQuery(options.query),
		body: formBody ?? options.body,
		mediaType: formBody
			? 'application/x-www-form-urlencoded'
			: options.body
				? 'application/json'
				: undefined,
	};
	return await request<T>(config, requestOptions);
}
