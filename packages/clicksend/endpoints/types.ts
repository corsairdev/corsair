import { z } from 'zod';

// ── Account ───────────────────────────────────────────────────────────────────

export const AccountGetInputSchema = z.object({});
export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

export const AccountGetResponseSchema = z.object({
	user_id: z.union([z.number(), z.string()]),
	username: z.string(),
	user_email: z.string(),
	user_first_name: z.string().optional(),
	user_last_name: z.string().optional(),
	balance: z.number(),
	currency: z.string().optional(),
});
export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── SMS ───────────────────────────────────────────────────────────────────────

export const SmsMessageInputSchema = z.object({
	to: z
		.string()
		.min(1)
		.describe('Recipient phone number in E.164 international format'),
	body: z.string().min(1).describe('SMS message text'),
	from: z.string().optional().describe('Sender ID or verified phone number'),
	schedule: z
		.number()
		.optional()
		.describe('Epoch timestamp for scheduled sending'),
	source: z.string().optional().describe('Source identifier'),
	custom_string: z.string().optional().describe('Custom reference string'),
	country: z.string().optional().describe('2-letter country code'),
});
export type SmsMessageInput = z.infer<typeof SmsMessageInputSchema>;

export const SmsSendInputSchema = z.object({
	messages: z
		.array(SmsMessageInputSchema)
		.min(1)
		.describe('Array of SMS messages to send'),
});
export type SmsSendInput = z.infer<typeof SmsSendInputSchema>;

export const ClickSendSentMessageSchema = z.object({
	direction: z.string().optional(),
	date: z.number().optional(),
	to: z.string(),
	body: z.string(),
	from: z.string().optional(),
	schedule: z.number().optional(),
	message_id: z.string(),
	message_parts: z.number().optional(),
	message_price: z.string().optional(),
	custom_string: z.string().optional(),
	user_id: z.number().optional(),
	subaccount_id: z.number().optional(),
	country: z.string().optional(),
	carrier: z.string().optional(),
	status: z.string(),
});
export type ClickSendSentMessage = z.infer<typeof ClickSendSentMessageSchema>;

export const SmsSendResponseSchema = z.object({
	total_price: z.number().optional(),
	total_count: z.number().optional(),
	queued_count: z.number().optional(),
	blocked_count: z.number().optional(),
	messages: z.array(ClickSendSentMessageSchema),
});
export type SmsSendResponse = z.infer<typeof SmsSendResponseSchema>;

export const SmsHistoryInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	date_from: z.number().optional().describe('Start epoch timestamp'),
	date_to: z.number().optional().describe('End epoch timestamp'),
});
export type SmsHistoryInput = z.infer<typeof SmsHistoryInputSchema>;

export const SmsHistoryResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendSentMessageSchema),
});
export type SmsHistoryResponse = z.infer<typeof SmsHistoryResponseSchema>;

export const SmsInboundInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type SmsInboundInput = z.infer<typeof SmsInboundInputSchema>;

export const ClickSendInboundMessageSchema = z.object({
	message_id: z.string(),
	to: z.string(),
	from: z.string(),
	body: z.string(),
	timestamp: z.number().optional(),
	original_message_id: z.string().optional(),
});
export type ClickSendInboundMessage = z.infer<
	typeof ClickSendInboundMessageSchema
>;

export const SmsInboundResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendInboundMessageSchema),
});
export type SmsInboundResponse = z.infer<typeof SmsInboundResponseSchema>;

export const SmsReceiptsInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type SmsReceiptsInput = z.infer<typeof SmsReceiptsInputSchema>;

export const ClickSendDeliveryReceiptSchema = z.object({
	message_id: z.string(),
	status: z.string(),
	status_code: z.string().optional(),
	status_text: z.string().optional(),
	timestamp: z.number().optional(),
	original_message_id: z.string().optional(),
});
export type ClickSendDeliveryReceipt = z.infer<
	typeof ClickSendDeliveryReceiptSchema
>;

export const SmsReceiptsResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendDeliveryReceiptSchema),
});
export type SmsReceiptsResponse = z.infer<typeof SmsReceiptsResponseSchema>;

// ── Voice ─────────────────────────────────────────────────────────────────────

export const VoiceMessageInputSchema = z.object({
	to: z.string().min(1).describe('Recipient phone number in E.164 format'),
	body: z.string().min(1).describe('Text to be spoken to the recipient'),
	voice: z.enum(['female', 'male']).optional().describe('Voice gender'),
	lang: z.string().optional().describe('Language code (e.g. en-us, en-gb)'),
	schedule: z
		.number()
		.optional()
		.describe('Epoch timestamp for scheduled call'),
	require_input: z
		.number()
		.int()
		.optional()
		.describe('Whether user must press a key to hear message'),
	machine_detection: z
		.number()
		.int()
		.optional()
		.describe('Whether to detect answering machine'),
});
export type VoiceMessageInput = z.infer<typeof VoiceMessageInputSchema>;

export const VoiceSendInputSchema = z.object({
	messages: z.array(VoiceMessageInputSchema).min(1),
});
export type VoiceSendInput = z.infer<typeof VoiceSendInputSchema>;

export const ClickSendVoiceMessageSchema = z.object({
	to: z.string(),
	body: z.string(),
	voice: z.string().optional(),
	lang: z.string().optional(),
	message_id: z.string(),
	status: z.string(),
	date: z.number().optional(),
});
export type ClickSendVoiceMessage = z.infer<typeof ClickSendVoiceMessageSchema>;

export const VoiceSendResponseSchema = z.object({
	total_price: z.number().optional(),
	total_count: z.number().optional(),
	queued_count: z.number().optional(),
	messages: z.array(ClickSendVoiceMessageSchema),
});
export type VoiceSendResponse = z.infer<typeof VoiceSendResponseSchema>;

export const VoiceHistoryInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type VoiceHistoryInput = z.infer<typeof VoiceHistoryInputSchema>;

export const VoiceHistoryResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendVoiceMessageSchema),
});
export type VoiceHistoryResponse = z.infer<typeof VoiceHistoryResponseSchema>;

// ── Contacts & Lists ──────────────────────────────────────────────────────────

export const ContactListsGetAllInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type ContactListsGetAllInput = z.infer<
	typeof ContactListsGetAllInputSchema
>;

export const ClickSendContactListSchema = z.object({
	list_id: z.number().int().positive(),
	list_name: z.string(),
	contact_count: z.number().optional(),
});
export type ClickSendContactList = z.infer<typeof ClickSendContactListSchema>;

export const ContactListsGetAllResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendContactListSchema),
});
export type ContactListsGetAllResponse = z.infer<
	typeof ContactListsGetAllResponseSchema
>;

export const ContactListsCreateInputSchema = z.object({
	list_name: z.string().min(1).describe('Name for the contact list'),
});
export type ContactListsCreateInput = z.infer<
	typeof ContactListsCreateInputSchema
>;

export const ContactListsCreateResponseSchema = ClickSendContactListSchema;
export type ContactListsCreateResponse = z.infer<
	typeof ContactListsCreateResponseSchema
>;

export const ContactsCreateInputSchema = z.object({
	list_id: z.number().int().positive().describe('Target contact list ID'),
	phone_number: z.string().min(1).describe('Phone number of the contact'),
	first_name: z.string().optional().describe('First name'),
	last_name: z.string().optional().describe('Last name'),
	email: z.string().email().optional().describe('Email address'),
});
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ClickSendContactSchema = z.object({
	contact_id: z.number().int().positive(),
	list_id: z.number().int().positive(),
	phone_number: z.string(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().optional(),
});
export type ClickSendContact = z.infer<typeof ClickSendContactSchema>;

export const ContactsCreateResponseSchema = ClickSendContactSchema;
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

export const ContactsListInputSchema = z.object({
	list_id: z
		.number()
		.int()
		.positive()
		.describe('List ID to fetch contacts from'),
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListResponseSchema = z.object({
	current_page: z.number().optional(),
	per_page: z.number().optional(),
	total: z.number().optional(),
	last_page: z.number().optional(),
	data: z.array(ClickSendContactSchema),
});
export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

// ── Aggregate Input & Output Types ────────────────────────────────────────────

export type ClickSendEndpointInputs = {
	accountGet: AccountGetInput;
	smsSend: SmsSendInput;
	smsHistory: SmsHistoryInput;
	smsInbound: SmsInboundInput;
	smsReceipts: SmsReceiptsInput;
	voiceSend: VoiceSendInput;
	voiceHistory: VoiceHistoryInput;
	contactListsGetAll: ContactListsGetAllInput;
	contactListsCreate: ContactListsCreateInput;
	contactsCreate: ContactsCreateInput;
	contactsList: ContactsListInput;
};

export type ClickSendEndpointOutputs = {
	accountGet: AccountGetResponse;
	smsSend: SmsSendResponse;
	smsHistory: SmsHistoryResponse;
	smsInbound: SmsInboundResponse;
	smsReceipts: SmsReceiptsResponse;
	voiceSend: VoiceSendResponse;
	voiceHistory: VoiceHistoryResponse;
	contactListsGetAll: ContactListsGetAllResponse;
	contactListsCreate: ContactListsCreateResponse;
	contactsCreate: ContactsCreateResponse;
	contactsList: ContactsListResponse;
};

export const ClickSendEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	smsSend: SmsSendInputSchema,
	smsHistory: SmsHistoryInputSchema,
	smsInbound: SmsInboundInputSchema,
	smsReceipts: SmsReceiptsInputSchema,
	voiceSend: VoiceSendInputSchema,
	voiceHistory: VoiceHistoryInputSchema,
	contactListsGetAll: ContactListsGetAllInputSchema,
	contactListsCreate: ContactListsCreateInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsList: ContactsListInputSchema,
} as const;

export const ClickSendEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	smsSend: SmsSendResponseSchema,
	smsHistory: SmsHistoryResponseSchema,
	smsInbound: SmsInboundResponseSchema,
	smsReceipts: SmsReceiptsResponseSchema,
	voiceSend: VoiceSendResponseSchema,
	voiceHistory: VoiceHistoryResponseSchema,
	contactListsGetAll: ContactListsGetAllResponseSchema,
	contactListsCreate: ContactListsCreateResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsList: ContactsListResponseSchema,
} as const;
