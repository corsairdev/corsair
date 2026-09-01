export class WorkiomAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'WorkiomAPIError';
	}
}

export class WorkiomRateLimitError extends WorkiomAPIError {
	constructor(
		message = 'Workiom API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'WorkiomRateLimitError';
	}
}

/** Official: https://help.workiom.com/article/workiom-api-guide */
export const WORKIOM_API_BASE = 'https://api.workiom.com';
const REQUEST_TIMEOUT_MS = 30_000;
const NO_DEK_ERROR_PATTERN = /no dek found/i;

export async function tryGetStoredKey(
	getter: () => Promise<string | null | undefined>,
): Promise<string | undefined> {
	try {
		const value = await getter();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && NO_DEK_ERROR_PATTERN.test(error.message)) {
			return undefined;
		}
		throw error;
	}
}

function retryAfterMs(res: Response): number | undefined {
	const raw = res.headers.get('Retry-After');
	if (!raw) return undefined;
	const seconds = Number(raw);
	if (Number.isFinite(seconds)) return seconds * 1000;
	const at = Date.parse(raw);
	return Number.isFinite(at) ? Math.max(0, at - Date.now()) : undefined;
}

function abpErrorMessage(body: unknown, status: number): string {
	if (body && typeof body === 'object') {
		const envelope = body as {
			error?: { message?: unknown; details?: unknown };
			message?: unknown;
		};
		if (typeof envelope.error?.message === 'string' && envelope.error.message) {
			return envelope.error.message;
		}
		if (typeof envelope.message === 'string' && envelope.message) {
			return envelope.message;
		}
	}
	return `Workiom request failed (${status})`;
}

async function parseBody(res: Response): Promise<unknown> {
	const text = await res.text();
	if (!text) return undefined;
	try {
		return JSON.parse(text) as unknown;
	} catch {
		return text;
	}
}

function unwrapAbp(parsed: unknown, status: number): unknown {
	if (parsed === null || typeof parsed !== 'object' || !('result' in parsed)) {
		return parsed;
	}
	const envelope = parsed as {
		success?: unknown;
		result: unknown;
		error?: { message?: unknown };
	};
	if (envelope.success === false) {
		const message =
			typeof envelope.error?.message === 'string'
				? envelope.error.message
				: abpErrorMessage(parsed, status);
		throw new WorkiomAPIError(message, undefined, status);
	}
	return envelope.result;
}

export async function makeWorkiomRequest(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
		body?: unknown;
	} = {},
): Promise<unknown> {
	const method = options.method ?? 'GET';
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) params.set(key, String(value));
	}
	const qs = params.toString();
	const url = `${WORKIOM_API_BASE}${path.startsWith('/') ? path : `/${path}`}${qs ? `?${qs}` : ''}`;

	let res: Response;
	try {
		res = await fetch(url, {
			method,
			headers: {
				'X-Api-Key': apiKey,
				Accept: 'application/json',
				...(options.body !== undefined
					? { 'Content-Type': 'application/json' }
					: {}),
			},
			body:
				options.body !== undefined ? JSON.stringify(options.body) : undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new WorkiomAPIError('Workiom request timed out');
		}
		throw new WorkiomAPIError(
			error instanceof Error ? error.message : 'Workiom request failed',
		);
	}

	if (res.status === 429) {
		await res.body?.cancel();
		throw new WorkiomRateLimitError(undefined, retryAfterMs(res));
	}

	let parsed: unknown;
	try {
		parsed = await parseBody(res);
	} catch (error) {
		if (
			error instanceof Error &&
			(error.name === 'TimeoutError' || error.name === 'AbortError')
		) {
			throw new WorkiomAPIError('Workiom request timed out');
		}
		throw new WorkiomAPIError(
			error instanceof Error ? error.message : 'Workiom request failed',
		);
	}
	if (!res.ok) {
		throw new WorkiomAPIError(
			abpErrorMessage(parsed, res.status),
			undefined,
			res.status,
		);
	}
	return unwrapAbp(parsed, res.status);
}
