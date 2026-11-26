jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { link, webhookUrl, workspaceLink } from './test-fixtures';
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
} from './test-helpers';

// Request shapes for the operations added to cover Linkly's whole API:
// URL, method, query and body, each checked against the OpenAPI 1.4 spec
// (api.linklyhq.com/api/openapi), or against Linkly's own MCP server
// (github.com/Linkly-HQ/linkly-mcp-server) for the three routes the spec
// leaves out. Response fixtures use the spec's per-field examples.

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// From the spec's Conversion schema examples.
const conversion = {
	id: '01KYPH20SEJY4HQSCPMWW60QE0',
	link_id: 41657524,
	click_id: '01KYPGEEPJSPR3S564QRBDGA1W',
	event_type: 'sale',
	event_name: 'purchase',
	source: 'api',
	occurred_at: '2026-07-29T10:30:00.123456Z',
	inserted_at: '2026-07-29T10:30:01',
	amount_cents: 4999,
	currency: 'USD',
	country: 'US',
	event_id: 'shopify-1234',
	external_id: 'customer-42',
	ip_source: 'visitor',
	metadata: null,
};

describe('links: the rest of the API', () => {
	it('reads one link with click counts from GET /api/v1/get_link/{id}', async () => {
		const body = {
			base62_id: '2TQ',
			clicks_count: 120,
			domain: null,
			domains: [{ name: 'go.example.com' }],
			link: workspaceLink,
		};
		mockFetch(jsonResponse(body));

		const result = await endpoints.links.getDetails(makeCtx(), {
			id: 41657524,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/get_link/41657524`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.clicks_count).toBe(120);
		expect(result.link.full_url).toBe(workspaceLink.full_url);
	});

	it('posts a bare array to /api/v1/links for bulk create and update', async () => {
		mockFetch(
			jsonResponse([
				{ index: 0, status: 'success', link },
				{
					index: 1,
					status: 'error',
					error: { slug: ['has already been taken'] },
				},
			]),
		);

		const result = await endpoints.links.bulkUpsert(makeCtx(), {
			links: [
				{ workspace_id: 42, url: 'https://www.example.com/a', name: 'A' },
				{ workspace_id: 42, id: 30, slug: 'taken' },
			],
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/links`);
		expect(lastCall().init.method).toBe('POST');
		expect(JSON.parse(String(lastCall().init.body))).toEqual([
			{ workspace_id: 42, url: 'https://www.example.com/a', name: 'A' },
			{ workspace_id: 42, id: 30, slug: 'taken' },
		]);
		expect(result.map((item) => item.status)).toEqual(['success', 'error']);
	});

	it('trashes several links with DELETE /workspace/{id}/links and an ids body', async () => {
		mockFetch(jsonResponse('Links deleted.'));

		const result = await endpoints.links.deleteMany(makeCtx(), {
			workspace_id: 42,
			ids: [30, 31],
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/links`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(sentBody()).toEqual({ ids: [30, 31] });
		expect(result).toBe('Links deleted.');
	});

	it('gives the two bulk calls a 60 s timeout and leaves single-link calls on the 20 s default', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		mockFetch(jsonResponse([{ index: 0, status: 'success', link }]));
		mockFetch(jsonResponse('Links deleted.'));
		mockFetch(jsonResponse(link));

		await endpoints.links.bulkUpsert(makeCtx(), {
			links: [{ workspace_id: 42, id: 30, name: 'A' }],
		});
		await endpoints.links.deleteMany(makeCtx(), {
			workspace_id: 42,
			ids: [30],
		});
		await endpoints.links.update(makeCtx(), {
			workspace_id: 42,
			id: 30,
			name: 'A',
		});

		// CodeRabbit thread on client.ts:185.
		expect(timeout.mock.calls.map(([ms]) => ms)).toEqual([
			60_000, 60_000, 20_000,
		]);
	});

	it('encodes filter as filter[field]=value, the deepObject the spec documents', async () => {
		mockFetch(
			jsonResponse({
				links: [],
				page_number: 1,
				page_size: 50,
				total_entries: 0,
				total_pages: 0,
				workspace_link_count: 0,
			}),
		);

		await endpoints.links.list(makeCtx(), {
			workspace_id: 42,
			filter: { utm_campaign: 'summer_sale', utm_source: 'newsletter' },
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/list_links?filter%5Butm_source%5D=newsletter&filter%5Butm_campaign%5D=summer_sale`,
		);
	});

	it('forwards password, metadata and the other documented write fields', async () => {
		mockFetch(jsonResponse(link));

		await endpoints.links.create(makeCtx(), {
			workspace_id: 42,
			url: 'https://www.example.com',
			password: 'open-sesame',
			metadata: { crm_id: 'acme-4711', old_key: null },
			public_analytics: true,
			privacy_mode: true,
			skip_social_crawler_tracking: true,
			webhooks: [webhookUrl],
			notify_user_ids: [7],
			qr_styles: { fgColor: '#000000' },
		});

		// CodeRabbit threads on types.ts:252 and :250: password and
		// privacy_mode used to be stripped.
		expect(sentBody()).toEqual({
			workspace_id: 42,
			url: 'https://www.example.com',
			password: 'open-sesame',
			metadata: { crm_id: 'acme-4711', old_key: null },
			public_analytics: true,
			privacy_mode: true,
			skip_social_crawler_tracking: true,
			webhooks: [webhookUrl],
			notify_user_ids: [7],
			qr_styles: { fgColor: '#000000' },
		});
	});
});

describe('clicks.export', () => {
	it('GETs /workspace/{id}/clicks/export with format=json and the filters', async () => {
		mockFetch(
			jsonResponse([
				{ timestamp: '2026-06-01T10:00:00Z', country: 'US', browser: 'Chrome' },
			]),
		);

		const result = await endpoints.clicks.export(makeCtx(), {
			workspace_id: 42,
			link_id: '30',
			start: '2026-06-01',
			end: '2026-06-30',
			bots: false,
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/clicks/export?format=json&link_id=30&start=2026-06-01&end=2026-06-30&bots=false`,
		);
		expect(lastCall().init.method).toBe('GET');
		expect(result).toHaveLength(1);
	});

	it('also reads an object that wraps the rows in clicks', async () => {
		mockFetch(jsonResponse({ clicks: [{ country: 'DE' }] }));

		const result = await endpoints.clicks.export(makeCtx(), {
			workspace_id: 42,
		});

		expect(Array.isArray(result) ? result : result.clicks).toEqual([
			{ country: 'DE' },
		]);
	});
});

describe('domains', () => {
	it('adds a domain with POST /workspace/{id}/domains', async () => {
		mockFetch(jsonResponse({ name: 'go.example.com', workspace_id: 42 }));

		const result = await endpoints.domains.create(makeCtx(), {
			workspace_id: 42,
			name: 'go.example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/domains`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ name: 'go.example.com' });
		expect(result.name).toBe('go.example.com');
	});

	it('parses the spec example, whose name is null', async () => {
		mockFetch(jsonResponse({ name: null, workspace_id: 42 }));

		await expect(
			endpoints.domains.create(makeCtx(), {
				workspace_id: 42,
				name: 'go.example.com',
			}),
		).resolves.toEqual({ name: null, workspace_id: 42 });
	});

	it('removes a domain with DELETE /workspace/{id}/domains/{domain_id}', async () => {
		mockFetch(jsonResponse('Domain deleted.'));

		const result = await endpoints.domains.delete(makeCtx(), {
			workspace_id: 42,
			domain_id: 7,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42/domains/7`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(result).toBe('Domain deleted.');
	});

	it('sets a favicon with PATCH /workspace/{id}/domains/{id}/favicon', async () => {
		mockFetch(
			jsonResponse({
				id: 7,
				name: 'go.example.com',
				favicon_url: 'https://www.example.com/favicon.ico',
			}),
		);

		const result = await endpoints.domains.updateFavicon(makeCtx(), {
			workspace_id: 42,
			domain_id: 7,
			favicon_url: 'https://www.example.com/favicon.ico',
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/workspace/42/domains/7/favicon`,
		);
		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({
			favicon_url: 'https://www.example.com/favicon.ico',
		});
		expect(result.id).toBe(7);
	});

	it('clears a favicon with null', async () => {
		mockFetch(
			jsonResponse({ id: 7, name: 'go.example.com', favicon_url: null }),
		);

		await endpoints.domains.updateFavicon(makeCtx(), {
			workspace_id: 42,
			domain_id: '7',
			favicon_url: null,
		});

		expect(sentBody()).toEqual({ favicon_url: null });
	});
});

describe('webhooks on one link', () => {
	it('lists them with GET /link/{link_id}/webhooks', async () => {
		mockFetch(jsonResponse([{ id: webhookUrl }]));

		const result = await endpoints.webhooks.listForLink(makeCtx(), {
			link_id: 30,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/link/30/webhooks`);
		expect(result).toEqual([{ id: webhookUrl }]);
	});

	it('subscribes with POST /link/{link_id}/webhooks and a url body', async () => {
		mockFetch(jsonResponse({ id: webhookUrl }));

		const result = await endpoints.webhooks.subscribeToLink(makeCtx(), {
			link_id: 30,
			url: webhookUrl,
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/link/30/webhooks`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ url: webhookUrl });
		expect(result.id).toBe(webhookUrl);
	});

	it('unsubscribes with the webhook URL encoded into one path segment', async () => {
		mockFetch(jsonResponse('Unsubscribed.'));

		await endpoints.webhooks.unsubscribeFromLink(makeCtx(), {
			link_id: 30,
			hook_id: webhookUrl,
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/link/30/webhooks/${encodeURIComponent(webhookUrl)}`,
		);
		expect(lastCall().init.method).toBe('DELETE');
	});
});

describe('conversions', () => {
	it('lists with GET /conversions and workspace_id in the query', async () => {
		mockFetch(jsonResponse({ conversions: [conversion], has_more: false }));

		const result = await endpoints.conversions.list(makeCtx(), {
			workspace_id: 42,
			since: '2020-01-01',
			limit: 500,
		});

		expect(lastCall().url).toBe(
			`${BASE}/api/v1/conversions?workspace_id=42&limit=500&since=2020-01-01`,
		);
		expect(result.conversions[0]?.id).toBe(conversion.id);
		expect(result.has_more).toBe(false);
	});

	it('reports one with POST /conversions?workspace_id=, the rest in the body', async () => {
		mockFetch(jsonResponse(conversion, 201));

		const result = await endpoints.conversions.create(makeCtx(), {
			workspace_id: 42,
			event_name: 'purchase',
			event_type: 'sale',
			linkly_cid: '01KYPGEEPJSPR3S564QRBDGA1W',
			event_id: 'shopify-1234',
			amount_cents: 4999,
			currency: 'USD',
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/conversions?workspace_id=42`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			event_name: 'purchase',
			event_type: 'sale',
			linkly_cid: '01KYPGEEPJSPR3S564QRBDGA1W',
			event_id: 'shopify-1234',
			amount_cents: 4999,
			currency: 'USD',
		});
		expect(result).toMatchObject({ id: conversion.id });
	});

	it('returns the 202 attributed:false answer instead of failing', async () => {
		mockFetch(
			jsonResponse(
				{ attributed: false, message: 'No linkly_cid; conversion discarded.' },
				202,
			),
		);

		const result = await endpoints.conversions.create(makeCtx(), {
			workspace_id: 42,
			event_name: 'signup',
		});

		expect(result).toEqual({
			attributed: false,
			message: 'No linkly_cid; conversion discarded.',
		});
	});
});

describe('routes Linkly documents outside the OpenAPI spec', () => {
	it('updates a workspace with PATCH /workspace/{id}', async () => {
		mockFetch(jsonResponse({ id: 42, name: 'Renamed' }));

		const result = await endpoints.workspaces.update(makeCtx(), {
			workspace_id: 42,
			name: 'Renamed',
		});

		expect(lastCall().url).toBe(`${BASE}/api/v1/workspace/42`);
		expect(lastCall().init.method).toBe('PATCH');
		// webhooks was omitted, so the body leaves the list alone.
		expect(sentBody()).toEqual({ name: 'Renamed' });
		expect(result).toEqual({ id: 42, name: 'Renamed' });
	});

	it('checks the key with POST /api/v1/test', async () => {
		mockFetch(jsonResponse({ ok: true }));

		const result = await endpoints.auth.test(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/api/v1/test`);
		expect(lastCall().init.method).toBe('POST');
		expect(result).toEqual({ ok: true });
	});
});
