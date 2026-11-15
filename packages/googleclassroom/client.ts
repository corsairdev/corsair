import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const GOOGLE_CLASSROOM_API_BASE = 'https://classroom.googleapis.com';

export type GoogleClassroomQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number | boolean)[]
	| undefined;

export type GoogleClassroomRequestContext = {
	key: string;
	// Set by core's OAuth keyBuilder; refreshes the access token after a 401.
	_refreshAuth?: () => Promise<string>;
};

export type GoogleClassroomRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: object;
	query?: Record<string, GoogleClassroomQueryValue>;
};

// `unknown` because a caught value can be anything; instanceof narrows it before status is read.
function isUnauthorized(error: unknown): boolean {
	return error instanceof ApiError && error.status === 401;
}

async function sendGoogleClassroomRequest(
	endpoint: string,
	accessToken: string,
	options: GoogleClassroomRequestOptions,
) {
	const { method = 'GET', body, query } = options;
	const config: OpenAPIConfig = {
		BASE: GOOGLE_CLASSROOM_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
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

	// `unknown` because the provider response is untrusted until the operation output schema validates it.
	const response: unknown = await request<unknown>(config, requestOptions);
	return response;
}

// A 401 refreshes the OAuth token once and retries only the request that failed, the same
// as the other Google plugins. Google rejected that request before running it, so a write
// is safe to resend. Core's refresh guard keeps this to one refresh per call.
export async function makeGoogleClassroomRequest(
	endpoint: string,
	ctx: GoogleClassroomRequestContext,
	options: GoogleClassroomRequestOptions = {},
) {
	if (ctx.key.length === 0) {
		throw new AuthMissingError('googleclassroom', 'oauth_2');
	}
	try {
		return await sendGoogleClassroomRequest(endpoint, ctx.key, options);
	} catch (error) {
		if (!isUnauthorized(error) || !ctx._refreshAuth) throw error;
		const freshKey = await ctx._refreshAuth();
		return sendGoogleClassroomRequest(endpoint, freshKey, options);
	}
}
