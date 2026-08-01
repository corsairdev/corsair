import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Email Validation — derived from GET emailreputation.abstractapi.com/v1
//
// Abstract's standalone Email Validation product isn't available on this
// account/plan, so this endpoint calls the Email Reputation API (which is
// available) and maps its deliverability/quality fields down to a simple
// validation-shaped result. See endpoints/email-validation.ts.
// ─────────────────────────────────────────────────────────────────────────────

export const EmailValidateInputSchema = z.object({
	/** The email address to validate */
	email: z.string().describe('The email address to validate'),
});

export type EmailValidateInput = z.infer<typeof EmailValidateInputSchema>;

export const EmailValidateResponseSchema = z.object({
	email: z.string(),
	/** Corrected email if Abstract detected a likely typo (empty string if none) */
	autocorrect: z.string(),
	/** Deliverability verdict, e.g. "deliverable", "undeliverable", "risky", "unknown" */
	deliverability: z.string(),
	/** 0.0–1.0 confidence score that the address is real and safe to send to */
	quality_score: z.number(),
	is_valid_format: z.boolean(),
	is_free_email: z.boolean(),
	is_disposable_email: z.boolean(),
	is_role_email: z.boolean(),
	is_catchall_email: z.boolean(),
	is_mx_found: z.boolean(),
	is_smtp_valid: z.boolean(),
});

export type EmailValidateResponse = z.infer<typeof EmailValidateResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Email Reputation — GET emailreputation.abstractapi.com/v1
// Docs: https://www.abstractapi.com/api/email-reputation-verification-api
// ─────────────────────────────────────────────────────────────────────────────

export const EmailReputationInputSchema = z.object({
	/** The email address to check */
	email: z.string().describe('The email address to check the reputation of'),
});

export type EmailReputationInput = z.infer<typeof EmailReputationInputSchema>;

const EmailDeliverabilitySchema = z.object({
	status: z.string(),
	status_detail: z.string(),
	is_format_valid: z.boolean(),
	is_smtp_valid: z.boolean(),
	is_mx_valid: z.boolean(),
	mx_records: z.array(z.string()).nullable().optional(),
});

const EmailQualitySchema = z
	.object({
		score: z.coerce.number(),
		is_free_email: z.boolean(),
		is_username_suspicious: z.boolean(),
		is_disposable: z.boolean(),
		is_catchall: z.boolean(),
		is_subaddress: z.boolean(),
		is_role: z.boolean().optional(),
		is_dmarc_enforced: z.boolean().optional(),
		is_spf_strict: z.boolean().optional(),
		minimum_age: z.number().nullable().optional(),
	})
	.loose();

const EmailSenderSchema = z
	.object({
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		email_provider_name: z.string().nullable().optional(),
		organization_name: z.string().nullable().optional(),
		organization_type: z.string().nullable().optional(),
	})
	.loose();

const EmailDomainSchema = z
	.object({
		// Abstract returns null for every field here (not just optional ones)
		// when the address itself is invalid — there's no domain to look up.
		domain: z.string().nullable(),
		domain_age: z.number().nullable().optional(),
		is_live_site: z.boolean().nullable().optional(),
		registrar: z.string().nullable().optional(),
		registrar_url: z.string().nullable().optional(),
		date_registered: z.string().nullable().optional(),
		date_last_renewed: z.string().nullable().optional(),
		date_expires: z.string().nullable().optional(),
		is_risky_tld: z.boolean().nullable().optional(),
	})
	.loose();

const EmailRiskSchema = z.object({
	// Also null for an invalid address — there's no address/domain to assess.
	address_risk_status: z.string().nullable(),
	domain_risk_status: z.string().nullable(),
});

const BreachedDomainSchema = z.object({
	domain: z.string(),
	breach_date: z.string().nullable().optional(),
});

const EmailBreachesSchema = z
	.object({
		// null for an invalid address — Abstract never ran a breach lookup.
		total_breaches: z.number().nullable(),
		date_first_breached: z.string().nullable().optional(),
		date_last_breached: z.string().nullable().optional(),
		breached_domains: z.array(BreachedDomainSchema).optional(),
	})
	.loose();

export const EmailReputationResponseSchema = z.object({
	email_address: z.string(),
	suggested_correction: z.string().nullable().optional(),
	email_deliverability: EmailDeliverabilitySchema,
	email_quality: EmailQualitySchema,
	email_sender: EmailSenderSchema,
	email_domain: EmailDomainSchema,
	email_risk: EmailRiskSchema,
	email_breaches: EmailBreachesSchema.optional(),
});

export type EmailReputationResponse = z.infer<
	typeof EmailReputationResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// VAT Categories — GET vat.abstractapi.com/v1/categories
// Docs: https://www.abstractapi.com/api/vat-validation-rates-api
// ─────────────────────────────────────────────────────────────────────────────

export const VatGetCategoriesInputSchema = z.object({
	/** ISO 3166-1 alpha-2 country code, e.g. "DE" */
	countryCode: z
		.string()
		.regex(/^[A-Z]{2}$/, 'Must be an uppercase ISO 3166-1 alpha-2 country code')
		.describe('ISO 3166-1 alpha-2 country code, e.g. "DE"'),
});

export type VatGetCategoriesInput = z.infer<typeof VatGetCategoriesInputSchema>;

const VatCategorySchema = z.object({
	country_code: z.string(),
	/** Decimal rate as a string, e.g. "0.070" for 7% */
	rate: z.string(),
	category: z.string(),
	description: z.string(),
});

export const VatGetCategoriesResponseSchema = z.array(VatCategorySchema);

export type VatGetCategoriesResponse = z.infer<
	typeof VatGetCategoriesResponseSchema
>;
export type VatCategory = z.infer<typeof VatCategorySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// IBAN Validation — GET ibanvalidation.abstractapi.com/v1
// Docs: https://www.abstractapi.com/api/iban-validation-api
// ─────────────────────────────────────────────────────────────────────────────

export const IbanValidateInputSchema = z.object({
	/** The IBAN to validate, with or without spaces */
	iban: z.string().describe('The IBAN to validate'),
});

export type IbanValidateInput = z.infer<typeof IbanValidateInputSchema>;

export const IbanValidateResponseSchema = z.object({
	iban: z.string(),
	is_valid: z.boolean(),
});

export type IbanValidateResponse = z.infer<typeof IbanValidateResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type AbstractEndpointInputs = {
	emailValidate: EmailValidateInput;
	emailReputation: EmailReputationInput;
	vatGetCategories: VatGetCategoriesInput;
	ibanValidate: IbanValidateInput;
};

export type AbstractEndpointOutputs = {
	emailValidate: EmailValidateResponse;
	emailReputation: EmailReputationResponse;
	vatGetCategories: VatGetCategoriesResponse;
	ibanValidate: IbanValidateResponse;
};

export const AbstractEndpointInputSchemas = {
	emailValidate: EmailValidateInputSchema,
	emailReputation: EmailReputationInputSchema,
	vatGetCategories: VatGetCategoriesInputSchema,
	ibanValidate: IbanValidateInputSchema,
} as const;

export const AbstractEndpointOutputSchemas = {
	emailValidate: EmailValidateResponseSchema,
	emailReputation: EmailReputationResponseSchema,
	vatGetCategories: VatGetCategoriesResponseSchema,
	ibanValidate: IbanValidateResponseSchema,
} as const;
