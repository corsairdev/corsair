import type { TwitterContext } from './index';

/** One recorded fetch call: the URL, method, headers and body as sent. */
export type SentRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because a body is JSON, bytes or form data depending on the route.
	body: unknown;
};

// `unknown` because a mocked reply body is any JSON the test needs.
export type MockReply = {
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
	bytes?: Uint8Array;
};

/**
 * Replaces global fetch with one that answers `replies` in order and records
 * what was sent, so tests run the plugin and core's transport for real.
 */
export function mockFetch(...replies: MockReply[]): {
	sent: SentRequest[];
	fetchMock: jest.Mock;
} {
	const sent: SentRequest[] = [];
	const queue = [...replies];
	const fetchMock = jest.fn(
		async (input: string | URL | Request, init?: RequestInit) => {
			const headers: Record<string, string> = {};
			new Headers(init?.headers).forEach((value, key) => {
				headers[key] = value;
			});
			// `unknown` because the sent body is a string, Blob or URLSearchParams.
			let body: unknown = init?.body;
			if (typeof body === 'string') {
				try {
					body = JSON.parse(body);
				} catch {
					// A form-encoded or plain text body stays a string.
				}
			} else if (body instanceof URLSearchParams) {
				body = Object.fromEntries(body.entries());
			}
			sent.push({
				url: String(input),
				method: init?.method ?? 'GET',
				headers,
				body,
			});
			const reply = queue.shift() ?? { status: 200, body: {} };
			const status = reply.status ?? 200;
			if (reply.bytes) {
				return new Response(reply.bytes, {
					status,
					headers: {
						'content-type': 'application/octet-stream',
						...reply.headers,
					},
				});
			}
			return new Response(JSON.stringify(reply.body ?? {}), {
				status,
				headers: { 'content-type': 'application/json', ...reply.headers },
			});
		},
	);
	global.fetch = fetchMock as unknown as typeof fetch;
	return { sent, fetchMock };
}

// `unknown` because options are free-form plugin options; each case sets only what it reads.
export function buildCtx(
	options: Record<string, unknown> = { authType: 'oauth_2' },
): TwitterContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'x-user-token',
		options,
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read, not the whole plugin context.
	} as unknown as TwitterContext;
}
