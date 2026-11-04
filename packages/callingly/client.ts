/** https://help.callingly.com/article/38-api */
export const CALLINGLY_API_BASE = 'https://api.callingly.com/v1';

export class CallinglyAPIError extends Error {
	public readonly status?: number;
	public readonly method?: string;
	public readonly retryAfterMs?: number;
	// Safe: callers narrow the body before reading any field.
	// A narrower type is not practical because Callingly error bodies are arbitrary JSON or text.
	public readonly body?: unknown;

	constructor(
		message: string,
		options?: {
			cause?: Error;
			status?: number;
			method?: string;
			retryAfterMs?: number;
			// Safe: stored as-is and narrowed by callers before use.
			// A narrower type is not practical because Callingly error bodies are arbitrary JSON or text.
			body?: unknown;
		},
	) {
		super(message, options);
		this.name = 'CallinglyAPIError';
		this.status = options?.status;
		this.method = options?.method;
		this.retryAfterMs = options?.retryAfterMs;
		this.body = options?.body;
	}
}

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue | undefined };

export type CallinglyRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, JsonValue | undefined> | JsonValue[];
	query?: Record<string, string | number | undefined>;
	/** Agency client account to act on. Sent as the documented `account_id` parameter. */
	accountId?: string | number;
};

function retryAfterMsOf(response: Response): number | undefined {
	const seconds = Number(response.headers.get('Retry-After'));
	return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;
}

// Safe: every endpoint parses the result with its zod output schema.
// A narrower type is not practical because the response shape differs per route.
async function parseBody(response: Response): Promise<unknown> {
	const text = await response.text();
	if (text.length === 0) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

// Safe: typeof and `in` checks narrow it before any field is read.
// A narrower type is not practical because error bodies have no guaranteed shape.
function messageFromBody(body: unknown): string | undefined {
	if (body && typeof body === 'object') {
		if ('message' in body && typeof body.message === 'string') {
			return body.message;
		}
		if ('error' in body && typeof body.error === 'string') return body.error;
	}
	if (typeof body === 'string' && body.length > 0) return body;
	return undefined;
}

// Safe: each endpoint validates the result with its zod output schema.
// A narrower type is not practical because the response shape differs per route.
export async function makeCallinglyRequest(
	path: string,
	apiKey: string,
	options: CallinglyRequestOptions = {},
): Promise<unknown> {
	const { method = 'GET', accountId } = options;
	let { body, query } = options;

	if (accountId !== undefined && accountId !== '') {
		if (body === undefined || Array.isArray(body)) {
			query = { ...query, account_id: accountId };
		} else {
			body = { account_id: accountId, ...body };
		}
	}

	const url = new URL(`${CALLINGLY_API_BASE}/${path.replace(/^\//, '')}`);
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined) url.searchParams.set(key, String(value));
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
	};
	if (body !== undefined) headers['Content-Type'] = 'application/json';

	let response: Response;
	try {
		response = await fetch(url, {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	} catch (error) {
		throw new CallinglyAPIError(
			error instanceof Error ? error.message : 'Callingly request failed',
			{ cause: error instanceof Error ? error : undefined, method },
		);
	}

	const parsed = await parseBody(response);
	if (!response.ok) {
		throw new CallinglyAPIError(
			messageFromBody(parsed) ??
				`Callingly request failed (${response.status})`,
			{
				status: response.status,
				method,
				retryAfterMs: retryAfterMsOf(response),
				body: parsed,
			},
		);
	}
	return parsed;
}
