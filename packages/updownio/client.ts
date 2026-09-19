/** https://updown.io/api */
export const UPDOWN_IO_API_BASE = 'https://updown.io/api';

export class UpdownIOAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			body?: unknown;
		},
	) {
		super(message, options);
		this.name = 'UpdownIOAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
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

async function parseResponseBody(response: Response): Promise<unknown> {
	const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
	if (contentType.startsWith('application/json')) {
		return await response.json();
	}
	const text = await response.text();
	return text.length > 0 ? text : undefined;
}

function messageFromBody(body: unknown): string | undefined {
	if (body && typeof body === 'object' && 'error' in body) {
		const nested = (body as Record<string, unknown>).error;
		if (typeof nested === 'string') return nested;
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return undefined;
}

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

	const base = UPDOWN_IO_API_BASE.endsWith('/')
		? UPDOWN_IO_API_BASE.slice(0, -1)
		: UPDOWN_IO_API_BASE;
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = `${base}${path}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			redirect: 'error',
			headers,
		});
		const body = await parseResponseBody(response);
		if (!response.ok) {
			throw new UpdownIOAPIError(
				messageFromBody(body) ??
					`Updown.io request failed (${response.status})`,
				{
					status: response.status,
					statusText: response.statusText,
					body,
				},
			);
		}
		return body as T;
	} catch (error) {
		if (error instanceof UpdownIOAPIError) {
			throw error;
		}
		if (error instanceof Error) {
			throw new UpdownIOAPIError(error.message, { cause: error });
		}
		throw new UpdownIOAPIError('Unknown Updown.io API error');
	}
}
