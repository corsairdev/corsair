import { ManagementApiError } from '../management/errors';

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

// The runtime envelope is exactly ManagementApiError's serialized shape
// (`{ error: code, message, ...extra }`), so reconstructing that same class
// keeps client and server on one error type instead of a parallel hierarchy.
export function mapCloudError(
	status: number,
	body: unknown,
): ManagementApiError {
	const envelope = (body ?? {}) as CloudErrorEnvelope;
	const { error, message, ...extra } = envelope;
	if (typeof error !== 'string') {
		return new ManagementApiError(status, 'internal_error', 'Internal error');
	}
	return new ManagementApiError(status, error, message, extra);
}

const CLOUD_TIMEOUT = Symbol('cloudRequestTimeout');

export async function cloudRequest<T>(
	transport: CloudTransport,
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
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

	if (!res.ok) throw mapCloudError(res.status, parsed);
	if (parsed === undefined) {
		throw new ManagementApiError(
			res.status,
			'internal_error',
			'Invalid or empty response body from runtime',
		);
	}
	return parsed as T;
}
