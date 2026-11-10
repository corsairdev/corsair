import { z } from 'zod';

// Inputs

const ValidationsSingleInputSchema = z.object({
	email: z
		.string()
		.min(1)
		.describe(
			'The email address to validate. A malformed address is not an error: Mails.so answers it as undeliverable with reason invalid_format.',
		),
});

export type ValidationsSingleInput = z.input<
	typeof ValidationsSingleInputSchema
>;

const ValidationsBatchInputSchema = z.object({
	emails: z
		.array(z.string().min(1))
		.min(2)
		.refine((emails) => new Set(emails).size >= 2, {
			message: 'A batch needs at least 2 different emails',
		})
		.describe(
			'The addresses to validate. Mails.so refuses a batch with fewer than 2 different addresses (use validations.single for one). Needs a paid Mails.so plan.',
		),
});

export type ValidationsBatchInput = z.input<typeof ValidationsBatchInputSchema>;

const ValidationsGetBatchInputSchema = z.object({
	id: z
		.guid()
		.describe(
			'The batch job id returned by validations.batch, for example 3aace594-f454-42e4-9cb3-198b6253320c.',
		),
});

export type ValidationsGetBatchInput = z.input<
	typeof ValidationsGetBatchInputSchema
>;

// Outputs

/**
 * One validated address. Both validations.single and each entry of a batch's
 * `emails` use it. `result` and `reason` stay plain strings so a value
 * Mails.so adds later does not fail a call that already succeeded; the
 * documented results are deliverable, undeliverable, risky and a fourth for
 * checks that could not finish.
 */
export const MailssoEmailValidationSchema = z
	.object({
		id: z.string().describe('Id of the validation'),
		email: z.string().describe('The address that was validated'),
		username: z
			.string()
			.nullish()
			.describe('The part of the address before the @'),
		domain: z
			.string()
			.nullish()
			.describe('The part of the address after the @'),
		did_you_mean: z
			.string()
			.nullish()
			.describe('A suggested correction when the domain looks misspelled'),
		mx_record: z.string().nullish().describe('Mail server of the domain'),
		provider: z
			.string()
			.nullish()
			.describe('Mailbox provider, for example google_workspace'),
		score: z.number().nullish().describe('Overall validity score, 0 to 100'),
		isv_format: z.boolean().nullish().describe('The format is valid'),
		isv_domain: z.boolean().nullish().describe('The domain is valid'),
		isv_mx: z
			.boolean()
			.nullish()
			.describe('The MX record is valid; null when it was not checked'),
		isv_noblock: z.boolean().nullish().describe('Not on a block list'),
		isv_nocatchall: z
			.boolean()
			.nullish()
			.describe('The domain does not accept every address (not catch-all)'),
		isv_nogeneric: z
			.boolean()
			.nullish()
			.describe('Not a generic role address such as info@ or admin@'),
		is_disposable: z
			.boolean()
			.nullish()
			.describe('The address belongs to a disposable email service'),
		is_free: z
			.boolean()
			.nullish()
			.describe('The address belongs to a free email provider'),
		avatar: z.string().nullish().describe('Avatar URL, when one was found'),
		result: z
			.string()
			.describe(
				'Overall verdict: deliverable, undeliverable, risky, or a fourth value for checks that could not finish',
			),
		reason: z
			.string()
			.nullish()
			.describe(
				'Why Mails.so reached that verdict, for example accepted_email, invalid_domain, invalid_format or catch_all',
			),
	})
	.loose();

export type MailssoEmailValidation = z.output<
	typeof MailssoEmailValidationSchema
>;

// The job's `user` field is documented as "user information (if available)"
// and was null on every response seen, so it is not typed; `.loose()` passes it
// through untouched.
const BatchJobShape = {
	id: z.string().describe('Id of the batch job'),
	name: z.string().nullish().describe('Name of the batch job, often empty'),
	created_at: z.string().describe('When the job was created, ISO 8601'),
	updated_at: z.string().describe('When the job last changed, ISO 8601'),
	deleted_at: z
		.string()
		.nullish()
		.describe('When the job was deleted, if it was'),
	finished_at: z
		.string()
		.nullish()
		.describe('When the job finished; null while it is still running'),
	archived_at: z
		.string()
		.nullish()
		.describe('When the job was archived, if it was'),
	user_id: z.string().describe('Id of the account that started the job'),
	size: z.number().describe('Number of addresses in the batch'),
	progress: z
		.number()
		.nullish()
		.describe('Progress counter reported by Mails.so'),
	duration: z.number().nullish().describe('How long the job took'),
	duplicates: z.number().nullish().describe('Number of duplicate addresses'),
	type: z.string().nullish().describe('Kind of job; list for a batch'),
	file_type: z
		.string()
		.nullish()
		.describe('Set by Mails.so; empty on batches started with this plugin'),
	file_key: z
		.string()
		.nullish()
		.describe('Set by Mails.so; empty on batches started with this plugin'),
	skip_emails: z
		.boolean()
		.nullish()
		.describe('Set by Mails.so; true on batches started with this plugin'),
};

const ValidationsBatchOutputSchema = z
	.object({
		...BatchJobShape,
		status: z
			.string()
			.nullish()
			.describe('Job status; pending right after the job is created'),
	})
	.loose();

export type ValidationsBatchResponse = z.output<
	typeof ValidationsBatchOutputSchema
>;

/**
 * Status values of a batch job, as seen live: `pending` in the answer to the
 * POST, `processing` while the status read reports it running, and `completed`
 * once finished. Mails.so documents no failed status, so the job declaration in
 * index.ts lists none; a stuck job shows as a status that stays running with
 * `finished_at` still null.
 */
export const BATCH_STATUSES = {
	running: ['pending', 'processing'],
	done: ['completed'],
} as const;

// A job that is still running answers with only id, created_at and status, so
// the fields a finished job adds are optional here.
const ValidationsGetBatchOutputSchema = z
	.object({
		...BatchJobShape,
		updated_at: BatchJobShape.updated_at.nullish(),
		user_id: BatchJobShape.user_id.nullish(),
		size: BatchJobShape.size.nullish(),
		status: z
			.string()
			.describe(
				'Job status: processing while running, completed when finished',
			),
		stats: z
			.record(z.string(), z.number())
			.nullish()
			.describe(
				'Counts for a finished job: the total, one per verdict, and one per reason',
			),
		emails: z
			.array(MailssoEmailValidationSchema)
			.nullish()
			.describe(
				'One validation result per address; present on completed jobs, so treat it as absent while the job is processing',
			),
	})
	.loose();

export type ValidationsGetBatchResponse = z.output<
	typeof ValidationsGetBatchOutputSchema
>;

export type ValidationsSingleResponse = MailssoEmailValidation;

/** The `{ data, error }` envelope Mails.so wraps a single validation in. */
export const MailssoSingleEnvelopeSchema = z
	.object({
		data: MailssoEmailValidationSchema,
		error: z.null().optional(),
	})
	.loose();

export type MailssoEndpointInputs = {
	validationsSingle: ValidationsSingleInput;
	validationsBatch: ValidationsBatchInput;
	validationsGetBatch: ValidationsGetBatchInput;
};

export type MailssoEndpointOutputs = {
	validationsSingle: ValidationsSingleResponse;
	validationsBatch: ValidationsBatchResponse;
	validationsGetBatch: ValidationsGetBatchResponse;
};

export const MailssoEndpointInputSchemas = {
	validationsSingle: ValidationsSingleInputSchema,
	validationsBatch: ValidationsBatchInputSchema,
	validationsGetBatch: ValidationsGetBatchInputSchema,
} as const;

export const MailssoEndpointOutputSchemas = {
	validationsSingle: MailssoEmailValidationSchema,
	validationsBatch: ValidationsBatchOutputSchema,
	validationsGetBatch: ValidationsGetBatchOutputSchema,
} as const;
