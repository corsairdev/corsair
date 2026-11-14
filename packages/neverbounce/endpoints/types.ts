import { z } from 'zod';

const CheckInputSchema = z.object({
	email: z
		.string()
		.min(1)
		.describe(
			'Email address to verify, including invalid addresses for syntax checking',
		),
	address_info: z
		.number()
		.int()
		.optional()
		.describe('Include address details (default 0)'),
	credits_info: z
		.number()
		.int()
		.optional()
		.describe('Include credit details (default 0)'),
	timeout: z
		.number()
		.int()
		.optional()
		.describe('Maximum verification time in seconds'),
});

const AddressInfoSchema = z.object({
	original_email: z.string().optional(),
	normalized_email: z.string().optional(),
	addr: z.string().optional(),
	alias: z.string().optional(),
	host: z.string().optional(),
	fqdn: z.string().optional(),
	domain: z.string().optional(),
	subdomain: z.string().optional(),
	tld: z.string().optional(),
});

const CreditsInfoSchema = z.object({
	paid_credits_used: z.number().int().optional(),
	free_credits_used: z.number().int().optional(),
	paid_credits_remaining: z.number().int().optional(),
	free_credits_remaining: z.number().int().optional(),
});

const CheckResponseSchema = z.object({
	status: z.literal('success'),
	result: z.string().optional(),
	flags: z.array(z.string()).optional(),
	suggested_correction: z.string().optional(),
	address_info: AddressInfoSchema.optional(),
	credits_info: CreditsInfoSchema.optional(),
	execution_time: z.number().int().optional(),
});

export type CheckInput = z.infer<typeof CheckInputSchema>;
export type CheckResponse = z.infer<typeof CheckResponseSchema>;
export type NeverBounceEndpointInputs = { check: CheckInput };
export type NeverBounceEndpointOutputs = { check: CheckResponse };
export const NeverBounceEndpointInputSchemas = {
	check: CheckInputSchema,
} as const;
export const NeverBounceEndpointOutputSchemas = {
	check: CheckResponseSchema,
} as const;
