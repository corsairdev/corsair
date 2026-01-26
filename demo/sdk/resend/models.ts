import { z } from 'zod';

export const TokenOverridableSchema = z.object({
	token: z.string().optional(),
});

export const SendEmailArgsSchema = z
	.object({
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
	})
	.merge(TokenOverridableSchema);
export type SendEmailArgs = z.infer<typeof SendEmailArgsSchema>;

export const EmailSchema = z.object({
	id: z.string(),
	from: z.string(),
	to: z.array(z.string()),
	created_at: z.string(),
	subject: z.string().optional(),
});

export const SendEmailResponseSchema = z.object({
	id: z.string(),
});
export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;

export const GetEmailArgsSchema = z
	.object({
		id: z.string(),
	})
	.merge(TokenOverridableSchema);
export type GetEmailArgs = z.infer<typeof GetEmailArgsSchema>;

export const GetEmailResponseSchema = EmailSchema.passthrough();
export type GetEmailResponse = z.infer<typeof GetEmailResponseSchema>;

export const ListEmailsArgsSchema = z
	.object({
		limit: z.number().optional(),
		cursor: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type ListEmailsArgs = z.infer<typeof ListEmailsArgsSchema>;

export const ListEmailsResponseSchema = z.object({
	data: z.array(EmailSchema),
});
export type ListEmailsResponse = z.infer<typeof ListEmailsResponseSchema>;

export const CreateDomainArgsSchema = z
	.object({
		name: z.string(),
		region: z.enum(['us-east-1', 'eu-west-1', 'sa-east-1']).optional(),
	})
	.merge(TokenOverridableSchema);
export type CreateDomainArgs = z.infer<typeof CreateDomainArgsSchema>;

export const DomainSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(['not_started', 'validation', 'scheduled', 'ready', 'error']),
	created_at: z.string(),
	region: z.string().optional(),
});

export const CreateDomainResponseSchema = DomainSchema.passthrough();
export type CreateDomainResponse = z.infer<typeof CreateDomainResponseSchema>;

export const GetDomainArgsSchema = z
	.object({
		id: z.string(),
	})
	.merge(TokenOverridableSchema);
export type GetDomainArgs = z.infer<typeof GetDomainArgsSchema>;

export const GetDomainResponseSchema = DomainSchema.passthrough();
export type GetDomainResponse = z.infer<typeof GetDomainResponseSchema>;

export const ListDomainsArgsSchema = z
	.object({
		limit: z.number().optional(),
		cursor: z.string().optional(),
	})
	.merge(TokenOverridableSchema);
export type ListDomainsArgs = z.infer<typeof ListDomainsArgsSchema>;

export const ListDomainsResponseSchema = z.object({
	data: z.array(DomainSchema),
});
export type ListDomainsResponse = z.infer<typeof ListDomainsResponseSchema>;

export const DeleteDomainArgsSchema = z
	.object({
		id: z.string(),
	})
	.merge(TokenOverridableSchema);
export type DeleteDomainArgs = z.infer<typeof DeleteDomainArgsSchema>;

export const DeleteDomainResponseSchema = z.object({
	id: z.string(),
	object: z.string(),
	deleted: z.boolean(),
});
export type DeleteDomainResponse = z.infer<typeof DeleteDomainResponseSchema>;

export const VerifyDomainArgsSchema = z
	.object({
		id: z.string(),
	})
	.merge(TokenOverridableSchema);
export type VerifyDomainArgs = z.infer<typeof VerifyDomainArgsSchema>;

export const VerifyDomainResponseSchema = DomainSchema.passthrough();
export type VerifyDomainResponse = z.infer<typeof VerifyDomainResponseSchema>;
