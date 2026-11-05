import { z } from 'zod';

/**
 * Pagination object on list/search responses.
 * Official: https://developers.certifier.io/docs/api-reference/pagination
 */
export const CertifierPagination = z
	.object({
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
	})
	.loose();
export type CertifierPagination = z.infer<typeof CertifierPagination>;

/**
 * Credential recipient.
 * Official: https://developers.certifier.io/docs/api-reference/credentials/create-a-credential
 */
export const CertifierRecipient = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
	})
	.loose();
export type CertifierRecipient = z.infer<typeof CertifierRecipient>;

/**
 * Credential object returned by create / create-issue-send / list / search / send.
 * Official: https://developers.certifier.io/docs/api-reference/credentials/create-a-credential
 */
export const CertifierCredential = z
	.object({
		id: z.string(),
		publicId: z.string().optional(),
		groupId: z.string().optional(),
		status: z.string().optional(),
		recipient: CertifierRecipient.optional(),
		issueDate: z.string().nullable().optional(),
		expiryDate: z.string().nullable().optional(),
		attributes: z.record(z.string(), z.string().nullable()).optional(),
		customAttributes: z.record(z.string(), z.string().nullable()).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type CertifierCredential = z.infer<typeof CertifierCredential>;

/**
 * Credential template (group).
 * Official: https://developers.certifier.io/docs/api-reference/credential-templates/list-credential-templates
 * Official: https://developers.certifier.io/docs/api-reference/credential-templates/create-a-credential-template
 */
export const CertifierGroup = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		designIds: z.array(z.string()).optional(),
		certificateDesignId: z.string().nullable().optional(),
		badgeDesignId: z.string().nullable().optional(),
		emailTemplateId: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type CertifierGroup = z.infer<typeof CertifierGroup>;

/**
 * Design template (certificate or badge).
 * Official: https://developers.certifier.io/docs/api-reference/design-templates/get-a-design-template
 */
export const CertifierDesign = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		type: z.string().optional(),
		previewUrl: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type CertifierDesign = z.infer<typeof CertifierDesign>;

/**
 * Credential interaction event.
 * Official: https://developers.certifier.io/docs/api-reference/credential-interactions/list-credential-interactions
 */
export const CertifierCredentialInteraction = z
	.object({
		id: z.string(),
		credentialId: z.string().optional(),
		eventType: z.string().optional(),
		triggeredBy: z.string().optional(),
		triggeredAt: z.string().optional(),
	})
	.loose();
export type CertifierCredentialInteraction = z.infer<
	typeof CertifierCredentialInteraction
>;

/**
 * Workspace attribute definition used on designs and emails.
 * Public reference lists attribute tags on credentials (`recipient.name`)
 * and documents custom attribute tags on create.
 * Official: https://developers.certifier.io/docs/api-reference/credentials/create-a-credential
 * Official: https://support.certifier.io/en/articles/10770697-guide-to-attributes-using-dynamic-and-custom-fields-in-designs
 */
export const CertifierAttribute = z
	.object({
		id: z.string().optional(),
		tag: z.string().optional(),
		name: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();
export type CertifierAttribute = z.infer<typeof CertifierAttribute>;

/**
 * Email template used when sending an issued credential.
 * Official send docs: the group’s configured email template is used.
 * Official: https://developers.certifier.io/docs/api-reference/credentials/send-a-credential
 */
export const CertifierEmailTemplate = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		subject: z.string().optional(),
	})
	.loose();
export type CertifierEmailTemplate = z.infer<typeof CertifierEmailTemplate>;

export function certifierPage<T extends z.ZodType>(item: T) {
	return z
		.object({
			data: z.array(item),
			pagination: CertifierPagination.optional(),
		})
		.loose();
}
