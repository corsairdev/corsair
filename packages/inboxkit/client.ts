/** The one host the API key is ever sent to. */
export const INBOXKIT_API_BASE = 'https://api.inboxkit.com';

const INBOXKIT_TIMEOUT_MS = 20_000;

export type InboxkitErrorCode =
	| 'invalid_key'
	| 'invalid_input'
	| 'workspace_required'
	| 'network'
	| 'timeout';

/** A failure that isn't an HTTP answer from the API: bad input, the network, a timeout. */
export class InboxkitError extends Error {
	constructor(
		message: string,
		public readonly code: InboxkitErrorCode,
	) {
		super(message);
		this.name = 'InboxkitError';
	}
}

/** An error answer from the API, whether sent as an HTTP error or inside a 2xx. */
export class InboxkitAPIError extends Error {
	readonly status: number;
	/** Milliseconds to wait, from Retry-After or RateLimit-Reset when InboxKit sent one. */
	readonly retryAfter?: number;
	// unknown: the error body, parsed JSON or plain text.
	readonly body?: unknown;

	constructor(
		message: string,
		// unknown: see `body` above.
		options: { status: number; body?: unknown; retryAfter?: number },
	) {
		super(message);
		this.name = 'InboxkitAPIError';
		this.status = options.status;
		this.body = options.body;
		this.retryAfter = options.retryAfter;
	}
}

// What a status means on InboxKit, for errors whose body says little.
const STATUS_HINTS: Record<number, string> = {
	401: 'the API key is missing, wrong or was rotated',
	402: 'the wallet or plan cannot cover this',
	403: "this team's key or plan does not allow it",
	429: 'rate limited, nothing was done',
};

/**
 * InboxKit errors come in three shapes, depending on the layer that answered:
 * `{ code, message }`, `{ error: true, message }` and `{ error: 'text' }` (all
 * seen live 2026-11-09).
 */
// unknown: the error body, parsed JSON or plain text.
export function readErrorText(body: unknown): string {
	if (typeof body === 'string') return body.trim().slice(0, 500);
	if (!body || typeof body !== 'object') return '';
	const { message, error, errors } = body as {
		// unknown: each field is checked before use.
		message?: unknown;
		error?: unknown;
		errors?: unknown;
	};
	if (typeof message === 'string' && message) return message;
	if (typeof error === 'string' && error) return error;
	if (Array.isArray(errors)) {
		return errors
			.map((item) =>
				typeof item === 'string' ? item : JSON.stringify(item ?? null),
			)
			.join('; ')
			.slice(0, 500);
	}
	return '';
}

/** A 2xx can still carry a refusal, in the same fields an HTTP error uses. */
// unknown: a parsed body of any shape.
export function isRefusal(body: unknown): boolean {
	if (!body || typeof body !== 'object') return false;
	const { error, success } = body as {
		// unknown: each field is checked before use.
		error?: unknown;
		success?: unknown;
	};
	return (
		error === true ||
		(typeof error === 'string' && error.length > 0) ||
		success === false
	);
}

/** Retry-After, or the RateLimit-Reset InboxKit sends, as milliseconds to wait. */
export function retryAfterMs(headers: Headers): number | undefined {
	const retryAfter = headers.get('retry-after');
	if (retryAfter) {
		const seconds = Number(retryAfter);
		if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
		const date = Date.parse(retryAfter);
		if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
	}
	const reset =
		headers.get('ratelimit-reset') ?? headers.get('x-ratelimit-reset');
	if (!reset) return undefined;
	const value = Number(reset);
	if (!Number.isFinite(value) || value < 0) return undefined;
	// Seconds to wait, or a Unix time from an older header.
	return value > 1_000_000_000
		? Math.max(0, value * 1000 - Date.now())
		: value * 1000;
}

function toApiError(
	status: number,
	statusText: string,
	// unknown: the error body, parsed JSON or plain text.
	body: unknown,
	retryAfter?: number,
): InboxkitAPIError {
	const text = readErrorText(body) || statusText || 'request failed';
	const hint = STATUS_HINTS[status];
	return new InboxkitAPIError(
		[
			`InboxKit ${status}: ${text}`,
			hint ? ` (${hint})` : '',
			retryAfter !== undefined
				? ` Retry after ${Math.ceil(retryAfter / 1000)} s.`
				: '',
		].join(''),
		{ status, body, retryAfter },
	);
}

/**
 * One path segment, such as a uid. A segment that is only dots would survive
 * encoding and walk the URL onto another route (`tags/..`), so those are refused.
 */
export function segment(value: string): string {
	if (!value || /^\.+$/.test(value)) {
		throw new InboxkitError(
			`"${value}" cannot be used in an InboxKit URL.`,
			'invalid_input',
		);
	}
	return encodeURIComponent(value);
}

// unknown: query values are checked by each operation's schema, and only stringified here.
export type InboxkitQuery = Record<string, unknown>;

export type InboxkitRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	query?: InboxkitQuery;
	// unknown: the JSON body is checked by each operation's schema, and only serialized here.
	body?: Record<string, unknown>;
	/** Sent as X-Workspace-Id. */
	workspaceId?: string;
};

// unknown: parsed JSON of any shape, narrowed by the caller.
function parseBody(text: string): unknown {
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

/**
 * Calls the API once. A plain fetch rather than `corsair/http`'s `request`,
 * whose errors drop the headers rate limits are in. Redirects are refused so the
 * key cannot follow one, and retries are error-handlers.ts's call: a purchase
 * repeated here would be charged twice.
 */
export async function makeInboxkitRequest(
	apiKey: string,
	{ method, path, query, body, workspaceId }: InboxkitRequest,
	// unknown: validated by the caller's output schema.
): Promise<unknown> {
	const key = apiKey?.trim();
	if (!key) {
		throw new InboxkitError(
			'No InboxKit API key is set. Copy your team key from Settings → API in InboxKit.',
			'invalid_key',
		);
	}

	const url = new URL(path, INBOXKIT_API_BASE);
	if (url.origin !== INBOXKIT_API_BASE) {
		throw new InboxkitError(
			'Refusing to send the InboxKit key to another host.',
			'invalid_input',
		);
	}
	for (const [name, value] of Object.entries(query ?? {})) {
		if (value === undefined || value === null) continue;
		for (const item of Array.isArray(value) ? value : [value]) {
			url.searchParams.append(name, String(item));
		}
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		Authorization: `Bearer ${key}`,
	};
	if (workspaceId) headers['X-Workspace-Id'] = workspaceId;
	if (body !== undefined) headers['Content-Type'] = 'application/json';

	let response: Response;
	let text: string;
	try {
		response = await fetch(url, {
			method,
			headers,
			body: body !== undefined ? JSON.stringify(body) : undefined,
			redirect: 'error',
			signal: AbortSignal.timeout(INBOXKIT_TIMEOUT_MS),
		});
		text = await response.text();
	} catch (error) {
		const timedOut = error instanceof Error && error.name === 'TimeoutError';
		throw new InboxkitError(
			timedOut
				? `InboxKit did not answer ${method} ${path} in time.`
				: `Could not reach InboxKit for ${method} ${path}.`,
			timedOut ? 'timeout' : 'network',
		);
	}

	const parsed = parseBody(text);
	if (!response.ok || isRefusal(parsed)) {
		throw toApiError(
			response.status,
			response.statusText,
			parsed,
			// InboxKit sends RateLimit-Reset on every answer, so only these mean wait.
			response.status === 429 || response.status === 503
				? retryAfterMs(response.headers)
				: undefined,
		);
	}
	return parsed;
}
