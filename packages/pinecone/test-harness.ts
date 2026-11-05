export type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: unknown;
};

type QueuedResponse = {
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

/** Installs a deterministic fetch double and captures outgoing requests. */
export function installFetchHarness() {
	const originalFetch = global.fetch;
	const requests: CapturedRequest[] = [];
	const queued: QueuedResponse[] = [];

	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const rawHeaders = new Headers(init?.headers);
		rawHeaders.forEach((value, key) => {
			headers[key.toLowerCase()] = value;
		});

		let body: unknown;
		if (typeof init?.body === 'string') {
			if (headers['content-type'] === 'application/x-ndjson') {
				body = init.body;
			} else {
				try {
					body = JSON.parse(init.body);
				} catch {
					body = init.body;
				}
			}
		} else {
			body = init?.body;
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
		requestAt(index: number): CapturedRequest {
			const request = requests[index];
			if (!request) {
				throw new Error(
					`Expected request ${index}; captured ${requests.length}`,
				);
			}
			return request;
		},
		queue(...responses: QueuedResponse[]) {
			queued.push(...responses);
		},
		restore() {
			global.fetch = originalFetch;
		},
	};
}
