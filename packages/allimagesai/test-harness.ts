import type { AllimagesaiContext } from './index';

/**
 * Shared fetch/context doubles for the unit tests.
 *
 * Nothing here talks to All-Images.ai. Live coverage lives in `api.test.ts`,
 * which CI excludes by filename.
 */

export type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: unknown;
};

export type QueuedResponse = {
	status?: number;
	body?: unknown;
	/** Send a genuinely empty body, as DELETE /v1/image-generations does. */
	empty?: boolean;
	headers?: Record<string, string>;
};

export function installFetchHarness() {
	const originalFetch = global.fetch;
	const requests: CapturedRequest[] = [];
	const queued: QueuedResponse[] = [];

	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		let body: unknown;
		if (typeof init?.body === 'string') {
			try {
				body = JSON.parse(init.body);
			} catch {
				body = init.body;
			}
		}

		requests.push({
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
			body,
		});

		const next = queued.shift() ?? { status: 200, body: {} };
		const status = next.status ?? 200;
		const payload = next.empty ? '' : (next.body ?? {});

		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 200 ? 'OK' : `Status ${status}`,
			url: String(url),
			headers: new Headers({
				'Content-Type': 'application/json',
				...next.headers,
			}),
			json: async () => payload,
			text: async () => (next.empty ? '' : JSON.stringify(payload)),
		};
	}) as typeof global.fetch;

	return {
		requests,
		/** Nth captured request, throwing rather than returning undefined. */
		requestAt: (index: number): CapturedRequest => {
			const captured = requests[index];
			if (!captured) {
				throw new Error(
					`Expected a request at index ${index}, but only ${requests.length} were made`,
				);
			}
			return captured;
		},
		/** Queue one response per expected call, consumed in order. */
		queue: (...responses: QueuedResponse[]) => {
			queued.push(...responses);
		},
		restore: () => {
			global.fetch = originalFetch;
		},
	};
}

export type RecordedUpsert = {
	entityId: string;
	data: Record<string, unknown>;
};

const ENTITY_NAMES = [
	'imageGenerations',
	'downloadedImages',
	'webhooks',
] as const;

/**
 * Builds a plugin context whose entity stores record what they were asked to
 * write. `seed` pre-populates a store so the merge-on-read behaviour can be
 * exercised; `failingEntities` makes a store reject.
 */
export function createContext(
	options: {
		key?: string;
		failingEntities?: string[];
		seed?: Record<string, Record<string, Record<string, unknown>>>;
	} = {},
) {
	const upserts: Record<string, RecordedUpsert[]> = {};
	const deletes: Record<string, string[]> = {};
	const db: Record<string, unknown> = {};

	for (const name of ENTITY_NAMES) {
		const recorded: RecordedUpsert[] = [];
		const removed: string[] = [];
		const store = new Map<string, Record<string, unknown>>(
			Object.entries(options.seed?.[name] ?? {}),
		);
		upserts[name] = recorded;
		deletes[name] = removed;

		db[name] = {
			findByEntityId: async (entityId: string) => {
				const data = store.get(entityId);
				return data ? { entity_id: entityId, data } : null;
			},
			upsertByEntityId: async (
				entityId: string,
				data: Record<string, unknown>,
			) => {
				if (options.failingEntities?.includes(name)) {
					throw new Error(`entity store ${name} is unavailable`);
				}
				// Mirrors production: the data blob is replaced, not merged.
				store.set(entityId, data);
				recorded.push({ entityId, data });
			},
			deleteByEntityId: async (entityId: string) => {
				if (options.failingEntities?.includes(name)) {
					throw new Error(`entity store ${name} is unavailable`);
				}
				removed.push(entityId);
				return store.delete(entityId);
			},
		};
	}

	const ctx = {
		key: options.key ?? 'test-api-key',
		db,
		database: undefined,
		$getAccountId: async () => 'account_test',
	} as unknown as AllimagesaiContext;

	return { ctx, upserts, deletes };
}
