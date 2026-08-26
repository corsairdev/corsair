import { z } from 'zod';

// 1. BETTERCONTACT_CHECK_CREDITS_BALANCE (credits.get)
const CreditsGetInputSchema = z.object({});
export type CreditsGetInput = z.infer<typeof CreditsGetInputSchema>;

const CreditsGetResponseSchema = z.object({
	success: z.boolean(),
	credits_left: z.number(),
	email: z.string().optional(),
});
export type CreditsGetResponse = z.infer<typeof CreditsGetResponseSchema>;

// 2. BETTERCONTACT_CREATE_LEAD_FINDER_SEARCH (leadFinder.create)
const LeadFinderCreateInputSchema = z.object({
	filters: z.record(z.string(), z.unknown()),
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
		credits_consumed: z.number().optional(),
		credits_left: z.number().optional(),
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
		status: z.enum(['processing', 'on_hold', 'terminated']).or(z.string()),
		message: z.string().optional(),
		credits_consumed: z.number().optional(),
		credits_left: z.number().optional(),
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
