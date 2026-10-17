import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Alerts,
	Companies,
	Deals,
	Filters,
	Investors,
	People,
} from './endpoints';
import type { FundableContext } from './index';
import { fundable, fundableEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeFundableRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeFundableRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Ctx = Parameters<typeof Companies.get>[0];

function buildCtx(): Ctx {
	const ctx: FundableContext = {
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

const UUID = '550e8400-e29b-41d4-a716-446655440000';
const UUID2 = '123e4567-e89b-42d3-a456-426614174000';

// Fixtures mirror the examples published at
// https://docs.tryfundable.ai/api-reference/<section>/<operation>.

const company = {
	id: UUID,
	name: 'Acme Corp',
	domain: 'acme.com',
	latest_deal: { id: UUID2, type: 'SERIES_A', investors: [UUID] },
};

const deal = {
	id: UUID,
	round_type: 'SERIES_A',
	total_round_raised: 5_000_000,
	financings: [{ type: 'SERIES_A', size_usd: 5_000_000 }],
};

const investor = {
	id: UUID,
	name: 'Sequoia Capital',
	total_deal_count: 42,
};

const person = {
	id: UUID,
	name: 'Jane Doe',
	title: 'CEO',
	linkedin_url: 'https://www.linkedin.com/in/jane-doe',
	crunchbase_url: null,
	twitter_url: null,
	location: 'San Francisco, CA',
	city: 'San Francisco',
	country_code: 'US',
	about: 'Founder',
	is_founder: true,
	current_company: { id: UUID2, name: 'Acme Corp' },
	employment_history: [],
	education_history: [],
	is_investor: false,
	is_angel: false,
	has_led_deal: false,
	investment_firms: [],
	investor_highlights: null,
};

describe('companies.post', () => {
	it('posts filters and returns the parsed company list', async () => {
		const mockResponse = {
			success: true,
			data: { companies: [company] },
			meta: { total_count: 1, page: 0, page_size: 10, credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Companies.post(ctx, {
			company: { search_query: 'fintech' },
			page: 0,
			page_size: 10,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/companies', 'test-api-key', {
			method: 'POST',
			body: { company: { search_query: 'fintech' }, page: 0, page_size: 10 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.companies.post',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects invalid filter input before calling the API', async () => {
		await expect(Companies.post(ctx, { page_size: 0 })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('companies.get', () => {
	it('fetches a company by identifier', async () => {
		const mockResponse = {
			success: true,
			data: { company },
			meta: { credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Companies.get(ctx, { domain: 'acme.com' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/company', 'test-api-key', {
			method: 'GET',
			query: { domain: 'acme.com' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.companies.get',
			{},
			'completed',
		);
	});

	it('rejects ambiguous identifiers', async () => {
		await expect(
			Companies.get(ctx, { domain: 'acme.com', linkedin: 'acme' }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('companies.deals', () => {
	it('fetches the funding history for a company', async () => {
		const mockResponse = {
			success: true,
			data: { deals: [deal] },
			meta: { total_count: 1, page: 0, page_size: 10 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Companies.deals(ctx, { id: UUID, page: 1 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/company/deals',
			'test-api-key',
			{
				method: 'GET',
				query: { id: UUID, page: 1 },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.companies.deals',
			{ count: 1 },
			'completed',
		);
	});
});

describe('companies.search', () => {
	it('fuzzy searches companies by name', async () => {
		const mockResponse = {
			success: true,
			data: { companies: [{ id: UUID, name: 'Acme Corp' }] },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Companies.search(ctx, { name: 'acme' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/company/search',
			'test-api-key',
			{
				method: 'GET',
				query: { name: 'acme' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.companies.search',
			{ count: 1 },
			'completed',
		);
	});
});

describe('deals.post', () => {
	it('posts deal filters and returns matching rounds', async () => {
		const mockResponse = {
			success: true,
			data: { deals: [deal] },
			meta: { total_count: 1, credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Deals.post(ctx, {
			deal: { financing_types: [{ type: 'SERIES_A' }] },
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/deals', 'test-api-key', {
			method: 'POST',
			body: { deal: { financing_types: [{ type: 'SERIES_A' }] } },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.deals.post',
			{ count: 1 },
			'completed',
		);
	});
});

describe('deals.get', () => {
	it('fetches a deal by UUID', async () => {
		const mockResponse = {
			success: true,
			data: { deal },
			meta: { credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Deals.get(ctx, { id: UUID });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/deals/${UUID}`,
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.deals.get',
			{},
			'completed',
		);
	});
});

describe('deals.investors', () => {
	it('fetches the investor lineup for a deal', async () => {
		const mockResponse = {
			success: true,
			data: {
				investors: [{ id: UUID, name: 'Sequoia Capital', lead_investor: true }],
				angel_investors: [{ id: UUID2, name: 'Angel One' }],
			},
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Deals.investors(ctx, { id: UUID });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/deals/${UUID}/investors`,
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.deals.investors',
			{ investor_count: 1, angel_count: 1 },
			'completed',
		);
	});

	it('rejects a non-UUID deal id before calling the API', async () => {
		await expect(Deals.investors(ctx, { id: 'not-a-uuid' })).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('investors.post', () => {
	it('posts investor filters and returns matching firms', async () => {
		const mockResponse = {
			success: true,
			data: { investors: [investor] },
			meta: { total_count: 1, credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Investors.post(ctx, { sort_by: 'deals_led_ltm' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/investors', 'test-api-key', {
			method: 'POST',
			body: { sort_by: 'deals_led_ltm' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.investors.post',
			{ count: 1 },
			'completed',
		);
	});
});

describe('investors.get', () => {
	it('fetches an investor profile by identifier', async () => {
		const mockResponse = {
			success: true,
			data: { investor },
			meta: { credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Investors.get(ctx, { crunchbase: 'sequoia' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/investor', 'test-api-key', {
			method: 'GET',
			query: { crunchbase: 'sequoia' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.investors.get',
			{},
			'completed',
		);
	});
});

describe('investors.deals', () => {
	it("fetches an investor's deal history", async () => {
		const mockResponse = {
			success: true,
			data: { deals: [deal] },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Investors.deals(ctx, {
			id: UUID,
			page_size: 50,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/investor/deals',
			'test-api-key',
			{
				method: 'GET',
				query: { id: UUID, page_size: 50 },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.investors.deals',
			{ count: 1 },
			'completed',
		);
	});
});

describe('investors.search', () => {
	it('fuzzy searches investors by name', async () => {
		const mockResponse = {
			success: true,
			data: { investors: [{ id: UUID, name: 'Sequoia Capital' }] },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Investors.search(ctx, { name: 'sequoia' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/investor/search',
			'test-api-key',
			{
				method: 'GET',
				query: { name: 'sequoia' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.investors.search',
			{ count: 1 },
			'completed',
		);
	});
});

describe('people.post', () => {
	it('posts people filters and returns matching people', async () => {
		const mockResponse = {
			success: true,
			data: { people: [person] },
			meta: { total_count: 1, credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await People.post(ctx, {
			person: { roles: ['founder'] },
			page_size: 25,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/people', 'test-api-key', {
			method: 'POST',
			body: { person: { roles: ['founder'] }, page_size: 25 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.people.post',
			{ count: 1 },
			'completed',
		);
	});
});

describe('people.get', () => {
	it('fetches a person by identifier', async () => {
		const mockResponse = {
			success: true,
			data: { person },
			meta: { credits_used: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await People.get(ctx, { id: UUID });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/person', 'test-api-key', {
			method: 'GET',
			query: { id: UUID },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.people.get',
			{},
			'completed',
		);
	});

	it('rejects missing identifiers', async () => {
		await expect(People.get(ctx, {})).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('people.email', () => {
	it('unlocks an email and never logs the address', async () => {
		const mockResponse = {
			success: true,
			data: {
				person_id: UUID,
				email: 'jane@example.com',
				already_unlocked: false,
			},
			meta: { credits_used: 5 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await People.email(ctx, { id: UUID });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/person/email',
			'test-api-key',
			{
				method: 'GET',
				query: { id: UUID },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledTimes(1);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.people.email',
			{ already_unlocked: false },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('jane@example.com');
	});
});

describe('people.phone', () => {
	it('unlocks a phone number and never logs the number', async () => {
		const mockResponse = {
			success: true,
			data: {
				person_id: UUID,
				phone: '+14155550123',
				already_unlocked: true,
			},
			meta: { credits_used: 0 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await People.phone(ctx, { linkedin: 'jane-doe' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/person/phone',
			'test-api-key',
			{
				method: 'GET',
				query: { linkedin: 'jane-doe' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.people.phone',
			{ already_unlocked: true },
			'completed',
		);
		const payload = mockedLogEvent.mock.calls[0]?.[2];
		expect(JSON.stringify(payload)).not.toContain('+14155550123');
	});
});

describe('people.deals', () => {
	it('fetches deals a person joined as an investor', async () => {
		const mockResponse = {
			success: true,
			data: { deals: [deal] },
			meta: { total_count: 1, page: 0, page_size: 10 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await People.deals(ctx, { twitter: 'jane', page: 0 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/person/deals',
			'test-api-key',
			{
				method: 'GET',
				query: { twitter: 'jane', page: 0 },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.people.deals',
			{ count: 1 },
			'completed',
		);
	});
});

describe('people.search', () => {
	it('fuzzy searches people by name', async () => {
		const mockResponse = {
			success: true,
			data: {
				people: [
					{
						id: UUID,
						name: 'Jane Doe',
						linkedin_url: 'https://www.linkedin.com/in/jane-doe',
						person_type: 'investor',
					},
				],
			},
			meta: { total_count: 1 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await People.search(ctx, { name: 'jane' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/person/search',
			'test-api-key',
			{
				method: 'GET',
				query: { name: 'jane' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.people.search',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects multiple search parameters', async () => {
		await expect(
			People.search(ctx, { name: 'jane', id: UUID }),
		).rejects.toThrow();

		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('filters.locations', () => {
	it('resolves location labels to permalinks', async () => {
		const mockResponse = {
			success: true,
			data: {
				locations: [
					{
						permalink: 'san-francisco-ca',
						name: 'San Francisco',
						location_type: 'CITY',
					},
				],
			},
			meta: { total_count: 1, credits_used: 0 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Filters.locations(ctx, {
			name: 'san francisco',
			type: 'CITY',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/location/search',
			'test-api-key',
			{
				method: 'GET',
				query: { name: 'san francisco', type: 'CITY' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.filters.locations',
			{ count: 1 },
			'completed',
		);
	});
});

describe('filters.industries', () => {
	it('resolves industry labels to permalinks', async () => {
		const mockResponse = {
			success: true,
			data: {
				industries: [
					{
						permalink: 'fintech',
						name: 'Fintech',
						industry_type: 'INDUSTRY',
					},
				],
			},
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Filters.industries(ctx, { name: 'fintech' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/industry/search',
			'test-api-key',
			{
				method: 'GET',
				query: { name: 'fintech' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.filters.industries',
			{ count: 1 },
			'completed',
		);
	});
});

describe('alerts.list', () => {
	it('fetches saved alert matches for a date range', async () => {
		const mockResponse = {
			success: true,
			data: {
				alerts: [
					{
						alertId: UUID,
						alertName: 'Seed rounds',
						alertFrequency: 'DAILY',
						totalDealCount: 1,
						deals: [{ id: UUID2, company_name: 'Acme Corp' }],
					},
				],
			},
			meta: { page: 0, page_size: 1, credits_used: 0 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Alerts.list(ctx, {
			alert_ids: UUID,
			start_date: '2026-01-01T00:00:00.000Z',
			end_date: '2026-01-02T00:00:00.000Z',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/alerts', 'test-api-key', {
			method: 'GET',
			query: {
				alert_ids: UUID,
				start_date: '2026-01-01T00:00:00.000Z',
				end_date: '2026-01-02T00:00:00.000Z',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.alerts.list',
			{ count: 1 },
			'completed',
		);
	});
});

describe('alerts.configurations', () => {
	it('fetches alert configurations for the authenticated user', async () => {
		const mockResponse = {
			success: true,
			data: {
				configurations: [
					{
						configuration_id: UUID,
						configuration_name: 'Seed rounds',
						frequency: 'WEEKLY',
						filters: { industries: ['fintech'] },
					},
				],
			},
			meta: { page: 0, page_size: 1, credits_used: 0 },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Alerts.configurations(ctx, {});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/alerts/configurations',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'fundable.alerts.configurations',
			{ count: 1 },
			'completed',
		);
	});
});

describe('fundable plugin shape', () => {
	it('exposes all 21 endpoints', () => {
		const plugin = fundable({});

		expect(plugin.endpoints?.companies.post).toBeDefined();
		expect(plugin.endpoints?.companies.get).toBeDefined();
		expect(plugin.endpoints?.companies.deals).toBeDefined();
		expect(plugin.endpoints?.companies.search).toBeDefined();
		expect(plugin.endpoints?.deals.post).toBeDefined();
		expect(plugin.endpoints?.deals.get).toBeDefined();
		expect(plugin.endpoints?.deals.investors).toBeDefined();
		expect(plugin.endpoints?.investors.post).toBeDefined();
		expect(plugin.endpoints?.investors.get).toBeDefined();
		expect(plugin.endpoints?.investors.deals).toBeDefined();
		expect(plugin.endpoints?.investors.search).toBeDefined();
		expect(plugin.endpoints?.people.post).toBeDefined();
		expect(plugin.endpoints?.people.get).toBeDefined();
		expect(plugin.endpoints?.people.email).toBeDefined();
		expect(plugin.endpoints?.people.phone).toBeDefined();
		expect(plugin.endpoints?.people.deals).toBeDefined();
		expect(plugin.endpoints?.people.search).toBeDefined();
		expect(plugin.endpoints?.filters.locations).toBeDefined();
		expect(plugin.endpoints?.filters.industries).toBeDefined();
		expect(plugin.endpoints?.alerts.list).toBeDefined();
		expect(plugin.endpoints?.alerts.configurations).toBeDefined();
	});

	it('uses api_key auth and declares no webhooks', () => {
		const plugin = fundable({ authType: 'api_key' });

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('wires zod input and output schemas for every endpoint', () => {
		const keys = [
			'companies.post',
			'companies.get',
			'companies.deals',
			'companies.search',
			'deals.post',
			'deals.get',
			'deals.investors',
			'investors.post',
			'investors.get',
			'investors.deals',
			'investors.search',
			'people.post',
			'people.get',
			'people.email',
			'people.phone',
			'people.deals',
			'people.search',
			'filters.locations',
			'filters.industries',
			'alerts.list',
			'alerts.configurations',
		] as const;

		expect(Object.keys(fundableEndpointSchemas)).toHaveLength(21);
		for (const key of keys) {
			expect(fundableEndpointSchemas[key]?.input).toBeDefined();
			expect(fundableEndpointSchemas[key]?.output).toBeDefined();
		}
	});
});
