export class CoinbaseAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'CoinbaseAPIError';
	}
}

export class CoinbaseRateLimitError extends CoinbaseAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429, body);
		this.name = 'CoinbaseRateLimitError';
	}
}

/** Coinbase App API: https://docs.cdp.coinbase.com/coinbase-app/docs/welcome */
export const COINBASE_API_BASE = 'https://api.coinbase.com';

/** API version header Coinbase requires on v2 requests. */
export const COINBASE_API_VERSION = '2019-08-15';

const REQUEST_TIMEOUT_MS = 20_000;

export type CoinbaseRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
};

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function errorMessage(body: unknown, fallback: string): string {
	if (body !== null && typeof body === 'object') {
		const rec = body as Record<string, unknown>;
		if (Array.isArray(rec.errors) && rec.errors[0]) {
			const first = rec.errors[0];
			if (first !== null && typeof first === 'object') {
				const err = first as Record<string, unknown>;
				if (typeof err.message === 'string' && err.message.length > 0) {
					return err.message;
				}
				if (typeof err.id === 'string' && err.id.length > 0) {
					return err.id;
				}
			}
		}
		if (typeof rec.message === 'string' && rec.message.length > 0) {
			return rec.message;
		}
		if (typeof rec.error === 'string' && rec.error.length > 0) {
			return rec.error;
		}
	}
	return fallback;
}

function errorCode(body: unknown): string | undefined {
	if (body !== null && typeof body === 'object') {
		const rec = body as Record<string, unknown>;
		if (Array.isArray(rec.errors) && rec.errors[0]) {
			const first = rec.errors[0];
			if (first !== null && typeof first === 'object') {
				const err = first as Record<string, unknown>;
				if (typeof err.id === 'string') return err.id;
			}
		}
	}
	return undefined;
}

export async function makeCoinbaseRequest<T>(
	endpoint: string,
	apiKey: string,
	options: CoinbaseRequestOptions & {
		schema: { parse: (data: unknown) => T };
	},
): Promise<T> {
	const { method = 'GET', body, query, schema } = options;
	const url = new URL(
		endpoint.startsWith('http')
			? endpoint
			: `${COINBASE_API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
	);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			url.searchParams.set(key, String(value));
		}
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'CB-VERSION': COINBASE_API_VERSION,
	};
	if (apiKey) {
		headers.Authorization = `Bearer ${apiKey}`;
	}
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';
	if (isWrite && body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			headers,
			body: isWrite && body !== undefined ? JSON.stringify(body) : undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new CoinbaseAPIError('Coinbase request timed out');
		}
		throw new CoinbaseAPIError(
			error instanceof Error ? error.message : 'Coinbase request failed',
		);
	}

	let parsed: unknown;
	let text: string;
	try {
		text = await res.text();
	} catch (error) {
		throw new CoinbaseAPIError(
			error instanceof Error ? error.message : 'Coinbase request failed',
		);
	}
	try {
		parsed = text ? JSON.parse(text) : undefined;
	} catch {
		parsed = text;
	}

	if (res.status === 429) {
		throw new CoinbaseRateLimitError(
			errorMessage(parsed, 'Too Many Requests'),
			retryAfterMs(res),
			parsed,
		);
	}

	if (!res.ok) {
		throw new CoinbaseAPIError(
			errorMessage(parsed, `Coinbase request failed (${res.status})`),
			errorCode(parsed),
			res.status,
			parsed,
		);
	}

	try {
		return schema.parse(parsed);
	} catch (error) {
		throw new CoinbaseAPIError(
			error instanceof Error
				? error.message
				: 'Coinbase response failed validation',
			undefined,
			res.status,
			parsed,
		);
	}
}
