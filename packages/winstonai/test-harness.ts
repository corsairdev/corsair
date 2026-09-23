import type { WinstonaiContext } from './index';

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

export function createContext(
	options: { key?: string } = {},
): WinstonaiContext {
	return {
		key: options.key ?? 'test-api-key',
		database: undefined,
		$getAccountId: async () => 'account_test',
	} as unknown as WinstonaiContext;
}
