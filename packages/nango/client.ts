import { AuthMissingError } from 'corsair/core';

export class NangoError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly providerCode?: string,
		public readonly providerMessage?: string,
	) {
		super(message);
		this.name = 'NangoError';
	}
}

/** JSON is untrusted until the operation's output schema validates it. */
export async function nangoRequest(
	key: string,
	method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
	path: string,
	query: Record<string, string | number | boolean | undefined> = {},
	body?: unknown,
): Promise<unknown> {
	if (!key.trim()) throw new AuthMissingError('nango', 'api_key');
	const url = new URL(path, 'https://api.nango.dev');
	for (const [name, value] of Object.entries(query)) {
		if (value !== undefined) url.searchParams.set(name, String(value));
	}
	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method,
			redirect: 'error',
			credentials: 'omit',
			signal: AbortSignal.timeout(20_000),
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${key}`,
				...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
			},
			...(body === undefined ? {} : { body: JSON.stringify(body) }),
		});
	} catch {
		throw new NangoError('Nango request failed');
	}
	if (!response.ok) {
		const retry = response.headers.get('retry-after');
		const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : undefined;
		const date =
			retry && seconds === undefined ? Date.parse(retry) : Number.NaN;
		const retryAfter =
			seconds !== undefined
				? seconds * 1000
				: Number.isFinite(date)
					? Math.max(0, date - Date.now())
					: undefined;
		let providerCode: string | undefined;
		let providerMessage: string | undefined;
		try {
			const payload: unknown = await response.json();
			if (payload && typeof payload === 'object') {
				if (
					'error' in payload &&
					payload.error &&
					typeof payload.error === 'object'
				) {
					if ('code' in payload.error && typeof payload.error.code === 'string')
						providerCode = payload.error.code;
					if (
						'message' in payload.error &&
						typeof payload.error.message === 'string'
					)
						providerMessage = payload.error.message;
				} else if ('message' in payload && typeof payload.message === 'string')
					providerMessage = payload.message;
			}
		} catch {
			// Error responses can be empty or non-JSON.
		}
		throw new NangoError(
			'Nango HTTP request failed',
			response.status,
			retryAfter,
			providerCode,
			providerMessage,
		);
	}
	if (response.status === 204) return undefined;
	try {
		return await response.json();
	} catch {
		throw new NangoError('Nango returned invalid JSON', response.status);
	}
}
