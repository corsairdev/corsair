import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { MailcoachJsonValue } from './endpoints/types';

export type MailcoachMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type MailcoachQueryValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| MailcoachQueryValue[]
	| { [key: string]: MailcoachQueryValue };

export class MailcoachAPIError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MailcoachAPIError';
	}
}

const MAILCOACH_DOMAIN =
	/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+mailcoach\.app$/i;

export function normalizeMailcoachApiUrl(apiUrl: string | undefined): string {
	if (apiUrl === undefined || apiUrl.length === 0) {
		throw new MailcoachAPIError(
			'Mailcoach apiUrl is required; set the team API URL from Mailcoach API Tokens.',
		);
	}

	let parsed: URL;
	try {
		parsed = new URL(apiUrl);
	} catch {
		throw new MailcoachAPIError(
			'Mailcoach apiUrl must be a valid HTTPS team URL.',
		);
	}

	const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '');
	if (
		parsed.protocol !== 'https:' ||
		(parsed.port !== '' && parsed.port !== '443') ||
		parsed.username.length > 0 ||
		parsed.password.length > 0 ||
		!MAILCOACH_DOMAIN.test(hostname) ||
		parsed.pathname.replace(/\/$/, '') !== '/api' ||
		parsed.search.length > 0 ||
		parsed.hash.length > 0
	) {
		throw new MailcoachAPIError(
			'Mailcoach apiUrl must use https://<team>.mailcoach.app/api without credentials, extra path, query, or fragment.',
		);
	}

	return `${parsed.origin}/api`;
}

function resolveNextPageQuery(
	apiUrl: string,
	endpoint: string,
	nextPageUrl: string | undefined,
): Record<string, MailcoachQueryValue> | undefined {
	if (nextPageUrl === undefined) return undefined;

	const base = new URL(apiUrl);
	let next: URL;
	try {
		next = new URL(nextPageUrl);
	} catch {
		throw new MailcoachAPIError(
			'Mailcoach pagination link is not a valid URL.',
		);
	}

	const expectedPath = `${base.pathname}${endpoint}`.replace(/\/{2,}/g, '/');
	if (
		next.origin !== base.origin ||
		next.pathname !== expectedPath ||
		next.username.length > 0 ||
		next.password.length > 0 ||
		next.hash.length > 0
	) {
		throw new MailcoachAPIError(
			'Mailcoach pagination link must remain on the configured team API and resource.',
		);
	}

	const query: Record<string, MailcoachQueryValue> = {};
	for (const [key, value] of next.searchParams.entries()) {
		query[key] = value;
	}
	return query;
}

function sanitizedApiError(error: ApiError): ApiError {
	const requestOptions: ApiRequestOptions = {
		...error.request,
		url: '[Mailcoach endpoint redacted]',
		headers: undefined,
		query: undefined,
		path: undefined,
		cookies: undefined,
		formData: undefined,
		body: undefined,
	};
	return new ApiError(
		requestOptions,
		{
			url: '[Mailcoach endpoint redacted]',
			ok: false,
			status: error.status,
			statusText: 'Mailcoach API response',
			body: 'Mailcoach error response omitted to protect submitted data.',
		},
		`Mailcoach API request failed with HTTP ${error.status}. Provider response details are omitted to protect submitted data.`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeMailcoachRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		apiUrl?: string;
		method?: MailcoachMethod;
		body?: Record<string, MailcoachJsonValue | undefined>;
		query?: Record<string, MailcoachQueryValue>;
		nextPageUrl?: string;
	} = {},
): Promise<T> {
	if (apiKey.length === 0) {
		throw new AuthMissingError('mailcoach', 'api_key');
	}

	const apiUrl = normalizeMailcoachApiUrl(options.apiUrl);
	const queryFromNext = resolveNextPageQuery(
		apiUrl,
		endpoint,
		options.nextPageUrl,
	);
	if (queryFromNext !== undefined && options.query !== undefined) {
		throw new MailcoachAPIError(
			'Pass either a Mailcoach query or a pagination link, not both.',
		);
	}

	const config: OpenAPIConfig = {
		BASE: apiUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method ?? 'GET',
		url: endpoint,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
		query: queryFromNext ?? options.query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) throw sanitizedApiError(error);
		// Network errors can include request URLs or provider text; keep the
		// propagated message generic because request inputs may contain PII.
		throw new MailcoachAPIError('Mailcoach API request failed.');
	}
}
