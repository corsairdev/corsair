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

// Responses are parsed loosely: NeverBounce documents every field as optional,
// and a field it starts returning as null or as a number must not fail a check
// that already spent a credit. Inputs above stay strict.
const optionalString = z.string().nullish();
const optionalCount = z.number().nullish();

const AddressInfoSchema = z.object({
	original_email: optionalString,
	normalized_email: optionalString,
	addr: optionalString,
	alias: optionalString,
	host: optionalString,
	fqdn: optionalString,
	domain: optionalString,
	subdomain: optionalString,
	tld: optionalString,
});

const CreditsInfoSchema = z.object({
	paid_credits_used: optionalCount,
	free_credits_used: optionalCount,
	paid_credits_remaining: optionalCount,
	free_credits_remaining: optionalCount,
});

const CheckResponseSchema = z.object({
	status: z.literal('success'),
	// valid, invalid, disposable, catchall or unknown; kept a plain string so
	// a result code NeverBounce adds later does not throw.
	result: optionalString,
	flags: z.array(z.string()).nullish(),
	suggested_correction: optionalString,
	address_info: AddressInfoSchema.nullish(),
	credits_info: CreditsInfoSchema.nullish(),
	execution_time: optionalCount,
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
