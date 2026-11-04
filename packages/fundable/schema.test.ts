import {
	AlertConfigurationsInputSchema,
	AlertConfigurationsResponseSchema,
	AlertsListInputSchema,
	AlertsListResponseSchema,
	CompaniesPostInputSchema,
	CompaniesPostResponseSchema,
	CompanyDealsInputSchema,
	CompanyDealsResponseSchema,
	CompanyGetInputSchema,
	CompanyGetResponseSchema,
	CompanySearchInputSchema,
	CompanySearchResponseSchema,
	DealGetInputSchema,
	DealGetResponseSchema,
	DealInvestorsInputSchema,
	DealInvestorsResponseSchema,
	DealsPostInputSchema,
	DealsPostResponseSchema,
	IndustrySearchInputSchema,
	IndustrySearchResponseSchema,
	InvestorDealsInputSchema,
	InvestorDealsResponseSchema,
	InvestorGetInputSchema,
	InvestorGetResponseSchema,
	InvestorSearchInputSchema,
	InvestorSearchResponseSchema,
	InvestorsPostInputSchema,
	InvestorsPostResponseSchema,
	LocationSearchInputSchema,
	LocationSearchResponseSchema,
	PeoplePostInputSchema,
	PeoplePostResponseSchema,
	PersonDealsInputSchema,
	PersonDealsResponseSchema,
	PersonEmailInputSchema,
	PersonEmailResponseSchema,
	PersonGetInputSchema,
	PersonGetResponseSchema,
	PersonPhoneInputSchema,
	PersonPhoneResponseSchema,
	PersonSearchInputSchema,
	PersonSearchResponseSchema,
} from './endpoints/types';
import { FundableSchema } from './schema';
import { fundableEntities } from './schema/database';

const UUID = '550e8400-e29b-41d4-a716-446655440000';
const UUID2 = '123e4567-e89b-42d3-a456-426614174000';

// Fixture shapes mirror the examples published at
// https://docs.tryfundable.ai/api-reference/<section>/<operation>.

const company = {
	id: UUID,
	name: 'Acme Corp',
	domain: 'acme.com',
	industries: [{ permalink: 'fintech', name: 'Fintech' }],
	location: { country: { name: 'United States', permalink: 'united-states' } },
	latest_deal: {
		id: UUID2,
		type: 'SERIES_A',
		investors: [UUID],
		financings: [{ type: 'SERIES_A', size_usd: 5_000_000 }],
	},
};

const deal = {
	id: UUID,
	round_type: 'SERIES_A',
	total_round_raised: 5_000_000,
	financings: [{ type: 'SERIES_A', size_usd: 5_000_000 }],
	valuation: { type: 'POST_MONEY', valuation_usd: 20_000_000 },
	articles: [{ link: 'https://news.example.com/a', is_primary: true }],
};

const investor = {
	id: UUID,
	name: 'Sequoia Capital',
	total_deal_count: 42,
	location: { country: { name: 'United States', permalink: 'united-states' } },
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
	current_company: {
		id: UUID2,
		name: 'Acme Corp',
		permalink: 'acme-corp',
		domain: 'acme.com',
	},
	employment_history: [
		{
			title: 'CEO',
			company_name: 'Acme Corp',
			company_id: UUID2,
			is_current: true,
		},
	],
	education_history: [{ school_name: 'Stanford University', degree: 'BS' }],
	is_investor: false,
	is_angel: false,
	has_led_deal: false,
	investment_firms: [],
	investor_highlights: null,
};

const alert = {
	alertId: UUID,
	alertName: 'Seed rounds',
	alertFrequency: 'DAILY',
	totalDealCount: 1,
	deals: [
		{
			id: UUID2,
			company_name: 'Acme Corp',
			round_type: 'SEED',
			total_round_raised: 2.5,
			articles: [
				{
					link: 'https://news.example.com/b',
					is_primary: true,
					publishedDate: '2026-01-02T00:00:00.000Z',
				},
			],
		},
	],
};

const configuration = {
	configuration_id: UUID,
	configuration_name: 'Seed rounds',
	frequency: 'WEEKLY',
	description: 'US seed rounds',
	filters: {
		industries: ['fintech'],
		financing_types: ['Series A'],
		deal_size_min: 1_000_000,
		investors: [{ id: UUID2, name: 'Sequoia Capital' }],
	},
};

describe('Fundable schema', () => {
	it('declares a semver version', () => {
		expect(FundableSchema.version).toBeDefined();
		expect(FundableSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(FundableSchema.entities).toBe(fundableEntities);
		expect(FundableSchema.entities).toEqual({});
	});
});

describe('Companies schemas', () => {
	it('validates companies.post input and output', () => {
		expect(
			CompaniesPostInputSchema.safeParse({ page: 0, page_size: 10 }).success,
		).toBe(true);
		expect(
			CompaniesPostInputSchema.safeParse({
				identifiers: { ids: [UUID] },
				company: { search_query: 'fintech', min_relevance: 0.5 },
				latest_deal: {
					financing_types: [{ type: 'SEED', pre: true }],
					size_min: 1_000_000,
				},
				sort_by: 'most_recent_raise',
			}).success,
		).toBe(true);
		expect(CompaniesPostInputSchema.safeParse({ page_size: 0 }).success).toBe(
			false,
		);
		expect(
			CompaniesPostInputSchema.safeParse({
				identifiers: { ids: ['not-a-uuid'] },
			}).success,
		).toBe(false);
		expect(
			CompaniesPostInputSchema.safeParse({
				company: { min_relevance: 2 },
			}).success,
		).toBe(false);
		expect(
			CompaniesPostInputSchema.safeParse({
				latest_deal: { financing_types: [{ type: 'seed' }] },
			}).success,
		).toBe(false);

		const output = {
			success: true,
			data: { companies: [company] },
			meta: { total_count: 1, page: 0, page_size: 10, credits_used: 1 },
		};
		expect(CompaniesPostResponseSchema.safeParse(output).success).toBe(true);
		expect(
			CompaniesPostResponseSchema.safeParse({ success: true }).success,
		).toBe(false);
		expect(
			CompaniesPostResponseSchema.safeParse({ data: { companies: [] } })
				.success,
		).toBe(false);
	});

	it('validates companies.get input and output', () => {
		expect(
			CompanyGetInputSchema.safeParse({ domain: 'acme.com' }).success,
		).toBe(true);
		expect(CompanyGetInputSchema.safeParse({ id: UUID }).success).toBe(true);
		expect(CompanyGetInputSchema.safeParse({}).success).toBe(false);
		expect(
			CompanyGetInputSchema.safeParse({ domain: 'acme.com', linkedin: 'x' })
				.success,
		).toBe(false);

		expect(
			CompanyGetResponseSchema.safeParse({
				success: true,
				data: { company },
				meta: { credits_used: 1 },
			}).success,
		).toBe(true);
		expect(
			CompanyGetResponseSchema.safeParse({ success: true, data: {} }).success,
		).toBe(false);
	});

	it('validates companies.deals input and output', () => {
		expect(
			CompanyDealsInputSchema.safeParse({ id: UUID, page: 1, page_size: 25 })
				.success,
		).toBe(true);
		expect(CompanyDealsInputSchema.safeParse({}).success).toBe(false);
		expect(
			CompanyDealsInputSchema.safeParse({ domain: 'a.com', crunchbase: 'b' })
				.success,
		).toBe(false);

		expect(
			CompanyDealsResponseSchema.safeParse({
				success: true,
				data: { deals: [deal] },
			}).success,
		).toBe(true);
		expect(
			CompanyDealsResponseSchema.safeParse({
				success: true,
				data: { deals: [{}] },
			}).success,
		).toBe(false);
	});

	it('validates companies.search input and output', () => {
		expect(CompanySearchInputSchema.safeParse({ name: 'acme' }).success).toBe(
			true,
		);
		expect(CompanySearchInputSchema.safeParse({ name: '' }).success).toBe(
			false,
		);
		expect(CompanySearchInputSchema.safeParse({}).success).toBe(false);
		expect(
			CompanySearchInputSchema.safeParse({ name: 'acme', domain: 'acme.com' })
				.success,
		).toBe(false);

		expect(
			CompanySearchResponseSchema.safeParse({
				success: true,
				data: { companies: [{ id: UUID, name: 'Acme Corp' }] },
			}).success,
		).toBe(true);
		expect(
			CompanySearchResponseSchema.safeParse({
				success: true,
				data: { companies: [{ name: 'Acme Corp' }] },
			}).success,
		).toBe(false);
	});
});

describe('Deals schemas', () => {
	it('validates deals.post input and output', () => {
		expect(DealsPostInputSchema.safeParse({}).success).toBe(true);
		expect(
			DealsPostInputSchema.safeParse({
				deal: { date_start: '2024-01-01', date_end: '2024-12-31' },
				company: { company_ids: [UUID], employee_count: ['11-50'] },
				sort_by: 'largest_raise',
			}).success,
		).toBe(true);
		expect(DealsPostInputSchema.safeParse({ page_size: 501 }).success).toBe(
			false,
		);
		expect(
			DealsPostInputSchema.safeParse({ sort_by: 'most_recent' }).success,
		).toBe(false);

		expect(
			DealsPostResponseSchema.safeParse({
				success: true,
				data: { deals: [deal] },
				meta: { total_count: 1 },
			}).success,
		).toBe(true);
		expect(
			DealsPostResponseSchema.safeParse({ success: true, data: { deals: 'x' } })
				.success,
		).toBe(false);
	});

	it('validates deals.get input and output', () => {
		expect(DealGetInputSchema.safeParse({ id: UUID }).success).toBe(true);
		expect(DealGetInputSchema.safeParse({}).success).toBe(false);
		expect(DealGetInputSchema.safeParse({ id: 'nope' }).success).toBe(false);

		expect(
			DealGetResponseSchema.safeParse({
				success: true,
				data: { deal },
				meta: { page: 0, page_size: 1, credits_used: 1 },
			}).success,
		).toBe(true);
		expect(
			DealGetResponseSchema.safeParse({ success: true, data: { deal: {} } })
				.success,
		).toBe(false);
	});

	it('validates deals.investors input and output', () => {
		expect(DealInvestorsInputSchema.safeParse({ id: UUID }).success).toBe(true);
		expect(DealInvestorsInputSchema.safeParse({ id: '' }).success).toBe(false);

		const output = {
			success: true,
			data: {
				investors: [
					{
						id: UUID,
						name: 'Sequoia Capital',
						lead_investor: true,
						personnel: [{ id: UUID2, name: 'Jane Doe' }],
					},
				],
				angel_investors: [{ id: UUID2, name: 'Angel One' }],
			},
		};
		expect(DealInvestorsResponseSchema.safeParse(output).success).toBe(true);
		expect(
			DealInvestorsResponseSchema.safeParse({
				success: true,
				data: { investors: [{ name: 'no id' }], angel_investors: [] },
			}).success,
		).toBe(false);
	});
});

describe('Investors schemas', () => {
	it('validates investors.post input and output', () => {
		expect(InvestorsPostInputSchema.safeParse({}).success).toBe(true);
		expect(
			InvestorsPostInputSchema.safeParse({
				company_investments: {
					search_query: 'ai',
					only_lead_deals: true,
					min_matching_deals: 2,
				},
				sort_by: 'deals_led_ltm',
			}).success,
		).toBe(true);
		expect(
			InvestorsPostInputSchema.safeParse({ sort_by: 'whatever' }).success,
		).toBe(false);

		expect(
			InvestorsPostResponseSchema.safeParse({
				success: true,
				data: { investors: [investor] },
				meta: { total_count: 1, credits_used: 1 },
			}).success,
		).toBe(true);
		expect(
			InvestorsPostResponseSchema.safeParse({
				success: true,
				data: { investors: [{ id: UUID }] },
			}).success,
		).toBe(false);
	});

	it('validates investors.get input and output', () => {
		expect(
			InvestorGetInputSchema.safeParse({ crunchbase: 'sequoia' }).success,
		).toBe(true);
		expect(InvestorGetInputSchema.safeParse({}).success).toBe(false);
		expect(
			InvestorGetInputSchema.safeParse({ id: UUID, domain: 'a.com' }).success,
		).toBe(false);

		expect(
			InvestorGetResponseSchema.safeParse({
				success: true,
				data: { investor },
			}).success,
		).toBe(true);
		expect(
			InvestorGetResponseSchema.safeParse({
				success: true,
				data: { investor: { name: 'no id' } },
			}).success,
		).toBe(false);
	});

	it('validates investors.deals input and output', () => {
		expect(
			InvestorDealsInputSchema.safeParse({ domain: 'sequoia.com', page: 0 })
				.success,
		).toBe(true);
		expect(InvestorDealsInputSchema.safeParse({}).success).toBe(false);

		expect(
			InvestorDealsResponseSchema.safeParse({
				success: true,
				data: { deals: [deal] },
			}).success,
		).toBe(true);
	});

	it('validates investors.search input and output', () => {
		expect(
			InvestorSearchInputSchema.safeParse({ name: 'sequoia' }).success,
		).toBe(true);
		expect(InvestorSearchInputSchema.safeParse({}).success).toBe(false);
		expect(
			InvestorSearchInputSchema.safeParse({ name: 'a', domain: 'b.com' })
				.success,
		).toBe(false);

		expect(
			InvestorSearchResponseSchema.safeParse({
				success: true,
				data: {
					investors: [
						{ id: UUID, name: 'Sequoia Capital', image: 'https://x/i.png' },
					],
				},
			}).success,
		).toBe(true);
		expect(
			InvestorSearchResponseSchema.safeParse({
				success: true,
				data: { investors: [{ name: 'no id' }] },
			}).success,
		).toBe(false);
	});
});

describe('People schemas', () => {
	it('validates people.post input and output', () => {
		expect(PeoplePostInputSchema.safeParse({}).success).toBe(true);
		expect(
			PeoplePostInputSchema.safeParse({
				person_type: 'investor',
				person: {
					roles: ['founder', 'ceo'],
					contact_types: ['linkedin', 'email'],
					job_titles: ['CEO'],
				},
				company: {
					search_query: 'fintech',
					ipo_status: ['acquired', 'delisted'],
					latest_deal: { financing_types: [{ type: 'SERIES_B' }] },
				},
				investor: {
					deals: { investment_type: 'angel', only_lead_deals: true },
				},
				sort_by: 'total_deal_count',
			}).success,
		).toBe(true);
		expect(
			PeoplePostInputSchema.safeParse({ person_type: 'founder' }).success,
		).toBe(false);
		expect(
			PeoplePostInputSchema.safeParse({ person: { roles: ['cto'] } }).success,
		).toBe(false);
		expect(PeoplePostInputSchema.safeParse({ sort_by: 'bad' }).success).toBe(
			false,
		);

		expect(
			PeoplePostResponseSchema.safeParse({
				success: true,
				data: { people: [person] },
				meta: { total_count: 1, credits_used: 1 },
			}).success,
		).toBe(true);
		expect(
			PeoplePostResponseSchema.safeParse({
				success: true,
				data: { people: [{ id: UUID }] },
			}).success,
		).toBe(false);
	});

	it('validates people.get input and output', () => {
		expect(PersonGetInputSchema.safeParse({ id: UUID }).success).toBe(true);
		expect(PersonGetInputSchema.safeParse({ twitter: '@jane' }).success).toBe(
			true,
		);
		expect(PersonGetInputSchema.safeParse({}).success).toBe(false);
		expect(PersonGetInputSchema.safeParse({ id: 'not-a-uuid' }).success).toBe(
			false,
		);

		expect(
			PersonGetResponseSchema.safeParse({
				success: true,
				data: { person },
				meta: { credits_used: 1 },
			}).success,
		).toBe(true);
		expect(
			PersonGetResponseSchema.safeParse({
				success: true,
				data: { person: { id: UUID, name: 'Jane Doe' } },
			}).success,
		).toBe(false);
	});

	it('validates people.email input and output', () => {
		expect(PersonEmailInputSchema.safeParse({ linkedin: 'jane' }).success).toBe(
			true,
		);
		expect(PersonEmailInputSchema.safeParse({}).success).toBe(false);

		expect(
			PersonEmailResponseSchema.safeParse({
				success: true,
				data: {
					person_id: UUID,
					email: 'jane@example.com',
					already_unlocked: false,
				},
				meta: { page: 0, page_size: 1, credits_used: 5 },
			}).success,
		).toBe(true);
		expect(
			PersonEmailResponseSchema.safeParse({
				success: true,
				data: { person_id: UUID },
			}).success,
		).toBe(false);
	});

	it('validates people.phone input and output', () => {
		expect(PersonPhoneInputSchema.safeParse({ id: UUID }).success).toBe(true);
		expect(PersonPhoneInputSchema.safeParse({}).success).toBe(false);

		expect(
			PersonPhoneResponseSchema.safeParse({
				success: true,
				data: {
					person_id: UUID,
					phone: '+14155550123',
					already_unlocked: true,
				},
			}).success,
		).toBe(true);
		expect(
			PersonPhoneResponseSchema.safeParse({
				success: true,
				data: { person_id: UUID },
			}).success,
		).toBe(false);
	});

	it('validates people.deals input and output', () => {
		expect(
			PersonDealsInputSchema.safeParse({ id: UUID, page: 1, page_size: 10 })
				.success,
		).toBe(true);
		expect(PersonDealsInputSchema.safeParse({}).success).toBe(false);

		expect(
			PersonDealsResponseSchema.safeParse({
				success: true,
				data: { deals: [deal] },
			}).success,
		).toBe(true);
	});

	it('validates people.search input and output', () => {
		expect(PersonSearchInputSchema.safeParse({ name: 'jane' }).success).toBe(
			true,
		);
		expect(
			PersonSearchInputSchema.safeParse({ person_type: 'investor', name: 'j' })
				.success,
		).toBe(true);
		expect(PersonSearchInputSchema.safeParse({}).success).toBe(false);
		expect(
			PersonSearchInputSchema.safeParse({ name: 'jane', id: UUID }).success,
		).toBe(false);

		expect(
			PersonSearchResponseSchema.safeParse({
				success: true,
				data: {
					people: [
						{
							id: UUID,
							name: 'Jane Doe',
							linkedin_url: 'https://www.linkedin.com/in/jane-doe',
							crunchbase_url: null,
							twitter_url: null,
							person_type: 'investor',
						},
					],
				},
				meta: { total_count: 1 },
			}).success,
		).toBe(true);
		expect(
			PersonSearchResponseSchema.safeParse({
				success: true,
				data: { people: [{ name: 'no id' }] },
			}).success,
		).toBe(false);
	});
});

describe('Filters schemas', () => {
	it('validates filters.locations input and output', () => {
		expect(
			LocationSearchInputSchema.safeParse({ name: 'san francisco' }).success,
		).toBe(true);
		expect(
			LocationSearchInputSchema.safeParse({ name: 'sf', location_type: 'CITY' })
				.success,
		).toBe(true);
		expect(LocationSearchInputSchema.safeParse({}).success).toBe(false);
		expect(
			LocationSearchInputSchema.safeParse({
				name: 'sf',
				type: 'CITY',
				location_type: 'STATE',
			}).success,
		).toBe(false);
		expect(
			LocationSearchInputSchema.safeParse({ name: 'sf', type: 'VILLAGE' })
				.success,
		).toBe(false);

		expect(
			LocationSearchResponseSchema.safeParse({
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
			}).success,
		).toBe(true);
		expect(
			LocationSearchResponseSchema.safeParse({
				success: true,
				data: { locations: [{ name: 'no permalink' }] },
			}).success,
		).toBe(false);
	});

	it('validates filters.industries input and output', () => {
		expect(
			IndustrySearchInputSchema.safeParse({ name: 'fintech' }).success,
		).toBe(true);
		expect(
			IndustrySearchInputSchema.safeParse({
				name: 'fintech',
				industry_type: 'SUPER_CATEGORY',
			}).success,
		).toBe(true);
		expect(
			IndustrySearchInputSchema.safeParse({
				name: 'fintech',
				type: 'INDUSTRY',
				industry_type: 'SUPER_CATEGORY',
			}).success,
		).toBe(false);

		expect(
			IndustrySearchResponseSchema.safeParse({
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
			}).success,
		).toBe(true);
		expect(
			IndustrySearchResponseSchema.safeParse({
				success: true,
				data: { industries: [{ name: 'no permalink' }] },
			}).success,
		).toBe(false);
	});
});

describe('Alerts schemas', () => {
	it('validates alerts.list input and output', () => {
		expect(
			AlertsListInputSchema.safeParse({
				alert_ids: UUID,
				start_date: '2026-01-01T00:00:00.000Z',
				end_date: '2026-01-02T00:00:00.000Z',
			}).success,
		).toBe(true);
		expect(AlertsListInputSchema.safeParse({ alert_ids: UUID }).success).toBe(
			false,
		);

		expect(
			AlertsListResponseSchema.safeParse({
				success: true,
				data: { alerts: [alert] },
				meta: { page: 0, page_size: 1, credits_used: 0 },
			}).success,
		).toBe(true);
		expect(
			AlertsListResponseSchema.safeParse({
				success: true,
				data: { alerts: [{ alertId: UUID }] },
			}).success,
		).toBe(false);
	});

	it('validates alerts.configurations input and output', () => {
		expect(AlertConfigurationsInputSchema.safeParse({}).success).toBe(true);
		expect(
			AlertConfigurationsInputSchema.safeParse({ extra: true }).success,
		).toBe(true);

		expect(
			AlertConfigurationsResponseSchema.safeParse({
				success: true,
				data: { configurations: [configuration] },
				meta: { page: 0, page_size: 1, credits_used: 0 },
			}).success,
		).toBe(true);
		expect(
			AlertConfigurationsResponseSchema.safeParse({
				success: true,
				data: { configurations: [{ configuration_name: 'no id' }] },
			}).success,
		).toBe(false);
	});
});
