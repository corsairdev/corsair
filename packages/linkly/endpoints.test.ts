jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { ZodError } from 'zod';
import {
	clickCounters,
	clicksPivot,
	clicksTimeSeries,
	deleteAcknowledgement,
	domains,
	link,
	linkCounters,
	linkList,
	restoreResponse,
	subscribeResponse,
	topParamsCounters,
	webhookSubscriptions,
	workspaces,
} from './test-fixtures';
import {
	callsSoFar,
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so this helper's return type carries none of them.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: shared across endpoints with unrelated output types

// Negative cases pass values no schema accepts, so the input type is left
// to each call site.
function invoke<I>(endpoint: AnyEndpoint, input: I) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: 'test-key' } as never, input as never);
}

// Output parsing per operation: a wrong-shaped payload or a malformed known
// field must fail the parse rather than reach the caller as data.
describe('Linkly output parsing', () => {
	it('parses the workspaces array', async () => {
		mockFetch(jsonResponse(workspaces));

		await expect(
			invoke(endpoints.workspaces.listWorkspaces, {}),
		).resolves.toEqual(workspaces);
	});

	it('rejects a workspaces answer that is an object', async () => {
		mockFetch(jsonResponse({ workspaces: [] }));

		await expect(
			invoke(endpoints.workspaces.listWorkspaces, {}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses a links page with its counters and keeps fields the schema does not name', async () => {
		const withExtra = {
			...linkList,
			links: [{ ...linkList.links[0], brand_new_field: 'kept' }],
		};
		mockFetch(jsonResponse(withExtra));

		const result = await invoke(endpoints.links.list, { workspace_id: 42 });

		expect(result).toEqual(withExtra);
	});

	it('rejects a list row whose click counter is a string', async () => {
		mockFetch(
			jsonResponse({
				...linkList,
				links: [{ ...linkList.links[0], clicks_total: '215' }],
			}),
		);

		await expect(
			invoke(endpoints.links.list, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a links page missing total_entries', async () => {
		// JSON.stringify drops the undefined key, so the field is truly absent.
		mockFetch(jsonResponse({ ...linkList, total_entries: undefined }));

		await expect(
			invoke(endpoints.links.list, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses a bare Link with null pixel fields', async () => {
		mockFetch(jsonResponse(link));

		await expect(
			invoke(endpoints.links.get, { id: 41657524 }),
		).resolves.toEqual(link);
	});

	it('rejects a link response without full_url', async () => {
		mockFetch(jsonResponse({ ...link, full_url: undefined }));

		await expect(
			invoke(endpoints.links.get, { id: 41657524 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('rejects a create answer whose id is a string', async () => {
		mockFetch(jsonResponse({ ...link, id: '41657524' }));

		await expect(
			invoke(endpoints.links.create, {
				workspace_id: 42,
				url: 'https://www.example.com',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('validates that a delete answered its message string', async () => {
		mockFetch(jsonResponse(deleteAcknowledgement));

		await expect(
			invoke(endpoints.links.delete, { workspace_id: 42, id: 30 }),
		).resolves.toBe(deleteAcknowledgement);
	});

	it('rejects a delete answer that is an object', async () => {
		mockFetch(jsonResponse({ deleted: true }));

		await expect(
			invoke(endpoints.links.delete, { workspace_id: 42, id: 30 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses restore counts and conflicts', async () => {
		mockFetch(jsonResponse(restoreResponse));

		await expect(
			invoke(endpoints.links.restore, { workspace_id: 42, ids: [30, 31] }),
		).resolves.toEqual(restoreResponse);
	});

	it('accepts a restore answer without conflicts', async () => {
		mockFetch(jsonResponse({ restored: 1 }));

		await expect(
			invoke(endpoints.links.restore, { workspace_id: 42, ids: [30] }),
		).resolves.toEqual({ restored: 1 });
	});

	it('parses the exported link array', async () => {
		mockFetch(jsonResponse([linkList.links[0]]));

		await expect(
			invoke(endpoints.links.export, { workspace_id: 42 }),
		).resolves.toEqual([linkList.links[0]]);
	});

	it('rejects an export answer that is a page envelope', async () => {
		mockFetch(jsonResponse(linkList));

		await expect(
			invoke(endpoints.links.export, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses the time series, keeping a null bucket count', async () => {
		mockFetch(jsonResponse(clicksTimeSeries));

		await expect(
			invoke(endpoints.clicks.getTimeSeries, { workspace_id: 42 }),
		).resolves.toEqual(clicksTimeSeries);
	});

	it('rejects a time series bucket whose count is a string', async () => {
		mockFetch(jsonResponse({ traffic: [{ t: '2026-06-01', y: '12' }] }));

		await expect(
			invoke(endpoints.clicks.getTimeSeries, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses the pivot matrix form through the same operation', async () => {
		mockFetch(jsonResponse(clicksPivot));

		await expect(
			invoke(endpoints.clicks.getTimeSeries, {
				workspace_id: 42,
				pivot: 'link_id',
			}),
		).resolves.toEqual(clicksPivot);
	});

	it('rejects a pivot answer with neither traffic nor data', async () => {
		mockFetch(jsonResponse({ rows: [] }));

		await expect(
			invoke(endpoints.clicks.getTimeSeries, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses counters with string values', async () => {
		mockFetch(jsonResponse(clickCounters));

		await expect(
			invoke(endpoints.clicks.getCounters, {
				workspace_id: 42,
				counter: 'country',
			}),
		).resolves.toEqual(clickCounters);
	});

	it('parses counters whose value is a whole link', async () => {
		mockFetch(jsonResponse(linkCounters));

		const result = await endpoints.clicks.getCounters(makeCtx(), {
			workspace_id: 42,
			counter: 'link_id',
		});

		expect(result.total).toBe(215);
		expect(result.values[0]!.value).toEqual(linkList.links[0]);
	});

	it('parses top_params entries carrying their key', async () => {
		mockFetch(jsonResponse(topParamsCounters));

		await expect(
			invoke(endpoints.clicks.getCounters, {
				workspace_id: 42,
				counter: 'top_params',
			}),
		).resolves.toEqual(topParamsCounters);
	});

	it('rejects a counter entry without count', async () => {
		mockFetch(jsonResponse({ total: 1, values: [{ value: 'US' }] }));

		await expect(
			invoke(endpoints.clicks.getCounters, {
				workspace_id: 42,
				counter: 'country',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses domains, including a null name', async () => {
		mockFetch(jsonResponse(domains));

		await expect(
			invoke(endpoints.domains.list, { workspace_id: 42 }),
		).resolves.toEqual(domains);
	});

	it('rejects a domains answer missing the array', async () => {
		mockFetch(jsonResponse({ domains: 'go.yourcompany.com' }));

		await expect(
			invoke(endpoints.domains.list, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses webhook subscriptions', async () => {
		mockFetch(jsonResponse(webhookSubscriptions));

		await expect(
			invoke(endpoints.webhooks.list, { workspace_id: 42 }),
		).resolves.toEqual(webhookSubscriptions);
	});

	it('rejects a subscription whose id is a number', async () => {
		mockFetch(jsonResponse([{ id: 42 }]));

		await expect(
			invoke(endpoints.webhooks.list, { workspace_id: 42 }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('parses a subscribe answer', async () => {
		mockFetch(jsonResponse(subscribeResponse));

		await expect(
			invoke(endpoints.webhooks.subscribe, {
				workspace_id: 42,
				url: 'https://hooks.example.com/linkly',
			}),
		).resolves.toEqual(subscribeResponse);
	});

	it('validates that an unsubscribe answered a string', async () => {
		mockFetch(jsonResponse('Unsubscribed.'));

		await expect(
			invoke(endpoints.webhooks.unsubscribe, {
				workspace_id: 42,
				hook_id: 'https://hooks.example.com/linkly',
			}),
		).resolves.toBe('Unsubscribed.');
	});

	it('rejects an unsubscribe answer that is an object', async () => {
		mockFetch(jsonResponse({ ok: true }));

		await expect(
			invoke(endpoints.webhooks.unsubscribe, {
				workspace_id: 42,
				hook_id: 'https://hooks.example.com/linkly',
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

// Input schemas reject bad calls before any request is sent.
describe('Linkly input rejection', () => {
	it.each([
		['links.list without a workspace', endpoints.links.list, {}],
		[
			'links.list page zero',
			endpoints.links.list,
			{ workspace_id: 42, page: 0 },
		],
		[
			'links.list a bad sort_dir',
			endpoints.links.list,
			{ workspace_id: 42, sort_dir: 'up' },
		],
		['links.get without an id', endpoints.links.get, {}],
		[
			'links.create without a url',
			endpoints.links.create,
			{ workspace_id: 42 },
		],
		[
			'links.update without an id',
			endpoints.links.update,
			{ workspace_id: 42, url: 'https://www.example.com' },
		],
		[
			'links.delete without the link id',
			endpoints.links.delete,
			{ workspace_id: 42 },
		],
		[
			'links.restore with a string id',
			endpoints.links.restore,
			{ workspace_id: 42, ids: ['30'] },
		],
		[
			'links.export with a format outside the enum',
			endpoints.links.export,
			{ workspace_id: 42, format: 'xml' },
		],
		[
			'clicks.getTimeSeries with a three-letter country',
			endpoints.clicks.getTimeSeries,
			{ workspace_id: 42, country: 'USA' },
		],
		[
			'clicks.getTimeSeries with a frequency outside the enum',
			endpoints.clicks.getTimeSeries,
			{ workspace_id: 42, frequency: 'week' },
		],
		[
			'clicks.getCounters with a dimension that is not in the enum',
			endpoints.clicks.getCounters,
			{ workspace_id: 42, counter: 'bogus_dimension' },
		],
		['domains.list without a workspace', endpoints.domains.list, {}],
		[
			'webhooks.subscribe with a non-URL',
			endpoints.webhooks.subscribe,
			{ workspace_id: 42, url: 'hooks.example.com/no-scheme' },
		],
		[
			'webhooks.unsubscribe without the hook id',
			endpoints.webhooks.unsubscribe,
			{ workspace_id: 42 },
		],
		[
			'links.export with csv, which the plugin cannot parse',
			endpoints.links.export,
			{ workspace_id: 42, format: 'csv' },
		],
		[
			'clicks.getTimeSeries with tsv',
			endpoints.clicks.getTimeSeries,
			{ workspace_id: 42, format: 'tsv' },
		],
		[
			'clicks.getCounters with csv',
			endpoints.clicks.getCounters,
			{ workspace_id: 42, counter: 'country', format: 'csv' },
		],
		[
			'links.bulkUpsert with no links',
			endpoints.links.bulkUpsert,
			{ links: [] },
		],
		[
			'links.bulkUpsert with 1001 links',
			endpoints.links.bulkUpsert,
			{
				links: Array.from({ length: 1001 }, () => ({
					workspace_id: 42,
					url: 'https://www.example.com',
				})),
			},
		],
		[
			'links.deleteMany with no ids',
			endpoints.links.deleteMany,
			{ workspace_id: 42, ids: [] },
		],
		[
			'domains.create without a name',
			endpoints.domains.create,
			{ workspace_id: 42 },
		],
		[
			'domains.updateFavicon with a non-URL',
			endpoints.domains.updateFavicon,
			{ workspace_id: 42, domain_id: 7, favicon_url: 'favicon.ico' },
		],
		[
			'webhooks.subscribeToLink with a non-URL',
			endpoints.webhooks.subscribeToLink,
			{ link_id: 30, url: 'not a url' },
		],
		[
			'conversions.create without an event name',
			endpoints.conversions.create,
			{ workspace_id: 42, event_type: 'sale' },
		],
		[
			'conversions.create with an unknown event type',
			endpoints.conversions.create,
			{ workspace_id: 42, event_name: 'purchase', event_type: 'refund' },
		],
		[
			'conversions.list with a limit over 1000',
			endpoints.conversions.list,
			{ workspace_id: 42, limit: 5000 },
		],
		[
			'workspaces.update with a webhook that is not a URL',
			endpoints.workspaces.update,
			{ workspace_id: 42, webhooks: ['nope'] },
		],
	])('rejects %s before calling Linkly', async (_name, endpoint, input) => {
		// A ZodError, not the unmocked-fetch error, and no request at all
		// (CodeRabbit thread on endpoints.test.ts:386).
		await expect(invoke(endpoint, input)).rejects.toBeInstanceOf(ZodError);
		expect(callsSoFar()).toBe(0);
	});
});
