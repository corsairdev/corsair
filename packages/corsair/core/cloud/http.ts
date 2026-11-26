import { ManagementApiError } from '../management/errors';
import { activeMode, currentModeScopes } from '../permissions';

// Header values must be Latin-1; \uXXXX escapes keep the JSON valid and ASCII.
const asciiJson = (value: unknown): string =>
	JSON.stringify(value).replace(
		/[\u0080-\uffff]/g,
		(c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
	);

export type CloudTransport = {
	baseUrl: string;
	apiKey: string;
	fetch?: typeof fetch;
	/** Abort a stalled request after this many ms. Default 30000. */
	timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 30_000;

type CloudErrorEnvelope = {
	error?: string;
	message?: string;
	reason?: string;
	providerStatus?: number;
	[key: string]: unknown;
};

export function stripTrailingSlashes(s: string): string {
	let end = s.length;
	while (end > 0 && s[end - 1] === '/') end--;
	return s.slice(0, end);
}

function stripLeadingSlashes(s: string): string {
	let start = 0;
	while (start < s.length && s[start] === '/') start++;
	return s.slice(start);
}

function joinUrl(baseUrl: string, path: string): string {
	return `${stripTrailingSlashes(baseUrl)}/${stripLeadingSlashes(path)}`;
}

// The SDK's envelope is exactly ManagementApiError's serialized shape
// (`{ error: code, message, ...extra }`), so reconstructing that same class
// keeps client and server on one error type instead of a parallel hierarchy.
//
// The runtime in front of the SDK answers its own refusals (a missing key, an
// unknown path, a project slug asked for an instance route) as
// `{ code, hop, message }`, so `code` stands in for `error` there.
//
// The id worth quoting rides in a header: Request-Id from hub, and
// x-corsair-trace-id on the runtime's own refusals. It lands in `extra`.
export function mapCloudError(
	status: number,
	body: unknown,
	headers?: Headers,
): ManagementApiError {
	const requestId =
		headers?.get('request-id')?.trim() ||
		headers?.get('x-corsair-trace-id')?.trim() ||
		undefined;
	const withId = (extra: Record<string, unknown>) =>
		requestId ? { ...extra, requestId } : extra;
	const envelope = (body ?? {}) as CloudErrorEnvelope;
	const { error, message, ...extra } = envelope;
	if (typeof error === 'string') {
		return new ManagementApiError(status, error, message, withId(extra));
	}
	const { code, ...rest } = extra;
	if (typeof code === 'string') {
		return new ManagementApiError(
			status,
			code,
			typeof message === 'string' ? message : undefined,
			withId(rest),
		);
	}
	return new ManagementApiError(
		status,
		'internal_error',
		'Internal error',
		withId({}),
	);
}

const CLOUD_TIMEOUT = Symbol('cloudRequestTimeout');

export async function cloudRequest<T>(
	transport: CloudTransport,
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
	// Without the account, the strictest mode any account could get: a server
	// that predates per-account modes reads only this one.
	const mode = activeMode();
	const scopes = currentModeScopes();
	const perAccount = scopes.some(
		(s) => typeof s !== 'string' && s.accounts !== undefined,
	);
	const doFetch = transport.fetch ?? globalThis.fetch;
	const timeoutMs = transport.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const controller = new AbortController();
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<typeof CLOUD_TIMEOUT>((resolve) => {
		timer = setTimeout(() => {
			controller.abort();
			resolve(CLOUD_TIMEOUT);
		}, timeoutMs);
	});

	let res: Response;
	try {
		const fetchOutcome = doFetch(joinUrl(transport.baseUrl, path), {
			method,
			headers: {
				authorization: `Bearer ${transport.apiKey}`,
				'content-type': 'application/json',
				// The scope is process-local, so the mode travels for the server to
				// judge an operation by it.
				...(mode ? { 'x-corsair-mode': mode } : {}),
				...(perAccount ? { 'x-corsair-mode-scopes': asciiJson(scopes) } : {}),
			},
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: controller.signal,
		}).catch((err): typeof CLOUD_TIMEOUT => {
			if (controller.signal.aborted) return CLOUD_TIMEOUT;
			throw err;
		});
		const outcome = await Promise.race([fetchOutcome, timeout]);
		if (outcome === CLOUD_TIMEOUT) {
			throw new ManagementApiError(
				0,
				'internal_error',
				'Cloud request timed out',
			);
		}
		res = outcome;
	} finally {
		clearTimeout(timer!);
	}

	const text = await res.text();
	let parsed: unknown;
	try {
		parsed = text ? JSON.parse(text) : undefined;
	} catch {
		parsed = undefined;
	}

	if (!res.ok) throw mapCloudError(res.status, parsed, res.headers);
	if (parsed === undefined) {
		throw new ManagementApiError(
			res.status,
			'internal_error',
			'Invalid or empty response body from runtime',
		);
	}
	return parsed as T;
}
