import { z } from 'zod';

// ── Messages ──────────────────────────────────────────────────────────────────

const MessagesSendInputSchema = z.object({
	To: z.string(),
	From: z.string(),
	Body: z.string().optional(),
	MediaUrl: z.array(z.string()).optional(),
	StatusCallback: z.string().optional(),
	MessagingServiceSid: z.string().optional(),
});

export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

const TwilioMessageSchema = z.object({
	sid: z.string(),
	date_created: z.string().nullable(),
	date_updated: z.string().nullable(),
	date_sent: z.string().nullable(),
	account_sid: z.string(),
	to: z.string(),
	from: z.string(),
	body: z.string().nullable(),
	status: z.string(),
	num_segments: z.string().nullable().optional(),
	num_media: z.string().nullable().optional(),
	direction: z.string(),
	api_version: z.string().optional(),
	price: z.string().nullable(),
	price_unit: z.string().nullable(),
	error_code: z.number().nullable().optional(),
	error_message: z.string().nullable().optional(),
	uri: z.string(),
	subresource_uris: z.record(z.string(), z.string()).optional(),
});

const MessagesSendResponseSchema = TwilioMessageSchema;
export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

const MessagesGetInputSchema = z.object({
	messageSid: z.string(),
});
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

const MessagesGetResponseSchema = TwilioMessageSchema;
export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;

const MessagesListInputSchema = z.object({
	To: z.string().optional(),
	From: z.string().optional(),
	DateSent: z.string().optional(),
	PageSize: z.number().optional(),
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

const MessagesListResponseSchema = z.object({
	messages: z.array(TwilioMessageSchema),
	first_page_uri: z.string().optional(),
	next_page_uri: z.string().nullable().optional(),
	previous_page_uri: z.string().nullable().optional(),
	page: z.number().optional(),
	page_size: z.number().optional(),
	uri: z.string().optional(),
});
export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

// ── Calls ─────────────────────────────────────────────────────────────────────

const CallsCreateInputSchema = z.object({
	To: z.string(),
	From: z.string(),
	Url: z.string().optional(),
	Twiml: z.string().optional(),
	StatusCallback: z.string().optional(),
	StatusCallbackMethod: z.enum(['GET', 'POST']).optional(),
	StatusCallbackEvent: z.array(z.string()).optional(),
	Timeout: z.number().optional(),
	Record: z.boolean().optional(),
});
export type CallsCreateInput = z.infer<typeof CallsCreateInputSchema>;

const TwilioCallSchema = z.object({
	sid: z.string(),
	date_created: z.string().nullable(),
	date_updated: z.string().nullable(),
	account_sid: z.string(),
	to: z.string(),
	to_formatted: z.string().optional(),
	from: z.string(),
	from_formatted: z.string().optional(),
	phone_number_sid: z.string().nullable().optional(),
	status: z.string(),
	start_time: z.string().nullable().optional(),
	end_time: z.string().nullable().optional(),
	duration: z.string().nullable().optional(),
	price: z.string().nullable(),
	price_unit: z.string().nullable(),
	direction: z.string(),
	api_version: z.string().optional(),
	uri: z.string(),
	subresource_uris: z.record(z.string(), z.string()).optional(),
});

const CallsCreateResponseSchema = TwilioCallSchema;
export type CallsCreateResponse = z.infer<typeof CallsCreateResponseSchema>;

const CallsGetInputSchema = z.object({
	callSid: z.string(),
});
export type CallsGetInput = z.infer<typeof CallsGetInputSchema>;

const CallsGetResponseSchema = TwilioCallSchema;
export type CallsGetResponse = z.infer<typeof CallsGetResponseSchema>;

const CallsListInputSchema = z.object({
	To: z.string().optional(),
	From: z.string().optional(),
	Status: z.string().optional(),
	StartTime: z.string().optional(),
	EndTime: z.string().optional(),
	PageSize: z.number().optional(),
});
export type CallsListInput = z.infer<typeof CallsListInputSchema>;

const CallsListResponseSchema = z.object({
	calls: z.array(TwilioCallSchema),
	first_page_uri: z.string().optional(),
	next_page_uri: z.string().nullable().optional(),
	previous_page_uri: z.string().nullable().optional(),
	page: z.number().optional(),
	page_size: z.number().optional(),
	uri: z.string().optional(),
});
export type CallsListResponse = z.infer<typeof CallsListResponseSchema>;

// ── Aggregate Types ───────────────────────────────────────────────────────────

export type TwilioEndpointInputs = {
	messagesSend: MessagesSendInput;
	messagesGet: MessagesGetInput;
	messagesList: MessagesListInput;
	callsCreate: CallsCreateInput;
	callsGet: CallsGetInput;
	callsList: CallsListInput;
};

export type TwilioEndpointOutputs = {
	messagesSend: MessagesSendResponse;
	messagesGet: MessagesGetResponse;
	messagesList: MessagesListResponse;
	callsCreate: CallsCreateResponse;
	callsGet: CallsGetResponse;
	callsList: CallsListResponse;
};

export const TwilioEndpointInputSchemas = {
	messagesSend: MessagesSendInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesList: MessagesListInputSchema,
	callsCreate: CallsCreateInputSchema,
	callsGet: CallsGetInputSchema,
	callsList: CallsListInputSchema,
} as const;

export const TwilioEndpointOutputSchemas = {
	messagesSend: MessagesSendResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesList: MessagesListResponseSchema,
	callsCreate: CallsCreateResponseSchema,
	callsGet: CallsGetResponseSchema,
	callsList: CallsListResponseSchema,
} as const;
