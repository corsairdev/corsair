import { z } from 'zod';

export const CheckInputSchema = z.object({
	email: z.email().describe('The email address to validate and verify'),
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
	did_you_mean: z.string(),
	user: z.string(),
	domain: z.string(),
	format_valid: z.boolean(),
	mx_found: z.boolean(),
	smtp_check: z.boolean(),
	catch_all: z.boolean().nullable(),
	role: z.boolean(),
	disposable: z.boolean(),
	free: z.boolean(),
	score: z.number().min(0).max(1),
});

export type CheckResponse = z.infer<typeof CheckResponseSchema>;

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
