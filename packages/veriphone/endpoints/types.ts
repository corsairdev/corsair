import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────────────────────

// ISO 3166-1 alpha-2, normalized to uppercase so 'us' and 'US' behave alike.
export const CountryCodeSchema = z
	.string()
	.trim()
	.length(2)
	.regex(/^[A-Za-z]{2}$/, 'expected a 2-letter country code')
	.transform((value) => value.toUpperCase());

export type CountryCode = z.infer<typeof CountryCodeSchema>;

// Line types documented across v2 (`/v2/verify` response table) and v3
// (`/v3/verify` response fields). Docs: https://veriphone.io/docs/v3#verify
export const PhoneTypeSchema = z.enum([
	'mobile',
	'fixed_line',
	'fixed_line_or_mobile',
	'toll_free',
	'premium_rate',
	'shared_cost',
	'voip',
	'short_code',
	'emergency',
	'unknown',
]);

export type PhoneType = z.infer<typeof PhoneTypeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// verifyPhoneNumber — GET /v3/verify
// Current docs: https://veriphone.io/docs/v3#verify
// (The v2 page states new integrations must use v3.)
// ─────────────────────────────────────────────────────────────────────────────

export const VerifyPhoneNumberInputSchema = z.object({
	phone: z
		.string()
		.trim()
		.min(4)
		.max(25)
		.refine(
			(value) => {
				const digits = value.replace(/\D/g, '');
				return digits.length >= 4 && digits.length <= 20;
			},
			{ message: 'expected 4 to 20 digits' },
		)
		.describe(
			'Phone number to verify. International E.164 format recommended.',
		),
	default_country: CountryCodeSchema.optional().describe(
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

export type VerifyPhoneNumberInput = z.infer<
	typeof VerifyPhoneNumberInputSchema
>;

export const VerifyPhoneNumberResponseSchema = z.object({
	status: z.enum(['success', 'error', 'syntax-error']),
	phone_valid: z.boolean(),
	phone: z.string().optional(),
	reason: z
		.enum([
			'too_short',
			'too_long',
			'invalid_length',
			'invalid_country_code',
			'unrecognized_range',
			'not_a_number',
		])
		.optional(),
	phone_type: PhoneTypeSchema.optional(),
	shortcode_cost: z
		.enum(['toll_free', 'standard_rate', 'premium_rate', 'unknown'])
		.optional(),
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

export type VerifyPhoneNumberResponse = z.infer<
	typeof VerifyPhoneNumberResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// getExamplePhoneNumber — GET /v2/example
// Honest caveat: this endpoint is absent from the official v2/v3 references
// fetched 2026-09-09 (they list only verify/credits/plan and
// verify/credits/coverage). It is documented by the RapidAPI Veriphone mirror
// with query params `type` + `country_code` and the response shape below.
// ─────────────────────────────────────────────────────────────────────────────

export const ExamplePhoneTypeSchema = z.enum([
	'mobile',
	'fixed_line',
	'toll_free',
	'premium_rate',
	'shared_cost',
	'voip',
]);

export type ExamplePhoneType = z.infer<typeof ExamplePhoneTypeSchema>;

export const GetExamplePhoneNumberInputSchema = z.object({
	country_code: CountryCodeSchema.describe(
		'ISO 3166-1 alpha-2 country code, e.g. US. Confirm it before calling.',
	),
	type: ExamplePhoneTypeSchema.optional().describe(
		'Example number line type. Defaults to mobile when omitted.',
	),
});

export type GetExamplePhoneNumberInput = z.infer<
	typeof GetExamplePhoneNumberInputSchema
>;

export const GetExamplePhoneNumberResponseSchema = z.object({
	status: z.enum(['success', 'error']),
	// Live evidence 2026-09-09: /v2/example returns UPPERCASE ("MOBILE")
	// while mirrors document lowercase, so normalize before the enum check.
	phone_type: z
		.string()
		.transform((value) => value.toLowerCase())
		.pipe(PhoneTypeSchema),
	country_code: z.string(),
	country_prefix: z.string().optional(),
	international_number: z.string().optional(),
	local_number: z.string().optional(),
	// Some mirrors render this key uppercase (`E164`); accept both.
	e164: z.string().optional(),
	E164: z.string().optional(),
});

export type GetExamplePhoneNumberResponse = z.infer<
	typeof GetExamplePhoneNumberResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// credits — GET /v3/credits
// Docs: https://veriphone.io/docs/v3#v3credits
// Live-verified 2026-09-09: all scalar fields present; last_reset is an
// object in v3 (a string in v2), usage splits static/current.
// ─────────────────────────────────────────────────────────────────────────────

export const CreditsInputSchema = z.object({});

export type CreditsInput = z.infer<typeof CreditsInputSchema>;

export const CreditsResponseSchema = z.object({
	email: z.string(),
	counter: z.number(),
	active: z.boolean(),
	payg: z.number(),
	limit: z.number(),
	plan: z.string(),
	renew: z.number(),
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
// coverage — GET /v3/coverage/current
// Docs: https://veriphone.io/docs/v3#v3coveragecurrent
// Live-verified 2026-09-09: { countries: [{ iso, covered }], updatedAt }.
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
	verifyPhoneNumber: VerifyPhoneNumberInput;
	getExamplePhoneNumber: GetExamplePhoneNumberInput;
	credits: CreditsInput;
	coverage: CoverageInput;
};

export type VeriphoneEndpointOutputs = {
	verifyPhoneNumber: VerifyPhoneNumberResponse;
	getExamplePhoneNumber: GetExamplePhoneNumberResponse;
	credits: CreditsResponse;
	coverage: CoverageResponse;
};

export const VeriphoneEndpointInputSchemas = {
	verifyPhoneNumber: VerifyPhoneNumberInputSchema,
	getExamplePhoneNumber: GetExamplePhoneNumberInputSchema,
	credits: CreditsInputSchema,
	coverage: CoverageInputSchema,
} as const;

export const VeriphoneEndpointOutputSchemas = {
	verifyPhoneNumber: VerifyPhoneNumberResponseSchema,
	getExamplePhoneNumber: GetExamplePhoneNumberResponseSchema,
	credits: CreditsResponseSchema,
	coverage: CoverageResponseSchema,
} as const;
