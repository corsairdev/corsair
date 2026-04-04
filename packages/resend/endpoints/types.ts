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
	headers: z.record(z.string()).optional(),
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

export const ResendEndpointInputSchemas = {
	emailsSend: EmailsSendInputSchema,
	emailsGet: EmailsGetInputSchema,
	emailsList: EmailsListInputSchema,
	domainsCreate: DomainsCreateInputSchema,
	domainsGet: DomainsGetInputSchema,
	domainsList: DomainsListInputSchema,
	domainsDelete: DomainsDeleteInputSchema,
	domainsVerify: DomainsVerifyInputSchema,
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

const GetEmailResponseSchema = EmailSchema.passthrough();

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
	]),
	created_at: z.coerce.date().nullable().optional(),
	region: z.string().optional(),
});

const CreateDomainResponseSchema = DomainSchema.passthrough();

const GetDomainResponseSchema = DomainSchema.passthrough();

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
	.passthrough();

export const ResendEndpointOutputSchemas = {
	emailsSend: SendEmailResponseSchema,
	emailsGet: GetEmailResponseSchema,
	emailsList: ListEmailsResponseSchema,
	domainsCreate: CreateDomainResponseSchema,
	domainsGet: GetDomainResponseSchema,
	domainsList: ListDomainsResponseSchema,
	domainsDelete: DeleteDomainResponseSchema,
	domainsVerify: VerifyDomainResponseSchema,
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
