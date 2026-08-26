import { z } from 'zod';

// 1. BETTERCONTACT_CHECK_CREDITS_BALANCE (credits.get)
const CreditsGetInputSchema = z.object({});
export type CreditsGetInput = z.infer<typeof CreditsGetInputSchema>;

const CreditsGetResponseSchema = z.object({
	success: z.boolean(),
	// API documents this as integer but returns it as a string in practice
	credits_left: z.coerce.number(),
	email: z.string().optional(),
});
export type CreditsGetResponse = z.infer<typeof CreditsGetResponseSchema>;

// 2. BETTERCONTACT_CREATE_LEAD_FINDER_SEARCH (leadFinder.create)

// Reusable: most filter fields have per-field include/exclude string arrays
const FilterStringArraySchema = z.object({
	include: z.array(z.string()).optional(),
	exclude: z.array(z.string()).optional(),
});

// Some fields also support exact_match (lead_job_title)
const FilterJobTitleSchema = FilterStringArraySchema.extend({
	exact_match: z.boolean().optional(),
});

// Range filters for funding dates (ISO strings) and amounts (numbers)
const FilterDateRangeSchema = z.object({
	gte: z.string().optional(),
	lte: z.string().optional(),
});

const FilterNumericRangeSchema = z.object({
	gte: z.number().optional(),
	lte: z.number().optional(),
});

// Filters with only include (no exclude): job posting sub-filters
const FilterIncludeOnlySchema = z.object({
	include: z.array(z.string()).optional(),
});

const LeadFinderFiltersSchema = z.object({
	// Company filters
	company: FilterStringArraySchema.optional(),
	company_linkedin_url: FilterStringArraySchema.optional(),
	company_industry: FilterStringArraySchema.optional(),
	company_hq_location: FilterStringArraySchema.optional(),
	company_technologies: FilterStringArraySchema.optional(),
	company_keywords: FilterStringArraySchema.optional(),
	company_description: FilterStringArraySchema.optional(),
	company_headcount_min: z.number().optional(),
	company_headcount_max: z.number().optional(),
	revenue_ranges: FilterStringArraySchema.optional(),
	last_funding_round_names: FilterStringArraySchema.optional(),
	last_funding_date_range: FilterDateRangeSchema.optional(),
	last_amount_raised_usd: FilterNumericRangeSchema.optional(),
	total_amount_raised_usd: FilterNumericRangeSchema.optional(),
	is_b2b: z.boolean().optional(),
	is_b2c: z.boolean().optional(),
	is_public: z.boolean().optional(),
	// Job posting filters
	job_post_titles: FilterIncludeOnlySchema.optional(),
	job_posting_countries: FilterIncludeOnlySchema.optional(),
	job_posting_locations: FilterIncludeOnlySchema.optional(),
	limit_per_company: z.number().optional(),
	// Lead/people filters
	lead_fullname: FilterStringArraySchema.optional(),
	lead_linkedin_url: FilterStringArraySchema.optional(),
	lead_job_title: FilterJobTitleSchema.optional(),
	lead_seniority: FilterStringArraySchema.optional(),
	lead_department: FilterStringArraySchema.optional(),
	lead_function: FilterStringArraySchema.optional(),
	lead_skills: FilterStringArraySchema.optional(),
	lead_location: FilterStringArraySchema.optional(),
});

const LeadFinderCreateInputSchema = z.object({
	filters: LeadFinderFiltersSchema,
	limit: z.number().min(1).max(200).optional(),
	offset: z.number().min(0).optional(),
	max_leads: z.number().min(1).max(200).optional(),
	webhook: z.string().optional().nullable(),
	enrich_email_address: z.boolean().optional(),
	enrich_phone_number: z.boolean().optional(),
});
export type LeadFinderCreateInput = z.infer<typeof LeadFinderCreateInputSchema>;

const LeadFinderCreateResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	request_id: z.string(),
});
export type LeadFinderCreateResponse = z.infer<
	typeof LeadFinderCreateResponseSchema
>;

// 3. BETTERCONTACT_GET_LEAD_FINDER_RESULTS (leadFinder.getResults)
const LeadFinderGetResultsInputSchema = z.object({
	request_id: z.string(),
});
export type LeadFinderGetResultsInput = z.infer<
	typeof LeadFinderGetResultsInputSchema
>;

const LeadFinderGetResultsResponseSchema = z
	.object({
		id: z.string().optional(),
		status: z
			.enum(['not_started', 'processing', 'on_hold', 'terminated'])
			.or(z.string()),
		message: z.string().optional(),
		// API returns these as strings ("50.0") despite documenting them as numbers
		credits_consumed: z.coerce.number().optional(),
		credits_left: z.coerce.number().optional(),
		summary: z.record(z.string(), z.unknown()).optional(),
		leads: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type LeadFinderGetResultsResponse = z.infer<
	typeof LeadFinderGetResultsResponseSchema
>;

// 4. BETTERCONTACT_ENRICH_LEADS (enrichment.enrich)
const EnrichmentEnrichInputSchema = z.object({
	data: z
		.array(
			z
				.object({
					first_name: z.string().optional(),
					last_name: z.string().optional(),
					company: z.string().optional(),
					company_domain: z.string().optional(),
					linkedin_url: z.string().optional(),
					custom_fields: z.record(z.string(), z.unknown()).optional(),
				})
				.passthrough(),
		)
		.min(1)
		.max(100),
	enrich_email_address: z.boolean().optional(),
	enrich_phone_number: z.boolean().optional(),
	enrich_profile: z.boolean().optional(),
	verify_catch_all: z.boolean().optional(),
	webhook: z.string().optional(),
	push_contact_individually: z.boolean().optional(),
	contact_webhook: z.string().optional(),
	process_flow: z.string().optional(),
	timeout_seconds: z.number().min(1).optional(),
});
export type EnrichmentEnrichInput = z.infer<typeof EnrichmentEnrichInputSchema>;

const EnrichmentEnrichResponseSchema = z
	.object({
		success: z.boolean(),
		id: z.string(),
		message: z.string().optional(),
	})
	.passthrough();
export type EnrichmentEnrichResponse = z.infer<
	typeof EnrichmentEnrichResponseSchema
>;

// 5. BETTERCONTACT_GET_ENRICHMENT_RESULTS (enrichment.getResults)
const EnrichmentGetResultsInputSchema = z.object({
	request_id: z.string(),
});
export type EnrichmentGetResultsInput = z.infer<
	typeof EnrichmentGetResultsInputSchema
>;

const EnrichmentGetResultsResponseSchema = z
	.object({
		id: z.string().optional(),
		status: z
			.enum(['not_started', 'processing', 'on_hold', 'terminated'])
			.or(z.string()),
		message: z.string().optional(),
		// API returns these as strings ("50.0") despite documenting them as numbers
		credits_consumed: z.coerce.number().optional(),
		credits_left: z.coerce.number().optional(),
		summary: z.record(z.string(), z.unknown()).optional(),
		data: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type EnrichmentGetResultsResponse = z.infer<
	typeof EnrichmentGetResultsResponseSchema
>;

export type BetterContactEndpointInputs = {
	creditsGet: CreditsGetInput;
	leadFinderCreate: LeadFinderCreateInput;
	leadFinderGetResults: LeadFinderGetResultsInput;
	enrichmentEnrich: EnrichmentEnrichInput;
	enrichmentGetResults: EnrichmentGetResultsInput;
};

export type BetterContactEndpointOutputs = {
	creditsGet: CreditsGetResponse;
	leadFinderCreate: LeadFinderCreateResponse;
	leadFinderGetResults: LeadFinderGetResultsResponse;
	enrichmentEnrich: EnrichmentEnrichResponse;
	enrichmentGetResults: EnrichmentGetResultsResponse;
};

export const BetterContactEndpointInputSchemas = {
	creditsGet: CreditsGetInputSchema,
	leadFinderCreate: LeadFinderCreateInputSchema,
	leadFinderGetResults: LeadFinderGetResultsInputSchema,
	enrichmentEnrich: EnrichmentEnrichInputSchema,
	enrichmentGetResults: EnrichmentGetResultsInputSchema,
} as const;

export const BetterContactEndpointOutputSchemas = {
	creditsGet: CreditsGetResponseSchema,
	leadFinderCreate: LeadFinderCreateResponseSchema,
	leadFinderGetResults: LeadFinderGetResultsResponseSchema,
	enrichmentEnrich: EnrichmentEnrichResponseSchema,
	enrichmentGetResults: EnrichmentGetResultsResponseSchema,
} as const;
