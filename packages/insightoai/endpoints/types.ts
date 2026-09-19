import { z } from 'zod';

// Insighto.ai's live API reference (docs.insighto.ai/api/ragify) renders response schemas
// through a client-side OpenAPI panel that doesn't expose field-level detail through static
// scraping — only request parameters were independently confirmed (cross-referenced against
// Composio's published Insighto.ai toolkit, which mirrors the same 65 operations). Response
// shapes are therefore intentionally left permissive rather than guessed at the field level.
const InsightoaiResponseSchema = z.record(z.string(), z.unknown());
export type InsightoaiResponse = z.infer<typeof InsightoaiResponseSchema>;

const PaginationInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
});

// ---------------------------------------------------------------------------
// Domain 1: Assistants, Intents & Prompts — 9 ops
// ---------------------------------------------------------------------------

const GetAssistantByIdInputSchema = z.object({
	assistant_id: z.string(),
});
export type GetAssistantByIdInput = z.infer<typeof GetAssistantByIdInputSchema>;

const DeleteAssistantByIdInputSchema = z.object({
	assistant_id: z.string(),
});
export type DeleteAssistantByIdInput = z.infer<
	typeof DeleteAssistantByIdInputSchema
>;

const AddIntentToAssistantInputSchema = z.object({
	assistant_id: z.string(),
	intent_id: z.string(),
	// Shape varies by intent type and isn't documented at the field level; passed through as-is.
	attributes: z.record(z.string(), z.unknown()).optional(),
});
export type AddIntentToAssistantInput = z.infer<
	typeof AddIntentToAssistantInputSchema
>;

const CreateIntentInputSchema = z.object({
	name: z.string(),
	is_active: z.boolean().optional(),
	// free-form attributes object where keys and value shapes vary dynamically per intent configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	description: z.string().optional(),
	intent_type: z.string().optional(),
});
export type CreateIntentInput = z.infer<typeof CreateIntentInputSchema>;

const GetIntentByIdInputSchema = z.object({
	intent_id: z.string(),
});
export type GetIntentByIdInput = z.infer<typeof GetIntentByIdInputSchema>;

const ReadIntentsListInputSchema = PaginationInputSchema;
export type ReadIntentsListInput = z.infer<typeof ReadIntentsListInputSchema>;

const CreatePromptInputSchema = z.object({
	name: z.string().optional(),
	owner_type: z.string().optional(),
	description: z.string().optional(),
	prompt_template: z.string().optional(),
});
export type CreatePromptInput = z.infer<typeof CreatePromptInputSchema>;

const GetPromptByIdInputSchema = z.object({
	prompt_id: z.string(),
});
export type GetPromptByIdInput = z.infer<typeof GetPromptByIdInputSchema>;

const DeletePromptByIdInputSchema = z.object({
	prompt_id: z.string(),
});
export type DeletePromptByIdInput = z.infer<typeof DeletePromptByIdInputSchema>;

// ---------------------------------------------------------------------------
// Domain 2: AI Providers, Custom Voices & Speech-to-Text — 5 ops
// ---------------------------------------------------------------------------

const CreateProviderInputSchema = z.object({
	name: z.string(),
	org_id: z.string().optional(),
	status: z.boolean().optional(),
	// free-form attributes object where keys and value shapes vary dynamically per provider configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	provider_key: z.string(),
	provider_name: z
		.enum(['openai', 'elevenlabs', 'azure_speech', 'cartesia', 'playht'])
		.optional(),
});
export type CreateProviderInput = z.infer<typeof CreateProviderInputSchema>;

const GetProviderByIdInputSchema = z.object({
	provider_id: z.string(),
});
export type GetProviderByIdInput = z.infer<typeof GetProviderByIdInputSchema>;

const DeleteProviderByIdInputSchema = z.object({
	provider_id: z.string(),
});
export type DeleteProviderByIdInput = z.infer<
	typeof DeleteProviderByIdInputSchema
>;

const GetSpeechtotextListInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().max(1000).optional(),
});
export type GetSpeechtotextListInput = z.infer<
	typeof GetSpeechtotextListInputSchema
>;

const RetrieveListOfUserCustomVoiceInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().max(1000).optional(),
});
export type RetrieveListOfUserCustomVoiceInput = z.infer<
	typeof RetrieveListOfUserCustomVoiceInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 3: Contacts, Messaging & Campaigns — 9 ops
// ---------------------------------------------------------------------------

const GetContactByIdInputSchema = z.object({
	contact_id: z.string(),
});
export type GetContactByIdInput = z.infer<typeof GetContactByIdInputSchema>;

const GetListOfContactsInputSchema = PaginationInputSchema;
export type GetListOfContactsInput = z.infer<
	typeof GetListOfContactsInputSchema
>;

const UpsertContactByEmailOrPhoneNumberInputSchema = z.object({
	email: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	phone_number: z.string(),
});
export type UpsertContactByEmailOrPhoneNumberInput = z.infer<
	typeof UpsertContactByEmailOrPhoneNumberInputSchema
>;

const DeleteContactsInBulkInputSchema = z.object({
	contact_ids: z.array(z.string()),
});
export type DeleteContactsInBulkInput = z.infer<
	typeof DeleteContactsInBulkInputSchema
>;

const CreateContactCustomFieldInputSchema = z.object({
	org_id: z.string().optional(),
	custom_field_name: z.string(),
	custom_field_type: z.string(),
});
export type CreateContactCustomFieldInput = z.infer<
	typeof CreateContactCustomFieldInputSchema
>;

const ReadContactCustomFieldListInputSchema = PaginationInputSchema;
export type ReadContactCustomFieldListInput = z.infer<
	typeof ReadContactCustomFieldListInputSchema
>;

const ReadCampaignContactListInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	campaign_id: z.string(),
});
export type ReadCampaignContactListInput = z.infer<
	typeof ReadCampaignContactListInputSchema
>;

const SendMessagesToContactsInputSchema = z.object({
	message: z.string().optional(),
	widget_id: z.string(),
	contact_ids: z.array(z.string()),
	start_new_conversation: z.boolean().optional(),
});
export type SendMessagesToContactsInput = z.infer<
	typeof SendMessagesToContactsInputSchema
>;

const ReadContactSyncLogListInputSchema = PaginationInputSchema;
export type ReadContactSyncLogListInput = z.infer<
	typeof ReadContactSyncLogListInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 4: Forms & Data Capture — 4 ops
// ---------------------------------------------------------------------------

const CreateFormInputSchema = z.object({
	name: z.string(),
	// each field's shape (label, type, validation, options) varies per field type and isn't
	// documented at the individual-field level, so it's passed through as a free-form object
	fields: z.array(z.record(z.string(), z.unknown())).optional(),
	org_id: z.string().optional(),
	form_type: z.enum(['natural', 'simple']),
	// free-form attributes object where keys and value shapes vary dynamically per form configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	webhook_id: z.string().optional(),
	trigger_tools: z.array(z.string()).optional(),
	// maps form field names to contact fields; the mapping shape depends on the caller's form schema
	contact_mapping: z.record(z.string(), z.unknown()).optional(),
	trigger_instructions: z.string(),
});
export type CreateFormInput = z.infer<typeof CreateFormInputSchema>;

const GetCapturedFormByFormIdInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	form_id: z.string(),
});
export type GetCapturedFormByFormIdInput = z.infer<
	typeof GetCapturedFormByFormIdInputSchema
>;

const DeleteFormByIdInputSchema = z.object({
	form_id: z.string(),
});
export type DeleteFormByIdInput = z.infer<typeof DeleteFormByIdInputSchema>;

const DeleteBulkFormsByIdsInputSchema = z.object({
	form_ids: z.array(z.string()),
});
export type DeleteBulkFormsByIdsInput = z.infer<
	typeof DeleteBulkFormsByIdsInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 5: Tool Calling & Function Orchestration — 9 ops
// ---------------------------------------------------------------------------

const CreateToolfunctionInputSchema = z.object({
	name: z.string(),
	// free-form details object whose shape depends on tool_function_type (sdk/curl/query_index)
	details: z.record(z.string(), z.unknown()).optional(),
	tool_id: z.string().optional(),
	is_enabled: z.boolean().optional(),
	description: z.string(),
	tool_function_type: z.enum(['sdk', 'curl', 'query_index']),
});
export type CreateToolfunctionInput = z.infer<
	typeof CreateToolfunctionInputSchema
>;

const UpdateToolfunctionByIdInputSchema = z.object({
	toolfunction_id: z.string(),
	name: z.string().optional(),
	// free-form details object whose shape depends on tool_function_type (sdk/curl/query_index)
	details: z.record(z.string(), z.unknown()).optional(),
	tool_id: z.string().optional(),
	is_enabled: z.boolean().optional(),
	description: z.string().optional(),
	tool_function_type: z.enum(['sdk', 'curl', 'query_index']).optional(),
});
export type UpdateToolfunctionByIdInput = z.infer<
	typeof UpdateToolfunctionByIdInputSchema
>;

const DeleteToolfunctionByIdInputSchema = z.object({
	toolfunction_id: z.string(),
});
export type DeleteToolfunctionByIdInput = z.infer<
	typeof DeleteToolfunctionByIdInputSchema
>;

const ReadToolToolfunctionListInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	tool_id: z.string(),
});
export type ReadToolToolfunctionListInput = z.infer<
	typeof ReadToolToolfunctionListInputSchema
>;

const UpdateToolByIdInputSchema = z.object({
	tool_id: z.string(),
	// free-form SDK configuration object whose shape depends on the tool provider's SDK
	sdk: z.record(z.string(), z.unknown()).optional(),
	name: z.string().optional(),
	org_id: z.string().optional(),
	enabled: z.boolean().optional(),
	base_url: z.string().optional(),
	category: z.string().optional(),
	logo_url: z.string().optional(),
	tool_type: z.string().optional(),
	// free-form attributes object where keys and value shapes vary dynamically per tool configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	description: z.string().optional(),
	tool_provider: z.string().optional(),
	// free-form authentication credentials object whose shape varies per tool_provider
	authentication: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateToolByIdInput = z.infer<typeof UpdateToolByIdInputSchema>;

const DeleteToolByIdInputSchema = z.object({
	tool_id: z.string(),
});
export type DeleteToolByIdInput = z.infer<typeof DeleteToolByIdInputSchema>;

const ReadToolFunctionInvokeLogListInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	conversation_id: z.string().optional(),
});
export type ReadToolFunctionInvokeLogListInput = z.infer<
	typeof ReadToolFunctionInvokeLogListInputSchema
>;

const RetrieveLinkedToolAndUserInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	tool_id: z.string(),
});
export type RetrieveLinkedToolAndUserInput = z.infer<
	typeof RetrieveLinkedToolAndUserInputSchema
>;

const UpdateLinkToolUserInputSchema = z.object({
	link_tool_user_id: z.string(),
	name: z.string().optional(),
	org_id: z.string().optional(),
	tool_id: z.string().optional(),
	// free-form attributes object where keys and value shapes vary dynamically per link configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	// free-form credentials object whose shape varies per linked tool's auth requirements
	credentials: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateLinkToolUserInput = z.infer<
	typeof UpdateLinkToolUserInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 6: Widgets, Channels & Conversations — 6 ops
// ---------------------------------------------------------------------------

const WidgetTypeSchema = z.enum([
	'web_chat',
	'web_voice',
	'whatsapp',
	'sms',
	'messenger',
	'instagram',
	'telegram',
	'ghl_chat',
	'ghl_missed_call',
	'embedded_form',
	'popup',
	'inline',
	'floating_bubble',
	'voice_widget',
	'custom',
]);

const CreateWidgetInputSchema = z.object({
	name: z.string().optional(),
	org_id: z.string().optional(),
	// free-form attributes object where keys and value shapes vary dynamically per widget configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	bubble_text: z.string().optional(),
	description: z.string().optional(),
	widget_type: WidgetTypeSchema,
	assistant_id: z.string().optional(),
	bubble_color: z.string().optional(),
	display_name: z.string().optional(),
	header_color: z.string().optional(),
	// free-form style overrides object whose keys vary per widget_type
	style_params: z.record(z.string(), z.unknown()).optional(),
	intro_message: z.string().optional(),
	// each action button's shape (label, action type, target) varies and isn't documented at
	// the individual-field level, so it's passed through as a free-form object
	action_buttons: z.array(z.record(z.string(), z.unknown())),
	bot_icon_color: z.string().optional(),
	ice_break_color: z.string().optional(),
	remove_branding: z.boolean().optional(),
	bot_message_color: z.string().optional(),
	header_text_color: z.string().optional(),
	user_message_color: z.string().optional(),
	action_buttons_color: z.string().optional(),
	textbox_default_text: z.string().optional(),
	user_opening_messages: z.array(z.string()),
	bot_text_message_color: z.string().optional(),
	user_text_message_color: z.string().optional(),
});
export type CreateWidgetInput = z.infer<typeof CreateWidgetInputSchema>;

const GetWidgetByIdInputSchema = z.object({
	widget_id: z.string(),
});
export type GetWidgetByIdInput = z.infer<typeof GetWidgetByIdInputSchema>;

const DeleteWidgetByIdInputSchema = z.object({
	widget_id: z.string(),
});
export type DeleteWidgetByIdInput = z.infer<typeof DeleteWidgetByIdInputSchema>;

const GetListOfWidgetsLinkedToAssistantIdInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	assistant_id: z.string(),
});
export type GetListOfWidgetsLinkedToAssistantIdInput = z.infer<
	typeof GetListOfWidgetsLinkedToAssistantIdInputSchema
>;

const ListChannelsInputSchema = PaginationInputSchema;
export type ListChannelsInput = z.infer<typeof ListChannelsInputSchema>;

const GetListOfConversationsInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	date_to: z.string(),
	date_from: z.string(),
	intent_id: z.string().optional(),
	assistant_id: z.string().optional(),
	includes_voice: z.boolean().optional(),
});
export type GetListOfConversationsInput = z.infer<
	typeof GetListOfConversationsInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 7: Knowledge Base Data Sources & Tags — 8 ops
// ---------------------------------------------------------------------------

const GetDatasourceByIdInputSchema = z.object({
	datasource_id: z.string(),
});
export type GetDatasourceByIdInput = z.infer<
	typeof GetDatasourceByIdInputSchema
>;

const GetListOfDatasourcesInputSchema = PaginationInputSchema;
export type GetListOfDatasourcesInput = z.infer<
	typeof GetListOfDatasourcesInputSchema
>;

const GetListOfDataSourcesLinkedToAssistantIdInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	assistant_id: z.string(),
});
export type GetListOfDataSourcesLinkedToAssistantIdInput = z.infer<
	typeof GetListOfDataSourcesLinkedToAssistantIdInputSchema
>;

const DeleteLinkedAssistantDatasourceInputSchema = z.object({
	assistant_id: z.string(),
	datasource_id: z.string(),
});
export type DeleteLinkedAssistantDatasourceInput = z.infer<
	typeof DeleteLinkedAssistantDatasourceInputSchema
>;

const CreateTagInputSchema = z.object({
	name: z.string(),
	// free-form attributes object where keys and value shapes vary dynamically per tag configuration
	attributes: z.record(z.string(), z.unknown()).optional(),
	color_code: z.string(),
	description: z.string(),
});
export type CreateTagInput = z.infer<typeof CreateTagInputSchema>;

const ReadTagListInputSchema = PaginationInputSchema;
export type ReadTagListInput = z.infer<typeof ReadTagListInputSchema>;

const DeleteTagByIdInputSchema = z.object({
	tag_id: z.string(),
});
export type DeleteTagByIdInput = z.infer<typeof DeleteTagByIdInputSchema>;

const DeleteLinkTagEntityByIdInputSchema = z.object({
	link_tag_entity_id: z.string(),
});
export type DeleteLinkTagEntityByIdInput = z.infer<
	typeof DeleteLinkTagEntityByIdInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 8: Webhooks & Telephony Integrations (Twilio / WhatsApp) — 9 ops
// ---------------------------------------------------------------------------

const CreateWebhookInputSchema = z.object({
	name: z.string(),
	enabled: z.boolean().optional(),
	endpoint: z.string(),
});
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

const UpdateWebhookByIdInputSchema = z.object({
	webhook_id: z.string(),
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	endpoint: z.string().optional(),
});
export type UpdateWebhookByIdInput = z.infer<
	typeof UpdateWebhookByIdInputSchema
>;

const DeleteWebhookByIdInputSchema = z.object({
	webhook_id: z.string(),
});
export type DeleteWebhookByIdInput = z.infer<
	typeof DeleteWebhookByIdInputSchema
>;

const RetrieveWebhookLogInputSchema = z.object({
	page: z.number().optional(),
	size: z.number().optional(),
	webhook_id: z.string(),
});
export type RetrieveWebhookLogInput = z.infer<
	typeof RetrieveWebhookLogInputSchema
>;

const ReadTwilioAuthListInputSchema = PaginationInputSchema;
export type ReadTwilioAuthListInput = z.infer<
	typeof ReadTwilioAuthListInputSchema
>;

const UpdateTwilioAuthByIdInputSchema = z.object({
	twilio_auth_id: z.string(),
	name: z.string().optional(),
	twilio_auth_token: z.string().optional(),
	twilio_account_sid: z.string().optional(),
});
export type UpdateTwilioAuthByIdInput = z.infer<
	typeof UpdateTwilioAuthByIdInputSchema
>;

const DeleteTwilioAuthByIdInputSchema = z.object({
	twilio_auth_id: z.string(),
});
export type DeleteTwilioAuthByIdInput = z.infer<
	typeof DeleteTwilioAuthByIdInputSchema
>;

const UpdateUserwhatsappByIdInputSchema = z.object({
	userwhatsapp_id: z.string(),
	phone_number_id: z.string().optional(),
	phone_business_id: z.string().optional(),
	facebook_app_secret: z.string().optional(),
	whatsapp_access_token: z.string().optional(),
	whatsapp_phone_number: z.string().optional(),
});
export type UpdateUserwhatsappByIdInput = z.infer<
	typeof UpdateUserwhatsappByIdInputSchema
>;

const DeleteUserwhatsappByIdInputSchema = z.object({
	userwhatsapp_id: z.string(),
});
export type DeleteUserwhatsappByIdInput = z.infer<
	typeof DeleteUserwhatsappByIdInputSchema
>;

// ---------------------------------------------------------------------------
// Domain 9: Agency Branding, Users & Billing Quotas — 7 ops
// ---------------------------------------------------------------------------

const CreateAgencyInputSchema = z.object({
	org_id: z.string(),
	// free-form domain configuration object (custom subdomain, DNS settings) whose shape isn't documented at the field level
	domain: z.record(z.string(), z.unknown()).optional(),
	// free-form branding object (logo, colors, social profiles) whose shape isn't documented at the field level
	branding: z.record(z.string(), z.unknown()).optional(),
	// free-form user auth configuration object whose shape varies per agency auth setup
	user_auth: z.record(z.string(), z.unknown()).optional(),
	// free-form billing plan object whose shape varies per plan type (wallet vs subscription)
	billing_plan: z.record(z.string(), z.unknown()).optional(),
});
export type CreateAgencyInput = z.infer<typeof CreateAgencyInputSchema>;

const GetAgencyBrandingByIdInputSchema = z.object({
	agency_id: z.string(),
});
export type GetAgencyBrandingByIdInput = z.infer<
	typeof GetAgencyBrandingByIdInputSchema
>;

const GetAgencyBillingPlanInputSchema = z.object({
	billing_plan_id: z.string(),
});
export type GetAgencyBillingPlanInput = z.infer<
	typeof GetAgencyBillingPlanInputSchema
>;

const GetPricingForUserInputSchema = z.object({
	llm_model_id: z.string().optional(),
	voice_stt_id: z.string().optional(),
	voice_tts_id: z.string().optional(),
});
export type GetPricingForUserInput = z.infer<
	typeof GetPricingForUserInputSchema
>;

const GetAgentListInputSchema = z.object({
	page: z.number().optional().default(1),
	size: z.number().optional().default(50),
});
export type GetAgentListInput = z.infer<typeof GetAgentListInputSchema>;

// user_id is required; the remaining ~26 fields cover profile/billing/Stripe details and are
// all optional per Insighto.ai's Update User Profile operation, so they're grouped loosely
// rather than enumerated field-by-field.
// catchall(z.unknown()): open-ended profile patch body (name, email, billing flags, Stripe
// fields, etc.) — stricter per-field typing would lag Insighto's large optional surface.
const UpdateUserProfileInputSchema = z
	.object({
		user_id: z.string(),
	})
	.catchall(z.unknown());
export type UpdateUserProfileInput = z.infer<
	typeof UpdateUserProfileInputSchema
>;

const RetrieveUserMonthlyUsagesAggregationInputSchema = PaginationInputSchema;
export type RetrieveUserMonthlyUsagesAggregationInput = z.infer<
	typeof RetrieveUserMonthlyUsagesAggregationInputSchema
>;

// ---------------------------------------------------------------------------
// Aggregated maps
// ---------------------------------------------------------------------------

export type InsightoaiEndpointInputs = {
	getAssistantById: GetAssistantByIdInput;
	deleteAssistantById: DeleteAssistantByIdInput;
	addIntentToAssistant: AddIntentToAssistantInput;
	createIntent: CreateIntentInput;
	getIntentById: GetIntentByIdInput;
	readIntentsList: ReadIntentsListInput;
	createPrompt: CreatePromptInput;
	getPromptById: GetPromptByIdInput;
	deletePromptById: DeletePromptByIdInput;

	createProvider: CreateProviderInput;
	getProviderById: GetProviderByIdInput;
	deleteProviderById: DeleteProviderByIdInput;
	getSpeechtotextList: GetSpeechtotextListInput;
	retrieveListOfUserCustomVoice: RetrieveListOfUserCustomVoiceInput;

	getContactById: GetContactByIdInput;
	getListOfContacts: GetListOfContactsInput;
	upsertContactByEmailOrPhoneNumber: UpsertContactByEmailOrPhoneNumberInput;
	deleteContactsInBulk: DeleteContactsInBulkInput;
	createContactCustomField: CreateContactCustomFieldInput;
	readContactCustomFieldList: ReadContactCustomFieldListInput;
	readCampaignContactList: ReadCampaignContactListInput;
	sendMessagesToContacts: SendMessagesToContactsInput;
	readContactSyncLogList: ReadContactSyncLogListInput;

	createForm: CreateFormInput;
	getCapturedFormByFormId: GetCapturedFormByFormIdInput;
	deleteFormById: DeleteFormByIdInput;
	deleteBulkFormsByIds: DeleteBulkFormsByIdsInput;

	createToolfunction: CreateToolfunctionInput;
	updateToolfunctionById: UpdateToolfunctionByIdInput;
	deleteToolfunctionById: DeleteToolfunctionByIdInput;
	readToolToolfunctionList: ReadToolToolfunctionListInput;
	updateToolById: UpdateToolByIdInput;
	deleteToolById: DeleteToolByIdInput;
	readToolFunctionInvokeLogList: ReadToolFunctionInvokeLogListInput;
	retrieveLinkedToolAndUser: RetrieveLinkedToolAndUserInput;
	updateLinkToolUser: UpdateLinkToolUserInput;

	createWidget: CreateWidgetInput;
	getWidgetById: GetWidgetByIdInput;
	deleteWidgetById: DeleteWidgetByIdInput;
	getListOfWidgetsLinkedToAssistantId: GetListOfWidgetsLinkedToAssistantIdInput;
	listChannels: ListChannelsInput;
	getListOfConversations: GetListOfConversationsInput;

	getDatasourceById: GetDatasourceByIdInput;
	getListOfDatasources: GetListOfDatasourcesInput;
	getListOfDataSourcesLinkedToAssistantId: GetListOfDataSourcesLinkedToAssistantIdInput;
	deleteLinkedAssistantDatasource: DeleteLinkedAssistantDatasourceInput;
	createTag: CreateTagInput;
	readTagList: ReadTagListInput;
	deleteTagById: DeleteTagByIdInput;
	deleteLinkTagEntityById: DeleteLinkTagEntityByIdInput;

	createWebhook: CreateWebhookInput;
	updateWebhookById: UpdateWebhookByIdInput;
	deleteWebhookById: DeleteWebhookByIdInput;
	retrieveWebhookLog: RetrieveWebhookLogInput;
	readTwilioAuthList: ReadTwilioAuthListInput;
	updateTwilioAuthById: UpdateTwilioAuthByIdInput;
	deleteTwilioAuthById: DeleteTwilioAuthByIdInput;
	updateUserwhatsappById: UpdateUserwhatsappByIdInput;
	deleteUserwhatsappById: DeleteUserwhatsappByIdInput;

	createAgency: CreateAgencyInput;
	getAgencyBrandingById: GetAgencyBrandingByIdInput;
	getAgencyBillingPlan: GetAgencyBillingPlanInput;
	getPricingForUser: GetPricingForUserInput;
	getAgentList: GetAgentListInput;
	updateUserProfile: UpdateUserProfileInput;
	retrieveUserMonthlyUsagesAggregation: RetrieveUserMonthlyUsagesAggregationInput;
};

export type InsightoaiEndpointOutputs = {
	[K in keyof InsightoaiEndpointInputs]: InsightoaiResponse;
};

export const InsightoaiEndpointInputSchemas = {
	getAssistantById: GetAssistantByIdInputSchema,
	deleteAssistantById: DeleteAssistantByIdInputSchema,
	addIntentToAssistant: AddIntentToAssistantInputSchema,
	createIntent: CreateIntentInputSchema,
	getIntentById: GetIntentByIdInputSchema,
	readIntentsList: ReadIntentsListInputSchema,
	createPrompt: CreatePromptInputSchema,
	getPromptById: GetPromptByIdInputSchema,
	deletePromptById: DeletePromptByIdInputSchema,

	createProvider: CreateProviderInputSchema,
	getProviderById: GetProviderByIdInputSchema,
	deleteProviderById: DeleteProviderByIdInputSchema,
	getSpeechtotextList: GetSpeechtotextListInputSchema,
	retrieveListOfUserCustomVoice: RetrieveListOfUserCustomVoiceInputSchema,

	getContactById: GetContactByIdInputSchema,
	getListOfContacts: GetListOfContactsInputSchema,
	upsertContactByEmailOrPhoneNumber:
		UpsertContactByEmailOrPhoneNumberInputSchema,
	deleteContactsInBulk: DeleteContactsInBulkInputSchema,
	createContactCustomField: CreateContactCustomFieldInputSchema,
	readContactCustomFieldList: ReadContactCustomFieldListInputSchema,
	readCampaignContactList: ReadCampaignContactListInputSchema,
	sendMessagesToContacts: SendMessagesToContactsInputSchema,
	readContactSyncLogList: ReadContactSyncLogListInputSchema,

	createForm: CreateFormInputSchema,
	getCapturedFormByFormId: GetCapturedFormByFormIdInputSchema,
	deleteFormById: DeleteFormByIdInputSchema,
	deleteBulkFormsByIds: DeleteBulkFormsByIdsInputSchema,

	createToolfunction: CreateToolfunctionInputSchema,
	updateToolfunctionById: UpdateToolfunctionByIdInputSchema,
	deleteToolfunctionById: DeleteToolfunctionByIdInputSchema,
	readToolToolfunctionList: ReadToolToolfunctionListInputSchema,
	updateToolById: UpdateToolByIdInputSchema,
	deleteToolById: DeleteToolByIdInputSchema,
	readToolFunctionInvokeLogList: ReadToolFunctionInvokeLogListInputSchema,
	retrieveLinkedToolAndUser: RetrieveLinkedToolAndUserInputSchema,
	updateLinkToolUser: UpdateLinkToolUserInputSchema,

	createWidget: CreateWidgetInputSchema,
	getWidgetById: GetWidgetByIdInputSchema,
	deleteWidgetById: DeleteWidgetByIdInputSchema,
	getListOfWidgetsLinkedToAssistantId:
		GetListOfWidgetsLinkedToAssistantIdInputSchema,
	listChannels: ListChannelsInputSchema,
	getListOfConversations: GetListOfConversationsInputSchema,

	getDatasourceById: GetDatasourceByIdInputSchema,
	getListOfDatasources: GetListOfDatasourcesInputSchema,
	getListOfDataSourcesLinkedToAssistantId:
		GetListOfDataSourcesLinkedToAssistantIdInputSchema,
	deleteLinkedAssistantDatasource: DeleteLinkedAssistantDatasourceInputSchema,
	createTag: CreateTagInputSchema,
	readTagList: ReadTagListInputSchema,
	deleteTagById: DeleteTagByIdInputSchema,
	deleteLinkTagEntityById: DeleteLinkTagEntityByIdInputSchema,

	createWebhook: CreateWebhookInputSchema,
	updateWebhookById: UpdateWebhookByIdInputSchema,
	deleteWebhookById: DeleteWebhookByIdInputSchema,
	retrieveWebhookLog: RetrieveWebhookLogInputSchema,
	readTwilioAuthList: ReadTwilioAuthListInputSchema,
	updateTwilioAuthById: UpdateTwilioAuthByIdInputSchema,
	deleteTwilioAuthById: DeleteTwilioAuthByIdInputSchema,
	updateUserwhatsappById: UpdateUserwhatsappByIdInputSchema,
	deleteUserwhatsappById: DeleteUserwhatsappByIdInputSchema,

	createAgency: CreateAgencyInputSchema,
	getAgencyBrandingById: GetAgencyBrandingByIdInputSchema,
	getAgencyBillingPlan: GetAgencyBillingPlanInputSchema,
	getPricingForUser: GetPricingForUserInputSchema,
	getAgentList: GetAgentListInputSchema,
	updateUserProfile: UpdateUserProfileInputSchema,
	retrieveUserMonthlyUsagesAggregation:
		RetrieveUserMonthlyUsagesAggregationInputSchema,
} as const;

export const InsightoaiEndpointOutputSchemas = {
	getAssistantById: InsightoaiResponseSchema,
	deleteAssistantById: InsightoaiResponseSchema,
	addIntentToAssistant: InsightoaiResponseSchema,
	createIntent: InsightoaiResponseSchema,
	getIntentById: InsightoaiResponseSchema,
	readIntentsList: InsightoaiResponseSchema,
	createPrompt: InsightoaiResponseSchema,
	getPromptById: InsightoaiResponseSchema,
	deletePromptById: InsightoaiResponseSchema,

	createProvider: InsightoaiResponseSchema,
	getProviderById: InsightoaiResponseSchema,
	deleteProviderById: InsightoaiResponseSchema,
	getSpeechtotextList: InsightoaiResponseSchema,
	retrieveListOfUserCustomVoice: InsightoaiResponseSchema,

	getContactById: InsightoaiResponseSchema,
	getListOfContacts: InsightoaiResponseSchema,
	upsertContactByEmailOrPhoneNumber: InsightoaiResponseSchema,
	deleteContactsInBulk: InsightoaiResponseSchema,
	createContactCustomField: InsightoaiResponseSchema,
	readContactCustomFieldList: InsightoaiResponseSchema,
	readCampaignContactList: InsightoaiResponseSchema,
	sendMessagesToContacts: InsightoaiResponseSchema,
	readContactSyncLogList: InsightoaiResponseSchema,

	createForm: InsightoaiResponseSchema,
	getCapturedFormByFormId: InsightoaiResponseSchema,
	deleteFormById: InsightoaiResponseSchema,
	deleteBulkFormsByIds: InsightoaiResponseSchema,

	createToolfunction: InsightoaiResponseSchema,
	updateToolfunctionById: InsightoaiResponseSchema,
	deleteToolfunctionById: InsightoaiResponseSchema,
	readToolToolfunctionList: InsightoaiResponseSchema,
	updateToolById: InsightoaiResponseSchema,
	deleteToolById: InsightoaiResponseSchema,
	readToolFunctionInvokeLogList: InsightoaiResponseSchema,
	retrieveLinkedToolAndUser: InsightoaiResponseSchema,
	updateLinkToolUser: InsightoaiResponseSchema,

	createWidget: InsightoaiResponseSchema,
	getWidgetById: InsightoaiResponseSchema,
	deleteWidgetById: InsightoaiResponseSchema,
	getListOfWidgetsLinkedToAssistantId: InsightoaiResponseSchema,
	listChannels: InsightoaiResponseSchema,
	getListOfConversations: InsightoaiResponseSchema,

	getDatasourceById: InsightoaiResponseSchema,
	getListOfDatasources: InsightoaiResponseSchema,
	getListOfDataSourcesLinkedToAssistantId: InsightoaiResponseSchema,
	deleteLinkedAssistantDatasource: InsightoaiResponseSchema,
	createTag: InsightoaiResponseSchema,
	readTagList: InsightoaiResponseSchema,
	deleteTagById: InsightoaiResponseSchema,
	deleteLinkTagEntityById: InsightoaiResponseSchema,

	createWebhook: InsightoaiResponseSchema,
	updateWebhookById: InsightoaiResponseSchema,
	deleteWebhookById: InsightoaiResponseSchema,
	retrieveWebhookLog: InsightoaiResponseSchema,
	readTwilioAuthList: InsightoaiResponseSchema,
	updateTwilioAuthById: InsightoaiResponseSchema,
	deleteTwilioAuthById: InsightoaiResponseSchema,
	updateUserwhatsappById: InsightoaiResponseSchema,
	deleteUserwhatsappById: InsightoaiResponseSchema,

	createAgency: InsightoaiResponseSchema,
	getAgencyBrandingById: InsightoaiResponseSchema,
	getAgencyBillingPlan: InsightoaiResponseSchema,
	getPricingForUser: InsightoaiResponseSchema,
	getAgentList: InsightoaiResponseSchema,
	updateUserProfile: InsightoaiResponseSchema,
	retrieveUserMonthlyUsagesAggregation: InsightoaiResponseSchema,
} as const satisfies { [K in keyof InsightoaiEndpointInputs]: z.ZodTypeAny };
