import { ApiError } from 'corsair/http';

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

	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = `${UPDOWN_IO_API_BASE}${path}`;

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers,
			// Credentialed requests must not follow redirects — X-API-KEY is not
			// stripped on cross-origin hops the way Authorization is.
			redirect: normalizedKey ? 'error' : 'follow',
		});
	} catch (error) {
		if (error instanceof Error) {
			throw new UpdownIOAPIError(error.message, { cause: error });
		}
		throw new UpdownIOAPIError('Unknown Updown.io API error');
	}

	if (normalizedKey && response.status >= 300 && response.status < 400) {
		throw new UpdownIOAPIError(
			`Refused to follow HTTP ${response.status} redirect while sending an API key`,
		);
	}

	let body: unknown;
	const text = await response.text();
	if (text) {
		try {
			body = JSON.parse(text) as unknown;
		} catch {
			body = text;
		}
	}

	if (!response.ok) {
		let message = response.statusText || `HTTP ${response.status}`;
		if (body && typeof body === 'object' && 'error' in body) {
			const nested = (body as Record<string, unknown>).error;
			if (typeof nested === 'string') message = nested;
		}
		throw new UpdownIOAPIError(message, {
			cause: new ApiError(
				{ method: 'GET', url: path },
				{
					url,
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body,
				},
				message,
			),
		});
	}

	return body as T;
}
