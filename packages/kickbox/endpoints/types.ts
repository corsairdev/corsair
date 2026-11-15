import { z } from 'zod';

// Inputs use Kickbox's own parameter names. Outputs are `.loose()` with their
// documented fields nullish, so a field Kickbox adds or omits cannot fail a
// call that has already happened.
// Reference: https://docs.kickbox.com/docs/single-verification-api

/** The four results Kickbox assigns to an address. */
export const KICKBOX_RESULTS = [
	'deliverable',
	'undeliverable',
	'risky',
	'unknown',
] as const;

/**
 * The reasons Kickbox publishes. It may add another, so the output keeps the
 * field a plain string rather than failing a read on an unknown one.
 */
export const KICKBOX_REASONS = [
	'invalid_email',
	'invalid_domain',
	'rejected_email',
	'accepted_email',
	'low_quality',
	'low_deliverability',
	'no_connect',
	'timeout',
	'invalid_smtp',
	'unavailable_smtp',
	'unexpected_error',
] as const;

// ── verify.verify ─────────────────────────────────────────────────────────

const VerifyInputSchema = z.object({
	email: z
		.string()
		.min(3)
		.describe(
			'The address to verify. It is URL-encoded for you. Send a syntactically bad one to have Kickbox report `invalid_email` rather than rejecting it here.',
		),
	timeout: z
		.number()
		.int()
		.min(1)
		.max(30_000)
		.optional()
		.describe(
			'How long Kickbox may spend on the SMTP check, in milliseconds. Defaults to 6000, and 30000 is the ceiling.',
		),
});

export type VerifyInput = z.input<typeof VerifyInputSchema>;

const VerifyResponseSchema = z
	.object({
		// A result Kickbox adds later is kept as a string rather than failing a
		// verification that has already been charged.
		result: z
			.union([z.enum(KICKBOX_RESULTS), z.string()])
			.describe('`deliverable`, `undeliverable`, `risky` or `unknown`.'),
		reason: z
			.string()
			.nullish()
			.describe(
				'Why the result came out as it did, such as `accepted_email` or `rejected_email`.',
			),
		role: z
			.boolean()
			.nullish()
			.describe('True for a role address such as `support@example.com`.'),
		free: z
			.boolean()
			.nullish()
			.describe('True for a free provider such as gmail.com.'),
		disposable: z
			.boolean()
			.nullish()
			.describe('True when the domain is a known disposable one.'),
		accept_all: z
			.boolean()
			.nullish()
			.describe('True when the domain accepts every address it is offered.'),
		did_you_mean: z
			.string()
			.nullish()
			.describe('A suggested spelling when Kickbox spotted a likely typo.'),
		sendex: z
			.number()
			.nullish()
			.describe('A quality score from 0 (no quality) to 1 (perfect).'),
		email: z
			.string()
			.nullish()
			.describe('The address in normalized lower case.'),
		user: z.string().nullish(),
		domain: z.string().nullish(),
		success: z.literal(true),
		message: z.string().nullish(),
	})
	.loose();

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

// ── verify.disposable ─────────────────────────────────────────────────────

const DisposableInputSchema = z.object({
	address: z
		.string()
		.min(3)
		.describe(
			'An email address or a bare domain, such as `mailinator.com`. It is URL-encoded for you.',
		),
});

export type DisposableInput = z.input<typeof DisposableInputSchema>;

const DisposableResponseSchema = z
	.object({
		disposable: z
			.boolean()
			.describe('True when the domain is a known disposable one.'),
	})
	.loose();

export type DisposableResponse = z.infer<typeof DisposableResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KickboxEndpointInputs = {
	verify: VerifyInput;
	disposable: DisposableInput;
};

export type KickboxEndpointOutputs = {
	verify: VerifyResponse;
	disposable: DisposableResponse;
};

export const KickboxEndpointInputSchemas = {
	verify: VerifyInputSchema,
	disposable: DisposableInputSchema,
} as const;

export const KickboxEndpointOutputSchemas = {
	verify: VerifyResponseSchema,
	disposable: DisposableResponseSchema,
} as const;
