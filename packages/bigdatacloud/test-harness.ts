import type { BigDataCloudContext } from './index';

export type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: unknown;
};

export type QueuedResponse = {
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

export type FetchHarness = {
	requests: CapturedRequest[];
	requestAt: (index: number) => CapturedRequest;
	queue: (...responses: QueuedResponse[]) => void;
	restore: () => void;
};

export function installFetchHarness(): FetchHarness {
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
		const payload = next.body ?? {};

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
			text: async () => JSON.stringify(payload),
		};
	}) as typeof global.fetch;

	return {
		requests,
		requestAt: (index: number) => {
			const captured = requests[index];
			if (!captured) {
				throw new Error(
					`Expected a request at index ${index}, but only ${requests.length} were made`,
				);
			}
			return captured;
		},
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

export type ContextHarness = {
	ctx: BigDataCloudContext;
	upserts: Record<string, RecordedUpsert[]>;
};

const ENTITY_NAMES = [
	'countries',
	'asns',
	'networks',
	'bgpPrefixes',
	'hazardReports',
	'userRisks',
	'torExitNodes',
	'timezones',
	'reverseGeocodes',
	'phoneValidations',
	'emailValidations',
	'userAgents',
	'roamingStatuses',
] as const;

export function createContext(
	options: { key?: string; failingEntities?: string[] } = {},
): ContextHarness {
	const upserts: Record<string, RecordedUpsert[]> = {};
	const db: Record<string, unknown> = {};

	for (const name of ENTITY_NAMES) {
		const recorded: RecordedUpsert[] = [];
		upserts[name] = recorded;
		db[name] = {
			upsertByEntityId: async (
				entityId: string,
				data: Record<string, unknown>,
			) => {
				if (options.failingEntities?.includes(name)) {
					throw new Error(`entity store ${name} is unavailable`);
				}
				recorded.push({ entityId, data });
			},
		};
	}

	const ctx = {
		key: options.key ?? 'test-api-key',
		db,
		database: undefined,
		$getAccountId: async () => 'account_test',
	} as unknown as BigDataCloudContext;

	return { ctx, upserts };
}
