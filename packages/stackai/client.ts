import { AuthMissingError } from 'corsair/core';

export const STACKAI_API_BASE = 'https://api.stack-ai.com';

// Requests that take longer than this are aborted, body read included.
export const REQUEST_TIMEOUT_MS = 60_000;

export class StackAIAPIError extends Error {
	// Provider and intermediary error bodies can be JSON, text, or empty;
	// callers must narrow the preserved value before using its contents.
	public readonly body: unknown;

	constructor(
		public readonly status: number,
		body: unknown,
		public readonly retryAfter: number | undefined,
		public readonly method: 'GET' | 'POST',
	) {
		const safeBody = safeErrorBody(body);
		const detail = providerMessage(safeBody);
		super(
			`StackAI request failed with HTTP ${status}${detail ? `: ${detail}` : ''}`,
		);
		this.name = 'StackAIAPIError';
		this.body = safeBody;
	}
}

// The error keeps only messages, field locations and error types: a 422
// `input` (or any other field) can echo the caller's data.
function safeErrorBody(body: unknown): unknown {
	if (typeof body === 'string') return body.slice(0, 300);
	if (!body || typeof body !== 'object') return body;
	const { detail, errors } = body as { detail?: unknown; errors?: unknown };
	const safe: { detail?: unknown; errors?: unknown } = {};
	if (typeof detail === 'string') safe.detail = detail;
	else if (Array.isArray(detail))
		safe.detail = detail.flatMap<unknown>((item) => {
			if (typeof item === 'string') return [item];
			if (!item || typeof item !== 'object') return [];
			const { loc, msg, type } = item as {
				loc?: unknown;
				msg?: unknown;
				type?: unknown;
			};
			return [
				{
					...(Array.isArray(loc) ? { loc } : {}),
					...(typeof msg === 'string' ? { msg } : {}),
					...(typeof type === 'string' ? { type } : {}),
				},
			];
		});
	if (Array.isArray(errors))
		safe.errors = errors.flatMap<unknown>((item) => {
			const message = (item as { message?: unknown } | null)?.message;
			return typeof message === 'string' ? [{ message }] : [];
		});
	return safe;
}

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

// Error bodies are `{ detail: string[] }`, `{ errors: [{ message }] }` or a
// FastAPI 422 `{ detail: [{ loc, msg, input }] }`. Only the messages and field
// locations are kept: a 422 `input` echoes the caller's data.
function providerMessage(body: unknown): string | undefined {
	if (!body || typeof body !== 'object') return undefined;
	const { detail, errors } = body as { detail?: unknown; errors?: unknown };
	const parts: string[] = [];
	if (Array.isArray(detail))
		for (const item of detail) {
			if (typeof item === 'string') parts.push(item);
			else if (item && typeof item === 'object') {
				const { loc, msg } = item as { loc?: unknown; msg?: unknown };
				if (typeof msg !== 'string') continue;
				parts.push(Array.isArray(loc) ? `${loc.join('.')}: ${msg}` : msg);
			}
		}
	else if (typeof detail === 'string') parts.push(detail);
	if (!parts.length && Array.isArray(errors))
		for (const item of errors) {
			const message = (item as { message?: unknown } | null)?.message;
			if (typeof message === 'string') parts.push(message);
		}
	const text = parts.join('; ');
	return text ? text.slice(0, 300) : undefined;
}

function retryDelay(value: string | null): number | undefined {
	if (!value) return undefined;
	if (/^\d+$/.test(value)) {
		const milliseconds = Number(value) * 1000;
		return Number.isFinite(milliseconds) ? milliseconds : undefined;
	}
	const date = Date.parse(value);
	return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}

// The raw response is untrusted and varies by endpoint (or may be text/empty),
// so its body stays unknown until the endpoint-specific schema validates it.
export async function stackAIRequest(
	key: string,
	baseURL: string | undefined,
	method: 'GET' | 'POST',
	path: string,
	query?: Record<string, string | number | null | undefined>,
	body?: object,
): Promise<{ body: unknown; location: string | null }> {
	if (!key || !key.trim()) throw new AuthMissingError('stackai', 'api_key');
	const base = new URL(baseURL ?? STACKAI_API_BASE);
	// Plain HTTP would send the key unencrypted, so it is only allowed for a
	// local test server.
	const isLoopbackHttp =
		base.protocol === 'http:' && LOOPBACK_HOSTS.has(base.hostname);
	if (
		(base.protocol !== 'https:' && !isLoopbackHttp) ||
		base.username ||
		base.password ||
		base.pathname !== '/' ||
		base.search ||
		base.hash
	)
		throw new Error(
			'StackAI baseURL must be an HTTPS origin (HTTP only for localhost)',
		);
	const url = new URL(path, base);
	for (const [name, value] of Object.entries(query ?? {}))
		if (value !== undefined && value !== null)
			url.searchParams.set(name, String(value));
	const headers: Record<string, string> = {
		Authorization: `Bearer ${key}`,
		Accept: 'application/json',
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	let response: Response;
	let text: string;
	try {
		// The signal stays active through response.text(), so a stalled body
		// is aborted too. Timed-out writes are not retried (DEFAULT handler).
		response = await fetch(url.toString(), {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
			redirect: 'manual',
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
		text = await response.text();
	} catch (error) {
		// DOMException can come from another realm, so match on the name.
		if ((error as { name?: unknown } | null)?.name === 'TimeoutError')
			throw new Error(
				`StackAI request timed out after ${REQUEST_TIMEOUT_MS / 1000} s`,
			);
		throw error;
	}
	// JSON may contain any value; retain unknown until an endpoint parses it.
	let data: unknown = text;
	if (text) {
		try {
			data = JSON.parse(text) as unknown;
		} catch {
			/* Preserve non-JSON provider errors. */
		}
	} else data = undefined;
	if (!response.ok)
		throw new StackAIAPIError(
			response.status,
			data,
			retryDelay(response.headers.get('retry-after')),
			method,
		);
	return { body: data, location: response.headers.get('location') };
}
