import { z } from 'zod';

const EmailRecipientSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
});

const PersonalizationSchema = z.object({
	to: z.array(EmailRecipientSchema).min(1),
	cc: z.array(EmailRecipientSchema).optional(),
	bcc: z.array(EmailRecipientSchema).optional(),
	subject: z.string().optional(),
	dynamic_template_data: z.record(z.string(), z.unknown()).optional(),
});

const ContentSchema = z.object({
	type: z.string(),
	value: z.string(),
});

const MailSendInputSchema = z.object({
	personalizations: z.array(PersonalizationSchema).min(1),
	from: EmailRecipientSchema,
	subject: z.string().optional(),
	content: z.array(ContentSchema).optional(),
	reply_to: EmailRecipientSchema.optional(),
	template_id: z.string().optional(),
	categories: z.array(z.string()).optional(),
});

export type MailSendInput = z.infer<typeof MailSendInputSchema>;

const MailSendOutputSchema = z.object({
	success: z.boolean(),
	messageId: z.string().optional(),
});

export type MailSendOutput = z.infer<typeof MailSendOutputSchema>;

const ContactInputSchema = z.object({
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	custom_fields: z.record(z.string(), z.unknown()).optional(),
});

const ContactsAddOrUpdateInputSchema = z.object({
	list_ids: z.array(z.string()).optional(),
	contacts: z.array(ContactInputSchema).min(1),
});

export type ContactsAddOrUpdateInput = z.infer<
	typeof ContactsAddOrUpdateInputSchema
>;

const ContactsAddOrUpdateOutputSchema = z.object({
	job_id: z.string(),
});

export type ContactsAddOrUpdateOutput = z.infer<
	typeof ContactsAddOrUpdateOutputSchema
>;

const ListsGetAllInputSchema = z.object({
	pageSize: z.number().int().positive().optional(),
	pageToken: z.string().optional(),
});

export type ListsGetAllInput = z.infer<typeof ListsGetAllInputSchema>;

const ContactListSchema = z.object({
	id: z.string(),
	name: z.string(),
	contact_count: z.number(),
});

const ListsGetAllOutputSchema = z.object({
	result: z.array(ContactListSchema),
	_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ListsGetAllOutput = z.infer<typeof ListsGetAllOutputSchema>;

const ListsCreateInputSchema = z.object({
	name: z.string().min(1),
});

export type ListsCreateInput = z.infer<typeof ListsCreateInputSchema>;

const ListsCreateOutputSchema = ContactListSchema;

export type ListsCreateOutput = z.infer<typeof ListsCreateOutputSchema>;

const SuppressionsGetBouncesInputSchema = z.object({
	start_time: z.number().int().optional(),
	end_time: z.number().int().optional(),
});

export type SuppressionsGetBouncesInput = z.infer<
	typeof SuppressionsGetBouncesInputSchema
>;

const BounceItemSchema = z.object({
	created: z.number(),
	email: z.string(),
	reason: z.string(),
	status: z.string(),
});

const SuppressionsGetBouncesOutputSchema = z.object({
	bounces: z.array(BounceItemSchema),
});

export type SuppressionsGetBouncesOutput = z.infer<
	typeof SuppressionsGetBouncesOutputSchema
>;

const SendersGetAllInputSchema = z.object({});

export type SendersGetAllInput = z.infer<typeof SendersGetAllInputSchema>;

const VerifiedSenderSchema = z.object({
	id: z.number(),
	nickname: z.string(),
	from_email: z.string(),
	verified: z.boolean(),
});

const SendersGetAllOutputSchema = z.object({
	results: z.array(VerifiedSenderSchema),
});

export type SendersGetAllOutput = z.infer<typeof SendersGetAllOutputSchema>;

export type SendGridEndpointInputs = {
	mailSend: MailSendInput;
	contactsAddOrUpdate: ContactsAddOrUpdateInput;
	listsGetAll: ListsGetAllInput;
	listsCreate: ListsCreateInput;
	suppressionsGetBounces: SuppressionsGetBouncesInput;
	sendersGetAll: SendersGetAllInput;
};

export type SendGridEndpointOutputs = {
	mailSend: MailSendOutput;
	contactsAddOrUpdate: ContactsAddOrUpdateOutput;
	listsGetAll: ListsGetAllOutput;
	listsCreate: ListsCreateOutput;
	suppressionsGetBounces: SuppressionsGetBouncesOutput;
	sendersGetAll: SendersGetAllOutput;
};

export const SendGridEndpointInputSchemas = {
	mailSend: MailSendInputSchema,
	contactsAddOrUpdate: ContactsAddOrUpdateInputSchema,
	listsGetAll: ListsGetAllInputSchema,
	listsCreate: ListsCreateInputSchema,
	suppressionsGetBounces: SuppressionsGetBouncesInputSchema,
	sendersGetAll: SendersGetAllInputSchema,
} as const;

export const SendGridEndpointOutputSchemas = {
	mailSend: MailSendOutputSchema,
	contactsAddOrUpdate: ContactsAddOrUpdateOutputSchema,
	listsGetAll: ListsGetAllOutputSchema,
	listsCreate: ListsCreateOutputSchema,
	suppressionsGetBounces: SuppressionsGetBouncesOutputSchema,
	sendersGetAll: SendersGetAllOutputSchema,
} as const;
