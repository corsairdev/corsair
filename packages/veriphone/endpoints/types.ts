import { z } from 'zod';

const VerifyInputSchema = z.object({
	phone: z.string(),
	default_country: z.string().optional(),
	mode: z.enum(['static', 'current']).optional(),
	record: z.boolean().optional(),
});

export type VerifyInput = z.infer<typeof VerifyInputSchema>;

const VerifyResponseSchema = z.object({
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
	current_carrier: z.string().optional(),
	current_line_type: z.string().optional(),
	ported: z.boolean().optional(),
});

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

export type VeriphoneEndpointInputs = {
	verify: VerifyInput;
};

export type VeriphoneEndpointOutputs = {
	verify: VerifyResponse;
};

export const VeriphoneEndpointInputSchemas = {
	verify: VerifyInputSchema,
} as const;

export const VeriphoneEndpointOutputSchemas = {
	verify: VerifyResponseSchema,
} as const;
