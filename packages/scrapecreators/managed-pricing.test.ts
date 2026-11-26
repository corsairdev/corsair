import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { scrapecreators } from './index';

// A call on Corsair's key, through the path customers use: createCorsair with
// Hub configured. Core asks Hub for the key itself here and never runs the
// plugin's keyBuilder, so this checks what Hub is asked, what ScrapeCreators
// receives, what usage goes back to Hub and what the caller sees.

const HUB_URL = 'https://hub.test';

// unknown: request bodies are parsed JSON, read with matchers.
type Sent = { url: string; body: Record<string, unknown>; headers: Headers };

function mockNetwork(options: { usagePath?: string } = {}) {
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
			body = {
				api_key: 'sc-hub-minted-key',
				expires_in: 300,
				...(options.usagePath ? { usage_path: options.usagePath } : {}),
			};
		} else if (url.endsWith('/managed-pricing/job-kinds')) {
			body = { kinds: [] };
		} else if (url.startsWith('https://api.scrapecreators.com/')) {
			// The audience route costs 26 credits (docs.scrapecreators.com).
			body = {
				success: true,
				credits_remaining: 3781,
				credits_charged: 26,
				audienceLocations: [],
			};
		}
		return new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	});
	return {
		toHub: () =>
			sent.filter((s) => s.url.endsWith('/managed-pricing/credentials')),
		outcomes: () =>
			sent.filter((s) => s.url.endsWith('/managed-pricing/usage/outcome')),
		toScrapeCreators: () =>
			sent.filter((s) => s.url.startsWith('https://api.scrapecreators.com/')),
	};
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'scrapecreators', 'default');
	const corsair = createCorsair({
		plugins: [scrapecreators({ authType: 'managed_pricing' })],
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

describe('scrapecreators on managed pricing', () => {
	it('asks Hub for a key for the operation and sends that key to ScrapeCreators', async () => {
		const net = mockNetwork();
		const { corsair, testDb } = await createClient();
		try {
			await corsair.scrapecreators.api.tiktok.userAudience({ handle: 'nasa' });

			const hub = net.toHub();
			expect(hub).toHaveLength(1);
			expect(hub[0]?.body).toEqual(
				expect.objectContaining({
					plugin: 'scrapecreators',
					operation: 'tiktok.userAudience',
				}),
			);

			const calls = net.toScrapeCreators();
			expect(calls).toHaveLength(1);
			expect(calls[0]?.headers.get('x-api-key')).toBe('sc-hub-minted-key');
		} finally {
			testDb.cleanup();
		}
	});

	it("hides Corsair's credit balance and keeps what the call cost", async () => {
		mockNetwork();
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.scrapecreators.api.tiktok.userAudience({
				handle: 'nasa',
			});
			expect(result).not.toHaveProperty('credits_remaining');
			expect(result.credits_charged).toBe(26);
			expect(result.audienceLocations).toEqual([]);
		} finally {
			testDb.cleanup();
		}
	});

	it('reports credits_charged to Hub when Hub meters the price per credit', async () => {
		const net = mockNetwork({ usagePath: 'credits_charged' });
		const { corsair, testDb } = await createClient();
		try {
			await corsair.scrapecreators.api.tiktok.userAudience({ handle: 'nasa' });

			const outcomes = net.outcomes();
			expect(outcomes).toHaveLength(1);
			expect(outcomes[0]?.body).toEqual(
				expect.objectContaining({
					outcome: 'succeeded',
					usage: { units: 26 },
				}),
			);
		} finally {
			testDb.cleanup();
		}
	});

	it("refuses the account routes, which would read Corsair's account", async () => {
		const net = mockNetwork();
		const { corsair, testDb } = await createClient();
		try {
			await expect(
				corsair.scrapecreators.api.account.apiUsage({}),
			).rejects.toThrow(/managed_pricing/);
			await expect(
				corsair.scrapecreators.api.account.creditBalance({}),
			).rejects.toThrow(/managed_pricing/);
			expect(net.toScrapeCreators()).toHaveLength(0);
		} finally {
			testDb.cleanup();
		}
	});

	it("leaves Corsair's balance out of an error too", async () => {
		mockNetwork();
		const original = globalThis.fetch as jest.Mock;
		const passThrough = original.getMockImplementation();
		original.mockImplementation(async (input, init) => {
			const url = String(input instanceof Request ? input.url : input);
			if (url.startsWith('https://api.scrapecreators.com/')) {
				return new Response(
					JSON.stringify({
						success: false,
						credits_remaining: 3781,
						credits_charged: 0,
						error: 'missing_parameter',
						errorStatus: 400,
						message: 'You must provide a handle or user_id',
					}),
					{ status: 400, headers: { 'content-type': 'application/json' } },
				);
			}
			return passThrough?.(input, init);
		});
		const { corsair, testDb } = await createClient();
		try {
			const error = (await corsair.scrapecreators.api.tiktok
				.profile({})
				.catch((e: unknown) => e)) as { status?: number; body?: object };
			expect(error.status).toBe(400);
			expect(error.body).toEqual(
				expect.objectContaining({ error: 'missing_parameter' }),
			);
			expect(error.body).not.toHaveProperty('credits_remaining');
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses an explicit key together with managed_pricing', () => {
		expect(() =>
			scrapecreators({ authType: 'managed_pricing', key: 'sc_own' }),
		).toThrow(/managed_pricing/);
	});

	it('keeps the balance for a caller on their own key', async () => {
		mockNetwork();
		const corsair = createCorsair({
			plugins: [scrapecreators({ key: 'sc_own' })],
		});
		const result = await corsair.scrapecreators.api.tiktok.userAudience({
			handle: 'nasa',
		});
		expect(result.credits_remaining).toBe(3781);
	});
});
