import { z } from 'zod';

// ============================================================================
// Shared Helper Schemas
// ============================================================================

// unknown: provider records contain arbitrary custom fields and properties returned by Helpwise API.
export const ExtensibleRecordSchema = z.record(z.string(), z.unknown());

export const StandardActionResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();

export type StandardActionResponse = z.infer<
	typeof StandardActionResponseSchema
>;

// ============================================================================
// Conversations Schemas
// ============================================================================

export const ConversationsActionInputSchema = z
	.object({
		ids: z.array(z.number()).min(1, 'At least one conversation id is required'),
	})
	.strict();
export type ConversationsActionInput = z.infer<
	typeof ConversationsActionInputSchema
>;

export const ConversationsListInputSchema = z
	.object({
		inboxIds: z.array(z.number()).optional(),
		labelId: z.number().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		pageToken: z.string().optional(),
	})
	.strict();
export type ConversationsListInput = z.infer<
	typeof ConversationsListInputSchema
>;

export const ConversationThreadSchema = z
	.object({
		id: z.number(),
		messageCount: z.number().optional(),
		inboxType: z.string().optional(),
		subject: z.string().nullable().optional(),
		snippet: z.string().nullable().optional(),
		inboxId: z.number().optional(),
		isRead: z.boolean().optional(),
		isArchived: z.boolean().optional(),
		isDeleted: z.boolean().optional(),
		isSpam: z.boolean().optional(),
		date: z.string().optional(),
	})
	.passthrough();

export const ConversationsListResponseSchema = z
	.object({
		nextPageToken: z.string().optional(),
		threads: z.array(ConversationThreadSchema),
	})
	.passthrough();
export type ConversationsListResponse = z.infer<
	typeof ConversationsListResponseSchema
>;

export const ConversationsGetInputSchema = z
	.object({
		inboxId: z.number(),
		conversationId: z.number(),
		labelId: z.number().optional(),
		// Long conversations come in pages; pass the previous reply's token.
		limit: z.number().int().min(1).max(100).optional(),
		pageToken: z.string().optional(),
	})
	.strict();
export type ConversationsGetInput = z.infer<typeof ConversationsGetInputSchema>;

export const ConversationsGetResponseSchema = z
	.object({
		id: z.number(),
		inboxId: z.number().optional(),
		messagesCount: z.number().optional(),
		subject: z.string().nullable().optional(),
		snippet: z.string().nullable().optional(),
		inboxType: z.string().optional(),
	})
	.passthrough();
export type ConversationsGetResponse = z.infer<
	typeof ConversationsGetResponseSchema
>;

export const ConversationsAssignInputSchema = z
	.object({
		mailbox_id: z.number(),
		thread_id: z.number(),
		assigned_to: z.number(),
	})
	.strict();
export type ConversationsAssignInput = z.infer<
	typeof ConversationsAssignInputSchema
>;

// ============================================================================
// Messages Schemas
// ============================================================================

export const SendEmailInputSchema = z
	.object({
		mailbox_id: z.number(),
		to: z.string().min(1, 'Recipient email is required'),
		cc: z.string().optional(),
		bcc: z.string().optional(),
		subject: z.string().min(1, 'Subject is required'),
		body: z.string().min(1, 'Body is required'),
		reply_to: z.string().optional(),
		thread_id: z.number().optional(),
	})
	.strict();
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export const SendEmailResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		thread_id: z.number().optional(),
		message_id: z.number().optional(),
	})
	.passthrough();
export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;

export const ListEmailsInputSchema = z
	.object({
		mailboxId: z.number(),
		threadId: z.number(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).optional(),
	})
	.strict();
export type ListEmailsInput = z.infer<typeof ListEmailsInputSchema>;

export const ListEmailsResponseSchema = z
	.object({
		status: z.string().optional(),
		// unknown: email records contain variable header, payload, and attachment structures.
		data: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type ListEmailsResponse = z.infer<typeof ListEmailsResponseSchema>;

export const SendSmsInputSchema = z
	.object({
		inboxId: z.number(),
		clientNumber: z.string().min(1, 'Client phone number is required'),
		body: z.string().min(1, 'Message body is required'),
		hash: z.string().optional(),
		scheduleTime: z.string().optional(),
	})
	.strict();
export type SendSmsInput = z.infer<typeof SendSmsInputSchema>;

export const SendSmsResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		// unknown: sendMsg data envelope holds provider-specific message IDs and metadata.
		data: z.unknown().optional(),
	})
	.passthrough();
export type SendSmsResponse = z.infer<typeof SendSmsResponseSchema>;

export const SendWhatsAppInputSchema = z
	.object({
		inboxId: z.number(),
		clientNumber: z.string().min(1, 'Client phone number is required'),
		body: z.string().min(1, 'Message body is required'),
		template: z
			.object({
				templateId: z.number(),
				templateVariables: z.array(z.string()).optional(),
			})
			.optional(),
		hash: z.string().optional(),
		scheduleTime: z.string().optional(),
	})
	.strict();
export type SendWhatsAppInput = z.infer<typeof SendWhatsAppInputSchema>;

export const SendWhatsAppResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		// unknown: sendMsg data envelope holds provider-specific WhatsApp delivery info.
		data: z.unknown().optional(),
	})
	.passthrough();
export type SendWhatsAppResponse = z.infer<typeof SendWhatsAppResponseSchema>;

export const SendChatInputSchema = z
	.object({
		mailbox_id: z.number(),
		thread_id: z.number(),
		message: z.string().min(1, 'Chat message is required'),
	})
	.strict();
export type SendChatInput = z.infer<typeof SendChatInputSchema>;

export const SendChatResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type SendChatResponse = z.infer<typeof SendChatResponseSchema>;

// ============================================================================
// Inboxes Schemas
// ============================================================================

export const InboxesListInputSchema = z
	.object({
		page: z.union([z.number(), z.string()]).optional(),
		limit: z.union([z.number(), z.string()]).optional(),
	})
	.strict();
export type InboxesListInput = z.infer<typeof InboxesListInputSchema>;

export const InboxesListResponseSchema = z
	.object({
		status: z.string().optional(),
		// unknown: mailbox properties vary across email, SMS, WhatsApp, and chat channels.
		// Live: the list is under `data` (`{"status":"success","data":[]}`).
		data: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
		mailboxes: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type InboxesListResponse = z.infer<typeof InboxesListResponseSchema>;

export const InboxesGetInputSchema = z
	.object({
		id: z.number(),
	})
	.strict();
export type InboxesGetInput = z.infer<typeof InboxesGetInputSchema>;

export const InboxesGetResponseSchema = z
	.object({
		status: z.string().optional(),
		// unknown: mailbox details vary by inbox type and channel configuration.
		mailbox: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type InboxesGetResponse = z.infer<typeof InboxesGetResponseSchema>;

// ============================================================================
// Contacts Schemas
// ============================================================================

export const ContactPhoneSchema = z
	.object({
		phoneTxt: z.string(),
		phoneNo: z.string(),
		type: z.string().optional(),
	})
	.strict();

export const ContactCustomFieldSchema = z
	.object({
		id: z.number(),
		value: z.string(),
		name: z.string().optional(),
	})
	.strict();

export const ContactsListInputSchema = z
	.object({
		limit: z.number().int().min(1).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactSchema = z
	.object({
		id: z.number(),
		firstname: z.string().nullable().optional(),
		lastname: z.string().nullable().optional(),
		displayName: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		jobTitle: z.string().nullable().optional(),
		// Live: `null` when the contact has none.
		emails: z.array(z.string()).nullable().optional(),
		isBlocked: z.boolean().nullable().optional(),
	})
	.passthrough();

// Live: an empty account returns `{"nextPage":false,"results":null}`.
const NextPageSchema = z
	.union([z.string(), z.number(), z.boolean()])
	.nullable()
	.optional();

export const ContactsListResponseSchema = z
	.object({
		nextPage: NextPageSchema,
		results: z.array(ContactSchema).nullable(),
	})
	.passthrough();
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactsGetInputSchema = z
	.object({
		contactId: z.number(),
	})
	.strict();
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactsGetResponseSchema = ContactSchema;
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

export const ContactsCreateInputSchema = z
	.object({
		firstname: z.string().min(1, 'First name is required'),
		lastname: z.string().optional(),
		company: z.string().optional(),
		jobTitle: z.string().optional(),
		emails: z.array(z.string()).optional(),
		phones: z.array(ContactPhoneSchema).optional(),
		customFields: z.array(ContactCustomFieldSchema).optional(),
	})
	.strict();
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ContactsCreateResponseSchema = ContactSchema;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

export const ContactsUpdateInputSchema = z
	.object({
		contactId: z.number(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		company: z.string().optional(),
		jobTitle: z.string().optional(),
		emails: z.array(z.string()).optional(),
		phones: z.array(ContactPhoneSchema).optional(),
		customFields: z.array(ContactCustomFieldSchema).optional(),
	})
	.strict();
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

export const ContactsUpdateResponseSchema = ContactSchema;
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

export const ContactsSearchInputSchema = z
	.object({
		term: z.string().min(1, 'Search term is required'),
		limit: z.number().int().min(1).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type ContactsSearchInput = z.infer<typeof ContactsSearchInputSchema>;

export const ContactsSearchResponseSchema = z
	.object({
		nextPage: NextPageSchema,
		result: z.array(ContactSchema).nullable().optional(),
		results: z.array(ContactSchema).nullable().optional(),
	})
	.passthrough();
export type ContactsSearchResponse = z.infer<
	typeof ContactsSearchResponseSchema
>;

// ============================================================================
// Tags Schemas
// ============================================================================

export const TagSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		color: z.string().optional(),
		parentId: z.number().nullable().optional(),
		hierarchy: z.string().nullable().optional(),
		inbox: z.string().nullable().optional(),
		createdAt: z.string().optional(),
	})
	.passthrough();

export const TagsListInputSchema = z.object({}).strict();
export type TagsListInput = z.infer<typeof TagsListInputSchema>;

// Live: `null` when the account has no tags.
export const TagsListResponseSchema = z.array(TagSchema).nullable();
export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

export const TagsGetInputSchema = z
	.object({
		tagId: z.number(),
	})
	.strict();
export type TagsGetInput = z.infer<typeof TagsGetInputSchema>;

export const TagsGetResponseSchema = TagSchema;
export type TagsGetResponse = z.infer<typeof TagsGetResponseSchema>;

export const TagsActionInputSchema = z
	.object({
		threadIds: z.array(z.number()).min(1),
		tagIds: z.array(z.number()).min(1),
	})
	.strict();
export type TagsActionInput = z.infer<typeof TagsActionInputSchema>;

export const TagsActionResponseSchema = StandardActionResponseSchema;
export type TagsActionResponse = z.infer<typeof TagsActionResponseSchema>;

// ============================================================================
// Custom Fields Schemas
// ============================================================================

export const CustomFieldSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

export const CustomFieldsListInputSchema = z.object({}).strict();
export type CustomFieldsListInput = z.infer<typeof CustomFieldsListInputSchema>;

export const CustomFieldsListResponseSchema = z
	.object({
		// unknown: custom field objects have variable metadata properties.
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		message: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CustomFieldsListResponse = z.infer<
	typeof CustomFieldsListResponseSchema
>;

export const CustomFieldsGetInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export type CustomFieldsGetInput = z.infer<typeof CustomFieldsGetInputSchema>;

export const CustomFieldsGetResponseSchema = z
	.object({
		// unknown: custom field configuration schema returned by provider.
		data: z.record(z.string(), z.unknown()).optional(),
		message: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CustomFieldsGetResponse = z.infer<
	typeof CustomFieldsGetResponseSchema
>;

export const CustomFieldsCreateInputSchema = z
	.object({
		name: z.string().min(1, 'Custom field name is required'),
		description: z.string().optional(),
	})
	.strict();
export type CustomFieldsCreateInput = z.infer<
	typeof CustomFieldsCreateInputSchema
>;

export const CustomFieldsCreateResponseSchema = z
	.object({
		// unknown: returned custom field creation payload structure.
		data: z.unknown().optional(),
		message: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CustomFieldsCreateResponse = z.infer<
	typeof CustomFieldsCreateResponseSchema
>;

export const CustomFieldsUpdateInputSchema = z
	.object({
		fieldId: z.number(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.strict();
export type CustomFieldsUpdateInput = z.infer<
	typeof CustomFieldsUpdateInputSchema
>;

export const CustomFieldsUpdateResponseSchema = z
	.object({
		// unknown: updated field details.
		data: z.unknown().optional(),
		message: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CustomFieldsUpdateResponse = z.infer<
	typeof CustomFieldsUpdateResponseSchema
>;

export const CustomFieldsDeleteInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export type CustomFieldsDeleteInput = z.infer<
	typeof CustomFieldsDeleteInputSchema
>;

export const CustomFieldsDeleteResponseSchema = StandardActionResponseSchema;
export type CustomFieldsDeleteResponse = z.infer<
	typeof CustomFieldsDeleteResponseSchema
>;

export const CustomFieldsListByInboxInputSchema = z
	.object({
		inboxId: z.number(),
	})
	.strict();
export type CustomFieldsListByInboxInput = z.infer<
	typeof CustomFieldsListByInboxInputSchema
>;

export const CustomFieldsListByInboxResponseSchema = z
	.object({
		// unknown: custom field list bound to an inbox.
		data: z.array(z.record(z.string(), z.unknown())).optional(),
		message: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CustomFieldsListByInboxResponse = z.infer<
	typeof CustomFieldsListByInboxResponseSchema
>;

export const CustomFieldsUpdateByInboxInputSchema = z
	.object({
		inboxId: z.number(),
		hideIds: z.array(z.number()).optional(),
		unHideIds: z.array(z.number()).optional(),
	})
	.strict();
export type CustomFieldsUpdateByInboxInput = z.infer<
	typeof CustomFieldsUpdateByInboxInputSchema
>;

export const CustomFieldsUpdateByInboxResponseSchema = z
	.object({
		// unknown: result data of inbox field visibility update.
		data: z.unknown().optional(),
		message: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();
export type CustomFieldsUpdateByInboxResponse = z.infer<
	typeof CustomFieldsUpdateByInboxResponseSchema
>;

// ============================================================================
// Users Schemas
// ============================================================================

export const UsersGetMeInputSchema = z.object({}).strict();
export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;

export const UsersGetMeResponseSchema = z
	.object({
		status: z.string().optional(),
		// unknown: user profile fields vary depending on Helpwise role and permissions.
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type UsersGetMeResponse = z.infer<typeof UsersGetMeResponseSchema>;

export const UsersListInputSchema = z
	.object({
		mailbox_id: z.number().optional(),
	})
	.strict();
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

export const UsersListResponseSchema = z
	.object({
		status: z.string().optional(),
		// unknown: team and user attributes returned in list.
		// Live: `{"data":{"users":[...]}}`; an array is accepted too.
		data: z
			.union([
				z.array(z.record(z.string(), z.unknown())),
				z
					.object({
						users: z.array(z.record(z.string(), z.unknown())).nullable(),
					})
					.passthrough(),
			])
			.nullable()
			.optional(),
	})
	.passthrough();
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ============================================================================
// Notes Schemas
// ============================================================================

export const NotesCreateInputSchema = z
	.object({
		mailbox_id: z.number(),
		thread_id: z.number(),
		message: z.string().min(1, 'Note message is required'),
	})
	.strict();
export type NotesCreateInput = z.infer<typeof NotesCreateInputSchema>;

export const NotesCreateResponseSchema = z
	.object({
		status: z.string().optional(),
		message: z.string().optional(),
		note_id: z.number().optional(),
	})
	.passthrough();
export type NotesCreateResponse = z.infer<typeof NotesCreateResponseSchema>;

// ============================================================================
// WhatsApp Schemas
// ============================================================================

export const WhatsAppListTemplatesInputSchema = z
	.object({
		mailbox_id: z.number(),
	})
	.strict();
export type WhatsAppListTemplatesInput = z.infer<
	typeof WhatsAppListTemplatesInputSchema
>;

export const WhatsAppListTemplatesResponseSchema = z
	.object({
		status: z.string().optional(),
		// unknown: WhatsApp template definitions vary based on Meta template configuration.
		templates: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type WhatsAppListTemplatesResponse = z.infer<
	typeof WhatsAppListTemplatesResponseSchema
>;

// ============================================================================
// Reports Schemas
// ============================================================================

export const ReportsGetOverallInputSchema = z
	.object({
		start: z.string().min(1, 'Start date is required'),
		end: z.string().min(1, 'End date is required'),
		inboxId: z.number().optional(),
		tagId: z.array(z.number()).optional(),
		isBusinessHours: z.number().optional(),
	})
	.strict();
export type ReportsGetOverallInput = z.infer<
	typeof ReportsGetOverallInputSchema
>;

// unknown: Helpwise overall report contains dynamic metrics and breakdown objects.
export const ReportsGetOverallResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ReportsGetOverallResponse = z.infer<
	typeof ReportsGetOverallResponseSchema
>;

export const ReportsGetTagsInputSchema = z
	.object({
		inboxId: z.number(),
		start: z.string().min(1, 'Start date is required'),
		end: z.string().min(1, 'End date is required'),
		tagId: z.array(z.number()).optional(),
		isBusinessHours: z.number().optional(),
	})
	.strict();
export type ReportsGetTagsInput = z.infer<typeof ReportsGetTagsInputSchema>;

export const ReportsGetTagsResponseSchema = z
	.object({
		// unknown: tag metrics breakdown objects.
		tagReportsOutput: z.array(z.record(z.string(), z.unknown())).optional(),
		mailboxId: z.number().optional(),
		totalTagReportsOutput: z.number().optional(),
		isBusinessHours: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();
export type ReportsGetTagsResponse = z.infer<
	typeof ReportsGetTagsResponseSchema
>;

// ============================================================================
// Endpoint Collections
// ============================================================================

export type HelpwiseEndpointInputs = {
	'conversations.close': ConversationsActionInput;
	'conversations.moveToInbox': ConversationsActionInput;
	'conversations.spam': ConversationsActionInput;
	'conversations.trash': ConversationsActionInput;
	'conversations.delete': ConversationsActionInput;
	'conversations.list': ConversationsListInput;
	'conversations.get': ConversationsGetInput;
	'conversations.assign': ConversationsAssignInput;
	'messages.sendEmail': SendEmailInput;
	'messages.listEmails': ListEmailsInput;
	'messages.sendSms': SendSmsInput;
	'messages.sendWhatsApp': SendWhatsAppInput;
	'messages.sendChat': SendChatInput;
	'inboxes.list': InboxesListInput;
	'inboxes.get': InboxesGetInput;
	'contacts.list': ContactsListInput;
	'contacts.get': ContactsGetInput;
	'contacts.create': ContactsCreateInput;
	'contacts.update': ContactsUpdateInput;
	'contacts.search': ContactsSearchInput;
	'tags.list': TagsListInput;
	'tags.get': TagsGetInput;
	'tags.apply': TagsActionInput;
	'tags.remove': TagsActionInput;
	'customFields.list': CustomFieldsListInput;
	'customFields.get': CustomFieldsGetInput;
	'customFields.create': CustomFieldsCreateInput;
	'customFields.update': CustomFieldsUpdateInput;
	'customFields.delete': CustomFieldsDeleteInput;
	'customFields.listByInbox': CustomFieldsListByInboxInput;
	'customFields.updateByInbox': CustomFieldsUpdateByInboxInput;
	'users.getMe': UsersGetMeInput;
	'users.list': UsersListInput;
	'notes.create': NotesCreateInput;
	'whatsapp.listTemplates': WhatsAppListTemplatesInput;
	'reports.getOverall': ReportsGetOverallInput;
	'reports.getTags': ReportsGetTagsInput;
};

export type HelpwiseEndpointOutputs = {
	'conversations.close': StandardActionResponse;
	'conversations.moveToInbox': StandardActionResponse;
	'conversations.spam': StandardActionResponse;
	'conversations.trash': StandardActionResponse;
	'conversations.delete': StandardActionResponse;
	'conversations.list': ConversationsListResponse;
	'conversations.get': ConversationsGetResponse;
	'conversations.assign': StandardActionResponse;
	'messages.sendEmail': SendEmailResponse;
	'messages.listEmails': ListEmailsResponse;
	'messages.sendSms': SendSmsResponse;
	'messages.sendWhatsApp': SendWhatsAppResponse;
	'messages.sendChat': SendChatResponse;
	'inboxes.list': InboxesListResponse;
	'inboxes.get': InboxesGetResponse;
	'contacts.list': ContactsListResponse;
	'contacts.get': ContactsGetResponse;
	'contacts.create': ContactsCreateResponse;
	'contacts.update': ContactsUpdateResponse;
	'contacts.search': ContactsSearchResponse;
	'tags.list': TagsListResponse;
	'tags.get': TagsGetResponse;
	'tags.apply': TagsActionResponse;
	'tags.remove': TagsActionResponse;
	'customFields.list': CustomFieldsListResponse;
	'customFields.get': CustomFieldsGetResponse;
	'customFields.create': CustomFieldsCreateResponse;
	'customFields.update': CustomFieldsUpdateResponse;
	'customFields.delete': CustomFieldsDeleteResponse;
	'customFields.listByInbox': CustomFieldsListByInboxResponse;
	'customFields.updateByInbox': CustomFieldsUpdateByInboxResponse;
	'users.getMe': UsersGetMeResponse;
	'users.list': UsersListResponse;
	'notes.create': NotesCreateResponse;
	'whatsapp.listTemplates': WhatsAppListTemplatesResponse;
	'reports.getOverall': ReportsGetOverallResponse;
	'reports.getTags': ReportsGetTagsResponse;
};

export const HelpwiseEndpointInputSchemas = {
	'conversations.close': ConversationsActionInputSchema,
	'conversations.moveToInbox': ConversationsActionInputSchema,
	'conversations.spam': ConversationsActionInputSchema,
	'conversations.trash': ConversationsActionInputSchema,
	'conversations.delete': ConversationsActionInputSchema,
	'conversations.list': ConversationsListInputSchema,
	'conversations.get': ConversationsGetInputSchema,
	'conversations.assign': ConversationsAssignInputSchema,
	'messages.sendEmail': SendEmailInputSchema,
	'messages.listEmails': ListEmailsInputSchema,
	'messages.sendSms': SendSmsInputSchema,
	'messages.sendWhatsApp': SendWhatsAppInputSchema,
	'messages.sendChat': SendChatInputSchema,
	'inboxes.list': InboxesListInputSchema,
	'inboxes.get': InboxesGetInputSchema,
	'contacts.list': ContactsListInputSchema,
	'contacts.get': ContactsGetInputSchema,
	'contacts.create': ContactsCreateInputSchema,
	'contacts.update': ContactsUpdateInputSchema,
	'contacts.search': ContactsSearchInputSchema,
	'tags.list': TagsListInputSchema,
	'tags.get': TagsGetInputSchema,
	'tags.apply': TagsActionInputSchema,
	'tags.remove': TagsActionInputSchema,
	'customFields.list': CustomFieldsListInputSchema,
	'customFields.get': CustomFieldsGetInputSchema,
	'customFields.create': CustomFieldsCreateInputSchema,
	'customFields.update': CustomFieldsUpdateInputSchema,
	'customFields.delete': CustomFieldsDeleteInputSchema,
	'customFields.listByInbox': CustomFieldsListByInboxInputSchema,
	'customFields.updateByInbox': CustomFieldsUpdateByInboxInputSchema,
	'users.getMe': UsersGetMeInputSchema,
	'users.list': UsersListInputSchema,
	'notes.create': NotesCreateInputSchema,
	'whatsapp.listTemplates': WhatsAppListTemplatesInputSchema,
	'reports.getOverall': ReportsGetOverallInputSchema,
	'reports.getTags': ReportsGetTagsInputSchema,
} as const;

export const HelpwiseEndpointOutputSchemas = {
	'conversations.close': StandardActionResponseSchema,
	'conversations.moveToInbox': StandardActionResponseSchema,
	'conversations.spam': StandardActionResponseSchema,
	'conversations.trash': StandardActionResponseSchema,
	'conversations.delete': StandardActionResponseSchema,
	'conversations.list': ConversationsListResponseSchema,
	'conversations.get': ConversationsGetResponseSchema,
	'conversations.assign': StandardActionResponseSchema,
	'messages.sendEmail': SendEmailResponseSchema,
	'messages.listEmails': ListEmailsResponseSchema,
	'messages.sendSms': SendSmsResponseSchema,
	'messages.sendWhatsApp': SendWhatsAppResponseSchema,
	'messages.sendChat': SendChatResponseSchema,
	'inboxes.list': InboxesListResponseSchema,
	'inboxes.get': InboxesGetResponseSchema,
	'contacts.list': ContactsListResponseSchema,
	'contacts.get': ContactsGetResponseSchema,
	'contacts.create': ContactsCreateResponseSchema,
	'contacts.update': ContactsUpdateResponseSchema,
	'contacts.search': ContactsSearchResponseSchema,
	'tags.list': TagsListResponseSchema,
	'tags.get': TagsGetResponseSchema,
	'tags.apply': TagsActionResponseSchema,
	'tags.remove': TagsActionResponseSchema,
	'customFields.list': CustomFieldsListResponseSchema,
	'customFields.get': CustomFieldsGetResponseSchema,
	'customFields.create': CustomFieldsCreateResponseSchema,
	'customFields.update': CustomFieldsUpdateResponseSchema,
	'customFields.delete': CustomFieldsDeleteResponseSchema,
	'customFields.listByInbox': CustomFieldsListByInboxResponseSchema,
	'customFields.updateByInbox': CustomFieldsUpdateByInboxResponseSchema,
	'users.getMe': UsersGetMeResponseSchema,
	'users.list': UsersListResponseSchema,
	'notes.create': NotesCreateResponseSchema,
	'whatsapp.listTemplates': WhatsAppListTemplatesResponseSchema,
	'reports.getOverall': ReportsGetOverallResponseSchema,
	'reports.getTags': ReportsGetTagsResponseSchema,
} as const;
