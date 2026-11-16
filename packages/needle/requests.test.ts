import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NeedlePluginOptions } from './index';
import { needle, needleEndpointsNested } from './index';
import {
	archived,
	campaign,
	campaignLeads,
	campaignPage,
	campaignStats,
	composed,
	deleted,
	duplicateLead,
	enrollResults,
	invalidKey,
	lastLeadPage,
	lead,
	leadPage,
	me,
	placeHits,
	rateLimited,
	stopResults,
	suppressionCheckResults,
	suppressionCreated,
	suppressionPage,
	upsertCreated,
	upsertMatched,
	validationError,
} from './test-fixtures';

function makeContext(key = 'sk-ndl-test') {
	return {
		key,
		authType: 'api_key' as const,
		options: {} as NeedlePluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = needleEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

function sentBody(init: RequestInit): Record<string, unknown> {
	// unknown: the request body is JSON the endpoint built; read as a record.
	const parsed = JSON.parse(String(init.body)) as unknown;
	const record = asRecord(parsed);
	if (!record) throw new Error('request body was not an object');
	return record;
}

describe('account.me', () => {
	it('reads the key owner from /me with a bearer token', async () => {
		const { result, url, init } = await capture(endpoints.account.me, {}, me);

		expect(url).toBe('https://needle.app/api/v1/me');
		expect(init.method).toBe('GET');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer sk-ndl-test',
		);
		const user = asRecord(asRecord(result)?.user);
		expect(user?.email).toBe('jordan@acme.com');
		expect(asRecord(user?.organization)?.role).toBe('owner');
	});
});

describe('leads.create', () => {
	it('posts the identities and fields, and needs a timezone', async () => {
		const { url, init } = await capture(
			endpoints.leads.create,
			{
				identities: { linkedin: 'https://www.linkedin.com/in/dana-okafor' },
				timezone: 'Europe/London',
				firstName: 'Dana',
				companyDomain: 'northwind.example',
			},
			lead,
			{ status: 201 },
		);

		expect(url).toBe('https://needle.app/api/v1/leads');
		expect(init.method).toBe('POST');
		const body = sentBody(init);
		expect(body.timezone).toBe('Europe/London');
		expect(asRecord(body.identities)?.linkedin).toBe(
			'https://www.linkedin.com/in/dana-okafor',
		);
	});

	it('rejects identities without a channel', async () => {
		await expect(
			endpoints.leads.create(makeContext() as never, {
				identities: {},
				timezone: 'Europe/London',
			}),
		).rejects.toThrow(/at least one of linkedin or instagram/i);
	});

	it('rejects a missing timezone, which Needle requires', async () => {
		await expect(
			// Cast past the type: the point is that the schema refuses a missing
			// timezone at runtime for a caller passing untyped input.
			endpoints.leads.create(
				makeContext() as never,
				{
					identities: { linkedin: 'dana-okafor' },
				} as never,
			),
		).rejects.toThrow();
	});

	it('returns the stored identifier rather than the URL sent in', async () => {
		const { result } = await capture(
			endpoints.leads.create,
			{
				identities: { linkedin: 'https://www.linkedin.com/in/dana-okafor' },
				timezone: 'Europe/London',
			},
			lead,
			{ status: 201 },
		);

		const identities = asRecord(asRecord(result)?.lead)?.identities;
		const first = asRecord(Array.isArray(identities) ? identities[0] : null);
		expect(first?.channelIdentity).toBe('dana-okafor');
	});
});

describe('leads.get', () => {
	it('addresses the lead by id', async () => {
		const { result, url } = await capture(
			endpoints.leads.get,
			{ leadId: lead.lead.id },
			lead,
		);

		expect(url).toBe(`https://needle.app/api/v1/leads/${lead.lead.id}`);
		expect(asRecord(asRecord(result)?.lead)?.jobTitle).toBe('VP Operations');
	});

	it('rejects a lead id that is not a uuid', async () => {
		await expect(
			endpoints.leads.get(makeContext() as never, { leadId: 'not-a-uuid' }),
		).rejects.toThrow();
	});
});

describe('leads.update', () => {
	it('patches only the fields sent', async () => {
		const { url, init } = await capture(
			endpoints.leads.update,
			{ leadId: lead.lead.id, jobTitle: 'SVP Operations' },
			lead,
		);

		expect(url).toBe(`https://needle.app/api/v1/leads/${lead.lead.id}`);
		expect(init.method).toBe('PATCH');
		expect(sentBody(init)).toEqual({ jobTitle: 'SVP Operations' });
	});

	it('keeps the id out of the body', async () => {
		const { init } = await capture(
			endpoints.leads.update,
			{ leadId: lead.lead.id, firstName: 'Dana' },
			lead,
		);

		expect(sentBody(init)).not.toHaveProperty('leadId');
	});
});

describe('leads.upsert', () => {
	it('posts to /leads/upsert and reports created', async () => {
		const { result, url, init } = await capture(
			endpoints.leads.upsert,
			{ identities: { linkedin: 'dana-okafor' }, timezone: 'Europe/London' },
			upsertCreated,
		);

		expect(url).toBe('https://needle.app/api/v1/leads/upsert');
		expect(init.method).toBe('POST');
		expect(asRecord(result)?.status).toBe('created');
	});

	it('reports matched when the identity already existed', async () => {
		const { result } = await capture(
			endpoints.leads.upsert,
			{ identities: { linkedin: 'dana-okafor' }, timezone: 'Europe/London' },
			upsertMatched,
		);

		expect(asRecord(result)?.status).toBe('matched');
		expect(asRecord(asRecord(result)?.lead)?.jobTitle).toBe('SVP Operations');
	});
});

describe('leads.list and leads.search', () => {
	it('pages with the cursor and reports whether more remain', async () => {
		const { result, url } = await capture(
			endpoints.leads.list,
			{ cursor: 'abc', limit: 25 },
			leadPage,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v1/leads');
		expect(parsed.searchParams.get('cursor')).toBe('abc');
		expect(parsed.searchParams.get('limit')).toBe('25');
		expect(asRecord(result)?.nextCursor).toBe('eyJvZmZzZXQiOjF9');
	});

	it('reports no cursor on the last page', async () => {
		const { result } = await capture(endpoints.leads.list, {}, lastLeadPage);

		expect(asRecord(result)?.nextCursor).toBeNull();
	});

	it('posts the search body and keeps the cursor in the query', async () => {
		const { url, init } = await capture(
			endpoints.leads.search,
			{ query: 'northwind', limit: 10 },
			leadPage,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v1/leads/search');
		expect(parsed.searchParams.get('limit')).toBe('10');
		const body = sentBody(init);
		expect(body.query).toBe('northwind');
		// The cursor and limit belong in the query, not the body.
		expect(body).not.toHaveProperty('limit');
	});

	it('sends structured filters with their operators', async () => {
		const { init } = await capture(
			endpoints.leads.search,
			{
				filters: [
					{
						field: 'companyDomain',
						operator: 'eq',
						value: 'northwind.example',
					},
					{
						field: 'enrollmentStatus',
						operator: 'in',
						value: ['active', 'waiting'],
					},
					{ field: 'jobsToBeDone', operator: 'is_set' },
				],
			},
			leadPage,
		);

		const filters = sentBody(init).filters;
		expect(Array.isArray(filters) ? filters.length : 0).toBe(3);
		// is_set carries no value, and the list form survives intact.
		const third = asRecord(Array.isArray(filters) ? filters[2] : null);
		expect(third?.operator).toBe('is_set');
		expect(third).not.toHaveProperty('value');
	});

	it('rejects an operator Needle does not define', async () => {
		await expect(
			endpoints.leads.search(makeContext() as never, {
				filters: [
					{ field: 'email', operator: 'matches' as never, value: 'a@b.com' },
				],
			}),
		).rejects.toThrow();
	});

	it('rejects more than the documented 20 filters', async () => {
		const filters = Array.from({ length: 21 }, () => ({
			field: 'email',
			operator: 'eq' as const,
			value: 'a@b.com',
		}));
		await expect(
			endpoints.leads.search(makeContext() as never, { filters }),
		).rejects.toThrow();
	});

	it('rejects a query longer than the documented 200 characters', async () => {
		await expect(
			endpoints.leads.search(makeContext() as never, {
				query: 'x'.repeat(201),
			}),
		).rejects.toThrow();
	});
});

describe('leads.delete', () => {
	it('issues a DELETE and returns the deleted flag', async () => {
		const { result, url, init } = await capture(
			endpoints.leads.delete,
			{ leadId: lead.lead.id },
			deleted,
		);

		expect(url).toBe(`https://needle.app/api/v1/leads/${lead.lead.id}`);
		expect(init.method).toBe('DELETE');
		expect(asRecord(result)?.deleted).toBe(true);
	});
});

describe('campaigns', () => {
	it('lists campaigns and filters by status', async () => {
		const { url } = await capture(
			endpoints.campaigns.list,
			{ status: 'active' },
			campaignPage,
		);

		expect(new URL(url).searchParams.get('status')).toBe('active');
	});

	it('rejects a status Needle does not define', async () => {
		await expect(
			endpoints.campaigns.list(makeContext() as never, {
				status: 'running' as never,
			}),
		).rejects.toThrow();
	});

	it('creates a campaign from a graph and does not start it', async () => {
		const { url, init } = await capture(
			endpoints.campaigns.create,
			{
				name: 'EMEA logistics Q4',
				graph: {
					nodes: [
						{ id: 'start', kind: 'start' },
						{ id: 'end', kind: 'end' },
					],
					edges: [{ from: 'start', to: 'end' }],
				},
			},
			campaign,
			{ status: 201 },
		);

		expect(url).toBe('https://needle.app/api/v1/campaigns');
		const body = sentBody(init);
		expect(body.name).toBe('EMEA logistics Q4');
		// No status is sent, so Needle leaves it in draft.
		expect(body).not.toHaveProperty('status');
	});

	it('rejects a delay node without a duration', async () => {
		await expect(
			endpoints.campaigns.create(
				makeContext() as never,
				{
					name: 'Missing wait',
					graph: {
						nodes: [
							{ id: 'start', kind: 'start' },
							{ id: 'wait', kind: 'delay' },
							{ id: 'end', kind: 'end' },
						],
					},
				} as never,
			),
		).rejects.toThrow(/needs a duration/);
	});

	it('accepts a delay node with a duration', async () => {
		const { init } = await capture(
			endpoints.campaigns.create,
			{
				name: 'With a wait',
				graph: {
					nodes: [
						{ id: 'start', kind: 'start' },
						{ id: 'wait', kind: 'delay', duration: { days: 2 } },
						{ id: 'end', kind: 'end' },
					],
					edges: [
						{ from: 'start', to: 'wait' },
						{ from: 'wait', to: 'end' },
					],
				},
			},
			campaign,
			{ status: 201 },
		);

		const nodes = asRecord(sentBody(init).graph)?.nodes;
		expect(Array.isArray(nodes) ? nodes.length : 0).toBe(3);
	});

	it('rejects an action node without a channel and step', async () => {
		await expect(
			endpoints.campaigns.create(
				makeContext() as never,
				{
					name: 'No action',
					graph: {
						nodes: [
							{ id: 'start', kind: 'start' },
							{ id: 'msg', kind: 'action' },
							{ id: 'end', kind: 'end' },
						],
						edges: [
							{ from: 'start', to: 'msg' },
							{ from: 'msg', to: 'end' },
						],
					},
				} as never,
			),
		).rejects.toThrow(/needs a channel and an action/);
	});

	it('accepts a full action node with template content', async () => {
		const { init } = await capture(
			endpoints.campaigns.create,
			{
				name: 'With a message',
				graph: {
					nodes: [
						{ id: 'start', kind: 'start' },
						{
							id: 'msg',
							kind: 'action',
							channel: 'linkedin',
							action: 'linkedin_message',
							content: { kind: 'template', text: 'Hi {{firstName}}' },
						},
						{ id: 'end', kind: 'end' },
					],
					edges: [
						{ from: 'start', to: 'msg' },
						{ from: 'msg', to: 'end' },
					],
				},
			},
			campaign,
			{ status: 201 },
		);

		const nodes = asRecord(sentBody(init).graph)?.nodes;
		const action = asRecord(Array.isArray(nodes) ? nodes[1] : null);
		expect(action?.action).toBe('linkedin_message');
		expect(asRecord(action?.content)?.text).toBe('Hi {{firstName}}');
	});

	it('rejects an action name Needle does not define', async () => {
		await expect(
			endpoints.campaigns.create(makeContext() as never, {
				name: 'Bad step',
				graph: {
					nodes: [
						{ id: 'start', kind: 'start' },
						{
							id: 'msg',
							kind: 'action',
							channel: 'linkedin',
							action: 'linkedin_email' as never,
						},
						{ id: 'end', kind: 'end' },
					],
					edges: [
						{ from: 'start', to: 'msg' },
						{ from: 'msg', to: 'end' },
					],
				},
			}),
		).rejects.toThrow();
	});

	it('rejects a graph with fewer than two nodes', async () => {
		await expect(
			endpoints.campaigns.create(makeContext() as never, {
				name: 'Too short',
				graph: {
					nodes: [{ id: 'start', kind: 'start' }],
					edges: [],
				},
			}),
		).rejects.toThrow();
	});

	it('starts a campaign by patching status to active', async () => {
		const { url, init } = await capture(
			endpoints.campaigns.update,
			{ campaignId: campaign.campaign.id, status: 'active' },
			campaign,
		);

		expect(url).toBe(
			`https://needle.app/api/v1/campaigns/${campaign.campaign.id}`,
		);
		expect(init.method).toBe('PATCH');
		expect(sentBody(init)).toEqual({ status: 'active' });
	});

	it('rejects archiving through update, which only takes active or paused', async () => {
		await expect(
			endpoints.campaigns.update(makeContext() as never, {
				campaignId: campaign.campaign.id,
				status: 'archived' as never,
			}),
		).rejects.toThrow();
	});

	it('archives with a DELETE and returns the archived flag', async () => {
		const { result, init } = await capture(
			endpoints.campaigns.delete,
			{ campaignId: campaign.campaign.id },
			archived,
		);

		expect(init.method).toBe('DELETE');
		expect(asRecord(result)?.archived).toBe(true);
	});

	it('reads stats with the funnel and skip reasons', async () => {
		const { result, url } = await capture(
			endpoints.campaigns.stats,
			{ campaignId: campaign.campaign.id },
			campaignStats,
		);

		expect(url).toContain('/stats');
		const funnel = asRecord(asRecord(asRecord(result)?.stats)?.funnel);
		expect(funnel?.invitesSent).toBe(116);
		expect(asRecord(funnel?.skippedByReason)?.suppressed).toBe(4);
	});

	it('pages the leads in a campaign', async () => {
		const { result, url } = await capture(
			endpoints.campaigns.leads,
			{ campaignId: campaign.campaign.id, limit: 50 },
			campaignLeads,
		);

		expect(new URL(url).searchParams.get('limit')).toBe('50');
		const rows = asRecord(result)?.leads;
		expect(asRecord(Array.isArray(rows) ? rows[0] : null)?.status).toBe(
			'active',
		);
	});
});

describe('campaigns.enroll and stopLeads', () => {
	it('enrolls by lead id and reports one result per lead', async () => {
		const { result, url, init } = await capture(
			endpoints.campaigns.enroll,
			{
				campaignId: campaign.campaign.id,
				leadIds: [lead.lead.id],
			},
			enrollResults,
			{ status: 201 },
		);

		expect(url).toBe(
			`https://needle.app/api/v1/campaigns/${campaign.campaign.id}/leads`,
		);
		expect(sentBody(init)).toEqual({ leadIds: [lead.lead.id] });
		const results = asRecord(result)?.results;
		expect(Array.isArray(results) ? results.length : 0).toBe(2);
		// A partly successful batch keeps the skipped lead's reason.
		const skipped = asRecord(Array.isArray(results) ? results[1] : null);
		expect(skipped?.status).toBe('skipped');
		expect(skipped?.reason).toBe('suppressed');
	});

	it('rejects an empty lead list', async () => {
		await expect(
			endpoints.campaigns.enroll(makeContext() as never, {
				campaignId: campaign.campaign.id,
				leadIds: [],
			}),
		).rejects.toThrow();
	});

	it('rejects more than the documented 500 leads in one call', async () => {
		const many = Array.from(
			{ length: 501 },
			(_, index) =>
				`00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
		);
		await expect(
			endpoints.campaigns.enroll(makeContext() as never, {
				campaignId: campaign.campaign.id,
				leadIds: many,
			}),
		).rejects.toThrow();
	});

	it('stops leads through the bulk-stop route', async () => {
		const { result, url } = await capture(
			endpoints.campaigns.stopLeads,
			{ campaignId: campaign.campaign.id, leadIds: [lead.lead.id] },
			stopResults,
		);

		expect(url).toContain('/leads/bulk-stop');
		const results = asRecord(result)?.results;
		// A lead that was not enrolled is reported, not thrown.
		expect(Array.isArray(results) ? results.length : 0).toBe(2);
	});
});

describe('suppressions', () => {
	it('lists entries and filters by reason', async () => {
		const { result, url } = await capture(
			endpoints.suppressions.list,
			{ reason: 'competitor' },
			suppressionPage,
		);

		expect(new URL(url).searchParams.get('reason')).toBe('competitor');
		const rows = asRecord(result)?.suppressions;
		expect(Array.isArray(rows) ? rows.length : 0).toBe(2);
	});

	it('rejects a reason Needle does not define', async () => {
		await expect(
			endpoints.suppressions.list(makeContext() as never, {
				reason: 'spam' as never,
			}),
		).rejects.toThrow();
	});

	it('creates a lead entry and a company entry in one call', async () => {
		const { result, init } = await capture(
			endpoints.suppressions.create,
			{
				entries: [
					{ scope: 'lead', leadId: lead.lead.id, reason: 'unsubscribed' },
					{
						scope: 'company',
						companyDomain: 'competitor.example',
						reason: 'competitor',
					},
				],
			},
			suppressionCreated,
			{ status: 201 },
		);

		const body = sentBody(init);
		expect(body.entries).toHaveLength(2);
		expect(asRecord(result)?.created).toBe(2);
		expect(asRecord(result)?.alreadyListed).toBe(1);
	});

	it('rejects a company entry without a domain', async () => {
		await expect(
			endpoints.suppressions.create(makeContext() as never, {
				entries: [{ scope: 'company', reason: 'competitor' } as never],
			}),
		).rejects.toThrow();
	});

	it('removes one entry by id', async () => {
		const { result, url, init } = await capture(
			endpoints.suppressions.delete,
			{ suppressionId: 'c9d0e1f2-a3b4-4c5d-8e6f-7a8b9c0d1e2f' },
			{ deleted: true, requestId: 'x' },
		);

		expect(url).toBe(
			'https://needle.app/api/v1/suppressions/c9d0e1f2-a3b4-4c5d-8e6f-7a8b9c0d1e2f',
		);
		expect(init.method).toBe('DELETE');
		expect(asRecord(result)?.deleted).toBe(true);
	});

	it('checks identities and separates contactable from blocked', async () => {
		const { result, url } = await capture(
			endpoints.suppressions.check,
			{
				identities: [
					{ channel: 'linkedin', identity: 'dana-okafor' },
					{ channel: 'linkedin', identity: 'sam-rivera' },
				],
			},
			suppressionCheckResults,
		);

		expect(url).toBe('https://needle.app/api/v1/suppressions/check');
		const results = asRecord(result)?.results;
		const first = asRecord(Array.isArray(results) ? results[0] : null);
		expect(asRecord(first?.decision)?.contactable).toBe(false);
		expect(asRecord(first?.decision)?.reason).toBe('unsubscribed');
		const second = asRecord(Array.isArray(results) ? results[1] : null);
		expect(asRecord(second?.decision)?.contactable).toBe(true);
	});

	it('rejects a channel Needle does not have', async () => {
		await expect(
			endpoints.suppressions.check(makeContext() as never, {
				identities: [{ channel: 'email', identity: 'a@b.com' } as never],
			}),
		).rejects.toThrow();
	});
});

describe('places.search', () => {
	it('posts the query and returns the hits', async () => {
		const { result, url, init } = await capture(
			endpoints.places.search,
			{ query: 'dentists in Munich', limit: 5 },
			placeHits,
		);

		expect(url).toBe('https://needle.app/api/v1/places/search');
		expect(sentBody(init).query).toBe('dentists in Munich');
		const hits = asRecord(result)?.hits;
		const first = asRecord(Array.isArray(hits) ? hits[0] : null);
		expect(first?.city).toBe('Munich');
		expect(asRecord(first?.location)?.latitude).toBe(48.1583);
	});

	it('accepts a location without a query', async () => {
		const { init } = await capture(
			endpoints.places.search,
			{ location: { latitude: 48.1, longitude: 11.5 } },
			placeHits,
		);

		expect(sentBody(init).location).toEqual({
			latitude: 48.1,
			longitude: 11.5,
		});
	});

	it('rejects a search with neither a query nor a location', async () => {
		await expect(
			endpoints.places.search(makeContext() as never, {}),
		).rejects.toThrow(/query or location/);
	});
});

describe('compose.preview', () => {
	it('previews a message without sending', async () => {
		const { result, url, init } = await capture(
			endpoints.compose.preview,
			{
				channel: 'linkedin',
				connectedAccountId: '2f1c8d9e-3a5b-4c6d-8e9f-0a1b2c3d4e5f',
				leadId: lead.lead.id,
			},
			composed,
		);

		expect(url).toBe('https://needle.app/api/v1/compose');
		// Only POST /compose is wrapped; nothing here sends a message.
		expect(sentBody(init).channel).toBe('linkedin');
		expect(asRecord(result)?.text).toContain('Northwind');
	});
});

describe('needle error reporting', () => {
	it('keeps Needle’s requestId, which their support asks for', async () => {
		const error = await capture(endpoints.account.me, {}, invalidKey, {
			status: 401,
		}).catch((caught: unknown) => caught);

		expect(String(error)).toContain('invalid or has been revoked');
		expect(String(error)).toContain(invalidKey.requestId);
	});

	it('reports a duplicate identity on create', async () => {
		await expect(
			capture(
				endpoints.leads.create,
				{
					identities: { linkedin: 'dana-okafor' },
					timezone: 'Europe/London',
				},
				duplicateLead,
				{ status: 409 },
			),
		).rejects.toThrow(/already exists/);
	});

	it('reports validation detail on 422', async () => {
		const error = await capture(endpoints.account.me, {}, validationError, {
			status: 422,
		}).catch((caught: unknown) => caught);

		expect(String(error)).toContain('at least one channel');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(endpoints.account.me, {}, invalidKey, {
			status: 401,
		}).catch((caught: unknown) => caught);

		expect(String(error)).not.toContain('sk-ndl-test');
	});

	it('surfaces a 429 through the rate limit handler', async () => {
		await expect(
			capture(endpoints.account.me, {}, rateLimited, { status: 429 }),
		).rejects.toThrow(/Too many requests/);
	});
});

describe('needle plugin definition', () => {
	it('registers as needle with api_key auth and no webhooks', () => {
		const plugin = needle();
		expect(plugin.id).toBe('needle');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 23 catalog operations', () => {
		const nested = Object.entries(needleEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'account.me',
			'campaigns.create',
			'campaigns.delete',
			'campaigns.enroll',
			'campaigns.get',
			'campaigns.leads',
			'campaigns.list',
			'campaigns.stats',
			'campaigns.stopLeads',
			'campaigns.update',
			'compose.preview',
			'leads.create',
			'leads.delete',
			'leads.get',
			'leads.list',
			'leads.search',
			'leads.update',
			'leads.upsert',
			'places.search',
			'suppressions.check',
			'suppressions.create',
			'suppressions.delete',
			'suppressions.list',
		]);
	});

	it('marks deletes destructive and irreversible', () => {
		const meta = needle().endpointMeta ?? {};
		expect(meta['leads.delete']?.riskLevel).toBe('destructive');
		expect(meta['leads.delete']?.irreversible).toBe(true);
		// Archiving keeps the record, so it is not irreversible.
		expect(meta['campaigns.delete']?.riskLevel).toBe('destructive');
		expect(meta['campaigns.delete']?.irreversible).toBeUndefined();
	});

	it('marks sends and enrollments as writes', () => {
		const meta = needle().endpointMeta ?? {};
		expect(meta['campaigns.enroll']?.riskLevel).toBe('write');
		expect(meta['campaigns.update']?.riskLevel).toBe('write');
		// A preview never sends, so it stays a read.
		expect(meta['compose.preview']?.riskLevel).toBe('read');
	});

	it('has input and output schemas for every operation', () => {
		const meta = needle().endpointMeta ?? {};
		const schemas = needle().endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(Object.keys(meta).sort());
		for (const entry of Object.values(schemas)) {
			expect(typeof entry?.input?.safeParse).toBe('function');
			expect(typeof entry?.output?.safeParse).toBe('function');
		}
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = needle();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({ plugins: [needle({ key: 'k' })] });
		expect(corsair.needle).toBeDefined();
	});
});
