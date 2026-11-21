import { logEventFromContext } from 'corsair/core';
import {
	Campaigns,
	DncDomains,
	Events,
	LeadFields,
	LeadStatuses,
	Leads,
	Tags,
	Users,
	Webhooks,
} from './endpoints';
import {
	campaign,
	campaignLead,
	dncDomain,
	event,
	lead,
	leadField,
	leadStatus,
	PAGE,
	reply,
	tag,
	user,
	webhookSettings,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'pq-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'GET') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.persistiq.com');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('users and metadata', () => {
	it('users.list GETs the team from the users array', async () => {
		respond({ ...PAGE, users: [user] });
		const page = (await invoke(Users.list, { page: 2 })) as {
			users: Array<{ mailboxes?: unknown[] }>; // unknown: mailbox records are provider-shaped
		};
		expect(page.users[0]?.mailboxes).toHaveLength(1);
		expectAuthenticated('/v1/users');
		expect(lastRequest().query).toEqual({ page: '2' });
	});

	it('leadFields.list GETs the field definitions', async () => {
		respond({ ...PAGE, lead_fields: [leadField] });
		const page = (await invoke(LeadFields.list, {})) as {
			lead_fields: Array<{ name?: string }>;
		};
		expect(page.lead_fields[0]?.name).toBe('first_name');
		expectAuthenticated('/v1/lead_fields');
	});

	it('leadStatuses.list GETs the statuses', async () => {
		respond({ ...PAGE, lead_statuses: [leadStatus] });
		await invoke(LeadStatuses.list, {});
		expectAuthenticated('/v1/lead_statuses');
	});

	it('tags.list GETs the tags', async () => {
		respond({ ...PAGE, tags: [tag] });
		await invoke(Tags.list, {});
		expectAuthenticated('/v1/tags');
	});
});

describe('leads', () => {
	it('list sends the page number and filters as query parameters', async () => {
		respond({
			...PAGE,
			has_more: true,
			next_page: 'https://api.persistiq.com/v1/leads?page=3',
			leads: [lead],
		});
		const page = (await invoke(Leads.list, {
			page: 2,
			status_id: 's_1',
			updated_after: '2025-11-01T00:00:00Z',
		})) as { leads: Array<{ id: string }>; has_more?: boolean };
		expect(page.leads[0]?.id).toBe('l_1');
		expect(page.has_more).toBe(true);
		expectAuthenticated('/v1/leads');
		expect(lastRequest().query).toEqual({
			page: '2',
			status_id: 's_1',
			updated_after: '2025-11-01T00:00:00Z',
		});
	});

	it('create posts the lead wrapped in lead, with dup and creator_id', async () => {
		respond({ status: 'success', error: null, lead });
		const result = (await invoke(Leads.create, {
			lead: { email: 'john@example.com', first_name: 'John' },
			dup: 'skip',
			creator_id: 'u_1',
		})) as { lead: { id: string } };
		expect(result.lead.id).toBe('l_1');
		const sent = lastRequest();
		expectAuthenticated('/v1/leads', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			lead: { email: 'john@example.com', first_name: 'John' },
			dup: 'skip',
			creator_id: 'u_1',
		});
	});

	it('get reads the lead from the lead key', async () => {
		respond({ status: 'success', error: null, lead });
		const result = (await invoke(Leads.get, { id: 'l_1' })) as {
			lead: { id: string };
		};
		expect(result.lead.id).toBe('l_1');
		expectAuthenticated('/v1/leads/l_1');
	});

	it('update PATCHes status, flags and the data map', async () => {
		respond({ status: 'success', error: null, lead });
		await invoke(Leads.update, {
			id: 'l_1',
			status: 'Replied',
			optedout: true,
			data: { first_name: 'Jane' },
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/leads/l_1', 'PATCH');
		expect(JSON.parse(sent.body as string)).toEqual({
			status: 'Replied',
			optedout: true,
			data: { first_name: 'Jane' },
		});
	});

	it('refuses . and .. as ids so the path cannot change route', async () => {
		await expect(invoke(Leads.get, { id: '..' })).rejects.toThrow(
			'not a valid id',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('campaigns', () => {
	it('list GETs campaigns with filters', async () => {
		respond({ ...PAGE, campaigns: [campaign] });
		const page = (await invoke(Campaigns.list, { owner_id: 'u_1' })) as {
			campaigns: Array<{ stats?: { total_prospects?: number } }>;
		};
		expect(page.campaigns[0]?.stats?.total_prospects).toBe(12);
		expectAuthenticated('/v1/campaigns');
		expect(lastRequest().query).toEqual({ owner_id: 'u_1' });
	});

	it('create posts campaign_name and owner_id and reads the bare campaign', async () => {
		respond(campaign);
		const created = (await invoke(Campaigns.create, {
			campaign_name: 'Q4 outbound',
			owner_id: 'u_1',
		})) as { id: string };
		expect(created.id).toBe('c_1');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			campaign_name: 'Q4 outbound',
			owner_id: 'u_1',
		});
		expectAuthenticated('/v1/campaigns', 'POST');
	});

	it('duplicate posts the campaign id, owner and name', async () => {
		respond(campaign);
		await invoke(Campaigns.duplicate, {
			campaign_id: 'c_1',
			owner_id: 'u_1',
			name: 'Q4 copy',
		});
		expectAuthenticated('/v1/campaigns/duplicate', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			campaign_id: 'c_1',
			owner_id: 'u_1',
			name: 'Q4 copy',
		});
	});

	it('listLeads, addLead and removeLead manage membership', async () => {
		respond({ ...PAGE, campaign_leads: [campaignLead] });
		const page = (await invoke(Campaigns.listLeads, {
			campaignId: 'c_1',
			page: 2,
		})) as { campaign_leads: Array<{ lead?: { id: string } }> };
		expect(page.campaign_leads[0]?.lead?.id).toBe('l_1');
		expectAuthenticated('/v1/campaigns/c_1/leads');
		expect(lastRequest().query).toEqual({ page: '2' });

		respond({ status: 'success', error: null, campaign_lead: campaignLead });
		const added = (await invoke(Campaigns.addLead, {
			campaignId: 'c_1',
			lead_id: 'l_1',
			skip_if_exists: true,
		})) as { campaign_lead?: { id: string } };
		expect(added.campaign_lead?.id).toBe('cl_1');
		expectAuthenticated('/v1/campaigns/c_1/leads', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			lead_id: 'l_1',
			skip_if_exists: true,
		});

		respond(undefined);
		const removed = (await invoke(Campaigns.removeLead, {
			campaignId: 'c_1',
			leadId: 'l_1',
		})) as { leadId: string };
		expect(removed.leadId).toBe('l_1');
		expectAuthenticated('/v1/campaigns/c_1/leads/l_1', 'DELETE');
	});

	it('addLead needs lead_id or leads', async () => {
		await expect(
			invoke(Campaigns.addLead, { campaignId: 'c_1' }),
		).rejects.toThrow('lead_id or leads');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('removeLead fails on an error answer instead of reporting success', async () => {
		respond({ status: 'error', error: { reason: 'not_found' } });
		await expect(
			invoke(Campaigns.removeLead, { campaignId: 'c_1', leadId: 'l_1' }),
		).rejects.toThrow('did not confirm');
	});

	it('listReplies filters and replyToMessage posts inbox_message_id and body', async () => {
		respond({ ...PAGE, replies: [reply] });
		const page = (await invoke(Campaigns.listReplies, {
			campaignId: 'c_1',
			lead_id: 'l_1',
		})) as { replies: Array<{ subject?: string | null }> };
		expect(page.replies[0]?.subject).toBe('Re: hello');
		expectAuthenticated('/v1/campaigns/c_1/replies');
		expect(lastRequest().query).toEqual({ lead_id: 'l_1' });

		respond({ status: 'queued', message: 'Reply queued' }, 201);
		const result = (await invoke(Campaigns.replyToMessage, {
			campaignId: 'c_1',
			inbox_message_id: 'r_1',
			body: '<p>Thanks for the reply!</p>',
		})) as { status?: string };
		expect(result.status).toBe('queued');
		expectAuthenticated('/v1/campaigns/c_1/replies', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			inbox_message_id: 'r_1',
			body: '<p>Thanks for the reply!</p>',
		});
	});
});

describe('events, dnc and webhooks', () => {
	it('events.list sends the page and filters', async () => {
		respond({ ...PAGE, events: [event] });
		await invoke(Events.list, { page: 3, campaign: 'c_1' });
		expectAuthenticated('/v1/events');
		expect(lastRequest().query).toEqual({ page: '3', campaign: 'c_1' });
	});

	it('dncDomains.list and create use the name field', async () => {
		respond({ ...PAGE, dnc_domains: [dncDomain] });
		const page = (await invoke(DncDomains.list, {})) as {
			dnc_domains: Array<{ name?: string | null }>;
		};
		expect(page.dnc_domains[0]?.name).toBe('example.com');
		expectAuthenticated('/v1/dnc_domains');

		respond({ status: 'success', error: null, dnc_domain: dncDomain });
		const result = (await invoke(DncDomains.create, {
			name: 'example.com',
		})) as { dnc_domain?: { id: string } };
		expect(result.dnc_domain?.id).toBe('d_1');
		expectAuthenticated('/v1/dnc_domains', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			name: 'example.com',
		});
	});

	it('dncDomains.create fails on an error answer', async () => {
		respond({ status: 'error', error: { message: 'invalid' } });
		await expect(invoke(DncDomains.create, { name: 'x' })).rejects.toThrow();
	});

	it('webhook settings get and update read the bare settings object', async () => {
		respond(webhookSettings);
		const settings = (await invoke(Webhooks.getSettings, {})) as {
			post_new_prospect?: boolean;
		};
		expect(settings.post_new_prospect).toBe(true);
		expectAuthenticated('/v1/webhook_plugin');

		respond(webhookSettings);
		await invoke(Webhooks.updateSettings, {
			post_new_prospect: true,
			post_new_prospect_url: 'https://example.com/webhooks/persistiq',
		});
		expectAuthenticated('/v1/webhook_plugin', 'PUT');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			post_new_prospect: true,
			post_new_prospect_url: 'https://example.com/webhooks/persistiq',
		});
	});

	it('webhooks.updateSettings needs at least one setting', async () => {
		await expect(invoke(Webhooks.updateSettings, {})).rejects.toThrow(
			'at least one setting',
		);
	});
});
