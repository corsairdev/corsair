import { z } from 'zod';

export interface SendEmailResponse {
	id: string;
}

export interface Email {
	id: string;
	from: string;
	to: string[];
	created_at: string;
	subject?: string;
}

export interface GetEmailResponse extends Email {
	[key: string]: any;
}

export interface ListEmailsResponse {
	data: Email[];
}

export interface Domain {
	id: string;
	name: string;
	status:
		| 'not_started'
		| 'validation'
		| 'scheduled'
		| 'ready'
		| 'error'
		| 'verified'
		| 'pending';
	created_at: string;
	region?: string;
}

export interface CreateDomainResponse extends Domain {
	[key: string]: any;
}

export interface GetDomainResponse extends Domain {
	[key: string]: any;
}

export interface ListDomainsResponse {
	data: Domain[];
}

export interface DeleteDomainResponse {
	id: string;
	object: string;
	deleted: boolean;
}

export interface VerifyDomainResponse extends Domain {
	[key: string]: any;
}

export type ResendEndpointOutputs = {
	emailsSend: SendEmailResponse;
	emailsGet: GetEmailResponse;
	emailsList: ListEmailsResponse;
	domainsCreate: CreateDomainResponse;
	domainsGet: GetDomainResponse;
	domainsList: ListDomainsResponse;
	domainsDelete: DeleteDomainResponse;
	domainsVerify: VerifyDomainResponse;
};

const SendEmailResponseSchema = z.object({
	id: z.string(),
});

const EmailSchema = z.object({
	id: z.string(),
	from: z.string(),
	to: z.array(z.string()),
	created_at: z.string(),
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
	]),
	created_at: z.string(),
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
		created_at: z.string().optional(),
		region: z.string().optional(),
	})
	.passthrough();

export const ResendEndpointOutputSchemas: {
	[K in keyof ResendEndpointOutputs]: z.ZodType<unknown>;
} = {
	emailsSend: SendEmailResponseSchema,
	emailsGet: GetEmailResponseSchema,
	emailsList: ListEmailsResponseSchema,
	domainsCreate: CreateDomainResponseSchema,
	domainsGet: GetDomainResponseSchema,
	domainsList: ListDomainsResponseSchema,
	domainsDelete: DeleteDomainResponseSchema,
	domainsVerify: VerifyDomainResponseSchema,
};
