import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import * as client from './client';
import {
	Account,
	ApiKeys,
	Briefing,
	Companies,
	CompanyLists,
	DomainSearch,
	Leads,
	LeadsLists,
	Messages,
	MonitoredSignals,
	Opportunities,
	Sequences,
	Signals,
	Webhooks,
} from './endpoints';
import { toBracketQuery } from './endpoints/query';
import type { HunterioContext } from './index';
import { hunterio, hunterioAuthConfig, hunterioEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeHunterioRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHunterioRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Account.get>[0];

function buildCtx(): Ctx {
	const ctx: HunterioContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

// Fixtures mirror the v2 response envelopes documented at
// https://hunter.io/api-documentation/v2 (account §2, leads §5, sequences §7,
// webhooks §10).

describe('account.get', () => {
	it('fetches the account and returns the parsed envelope', async () => {
		const mockResponse = {
			data: {
				email: 'owner@example.com',
				plan_name: 'Starter',
				requests: { credits: { used: 1, available: 49 } },
			},
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Account.get(ctx, {});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/account', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.account.get',
			{},
			'completed',
		);
	});
});

describe('leads.list', () => {
	it('flattens nested filters into PHP bracket query keys', async () => {
		const mockResponse = {
			data: { leads: [{ id: 1, email: 'jane@example.com' }] },
			meta: { total: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Leads.list(ctx, {
			location: { country: { include: ['US'] } },
			sending_status: ['sent'],
			limit: 10,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/leads', 'test-api-key', {
			method: 'GET',
			query: {
				'location[country][include][]': ['US'],
				'sending_status[]': ['sent'],
				limit: 10,
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.leads.list',
			{ count: 1 },
			'completed',
		);
	});

	it('never logs lead email addresses', async () => {
		mockedRequest.mockResolvedValue({
			data: { leads: [{ id: 1, email: 'jane@example.com' }] },
		});

		await Leads.list(ctx, {});

		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(payload).toEqual({ count: 1 });
		expect(JSON.stringify(payload)).not.toContain('jane@example.com');
	});
});

describe('messages.send', () => {
	it('posts the message body and logs no recipient data', async () => {
		const mockResponse = {
			data: { id: 42, status: 'sent', message_id: 'msg-1' },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Messages.send(ctx, {
			email_account_id: 1,
			to: 'jane@example.com',
			subject: 'Intro',
			body: 'Hello there',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/messages', 'test-api-key', {
			method: 'POST',
			body: {
				email_account_id: 1,
				to: 'jane@example.com',
				subject: 'Intro',
				body: 'Hello there',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.messages.send',
			{},
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('jane@example.com');
	});

	it('rejects a message without to or lead_id before calling the API', async () => {
		await expect(
			Messages.send(ctx, {
				email_account_id: 1,
				subject: 'Intro',
				body: 'Hello there',
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('sequences.start', () => {
	it('posts the start action and logs the sequence id', async () => {
		const mockResponse = {
			status: 'success',
			data: { message: 'Sequence started', recipients_count: 3 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sequences.start(ctx, { id: 7 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sequences/7/start',
			'test-api-key',
			{ method: 'POST' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.sequences.start',
			{ id: 7 },
			'completed',
		);
	});
});

describe('webhooks.create', () => {
	it('creates a webhook with a valid target url', async () => {
		const mockResponse = {
			data: {
				id: 9,
				target_url: 'https://example.com/hooks/hunter',
				event: 'lead.created',
			},
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Webhooks.create(ctx, {
			target_url: 'https://example.com/hooks/hunter',
			event: 'lead.created',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/webhooks', 'test-api-key', {
			method: 'POST',
			body: {
				target_url: 'https://example.com/hooks/hunter',
				event: 'lead.created',
			},
		});
	});

	it('rejects a malformed target url before calling the API', async () => {
		await expect(
			Webhooks.create(ctx, {
				target_url: 'not-a-valid-url',
				event: 'lead.created',
			}),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('destructive endpoint operations', () => {
	it('leads.delete deletes a lead permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Leads.delete(ctx, { id: 10 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/leads/10', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.leads.delete',
			{ id: 10 },
			'completed',
		);
	});

	it('leads.bulkDelete deletes leads in bulk permanently', async () => {
		const mockResponse = { data: { deleted: 2 } };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Leads.bulkDelete(ctx, { lead_ids: [1, 2] });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/leads/bulk/delete',
			'test-api-key',
			{
				method: 'POST',
				body: { lead_ids: [1, 2] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.leads.bulkDelete',
			{ leadCount: 2 },
			'completed',
		);
	});

	it('companies.bulkDelete deletes companies in bulk permanently', async () => {
		const mockResponse = { data: { deleted: 2 } };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Companies.bulkDelete(ctx, { company_ids: [1, 2] });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/companies/bulk/delete',
			'test-api-key',
			{
				method: 'POST',
				body: { company_ids: [1, 2] },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.companies.bulkDelete',
			{ companyCount: 2 },
			'completed',
		);
	});

	it('webhooks.delete deletes a webhook permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Webhooks.delete(ctx, { id: 44 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/webhooks/44', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.webhooks.delete',
			{ id: 44 },
			'completed',
		);
	});

	it('webhooks.deleteLegacy deletes a webhook permanently via legacy query parameter', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Webhooks.deleteLegacy(ctx, { id: 44 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/webhooks', 'test-api-key', {
			method: 'DELETE',
			query: { id: 44 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.webhooks.deleteLegacy',
			{ id: 44 },
			'completed',
		);
	});

	it('sequences.delete deletes a sequence permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Sequences.delete(ctx, { id: 12 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith(
			'/sequences/12',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.sequences.delete',
			{ id: 12 },
			'completed',
		);
	});

	it('companies.delete deletes a company permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await Companies.delete(ctx, { id: 5 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/companies/5', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.companies.delete',
			{ id: 5 },
			'completed',
		);
	});

	it('apiKeys.delete deletes an api key permanently', async () => {
		mockedRequest.mockResolvedValue(undefined);

		const result = await ApiKeys.delete(ctx, { id: 2 });

		expect(result).toBeUndefined();
		expect(mockedRequest).toHaveBeenCalledWith('/api-keys/2', 'test-api-key', {
			method: 'DELETE',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.apiKeys.delete',
			{ id: 2 },
			'completed',
		);
	});
});

// Fixtures copied from the response examples at
// https://hunter.io/api-documentation/v2#briefing, #signals,
// #monitored-signals, #opportunities and #opportunity-results.
const NEXT_CALL_SIGNALS = {
	endpoint: 'GET /v2/signals',
	params: { source: 'leads', since: '2026-10-29T09:00:00.000000Z', limit: 100 },
	mcp_tool: 'List-Signals',
	charges_credits: false,
};

const BRIEFING_FIXTURE = {
	data: {
		needs_attention: {
			items: [
				{
					type: 'lead_signals',
					status: 'ok',
					reason: null,
					count: 12,
					count_exact: true,
					next_call: NEXT_CALL_SIGNALS,
					next_since: '2026-11-03T21:00:00.000000Z',
				},
				{
					type: 'monitored_signals',
					status: 'unavailable',
					reason: null,
					count: null,
					count_exact: null,
					next_call: null,
					next_since: '2026-10-29T09:00:00.000000Z',
				},
			],
		},
		new_this_week: {
			items: [
				{
					type: 'opportunities',
					status: 'no_access',
					reason: 'no_opportunities_access',
					count: null,
					count_exact: null,
					next_call: null,
					next_since: null,
				},
			],
		},
		account: {
			status: 'ok',
			plan_name: 'Growth',
			plan_level: 2,
			reset_date: '2026-11-21',
			requests: {
				credits: { used: 120, available: 5000, remaining: 4880 },
				searches: { used: 100, available: 5000, remaining: 4900 },
				verifications: { used: 40, available: 10000, remaining: 9960 },
			},
			next_call: {
				endpoint: 'GET /v2/account',
				params: {},
				mcp_tool: 'Get-Account-Details',
				charges_credits: false,
			},
		},
	},
	meta: {
		since: '2026-10-29T09:00:00.000000Z',
		next_since: '2026-10-29T09:00:00.000000Z',
	},
};

const SIGNALS_FIXTURE = {
	data: [
		{
			id: 'evt_1',
			source: 'leads',
			type: 'funding_round',
			occurred_at: '2026-11-02T10:00:00Z',
			company: { domain: 'example.com', name: null },
			details: {
				round_type: 'series_a',
				amount_usd: null,
				announced_on: '2026-11-02',
			},
			signal_id: null,
			next_call: {
				endpoint: 'GET /v2/domain-search',
				params: { domain: 'example.com' },
				mcp_tool: 'Domain-Search',
				charges_credits: true,
			},
		},
	],
	meta: {
		limit: 20,
		next_cursor: null,
		next_since: '2026-11-03T21:00:00Z',
		window_start: '2026-10-22T21:00:00Z',
	},
};

const MONITORED_SIGNALS_FIXTURE = {
	data: [
		{
			id: 123,
			name: 'Series A in fintech',
			type: 'funding_rounds',
			status: 'active',
			filters: {
				countries: ['FR'],
				series: ['series_a'],
				published_date: '1m',
			},
			event_types: ['funding_round'],
			created_at: '2026-09-01T10:00:00Z',
		},
	],
	meta: { total: 1, limit: 20, offset: 0 },
};

const OPPORTUNITIES_FIXTURE = {
	data: [
		{
			id: 812345,
			type: 'people',
			source: 'leads',
			description:
				'Chief Financial Officers at software companies in Germany are recommended based on your saved leads.',
			results_count: 174,
			score: 92,
			seen_at: null,
			created_at: '2026-11-02T06:14:09Z',
			next_call: {
				endpoint: 'GET /v2/opportunities/812345/results',
				params: {},
				mcp_tool: 'Get-Opportunity-Results',
				charges_credits: false,
			},
		},
	],
	meta: { results: 1, limit: 20, offset: 0 },
};

const OPPORTUNITY_RESULTS_FIXTURE = {
	data: [
		{
			name: 'Ada L.',
			position: 'Chief Financial Officer',
			department: 'finance',
			seniority: 'executive',
			type: 'personal',
			provenance: 'found',
			decision_maker: true,
			domain: 'example.com',
			company_name: 'example',
			full_name_exists: true,
			phone_number_exists: false,
			verification: { date: null, status: 'valid' },
			reveal_handle: 'aAKWnmY9z-P8kCj6sBQjZ8yiYnNSMKb0',
		},
	],
	meta: { type: 'people', results: 174, limit: 20, offset: 0 },
};

describe('briefing, signals and opportunities', () => {
	it('briefing.get sends the since filters as query parameters', async () => {
		mockedRequest.mockResolvedValue(BRIEFING_FIXTURE);

		const result = await Briefing.get(ctx, {
			since: '2026-11-01T00:00:00Z',
			leads_since: '2026-11-02T00:00:00Z',
		});

		expect(result.data.needs_attention.items[0]?.count).toBe(12);
		expect(result.data.new_this_week.items[0]?.status).toBe('no_access');
		expect(mockedRequest).toHaveBeenCalledWith('/briefing', 'test-api-key', {
			method: 'GET',
			query: {
				since: '2026-11-01T00:00:00Z',
				leads_since: '2026-11-02T00:00:00Z',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.briefing.get',
			{},
			'completed',
		);
	});

	it('signals.list requires a source and pages by cursor', async () => {
		mockedRequest.mockResolvedValue(SIGNALS_FIXTURE);

		const result = await Signals.list(ctx, {
			source: 'monitored',
			signal_id: 123,
			types: ['funding_round', 'job_posted'],
			cursor: 'abc',
		});

		expect(result.data[0]?.company.domain).toBe('example.com');
		expect(result.meta.next_cursor).toBeNull();
		expect(mockedRequest).toHaveBeenCalledWith('/signals', 'test-api-key', {
			method: 'GET',
			query: {
				source: 'monitored',
				signal_id: 123,
				types: ['funding_round', 'job_posted'],
				cursor: 'abc',
			},
		});
		await expect(
			Signals.list(ctx, {} as Parameters<typeof Signals.list>[1]),
		).rejects.toThrow();
		await expect(
			Signals.list(ctx, {
				source: 'leads',
				types: ['not_a_type'],
			} as unknown as Parameters<typeof Signals.list>[1]),
		).rejects.toThrow();
	});

	it('monitoredSignals.list pages with limit and offset', async () => {
		mockedRequest.mockResolvedValue(MONITORED_SIGNALS_FIXTURE);

		const result = await MonitoredSignals.list(ctx, { limit: 50, offset: 20 });

		expect(result.data[0]?.type).toBe('funding_rounds');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/monitored-signals',
			'test-api-key',
			{ method: 'GET', query: { limit: 50, offset: 20 } },
		);
	});

	it('opportunities.results puts the id in the path, not the query', async () => {
		mockedRequest.mockResolvedValue(OPPORTUNITY_RESULTS_FIXTURE);

		const result = await Opportunities.results(ctx, { id: 812345, limit: 5 });

		expect(result.meta.type).toBe('people');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/opportunities/812345/results',
			'test-api-key',
			{ method: 'GET', query: { limit: 5 } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hunterio.opportunities.results',
			{ id: 812345 },
			'completed',
		);
	});

	it('opportunities.list parses the documented example', async () => {
		mockedRequest.mockResolvedValue(OPPORTUNITIES_FIXTURE);

		const result = await Opportunities.list(ctx, {});

		expect(result.data[0]?.next_call.charges_credits).toBe(false);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/opportunities',
			'test-api-key',
			{ method: 'GET', query: {} },
		);
	});
});

describe('leads.list with an auto-saved lead', () => {
	it('parses a lead that sits in no list (all-null leads_list)', async () => {
		mockedRequest.mockResolvedValue({
			data: {
				leads: [
					{
						id: 458491747,
						email: 'saved@example.com',
						leads_list: { id: null, name: null, leads_count: null },
					},
				],
			},
			meta: { count: 1, total: 1 },
		});

		const result = await Leads.list(ctx, { email: 'saved@example.com' });

		expect(result.data.leads[0]?.leads_list?.id).toBeNull();
	});
});

describe('company list companies, domain search found, leads list merge', () => {
	it('companyLists.listCompanies reads one static list', async () => {
		mockedRequest.mockResolvedValue({
			data: [{ id: 84, domain: 'example.com', organization: 'Example' }],
			meta: { results: 1, limit: 20, offset: 0 },
		});

		const result = await CompanyLists.listCompanies(ctx, {
			company_list_id: 1,
			limit: 100,
		});

		expect(result.data[0]?.domain).toBe('example.com');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/company-lists/1/companies',
			'test-api-key',
			{ method: 'GET', query: { limit: 100 } },
		);
		await expect(
			CompanyLists.listCompanies(ctx, { company_list_id: 1, limit: 101 }),
		).rejects.toThrow();
	});

	it('domainSearch.found and foundPost call /domain-search/found', async () => {
		mockedRequest.mockResolvedValue({
			data: { domain: 'stripe.com', emails: [] },
		});

		await DomainSearch.found(ctx, { domain: 'stripe.com', limit: 1 });
		await DomainSearch.foundPost(ctx, {
			domain: 'stripe.com',
			location: { include: [{ country: 'US' }] },
		});

		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/domain-search/found',
			'test-api-key',
			{ method: 'GET', query: { domain: 'stripe.com', limit: 1 } },
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/domain-search/found',
			'test-api-key',
			{
				method: 'POST',
				body: {
					domain: 'stripe.com',
					location: { include: [{ country: 'US' }] },
				},
			},
		);
	});

	it('leadsLists.merge sends the destination list in the body', async () => {
		mockedRequest.mockResolvedValue(undefined);

		await LeadsLists.merge(ctx, { id: 10, destination_leads_list_id: 20 });

		expect(mockedRequest).toHaveBeenCalledWith(
			'/leads_lists/10/merge',
			'test-api-key',
			{ method: 'POST', body: { destination_leads_list_id: 20 } },
		);
		await expect(
			LeadsLists.merge(ctx, { id: 10 } as Parameters<
				typeof LeadsLists.merge
			>[1]),
		).rejects.toThrow();
	});
});

describe('risk levels', () => {
	const meta = hunterio({ key: 'k' }).endpointMeta as unknown as Record<
		string,
		{ riskLevel: string }
	>;

	it.each([
		'domainSearch.search',
		'domainSearch.searchPost',
		'domainSearch.found',
		'domainSearch.foundPost',
		'emailFinder.find',
		'emailFinder.findFound',
		'emailFinder.findFoundPost',
		'emailVerifier.verify',
		'enrichment.person',
		'enrichment.company',
		'enrichment.combined',
		'multiDomainSearch.reveal',
		'messages.send',
		'sequences.start',
		'sequences.test',
	])('%s spends credits or sends email, so it is destructive', (key) => {
		expect(meta[key]?.riskLevel).toBe('destructive');
	});

	it.each([
		'briefing.get',
		'signals.list',
		'monitoredSignals.list',
		'opportunities.list',
		'opportunities.results',
		'companyLists.listCompanies',
		'multiDomainSearch.search',
		'discover.companies',
	])('%s is free and read-only', (key) => {
		expect(meta[key]?.riskLevel).toBe('read');
	});
});

describe('toBracketQuery', () => {
	it('flattens nested objects and array values into bracket keys', () => {
		expect(
			toBracketQuery({
				location: { country: { include: ['US', 'CA'] } },
				sending_status: ['sent'],
				limit: 10,
				missing: undefined,
			}),
		).toEqual({
			'location[country][include][]': ['US', 'CA'],
			'sending_status[]': ['sent'],
			limit: 10,
		});
	});

	it('recurses through object arrays with explicit indexes so each location stays together', () => {
		expect(
			toBracketQuery({
				headquarters_location: {
					include: [{ country: 'US', city: 'Boston' }],
				},
			}),
		).toEqual({
			'headquarters_location[include][0][country]': 'US',
			'headquarters_location[include][0][city]': 'Boston',
		});
	});
});

describe('hunterio plugin shape', () => {
	it('exposes the nested endpoint tree, auth config, and empty webhooks', () => {
		const plugin = hunterio({ key: 'test-key' });

		expect(plugin.endpoints?.account.get).toBeDefined();
		expect(plugin.endpoints?.webhooks.deleteLegacy).toBeDefined();
		expect(plugin.endpoints?.emailAccounts.capacities).toBeDefined();
		expect(plugin.authConfig).toEqual(hunterioAuthConfig);
		expect(plugin.webhooks).toEqual({});
		expect(hunterioEndpointSchemas['account.get']?.input).toBeDefined();
		expect(hunterioEndpointSchemas['messages.send']?.output).toBeDefined();
		expect(hunterioEndpointSchemas['leads.importCsv']?.input).toBeDefined();
	});
});

// Returns wire-JSON mock responses matching each endpoint's output schema.
// Stricter typing for the return value is not feasible because the 160 endpoints
// return distinct schema shapes (data envelopes, collections, primitive statuses, or undefined).
function getMockResponse(key: string, outputSchema: z.ZodType): unknown {
	if (outputSchema.safeParse(undefined).success) {
		return undefined;
	}
	if (key === 'leads.list')
		return { data: { leads: [{ id: 1, email: 'test@example.com' }] } };
	if (key === 'leads.exist')
		return {
			data: {
				id: 1,
				email: 'test@example.com',
				leads_list_id: 1,
				leads_list_name: 'List',
			},
		};
	if (key === 'tags.list') return { data: { tags: [{ id: 1, name: 'VIP' }] } };
	if (key === 'leadTags.attach')
		return { data: { tags: [{ id: 1, name: 'VIP' }] } };
	if (key === 'customAttributes.list')
		return { data: { leads_custom_attributes: [{ id: 1, name: 'Attr' }] } };
	if (key === 'leadsLists.list')
		return { data: { leads_lists: [{ id: 1, name: 'List' }] } };
	if (key === 'leadsListFolders.list')
		return { data: { folders: [{ id: 1, name: 'Folder' }] } };
	if (key === 'companies.list')
		return { data: { companies: [{ id: 1, name: 'Acme' }] } };
	if (key === 'companyLists.list')
		return { data: { company_lists: [{ id: 1, name: 'List' }] } };
	if (key === 'companyListFolders.list')
		return { data: { folders: [{ id: 1, name: 'Folder' }] } };
	if (key === 'companyTags.list')
		return { data: { company_tags: [{ id: 1, name: 'Tag' }] } };
	if (key === 'discoverViews.list')
		return { data: { views: [{ id: 1, name: 'View' }] }, meta: { total: 1 } };
	if (key === 'companyLists.listCompanies')
		return {
			data: [{ id: 84, domain: 'example.com', organization: 'Example' }],
			meta: { results: 1, limit: 20, offset: 0 },
		};
	if (key === 'domainSearch.found' || key === 'domainSearch.foundPost') {
		return { data: { domain: 'example.com', emails: [] } };
	}
	if (key === 'briefing.get') return BRIEFING_FIXTURE;
	if (key === 'signals.list') return SIGNALS_FIXTURE;
	if (key === 'monitoredSignals.list') return MONITORED_SIGNALS_FIXTURE;
	if (key === 'opportunities.list') return OPPORTUNITIES_FIXTURE;
	if (key === 'opportunities.results') return OPPORTUNITY_RESULTS_FIXTURE;
	if (key === 'sequences.list')
		return { data: { sequences: [{ id: 1, title: 'Seq' }] } };
	if (key === 'sequenceRecipients.list')
		return { data: { recipients: [{ id: 1, email: 'test@example.com' }] } };
	if (key === 'sequenceFollowUps.list')
		return { data: { follow_ups: [{ id: 1 }] } };
	if (key === 'sequenceFollowUps.create')
		return { data: { follow_up: { id: 1 } } };
	if (key === 'messages.list') return { data: { messages: [{ id: 1 }] } };
	if (key === 'messageTemplates.list')
		return { data: { message_templates: [{ id: 1, name: 'Template' }] } };
	if (key === 'emailCount.get')
		return { data: { total: 10, personal: 5, generic: 5 } };
	if (key === 'emailVerifier.verify')
		return { data: { status: 'valid', email: 'test@example.com' } };
	if (key === 'emailInsight.get') return { data: { status: 'found' } };
	if (key === 'domainCount.get') return { data: { total: 10 } };
	if (key === 'domainsSuggestion.get') return { data: { domains: [] } };
	if (key === 'domainSearch.search' || key === 'domainSearch.searchPost') {
		return { data: { domain: 'example.com', emails: [] } };
	}
	if (key === 'multiDomainSearch.search')
		return { data: [{ domain: 'example.com' }] };
	if (
		key === 'sequences.start' ||
		key === 'sequences.pause' ||
		key === 'sequences.resume' ||
		key === 'sequences.archive' ||
		key === 'sequences.test'
	) {
		return { status: 'success', data: { message: 'ok' } };
	}
	if (key === 'leads.importCsv') return { data: { id: 1, status: 'pending' } };
	if (outputSchema.safeParse({ data: [] }).success) {
		return { data: [] };
	}
	return { data: {} };
}

// Sample input parameters covering all endpoint input requirements.
// Stricter typing for property values is not feasible because input fields across 160 endpoints
// accept heterogeneous primitive, array, and nested object types.
function getSampleInput(key: string): Record<string, unknown> {
	// Stricter typing for common input values is not feasible because parameters span strings, numbers, arrays, and objects.
	const common: Record<string, unknown> = {
		id: 1,
		email: 'test@example.com',
		domain: 'example.com',
		domains: ['example.com'],
		name: 'Sample',
		label: 'Sample Label',
		color: '374151',
		subject: 'Hello',
		body: 'Sample message body',
		to: 'test@example.com',
		email_account_id: 1,
		target_url: 'https://example.com/webhook',
		event: 'lead.created',
		leads: [{ email: 'test@example.com' }],
		lead_ids: [1],
		company_ids: [1],
		company: 'Acme',
		company_id: 1,
		company_list_id: 1,
		leads_list_id: 1,
		target_leads_list_id: 2,
		destination_leads_list_id: 2,
		target_company_list_id: 2,
		sequence_id: 1,
		tag_id: 1,
		tag_ids: [1],
		tag_name: 'VIP',
		tag_names: ['VIP'],
		first_name: 'Jane',
		last_name: 'Doe',
		query: 'sample',
		handles: ['h1'],
		csv_data: 'email,first_name\njane@example.com,Jane',
		file: 'dummy,csv\nrow,1',
		csv: 'dummy,csv\nrow,1',
		raw_csv: 'dummy,csv\nrow,1',
		from_leads_list_id: 1,
		to_leads_list_id: 2,
		from_company_list_id: 1,
		to_company_list_id: 2,
		score: 5,
		feedback: 'great',
		feedback_type: 'bug',
		summary: 'Summary text',
		details: 'Details text',
		limit: 10,
		offset: 0,
		emails: ['test@example.com'],
		recipients: [{ email: 'test@example.com' }],
	};

	if (key === 'signals.list') return { source: 'leads', limit: 10 };
	if (
		key === 'domainSearch.search' ||
		key === 'domainSearch.searchPost' ||
		key === 'domainSearch.found' ||
		key === 'domainSearch.foundPost' ||
		key === 'emailCount.get'
	) {
		const { ...rest } = common;
		return { ...rest, type: 'personal' };
	}

	return common;
}

// Generic endpoint handler signature for dynamically executing operations.
// Stricter typing for input and return types is not feasible because each endpoint
// handler accepts a different Zod input shape and returns a distinct output schema.
type GenericEndpointHandler = (ctx: Ctx, input: unknown) => Promise<unknown>;

interface EndpointSchemaEntry {
	input: z.ZodType;
	output: z.ZodType;
}

describe('comprehensive operations coverage', () => {
	const plugin = hunterio({ key: 'test-api-key' });
	// Type assertion for iterating nested resource groups dynamically across 160 operations.
	// Stricter static typing is not feasible because operations span 38 heterogeneous resource groups.
	const endpointTree = plugin.endpoints as unknown as Record<
		string,
		Record<string, GenericEndpointHandler>
	>;

	const allOps: Array<{ key: string; group: string; action: string }> = [];
	for (const [group, actions] of Object.entries(endpointTree)) {
		for (const action of Object.keys(actions)) {
			allOps.push({ key: `${group}.${action}`, group, action });
		}
	}

	it('covers all 168 operations across all resource groups', () => {
		expect(allOps).toHaveLength(168);
	});

	it.each(allOps.map((op) => [op.key, op] as const))(
		'%s executes request, parses response, and logs event',
		async (_key, op) => {
			mockedRequest.mockReset();
			mockedLogEvent.mockReset();

			const fn = endpointTree[op.group]?.[op.action];
			expect(typeof fn).toBe('function');
			if (!fn) throw new Error(`Missing endpoint ${op.key}`);

			// Type assertion for looking up schema entries by dynamic string key.
			// Stricter static typing is not feasible because operations are enumerated dynamically across 160 endpoints.
			const schemas = hunterioEndpointSchemas as unknown as Record<
				string,
				EndpointSchemaEntry
			>;
			const schema = schemas[op.key];
			expect(schema).toBeDefined();
			if (!schema) throw new Error(`Missing schema for ${op.key}`);

			const sampleInput = getSampleInput(op.key);
			const parsedInput = schema.input.parse(sampleInput);

			const mockResponse = getMockResponse(op.key, schema.output);
			schema.output.parse(mockResponse);

			mockedRequest.mockResolvedValue(mockResponse);

			const result = await fn(ctx, parsedInput);
			expect(result).toEqual(mockResponse);
			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				expect.stringMatching(/^hunterio\./),
				expect.anything(),
				'completed',
			);
		},
	);
});
