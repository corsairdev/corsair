import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class GoogleContactsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'GoogleContactsAPIError';
	}
}

const PEOPLE_API_BASE = 'https://people.googleapis.com/v1';

type PeopleRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

export async function makePeopleRequest<T>(
	endpoint: string,
	credentials: string,
	options: PeopleRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: PEOPLE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: credentials,
		HEADERS: {
			'Content-Type': 'application/json',
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
		query: query,
	};

	return await request<T>(config, requestOptions);
}

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

export async function makeAuthenticatedPeopleRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: PeopleRequestOptions = {},
): Promise<T> {
	try {
		return await makePeopleRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makePeopleRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}

/**
 * The People API rejects repeated query keys, so list-valued params
 * (personFields, readMask, sources) must arrive comma-joined.
 */
export function joinFieldMask(
	fields: string[] | undefined,
): string | undefined {
	return fields?.length ? fields.join(',') : undefined;
}
