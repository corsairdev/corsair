export class ChatfaiAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string | number,
		public readonly status?: number,
		public readonly body?: unknown,
	) {
		super(message);
		this.name = 'ChatfaiAPIError';
	}
}

export class ChatfaiRateLimitError extends ChatfaiAPIError {
	constructor(
		message = 'Too Many Requests',
		public readonly retryAfterMs?: number,
		body?: unknown,
	) {
		super(message, 429, 429, body);
		this.name = 'ChatfaiRateLimitError';
	}
}

/** Official ChatFAI REST v1. https://chatfai.com/developers/docs */
export const CHATFAI_API_BASE = 'https://api.chatfai.com/v1';
const REQUEST_TIMEOUT_MS = 20_000;

export type ChatfaiRequestOptions = {
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

function errorMessage(status: number, body: unknown): string {
	if (body && typeof body === 'object') {
		const rec = body as Record<string, unknown>;
		if (typeof rec.error === 'string' && rec.error.length > 0) return rec.error;
		if (typeof rec.message === 'string' && rec.message.length > 0) {
			return rec.message;
		}
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return `ChatFAI request failed (${status})`;
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

function requestUrl(
	endpoint: string,
	query?: Record<string, string | number | boolean | undefined>,
): string {
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	const url = new URL(`${CHATFAI_API_BASE}${path}`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
	}
	return url.toString();
}

export async function makeChatfaiRequest<T>(
	endpoint: string,
	apiKey: string,
	options: ChatfaiRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWrite = method === 'POST' || method === 'PUT' || method === 'PATCH';

	let res: Response;
	try {
		res = await fetch(requestUrl(endpoint, query), {
			method,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: isWrite && body !== undefined ? JSON.stringify(body) : undefined,
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === 'TimeoutError') {
			throw new ChatfaiAPIError('ChatFAI request timed out');
		}
		throw new ChatfaiAPIError(
			error instanceof Error ? error.message : 'ChatFAI request failed',
		);
	}

	if (res.status === 429) {
		const parsed = await parseBody(res);
		throw new ChatfaiRateLimitError(
			errorMessage(res.status, parsed),
			retryAfterMs(res),
			parsed,
		);
	}

	const parsed = await parseBody(res);
	if (!res.ok) {
		throw new ChatfaiAPIError(
			errorMessage(res.status, parsed),
			res.status,
			res.status,
			parsed,
		);
	}
	return parsed as T;
}
