import { z } from 'zod';

const VerifyEmailInputSchema = z.object({
	email: z.string().email(),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

const VerifyEmailResponseSchema = z.object({
	email: z.string(),
	trustRate: z.number().int().min(0).max(100),
	mxExists: z.boolean(),
	smtpExists: z.boolean(),
	isNotDisposable: z.boolean(),
	isNotSmtpCatchAll: z.boolean(),
	gravatar: z.object({
		entries: z.array(
			z.object({
				profileUrl: z.string().url().optional(),
				preferredUsername: z.string().optional(),
				accounts: z.array(
					z.object({
						domain: z.string(),
					}),
				).optional(),
			}),
		).optional(),
	}).optional(),
});
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

const ValidateDomainInputSchema = z.object({
	domain: z.string(),
});
export type ValidateDomainInput = z.infer<typeof ValidateDomainInputSchema>;

const ValidateDomainResponseSchema = z.object({
	email: z.string(),
	trustRate: z.number().int().min(0).max(100),
	mxExists: z.boolean(),
	smtpExists: z.boolean(),
	isNotDisposable: z.boolean(),
	isNotSmtpCatchAll: z.boolean(),
});
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