import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Email Check — GET apilayer.net/api/check
// Docs: https://docs.apilayer.com/mailboxlayer/docs/api-documentation
// ─────────────────────────────────────────────────────────────────────────────

export const CheckInputSchema = z.object({
	/** The email address to validate and verify */
	email: z.string().describe('The email address to validate and verify'),
	/**
	 * Whether to run mailboxlayer's real-time SMTP check. Defaults to true.
	 * Disable for a faster, format/MX-only check.
	 */
	smtp: z
		.boolean()
		.optional()
		.describe(
			'Whether to run a real-time SMTP check (default true). Set to false for a faster format/MX-only check.',
		),
});

export type CheckInput = z.infer<typeof CheckInputSchema>;

export const CheckResponseSchema = z.object({
	email: z.string(),
	/** Suggested correction for a likely typo (empty string if none) */
	did_you_mean: z.string(),
	/** Local part of the email address, before the @ */
	user: z.string(),
	/** Domain part of the email address, after the @ */
	domain: z.string(),
	format_valid: z.boolean(),
	mx_found: z.boolean(),
	smtp_check: z.boolean(),
	/** Whether the domain accepts mail for any address (null if undetermined) */
	catch_all: z.boolean().nullable(),
	role: z.boolean(),
	disposable: z.boolean(),
	free: z.boolean(),
	/** 0.0-1.0 quality/deliverability score */
	score: z.number(),
});

export type CheckResponse = z.infer<typeof CheckResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type MailboxLayerEndpointInputs = {
	check: CheckInput;
};

export type MailboxLayerEndpointOutputs = {
	check: CheckResponse;
};

export const MailboxLayerEndpointInputSchemas = {
	check: CheckInputSchema,
} as const;

export const MailboxLayerEndpointOutputSchemas = {
	check: CheckResponseSchema,
} as const;
