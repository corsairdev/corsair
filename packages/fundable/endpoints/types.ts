import { z } from 'zod';

// Schemas mirror the canonical Fundable OpenAPI spec (OpenAPI 3.0.3,
// info.version 2.0.0) at
// https://docs.tryfundable.ai/api-reference/openapi.json — the same document
// served as https://docs.tryfundable.ai/openapi.json. Per-endpoint doc pages:
// https://docs.tryfundable.ai/api-reference/<section>/<operation>.
//
// Parts of the wire payload the spec leaves open (error code lists, credit
// meta that is omitted for API-tier keys, undocumented example-only fields)
// are modelled as optional and unknown-tolerant so live responses keep
// parsing; `unknown` appears only where the wire shape has no documented
// schema at all.

// ── Shared enums ────────────────────────────────────────────────────────────

// 25 request-side round types (§17 of the research); response `round_type`
// is modelled as a plain string because `latest_deal.type` also returns
// HYBRID/HYBRID_* variants that this enum does not contain (research §18.7).
export const FinancingTypeSchema = z.enum([
	'SERIES_A',
	'SERIES_B',
	'SERIES_C',
	'SERIES_D',
	'SERIES_E',
	'SERIES_F',
	'SERIES_G',
	'SERIES_H',
	'SERIES_I',
	'SERIES_J',
	'SERIES_K',
	'SERIES_L',
	'SERIES_M',
	'SEED',
	'SAFE',
	'CONVERTIBLE_NOTE',
	'EQUITY',
	'PREFERRED',
	'SECONDARY_MARKET',
	'DEBT_FINANCING',
	'GRANT',
	'NON_EQUITY_ASSISTANCE',
	'CROWDFUNDING',
	'INITIAL_COIN_OFFERING',
	'FUNDING_ROUND',
]);

export const EmployeeCountSchema = z.enum([
	'1-10',
	'11-50',
	'51-100',
	'101-250',
	'251-500',
	'501-1000',
	'1001-5000',
	'5001-10000',
	'10001+',
]);

export const IpoStatusSchema = z.enum(['public', 'private']);

// People employer discovery adds `acquired` / `delisted` (research §13.1).
export const PeopleCompanyIpoStatusSchema = z.enum([
	'public',
	'private',
	'acquired',
	'delisted',
]);

export const FinancingTypesFilterInputSchema = z.object({
	type: FinancingTypeSchema,
	pre: z.boolean().optional(),
	extension: z.boolean().optional(),
});

// ── Shared output building blocks ───────────────────────────────────────────

export const LocationInfoSchema = z
	.object({
		name: z.string().nullable().optional(),
		permalink: z.string().nullable().optional(),
	})
	.passthrough();

export const CompanyLocationSchema = z
	.object({
		region: LocationInfoSchema.nullable().optional(),
		country: LocationInfoSchema.nullable().optional(),
		state: LocationInfoSchema.nullable().optional(),
		city: LocationInfoSchema.nullable().optional(),
	})
	.passthrough();

export const IndustryInfoSchema = z
	.object({
		permalink: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.passthrough();

export const DealArticleSchema = z
	.object({
		link: z.string().nullable().optional(),
		date: z.string().nullable().optional(),
		is_primary: z.boolean(),
	})
	.passthrough();

export const FinancingSchema = z
	.object({
		id: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		size_usd: z.number().nullable().optional(),
		size_native: z.number().nullable().optional(),
		currency: z.string().nullable().optional(),
	})
	.passthrough();

export const ValuationSchema = z
	.object({
		type: z.string(),
		valuation_usd: z.number().nullable().optional(),
		valuation_native: z.number().nullable().optional(),
		valuation_currency: z.string().nullable().optional(),
	})
	.passthrough();

// `meta` fields vary by endpoint class (research §7): `total_count` is absent
// on single-entity reads, and `credit_source` / `*_remaining` are omitted for
// API-tier keys — so every field is optional here.
export const FundableMetaSchema = z
	.object({
		total_count: z.number().optional(),
		page: z.number().optional(),
		page_size: z.number().optional(),
		credits_used: z.number().optional(),
		credit_source: z.string().nullable().optional(),
		monthly_credits_remaining: z.number().nullable().optional(),
		purchased_credits_remaining: z.number().nullable().optional(),
	})
	.passthrough();

function successEnvelope<T extends z.ZodTypeAny>(data: T) {
	return z
		.object({
			success: z.boolean(),
			data,
			meta: FundableMetaSchema.optional(),
		})
		.passthrough();
}

// ── Companies ───────────────────────────────────────────────────────────────

export const LatestDealSchema = z
	.object({
		id: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		total_round_raised: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		extension: z.boolean().nullable().optional(),
		pre: z.boolean().nullable().optional(),
		intermediate: z.string().nullable().optional(),
		description: z
			.object({
				short_description: z.string().nullable().optional(),
				long_description: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		investors: z.array(z.string()).optional(),
		angel_investor_ids: z.array(z.string()).optional(),
		financings: z.array(FinancingSchema).optional(),
		articles: z.array(DealArticleSchema).optional(),
	})
	.passthrough();

// CompanyDetails (§16.1); POST /companies returns the same shape as
// CompanyListItem.
export const CompanySchema = z
	.object({
		id: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		legal_name: z.string().nullable().optional(),
		guru_permalink: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		operating_status: z.string().nullable().optional(),
		founded_date: z.string().nullable().optional(),
		acquired: z.boolean().nullable().optional(),
		short_description: z.string().nullable().optional(),
		long_description: z.string().nullable().optional(),
		num_employees: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		twitter: z.string().nullable().optional(),
		facebook: z.string().nullable().optional(),
		pitchbook: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		ipo_status: z.string().nullable().optional(),
		num_funding_rounds: z.number().nullable().optional(),
		num_investors: z.number().nullable().optional(),
		total_raised: z.number().nullable().optional(),
		latest_valuation_usd: z.number().nullable().optional(),
		latest_valuation_date: z.string().nullable().optional(),
		industries: z.array(IndustryInfoSchema).optional(),
		location: CompanyLocationSchema.nullable().optional(),
		latest_deal: LatestDealSchema.nullable().optional(),
		all_investor_ids: z.array(z.string()).nullable().optional(),
		// Present only when `company.search_query` was used.
		similarity: z.number().nullable().optional(),
	})
	.passthrough();

export const CompanySearchResultSchema = z
	.object({
		id: z.string(),
		guru_permalink: z.string().nullable().optional(),
		name: z.string(),
		short_description: z.string().nullable().optional(),
		relevance_score: z.number().optional(),
		domain: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
	})
	.passthrough();

// ── Deals ───────────────────────────────────────────────────────────────────

// Deal (§16.2); CompanyDeal / InvestorDeal / PersonDeal are the same shape.
export const DealSchema = z
	.object({
		id: z.string(),
		round_type: z.string().nullable().optional(),
		extension: z.boolean().nullable().optional(),
		intermediate: z.string().nullable().optional(),
		pre: z.boolean().nullable().optional(),
		date: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		total_round_raised: z.number().nullable().optional(),
		deal_descriptions: z
			.object({
				short_description: z.string().nullable().optional(),
				long_description: z.string().nullable().optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		company_id: z.string().nullable().optional(),
		investor_ids: z.array(z.string()).optional(),
		angel_investor_ids: z.array(z.string()).optional(),
		financings: z.array(FinancingSchema).optional(),
		valuation: ValuationSchema.nullable().optional(),
		articles: z.array(DealArticleSchema).optional(),
	})
	.passthrough();

export const DealPersonnelSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
		twitter: z.string().nullable().optional(),
	})
	.passthrough();

export const DealInvestorSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		lead_investor: z.boolean().nullable().optional(),
		personnel: z.array(DealPersonnelSchema).optional(),
		financing_type: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
	})
	.passthrough();

export const AngelInvestorSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		financing_type: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
		twitter: z.string().nullable().optional(),
	})
	.passthrough();

// ── Investors ───────────────────────────────────────────────────────────────

export const InvestorLocationSchema = z
	.object({
		region: LocationInfoSchema.nullable().optional(),
		country: LocationInfoSchema.nullable().optional(),
		state: LocationInfoSchema.nullable().optional(),
		city: LocationInfoSchema.nullable().optional(),
	})
	.passthrough();

export const InvestorTopIndustrySchema = z
	.object({
		name: z.string().nullable().optional(),
		permalink: z.string().nullable().optional(),
		count: z.number().nullable().optional(),
	})
	.passthrough();

export const InvestorTopLocationSchema = z
	.object({
		name: z.string().nullable().optional(),
		full_name: z.string().nullable().optional(),
		permalink: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		count: z.number().nullable().optional(),
	})
	.passthrough();

export const InvestorTopRoundTypeSchema = z
	.object({
		type: z.string().nullable().optional(),
		count: z.number().nullable().optional(),
	})
	.passthrough();

// Investor (§16.3); list items add `filtered_deal_count` /
// `filtered_lead_count` when `company_investments` filters are active.
export const InvestorSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		total_deal_count: z.number().optional(),
		lead_deal_count: z.number().optional(),
		deal_count_last_12_months: z.number().optional(),
		lead_deal_count_last_12_months: z.number().nullable().optional(),
		most_recent_deal_date: z.string().nullable().optional(),
		guru_permalink: z.string().optional(),
		domain: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		pitchbook: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		legal_name: z.string().nullable().optional(),
		num_employees: z.string().nullable().optional(),
		investment_stage: z.string().nullable().optional(),
		contact_email: z.string().nullable().optional(),
		contact_phone: z.string().nullable().optional(),
		location: InvestorLocationSchema.nullable().optional(),
		top_industries: z.array(InvestorTopIndustrySchema).optional(),
		top_locations: z.array(InvestorTopLocationSchema).optional(),
		top_round_types: z.array(InvestorTopRoundTypeSchema).optional(),
		filtered_deal_count: z.number().nullable().optional(),
		filtered_lead_count: z.number().nullable().optional(),
	})
	.passthrough();

export const InvestorSearchResultSchema = z
	.object({
		id: z.string(),
		guru_permalink: z.string().nullable().optional(),
		name: z.string(),
		description: z.string().nullable().optional(),
		// Undocumented in the schema but present in the spec's own example
		// (research §18.6) — accepted, never required.
		image: z.string().nullable().optional(),
		relevance_score: z.number().optional(),
		domain: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		linkedin: z.string().nullable().optional(),
		crunchbase: z.string().nullable().optional(),
	})
	.passthrough();

// ── People ──────────────────────────────────────────────────────────────────

export const PersonCurrentCompanySchema = z
	.object({
		id: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		permalink: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
	})
	.passthrough();

export const EmploymentRecordSchema = z
	.object({
		title: z.string().nullable().optional(),
		company_name: z.string().nullable().optional(),
		company_id: z.string().nullable().optional(),
		company_url: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		start_date: z.string().nullable().optional(),
		end_date: z.string().nullable().optional(),
		is_current: z.boolean().optional(),
	})
	.passthrough();

export const EducationRecordSchema = z
	.object({
		school_name: z.string().nullable().optional(),
		school_id: z.string().nullable().optional(),
		school_url: z.string().nullable().optional(),
		degree: z.string().nullable().optional(),
		field_of_study: z.string().nullable().optional(),
		start_date: z.string().nullable().optional(),
		end_date: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

export const PersonInvestmentFirmSchema = z
	.object({
		id: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		permalink: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		deal_count: z.number().nullable().optional(),
		last_deal_date: z.string().nullable().optional(),
	})
	.passthrough();

export const InvestorHighlightsSchema = z
	.object({
		total_deal_count: z.number().nullable().optional(),
		lead_deal_count: z.number().nullable().optional(),
		deal_count_last_12_months: z.number().nullable().optional(),
		lead_deal_count_last_12_months: z.number().nullable().optional(),
		most_recent_deal_date: z.string().nullable().optional(),
		top_industries: z.array(InvestorTopIndustrySchema).optional(),
		top_locations: z.array(InvestorTopLocationSchema).optional(),
		top_round_types: z.array(InvestorTopRoundTypeSchema).optional(),
	})
	.passthrough();

// PersonSearchResult (§16.4) — the docs describe this as a unified constant
// shape: every row carries every field, so the core identity/investor flags
// are required and nullable string fields stay nullable.
export const PersonSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable(),
		title: z.string().nullable(),
		linkedin_url: z.string().nullable(),
		crunchbase_url: z.string().nullable(),
		twitter_url: z.string().nullable(),
		location: z.string().nullable(),
		city: z.string().nullable(),
		country_code: z.string().nullable(),
		about: z.string().nullable(),
		is_founder: z.boolean(),
		current_company: PersonCurrentCompanySchema.nullable(),
		employment_history: z.array(EmploymentRecordSchema),
		education_history: z.array(EducationRecordSchema),
		is_investor: z.boolean(),
		is_angel: z.boolean(),
		has_led_deal: z.boolean(),
		investment_firms: z.array(PersonInvestmentFirmSchema),
		investor_highlights: InvestorHighlightsSchema.nullable(),
		filtered_deal_count: z.number().nullable().optional(),
		filtered_lead_count: z.number().nullable().optional(),
		filtered_most_recent_date: z.string().nullable().optional(),
	})
	.passthrough();

// GET /person/search returns the compact search-row shape (§13.6).
export const PersonSearchRowSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		linkedin_url: z.string().nullable().optional(),
		crunchbase_url: z.string().nullable().optional(),
		twitter_url: z.string().nullable().optional(),
		person_type: z.enum(['investor', 'company']).optional(),
	})
	.passthrough();

export const PersonEmailDataSchema = z
	.object({
		person_id: z.string(),
		email: z.string(),
		already_unlocked: z.boolean(),
	})
	.passthrough();

export const PersonPhoneDataSchema = z
	.object({
		person_id: z.string(),
		phone: z.string(),
		already_unlocked: z.boolean(),
	})
	.passthrough();

// ── Filters (locations / industries) ────────────────────────────────────────

export const LocationTypeSchema = z.enum([
	'CITY',
	'STATE',
	'REGION',
	'COUNTRY',
]);

export const LocationSearchResultSchema = z
	.object({
		permalink: z.string(),
		name: z.string(),
		location_type: LocationTypeSchema.optional(),
	})
	.passthrough();

export const IndustryTypeSchema = z.enum(['INDUSTRY', 'SUPER_CATEGORY']);

export const IndustrySearchResultSchema = z
	.object({
		permalink: z.string(),
		name: z.string(),
		industry_type: IndustryTypeSchema.optional(),
	})
	.passthrough();

// ── Alerts ──────────────────────────────────────────────────────────────────

export const AlertFrequencySchema = z.enum([
	'DAILY',
	'WEEKLY',
	'BIWEEKLY',
	'MONTHLY',
]);

export const AlertArticleSchema = z
	.object({
		link: z.string().optional(),
		is_primary: z.boolean(),
		publishedDate: z.string().optional(),
	})
	.passthrough();

export const AlertDealLocationSchema = z
	.object({
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
	})
	.passthrough();

export const SimplifiedDealSchema = z
	.object({
		id: z.string(),
		company_id: z.string().optional(),
		company_name: z.string().optional(),
		company_guru_permalink: z.string().optional(),
		round_type: z.string().optional(),
		// The schema description says this alerts-specific field is USD
		// millions while `Deal.total_round_raised` is raw USD (research
		// §18.10) — the value is passed through untouched.
		total_round_raised: z.number().optional(),
		date: z.string().optional(),
		company_website: z.string().nullable().optional(),
		company_linkedin: z.string().nullable().optional(),
		location: AlertDealLocationSchema.nullable().optional(),
		deal_short_description: z.string().nullable().optional(),
		deal_long_description: z.string().nullable().optional(),
		reasoning: z.string().nullable().optional(),
		articles: z.array(AlertArticleSchema).optional(),
	})
	.passthrough();

export const AlertSchema = z
	.object({
		alertId: z.string(),
		alertName: z.string(),
		alertFrequency: AlertFrequencySchema,
		totalDealCount: z.number(),
		deals: z.array(SimplifiedDealSchema),
	})
	.passthrough();

export const AlertFilterInvestorSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const AlertFilterCompanySchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const AlertConfigurationFiltersSchema = z
	.object({
		industries: z.array(z.string()).optional(),
		super_categories: z.array(z.string()).optional(),
		locations: z.array(z.string()).optional(),
		// Human-readable labels here (e.g. "Series A") — a documented
		// inconsistency vs the canonical enum used by /deals and /companies.
		financing_types: z.array(z.string()).optional(),
		deal_size_min: z.number().nullable().optional(),
		deal_size_max: z.number().nullable().optional(),
		num_employees: z.array(z.string()).optional(),
		investors: z.array(AlertFilterInvestorSchema).optional(),
		companies: z.array(AlertFilterCompanySchema).optional(),
	})
	.passthrough();

export const AlertConfigurationSchema = z
	.object({
		configuration_id: z.string(),
		configuration_name: z.string(),
		frequency: AlertFrequencySchema,
		description: z.string().optional(),
		filters: AlertConfigurationFiltersSchema,
	})
	.passthrough();

// ── Input schemas ───────────────────────────────────────────────────────────

const IdentifierRefineMessage =
	'Provide exactly one of id, domain, linkedin or crunchbase';

export const CompaniesPostInputSchema = z.object({
	identifiers: z
		.object({
			ids: z.array(z.string().uuid()).optional(),
			domains: z.array(z.string()).max(100).optional(),
			linkedin_urls: z.array(z.string()).max(100).optional(),
			crunchbase_urls: z.array(z.string()).max(100).optional(),
		})
		.optional(),
	company: z
		.object({
			search_query: z.string().optional(),
			min_relevance: z.number().min(0).max(1).optional(),
			locations: z.array(z.string()).optional(),
			industries: z.array(z.string()).optional(),
			super_categories: z.array(z.string()).optional(),
			employee_count: z.array(EmployeeCountSchema).optional(),
			ipo_status: z.array(IpoStatusSchema).optional(),
			total_raised_min: z.number().min(0).optional(),
			total_raised_max: z.number().min(0).optional(),
		})
		.optional(),
	latest_deal: z
		.object({
			financing_types: z.array(FinancingTypesFilterInputSchema).optional(),
			size_min: z.number().min(0).optional(),
			size_max: z.number().min(0).optional(),
			date_start: z.string().optional(),
			date_end: z.string().optional(),
			created_start: z.string().optional(),
			created_end: z.string().optional(),
			investor_ids: z.array(z.string().uuid()).optional(),
		})
		.optional(),
	investors: z
		.object({
			investor_ids: z.array(z.string().uuid()).optional(),
			people_ids: z.array(z.string().uuid()).optional(),
		})
		.optional(),
	page: z.number().int().min(0).optional(),
	page_size: z.number().int().min(1).max(500).optional(),
	sort_by: z
		.enum([
			'most_recent_raise',
			'oldest_raise',
			'most_recent_founded',
			'oldest_founded',
			'largest_valuation',
			'smallest_valuation',
			'largest_total_raise',
			'smallest_total_raise',
			'most_funding_rounds',
			'most_investors',
		])
		.optional(),
});

export const CompanyGetInputSchema = z
	.object({
		id: z.string().uuid().optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
	})
	// Docs say "provide exactly one"; the server's behaviour for multiple
	// params is UNVERIFIED (research §18.8), so the documented rule is
	// enforced client-side.
	.refine(
		(value) =>
			[value.id, value.domain, value.linkedin, value.crunchbase].filter(
				(identifier) => identifier !== undefined,
			).length === 1,
		{ message: IdentifierRefineMessage },
	);

export const CompanyDealsInputSchema = z
	.object({
		id: z.string().uuid().optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
		page: z.number().int().min(0).optional(),
		page_size: z.number().int().min(1).max(500).optional(),
	})
	.refine(
		(value) =>
			[value.id, value.domain, value.linkedin, value.crunchbase].filter(
				(identifier) => identifier !== undefined,
			).length === 1,
		{ message: IdentifierRefineMessage },
	);

export const CompanySearchInputSchema = z
	.object({
		name: z.string().min(1).optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
	})
	.refine(
		(value) =>
			[value.name, value.domain, value.linkedin, value.crunchbase].filter(
				(term) => term !== undefined,
			).length === 1,
		{ message: 'Provide exactly one search parameter' },
	);

export const DealsPostInputSchema = z.object({
	identifiers: z
		.object({
			deal_ids: z.array(z.string().uuid()).optional(),
		})
		.optional(),
	deal: z
		.object({
			financing_types: z.array(FinancingTypesFilterInputSchema).optional(),
			size_min: z.number().min(0).optional(),
			size_max: z.number().min(0).optional(),
			date_start: z.string().optional(),
			date_end: z.string().optional(),
			created_start: z.string().optional(),
			created_end: z.string().optional(),
		})
		.optional(),
	company: z
		.object({
			company_ids: z.array(z.string().uuid()).optional(),
			locations: z.array(z.string()).optional(),
			industries: z.array(z.string()).optional(),
			super_categories: z.array(z.string()).optional(),
			employee_count: z.array(EmployeeCountSchema).optional(),
			ipo_status: z.array(IpoStatusSchema).optional(),
			total_raised_min: z.number().min(0).optional(),
			total_raised_max: z.number().min(0).optional(),
		})
		.optional(),
	investors: z
		.object({
			investor_ids: z.array(z.string().uuid()).optional(),
			people_ids: z.array(z.string().uuid()).optional(),
		})
		.optional(),
	page: z.number().int().min(0).optional(),
	page_size: z.number().int().min(1).max(500).optional(),
	sort_by: z
		.enum([
			'most_recent_deal',
			'oldest_deal',
			'largest_raise',
			'smallest_raise',
		])
		.optional(),
});

export const DealGetInputSchema = z.object({
	id: z.string().uuid(),
});

export const DealInvestorsInputSchema = z.object({
	id: z.string().uuid(),
});

export const InvestorsPostInputSchema = z.object({
	identifiers: z
		.object({
			ids: z.array(z.string().uuid()).optional(),
			domains: z.array(z.string()).max(100).optional(),
			linkedin_urls: z.array(z.string()).max(100).optional(),
			crunchbase_urls: z.array(z.string()).max(100).optional(),
		})
		.optional(),
	investor: z
		.object({
			locations: z.array(z.string()).optional(),
			employee_count: z.array(EmployeeCountSchema).optional(),
		})
		.optional(),
	company_investments: z
		.object({
			company_ids: z.array(z.string().uuid()).optional(),
			search_query: z.string().optional(),
			min_relevance: z.number().min(0).max(1).optional(),
			locations: z.array(z.string()).optional(),
			industries: z.array(z.string()).optional(),
			super_categories: z.array(z.string()).optional(),
			employee_count: z.array(EmployeeCountSchema).optional(),
			ipo_status: z.array(IpoStatusSchema).optional(),
			total_raised_min: z.number().min(0).optional(),
			total_raised_max: z.number().min(0).optional(),
			financing_types: z.array(FinancingTypesFilterInputSchema).optional(),
			deal_size_min: z.number().min(0).optional(),
			deal_size_max: z.number().min(0).optional(),
			deal_start_date: z.string().optional(),
			deal_end_date: z.string().optional(),
			only_lead_deals: z.boolean().optional(),
			min_matching_deals: z.number().int().min(1).optional(),
		})
		.optional(),
	page: z.number().int().min(0).optional(),
	page_size: z.number().int().min(1).max(500).optional(),
	sort_by: z
		.enum([
			'most_recent_deal',
			'recent_deals',
			'deals_led_ltm',
			'total_deals',
			'matching_deals',
		])
		.optional(),
});

export const InvestorGetInputSchema = z
	.object({
		id: z.string().uuid().optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
	})
	.refine(
		(value) =>
			[value.id, value.domain, value.linkedin, value.crunchbase].filter(
				(identifier) => identifier !== undefined,
			).length === 1,
		{ message: IdentifierRefineMessage },
	);

export const InvestorDealsInputSchema = z
	.object({
		id: z.string().uuid().optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
		page: z.number().int().min(0).optional(),
		page_size: z.number().int().min(1).max(500).optional(),
	})
	.refine(
		(value) =>
			[value.id, value.domain, value.linkedin, value.crunchbase].filter(
				(identifier) => identifier !== undefined,
			).length === 1,
		{ message: IdentifierRefineMessage },
	);

export const InvestorSearchInputSchema = z
	.object({
		name: z.string().min(1).optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
	})
	.refine(
		(value) =>
			[value.name, value.domain, value.linkedin, value.crunchbase].filter(
				(term) => term !== undefined,
			).length === 1,
		{ message: 'Provide exactly one search parameter' },
	);

export const PeoplePostInputSchema = z.object({
	person_type: z.enum(['company', 'investor', 'any']).optional(),
	identifiers: z
		.object({
			ids: z.array(z.string().uuid()).optional(),
			linkedin_urls: z.array(z.string()).max(100).optional(),
			crunchbase_urls: z.array(z.string()).max(100).optional(),
			twitter_urls: z.array(z.string()).max(100).optional(),
		})
		.optional(),
	person: z
		.object({
			roles: z.array(z.enum(['founder', 'ceo', 'key_person'])).optional(),
			contact_types: z
				.array(z.enum(['linkedin', 'email', 'phone', 'twitter']))
				.optional(),
			job_titles: z.array(z.string()).optional(),
			education_schools: z.array(z.string()).optional(),
			linkedin_companies: z.array(z.string()).optional(),
		})
		.optional(),
	company: z
		.object({
			search_query: z.string().optional(),
			min_relevance: z.number().min(0).max(1).optional(),
			ids: z.array(z.string().uuid()).optional(),
			locations: z.array(z.string()).optional(),
			industries: z.array(z.string()).optional(),
			super_categories: z.array(z.string()).optional(),
			employee_count: z.array(EmployeeCountSchema).optional(),
			ipo_status: z.array(PeopleCompanyIpoStatusSchema).optional(),
			total_raised_min: z.number().min(0).optional(),
			total_raised_max: z.number().min(0).optional(),
			investor_people_ids: z.array(z.string().uuid()).optional(),
			latest_deal: z
				.object({
					financing_types: z.array(FinancingTypesFilterInputSchema).optional(),
					size_min: z.number().min(0).optional(),
					size_max: z.number().min(0).optional(),
					date_start: z.string().optional(),
					date_end: z.string().optional(),
					investor_ids: z.array(z.string().uuid()).optional(),
					investor_locations: z.array(z.string()).optional(),
				})
				.optional(),
		})
		.optional(),
	investor: z
		.object({
			ids: z.array(z.string().uuid()).optional(),
			domains: z.array(z.string()).max(100).optional(),
			linkedin_urls: z.array(z.string()).max(100).optional(),
			crunchbase_urls: z.array(z.string()).max(100).optional(),
			permalinks: z.array(z.string()).max(100).optional(),
			locations: z.array(z.string()).optional(),
			employee_count: z.array(EmployeeCountSchema).optional(),
			deals: z
				.object({
					search_query: z.string().optional(),
					min_relevance: z.number().min(0).max(1).optional(),
					investment_type: z.enum(['all', 'angel', 'institutional']).optional(),
					only_lead_deals: z.boolean().optional(),
					min_matching_deals: z.number().int().min(1).optional(),
					financing_types: z.array(FinancingTypesFilterInputSchema).optional(),
					size_min: z.number().min(0).optional(),
					size_max: z.number().min(0).optional(),
					date_start: z.string().optional(),
					date_end: z.string().optional(),
					industries: z.array(z.string()).optional(),
					super_categories: z.array(z.string()).optional(),
					portfolio_locations: z.array(z.string()).optional(),
					portfolio_employee_count: z.array(EmployeeCountSchema).optional(),
					ipo_status: z.array(IpoStatusSchema).optional(),
					total_raised_min: z.number().min(0).optional(),
					total_raised_max: z.number().min(0).optional(),
				})
				.optional(),
		})
		.optional(),
	page: z.number().int().min(0).optional(),
	page_size: z.number().int().min(1).max(500).optional(),
	sort_by: z
		.enum([
			'most_recent_deal_date',
			'total_raised',
			'latest_deal_size',
			'name',
			'total_deal_count',
			'deal_count_last_12_months',
			'lead_deal_count',
			'lead_deal_count_last_12_months',
			'filtered_deal_count',
		])
		.optional(),
});

// GET /person, /person/deals, /person/email and /person/phone take the same
// four identifiers; unlike company/investor detail reads the docs do not say
// "exactly one" (email/phone document first-non-empty precedence in the
// order id → linkedin → crunchbase → twitter), so only presence is enforced.
export const PersonIdentifierFields = {
	id: z.string().uuid().optional(),
	linkedin: z.string().optional(),
	crunchbase: z.string().optional(),
	twitter: z.string().optional(),
};

const PersonIdentifierRefineMessage =
	'Provide at least one of id, linkedin, crunchbase or twitter';

export const PersonGetInputSchema = z
	.object(PersonIdentifierFields)
	.refine(
		(value) =>
			[value.id, value.linkedin, value.crunchbase, value.twitter].some(
				(identifier) => identifier !== undefined,
			),
		{ message: PersonIdentifierRefineMessage },
	);

export const PersonEmailInputSchema = z
	.object(PersonIdentifierFields)
	.refine(
		(value) =>
			[value.id, value.linkedin, value.crunchbase, value.twitter].some(
				(identifier) => identifier !== undefined,
			),
		{ message: PersonIdentifierRefineMessage },
	);

export const PersonPhoneInputSchema = z
	.object(PersonIdentifierFields)
	.refine(
		(value) =>
			[value.id, value.linkedin, value.crunchbase, value.twitter].some(
				(identifier) => identifier !== undefined,
			),
		{ message: PersonIdentifierRefineMessage },
	);

export const PersonDealsInputSchema = z
	.object({
		...PersonIdentifierFields,
		page: z.number().int().min(0).optional(),
		page_size: z.number().int().min(1).max(500).optional(),
	})
	.refine(
		(value) =>
			[value.id, value.linkedin, value.crunchbase, value.twitter].some(
				(identifier) => identifier !== undefined,
			),
		{ message: PersonIdentifierRefineMessage },
	);

export const PersonSearchInputSchema = z
	.object({
		name: z.string().min(1).optional(),
		id: z.string().uuid().optional(),
		linkedin: z.string().optional(),
		crunchbase: z.string().optional(),
		twitter: z.string().optional(),
		person_type: z.enum(['investor', 'company']).optional(),
	})
	.refine(
		(value) =>
			[
				value.name,
				value.id,
				value.linkedin,
				value.crunchbase,
				value.twitter,
			].filter((term) => term !== undefined).length === 1,
		{ message: 'Provide exactly one search parameter' },
	);

export const LocationSearchInputSchema = z
	.object({
		name: z.string().min(1),
		type: LocationTypeSchema.optional(),
		location_type: LocationTypeSchema.optional(),
	})
	// The docs reject both aliases at once (MULTIPLE_LOCATION_TYPE_PARAMS).
	.refine(
		(value) => value.type === undefined || value.location_type === undefined,
		{ message: 'Pass either type or location_type, not both' },
	);

export const IndustrySearchInputSchema = z
	.object({
		name: z.string().min(1),
		type: IndustryTypeSchema.optional(),
		industry_type: IndustryTypeSchema.optional(),
	})
	.refine(
		(value) => value.type === undefined || value.industry_type === undefined,
		{ message: 'Pass either type or industry_type, not both' },
	);

export const AlertsListInputSchema = z.object({
	alert_ids: z.string().min(1),
	start_date: z.string().min(1),
	end_date: z.string().min(1),
});

export const AlertConfigurationsInputSchema = z.object({}).passthrough();

// ── Response schemas ────────────────────────────────────────────────────────

export const CompaniesPostResponseSchema = successEnvelope(
	z.object({ companies: z.array(CompanySchema) }),
);

export const CompanyGetResponseSchema = successEnvelope(
	z.object({ company: CompanySchema }),
);

export const CompanyDealsResponseSchema = successEnvelope(
	z.object({ deals: z.array(DealSchema) }),
);

export const CompanySearchResponseSchema = successEnvelope(
	z.object({ companies: z.array(CompanySearchResultSchema) }),
);

export const DealsPostResponseSchema = successEnvelope(
	z.object({ deals: z.array(DealSchema) }),
);

export const DealGetResponseSchema = successEnvelope(
	z.object({ deal: DealSchema }),
);

export const DealInvestorsResponseSchema = successEnvelope(
	z.object({
		investors: z.array(DealInvestorSchema),
		angel_investors: z.array(AngelInvestorSchema),
	}),
);

export const InvestorsPostResponseSchema = successEnvelope(
	z.object({ investors: z.array(InvestorSchema) }),
);

export const InvestorGetResponseSchema = successEnvelope(
	z.object({ investor: InvestorSchema }),
);

export const InvestorDealsResponseSchema = successEnvelope(
	z.object({ deals: z.array(DealSchema) }),
);

export const InvestorSearchResponseSchema = successEnvelope(
	z.object({ investors: z.array(InvestorSearchResultSchema) }),
);

export const PeoplePostResponseSchema = successEnvelope(
	z.object({ people: z.array(PersonSchema) }),
);

export const PersonGetResponseSchema = successEnvelope(
	z.object({ person: PersonSchema }),
);

export const PersonEmailResponseSchema = successEnvelope(PersonEmailDataSchema);

export const PersonPhoneResponseSchema = successEnvelope(PersonPhoneDataSchema);

export const PersonDealsResponseSchema = successEnvelope(
	z.object({ deals: z.array(DealSchema) }),
);

export const PersonSearchResponseSchema = successEnvelope(
	z.object({ people: z.array(PersonSearchRowSchema) }),
);

export const LocationSearchResponseSchema = successEnvelope(
	z.object({ locations: z.array(LocationSearchResultSchema) }),
);

export const IndustrySearchResponseSchema = successEnvelope(
	z.object({ industries: z.array(IndustrySearchResultSchema) }),
);

export const AlertsListResponseSchema = successEnvelope(
	z.object({ alerts: z.array(AlertSchema) }),
);

export const AlertConfigurationsResponseSchema = successEnvelope(
	z.object({ configurations: z.array(AlertConfigurationSchema) }),
);

// ── Endpoint I/O types and schema registries ────────────────────────────────

export type FundableEndpointInputs = {
	'companies.post': z.infer<typeof CompaniesPostInputSchema>;
	'companies.get': z.infer<typeof CompanyGetInputSchema>;
	'companies.deals': z.infer<typeof CompanyDealsInputSchema>;
	'companies.search': z.infer<typeof CompanySearchInputSchema>;
	'deals.post': z.infer<typeof DealsPostInputSchema>;
	'deals.get': z.infer<typeof DealGetInputSchema>;
	'deals.investors': z.infer<typeof DealInvestorsInputSchema>;
	'investors.post': z.infer<typeof InvestorsPostInputSchema>;
	'investors.get': z.infer<typeof InvestorGetInputSchema>;
	'investors.deals': z.infer<typeof InvestorDealsInputSchema>;
	'investors.search': z.infer<typeof InvestorSearchInputSchema>;
	'people.post': z.infer<typeof PeoplePostInputSchema>;
	'people.get': z.infer<typeof PersonGetInputSchema>;
	'people.email': z.infer<typeof PersonEmailInputSchema>;
	'people.phone': z.infer<typeof PersonPhoneInputSchema>;
	'people.deals': z.infer<typeof PersonDealsInputSchema>;
	'people.search': z.infer<typeof PersonSearchInputSchema>;
	'filters.locations': z.infer<typeof LocationSearchInputSchema>;
	'filters.industries': z.infer<typeof IndustrySearchInputSchema>;
	'alerts.list': z.infer<typeof AlertsListInputSchema>;
	'alerts.configurations': z.infer<typeof AlertConfigurationsInputSchema>;
};

export type FundableEndpointOutputs = {
	'companies.post': z.infer<typeof CompaniesPostResponseSchema>;
	'companies.get': z.infer<typeof CompanyGetResponseSchema>;
	'companies.deals': z.infer<typeof CompanyDealsResponseSchema>;
	'companies.search': z.infer<typeof CompanySearchResponseSchema>;
	'deals.post': z.infer<typeof DealsPostResponseSchema>;
	'deals.get': z.infer<typeof DealGetResponseSchema>;
	'deals.investors': z.infer<typeof DealInvestorsResponseSchema>;
	'investors.post': z.infer<typeof InvestorsPostResponseSchema>;
	'investors.get': z.infer<typeof InvestorGetResponseSchema>;
	'investors.deals': z.infer<typeof InvestorDealsResponseSchema>;
	'investors.search': z.infer<typeof InvestorSearchResponseSchema>;
	'people.post': z.infer<typeof PeoplePostResponseSchema>;
	'people.get': z.infer<typeof PersonGetResponseSchema>;
	'people.email': z.infer<typeof PersonEmailResponseSchema>;
	'people.phone': z.infer<typeof PersonPhoneResponseSchema>;
	'people.deals': z.infer<typeof PersonDealsResponseSchema>;
	'people.search': z.infer<typeof PersonSearchResponseSchema>;
	'filters.locations': z.infer<typeof LocationSearchResponseSchema>;
	'filters.industries': z.infer<typeof IndustrySearchResponseSchema>;
	'alerts.list': z.infer<typeof AlertsListResponseSchema>;
	'alerts.configurations': z.infer<typeof AlertConfigurationsResponseSchema>;
};

export const FundableEndpointInputSchemas = {
	'companies.post': CompaniesPostInputSchema,
	'companies.get': CompanyGetInputSchema,
	'companies.deals': CompanyDealsInputSchema,
	'companies.search': CompanySearchInputSchema,
	'deals.post': DealsPostInputSchema,
	'deals.get': DealGetInputSchema,
	'deals.investors': DealInvestorsInputSchema,
	'investors.post': InvestorsPostInputSchema,
	'investors.get': InvestorGetInputSchema,
	'investors.deals': InvestorDealsInputSchema,
	'investors.search': InvestorSearchInputSchema,
	'people.post': PeoplePostInputSchema,
	'people.get': PersonGetInputSchema,
	'people.email': PersonEmailInputSchema,
	'people.phone': PersonPhoneInputSchema,
	'people.deals': PersonDealsInputSchema,
	'people.search': PersonSearchInputSchema,
	'filters.locations': LocationSearchInputSchema,
	'filters.industries': IndustrySearchInputSchema,
	'alerts.list': AlertsListInputSchema,
	'alerts.configurations': AlertConfigurationsInputSchema,
} as const;

export const FundableEndpointOutputSchemas = {
	'companies.post': CompaniesPostResponseSchema,
	'companies.get': CompanyGetResponseSchema,
	'companies.deals': CompanyDealsResponseSchema,
	'companies.search': CompanySearchResponseSchema,
	'deals.post': DealsPostResponseSchema,
	'deals.get': DealGetResponseSchema,
	'deals.investors': DealInvestorsResponseSchema,
	'investors.post': InvestorsPostResponseSchema,
	'investors.get': InvestorGetResponseSchema,
	'investors.deals': InvestorDealsResponseSchema,
	'investors.search': InvestorSearchResponseSchema,
	'people.post': PeoplePostResponseSchema,
	'people.get': PersonGetResponseSchema,
	'people.email': PersonEmailResponseSchema,
	'people.phone': PersonPhoneResponseSchema,
	'people.deals': PersonDealsResponseSchema,
	'people.search': PersonSearchResponseSchema,
	'filters.locations': LocationSearchResponseSchema,
	'filters.industries': IndustrySearchResponseSchema,
	'alerts.list': AlertsListResponseSchema,
	'alerts.configurations': AlertConfigurationsResponseSchema,
} as const;
