import { CloudApiError, mapV1Error } from './errors';

export type V1Transport = {
	/** `https://api.corsair.cloud/v1/projects/<slug>`. Paths append to it. */
	baseUrl: string;
	/** The `ck_cloud_<slug>.<secret>` project key. */
	apiKey: string;
	fetch?: typeof fetch;
	/** Abort a stalled request after this many ms. Default 30000. */
	timeoutMs?: number;
	/** Pins the response contract to a dated version (`Corsair-Version`). */
	apiVersion?: string;
};

export type RequestOptions = {
	/** Dedupes a retried mint for 24 hours, scoped to the project. Honoured by
	 *  the minting routes; ignored elsewhere. */
	idempotencyKey?: string;
	/** Echoed back as the `Request-Id` header and in any error. */
	requestId?: string;
	/** Cancels the request. */
	signal?: AbortSignal;
};

/** One page of a collection. */
export type CloudList<T> = {
	object: 'list';
	data: T[];
	/** More pages follow. Fetch the next with `starting_after: next_cursor`. */
	has_more: boolean;
	next_cursor: string | null;
};

export type ListQuery = {
	/** 1-100. Defaults to 100. */
	limit?: number;
	/** The `id` of the last item on the previous page. */
	starting_after?: string;
};

const DEFAULT_TIMEOUT_MS = 30_000;

/** Idempotent by HTTP semantics, so repeating one cannot double a write. */
const REPEATABLE_METHODS = new Set(['GET', 'HEAD', 'PUT', 'DELETE']);

const INSTANCE_KEY = /^[a-z][a-z0-9-]{0,31}$/;

/**
 * The instance-key rule, stated once.
 *
 * The key is the head of every composite ref, so a colon or an uppercase
 * letter in it would make a ref ambiguous or unaddressable. `context` names
 * the caller in the error.
 */
export function assertInstanceKey(key: string, context: string): void {
	if (!INSTANCE_KEY.test(key)) {
		throw new Error(
			`${context}: "${key}" is not a valid instance key — lowercase letter first, then letters, digits or hyphens, up to 32 characters.`,
		);
	}
}

export function queryString(
	params: Record<string, string | number | undefined>,
): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) search.set(key, String(value));
	}
	const encoded = search.toString();
	return encoded ? `?${encoded}` : '';
}

/** Refs land in the path and tenant ids are customer-chosen, so always encode. */
export function refPath(prefix: string, ref: string): string {
	return `${prefix}/${encodeURIComponent(ref)}`;
}

export async function v1Request<T>(
	transport: V1Transport,
	method: string,
	path: string,
	body?: unknown,
	options: RequestOptions = {},
): Promise<T> {
	const doFetch = transport.fetch ?? globalThis.fetch;
	const controller = new AbortController();
	// A signal that is already aborted never fires its event, so without this
	// the request would be sent after the caller had cancelled.
	if (options.signal?.aborted) controller.abort();
	const onAbort = () => controller.abort();
	options.signal?.addEventListener('abort', onAbort, { once: true });
	// Covers reading the body as well as the response: a server that answers
	// and then stalls mid-stream would otherwise hang with no deadline.
	const timer = setTimeout(
		() => controller.abort(),
		transport.timeoutMs ?? DEFAULT_TIMEOUT_MS,
	);

	const headers: Record<string, string> = {
		authorization: `Bearer ${transport.apiKey}`,
		'content-type': 'application/json',
	};
	if (transport.apiVersion) headers['corsair-version'] = transport.apiVersion;
	if (options.idempotencyKey) {
		headers['idempotency-key'] = options.idempotencyKey;
	}
	if (options.requestId) headers['x-corsair-request-id'] = options.requestId;

	let res: Response | undefined;
	try {
		res = await doFetch(`${transport.baseUrl}${path}`, {
			method,
			headers,
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: controller.signal,
		});

		const text = await res.text();
		let parsed: unknown;
		try {
			parsed = text ? JSON.parse(text) : undefined;
		} catch {
			parsed = undefined;
		}

		if (!res.ok) throw mapV1Error(res.status, parsed, res.headers);
		// A 204 carries no body by contract; anything else empty is a fault.
		if (parsed === undefined && res.status !== 204) {
			throw mapV1Error(res.status, undefined, res.headers);
		}
		return parsed as T;
	} catch (err) {
		// A caller's own abort is theirs to see.
		if (options.signal?.aborted) throw err;
		if (err instanceof CloudApiError) throw err;
		// Once the server has answered, a failure reading the body says nothing
		// about whether the write landed, so retryability follows the status it
		// answered with. Before that, repeating is only safe for a method that is
		// idempotent anyway, or for a call the server will dedupe.
		const retryable = res
			? undefined
			: REPEATABLE_METHODS.has(method) || options.idempotencyKey !== undefined;
		throw mapV1Error(
			res?.status ?? 0,
			{
				error: {
					code: 'request_failed',
					message: err instanceof Error ? err.message : String(err),
					retryable,
				},
			},
			res?.headers,
		);
	} finally {
		clearTimeout(timer);
		options.signal?.removeEventListener('abort', onAbort);
	}
}
