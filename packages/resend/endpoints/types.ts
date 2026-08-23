import { z } from 'zod';

const EmailsSendInputSchema = z.object({
	from: z.string(),
	to: z.union([z.string(), z.array(z.string())]),
	subject: z.string(),
	html: z.string().optional(),
	text: z.string().optional(),
	cc: z.union([z.string(), z.array(z.string())]).optional(),
	bcc: z.union([z.string(), z.array(z.string())]).optional(),
	reply_to: z.union([z.string(), z.array(z.string())]).optional(),
	scheduled_at: z.string().optional(),
	attachments: z
		.array(
			z.object({
				filename: z.string(),
				content: z.union([z.string(), z.instanceof(Buffer)]),
				path: z.string().optional(),
			}),
		)
		.optional(),
	tags: z
		.array(
			z.object({
				name: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	headers: z.record(z.string(), z.string()).optional(),
});

const EmailsGetInputSchema = z.object({
	id: z.string(),
});

const EmailsListInputSchema = z
	.object({
		limit: z.number().optional(),
		cursor: z.string().optional(),
	})
	.optional();

const DomainsCreateInputSchema = z.object({
	name: z.string(),
	region: z.enum(['us-east-1', 'eu-west-1', 'sa-east-1']).optional(),
});

const DomainsGetInputSchema = z.object({
	id: z.string(),
});

const DomainsListInputSchema = z
	.object({
		limit: z.number().optional(),
		cursor: z.string().optional(),
	})
	.optional();

const DomainsDeleteInputSchema = z.object({
	id: z.string(),
});

const DomainsVerifyInputSchema = z.object({
	id: z.string(),
});

// Resend's /emails/batch endpoint does not support attachments and accepts at
// most 100 emails per request.
const EmailsBatchItemSchema = EmailsSendInputSchema.omit({
	attachments: true,
});

const EmailsBatchInputSchema = z.object({
	emails: z.array(EmailsBatchItemSchema).max(100),
});

const EmailsCancelInputSchema = z.object({
	id: z.string(),
});

const ContactsCreateInputSchema = z.object({
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	unsubscribed: z.boolean().optional(),
	properties: z.record(z.string(), z.string()).optional(),
	segments: z.array(z.object({ id: z.string() })).optional(),
	topics: z
		.array(
			z.object({ id: z.string(), subscription: z.enum(['opt_in', 'opt_out']) }),
		)
		.optional(),
});

const ContactsGetInputSchema = z.object({
	id: z.string(),
});

const ContactsListInputSchema = z
	.object({
		limit: z.number().optional(),
		cursor: z.string().optional(),
	})
	.optional();

const ContactsUpdateInputSchema = z.object({
	id: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	unsubscribed: z.boolean().optional(),
	properties: z.record(z.string(), z.string()).optional(),
});

const ContactsDeleteInputSchema = z.object({
	id: z.string(),
});

export const ResendEndpointInputSchemas = {
	emailsSend: EmailsSendInputSchema,
	emailsGet: EmailsGetInputSchema,
	emailsList: EmailsListInputSchema,
	emailsBatch: EmailsBatchInputSchema,
	emailsCancel: EmailsCancelInputSchema,
	domainsCreate: DomainsCreateInputSchema,
	domainsGet: DomainsGetInputSchema,
	domainsList: DomainsListInputSchema,
	domainsDelete: DomainsDeleteInputSchema,
	domainsVerify: DomainsVerifyInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
} as const;

export type ResendEndpointInputs = {
	[K in keyof typeof ResendEndpointInputSchemas]: z.infer<
		(typeof ResendEndpointInputSchemas)[K]
	>;
};

const SendEmailResponseSchema = z.object({
	id: z.string(),
});

const EmailSchema = z.object({
	id: z.string(),
	from: z.string(),
	to: z.array(z.string()),
	created_at: z.coerce.date().nullable().optional(),
	subject: z.string().optional(),
});

const GetEmailResponseSchema = EmailSchema.loose();

const ListEmailsResponseSchema = z.object({
	data: z.array(EmailSchema),
});

const DomainSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum([
		'not_started',
		'validation',
		'scheduled',
		'ready',
		'error',
		'verified',
		'pending',
		'failed',
		'partially_verified',
		'partially_failed',
	]),
	created_at: z.coerce.date().nullable().optional(),
	region: z.string().optional(),
});

const CreateDomainResponseSchema = DomainSchema.loose();

const GetDomainResponseSchema = DomainSchema.loose();

const ListDomainsResponseSchema = z.object({
	data: z.array(DomainSchema),
});

const DeleteDomainResponseSchema = z.object({
	id: z.string(),
	object: z.string(),
	deleted: z.boolean(),
});

const VerifyDomainResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		status: z
			.enum([
				'not_started',
				'validation',
				'scheduled',
				'ready',
				'error',
				'verified',
				'pending',
			])
			.optional(),
		created_at: z.coerce.date().nullable().optional(),
		region: z.string().optional(),
	})
	.loose();

const EmailBatchItemResponseSchema = z.object({
	id: z.string(),
});

const EmailsBatchResponseSchema = z.object({
	data: z.array(EmailBatchItemResponseSchema),
});

const EmailsCancelResponseSchema = z.object({
	id: z.string(),
	object: z.string(),
	cancelled: z.boolean(),
});

const ContactSchema = z.object({
	object: z.string(),
	id: z.string(),
	email: z.string(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	created_at: z.coerce.date().nullable().optional(),
	unsubscribed: z.boolean().optional(),
});

// Create and update return only the object discriminator and id; fetch the
// full contact via contacts.get before persisting it.
const ContactsMutationResponseSchema = z.object({
	object: z.string(),
	id: z.string(),
});

const ContactsGetResponseSchema = ContactSchema.loose();

const ContactsListResponseSchema = z.object({
	data: z.array(ContactSchema),
});

const ContactsUpdateResponseSchema = ContactSchema.loose();

const ContactsDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.string(),
	deleted: z.boolean(),
});

export const ResendEndpointOutputSchemas = {
	emailsSend: SendEmailResponseSchema,
	emailsGet: GetEmailResponseSchema,
	emailsList: ListEmailsResponseSchema,
	emailsBatch: EmailsBatchResponseSchema,
	emailsCancel: EmailsCancelResponseSchema,
	domainsCreate: CreateDomainResponseSchema,
	domainsGet: GetDomainResponseSchema,
	domainsList: ListDomainsResponseSchema,
	domainsDelete: DeleteDomainResponseSchema,
	domainsVerify: VerifyDomainResponseSchema,
	contactsCreate: ContactsMutationResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
} as const;

export type ResendEndpointOutputs = {
	[K in keyof typeof ResendEndpointOutputSchemas]: z.infer<
		(typeof ResendEndpointOutputSchemas)[K]
	>;
};

export type SendEmailResponse = z.infer<
	typeof ResendEndpointOutputSchemas.emailsSend
>;
export type Email = z.infer<typeof EmailSchema>;
export type GetEmailResponse = z.infer<
	typeof ResendEndpointOutputSchemas.emailsGet
>;
export type ListEmailsResponse = z.infer<
	typeof ResendEndpointOutputSchemas.emailsList
>;
export type EmailsBatchResponse = z.infer<
	typeof ResendEndpointOutputSchemas.emailsBatch
>;
export type EmailsCancelResponse = z.infer<
	typeof ResendEndpointOutputSchemas.emailsCancel
>;
export type Domain = z.infer<typeof DomainSchema>;
export type CreateDomainResponse = z.infer<
	typeof ResendEndpointOutputSchemas.domainsCreate
>;
export type GetDomainResponse = z.infer<
	typeof ResendEndpointOutputSchemas.domainsGet
>;
export type ListDomainsResponse = z.infer<
	typeof ResendEndpointOutputSchemas.domainsList
>;
export type DeleteDomainResponse = z.infer<
	typeof ResendEndpointOutputSchemas.domainsDelete
>;
export type VerifyDomainResponse = z.infer<
	typeof ResendEndpointOutputSchemas.domainsVerify
>;
export type Contact = z.infer<typeof ContactSchema>;
export type ContactsCreateResponse = z.infer<
	typeof ResendEndpointOutputSchemas.contactsCreate
>;
export type ContactsGetResponse = z.infer<
	typeof ResendEndpointOutputSchemas.contactsGet
>;
export type ContactsListResponse = z.infer<
	typeof ResendEndpointOutputSchemas.contactsList
>;
export type ContactsUpdateResponse = z.infer<
	typeof ResendEndpointOutputSchemas.contactsUpdate
>;
export type ContactsDeleteResponse = z.infer<
	typeof ResendEndpointOutputSchemas.contactsDelete
>;
