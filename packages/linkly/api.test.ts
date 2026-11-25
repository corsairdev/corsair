import { makeLinklyRequest } from './client';
import { LinklyEndpointOutputSchemas as Outputs } from './endpoints/types';

/**
 * Live smoke tests against the real Linkly API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/linkly test:live`.
 *
 * Needs two variables:
 *
 *   LINKLY_API_KEY=...        a key from app.linklyhq.com, Settings, API Keys
 *   LINKLY_WORKSPACE_ID=...   a workspace the key can reach (listWorkspaces finds them)
 *
 * Read-only: it never creates, updates or deletes anything. The analytics API
 * allows 50 requests per hour per workspace, and these tests make at most
 * eight.
 *
 * Every answer is parsed through its output schema, so a field whose real
 * shape disagrees with the spec fails here rather than for a caller.
 */
const KEY = process.env.LINKLY_API_KEY;
const WORKSPACE_ID = Number(process.env.LINKLY_WORKSPACE_ID);
const missing = [
	...(KEY ? [] : ['LINKLY_API_KEY']),
	...(process.env.LINKLY_WORKSPACE_ID ? [] : ['LINKLY_WORKSPACE_ID']),
];
if (missing.length > 0) {
	console.warn(
		`Skipping live smoke tests, missing env vars: ${missing.join(', ')}`,
	);
}
const describeIfReady = KEY && WORKSPACE_ID > 0 ? describe : describe.skip;

const key = KEY ?? '';

describeIfReady('live Linkly API', () => {
	it('lists workspaces', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: '/api/v1/workspaces',
		});
		const result = Outputs.workspacesListWorkspaces.parse(body);
		expect(result.length).toBeGreaterThan(0);
		expect(typeof result[0]!.id).toBe('number');
		expect(typeof result[0]!.name).toBe('string');
	});

	it('lists links with click counts', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/list_links`,
			query: { page: 1, page_size: 5 },
		});
		const result = Outputs.linksList.parse(body);
		expect(typeof result.total_entries).toBe('number');
		expect(Array.isArray(result.links)).toBe(true);
		if (result.links.length > 0) {
			const first = result.links[0]!;
			expect(typeof first.url).toBe('string');
			expect(typeof first.clicks_total).toBe('number');
		}
	});

	it('reads one link by id', async () => {
		const page = Outputs.linksList.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/workspace/${WORKSPACE_ID}/list_links`,
				query: { page: 1, page_size: 5 },
			}),
		);
		const listed = page.links[0];
		if (!listed?.id) return;

		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/link/${listed.id}`,
		});
		const result = Outputs.linksGet.parse(body);
		expect(result.id).toBe(listed.id);
	});

	it('reads the click time series', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/clicks`,
			query: { frequency: 'day' },
		});
		const result = Outputs.clicksGetTimeSeries.parse(body);
		if (Array.isArray(result.traffic)) {
			for (const bucket of result.traffic.slice(0, 5)) {
				expect(typeof bucket.t).toBe('string');
			}
		}
	});

	it('groups clicks by country', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/clicks/counters/country`,
		});
		const result = Outputs.clicksGetCounters.parse(body);
		expect(typeof result.total).toBe('number');
		expect(Array.isArray(result.values)).toBe(true);
	});

	it('groups clicks by link, which returns whole links', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/clicks/counters/link_id`,
		});
		const result = Outputs.clicksGetCounters.parse(body);
		expect(typeof result.total).toBe('number');
		for (const entry of result.values.slice(0, 5)) {
			const value = entry.value;
			if (value && typeof value === 'object') {
				expect(typeof value.url).toBe('string');
			}
		}
	});

	it('lists domains', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/domains`,
		});
		const result = Outputs.domainsList.parse(body);
		expect(Array.isArray(result.domains)).toBe(true);
	});

	it('lists webhook subscriptions', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/webhooks`,
		});
		const result = Outputs.webhooksList.parse(body);
		expect(Array.isArray(result)).toBe(true);
		for (const entry of result) {
			expect(typeof entry.id).toBe('string');
		}
	});
});
