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
	dncDomain,
	event,
	lead,
	leadField,
	leadStatus,
	reply,
	tag,
	user,
	webhookSettings,
} from './test-fixtures';

const PAGE = { has_more: false, next_page: null };

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
	it('users.list GETs the team', async () => {
		respond({ status: 'success', data: [user], page: PAGE });
		const page = (await invoke(Users.list, {})) as { data: unknown[] }; // unknown: user records are provider-shaped
		expect(page.data).toHaveLength(1);
		expectAuthenticated('/v1/users');
	});

	it('leadFields.list GETs the field definitions', async () => {
		respond({ status: 'success', data: [leadField], page: PAGE });
		await invoke(LeadFields.list, {});
		expectAuthenticated('/v1/lead_fields');
	});

	it('leadStatuses.list GETs the statuses', async () => {
		respond({ status: 'success', data: [leadStatus], page: PAGE });
		await invoke(LeadStatuses.list, {});
		expectAuthenticated('/v1/lead_statuses');
	});

	it('tags.list GETs the tags', async () => {
		respond({ status: 'success', data: [tag], page: PAGE });
		await invoke(Tags.list, {});
		expectAuthenticated('/v1/tags');
	});
});

describe('leads', () => {
	it('list passes the next_page cursor', async () => {
		respond({
			status: 'success',
			data: [lead],
			page: { has_more: true, next_page: 'cur1' },
		});
		await invoke(Leads.list, { next_page: 'cur1' });
		expectAuthenticated('/v1/leads');
		expect(lastRequest().query['next_page']).toBe('cur1');
	});

	it('create posts the lead body', async () => {
		respond({ status: 'success', data: [lead], page: PAGE });
		await invoke(Leads.create, {
			email: 'john@example.com',
			data: { first_name: 'John' },
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/leads', 'POST');
		expect(JSON.parse(sent.body as string)).toEqual({
			email: 'john@example.com',
			data: { first_name: 'John' },
		});
	});

	it('get reads one lead', async () => {
		respond({ status: 'success', data: [lead], page: PAGE });
		await invoke(Leads.get, { id: 'l_1' });
		expectAuthenticated('/v1/leads/l_1');
	});

	it('update PATCHes the data map', async () => {
		respond({ status: 'success', data: [lead], page: PAGE });
		await invoke(Leads.update, {
			id: 'l_1',
			data: { first_name: 'Jane' },
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/leads/l_1', 'PATCH');
		expect(JSON.parse(sent.body as string)).toEqual({
			data: { first_name: 'Jane' },
		});
	});
});

describe('campaigns', () => {
	it('list GETs campaigns', async () => {
		respond({ status: 'success', data: [campaign], page: PAGE });
		await invoke(Campaigns.list, {});
		expectAuthenticated('/v1/campaigns');
	});

	it('create posts the campaign body', async () => {
		respond({ status: 'success', data: [campaign], page: PAGE });
		await invoke(Campaigns.create, { name: 'Q4 outbound' });
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			name: 'Q4 outbound',
		});
		expectAuthenticated('/v1/campaigns', 'POST');
	});

	it('duplicate posts the campaign id', async () => {
		respond({ status: 'success', data: [campaign], page: PAGE });
		await invoke(Campaigns.duplicate, {
			campaign_id: 'c_1',
			num_duplicates: 2,
		});
		expectAuthenticated('/v1/campaigns/duplicate', 'POST');
	});

	it('listLeads, addLead and removeLead manage membership', async () => {
		respond({ status: 'success', data: [lead], page: PAGE });
		await invoke(Campaigns.listLeads, { campaignId: 'c_1' });
		expectAuthenticated('/v1/campaigns/c_1/leads');

		respond({ status: 'success' });
		const added = (await invoke(Campaigns.addLead, {
			campaignId: 'c_1',
			lead_id: 'l_1',
		})) as { status: string };
		expect(added.status).toBe('success');
		expectAuthenticated('/v1/campaigns/c_1/leads', 'POST');
		expect(JSON.parse(lastRequest().body as string)).toEqual({
			lead_id: 'l_1',
		});

		respond({ status: 'success' });
		const removed = (await invoke(Campaigns.removeLead, {
			campaignId: 'c_1',
			leadId: 'l_1',
		})) as { leadId: string };
		expect(removed.leadId).toBe('l_1');
		expectAuthenticated('/v1/campaigns/c_1/leads/l_1', 'DELETE');
	});

	it('listReplies and replyToMessage call their RPCs', async () => {
		respond({ status: 'success', data: [reply], page: PAGE });
		await invoke(Campaigns.listReplies, { campaignId: 'c_1' });
		expectAuthenticated('/v1/campaigns/c_1/replies');

		respond({ status: 'success', data: [reply], page: PAGE });
		await invoke(Campaigns.replyToMessage, {
			campaignId: 'c_1',
			lead_id: 'l_1',
			message_id: 'm_1',
			reply_message: 'Thanks for the reply!',
		});
		expectAuthenticated('/v1/campaigns/c_1/replies', 'POST');
	});
});

describe('events, dnc and webhooks', () => {
	it('events.list passes the cursor', async () => {
		respond({
			status: 'success',
			data: [event],
			page: { has_more: true, next_page: 'cur2' },
		});
		await invoke(Events.list, { next_page: 'cur2' });
		expectAuthenticated('/v1/events');
	});

	it('dncDomains.list and create call their RPCs', async () => {
		respond({ status: 'success', data: [dncDomain], page: PAGE });
		await invoke(DncDomains.list, {});
		expectAuthenticated('/v1/dnc_domains');

		respond({ status: 'success' });
		const result = (await invoke(DncDomains.create, {
			domain: 'example.com',
		})) as { status: string };
		expect(result.status).toBe('success');
		expectAuthenticated('/v1/dnc_domains', 'POST');
	});

	it('webhook settings get and update call their RPCs', async () => {
		respond({ status: 'success', data: [webhookSettings], page: PAGE });
		const page = (await invoke(Webhooks.getSettings, {})) as {
			data: Array<{ enabled?: boolean }>;
		};
		expect(page.data[0]?.enabled).toBe(true);
		expectAuthenticated('/v1/webhook_plugin');

		respond({ status: 'success', data: [webhookSettings], page: PAGE });
		await invoke(Webhooks.updateSettings, {
			url: 'https://example.com/webhooks/persistiq',
			enabled: true,
		});
		expectAuthenticated('/v1/webhook_plugin', 'PUT');
	});
});
