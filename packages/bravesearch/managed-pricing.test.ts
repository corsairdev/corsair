import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { bravesearch } from './index';

// A call on Corsair's key, through the path customers use: createCorsair with
// Hub configured. Core asks Hub for the key itself here and never runs the
// plugin's keyBuilder, so this checks what Hub is asked and what Brave Search
// receives.

const HUB_URL = 'https://hub.test';

// unknown: request bodies are parsed JSON, read with matchers.
type Sent = { url: string; body: Record<string, unknown>; headers: Headers };

function mockNetwork() {
	const sent: Sent[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input instanceof Request ? input.url : input);
		const raw = init?.body;
		sent.push({
			url,
			body: typeof raw === 'string' && raw ? JSON.parse(raw) : {},
			headers: new Headers(init?.headers),
		});
		// unknown: each route answers its own JSON shape.
		let body: unknown = {};
		if (url.endsWith('/managed-pricing/credentials')) {
			body = { api_key: 'brave-hub-minted-key', expires_in: 300 };
		} else if (url.endsWith('/managed-pricing/job-kinds')) {
			body = { kinds: [] };
		} else if (url.startsWith('https://api.search.brave.com/')) {
			body = { results: [] };
		}
		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	});
	return {
		toHub: () =>
			sent.filter((s) => s.url.endsWith('/managed-pricing/credentials')),
		toLitescrape: () =>
			sent.filter((s) => s.url.startsWith('https://api.search.brave.com/')),
	};
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'bravesearch', 'default');
	const corsair = createCorsair({
		plugins: [bravesearch({ authType: 'managed_pricing' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		hub: {
			projectApiKey: 'ck_dev_test',
			signingSecret: 'signing-secret',
			apiUrl: HUB_URL,
		},
	});
	return { corsair, testDb };
}

beforeEach(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	// Hub config starts core's connect loop, which warns about workflows.
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('bravesearch on managed pricing', () => {
	it('asks Hub for a key for the operation and sends that key to Brave Search', async () => {
		const net = mockNetwork();
		const { corsair, testDb } = await createClient();
		try {
			await corsair.bravesearch.api.web.search({ q: 'corsair' });

			const hub = net.toHub();
			expect(hub).toHaveLength(1);
			expect(hub[0]?.url).toBe(`${HUB_URL}/managed-pricing/credentials`);
			expect(hub[0]?.body).toEqual(
				expect.objectContaining({
					plugin: 'bravesearch',
					operation: 'web.search',
				}),
			);

			const calls = net.toLitescrape();
			expect(calls).toHaveLength(1);
			expect(calls[0]?.headers.get('x-subscription-token')).toBe(
				'brave-hub-minted-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('asks Hub per operation, so each op is priced on its own', async () => {
		const net = mockNetwork();
		const { corsair, testDb } = await createClient();
		try {
			await corsair.bravesearch.api.llm.context({ q: 'corsair' });
			expect(net.toHub()[0]?.body).toEqual(
				expect.objectContaining({
					plugin: 'bravesearch',
					operation: 'llm.context',
				}),
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses an explicit key together with managed_pricing', () => {
		expect(() =>
			bravesearch({ authType: 'managed_pricing', key: 'own-brave-key' }),
		).toThrow(/managed_pricing/);
	});
});
