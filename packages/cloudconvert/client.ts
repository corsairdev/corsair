import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

/**
 * Base URL of the CloudConvert API v2, documented at
 * https://cloudconvert.com/docs/getting-started/introduction#base-url-and-region-endpoints
 */
export const CLOUDCONVERT_API_BASE = 'https://api.cloudconvert.com/v2';

/** Base URL for CloudConvert's synchronous job and task endpoints. */
export const CLOUDCONVERT_SYNC_API_BASE =
	'https://sync.api.cloudconvert.com/v2';

/**
 * A CloudConvert failure the shared client could not represent.
 *
 * `corsair/http` throws `ApiError` for every HTTP status it maps, so this only
 * wraps a rejection that was not an `Error` at all.
 */
export class CloudConvertAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CloudConvertAPIError';
	}
}

export type CloudConvertQuery = Record<
	string,
	string | number | boolean | undefined
>;

export type CloudConvertRequest = {
	method: 'GET' | 'POST' | 'DELETE';
	path: string;
	host?: 'sync';
	query?: CloudConvertQuery;
	/** The endpoint's zod input schema validated this JSON request body. */
	body?: object;
};

/**
 * Sends one request to CloudConvert.
 *
 * Auth is `Authorization: Bearer <API key>`, documented at
 * https://cloudconvert.com/docs/getting-started/introduction#authentication
 * (not set through `TOKEN`, so the exact header is asserted in tests).
 *
 * An `undefined` key sends no credentials for the discovery routes; an
 * explicitly empty key is missing credentials and fails fast with Corsair's
 * `AuthMissingError`.
 */
export async function makeCloudConvertRequest<T>(
	apiKey: string | undefined,
	{ method, path, host, query, body }: CloudConvertRequest,
): Promise<T> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('cloudconvert', 'api_key');
	}

	const authHeaders: Record<string, string> = apiKey
		? { Authorization: `Bearer ${apiKey}` }
		: {};

	const config: OpenAPIConfig = {
		BASE: host === 'sync' ? CLOUDCONVERT_SYNC_API_BASE : CLOUDCONVERT_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new CloudConvertAPIError('Unknown error');
	}
}
