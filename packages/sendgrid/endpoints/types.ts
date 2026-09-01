import { z } from 'zod';
import {
	SendGridBounce,
	SendGridContact,
	SendGridList,
	SendGridVerifiedSender,
} from '../schema/database';

const EmailRecipientSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
});

const PersonalizationSchema = z.object({
	to: z.array(EmailRecipientSchema).min(1),
	cc: z.array(EmailRecipientSchema).optional(),
	bcc: z.array(EmailRecipientSchema).optional(),
	subject: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
	substitutions: z.record(z.string(), z.string()).optional(),
	dynamic_template_data: z.record(z.string(), z.unknown()).optional(),
	custom_args: z.record(z.string(), z.string()).optional(),
	send_at: z.number().int().optional(),
});

const ContentSchema = z.object({
	type: z.string(),
	value: z.string(),
});

/**
 * Mail Send v3 request.
 * Official: POST /v3/mail/send
 * https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send
 */
const MailSendInputSchema = z.object({
	personalizations: z.array(PersonalizationSchema).min(1),
	from: EmailRecipientSchema,
	subject: z.string().optional(),
	content: z.array(ContentSchema).optional(),
	reply_to: EmailRecipientSchema.optional(),
	template_id: z.string().optional(),
	categories: z.array(z.string()).optional(),
	send_at: z.number().int().optional(),
	batch_id: z.string().optional(),
	ip_pool_name: z.string().optional(),
	asm: z
		.object({
			group_id: z.number().int(),
			groups_to_display: z.array(z.number().int()).optional(),
		})
		.optional(),
});

export type MailSendInput = z.infer<typeof MailSendInputSchema>;

const MailSendOutputSchema = z.object({
	x_message_id: z.string().optional(),
});

export type MailSendOutput = z.infer<typeof MailSendOutputSchema>;

const ContactsAddOrUpdateInputSchema = z.object({
	list_ids: z.array(z.string()).optional(),
	contacts: z.array(SendGridContact).min(1),
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
	page_size: z.number().int().positive().max(1000).optional(),
	page_token: z.string().optional(),
});

export type ListsGetAllInput = z.infer<typeof ListsGetAllInputSchema>;

const ListsGetAllOutputSchema = z.object({
	result: z.array(SendGridList),
	_metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ListsGetAllOutput = z.infer<typeof ListsGetAllOutputSchema>;

const ListsCreateInputSchema = z.object({
	name: z.string().min(1),
});

export type ListsCreateInput = z.infer<typeof ListsCreateInputSchema>;

const ListsCreateOutputSchema = SendGridList;

export type ListsCreateOutput = z.infer<typeof ListsCreateOutputSchema>;

const SuppressionsGetBouncesInputSchema = z.object({
	start_time: z.number().int().optional(),
	end_time: z.number().int().optional(),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
});

export type SuppressionsGetBouncesInput = z.infer<
	typeof SuppressionsGetBouncesInputSchema
>;

const SuppressionsGetBouncesOutputSchema = z.object({
	bounces: z.array(SendGridBounce),
});

export type SuppressionsGetBouncesOutput = z.infer<
	typeof SuppressionsGetBouncesOutputSchema
>;

const SendersGetAllInputSchema = z.object({
	limit: z.number().int().positive().optional(),
	lastSeenID: z.number().int().optional(),
	id: z.number().int().optional(),
});

export type SendersGetAllInput = z.infer<typeof SendersGetAllInputSchema>;

const SendersGetAllOutputSchema = z.object({
	results: z.array(SendGridVerifiedSender),
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
