jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	clickCounters,
	clicksTimeSeries,
	deleteAcknowledgement,
	domains,
	link,
	linkCounters,
	linkList,
	notFound,
	restoreResponse,
	subscribeResponse,
	topParamsCounters,
	webhookSubscriptions,
	webhookUrl,
	workspaceLink,
	workspaces,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// One test per operation: each asserts the URL, the method, where the auth
// went, and every query or body field sent.
describe('Linkly request shapes', () => {
	it('sends the API key as a Bearer header', async () => {
		mockFetch(jsonResponse(workspaces));

		await endpoints.workspaces.listWorkspaces(makeCtx(), {});

		expect(sentHeader('authorization')).toBe('Bearer test-key');
		expect(sentHeader('x-api-key')).toBeNull();
	});

	it('lists workspaces with GET /api/v1/workspaces', async () => {
		mockFetch(jsonResponse(workspaces));

		const result = await endpoints.workspaces.listWorkspaces(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspaces`);
		expect(lastCall().init.method).toBe('GET');
		expect(result).toEqual(workspaces);
	});

	it('lists links with paging, sorting and trash filters as query fields', async () => {
		mockFetch(jsonResponse(linkList));

		const result = await endpoints.links.list(makeCtx(), {
			workspace_id: 42,
			search: 'summer',
			page: 2,
			page_size: 50,
			sort_by: 'clicks_total',
			sort_dir: 'desc',
			deleted: false,
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/list_links?search=summer&page=2&page_size=50&sort_by=clicks_total&sort_dir=desc&deleted=false`,
		);
		expect(lastCall().init.method).toBe('GET');
		expect(result.links).toEqual([workspaceLink]);
	});

	it('omits unset list_links query fields rather than sending nulls', async () => {
		mockFetch(jsonResponse(linkList));

		await endpoints.links.list(makeCtx(), { workspace_id: 42 });

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/list_links`);
	});

	it('reads one link by id, with the workspace filter when given', async () => {
		mockFetch(jsonResponse(link));

		await endpoints.links.get(makeCtx(), { id: 41657524, workspace_id: 42 });

		expect(lastCall().url).toBe(`${BASE}/api/v1/link/41657524?workspace_id=42`);
	});

	it('creates a link with a POST body carrying workspace_id and url', async () => {
		mockFetch(jsonResponse(link));

		const result = await endpoints.links.create(makeCtx(), {
			workspace_id: 42,
			url: 'https://www.example.com/summer-sale?ref=newsletter',
			name: 'Summer sale newsletter',
			utm_source: 'newsletter',
			utm_medium: 'email',
			utm_campaign: 'summer_sale',
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/link`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('content-type')).toBe('application/json');
		expect(sentBody()).toEqual({
			workspace_id: 42,
			url: 'https://www.example.com/summer-sale?ref=newsletter',
			name: 'Summer sale newsletter',
			utm_source: 'newsletter',
			utm_medium: 'email',
			utm_campaign: 'summer_sale',
		});
		expect(result.id).toBe(41657524);
	});

	it('updates a link by posting the id with the changed fields', async () => {
		mockFetch(jsonResponse(link));

		await endpoints.links.update(makeCtx(), {
			id: 41657524,
			workspace_id: 42,
			url: 'https://www.example.com/autumn-sale',
			enabled: false,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			id: 41657524,
			workspace_id: 42,
			url: 'https://www.example.com/autumn-sale',
			enabled: false,
		});
	});

	it('moves a link to the trash with DELETE and no body', async () => {
		mockFetch(jsonResponse(deleteAcknowledgement));

		const result = await endpoints.links.delete(makeCtx(), {
			workspace_id: 42,
			id: 41657524,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/links/41657524`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(lastCall().init.body).toBeUndefined();
		expect(result).toBe(deleteAcknowledgement);
	});

	it('restores trashed links by posting their ids', async () => {
		mockFetch(jsonResponse(restoreResponse));

		const result = await endpoints.links.restore(makeCtx(), {
			workspace_id: 42,
			ids: [30, 31],
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/links/restore`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ ids: [30, 31] });
		expect(result.restored).toBe(2);
		expect(result.conflicts).toHaveLength(1);
	});

	it('exports every link in a workspace', async () => {
		mockFetch(jsonResponse([workspaceLink]));

		const result = await endpoints.links.export(makeCtx(), {
			workspace_id: 42,
			format: 'json',
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/links/export?format=json`,
		);
		expect(result).toEqual([workspaceLink]);
	});

	it('reads the click time series with every filter in the query', async () => {
		mockFetch(jsonResponse(clicksTimeSeries));

		const result = await endpoints.clicks.getTimeSeries(makeCtx(), {
			workspace_id: 42,
			start: '2026-06-01',
			end: '2026-06-03',
			link_ids: '30-31',
			country: 'US',
			bots: false,
			unique: true,
			frequency: 'day',
		});

		const params = new URL(lastCall().url).searchParams;
		expect(
			lastCall().url.startsWith(`${BASE}/api/v1/workspace/42/clicks?`),
		).toBe(true);
		expect(Object.fromEntries(params)).toEqual({
			link_ids: '30-31',
			start: '2026-06-01',
			end: '2026-06-03',
			country: 'US',
			bots: 'false',
			unique: 'true',
			frequency: 'day',
		});
		expect(result.traffic).toHaveLength(3);
	});

	it('sends pivot=link_id for the matrix form', async () => {
		mockFetch(
			jsonResponse({
				links: [
					{ id: 123, name: 'My Link', full_url: 'https://linkly.link/abc' },
				],
				data: [{ date: '2025-12-30', clicks: { 123: 45 } }],
			}),
		);

		const result = await endpoints.clicks.getTimeSeries(makeCtx(), {
			workspace_id: 42,
			start: '2025-12-30',
			end: '2025-12-31',
			pivot: 'link_id',
		});

		expect(new URL(lastCall().url).searchParams.get('pivot')).toBe('link_id');
		expect(result.data).toHaveLength(1);
	});

	it('reads click counters for one dimension', async () => {
		mockFetch(jsonResponse(clickCounters));

		const result = await endpoints.clicks.getCounters(makeCtx(), {
			workspace_id: 42,
			counter: 'country',
			start: '2026-06-01',
			end: '2026-06-30',
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/clicks/counters/country?start=2026-06-01&end=2026-06-30`,
		);
		expect(result.total).toBe(215);
		expect(result.values).toHaveLength(3);
	});

	it('groups counters by link, which returns whole links as values', async () => {
		mockFetch(jsonResponse(linkCounters));

		const result = await endpoints.clicks.getCounters(makeCtx(), {
			workspace_id: 42,
			counter: 'link_id',
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/clicks/counters/link_id`,
		);
		expect(result.values[0]!.value).toEqual(workspaceLink);
	});

	it('lists domains for a workspace', async () => {
		mockFetch(jsonResponse(domains));

		const result = await endpoints.domains.list(makeCtx(), {
			workspace_id: 42,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/domains`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.domains).toEqual(domains.domains);
	});

	it('lists workspace webhook subscriptions', async () => {
		mockFetch(jsonResponse(webhookSubscriptions));

		const result = await endpoints.webhooks.list(makeCtx(), {
			workspace_id: 42,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/webhooks`);
		expect(result).toEqual(webhookSubscriptions);
	});

	it('subscribes a webhook URL with a POST body', async () => {
		mockFetch(jsonResponse(subscribeResponse));

		const result = await endpoints.webhooks.subscribe(makeCtx(), {
			workspace_id: 42,
			url: webhookUrl,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/webhooks`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ url: webhookUrl });
		expect(result.id).toBe(webhookUrl);
	});

	it('unsubscribes by encoding the webhook URL into the path', async () => {
		mockFetch(jsonResponse('Unsubscribed.'));

		const result = await endpoints.webhooks.unsubscribe(makeCtx(), {
			workspace_id: 42,
			hook_id: webhookUrl,
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/webhooks/${encodeURIComponent(webhookUrl)}`,
		);
		expect(lastCall().init.method).toBe('DELETE');
		expect(result).toBe('Unsubscribed.');
	});

	it('surfaces the not_found envelope for a missing link', async () => {
		mockFetch(jsonResponse(notFound, 404));

		await expect(
			endpoints.links.get(makeCtx(), { id: '999' }),
		).rejects.toMatchObject({
			status: 404,
			body: { code: 'not_found' },
			message: 'Linkly 404: Link not found',
		});
	});

	it('keeps top_params key beside its value', async () => {
		mockFetch(jsonResponse(topParamsCounters));

		const result = await endpoints.clicks.getCounters(makeCtx(), {
			workspace_id: 42,
			counter: 'top_params',
		});

		expect(result.values[0]).toEqual({
			count: 6,
			value: 'medium',
			key: 'utm_medium',
		});
	});
});
