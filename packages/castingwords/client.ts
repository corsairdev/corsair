import { ApiError } from 'corsair/http';

export class CastingwordsAPIError extends Error {
	public readonly status?: number;
	// API error bodies vary by endpoint; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			body?: unknown;
			retryAfter?: number;
		},
	) {
		super(message, options?.cause ? { cause: options.cause } : undefined);
		this.name = 'CastingwordsAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			return;
		}
		this.status = options?.status;
		this.body = options?.body;
		this.retryAfter = options?.retryAfter;
	}
}

/** Official Store API v4: https://castingwords.com/docs/developer/SimpleAPI.html */
export const CASTINGWORDS_API_BASE = 'https://castingwords.com/store/API4';

type JsonValue = string | number | boolean | string[] | undefined;

type RequestOptions = {
	method?: 'GET' | 'POST';
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, JsonValue>;
};

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

// Response bodies vary (JSON object or transcript text); unknown forces
// callers to narrow before use.
async function parseBody(res: Response): Promise<unknown> {
	const text = await res.text();
	if (!text) return undefined;
	const contentType = res.headers.get('Content-Type') ?? '';
	if (contentType.toLowerCase().includes('json')) {
		try {
			return JSON.parse(text) as unknown;
		} catch {
			return text;
		}
	}
	return text;
}

export async function makeCastingwordsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: RequestOptions = {},
): Promise<T> {
	const method = options.method ?? 'GET';
	const url = new URL(
		`${CASTINGWORDS_API_BASE}/${endpoint.replace(/^\//, '')}`,
	);
	if (method === 'GET') {
		url.searchParams.set('api_key', apiKey);
		for (const [key, value] of Object.entries(options.query ?? {})) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
	}

	const body =
		method === 'POST'
			? JSON.stringify({ api_key: apiKey, ...options.body })
			: undefined;

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			redirect: 'error',
			headers: {
				Accept: 'application/json',
				...(body ? { 'Content-Type': 'application/json' } : {}),
			},
			body,
		});
	} catch (error) {
		return handleRequestError(error);
	}

	const parsed = await parseBody(res);
	if (!res.ok) {
		const message =
			parsed &&
			typeof parsed === 'object' &&
			'message' in parsed &&
			typeof parsed.message === 'string'
				? parsed.message
				: `CastingWords request failed (${res.status})`;
		throw new CastingwordsAPIError(message, {
			status: res.status,
			body: parsed,
			retryAfter: retryAfterMs(res),
		});
	}
	return parsed as T;
}

// Catch values are untyped at runtime; unknown forces narrowing to ApiError/Error
// before rethrowing as CastingwordsAPIError.
function handleRequestError(error: unknown): never {
	if (error instanceof ApiError) {
		throw new CastingwordsAPIError(error.message, { cause: error });
	}
	if (error instanceof Error) {
		throw new CastingwordsAPIError(error.message, { cause: error });
	}
	throw new CastingwordsAPIError('Unknown CastingWords API error');
}
