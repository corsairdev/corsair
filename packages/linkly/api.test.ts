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
 * The reads run by default. Analytics calls (clicks, counters, clicks
 * export) count against the workspace's analytics allowance (100 a month on
 * the free plan, 50 an hour on any plan); this file makes four.
 *
 * LINKLY_LIVE_WRITES=1 also runs a round trip on one throwaway link: create,
 * read it back (links.get, get_link), update, bulk update, a link webhook
 * subscribe, list and unsubscribe, trash,
 * restore, and trash again. It leaves that link in the trash. It never adds
 * or deletes a domain, changes the workspace, or reports a conversion.
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
const WRITES = process.env.LINKLY_LIVE_WRITES === '1';
const itWrites = WRITES ? it : it.skip;

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
			// Without it an API-key call gets 400 workspace_required.
			query: { workspace_id: WORKSPACE_ID },
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
	it('accepts the key at POST /api/v1/test', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'POST',
			path: '/api/v1/test',
		});
		Outputs.authTest.parse(body);
	});

	it('reads one link with click counts from get_link', async () => {
		const page = Outputs.linksList.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/workspace/${WORKSPACE_ID}/list_links`,
				query: { page: 1, page_size: 1 },
			}),
		);
		const listed = page.links[0];
		if (!listed?.id) return;

		const details = Outputs.linksGetDetails.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/get_link/${listed.id}`,
			}),
		);
		expect(details.link.full_url).toBe(listed.full_url);

		const hooks = Outputs.webhooksListForLink.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/link/${listed.id}/webhooks`,
			}),
		);
		expect(Array.isArray(hooks)).toBe(true);
	});

	it('exports raw clicks as json', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: `/api/v1/workspace/${WORKSPACE_ID}/clicks/export`,
			query: { format: 'json' },
		});
		Outputs.clicksExport.parse(body);
	});

	it('lists conversions', async () => {
		const body = await makeLinklyRequest(key, {
			method: 'GET',
			path: '/api/v1/conversions',
			query: { workspace_id: WORKSPACE_ID, limit: 5 },
		});
		const result = Outputs.conversionsList.parse(body);
		expect(typeof result.has_more).toBe('boolean');
	});

	itWrites('round-trips one throwaway link', async () => {
		const created = Outputs.linksCreate.parse(
			await makeLinklyRequest(key, {
				method: 'POST',
				path: '/api/v1/link',
				body: {
					workspace_id: WORKSPACE_ID,
					url: 'https://www.example.com/corsair-plugin-test',
					name: 'corsair-plugin-test',
				},
			}),
		);
		const id = created.id;

		// The reads that need a link, against the one just made.
		const read = Outputs.linksGet.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/link/${id}`,
				query: { workspace_id: WORKSPACE_ID },
			}),
		);
		expect(read.id).toBe(id);
		const details = Outputs.linksGetDetails.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/get_link/${id}`,
			}),
		);
		expect(details.link.id).toBe(id);

		const updated = Outputs.linksUpdate.parse(
			await makeLinklyRequest(key, {
				method: 'POST',
				path: '/api/v1/link',
				body: {
					workspace_id: WORKSPACE_ID,
					id,
					note: 'updated by the live suite',
					metadata: { source: 'corsair-live' },
				},
			}),
		);
		expect(updated.id).toBe(id);

		const bulk = Outputs.linksBulkUpsert.parse(
			await makeLinklyRequest(key, {
				method: 'POST',
				path: '/api/v1/links',
				body: [
					{ workspace_id: WORKSPACE_ID, id, name: 'corsair-plugin-test-bulk' },
				],
			}),
		);
		expect(bulk[0]?.status).toBe('success');

		const hook = 'https://www.example.com/corsair-linkly-hook';
		Outputs.webhooksSubscribeToLink.parse(
			await makeLinklyRequest(key, {
				method: 'POST',
				path: `/api/v1/link/${id}/webhooks`,
				body: { url: hook },
			}),
		);
		const hooks = Outputs.webhooksListForLink.parse(
			await makeLinklyRequest(key, {
				method: 'GET',
				path: `/api/v1/link/${id}/webhooks`,
			}),
		);
		expect(hooks.map((entry) => entry.id)).toContain(hook);
		Outputs.webhooksUnsubscribeFromLink.parse(
			await makeLinklyRequest(key, {
				method: 'DELETE',
				path: `/api/v1/link/${id}/webhooks/${encodeURIComponent(hook)}`,
			}),
		);

		Outputs.linksDelete.parse(
			await makeLinklyRequest(key, {
				method: 'DELETE',
				path: `/api/v1/workspace/${WORKSPACE_ID}/links/${id}`,
			}),
		);
		const restored = Outputs.linksRestore.parse(
			await makeLinklyRequest(key, {
				method: 'POST',
				path: `/api/v1/workspace/${WORKSPACE_ID}/links/restore`,
				body: { ids: [id] },
			}),
		);
		expect(restored.restored).toBe(1);
		Outputs.linksDeleteMany.parse(
			await makeLinklyRequest(key, {
				method: 'DELETE',
				path: `/api/v1/workspace/${WORKSPACE_ID}/links`,
				body: { ids: [id] },
			}),
		);
	});
});
