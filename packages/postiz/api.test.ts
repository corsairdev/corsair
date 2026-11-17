// Live Postiz smoke tests. CI skips files named `api.test.ts`, and the jest
// config leaves this one out of `pnpm test`; run it with:
//
//   POSTIZ_API_KEY=... pnpm test:live
//
// Calls go through the plugin's own endpoints (createCorsair), so each answer
// is parsed by the same output schema and shaping a caller gets. Every test is
// a read: nothing here creates a post, and a `now` post publishes to real
// channels.
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { postiz } from './index';
import { captureError } from './test-helpers';

const LIVE_KEY = process.env.POSTIZ_API_KEY ?? '';
const LIVE_BASE_URL = process.env.POSTIZ_BASE_URL;

if (LIVE_KEY.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn('Skipping Postiz live tests: POSTIZ_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

async function liveClient(key: string) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'postiz', 'default');
	const corsair = createCorsair({
		plugins: [postiz({ key, baseUrl: LIVE_BASE_URL })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { api: corsair.postiz.api, cleanup: () => testDb.cleanup() };
}

describeLive('Postiz live API', () => {
	let client: Awaited<ReturnType<typeof liveClient>>;

	beforeAll(async () => {
		client = await liveClient(LIVE_KEY);
	});

	afterAll(() => client.cleanup());

	it('confirms the key is connected', async () => {
		const result = await client.api.integrations.isConnected({});
		expect(typeof result.connected).toBe('boolean');
	});

	it('lists integrations', async () => {
		const result = await client.api.integrations.list({});
		expect(Array.isArray(result.integrations)).toBe(true);
	});

	it('lists posts in a window', async () => {
		const end = new Date();
		const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
		const result = await client.api.posts.list({
			startDate: start.toISOString(),
			endDate: end.toISOString(),
		});
		expect(Array.isArray(result.posts)).toBe(true);
	});

	it('pages the media library', async () => {
		const result = await client.api.media.list({ page: 1 });
		expect(Array.isArray(result.results)).toBe(true);
	});

	it('pages notifications from page 0', async () => {
		const result = await client.api.notifications.list({ page: 0 });
		expect(Array.isArray(result.notifications)).toBe(true);
	});

	it("passes Postiz's own reason through on a rejected key", async () => {
		const bad = await liveClient('definitely-not-a-key');
		try {
			const error = await captureError(bad.api.integrations.list({}));
			expect(error).toBeInstanceOf(ApiError);
			if (!(error instanceof ApiError)) return;
			expect(error.status).toBe(401);
			// The key rode in a header, so nothing may echo it back.
			expect(JSON.stringify(error)).not.toContain('definitely-not-a-key');
		} finally {
			bad.cleanup();
		}
	});
});
