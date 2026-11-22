import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { hunterio } from './index';

// A call on Corsair's Hunter key, through the path customers use:
// createCorsair with Hub configured. Core asks Hub for the key itself here
// and never runs the plugin's keyBuilder, so this checks what Hub is asked
// and what Hunter receives.

const HUB_URL = 'https://hub.test';

// Stricter typing is not feasible because request bodies are parsed JSON of any shape, read only with matchers.
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
		// Stricter typing is not feasible because each mocked route answers its own JSON shape.
		let body: unknown = {};
		if (url.endsWith('/managed-pricing/credentials')) {
			body = { api_key: 'hunter-hub-minted-key', expires_in: 300 };
		} else if (url.endsWith('/managed-pricing/job-kinds')) {
			body = { kinds: [] };
		} else if (url.startsWith('https://api.hunter.io/')) {
			body = { data: { domain: 'stripe.com', emails: [] } };
		}
		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	});
	return {
		toHub: () =>
			sent.filter((s) => s.url.endsWith('/managed-pricing/credentials')),
		toHunter: () =>
			sent.filter((s) => s.url.startsWith('https://api.hunter.io/')),
	};
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'hunterio', 'default');
	const corsair = createCorsair({
		plugins: [hunterio({ authType: 'managed_pricing' })],
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

describe('hunterio on managed pricing', () => {
	it('asks Hub for a key for the operation and sends it to Hunter as a Bearer token', async () => {
		const net = mockNetwork();
		const { corsair, testDb } = await createClient();
		try {
			await corsair.hunterio.api.domainSearch.search({
				domain: 'stripe.com',
				limit: 10,
			});

			const hub = net.toHub();
			expect(hub).toHaveLength(1);
			expect(hub[0]?.url).toBe(`${HUB_URL}/managed-pricing/credentials`);
			expect(hub[0]?.body).toEqual(
				expect.objectContaining({
					plugin: 'hunterio',
					operation: 'domainSearch.search',
				}),
			);

			const calls = net.toHunter();
			expect(calls).toHaveLength(1);
			expect(calls[0]?.url).toContain('/v2/domain-search');
			expect(calls[0]?.url).not.toContain('api_key');
			expect(calls[0]?.headers.get('authorization')).toBe(
				'Bearer hunter-hub-minted-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses an explicit key together with managed_pricing', () => {
		expect(() =>
			hunterio({ authType: 'managed_pricing', key: 'own-hunter-key' }),
		).toThrow(/managed_pricing/);
	});
});
