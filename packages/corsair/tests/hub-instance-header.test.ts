import { hubApiGet, hubApiPost } from '../hub/client/http';
import type { HubConfig } from '../hub/types';

const hub = (instanceKey?: string): HubConfig => ({
	apiUrl: 'https://hub.example',
	projectApiKey: 'ck_cloud_test_key',
	signingSecret: 'signing-secret',
	instanceKey,
});

function mockFetch() {
	const sent: Array<Record<string, string>> = [];

	const fetchMock = jest.fn(
		async (_url: string | URL | Request, init?: RequestInit) => {
			sent.push({ ...((init?.headers ?? {}) as Record<string, string>) });
			return new Response(JSON.stringify({ ok: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		},
	) as typeof fetch;

	global.fetch = fetchMock;
	return sent;
}

const parse = () => ({ ok: true });

describe('x-corsair-instance-key on the wire', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
	});

	for (const [verb, call] of [
		[
			'POST',
			(h: HubConfig) =>
				hubApiPost({ hub: h, path: '/x', body: {}, parseResponse: parse }),
		],
		[
			'GET',
			(h: HubConfig) => hubApiGet({ hub: h, path: '/x', parseResponse: parse }),
		],
	] as const) {
		it(`${verb} sends it when the instance is pinned`, async () => {
			const sent = mockFetch();
			await call(hub('feed'));
			expect(sent[0]['x-corsair-instance-key']).toBe('feed');
		});

		// Absent, not empty: every self-hosted consumer sets no instance key, and
		// their requests have to stay byte-identical.
		it(`${verb} omits it entirely when unpinned`, async () => {
			const sent = mockFetch();
			await call(hub(undefined));
			expect('x-corsair-instance-key' in sent[0]).toBe(false);
		});
	}
});
