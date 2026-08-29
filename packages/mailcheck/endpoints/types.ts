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

// Mirrors the per-email result object returned by Mailcheck's batch
// results document (observed live: extra fields like githubUsername,
// facebook, microsoftAccountExists are passed through).
const VerificationResultSchema = z.looseObject({
	email: z.string(),
	trustRate: z.number().int().min(0).max(100),
	mxExists: z.boolean(),
	smtpExists: z.boolean(),
	isNotDisposable: z.boolean(),
	isNotSmtpCatchAll: z.boolean(),
	// The API returns null when no gravatar profile exists.
	gravatar: z
		.object({
			entries: z.array(GravatarEntrySchema).optional(),
		})
		.nullable()
		.optional(),
});

const VerifyEmailResponseSchema = VerificationResultSchema;
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// RFC 1123 hostname: dot-separated labels of alphanumerics and hyphens (no
// leading/trailing hyphen). The final label is either an alphabetic TLD or
// an IDNA Punycode A-label (xn--...) such as .xn--p1ai (.рф). This rejects
// email addresses, URLs, and path-bearing values — validateDomain submits
// admin@{domain}, so any '@', ':', or '/' would trigger a bogus remote check.
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

const ValidateDomainResponseSchema = VerificationResultSchema;
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
