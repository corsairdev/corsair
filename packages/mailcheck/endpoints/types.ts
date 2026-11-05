import { z } from 'zod';

const VerifyEmailInputSchema = z.object({
	email: z.string().email(),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

const GravatarEntrySchema = z.object({
	profileUrl: z.string().url().optional(),
	preferredUsername: z.string().optional(),
	accounts: z
		.array(
			z.object({
				domain: z.string(),
			}),
		)
		.optional(),
});

export const VerificationResultSchema = z.looseObject({
	email: z.string(),
	trustRate: z.number().int().min(0).max(100),
	mxExists: z.boolean(),
	smtpExists: z.boolean(),
	isNotDisposable: z.boolean(),
	isNotSmtpCatchAll: z.boolean(),
	gravatar: z
		.object({
			entries: z.array(GravatarEntrySchema).optional(),
		})
		.nullable()
		.optional(),
});

const VerifyEmailResponseSchema = VerificationResultSchema;
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

const DOMAIN_PATTERN =
	/^(?=.{4,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.(?:[a-z]{2,63}|xn--[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)$/i;

const ValidateDomainInputSchema = z.object({
	domain: z
		.string()
		.regex(
			DOMAIN_PATTERN,
			'Must be a domain name like example.com (emails, URLs, and paths are rejected)',
		),
});
export type ValidateDomainInput = z.infer<typeof ValidateDomainInputSchema>;

const ValidateDomainResponseSchema = z.object({
	domain: z.string(),
	mxExists: z.boolean(),
	isNotDisposable: z.boolean(),
	isNotSmtpCatchAll: z.boolean(),
});
export type ValidateDomainResponse = z.infer<
	typeof ValidateDomainResponseSchema
>;

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
