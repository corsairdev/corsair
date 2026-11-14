// Live Prerender smoke tests. Excluded from the default run; run with:
//
//   PRERENDER_TOKEN=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// Only the search and status routes are used: neither changes the cache.
import {
	makePrerenderRequest,
	PRERENDER_API_BASE,
	PrerenderAPIError,
} from './client';
import { PrerenderEndpointOutputSchemas } from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_TOKEN = process.env.PRERENDER_TOKEN ?? '';

if (LIVE_TOKEN.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn('Skipping Prerender live tests: PRERENDER_TOKEN is not set.');
}
const describeLive = LIVE_TOKEN.length > 0 ? describe : describe.skip;

describeLive('Prerender live API', () => {
	it('searches the cache through the output schema', async () => {
		const raw = await makePrerenderRequest(LIVE_TOKEN, {
			method: 'POST',
			path: '/search',
			body: { query: 'example.com', start: 0 },
		});
		// Some plans answer a bare array, which the endpoint wraps the same way.
		const parsed = PrerenderEndpointOutputSchemas.search.parse(
			Array.isArray(raw) ? { urls: raw } : raw,
		);

		expect(Array.isArray(parsed.urls)).toBe(true);
	});

	it('reads the cache clear status, where a 403 means a job is running', async () => {
		const raw = await makePrerenderRequest(LIVE_TOKEN, {
			method: 'GET',
			path: `/cache-clear-status/${encodeURIComponent(LIVE_TOKEN)}`,
		}).then(
			(value) => ({ ok: true as const, value }),
			// A 403 here is the documented "in progress" state, not a failure.
			(error) => ({ ok: false as const, error }),
		);

		if (raw.ok) {
			const parsed = PrerenderEndpointOutputSchemas.cacheClearStatus.parse(
				typeof raw.value === 'string' ? { message: raw.value } : raw.value,
			);
			expect(parsed).toBeDefined();
			return;
		}

		expect(raw.error).toBeInstanceOf(PrerenderAPIError);
		if (!(raw.error instanceof PrerenderAPIError)) return;
		expect(raw.error.status).toBe(403);
	});

	it('rejects an unrecognised token as a credential failure, keeping it off the error', async () => {
		const error = await captureError(
			makePrerenderRequest('definitely-not-a-token', {
				method: 'POST',
				path: '/search',
				body: { query: 'example.com' },
			}),
		);

		expect(error).toBeInstanceOf(PrerenderAPIError);
		if (!(error instanceof PrerenderAPIError)) return;
		expect(error.status).toBe(400);
		expect(error.reason).toBe('Invalid prerenderToken');
		expect(error.credentialsRejected).toBe(true);
		// The token rode in the body, so nothing may echo it back.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-token');
	});

	it('exposes the documented API host', () => {
		expect(PRERENDER_API_BASE).toBe('https://api.prerender.io');
	});
});
