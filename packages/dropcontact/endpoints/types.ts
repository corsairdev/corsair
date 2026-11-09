import { z } from 'zod';

// Inputs follow the OpenAPI spec at developer.dropcontact.com/openapi.json and
// the input-record reference. Outputs are `.loose()` with their fields
// nullish, because Dropcontact only sends populated attributes: the enriched
// record reference says nothing is forced to null. Field reference:
// https://developer.dropcontact.com/en/reference/input-record/

// ── Shared pieces ────────────────────────────────────────────────────────────

/** Every route but `DELETE /v1/enrich/webhook` answers with these. */
const EnvelopeFields = {
	error: z.boolean().nullish(),
	success: z.boolean().nullish(),
};

const RecordErrorsSchema = z
	.object({
		unexpected_field: z
			.array(z.string())
			.nullish()
			.describe(
				'Submitted keys Dropcontact does not recognize; they were ignored.',
			),
		only_contact_data: z
			.boolean()
			.nullish()
			.describe(
				'The record had contact data but no usable company identifier, email or LinkedIn URL, so no email could be found.',
			),
	})
	.loose();

const RecordWarningsSchema = z
	.object({
		empty_field: z
			.array(z.string())
			.nullish()
			.describe('Submitted keys whose value was empty.'),
		only_organization_data: z
			.boolean()
			.nullish()
			.describe(
				'The record had company data but no person, so only the company was enriched.',
			),
	})
	.loose();

export type RecordErrors = z.infer<typeof RecordErrorsSchema>;
export type RecordWarnings = z.infer<typeof RecordWarningsSchema>;

/** The documented input fields, each nullable in the spec. */
const INPUT_RECORD_FIELDS = [
	'first_name',
	'last_name',
	'full_name',
	'civility',
	'email',
	'linkedin',
	'job',
	'job_function',
	'job_level',
	'mobile_phone',
	'location',
	'company',
	'website',
	'siret_address',
	'siret_zip',
	'siret_city',
	'country',
	'company_linkedin',
	'phone',
	'company_turnover',
	'company_results',
	'nb_employees',
	'num_siren',
	'siret',
	'naf5_code',
	'naf5_des',
	'vat',
	'industry',
	'employee_count',
] as const;

const InputRecordShape = Object.fromEntries(
	INPUT_RECORD_FIELDS.map((field) => [field, z.string().nullish()]),
) as Record<
	(typeof INPUT_RECORD_FIELDS)[number],
	z.ZodOptional<z.ZodNullable<z.ZodString>>
>;

/** Company identifiers that let Dropcontact find an email with no address. */
const COMPANY_IDENTIFIERS = [
	'company',
	'website',
	'company_linkedin',
	'num_siren',
	'siret',
] as const;

/**
 * One contact to enrich.
 *
 * Extra keys are kept, because the provider's own answer to an unknown key is
 * a per-record `unexpected_field` error rather than a rejected request. The
 * documented fields are typed so an agent sees them, and `custom_fields` holds
 * anything the caller wants echoed back.
 */
const InputRecordSchema = z
	.object({
		...InputRecordShape,
		custom_fields: z
			.record(z.string(), z.string().nullish())
			.nullish()
			.describe('Arbitrary values, echoed unchanged in the enriched result.'),
	})
	.loose()
	.superRefine((record, ctx) => {
		// The docs: a record needs at least one company identifier, an email, or
		// the person's LinkedIn URL. Anything else is accepted by the API and
		// then answered with `only_contact_data`, which costs a round trip.
		const hasCompany = COMPANY_IDENTIFIERS.some((key) => {
			const value = record[key];
			return typeof value === 'string' && value.trim() !== '';
		});
		const hasEmail =
			typeof record.email === 'string' && record.email.trim() !== '';
		const hasLinkedin =
			typeof record.linkedin === 'string' && record.linkedin.trim() !== '';
		if (hasCompany || hasEmail || hasLinkedin) return;
		ctx.addIssue({
			code: 'custom',
			path: ['company'],
			message: `A record needs one of ${COMPANY_IDENTIFIERS.join(', ')}, an email, or a LinkedIn URL, or Dropcontact cannot look up an address.`,
		});
	});

export type DropcontactInputRecord = z.infer<typeof InputRecordSchema>;

/**
 * Dropcontact's documented ceiling is 15 kB of data per record, `custom_fields`
 * included, and it answers 400
 * `Data size is too big, you can only submit up to 15 kB of data in a single record`.
 *
 * Measured as UTF-8 bytes of the serialized record, which is what goes on the
 * wire. The provider does not say whether it counts bytes or characters; bytes
 * is the stricter reading, so a record it accepts is never rejected here.
 */
export const DROPCONTACT_MAX_RECORD_BYTES = 15_000;

/** UTF-8 byte length of one submitted record, as it will be serialized. */
export function recordBytes(record: DropcontactInputRecord): number {
	return new TextEncoder().encode(JSON.stringify(record) ?? '').length;
}

/** Up to 15 kB of data per record, `custom_fields` included. */
export const DROPCONTACT_MAX_RECORDS = 250;

/** Documented: 60 requests per second. */
export const DROPCONTACT_RATE_LIMIT_PER_SECOND = 60;

// ── enrichment.enrich ───────────────────────────────────────────────────────

const EnrichInputSchema = z
	.object({
		data: z
			.array(InputRecordSchema)
			.min(1)
			.max(
				DROPCONTACT_MAX_RECORDS,
				`Dropcontact accepts at most ${DROPCONTACT_MAX_RECORDS} records per request; split larger batches.`,
			)
			.describe(
				`Up to ${DROPCONTACT_MAX_RECORDS} contacts. Enrichment runs as a batch, so the call returns a request_id rather than results.`,
			),
		siren: z
			.boolean()
			.optional()
			.describe('Ask for French SIREN company data. Defaults to false.'),
		language: z
			.string()
			.min(2)
			.optional()
			.describe(
				'Language for the qualifications and civility in the result, such as "en" or "fr". Defaults to "fr".',
			),
		custom_callback_url: z
			.url()
			.max(2083)
			.optional()
			.describe(
				'Where to POST the results once the batch finishes. Overrides the account default for this request only.',
			),
		hashed_inputs: z
			.boolean()
			.optional()
			.describe(
				'Ask for the hashed inputs in the response. Sent as the `hashedInputs` query parameter.',
			),
	})
	.superRefine((value, ctx) => {
		// Checked at this level rather than per record, because only this level
		// knows the index, which is what names the offending record.
		value.data.forEach((record, index) => {
			const bytes = recordBytes(record);
			if (bytes <= DROPCONTACT_MAX_RECORD_BYTES) return;
			ctx.addIssue({
				code: 'custom',
				path: ['data', index],
				message: `Record ${index} is ${bytes} bytes; Dropcontact accepts at most ${DROPCONTACT_MAX_RECORD_BYTES} per record, custom_fields included.`,
			});
		});
	});

export type EnrichInput = z.input<typeof EnrichInputSchema>;

/** A per-record note on the submission, keyed by the record's index. */
const PostRecordSchema = z
	.object({
		index: z.number(),
		errors: RecordErrorsSchema.nullish(),
		warnings: RecordWarningsSchema.nullish(),
	})
	.loose();

export type PostRecord = z.infer<typeof PostRecordSchema>;

const EnrichResponseSchema = z.object({
	request_id: z
		.string()
		.describe('Pass this to `enrichment.results` to read the batch.'),
	creditsLeft: z.number().nullish().describe('The balance after this request.'),
	hashed_inputs: z
		.array(z.string())
		.nullish()
		.describe('Present only when `hashed_inputs` was set.'),
	records: z
		.array(PostRecordSchema)
		.nullish()
		.describe(
			'The `data` array: per-record notes keyed by index. An entry here does not mean the submission failed.',
		),
	error: z.boolean().nullish(),
	success: z.boolean().nullish(),
});

export type EnrichResponse = z.infer<typeof EnrichResponseSchema>;

// ── enrichment.results ──────────────────────────────────────────────────────

const ResultsInputSchema = z.object({
	request_id: z
		.string()
		.min(1)
		.describe('The id `enrichment.enrich` returned.'),
	force_results: z
		.boolean()
		.optional()
		.describe(
			'Return whatever has already been enriched instead of asking you to retry. Adds a `status` per record (`ready` or `in_progress`).',
		),
});

export type ResultsInput = z.input<typeof ResultsInputSchema>;

const EmailResultSchema = z.object({
	email: z.string(),
	qualification: z
		.string()
		.describe(
			'`localpart@domain`, such as `nominatif@pro`. Localpart: nominatif, catch-all, generique, Ne_Pas_Contacter, non_validé, invalide. Domain: pro, perso, school, jetable, invalid domain.',
		),
});

export type EmailResult = z.infer<typeof EmailResultSchema>;

const EnrichedRecordSchema = z
	.object({
		...InputRecordShape,
		// Input and output disagree on two names: `num_siren` comes back as
		// `siren`, and `email` becomes a list of qualified objects.
		email: z.array(EmailResultSchema).nullish(),
		siren: z.string().nullish().describe('The input `num_siren`.'),
		custom_fields: z.record(z.string(), z.string().nullish()).nullish(),
		company_change: z
			.string()
			.nullish()
			.describe(
				'The previous company name, when a company change was detected.',
			),
		errors: RecordErrorsSchema.nullish(),
		warnings: RecordWarningsSchema.nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'`ready` or `in_progress`, present only when `force_results` was set.',
			),
	})
	.loose();

export type EnrichedRecord = z.infer<typeof EnrichedRecordSchema>;

const ResultsResponseSchema = z.object({
	records: z
		.array(EnrichedRecordSchema)
		.describe(
			'One entry per submitted record, in the order they were sent. Empty while a batch has not produced anything yet.',
		),
	creditsLeft: z.number().nullish(),
	status: z
		.string()
		.describe(
			'`ready` once the batch has finished, `in_progress` while Dropcontact is still processing. Dropcontact sets this field only when `force_results` is passed, so it is derived from `success` otherwise.',
		),
	error: z.boolean().nullish(),
	success: z
		.boolean()
		.describe(
			'Whether this read returned usable records. It is not a completion flag: a forced partial read is successful with `status: in_progress`. A false value is a normal poll result while a batch runs, so the call returns rather than throwing.',
		),
	reason: z
		.string()
		.nullish()
		.describe(
			'Present when `success` is false, such as "Request not ready yet".',
		),
});

export type ResultsResponse = z.infer<typeof ResultsResponseSchema>;

// ── account.credits ─────────────────────────────────────────────────────────

const CreditsInputSchema = z.object({});

export type CreditsInput = z.input<typeof CreditsInputSchema>;

const CreditsResponseSchema = z.object({
	credits: z.number().describe('Enrichment credits left on the account.'),
});

export type CreditsResponse = z.infer<typeof CreditsResponseSchema>;

// ── webhook.get ─────────────────────────────────────────────────────────────

const WebhookGetInputSchema = z.object({});

export type WebhookGetInput = z.input<typeof WebhookGetInputSchema>;

const WebhookGetResponseSchema = z.object({
	callback_url: z
		.string()
		.nullish()
		.describe('The account default, or null when none is set.'),
	error: z.boolean().nullish(),
	success: z.boolean().nullish(),
});

export type WebhookGetResponse = z.infer<typeof WebhookGetResponseSchema>;

// ── webhook.set ─────────────────────────────────────────────────────────────

const WebhookSetInputSchema = z.object({
	callback_url: z
		.url()
		.min(1)
		.max(2083)
		.describe(
			'Where to POST results for every request that does not carry its own `custom_callback_url`.',
		),
});

export type WebhookSetInput = z.input<typeof WebhookSetInputSchema>;

const WebhookSetResponseSchema = z.object({
	callback_url: z.string(),
	error: z.boolean().nullish(),
	success: z.boolean().nullish(),
});

export type WebhookSetResponse = z.infer<typeof WebhookSetResponseSchema>;

// ── webhook.remove ──────────────────────────────────────────────────────────

const WebhookRemoveInputSchema = z.object({});

export type WebhookRemoveInput = z.input<typeof WebhookRemoveInputSchema>;

const WebhookRemoveResponseSchema = z.object({
	detail: z.string().describe("Dropcontact's confirmation message."),
});

export type WebhookRemoveResponse = z.infer<typeof WebhookRemoveResponseSchema>;

// ── Registry ────────────────────────────────────────────────────────────────

export type DropcontactEndpointInputs = {
	enrichmentEnrich: z.input<typeof EnrichInputSchema>;
	enrichmentResults: z.input<typeof ResultsInputSchema>;
	accountCredits: z.input<typeof CreditsInputSchema>;
	webhookGet: z.input<typeof WebhookGetInputSchema>;
	webhookSet: z.input<typeof WebhookSetInputSchema>;
	webhookRemove: z.input<typeof WebhookRemoveInputSchema>;
};

export type DropcontactEndpointOutputs = {
	enrichmentEnrich: EnrichResponse;
	enrichmentResults: ResultsResponse;
	accountCredits: CreditsResponse;
	webhookGet: WebhookGetResponse;
	webhookSet: WebhookSetResponse;
	webhookRemove: WebhookRemoveResponse;
};

export const DropcontactEndpointInputSchemas = {
	enrichmentEnrich: EnrichInputSchema,
	enrichmentResults: ResultsInputSchema,
	accountCredits: CreditsInputSchema,
	webhookGet: WebhookGetInputSchema,
	webhookSet: WebhookSetInputSchema,
	webhookRemove: WebhookRemoveInputSchema,
} as const;

export const DropcontactEndpointOutputSchemas = {
	enrichmentEnrich: EnrichResponseSchema,
	enrichmentResults: ResultsResponseSchema,
	accountCredits: CreditsResponseSchema,
	webhookGet: WebhookGetResponseSchema,
	webhookSet: WebhookSetResponseSchema,
	webhookRemove: WebhookRemoveResponseSchema,
} as const;
