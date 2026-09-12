import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

/** https://updown.io/api */
export const UPDOWN_IO_API_BASE = 'https://updown.io/api';

export class UpdownIOAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(message: string, options?: { cause?: Error }) {
		super(message, options);
		this.name = 'UpdownIOAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

export type UpdownIORequestOptions = {
	/**
	 * Whether the route needs a key. The node endpoints are public, so only the
	 * account-scoped routes fail closed when no key has been connected.
	 * https://updown.io/api
	 */
	requiresAuth?: boolean;
};

export async function makeUpdownIORequest<T>(
	endpoint: string,
	apiKey: string,
	options: UpdownIORequestOptions = {},
): Promise<T> {
	const normalizedKey = apiKey.trim();
	if (options.requiresAuth && !normalizedKey) {
		throw new UpdownIOAPIError('Updown.io API key is required');
	}

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (normalizedKey) headers['X-API-KEY'] = normalizedKey;

	const config: OpenAPIConfig = {
		BASE: UPDOWN_IO_API_BASE,
		VERSION: '1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: headers,
	};
	const requestOptions: ApiRequestOptions = { method: 'GET', url: endpoint };

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// updown.io reports failures as `{ "error": "..." }`.
			const body = error.body;
			let message = error.message;
			if (body && typeof body === 'object' && 'error' in body) {
				const nested = (body as Record<string, unknown>).error;
				if (typeof nested === 'string') message = nested;
			}
			throw new UpdownIOAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new UpdownIOAPIError(error.message, { cause: error });
		}
		throw new UpdownIOAPIError('Unknown Updown.io API error');
	}
}
