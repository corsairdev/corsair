export class DripcelAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'DripcelAPIError';
	}
}

export class DripcelRateLimitError extends DripcelAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'DripcelRateLimitError';
	}
}

const DRIPCEL_API_BASE = 'https://api.dripcel.com';
const REQUEST_TIMEOUT_MS = 20_000;

export type DripcelRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown> | unknown;
	query?: Record<string, string | number | boolean | undefined>;
};

function formatError(error: unknown): string {
	if (typeof error === 'string') return error;
	if (Array.isArray(error)) {
		try {
			return JSON.stringify(error);
		} catch {
			return 'Dripcel request failed';
		}
	}
	if (error && typeof error === 'object') {
		const record = error as Record<string, unknown>;
		if (typeof record.message === 'string') return record.message;
		if (typeof record.error === 'string') return record.error;
		try {
			return JSON.stringify(error);
		} catch {
			return 'Dripcel request failed';
		}
	}
	return 'Dripcel request failed';
}

function retryAfterMs(res: Response, body: unknown): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (raw) {
		const seconds = Number(raw);
		if (Number.isFinite(seconds)) return seconds * 1000;
		const at = Date.parse(raw);
		if (Number.isFinite(at)) return Math.max(0, at - Date.now());
	}
	const record =
		body && typeof body === 'object'
			? (body as Record<string, unknown>)
			: undefined;
	const nested =
		record?.error && typeof record.error === 'object'
			? (record.error as Record<string, unknown>)
			: undefined;
	if (typeof nested?.resetsAt === 'number') {
		return Math.max(0, nested.resetsAt * 1000 - Date.now());
	}
	return undefined;
}

function unwrapData<T>(raw: unknown): T {
	if (raw && typeof raw === 'object' && 'ok' in raw) {
		const envelope = raw as { ok: boolean; data?: T; error?: unknown };
		if (!envelope.ok) {
			throw new DripcelAPIError(formatError(envelope.error));
		}
		return envelope.data as T;
	}
	return raw as T;
}

function buildUrl(
	endpoint: string,
	query?: Record<string, string | number | boolean | undefined>,
): string {
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = new URL(`${DRIPCEL_API_BASE}${path}`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

export async function makeDripcelRequest<T>(
	endpoint: string,
	apiKey: string,
	options: DripcelRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	let res: Response;
	try {
		res = await fetch(buildUrl(endpoint, query), {
			method,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: isWriteMethod ? JSON.stringify(body) : undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new DripcelAPIError('Dripcel request timed out');
		}
		throw new DripcelAPIError(
			error instanceof Error ? error.message : 'Dripcel request failed',
		);
	}

	let parsed: unknown;
	try {
		parsed = await res.json();
	} catch {
		parsed = undefined;
	}

	if (res.status === 429) {
		throw new DripcelRateLimitError(
			formatError(parsed) === 'Dripcel request failed'
				? 'Too Many Requests'
				: formatError(parsed),
			retryAfterMs(res, parsed),
			parsed,
		);
	}

	if (!res.ok) {
		throw new DripcelAPIError(
			formatError(parsed) === 'Dripcel request failed'
				? `Dripcel request failed (${res.status})`
				: formatError(parsed),
			res.status,
			res.status,
			parsed,
		);
	}

	return unwrapData<T>(parsed);
}
