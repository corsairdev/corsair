import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EsputnikAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'EsputnikAPIError';
	}
}

export const ESPUTNIK_API_BASE = 'https://esputnik.com';

// eSputnik explains most errors in a short plain-text body ("Contact not
// found", "Group '42' is not static"). Keep it in the message so callers see
// why a request failed, not only the status text.
function withProviderDetail(message: string, body: unknown): string {
	if (typeof body !== 'string') return message;
	const detail = body.trim().slice(0, 500);
	return detail && detail !== message ? `${message}: ${detail}` : message;
}

export async function makeEsputnikRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Bodies reach transport only after the endpoint Zod schema has parsed
		// them; provider extension keys are preserved as opaque JSON values.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		// Overrides the default `Accept: application/json` for routes that
		// answer in another format (the tracking script is text/plain).
		accept?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, accept } = options;

	const config: OpenAPIConfig = {
		BASE: ESPUTNIK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		// No Content-Type here: the shared client adds it only when a body is
		// sent. eSputnik answers 415 to a GET that carries one (site/script).
		HEADERS: {
			Authorization: `Basic ${Buffer.from(`api_key:${apiKey}`).toString('base64')}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' ? undefined : body,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' || method === 'DELETE' ? query : undefined,
		headers: accept ? { Accept: accept } : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new EsputnikAPIError(
				withProviderDetail(error.message, error.body),
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		throw error;
	}
}
