import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const FREEAGENT_API_BASE = 'https://api.freeagent.com';
export const FREEAGENT_SANDBOX_API_BASE = 'https://api.sandbox.freeagent.com';

export async function makeFreeAgentRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		// A shared transport accepts different schema-validated resource envelopes as JSON records.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		sandbox?: boolean;
	} = {},
): Promise<T> {
	if (accessToken.length === 0) {
		throw new AuthMissingError('freeagent', 'oauth_2');
	}
	const { method = 'GET', body, query, sandbox = false } = options;
	const config: OpenAPIConfig = {
		BASE: sandbox ? FREEAGENT_SANDBOX_API_BASE : FREEAGENT_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'User-Agent': 'Corsair FreeAgent integration',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};
	return request<T>(config, requestOptions);
}
