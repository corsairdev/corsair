import { logEventFromContext } from 'corsair/core';
import {
	Accounts,
	Blocklist,
	Campaigns,
	Emails,
	LeadLists,
	Leads,
	Webhooks,
	Workspace,
} from './endpoints';
import {
	account,
	analyticsOverview,
	BLOCK_ID,
	backgroundJob,
	blocklistEntry,
	bulkAddResult,
	CAMPAIGN_ID,
	campaign,
	campaignAnalytics,
	EMAIL_ID,
	email,
	eventTypes,
	LEAD_ID,
	LIST_ID,
	lead,
	leadList,
	SENDER,
	schedule,
	sequences,
	stepAnalytics,
	THREAD_ID,
	WEBHOOK_ID,
	webhookSubscription,
	workspace,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'in-test-key';
const BASE = '/api/v2';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

type FakeContext = {
	key: string;
	options?: { webhookSecret?: string };
	keys?: { get_webhook_signature: () => Promise<string | null> };
	db?: Record<string, unknown>;
};

// unknown: negative cases pass values no schema accepts.
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	ctx: FakeContext = { key: API_KEY },
) {
	// The fake context only carries what the endpoints read.
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		search: parsed.searchParams,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

type Case = {
	operation: string;
	endpoint: AnyEndpoint;
	input: Record<string, unknown>;
	response: unknown;
	method: string;
	path: string;
	query?: Record<string, string>;
	// unknown: each case's request body is its own JSON.
	body?: unknown;
};

const page = <T>(items: T[]) => ({ items, next_starting_after: 'cursor-2' });

const cases: Case[] = [
	{
		operation: 'accounts.list',
		endpoint: Accounts.list,
		input: { limit: 10, status: 1, tag_ids: ['t1', 't2'] },
		response: page([account]),
		method: 'GET',
		path: '/accounts',
		query: { limit: '10', status: '1', tag_ids: 't1,t2' },
	},
	{
		operation: 'accounts.get',
		endpoint: Accounts.get,
		input: { email: SENDER },
		response: account,
		method: 'GET',
		path: `/accounts/${encodeURIComponent(SENDER)}`,
	},
	{
		operation: 'accounts.getWarmupAnalytics',
		endpoint: Accounts.getWarmupAnalytics,
		input: { emails: [SENDER] },
		response: {
			email_date_data: {},
			aggregate_data: { [SENDER]: { health_score: 100 } },
		},
		method: 'POST',
		path: '/accounts/warmup-analytics',
		body: { emails: [SENDER] },
	},
	{
		operation: 'accounts.pause',
		endpoint: Accounts.pause,
		input: { email: SENDER },
		response: { ...account, status: 2 },
		method: 'POST',
		path: `/accounts/${encodeURIComponent(SENDER)}/pause`,
	},
	{
		operation: 'accounts.resume',
		endpoint: Accounts.resume,
		input: { email: SENDER },
		response: account,
		method: 'POST',
		path: `/accounts/${encodeURIComponent(SENDER)}/resume`,
	},
	{
		operation: 'accounts.enableWarmup',
		endpoint: Accounts.enableWarmup,
		input: { emails: [SENDER] },
		response: backgroundJob,
		method: 'POST',
		path: '/accounts/warmup/enable',
		body: { emails: [SENDER] },
	},
	{
		operation: 'accounts.disableWarmup',
		endpoint: Accounts.disableWarmup,
		input: { emails: [SENDER] },
		response: backgroundJob,
		method: 'POST',
		path: '/accounts/warmup/disable',
		body: { emails: [SENDER] },
	},
	{
		operation: 'campaigns.list',
		endpoint: Campaigns.list,
		input: { search: 'Northeast', status: 1, starting_after: 'c-0' },
		response: page([campaign]),
		method: 'GET',
		path: '/campaigns',
		query: { search: 'Northeast', status: '1', starting_after: 'c-0' },
	},
	{
		operation: 'campaigns.get',
		endpoint: Campaigns.get,
		input: { id: CAMPAIGN_ID },
		response: campaign,
		method: 'GET',
		path: `/campaigns/${CAMPAIGN_ID}`,
	},
	{
		operation: 'campaigns.create',
		endpoint: Campaigns.create,
		input: {
			name: 'Northeast IT leads',
			campaign_schedule: schedule,
			sequences,
			email_list: [SENDER],
			daily_limit: 30,
			stop_on_reply: true,
			stop_for_company: true,
		},
		response: campaign,
		method: 'POST',
		path: '/campaigns',
		body: {
			name: 'Northeast IT leads',
			campaign_schedule: schedule,
			sequences,
			email_list: [SENDER],
			daily_limit: 30,
			stop_on_reply: true,
			stop_for_company: true,
		},
	},
	{
		operation: 'campaigns.update',
		endpoint: Campaigns.update,
		input: { id: CAMPAIGN_ID, daily_limit: 50, stop_on_auto_reply: true },
		response: { ...campaign, daily_limit: 50 },
		method: 'PATCH',
		path: `/campaigns/${CAMPAIGN_ID}`,
		body: { daily_limit: 50, stop_on_auto_reply: true },
	},
	{
		operation: 'campaigns.activate',
		endpoint: Campaigns.activate,
		input: { id: CAMPAIGN_ID },
		response: { ...campaign, status: 1 },
		method: 'POST',
		path: `/campaigns/${CAMPAIGN_ID}/activate`,
	},
	{
		operation: 'campaigns.pause',
		endpoint: Campaigns.pause,
		input: { id: CAMPAIGN_ID },
		response: { ...campaign, status: 2 },
		method: 'POST',
		path: `/campaigns/${CAMPAIGN_ID}/pause`,
	},
	{
		operation: 'campaigns.getAnalytics',
		endpoint: Campaigns.getAnalytics,
		input: { id: CAMPAIGN_ID, exclude_total_leads_count: true },
		response: [campaignAnalytics],
		method: 'GET',
		path: '/campaigns/analytics',
		query: { id: CAMPAIGN_ID, exclude_total_leads_count: 'true' },
	},
	{
		operation: 'campaigns.getAnalyticsOverview',
		endpoint: Campaigns.getAnalyticsOverview,
		input: { start_date: '2026-10-01', end_date: '2026-10-28' },
		response: analyticsOverview,
		method: 'GET',
		path: '/campaigns/analytics/overview',
		query: { start_date: '2026-10-01', end_date: '2026-10-28' },
	},
	{
		operation: 'campaigns.getStepAnalytics',
		endpoint: Campaigns.getStepAnalytics,
		input: { campaign_id: CAMPAIGN_ID, include_opportunities_count: true },
		response: stepAnalytics,
		method: 'GET',
		path: '/campaigns/analytics/steps',
		query: { campaign_id: CAMPAIGN_ID, include_opportunities_count: 'true' },
	},
	{
		operation: 'leads.list',
		endpoint: Leads.list,
		input: { campaign: CAMPAIGN_ID, filter: 'FILTER_VAL_REPLIED', limit: 50 },
		response: page([lead]),
		method: 'POST',
		path: '/leads/list',
		body: { campaign: CAMPAIGN_ID, filter: 'FILTER_VAL_REPLIED', limit: 50 },
	},
	{
		operation: 'leads.get',
		endpoint: Leads.get,
		input: { id: LEAD_ID },
		response: lead,
		method: 'GET',
		path: `/leads/${LEAD_ID}`,
	},
	{
		operation: 'leads.create',
		endpoint: Leads.create,
		input: {
			campaign: CAMPAIGN_ID,
			email: 'jordan@acme-logistics.com',
			first_name: 'Jordan',
			custom_variables: { pain_point: 'slow onboarding' },
		},
		response: lead,
		method: 'POST',
		path: '/leads',
		body: {
			campaign: CAMPAIGN_ID,
			email: 'jordan@acme-logistics.com',
			first_name: 'Jordan',
			custom_variables: { pain_point: 'slow onboarding' },
			skip_if_in_workspace: true,
		},
	},
	{
		operation: 'leads.addBulk',
		endpoint: Leads.addBulk,
		input: {
			campaign_id: CAMPAIGN_ID,
			leads: [
				{ email: 'jordan@acme-logistics.com', first_name: 'Jordan' },
				{ email: 'kim@acme-logistics.com' },
			],
		},
		response: bulkAddResult,
		method: 'POST',
		path: '/leads/add',
		body: {
			campaign_id: CAMPAIGN_ID,
			leads: [
				{ email: 'jordan@acme-logistics.com', first_name: 'Jordan' },
				{ email: 'kim@acme-logistics.com' },
			],
			skip_if_in_workspace: true,
		},
	},
	{
		operation: 'leads.update',
		endpoint: Leads.update,
		input: { id: LEAD_ID, job_title: 'CIO', custom_variables: { tier: 1 } },
		response: { ...lead, job_title: 'CIO' },
		method: 'PATCH',
		path: `/leads/${LEAD_ID}`,
		body: { job_title: 'CIO', custom_variables: { tier: 1 } },
	},
	{
		operation: 'leads.updateInterestStatus',
		endpoint: Leads.updateInterestStatus,
		input: {
			lead_email: 'jordan@acme-logistics.com',
			interest_value: 2,
			campaign_id: CAMPAIGN_ID,
		},
		response: {
			message: 'Lead interest status update background job submitted',
		},
		method: 'POST',
		path: '/leads/update-interest-status',
		body: {
			lead_email: 'jordan@acme-logistics.com',
			interest_value: 2,
			campaign_id: CAMPAIGN_ID,
		},
	},
	{
		operation: 'leads.delete',
		endpoint: Leads.remove,
		input: { id: LEAD_ID },
		response: lead,
		method: 'DELETE',
		path: `/leads/${LEAD_ID}`,
	},
	{
		operation: 'leadLists.list',
		endpoint: LeadLists.list,
		input: { search: 'Boston' },
		response: page([leadList]),
		method: 'GET',
		path: '/lead-lists',
		query: { search: 'Boston' },
	},
	{
		operation: 'leadLists.create',
		endpoint: LeadLists.create,
		input: { name: 'Boston IT directors' },
		response: leadList,
		method: 'POST',
		path: '/lead-lists',
		body: { name: 'Boston IT directors' },
	},
	{
		operation: 'emails.list',
		endpoint: Emails.list,
		input: {
			email_type: 'received',
			campaign_id: CAMPAIGN_ID,
			min_timestamp_created: '2026-10-28T00:00:00Z',
			limit: 20,
		},
		response: page([email]),
		method: 'GET',
		path: '/emails',
		query: {
			email_type: 'received',
			campaign_id: CAMPAIGN_ID,
			min_timestamp_created: '2026-10-28T00:00:00Z',
			limit: '20',
		},
	},
	{
		operation: 'emails.get',
		endpoint: Emails.get,
		input: { id: EMAIL_ID },
		response: email,
		method: 'GET',
		path: `/emails/${EMAIL_ID}`,
	},
	{
		operation: 'emails.reply',
		endpoint: Emails.reply,
		input: {
			reply_to_uuid: EMAIL_ID,
			eaccount: SENDER,
			subject: 'Re: Quick question, Jordan',
			body: { text: 'Tuesday 10am works.' },
		},
		response: { ...email, id: 'reply-1', ue_type: 3 },
		method: 'POST',
		path: '/emails/reply',
		body: {
			reply_to_uuid: EMAIL_ID,
			eaccount: SENDER,
			subject: 'Re: Quick question, Jordan',
			body: { text: 'Tuesday 10am works.' },
		},
	},
	{
		operation: 'emails.markThreadRead',
		endpoint: Emails.markThreadRead,
		input: { thread_id: THREAD_ID },
		response: { success: true },
		method: 'POST',
		path: `/emails/threads/${THREAD_ID}/mark-as-read`,
	},
	{
		operation: 'emails.countUnread',
		endpoint: Emails.countUnread,
		input: {},
		response: { count: 3 },
		method: 'GET',
		path: '/emails/unread/count',
	},
	{
		operation: 'blocklist.list',
		endpoint: Blocklist.list,
		input: { domains_only: true },
		response: page([blocklistEntry]),
		method: 'GET',
		path: '/block-lists-entries',
		query: { domains_only: 'true' },
	},
	{
		operation: 'blocklist.add',
		endpoint: Blocklist.add,
		input: { bl_value: 'competitor.com' },
		response: blocklistEntry,
		method: 'POST',
		path: '/block-lists-entries',
		body: { bl_value: 'competitor.com' },
	},
	{
		operation: 'blocklist.remove',
		endpoint: Blocklist.remove,
		input: { id: BLOCK_ID },
		response: blocklistEntry,
		method: 'DELETE',
		path: `/block-lists-entries/${BLOCK_ID}`,
	},
	{
		operation: 'webhooks.list',
		endpoint: Webhooks.list,
		input: { event_type: 'reply_received' },
		response: page([webhookSubscription]),
		method: 'GET',
		path: '/webhooks',
		query: { event_type: 'reply_received' },
	},
	{
		operation: 'webhooks.create',
		endpoint: Webhooks.create,
		input: {
			target_hook_url: 'https://app.example.com/api/webhook',
			event_type: 'reply_received',
			attach_secret: false,
		},
		response: { ...webhookSubscription, headers: null },
		method: 'POST',
		path: '/webhooks',
		body: {
			target_hook_url: 'https://app.example.com/api/webhook',
			event_type: 'reply_received',
		},
	},
	{
		operation: 'webhooks.delete',
		endpoint: Webhooks.remove,
		input: { id: WEBHOOK_ID },
		response: webhookSubscription,
		method: 'DELETE',
		path: `/webhooks/${WEBHOOK_ID}`,
	},
	{
		operation: 'webhooks.listEventTypes',
		endpoint: Webhooks.listEventTypes,
		input: {},
		response: eventTypes,
		method: 'GET',
		path: '/webhooks/event-types',
	},
	{
		operation: 'workspace.get',
		endpoint: Workspace.get,
		input: {},
		response: workspace,
		method: 'GET',
		path: '/workspaces/current',
	},
];

describe('Instantly endpoints', () => {
	it('covers every operation once', () => {
		expect(new Set(cases.map((c) => c.operation)).size).toBe(38);
	});

	it.each(cases)(
		'$operation sends $method $path',
		async ({
			operation,
			endpoint,
			input,
			response,
			method,
			path,
			query,
			body,
		}) => {
			respond(response);

			const result = await invoke(endpoint, input);

			const sent = lastRequest();
			expect(sent.method).toBe(method);
			expect(sent.path).toBe(`${BASE}${path}`);
			expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
			if (query) expect(sent.query).toEqual(query);
			expect(sent.body).toEqual(body);
			expect(result).toBeDefined();
			expect(mockLog).toHaveBeenCalledWith(
				expect.anything(),
				`instantly.${operation}`,
				expect.any(Object),
				'completed',
			);
		},
	);
});

describe('input validation', () => {
	// unknown: each case passes an input its schema must reject.
	const rejected: [string, AnyEndpoint, unknown][] = [
		['a campaign id that is empty', Campaigns.get, { id: '' }],
		['limit over 100', Leads.list, { limit: 500 }],
		[
			'both campaign_id and list_id',
			Leads.addBulk,
			{
				campaign_id: CAMPAIGN_ID,
				list_id: LIST_ID,
				leads: [{ email: 'a@b.co' }],
			},
		],
		[
			'neither campaign_id nor list_id',
			Leads.addBulk,
			{ leads: [{ email: 'a@b.co' }] },
		],
		[
			'a campaign lead without an email',
			Leads.addBulk,
			{ campaign_id: CAMPAIGN_ID, leads: [{ first_name: 'Jo' }] },
		],
		[
			'more than 1,000 leads',
			Leads.addBulk,
			{
				campaign_id: CAMPAIGN_ID,
				leads: Array.from({ length: 1001 }, (_, i) => ({
					email: `l${i}@acme.com`,
				})),
			},
		],
		[
			"a time zone with no exact match on Instantly's list (Pacific)",
			Campaigns.create,
			{
				name: 'x',
				campaign_schedule: {
					schedules: [
						{ ...schedule.schedules[0], timezone: 'America/Los_Angeles' },
					],
				},
			},
		],
		[
			'a schedule time that is not HH:MM',
			Campaigns.create,
			{
				name: 'x',
				campaign_schedule: {
					schedules: [
						{ ...schedule.schedules[0], timing: { from: '9am', to: '17:00' } },
					],
				},
			},
		],
		[
			'two sequences (Instantly reads only the first)',
			Campaigns.create,
			{
				name: 'x',
				campaign_schedule: schedule,
				sequences: [...sequences, ...sequences],
			},
		],
		[
			'a reply without a body',
			Emails.reply,
			{ reply_to_uuid: EMAIL_ID, eaccount: SENDER, subject: 'Re', body: {} },
		],
		[
			'a webhook URL that is not http(s)',
			Webhooks.create,
			{ target_hook_url: 'ftp://example.com', event_type: 'reply_received' },
		],
		[
			'more than 100 warmup accounts',
			Accounts.enableWarmup,
			{
				emails: Array.from({ length: 101 }, (_, i) => `a${i}@x.com`),
			},
		],
	];

	it.each(rejected)(
		'rejects %s before calling Instantly',
		async (_, endpoint, input) => {
			await expect(invoke(endpoint, input)).rejects.toMatchObject({
				name: 'ZodError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('lead safeguards', () => {
	it('skips leads already in the workspace unless told otherwise', async () => {
		respond(bulkAddResult);
		await invoke(Leads.addBulk, {
			list_id: LIST_ID,
			leads: [{ first_name: 'Jo', last_name: 'Park' }],
		});
		expect(lastRequest().body).toMatchObject({ skip_if_in_workspace: true });

		respond(bulkAddResult);
		await invoke(Leads.addBulk, {
			list_id: LIST_ID,
			leads: [{ email: 'jo@acme.com' }],
			skip_if_in_workspace: false,
		});
		expect(lastRequest().body).toMatchObject({ skip_if_in_workspace: false });
	});

	it('does not send a lead status: it is read-only', async () => {
		respond(lead);
		await invoke(Leads.update, { id: LEAD_ID, status: 3, first_name: 'Jo' });
		expect(lastRequest().body).toEqual({ first_name: 'Jo' });
	});

	it('logs counts, not lead emails, for a bulk add', async () => {
		respond(bulkAddResult);
		await invoke(Leads.addBulk, {
			campaign_id: CAMPAIGN_ID,
			leads: [{ email: 'jordan@acme-logistics.com' }],
		});
		const payload = mockLog.mock.calls.at(-1)?.[2];
		expect(payload).toEqual({
			campaignId: CAMPAIGN_ID,
			listId: undefined,
			sent: 1,
			uploaded: 1,
			skipped: 1,
			remainingInPlan: 998,
		});
		expect(JSON.stringify(payload)).not.toContain('@');
	});

	it('passes a null interest value to reset a lead', async () => {
		respond({ message: 'ok' });
		await invoke(Leads.updateInterestStatus, {
			lead_email: 'jordan@acme-logistics.com',
			interest_value: null,
		});
		expect(lastRequest().body).toEqual({
			lead_email: 'jordan@acme-logistics.com',
			interest_value: null,
		});
	});
});

describe('campaign time zones', () => {
	const scheduleIn = (timezone: string) => ({
		schedules: [{ ...schedule.schedules[0], timezone }],
	});

	function sentTimezone() {
		const body = lastRequest().body as {
			campaign_schedule: { schedules: { timezone: string }[] };
		};
		return body.campaign_schedule.schedules[0]?.timezone;
	}

	it('sends America/New_York as America/Detroit on create', async () => {
		respond(campaign);
		await invoke(Campaigns.create, {
			name: 'East Coast IT',
			campaign_schedule: scheduleIn('America/New_York'),
		});
		expect(sentTimezone()).toBe('America/Detroit');
	});

	it('maps an alias in an updated schedule and keeps listed zones', async () => {
		respond(campaign);
		await invoke(Campaigns.update, {
			id: CAMPAIGN_ID,
			campaign_schedule: {
				schedules: [
					{ ...schedule.schedules[0], timezone: 'Europe/London' },
					{
						...schedule.schedules[0],
						name: 'Chicago',
						timezone: 'America/Chicago',
					},
				],
			},
		});
		const body = lastRequest().body as {
			campaign_schedule: { schedules: { timezone: string }[] };
		};
		expect(body.campaign_schedule.schedules.map((s) => s.timezone)).toEqual([
			'Europe/Isle_of_Man',
			'America/Chicago',
		]);
	});

	it('leaves the schedule out of an update that does not change it', async () => {
		respond(campaign);
		await invoke(Campaigns.update, { id: CAMPAIGN_ID, daily_limit: 40 });
		expect(lastRequest().body).toEqual({ daily_limit: 40 });
	});

	it('explains why Pacific time is rejected', async () => {
		await expect(
			invoke(Campaigns.create, {
				name: 'West Coast',
				campaign_schedule: scheduleIn('America/Los_Angeles'),
			}),
		).rejects.toThrow(/America\/Dawson stays at UTC-7/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('request and response shapes', () => {
	it('repeats ids for multi-campaign analytics', async () => {
		respond([campaignAnalytics]);
		await invoke(Campaigns.getAnalytics, { ids: ['c-1', 'c-2'] });
		expect(lastRequest().search.getAll('ids')).toEqual(['c-1', 'c-2']);
	});

	it('returns the sent reply even when Instantly omits fields', async () => {
		respond({ id: 'reply-1' });
		const result = await invoke(Emails.reply, {
			reply_to_uuid: EMAIL_ID,
			eaccount: SENDER,
			subject: 'Re',
			body: { html: '<p>Hi</p>' },
		});
		expect(result).toEqual({ id: 'reply-1' });
	});
});

describe('webhook subscriptions', () => {
	const target = {
		target_hook_url: 'https://app.example.com/api/webhook',
		event_type: 'all_events',
	};

	it('attaches the stored webhook secret and redacts it in the result', async () => {
		respond(webhookSubscription);
		const ctx: FakeContext = {
			key: API_KEY,
			keys: { get_webhook_signature: async () => 'stored-secret' },
		};

		const result = await invoke(Webhooks.create, target, ctx);

		expect(lastRequest().body).toEqual({
			...target,
			headers: { 'x-corsair-webhook-secret': 'stored-secret' },
		});
		expect(result).toMatchObject({
			headers: { 'x-corsair-webhook-secret': '[redacted]' },
		});
		expect(JSON.stringify(result)).not.toContain('whsec-live-value');
	});

	it('prefers the webhookSecret option and keeps caller headers', async () => {
		respond(webhookSubscription);
		await invoke(
			Webhooks.create,
			{ ...target, headers: { 'x-team': 'growth' } },
			{ key: API_KEY, options: { webhookSecret: 'option-secret' } },
		);
		expect(lastRequest().body).toMatchObject({
			headers: {
				'x-team': 'growth',
				'x-corsair-webhook-secret': 'option-secret',
			},
		});
	});

	it('refuses to create a webhook Corsair could not verify', async () => {
		await expect(
			invoke(Webhooks.create, target, {
				key: API_KEY,
				keys: { get_webhook_signature: async () => null },
			}),
		).rejects.toThrow(/No Instantly webhook secret/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('redacts header values when listing and deleting', async () => {
		respond(page([webhookSubscription]));
		const listed = await invoke(Webhooks.list, {});
		expect(JSON.stringify(listed)).not.toContain('whsec-live-value');

		respond(webhookSubscription);
		const deleted = await invoke(Webhooks.remove, { id: WEBHOOK_ID });
		expect(JSON.stringify(deleted)).not.toContain('whsec-live-value');
	});
});

describe('local copies', () => {
	function fakeStore() {
		return {
			upsertByEntityId: jest.fn().mockResolvedValue({ id: 'row' }),
			deleteByEntityId: jest.fn().mockResolvedValue(true),
		};
	}

	it('stores listed leads, campaigns, accounts and emails', async () => {
		const db = {
			leads: fakeStore(),
			campaigns: fakeStore(),
			accounts: fakeStore(),
			emails: fakeStore(),
		};
		const ctx = { key: API_KEY, db };

		respond(page([lead]));
		await invoke(Leads.list, {}, ctx);
		expect(db.leads.upsertByEntityId).toHaveBeenCalledWith(
			LEAD_ID,
			expect.objectContaining({ id: LEAD_ID, email: lead.email }),
		);

		respond(campaign);
		await invoke(Campaigns.get, { id: CAMPAIGN_ID }, ctx);
		expect(db.campaigns.upsertByEntityId).toHaveBeenCalledWith(
			CAMPAIGN_ID,
			expect.objectContaining({ name: 'Northeast IT leads' }),
		);

		respond(page([account]));
		await invoke(Accounts.list, {}, ctx);
		expect(db.accounts.upsertByEntityId).toHaveBeenCalledWith(
			SENDER,
			expect.objectContaining({ id: SENDER }),
		);

		respond(page([email]));
		await invoke(Emails.list, { email_type: 'received' }, ctx);
		expect(db.emails.upsertByEntityId).toHaveBeenCalledWith(
			EMAIL_ID,
			expect.objectContaining({ thread_id: THREAD_ID }),
		);
	});

	it('removes a deleted lead', async () => {
		const db = { leads: fakeStore() };
		respond(lead);
		await invoke(Leads.remove, { id: LEAD_ID }, { key: API_KEY, db });
		expect(db.leads.deleteByEntityId).toHaveBeenCalledWith(LEAD_ID);
	});

	it('still returns the result when the local write fails', async () => {
		const store = fakeStore();
		store.upsertByEntityId.mockRejectedValueOnce(new Error('disk full'));
		respond(lead);
		const result = await invoke(
			Leads.get,
			{ id: LEAD_ID },
			{ key: API_KEY, db: { leads: store } },
		);
		expect(result).toMatchObject({ id: LEAD_ID });
	});
});

describe('writes never fail after Instantly accepted them', () => {
	it('returns an unexpected bulk-add response with a parse_warning instead of throwing', async () => {
		respond({
			...bulkAddResult,
			created_leads: [
				{ index: 0, id: 12345, email: 'jordan@acme-logistics.com' },
			],
			leads_uploaded: '1',
		});

		const result = await invoke(Leads.addBulk, {
			campaign_id: CAMPAIGN_ID,
			leads: [{ email: 'jordan@acme-logistics.com' }],
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(result).toMatchObject({
			leads_uploaded: '1',
			created_leads: [{ id: 12345 }],
			parse_warning: expect.stringMatching(/do not repeat it/),
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'instantly.leads.addBulk',
			{ parseWarning: true },
			'completed',
		);
	});

	it('wraps a non-object create response', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('created', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		const result = await invoke(Leads.create, {
			campaign: CAMPAIGN_ID,
			email: 'jordan@acme-logistics.com',
		});

		expect(result).toMatchObject({
			body: 'created',
			parse_warning: expect.any(String),
		});
	});

	it('returns a sent reply whose response does not match, without retrying', async () => {
		respond({ id: 98765, ue_type: 'sent' });

		const result = await invoke(Emails.reply, {
			reply_to_uuid: EMAIL_ID,
			eaccount: SENDER,
			subject: 'Re',
			body: { text: 'Tuesday works.' },
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(result).toMatchObject({
			id: 98765,
			parse_warning: expect.any(String),
		});
	});

	it('still redacts webhook headers in an unverified create response', async () => {
		respond({ ...webhookSubscription, status: 'active' });

		const result = await invoke(
			Webhooks.create,
			{
				target_hook_url: 'https://app.example.com/api/webhook',
				event_type: 'all_events',
			},
			{ key: API_KEY, options: { webhookSecret: 'option-secret' } },
		);

		expect(result).toMatchObject({ parse_warning: expect.any(String) });
		expect(JSON.stringify(result)).not.toContain('whsec-live-value');
	});

	it('still throws when a read comes back in the wrong shape', async () => {
		respond({ email: 'no id here' });
		await expect(invoke(Leads.get, { id: LEAD_ID })).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('returns a write result when the event log fails', async () => {
		mockLog.mockRejectedValueOnce(new Error('encryptDataAtRest requires kek'));
		respond({ ...email, id: 'reply-1' });

		const result = await invoke(Emails.reply, {
			reply_to_uuid: EMAIL_ID,
			eaccount: SENDER,
			subject: 'Re',
			body: { text: 'Tuesday works.' },
		});

		expect(result).toMatchObject({ id: 'reply-1' });
	});
});

describe('local copies are written concurrently', () => {
	it('tries every row and keeps the list when one write fails', async () => {
		const upsert = jest.fn().mockResolvedValue({ id: 'row' });
		upsert.mockRejectedValueOnce(new Error('disk full'));
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const leads = ['a', 'b', 'c'].map((id) => ({ ...lead, id }));
		respond({ items: leads });

		const result = await invoke(
			Leads.list,
			{},
			{ key: API_KEY, db: { leads: { upsertByEntityId: upsert } } },
		);

		expect(upsert).toHaveBeenCalledTimes(3);
		expect(result).toMatchObject({
			items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
		});
		expect(warn).toHaveBeenCalledWith(
			'Failed to save 1 of 3 Instantly leads:',
			expect.any(Error),
		);
	});
});

describe('webhook secret on create', () => {
	it('sends the trimmed secret', async () => {
		respond(webhookSubscription);
		await invoke(
			Webhooks.create,
			{
				target_hook_url: 'https://app.example.com/api/webhook',
				event_type: 'reply_received',
			},
			{
				key: API_KEY,
				keys: { get_webhook_signature: async () => ' stored-secret\n' },
			},
		);
		expect(lastRequest().body).toMatchObject({
			headers: { 'x-corsair-webhook-secret': 'stored-secret' },
		});
	});
});
