import { z } from 'zod';

// Schemas follow the Apollo OpenAPI description and its response examples:
// https://docs.apollo.io/openapi/apollo-rest-api.json

const Text = z.string().nullable().optional();
const Num = z.number().nullable().optional();
const Strings = z.array(z.string()).nullable().optional();

const Pagination = z.object({
	page: z.number(),
	per_page: z.number(),
	total_entries: z.number(),
	total_pages: z.number(),
});

const FundingEvent = z.object({
	id: z.string(),
	date: Text,
	detected_at: Text,
	news_url: Text,
	type: Text,
	investors: Text,
	amount: Text,
	currency: Text,
});

const Technology = z.object({
	uid: z.string(),
	name: z.string(),
	category: Text,
});

export const OrganizationSchema = z.object({
	id: z.string(),
	name: Text,
	website_url: Text,
	blog_url: Text,
	angellist_url: Text,
	linkedin_url: Text,
	linkedin_uid: Text,
	twitter_url: Text,
	facebook_url: Text,
	crunchbase_url: Text,
	logo_url: Text,
	primary_domain: Text,
	phone: Text,
	sanitized_phone: Text,
	languages: Strings,
	alexa_ranking: Num,
	founded_year: Num,
	publicly_traded_symbol: Text,
	publicly_traded_exchange: Text,
	industry: Text,
	industries: Strings,
	secondary_industries: Strings,
	industry_tag_id: Text,
	keywords: Strings,
	sic_codes: Strings,
	naics_codes: Strings,
	estimated_num_employees: Num,
	organization_headcount_six_month_growth: Num,
	organization_headcount_twelve_month_growth: Num,
	organization_headcount_twenty_four_month_growth: Num,
	departmental_head_count: z
		.record(z.string(), z.number())
		.nullable()
		.optional(),
	annual_revenue: Num,
	annual_revenue_printed: Text,
	organization_revenue: Num,
	organization_revenue_printed: Text,
	total_funding: Num,
	total_funding_printed: Text,
	latest_funding_stage: Text,
	latest_funding_round_date: Text,
	funding_events: z.array(FundingEvent).nullable().optional(),
	technology_names: Strings,
	current_technologies: z.array(Technology).nullable().optional(),
	raw_address: Text,
	street_address: Text,
	city: Text,
	state: Text,
	postal_code: Text,
	country: Text,
	short_description: Text,
	seo_description: Text,
	owned_by_organization_id: Text,
	num_suborganizations: Num,
	retail_location_count: Num,
	account_id: Text,
});

export type Organization = z.infer<typeof OrganizationSchema>;

const Employment = z.object({
	id: Text,
	organization_id: Text,
	organization_name: Text,
	title: Text,
	current: z.boolean().nullable().optional(),
	start_date: Text,
	end_date: Text,
	description: Text,
});

export const PersonSchema = z.object({
	id: z.string(),
	first_name: Text,
	last_name: Text,
	name: Text,
	title: Text,
	headline: Text,
	linkedin_url: Text,
	twitter_url: Text,
	github_url: Text,
	facebook_url: Text,
	photo_url: Text,
	email: Text,
	email_status: Text,
	extrapolated_email_confidence: Num,
	organization_id: Text,
	organization: OrganizationSchema.nullable().optional(),
	employment_history: z.array(Employment).nullable().optional(),
	match_confidence: z
		.enum(['high', 'medium', 'low', 'none'])
		.nullable()
		.optional(),
	street_address: Text,
	city: Text,
	state: Text,
	country: Text,
	postal_code: Text,
	formatted_address: Text,
	time_zone: Text,
	seniority: Text,
	departments: Strings,
	subdepartments: Strings,
	functions: Strings,
	contact_id: Text,
	revealed_for_current_team: z.boolean().nullable().optional(),
	is_likely_to_engage: z.boolean().nullable().optional(),
});

export type Person = z.infer<typeof PersonSchema>;

// People API Search returns a redacted profile: last names are obfuscated and
// contact fields are flags. Enrich a person by id to reveal the details.
export const SearchPersonSchema = z.object({
	id: z.string(),
	first_name: Text,
	last_name_obfuscated: Text,
	title: Text,
	last_refreshed_at: Text,
	has_email: z.boolean().nullable().optional(),
	has_city: z.boolean().nullable().optional(),
	has_state: z.boolean().nullable().optional(),
	has_country: z.boolean().nullable().optional(),
	// The spec types this as a string ("Yes", "Maybe") rather than a boolean.
	has_direct_phone: z.union([z.string(), z.boolean()]).nullable().optional(),
	organization: z
		.object({
			name: Text,
			has_industry: z.boolean().nullable().optional(),
			has_phone: z.boolean().nullable().optional(),
			has_city: z.boolean().nullable().optional(),
			has_state: z.boolean().nullable().optional(),
			has_country: z.boolean().nullable().optional(),
			has_zip_code: z.boolean().nullable().optional(),
			has_revenue: z.boolean().nullable().optional(),
			has_employee_count: z.boolean().nullable().optional(),
		})
		.nullable()
		.optional(),
});

export type SearchPerson = z.infer<typeof SearchPersonSchema>;

const JobPosting = z.object({
	id: z.string(),
	title: Text,
	url: Text,
	city: Text,
	state: Text,
	country: Text,
	posted_at: Text,
	last_seen_at: Text,
});

export const NewsArticleSchema = z.object({
	id: z.string(),
	url: Text,
	domain: Text,
	title: Text,
	snippet: Text,
	organization_ids: Strings,
	published_at: Text,
	event_categories: Strings,
});

export type NewsArticle = z.infer<typeof NewsArticleSchema>;

// Inputs

const Ids = z.array(z.string().min(1));
const Terms = z.array(z.string().min(1));
const IntRange = z.object({
	min: z.number().int().optional(),
	max: z.number().int().optional(),
});
const DateRange = z.object({
	min: z.string().optional(),
	max: z.string().optional(),
});

const Paging = {
	page: z.number().int().min(1).max(500).optional(),
	per_page: z.number().int().min(1).max(100).optional(),
};

const OrganizationFilters = {
	organization_locations: Terms.optional(),
	organization_not_locations: Terms.optional(),
	organization_industry_tag_ids: Ids.optional(),
	organization_not_industry_tag_ids: Ids.optional(),
	organization_industries: Terms.optional(),
	organization_naics_codes: Terms.optional(),
	not_organization_naics_codes: Terms.optional(),
	organization_sic_codes: Terms.optional(),
	not_organization_sic_codes: Terms.optional(),
	organization_ids: Ids.optional(),
	organization_num_employees_ranges: z
		.array(z.string().regex(/^\d+,\d+$/, 'Expected "min,max"'))
		.optional(),
	revenue_range: IntRange.optional(),
	currently_using_any_of_technology_uids: Terms.optional(),
	q_organization_job_titles: Terms.optional(),
	organization_job_locations: Terms.optional(),
	organization_num_jobs_range: IntRange.optional(),
	organization_job_posted_at_range: DateRange.optional(),
	organization_headcount_growth_past_n_months: z
		.union([z.literal(6), z.literal(12), z.literal(24)])
		.optional(),
	organization_headcount_growth_range: IntRange.optional(),
	lookalike_organization_ids: Ids.max(5).optional(),
	not_organization_websites_list: Terms.optional(),
	q_organization_domains_list: Terms.optional(),
};

const PeopleSearchInputSchema = z.object({
	person_titles: Terms.optional(),
	include_similar_titles: z.boolean().optional(),
	person_not_titles: Terms.optional(),
	person_not_past_titles: Terms.optional(),
	q_keywords: z.string().optional(),
	q_person_name: z.string().optional(),
	person_locations: Terms.optional(),
	person_not_locations: Terms.optional(),
	person_seniorities: Terms.optional(),
	contact_email_status: z
		.array(
			z.enum(['verified', 'unverified', 'likely to engage', 'unavailable']),
		)
		.optional(),
	currently_using_all_of_technology_uids: Terms.optional(),
	currently_not_using_any_of_technology_uids: Terms.optional(),
	...OrganizationFilters,
	...Paging,
});

const PeopleEnrichInputSchema = z
	.object({
		id: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		name: z.string().optional(),
		email: z.email().optional(),
		hashed_email: z.string().optional(),
		organization_name: z.string().optional(),
		domain: z.string().optional(),
		linkedin_url: z.string().optional(),
		reveal_personal_emails: z.boolean().optional(),
		reveal_phone_number: z.boolean().optional(),
		run_waterfall_email: z.boolean().optional(),
		run_waterfall_phone: z.boolean().optional(),
		webhook_url: z.url().optional(),
		poll_only: z.boolean().optional(),
	})
	.refine(
		(input) =>
			!(input.reveal_phone_number || input.run_waterfall_phone) ||
			input.webhook_url !== undefined ||
			input.poll_only === true,
		{
			message:
				'Phone reveal and phone waterfall need webhook_url, or poll_only: true',
		},
	)
	.refine((input) => !(input.webhook_url && input.poll_only), {
		message: 'Use either webhook_url or poll_only, not both',
	});

const IdInputSchema = z.object({ id: z.string().min(1) });

const OrganizationSearchInputSchema = z.object({
	q_organization_name: z.string().optional(),
	q_organization_keyword_tags: Terms.optional(),
	q_not_organization_keyword_tags: Terms.optional(),
	latest_funding_amount_range: IntRange.optional(),
	total_funding_range: IntRange.optional(),
	latest_funding_date_range: DateRange.optional(),
	...OrganizationFilters,
	...Paging,
});

const OrganizationEnrichInputSchema = z
	.object({
		domain: z.string().optional(),
		linkedin_url: z.string().optional(),
		website: z.string().optional(),
		name: z.string().optional(),
	})
	.refine((input) => input.domain || input.linkedin_url || input.website, {
		message: 'Provide domain, linkedin_url, or website',
	});

const JobPostingsInputSchema = z.object({
	organization_id: z.string().min(1),
	...Paging,
});

const NewsSearchInputSchema = z.object({
	organization_ids: Ids.min(1),
	categories: Terms.optional(),
	published_at: DateRange.optional(),
	...Paging,
});

// Outputs

const PeopleSearchResponseSchema = z.object({
	total_entries: z.number(),
	people: z.array(SearchPersonSchema),
});

const PeopleEnrichResponseSchema = z.object({
	person: PersonSchema.nullable(),
	request_id: z.number().optional(),
	waterfall: z
		.object({ status: z.string(), message: Text })
		.nullable()
		.optional(),
});

const PeopleGetResponseSchema = z.object({ person: PersonSchema });

const OrganizationSearchResponseSchema = z.object({
	pagination: Pagination,
	organizations: z.array(OrganizationSchema),
	// Companies already saved as accounts in the caller's Apollo workspace.
	accounts: z.array(OrganizationSchema).optional(),
	breadcrumbs: z
		.array(
			z.object({
				label: z.string(),
				signal_field_name: z.string(),
				value: z.union([z.string(), z.number()]),
				display_name: z.string(),
			}),
		)
		.optional(),
	partial_results_only: z.boolean().optional(),
	partial_results_limit: z.number().optional(),
});

const OrganizationResponseSchema = z.object({
	organization: OrganizationSchema,
});

const JobPostingsResponseSchema = z.object({
	organization_job_postings: z.array(JobPosting),
	pagination: Pagination.optional(),
});

const NewsSearchResponseSchema = z.object({
	pagination: Pagination,
	news_articles: z.array(NewsArticleSchema),
});

export type PeopleSearchInput = z.infer<typeof PeopleSearchInputSchema>;
export type PeopleSearchResponse = z.infer<typeof PeopleSearchResponseSchema>;
export type PeopleEnrichInput = z.infer<typeof PeopleEnrichInputSchema>;
export type PeopleEnrichResponse = z.infer<typeof PeopleEnrichResponseSchema>;
export type IdInput = z.infer<typeof IdInputSchema>;
export type PeopleGetResponse = z.infer<typeof PeopleGetResponseSchema>;
export type OrganizationSearchInput = z.infer<
	typeof OrganizationSearchInputSchema
>;
export type OrganizationSearchResponse = z.infer<
	typeof OrganizationSearchResponseSchema
>;
export type OrganizationEnrichInput = z.infer<
	typeof OrganizationEnrichInputSchema
>;
export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;
export type JobPostingsInput = z.infer<typeof JobPostingsInputSchema>;
export type JobPostingsResponse = z.infer<typeof JobPostingsResponseSchema>;
export type NewsSearchInput = z.infer<typeof NewsSearchInputSchema>;
export type NewsSearchResponse = z.infer<typeof NewsSearchResponseSchema>;

export type ApolloEndpointInputs = {
	peopleSearch: PeopleSearchInput;
	peopleEnrich: PeopleEnrichInput;
	peopleGet: IdInput;
	organizationsSearch: OrganizationSearchInput;
	organizationsEnrich: OrganizationEnrichInput;
	organizationsGet: IdInput;
	organizationsJobPostings: JobPostingsInput;
	newsSearch: NewsSearchInput;
};

export type ApolloEndpointOutputs = {
	peopleSearch: PeopleSearchResponse;
	peopleEnrich: PeopleEnrichResponse;
	peopleGet: PeopleGetResponse;
	organizationsSearch: OrganizationSearchResponse;
	organizationsEnrich: OrganizationResponse;
	organizationsGet: OrganizationResponse;
	organizationsJobPostings: JobPostingsResponse;
	newsSearch: NewsSearchResponse;
};

export const ApolloEndpointInputSchemas = {
	peopleSearch: PeopleSearchInputSchema,
	peopleEnrich: PeopleEnrichInputSchema,
	peopleGet: IdInputSchema,
	organizationsSearch: OrganizationSearchInputSchema,
	organizationsEnrich: OrganizationEnrichInputSchema,
	organizationsGet: IdInputSchema,
	organizationsJobPostings: JobPostingsInputSchema,
	newsSearch: NewsSearchInputSchema,
} as const;

export const ApolloEndpointOutputSchemas = {
	peopleSearch: PeopleSearchResponseSchema,
	peopleEnrich: PeopleEnrichResponseSchema,
	peopleGet: PeopleGetResponseSchema,
	organizationsSearch: OrganizationSearchResponseSchema,
	organizationsEnrich: OrganizationResponseSchema,
	organizationsGet: OrganizationResponseSchema,
	organizationsJobPostings: JobPostingsResponseSchema,
	newsSearch: NewsSearchResponseSchema,
} as const;
