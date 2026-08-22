import { z } from 'zod';

const VerifyEmailInputSchema = z.object({
	email: z.string(),
	verify: z.boolean().optional(),
	check_breach: z.boolean().optional(),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

const VerifyEmailResponseSchema = z.object({
	email: z.string(),
}).passthrough();
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

const ValidateDomainInputSchema = z.object({
	domain: z.string(),
});
export type ValidateDomainInput = z.infer<typeof ValidateDomainInputSchema>;

const ValidateDomainResponseSchema = z.object({
	domain: z.string(),
}).passthrough();
export type ValidateDomainResponse = z.infer<typeof ValidateDomainResponseSchema>;

export type MailcheckEndpointInputs = {
	verifyEmail: VerifyEmailInput;
	validateDomain: ValidateDomainInput;
};

export type MailcheckEndpointOutputs = {
	verifyEmail: VerifyEmailResponse;
	validateDomain: ValidateDomainResponse;
};

export const MailcheckEndpointInputSchemas = {
	verifyEmail: VerifyEmailInputSchema,
	validateDomain: ValidateDomainInputSchema,
} as const;

export const MailcheckEndpointOutputSchemas = {
	verifyEmail: VerifyEmailResponseSchema,
	validateDomain: ValidateDomainResponseSchema,
} as const;