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

/** Send one request; never retry a potentially billable operation. */
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
		throw new ParallelError(
			'Parallel HTTP request failed',
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
