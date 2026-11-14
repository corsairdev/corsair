import { AuthMissingError } from 'corsair/core';

export class ParallelError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'ParallelError';
	}
}

/** Parallel's error body is {"type":"error","error":{"ref_id","message","detail"}}.
 * Its message says what to change (e.g. a missing memory_scope_key) and never
 * contains the API key; it is cut to 300 characters.
 */
async function errorMessage(response: Response): Promise<string | undefined> {
	try {
		// The error body is untrusted JSON; only a string message is read from it.
		const body: unknown = await response.json();
		const error =
			body && typeof body === 'object' && 'error' in body ? body.error : body;
		const message =
			error && typeof error === 'object' && 'message' in error
				? error.message
				: undefined;
		return typeof message === 'string' ? message.slice(0, 300) : undefined;
	} catch {
		return undefined;
	}
}

/** Send one request; never retry a potentially billable operation.
 * The untrusted JSON varies by endpoint and must be parsed by its output schema.
 */
export async function parallelRequest(
	key: string,
	path: string,
	body?: object,
	method: 'GET' | 'POST' = 'POST',
	headers: Record<string, string> = {},
	timeoutMs = 60_000,
): Promise<unknown> {
	if (!key.trim()) throw new AuthMissingError('parallel', 'api_key');
	let response: Response;
	try {
		response = await fetch(`https://api.parallel.ai${path}`, {
			method,
			headers: {
				'x-api-key': key,
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...headers,
			},
			...(body === undefined ? {} : { body: JSON.stringify(body) }),
			redirect: 'error',
			credentials: 'omit',
			signal: AbortSignal.timeout(timeoutMs),
		});
	} catch {
		throw new ParallelError('Parallel request failed');
	}
	if (!response.ok) {
		const value = response.headers.get('retry-after');
		const seconds = value && /^\d+$/.test(value) ? Number(value) : undefined;
		const date =
			value && seconds === undefined ? Date.parse(value) : Number.NaN;
		const retryAfter =
			seconds !== undefined
				? seconds * 1000
				: Number.isFinite(date)
					? Math.max(0, date - Date.now())
					: undefined;
		const detail = await errorMessage(response);
		throw new ParallelError(
			detail
				? `Parallel HTTP ${response.status}: ${detail}`
				: `Parallel HTTP ${response.status}`,
			response.status,
			retryAfter,
		);
	}
	if (response.status === 204) return undefined;
	try {
		return await response.json();
	} catch {
		throw new ParallelError('Parallel returned invalid JSON', response.status);
	}
}
