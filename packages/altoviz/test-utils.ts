/** Shared mock-fetch and context helpers for the Altoviz test suites. */

export type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
	findByEntityId: jest.Mock;
};

export function makeStore(seed: Record<string, unknown> = {}): Store {
	const rows = new Map<string, unknown>(Object.entries(seed));
	return {
		upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
			rows.set(id, data);
		}),
		deleteByEntityId: jest.fn(async (id: string) => {
			rows.delete(id);
		}),
		findByEntityId: jest.fn(async (id: string) =>
			rows.has(id) ? { data: rows.get(id) } : null,
		),
	};
}

export function makeDb() {
	return {
		units: makeStore(),
		vats: makeStore(),
		classifications: makeStore(),
		customerFamilies: makeStore(),
		productFamilies: makeStore(),
		products: makeStore(),
		customers: makeStore(),
		contacts: makeStore(),
	};
}

export function makeCtx(db: ReturnType<typeof makeDb> = makeDb()) {
	const ctx = {
		key: 'fake-altoviz-key-for-tests-only',
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	};
	return { ctx: ctx as never, db };
}

export type RecordedCall = { url: string; init: RequestInit };

let calls: RecordedCall[] = [];
let queue: Array<{
	body: unknown;
	status?: number;
	contentType?: string | null;
	headers?: Record<string, string>;
}> = [];

export function resetFetchMock() {
	calls = [];
	queue = [];
}

/** Queues one response per successive fetch call, in order. */
export function queueResponse(
	body: unknown,
	options: {
		status?: number;
		contentType?: string | null;
		headers?: Record<string, string>;
	} = {},
) {
	queue.push({ body, ...options });
}

/** Every call after the queue is exhausted repeats the last queued response - convenient for reads a resolver issues incidentally. */
export function installFetchMock() {
	global.fetch = (async (url: string, init: RequestInit) => {
		calls.push({ url, init });
		const next = queue.length > 1 ? queue.shift()! : queue[0];
		if (!next)
			throw new Error('installFetchMock: no response queued for ' + url);
		const status = next.status ?? 200;
		const contentType =
			next.contentType === undefined
				? 'application/json; charset=utf-8'
				: next.contentType;
		const bodyText =
			typeof next.body === 'string' ? next.body : JSON.stringify(next.body);
		const headers = new Headers(next.headers ?? {});
		if (contentType) headers.set('Content-Type', contentType);
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? 'OK' : 'Error',
			url,
			headers,
			json: async () => JSON.parse(bodyText),
			text: async () => bodyText,
			arrayBuffer: async () => new TextEncoder().encode(bodyText).buffer,
		} as unknown as Response;
	}) as unknown as typeof global.fetch;
}

export function recordedCalls(): RecordedCall[] {
	return calls;
}

export function lastCall(): RecordedCall {
	if (calls.length === 0) throw new Error('no request was made');
	return calls[calls.length - 1]!;
}

export function requestedBody(call: RecordedCall = lastCall()): unknown {
	if (!call.init.body) return undefined;
	return JSON.parse(String(call.init.body));
}

export function requestedHeaders(
	call: RecordedCall = lastCall(),
): Record<string, string> {
	const h = call.init.headers as Record<string, string> | Headers | undefined;
	if (!h) return {};
	if (h instanceof Headers) {
		const out: Record<string, string> = {};
		h.forEach((v, k) => {
			out[k] = v;
		});
		return out;
	}
	return h;
}
