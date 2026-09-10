export class BlocknativeAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'BlocknativeAPIError';
	}
}

export class BlocknativeRateLimitError extends BlocknativeAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429, body);
		this.name = 'BlocknativeRateLimitError';
	}
}

/** Official Gas Platform: https://docs.blocknative.com/gas-prediction */
export const BLOCKNATIVE_API_BASE = 'https://api.blocknative.com';

const REQUEST_TIMEOUT_MS = 20_000;

export type BlocknativeRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	query?: Record<string, string | number | boolean | number[] | undefined>;
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
		if (typeof rec.msg === 'string') return rec.msg;
		if (typeof rec.message === 'string') return rec.message;
		if (typeof rec.error === 'string') return rec.error;
	}
	return fallback;
}

export async function makeBlocknativeRequest<T>(
	endpoint: string,
	apiKey: string,
	options: BlocknativeRequestOptions & {
		schema: { parse: (data: unknown) => T };
	},
): Promise<T> {
	const { method = 'GET', query } = options;
	const url = new URL(`${BLOCKNATIVE_API_BASE}${endpoint}`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === undefined) continue;
			if (Array.isArray(value)) {
				for (const item of value) url.searchParams.append(key, String(item));
			} else {
				url.searchParams.set(key, String(value));
			}
		}
	}

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			headers: {
				Accept: 'application/json',
				Authorization: apiKey,
			},
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new BlocknativeAPIError('Blocknative request timed out');
		}
		throw new BlocknativeAPIError(
			error instanceof Error ? error.message : 'Blocknative request failed',
		);
	}

	let parsed: unknown;
	let text: string;
	try {
		text = await res.text();
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new BlocknativeAPIError('Blocknative request timed out');
		}
		throw new BlocknativeAPIError(
			error instanceof Error ? error.message : 'Blocknative request failed',
		);
	}
	try {
		parsed = text ? JSON.parse(text) : undefined;
	} catch {
		parsed = text;
	}

	if (res.status === 429) {
		throw new BlocknativeRateLimitError(
			errorMessage(parsed, 'Too Many Requests'),
			retryAfterMs(res),
			parsed,
		);
	}

	if (!res.ok) {
		throw new BlocknativeAPIError(
			errorMessage(parsed, `Blocknative request failed (${res.status})`),
			undefined,
			res.status,
			parsed,
		);
	}

	try {
		return options.schema.parse(parsed);
	} catch (error) {
		throw new BlocknativeAPIError(
			error instanceof Error
				? error.message
				: 'Blocknative response failed validation',
			undefined,
			res.status,
			parsed,
		);
	}
}
