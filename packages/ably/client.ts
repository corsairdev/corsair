import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class AblyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly statusCode?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'AblyAPIError';
	}
}

const ABLY_API_BASE = 'https://rest.ably.io';

/**
 * Makes an authenticated request to the Ably REST API.
 *
 * Ably server-side API keys use HTTP Basic authentication. The complete
 * Ably API key is encoded as the Basic-auth credential.
 */
export async function makeAblyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | unknown[];
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ABLY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
		},
	};

	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			const apiError = error as {
				status?: number;
				retryAfter?: number;
				body?: {
					error?: {
						message?: string;
						code?: number | string;
						statusCode?: number;
					};
				};
			};

			const ablyError = apiError.body?.error;

			throw new AblyAPIError(
				ablyError?.message ?? error.message,
				ablyError?.code === undefined ? undefined : String(ablyError.code),
				ablyError?.statusCode ?? apiError.status,
				apiError.retryAfter,
			);
		}

		throw new AblyAPIError('Unknown Ably API error');
	}
}

function nextQueryFromLink(
	linkHeader: string | null,
): Record<string, string> | undefined {
	if (!linkHeader) {
		return undefined;
	}

	for (const part of linkHeader.split(',')) {
		const match = /<([^>]+)>\s*;\s*rel="?next"?/i.exec(part);
		if (!match?.[1]) {
			continue;
		}

		const url = new URL(match[1], `${ABLY_API_BASE}/`);
		const next: Record<string, string> = {};
		url.searchParams.forEach((value, key) => {
			next[key] = value;
		});
		return Object.keys(next).length > 0 ? next : undefined;
	}

	return undefined;
}

export async function makeAblyListRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<{ items: T[]; next?: Record<string, string> }> {
	const url = new URL(endpoint, `${ABLY_API_BASE}/`);
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) {
			url.searchParams.set(key, String(value));
		}
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
		},
		signal: AbortSignal.timeout(20_000),
	});

	if (!response.ok) {
		const raw = await response.text();
		let body: unknown = raw;
		try {
			body = JSON.parse(raw);
		} catch {
			body = raw;
		}

		const ablyError =
			typeof body === 'object' && body !== null && 'error' in body
				? (
						body as {
							error?: {
								message?: string;
								code?: number | string;
								statusCode?: number;
							};
						}
					).error
				: undefined;
		const retryAfterHeader = response.headers.get('Retry-After');
		const retryAfterSeconds = retryAfterHeader
			? Number(retryAfterHeader)
			: Number.NaN;

		throw new AblyAPIError(
			ablyError?.message ?? `HTTP ${response.status}: ${response.statusText}`,
			ablyError?.code === undefined ? undefined : String(ablyError.code),
			ablyError?.statusCode ?? response.status,
			Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : undefined,
		);
	}

	const payload = (await response.json()) as unknown;
	const items = Array.isArray(payload) ? (payload as T[]) : [];
	const next = nextQueryFromLink(response.headers.get('Link'));
	return next ? { items, next } : { items };
}
