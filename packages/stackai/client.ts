import { AuthMissingError } from 'corsair/core';

export const STACKAI_API_BASE = 'https://api.stack-ai.com';

export class StackAIAPIError extends Error {
	constructor(
		public readonly status: number,
		// Provider and intermediary error bodies can be JSON, text, or empty;
		// callers must narrow the preserved value before using its contents.
		public readonly body: unknown,
		public readonly retryAfter: number | undefined,
		public readonly method: 'GET' | 'POST',
	) {
		super(`StackAI request failed with HTTP ${status}`);
		this.name = 'StackAIAPIError';
	}
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
	if (
		!['https:', 'http:'].includes(base.protocol) ||
		base.username ||
		base.password ||
		base.pathname !== '/' ||
		base.search ||
		base.hash
	)
		throw new Error('StackAI baseURL must be an HTTP(S) origin');
	const url = new URL(path, base);
	for (const [name, value] of Object.entries(query ?? {}))
		if (value !== undefined && value !== null)
			url.searchParams.set(name, String(value));
	const headers: Record<string, string> = {
		Authorization: `Bearer ${key}`,
		Accept: 'application/json',
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	const response = await fetch(url.toString(), {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
		redirect: 'manual',
	});
	const text = await response.text();
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
