import { z } from 'zod';

// ── Shared shapes ────────────────────────────────────────────────────────────

const WizaStatusSchema = z
	.object({
		code: z.number(),
		message: z.string().optional(),
	})
	.loose();

const RevealStatusSchema = z.enum([
	'queued',
	'resolving',
	'finished',
	'failed',
]);

// ── credits.get ──────────────────────────────────────────────────────────────

const GetCreditsInputSchema = z.object({});

export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

const GetCreditsResponseSchema = z
	.object({
		credits: z
			.object({
				email_credits: z.union([z.number(), z.literal('unlimited')]),
				phone_credits: z.union([z.number(), z.literal('unlimited')]),
				export_credits: z.number().optional(),
				api_credits: z.number().optional(),
			})
			.loose(),
	})
	.loose();

export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

// ── individualReveals.start ──────────────────────────────────────────────────

const IndividualRevealIdentifierSchema = z
	.object({
		profile_url: z.string().optional(),
		full_name: z.string().optional(),
		company: z.string().optional(),
		domain: z.string().optional(),
		email: z.string().optional(),
	})
	.refine(
		(v) =>
			Boolean(
				v.profile_url || v.email || (v.full_name && (v.company || v.domain)),
			),
		{
			message:
				'Provide profile_url, email, or full_name with company or domain',
		},
	);

const StartIndividualRevealInputSchema = z.object({
	individual_reveal: IndividualRevealIdentifierSchema,
	enrichment_level: z.enum(['none', 'partial', 'phone', 'full']),
	email_options: z
		.object({
			accept_work: z.boolean().optional(),
			accept_personal: z.boolean().optional(),
		})
		.optional(),
	callback_url: z.string().optional(),
});

export type StartIndividualRevealInput = z.infer<
	typeof StartIndividualRevealInputSchema
>;

const StartIndividualRevealResponseSchema = z
	.object({
		status: WizaStatusSchema,
		type: z.string().optional(),
		data: z
			.object({
				id: z.number(),
				status: RevealStatusSchema,
				is_complete: z.boolean(),
			})
			.loose(),
	})
	.loose();

export type StartIndividualRevealResponse = z.infer<
	typeof StartIndividualRevealResponseSchema
>;

// ── individualReveals.get ────────────────────────────────────────────────────

const GetIndividualRevealInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export type GetIndividualRevealInput = z.infer<
	typeof GetIndividualRevealInputSchema
>;

const RevealEmailSchema = z
	.object({
		email: z.string(),
		email_type: z.string().optional(),
		email_status: z.string().optional(),
	})
	.loose();

const RevealPhoneSchema = z
	.object({
		number: z.string(),
		pretty_number: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();

const GetIndividualRevealResponseSchema = z
	.object({
		status: WizaStatusSchema,
		type: z.string().optional(),
		data: z
			.object({
				id: z.number(),
				status: RevealStatusSchema,
				is_complete: z.boolean(),
				name: z.string().nullable().optional(),
				company: z.string().nullable().optional(),
				enrichment_level: z.string().optional(),
				linkedin_profile_url: z.string().nullable().optional(),
				title: z.string().nullable().optional(),
				location: z.string().nullable().optional(),
				email: z.string().nullable().optional(),
				email_type: z.string().nullable().optional(),
				email_status: z.string().nullable().optional(),
				emails: z.array(RevealEmailSchema).optional(),
				mobile_phone: z.string().nullable().optional(),
				phone_number: z.string().nullable().optional(),
				phone_status: z.string().nullable().optional(),
				phones: z.array(RevealPhoneSchema).optional(),
				company_domain: z.string().nullable().optional(),
				company_industry: z.string().nullable().optional(),
				company_size: z.number().nullable().optional(),
				company_size_range: z.string().nullable().optional(),
				company_linkedin: z.string().nullable().optional(),
				company_location: z.string().nullable().optional(),
				credits: z.unknown().optional(),
			})
			.loose(),
	})
	.loose();

export type GetIndividualRevealResponse = z.infer<
	typeof GetIndividualRevealResponseSchema
>;

// ── lists.get ────────────────────────────────────────────────────────────────

const GetListInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export type GetListInput = z.infer<typeof GetListInputSchema>;

const GetListResponseSchema = z
	.object({
		status: WizaStatusSchema,
		type: z.string().optional(),
		data: z
			.object({
				id: z.number(),
				name: z.string().optional(),
				status: z.string(),
				stats: z.unknown().optional(),
				finished_at: z.string().nullable().optional(),
				created_at: z.string().optional(),
				enrichment_level: z.string().optional(),
				email_options: z.unknown().optional(),
				report_type: z.string().optional(),
			})
			.loose(),
	})
	.loose();

export type GetListResponse = z.infer<typeof GetListResponseSchema>;

// ── prospects.search ─────────────────────────────────────────────────────────

const FilterValueSchema = z
	.object({
		v: z.string(),
		s: z.enum(['i', 'e']).optional(),
		b: z.enum(['city', 'state', 'country']).optional(),
	})
	.loose();

const ProspectSearchInputSchema = z.object({
	size: z.number().int().min(0).max(30).optional(),
	filters: z
		.object({
			first_name: z.array(z.string()).optional(),
			last_name: z.array(z.string()).optional(),
			job_title: z.array(FilterValueSchema).optional(),
			job_title_level: z.array(z.string()).optional(),
			job_role: z.array(z.string()).optional(),
			location: z.array(FilterValueSchema).optional(),
			skill: z.array(z.string()).optional(),
			job_company: z.array(FilterValueSchema).optional(),
			past_company: z.array(FilterValueSchema).optional(),
			company_location: z.array(FilterValueSchema).optional(),
			company_industry: z.array(FilterValueSchema).optional(),
			company_size: z.array(z.string()).optional(),
		})
		.loose(),
});

export type ProspectSearchInput = z.infer<typeof ProspectSearchInputSchema>;

const ProspectProfileSchema = z
	.object({
		full_name: z.string().nullable().optional(),
		linkedin_url: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		job_title_role: z.string().nullable().optional(),
		job_title_sub_role: z.string().nullable().optional(),
		job_company_name: z.string().nullable().optional(),
		job_company_website: z.string().nullable().optional(),
		location_name: z.string().nullable().optional(),
	})
	.loose();

const ProspectSearchResponseSchema = z
	.object({
		status: WizaStatusSchema,
		data: z
			.object({
				total: z.number(),
				profiles: z.array(ProspectProfileSchema).optional(),
			})
			.loose(),
	})
	.loose();

export type ProspectSearchResponse = z.infer<
	typeof ProspectSearchResponseSchema
>;

// ── Registry ─────────────────────────────────────────────────────────────────

export type WizaEndpointInputs = {
	creditsGet: GetCreditsInput;
	individualRevealsStart: StartIndividualRevealInput;
	individualRevealsGet: GetIndividualRevealInput;
	listsGet: GetListInput;
	prospectsSearch: ProspectSearchInput;
};

export type WizaEndpointOutputs = {
	creditsGet: GetCreditsResponse;
	individualRevealsStart: StartIndividualRevealResponse;
	individualRevealsGet: GetIndividualRevealResponse;
	listsGet: GetListResponse;
	prospectsSearch: ProspectSearchResponse;
};

export const WizaEndpointInputSchemas = {
	creditsGet: GetCreditsInputSchema,
	individualRevealsStart: StartIndividualRevealInputSchema,
	individualRevealsGet: GetIndividualRevealInputSchema,
	listsGet: GetListInputSchema,
	prospectsSearch: ProspectSearchInputSchema,
} as const;

export const WizaEndpointOutputSchemas = {
	creditsGet: GetCreditsResponseSchema,
	individualRevealsStart: StartIndividualRevealResponseSchema,
	individualRevealsGet: GetIndividualRevealResponseSchema,
	listsGet: GetListResponseSchema,
	prospectsSearch: ProspectSearchResponseSchema,
} as const;
