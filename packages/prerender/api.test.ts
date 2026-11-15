// Live Prerender smoke tests. Excluded from the default run; run with:
//
//   PRERENDER_TOKEN=... pnpm test:live
//
// Calls go through createCorsair, so the keyBuilder, the error handlers and
// every output schema run exactly as a caller sees them. Reads only by default.
// PRERENDER_LIVE_WRITES=1 also runs the writes, which spend about three renders
// on the URL in PRERENDER_LIVE_URL (default https://corsair.dev/), clear a
// pattern that matches nothing, and leave the recache speed on automatic.

import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { PRERENDER_API_BASE } from './client';
import { prerender } from './index';
import { captureError } from './test-helpers';

const LIVE_TOKEN =
	process.env.PRERENDER_TOKEN ?? process.env.PRERENDER_API_KEY ?? '';
const LIVE_WRITES = process.env.PRERENDER_LIVE_WRITES === '1';
const LIVE_URL = process.env.PRERENDER_LIVE_URL ?? 'https://corsair.dev/';

if (LIVE_TOKEN.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn('Skipping Prerender live tests: PRERENDER_TOKEN is not set.');
}
const describeLive = LIVE_TOKEN.length > 0 ? describe : describe.skip;
const describeWrites =
	LIVE_TOKEN.length > 0 && LIVE_WRITES ? describe : describe.skip;

async function client(key: string) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'prerender', 'default');
	const corsair = createCorsair({
		plugins: [prerender({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { api: corsair.prerender.api, cleanup: () => testDb.cleanup() };
}

jest.setTimeout(60_000);

describeLive('Prerender live API: reads', () => {
	it('searches the cache by substring', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const result = await api.cache.search({
				query: new URL(LIVE_URL).hostname,
				start: 0,
			});
			expect(Array.isArray(result.urls)).toBe(true);
		} finally {
			cleanup();
		}
	});

	it('searches by exact URL and by device', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const exact = await api.cache.search({ exactMatch: LIVE_URL });
			const mobile = await api.cache.search({
				query: new URL(LIVE_URL).hostname,
				adaptiveType: 'mobile',
			});
			expect(Array.isArray(exact.urls)).toBe(true);
			expect(Array.isArray(mobile.urls)).toBe(true);
		} finally {
			cleanup();
		}
	});

	it('lists the cache with no filter, which the docs allow', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const result = await api.cache.search({ start: 0 });
			expect(Array.isArray(result.urls)).toBe(true);
		} finally {
			cleanup();
		}
	});

	it('reads the cache clear status as inProgress', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const result = await api.cache.clearStatus({});
			expect(typeof result.inProgress).toBe('boolean');
		} finally {
			cleanup();
		}
	});

	it('rejects an unrecognised token with an ApiError that does not echo it', async () => {
		const { api, cleanup } = await client('definitely-not-a-token');
		try {
			const error = await captureError(api.cache.search({ query: 'x' }));
			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({
				status: 400,
				body: 'Invalid prerenderToken',
			});
			expect(JSON.stringify(error)).not.toContain('definitely-not-a-token');
		} finally {
			cleanup();
		}
	});

	it('exposes the documented API host', () => {
		expect(PRERENDER_API_BASE).toBe('https://api.prerender.io');
	});
});

describeWrites('Prerender live API: writes', () => {
	it('recaches one URL, then a list on the mobile variant', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const one = await api.cache.recache({ url: LIVE_URL });
			const list = await api.cache.recache({
				urls: [LIVE_URL],
				adaptiveType: 'mobile',
			});
			expect(one).toBeDefined();
			expect(list).toBeDefined();
		} finally {
			cleanup();
		}
	});

	it('submits a sitemap URL that lists nothing', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const sitemapUrl = new URL(
				'/corsair-plugin-test-sitemap.xml',
				LIVE_URL,
			).toString();
			// Live 11-15: Prerender confirms with an empty body even for a sitemap
			// that lists nothing, so any rejection fails this test.
			const result = await api.cache.sitemap({ url: sitemapUrl });
			expect(result).toEqual({});
		} finally {
			cleanup();
		}
	});

	it('clears a pattern that matches nothing, then reads the status', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			const pattern = `${new URL('/corsair-plugin-test-', LIVE_URL).toString()}%`;
			const cleared = await api.cache.clear({ query: pattern });
			const status = await api.cache.clearStatus({});
			expect(cleared).toBeDefined();
			expect(typeof status.inProgress).toBe('boolean');
		} finally {
			cleanup();
		}
	});

	it('sets a manual speed, then restores the automatic delay', async () => {
		const { api, cleanup } = await client(LIVE_TOKEN);
		try {
			let restored = false;
			try {
				const manual = await api.queue.changeSpeed({ urlsPerHour: 3600 });
				expect(manual.isAutomaticDelay).toBe(false);
			} finally {
				// Put the account back on the automatic delay even if the first call failed.
				const automatic = await api.queue.changeSpeed({ urlsPerHour: 0 });
				restored = automatic.isAutomaticDelay;
			}
			expect(restored).toBe(true);
		} finally {
			cleanup();
		}
	});
});
