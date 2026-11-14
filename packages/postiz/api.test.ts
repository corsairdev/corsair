// Live Postiz smoke tests. Excluded from the default run; run with:
//
//   POSTIZ_API_KEY=... pnpm test:live
//
// Every test is a read, and every answer is parsed through the same output
// schema a caller receives, so a field typed wrongly cannot pass silently.
// Nothing here creates a post: a `now` post publishes to real channels.
import { makePostizRequest, POSTIZ_API_BASE, PostizAPIError } from './client';
import {
	IntegrationSchema,
	NotificationSchema,
	PostizEndpointOutputSchemas,
	PostSchema,
} from './endpoints/types';
import { captureError } from './test-helpers';

const LIVE_KEY = process.env.POSTIZ_API_KEY ?? '';

if (LIVE_KEY.length === 0) {
	// Same check the gate prints, so a skipped run cannot read as a pass.
	console.warn('Skipping Postiz live tests: POSTIZ_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Postiz live API', () => {
	it('confirms the key is connected', async () => {
		const raw = await makePostizRequest(LIVE_KEY, {
			method: 'GET',
			path: '/is-connected',
		});
		const parsed = PostizEndpointOutputSchemas.isConnected.parse(raw);

		expect(typeof parsed.connected).toBe('boolean');
	});

	it('lists integrations, which this route answers as a bare array', async () => {
		const raw = await makePostizRequest(LIVE_KEY, {
			method: 'GET',
			path: '/integrations',
		});
		const parsed = PostizEndpointOutputSchemas.integrationsList.parse({
			integrations: raw,
		});

		expect(Array.isArray(parsed.integrations)).toBe(true);
		// A row the docs print as `{ id, identifier, customer }` must parse, which
		// is what proves the schema matches the wire format.
		for (const integration of parsed.integrations) {
			expect(IntegrationSchema.safeParse(integration).success).toBe(true);
		}
	});

	it('lists posts in a window through the output schema', async () => {
		// A window in the past, so no post is created and the read is cheap.
		const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
		const end = new Date().toISOString();
		const raw = await makePostizRequest(LIVE_KEY, {
			method: 'GET',
			path: '/posts',
			query: { startDate: start, endDate: end },
		});
		const parsed = PostizEndpointOutputSchemas.postsList.parse(raw);

		expect(Array.isArray(parsed.posts)).toBe(true);
		for (const post of parsed.posts) {
			expect(PostSchema.safeParse(post).success).toBe(true);
		}
	});

	it('lists the media library, which this route answers as a bare array', async () => {
		const raw = await makePostizRequest(LIVE_KEY, {
			method: 'GET',
			path: '/media',
			query: { page: 1 },
		});
		const parsed = PostizEndpointOutputSchemas.mediaList.parse({ media: raw });

		expect(Array.isArray(parsed.media)).toBe(true);
	});

	it('lists notifications, which this route answers as a bare array', async () => {
		const raw = await makePostizRequest(LIVE_KEY, {
			method: 'GET',
			path: '/notifications',
			query: { page: 1 },
		});
		const parsed = PostizEndpointOutputSchemas.notificationsList.parse({
			notifications: raw,
		});

		expect(Array.isArray(parsed.notifications)).toBe(true);
		for (const notification of parsed.notifications) {
			expect(NotificationSchema.safeParse(notification).success).toBe(true);
		}
	});

	it('rejects an unrecognised key as a credential failure', async () => {
		const error = await makePostizRequest('definitely-not-a-key', {
			method: 'GET',
			path: '/integrations',
		}).then(() => undefined, captureError);

		expect(error).toBeInstanceOf(PostizAPIError);
		if (!(error instanceof PostizAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.credentialsRejected).toBe(true);
		// The key rode in a header, so nothing may echo it back.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-key');
	});

	it('exposes the documented Postiz Cloud base', () => {
		expect(POSTIZ_API_BASE).toBe('https://api.postiz.com/public/v1');
	});
});
