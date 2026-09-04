import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// verify — GET /v3/verify
// Docs: https://veriphone.io/docs/v3#verify
// ─────────────────────────────────────────────────────────────────────────────

export const VerifyInputSchema = z.object({
	phone: z
		.string()
		.min(1)
		.describe(
			'Phone number to verify. International E.164 format recommended.',
		),
	default_country: z
		.string()
		.optional()
		.describe(
			'ISO 3166-1 alpha-2 country code used when the number has no international prefix.',
		),
	mode: z
		.enum(['static', 'current'])
		.optional()
		.describe(
			'static (default, 1 credit) or current (live registry lookup, 10 credits).',
		),
	record: z
		.boolean()
		.optional()
		.describe('true to save the result to the account verification history.'),
});

export type VerifyInput = z.infer<typeof VerifyInputSchema>;

export const VerifyResponseSchema = z.object({
	status: z.string(),
	phone: z.string().optional(),
	phone_valid: z.boolean().optional(),
	reason: z.string().optional(),
	phone_type: z.string().optional(),
	shortcode_cost: z.string().optional(),
	carrier: z.string().optional(),
	phone_region: z.string().optional(),
	country: z.string().optional(),
	country_code: z.string().optional(),
	country_prefix: z.string().optional(),
	international_number: z.string().optional(),
	local_number: z.string().optional(),
	e164: z.string().optional(),
	timezone: z.array(z.string()).optional(),
	geographical: z.boolean().optional(),
	mode: z.string().optional(),
	original_carrier: z.string().optional(),
	original_line_type: z.string().optional(),
	original_mccmnc: z.string().nullable().optional(),
	current_carrier: z.string().nullable().optional(),
	current_line_type: z.string().nullable().optional(),
	current_mccmnc: z.string().nullable().optional(),
	current_lookup: z.string().nullable().optional(),
	ported: z.boolean().nullable().optional(),
	carrier_data_source: z.string().nullable().optional(),
});

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// credits — GET /v3/credits
// Docs: https://veriphone.io/docs/v3#v3credits
// ─────────────────────────────────────────────────────────────────────────────

export const CreditsInputSchema = z.object({});

export type CreditsInput = z.infer<typeof CreditsInputSchema>;

export const CreditsResponseSchema = z.object({
	email: z.string().optional(),
	counter: z.number().optional(),
	active: z.boolean().optional(),
	payg: z.number().optional(),
	limit: z.number().optional(),
	plan: z.string().optional(),
	renew: z.number().optional(),
	last_reset: z
		.union([z.string(), z.object({ seconds: z.number(), nanos: z.number() })])
		.optional(),
	usage: z
		.object({
			static: z.object({ count: z.number(), credits: z.number() }).optional(),
			current: z.object({ count: z.number(), credits: z.number() }).optional(),
		})
		.optional(),
});

export type CreditsResponse = z.infer<typeof CreditsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// coverage — GET /v3/coverage/current (public, unauthenticated)
// Docs: https://veriphone.io/docs/v3#v3coveragecurrent
// ─────────────────────────────────────────────────────────────────────────────

export const CoverageInputSchema = z.object({});

export type CoverageInput = z.infer<typeof CoverageInputSchema>;

export const CoverageCountrySchema = z.object({
	iso: z.string(),
	covered: z.boolean(),
});

export type CoverageCountry = z.infer<typeof CoverageCountrySchema>;

export const CoverageResponseSchema = z.object({
	countries: z.array(CoverageCountrySchema),
	updatedAt: z.string().optional(),
});

export type CoverageResponse = z.infer<typeof CoverageResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint maps
// ─────────────────────────────────────────────────────────────────────────────

export type VeriphoneEndpointInputs = {
	verify: VerifyInput;
	credits: CreditsInput;
	coverage: CoverageInput;
};

export type VeriphoneEndpointOutputs = {
	verify: VerifyResponse;
	credits: CreditsResponse;
	coverage: CoverageResponse;
};

export const VeriphoneEndpointInputSchemas = {
	verify: VerifyInputSchema,
	credits: CreditsInputSchema,
	coverage: CoverageInputSchema,
} as const;

export const VeriphoneEndpointOutputSchemas = {
	verify: VerifyResponseSchema,
	credits: CreditsResponseSchema,
	coverage: CoverageResponseSchema,
} as const;
