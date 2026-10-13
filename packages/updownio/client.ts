/** https://updown.io/api */
export const UPDOWN_IO_API_BASE = 'https://updown.io/api';

export class UpdownIOAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// Safe: callers narrow the body before reading it.
	// A narrower type is not practical because the body is arbitrary JSON or text that differs per route.
	public readonly body?: unknown;
	public readonly retryAfterMs?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			statusText?: string;
			// Safe: stored as-is and narrowed by callers before use.
			// A narrower type is not practical because the body differs per route.
			body?: unknown;
			retryAfterMs?: number;
		},
	) {
		super(message, options);
		this.name = 'UpdownIOAPIError';
		this.status = options?.status;
		this.statusText = options?.statusText;
		this.body = options?.body;
		this.retryAfterMs = options?.retryAfterMs;
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

// Safe: every endpoint parses the result with its zod output schema.
// A narrower type is not practical because the response shape differs per route.
async function parseResponseBody(response: Response): Promise<unknown> {
	const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
	if (contentType.startsWith('application/json')) {
		return await response.json();
	}
	const text = await response.text();
	return text.length > 0 ? text : undefined;
}

function retryAfterMsOf(response: Response): number | undefined {
	const seconds = Number(response.headers.get('Retry-After'));
	return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;
}

// Safe: typeof/`in` checks narrow it before any field is read.
// A narrower type is not practical because error bodies have no guaranteed shape.
function messageFromBody(body: unknown): string | undefined {
	if (body && typeof body === 'object' && 'error' in body) {
		if (typeof body.error === 'string') return body.error;
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return undefined;
}

// Safe: each endpoint validates the result with its zod output schema.
// A narrower type is not practical because the response shape differs per route.
export async function makeUpdownIORequest(
	endpoint: string,
	apiKey: string,
	options: UpdownIORequestOptions = {},
): Promise<unknown> {
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
			redirect: normalizedKey ? 'error' : 'follow',
			headers,
		});
		if (normalizedKey && response.status >= 300 && response.status < 400) {
			throw new UpdownIOAPIError(
				`Refused to follow HTTP ${response.status} redirect while sending an API key`,
			);
		}
		const body = await parseResponseBody(response);
		if (!response.ok) {
			throw new UpdownIOAPIError(
				messageFromBody(body) ??
					`Updown.io request failed (${response.status})`,
				{
					status: response.status,
					statusText: response.statusText,
					body,
					retryAfterMs: retryAfterMsOf(response),
				},
			);
		}
		return body;
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
