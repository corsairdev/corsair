import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export const GOOGLE_CLASSROOM_API_BASE = 'https://classroom.googleapis.com';

export type GoogleClassroomQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number | boolean)[]
	| undefined;

export async function makeGoogleClassroomRequest(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: object;
		query?: Record<string, GoogleClassroomQueryValue>;
	} = {},
) {
	const { method = 'GET', body, query } = options;
	if (accessToken.length === 0) {
		throw new AuthMissingError('googleclassroom', 'oauth_2');
	}

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
