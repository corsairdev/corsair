import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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

// A failed create or update would otherwise carry the submitted contact (names,
// emails, phones, addresses) on ApiError.request. Rebuild the error without the
// request body; status, provider body, message and rate-limit fields stay as core
// set them.
// `unknown`: the caught value may not be an ApiError; anything else is rethrown untouched.
function withoutRequestBody(error: unknown): unknown {
	if (!(error instanceof ApiError) || error.request?.body === undefined) {
		return error;
	}
	return new ApiError(
		{ ...error.request, body: undefined },
		{
			url: error.url,
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: error.body,
		},
		error.message,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

// `unknown`: a caught value can be anything at runtime.
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
		if (!isUnauthorizedError(error) || !ctx._refreshAuth) {
			throw withoutRequestBody(error);
		}
		const freshToken = await ctx._refreshAuth();
		try {
			return await makePeopleRequest<T>(endpoint, freshToken, options);
		} catch (retryError) {
			throw withoutRequestBody(retryError);
		}
	}
}

const RESOURCE_NAME_PATTERNS = {
	people: /^people\/(me|c?[A-Za-z0-9_-]+)$/,
	otherContacts: /^otherContacts\/c?[A-Za-z0-9_-]+$/,
	contactGroups: /^contactGroups\/[A-Za-z0-9_-]+$/,
} as const;

/**
 * Resource names go into the URL path unencoded (Google wants the slash), so
 * anything beyond `<collection>/<id>` is refused before a request is built.
 */
export function resourcePath(
	kind: keyof typeof RESOURCE_NAME_PATTERNS,
	resourceName: string,
): string {
	if (!RESOURCE_NAME_PATTERNS[kind].test(resourceName)) {
		throw new Error(
			`Invalid ${kind} resource name; expected ${kind}/<id>, e.g. ${
				kind === 'people'
					? 'people/c123456789'
					: kind === 'otherContacts'
						? 'otherContacts/c123456789'
						: 'contactGroups/myContacts'
			}`,
		);
	}
	return `/${resourceName}`;
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
