import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared shapes for the Brightcall (Convolo.ai) External API surface.
//
// Method/path/query bindings below are taken from the vendor's published
// OpenAPI spec (https://app.brightcall.ai/brightcall-external-api/, v1.0).
// Response models are Cloud-managed and evolve, so outputs validate as loose
// objects; inputs pin the documented query/path/body contracts.
// ---------------------------------------------------------------------------

const ConvoloAiObjectSchema = z.looseObject({});

const DeleteResultSchema = z.unknown();

const MutationBodySchema = z.record(z.string(), z.unknown());

const NonEmptyId = z.string().min(1);

const CallStatusSchema = z.enum([
	'CallStatusType.OPERATOR_ANSWERED',
	'CallStatusType.CLIENT_ANSWERED',
	'CallStatusType.NO_ANSWER',
	'CallStatusType.FAILED',
	'CallStatusType.PENDING',
	'CallStatusType.INITIATED',
	'CallStatusType.ON_DEMAND',
	'CallStatusType.FUTURE',
	'CallStatusType.DONE',
	'CallStatusType.PROCESSED',
]);

const DisconnectedBySchema = z.enum(['lead', 'agent', 'none']);

const CallsListQuerySchema = z.object({
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	widget_ids: z.array(z.string()).optional(),
	max_calls: z.number().int().positive().optional(),
	page: z.number().int().nonnegative().optional(),
	search_string: z.string().optional(),
	status: CallStatusSchema.optional(),
	filter_url: z.string().optional(),
	filter_referer: z.string().optional(),
	filter_lead_number: z.string().optional(),
	filter_agent: z.string().optional(),
	filter_answer_time_from: z.number().int().optional(),
	filter_answer_time_to: z.number().int().optional(),
	filter_talk_time_from: z.number().int().optional(),
	filter_talk_time_to: z.number().int().optional(),
	filter_wait_time_from: z.number().int().optional(),
	filter_wait_time_to: z.number().int().optional(),
	filter_disconnected_by: DisconnectedBySchema.optional(),
	timezone: z.string().optional(),
});

const CallsListWithTagsQuerySchema = CallsListQuerySchema.extend({
	filter_s2l_ai_action_set_ids: z.array(z.string()).optional(),
	filter_s2l_tag_names: z.array(z.string()).optional(),
	filter_s2l_tag_categories: z.array(z.string()).optional(),
	filter_s2l_has_tag: z.boolean().optional(),
});

const AgentsListQuerySchema = z.object({
	searchString: z.string().optional(),
	page: z.number().int().nonnegative().optional(),
	itemsPerPage: z.number().int().positive().optional(),
	sortBy: z.enum(['name']).optional(),
	sortDirection: z.enum(['ASC', 'DESC']).optional(),
	status: z.boolean().optional(),
	withStats: z.boolean().optional(),
	withActiveWidgetsData: z.boolean().optional(),
	withDeletedWidgetsData: z.boolean().optional(),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	isDeleted: z.boolean().optional(),
	isDelegate: z.boolean().optional(),
	teamMemberOnly: z.boolean().optional(),
	fullAccountAccess: z.boolean().optional(),
	delegateAccessToDialerAgentId: z.number().int().optional(),
});

const WidgetsListQuerySchema = z.object({
	searchString: z.string().optional(),
	status: z.boolean().optional(),
	page: z.number().int().nonnegative().optional(),
	itemsPerPage: z.number().int().positive().optional(),
	sortBy: z.enum(['siteName', 'createDate']).optional(),
	sortDirection: z.enum(['ASC', 'DESC']).optional(),
	statsDateFrom: z.string().optional(),
	statsDateTo: z.string().optional(),
	needCallsAndVisitsStats: z.boolean().optional(),
	createdDateFrom: z.string().optional(),
	createdDateTo: z.string().optional(),
	isDelegate: z.boolean().optional(),
	isDeleted: z.boolean().optional(),
});

const LeadsListQuerySchema = z.object({
	search_string: z.string().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	websites: z.array(z.string()).optional(),
	widgets: z.array(z.string()).optional(),
	lc_params: z.array(z.string()).optional(),
	date_from: z.string().optional(),
	date_to: z.string().optional(),
	agent_answer_time_lte: z.number().int().optional(),
	agent_answer_time_gte: z.number().int().optional(),
	talk_time_lte: z.number().int().optional(),
	talk_time_gte: z.number().int().optional(),
	status: z.array(z.string()).optional(),
	agents: z.array(z.string()).optional(),
	lead_status: z.string().optional(),
	search_lead_data: z.string().optional(),
	rating: z.string().optional(),
	comment: z.string().optional(),
	visitor_source: z.string().optional(),
	page: z.number().int().nonnegative().optional(),
	items_per_page: z.number().int().positive().optional(),
});

// ---------------------------------------------------------------------------
// Per-operation input schemas (31 ops; op key -> spec operationId in comment)
// ---------------------------------------------------------------------------

const AgentListInputSchema = AgentsListQuerySchema;

const AgentListV2InputSchema = AgentsListQuerySchema;

const AgentIdInputSchema = z.object({
	id: NonEmptyId,
});

const AgentCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const AgentUpdateInputSchema = z.object({
	id: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const AgentUpdateScheduleInputSchema = z.object({
	id: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const CallListInputSchema = CallsListQuerySchema;

const CallListV5InputSchema = CallsListQuerySchema;

const CallListWithTagsInputSchema = CallsListWithTagsQuerySchema;

const CallIdInputSchema = z.object({
	callId: NonEmptyId,
});

const CallSetS2lTagInputSchema = z.object({
	callId: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const CallSetRatingInputSchema = z.object({
	callId: NonEmptyId,
	tag: z.string().optional(),
	type: z.enum(['positive', 'negative', 'neutral']).optional(),
});

const CallTriggerInputSchema = z.object({
	api_key: NonEmptyId,
	widget_key: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const LeadListInputSchema = LeadsListQuerySchema;

const LeadListByPostInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const LeadOutcomeTagsInputSchema = z.object({
	id: NonEmptyId,
});

const WidgetListInputSchema = WidgetsListQuerySchema;

const WidgetCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const WidgetIdInputSchema = z.object({
	id: NonEmptyId,
});

const WidgetUpdateInputSchema = z.object({
	id: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const WidgetUpdateV2InputSchema = z.object({
	widgetId: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const WidgetToggleInputSchema = z.object({
	id: z.number().int(),
	new_state: z.number().int(),
});

const WidgetHtmlSiteCodeInputSchema = z.object({
	id: NonEmptyId,
});

const WidgetUpdateSettingsInputSchema = z.object({
	widget_key: NonEmptyId,
	api_key: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const CustomWidgetParamsInputSchema = z.object({
	widget_key: NonEmptyId,
	api_key: NonEmptyId,
});

const OpenApiDocumentInputSchema = z.object({});

export type ConvoloAiEndpointInputs = {
	agentList: z.infer<typeof AgentListInputSchema>;
	agentListV2: z.infer<typeof AgentListV2InputSchema>;
	agentGet: z.infer<typeof AgentIdInputSchema>;
	agentCreate: z.infer<typeof AgentCreateInputSchema>;
	agentUpdate: z.infer<typeof AgentUpdateInputSchema>;
	agentDelete: z.infer<typeof AgentIdInputSchema>;
	agentUpdateSchedule: z.infer<typeof AgentUpdateScheduleInputSchema>;
	callList: z.infer<typeof CallListInputSchema>;
	callListV5: z.infer<typeof CallListV5InputSchema>;
	callListWithTags: z.infer<typeof CallListWithTagsInputSchema>;
	callGetDetails: z.infer<typeof CallIdInputSchema>;
	callGetLog: z.infer<typeof CallIdInputSchema>;
	callGetEndWebhookPayload: z.infer<typeof CallIdInputSchema>;
	callListPayloadData: z.infer<typeof CallsListQuerySchema>;
	callSetS2lTag: z.infer<typeof CallSetS2lTagInputSchema>;
	callSetRating: z.infer<typeof CallSetRatingInputSchema>;
	callTrigger: z.infer<typeof CallTriggerInputSchema>;
	leadList: z.infer<typeof LeadListInputSchema>;
	leadListByPost: z.infer<typeof LeadListByPostInputSchema>;
	leadGetOutcomeTags: z.infer<typeof LeadOutcomeTagsInputSchema>;
	widgetList: z.infer<typeof WidgetListInputSchema>;
	widgetCreate: z.infer<typeof WidgetCreateInputSchema>;
	widgetGet: z.infer<typeof WidgetIdInputSchema>;
	widgetUpdate: z.infer<typeof WidgetUpdateInputSchema>;
	widgetUpdateV2: z.infer<typeof WidgetUpdateV2InputSchema>;
	widgetDelete: z.infer<typeof WidgetIdInputSchema>;
	widgetToggle: z.infer<typeof WidgetToggleInputSchema>;
	widgetGetHtmlSiteCode: z.infer<typeof WidgetHtmlSiteCodeInputSchema>;
	widgetUpdateSettings: z.infer<typeof WidgetUpdateSettingsInputSchema>;
	getCustomWidgetParams: z.infer<typeof CustomWidgetParamsInputSchema>;
	getOpenApiDocument: z.infer<typeof OpenApiDocumentInputSchema>;
};

export type ConvoloAiEndpointOutputs = {
	agentList: z.infer<typeof ConvoloAiObjectSchema>;
	agentListV2: z.infer<typeof ConvoloAiObjectSchema>;
	agentGet: z.infer<typeof ConvoloAiObjectSchema>;
	agentCreate: z.infer<typeof ConvoloAiObjectSchema>;
	agentUpdate: z.infer<typeof ConvoloAiObjectSchema>;
	agentDelete: z.infer<typeof DeleteResultSchema>;
	agentUpdateSchedule: z.infer<typeof ConvoloAiObjectSchema>;
	callList: z.infer<typeof ConvoloAiObjectSchema>;
	callListV5: z.infer<typeof ConvoloAiObjectSchema>;
	callListWithTags: z.infer<typeof ConvoloAiObjectSchema>;
	callGetDetails: z.infer<typeof ConvoloAiObjectSchema>;
	callGetLog: z.infer<typeof ConvoloAiObjectSchema>;
	callGetEndWebhookPayload: z.infer<typeof ConvoloAiObjectSchema>;
	callListPayloadData: z.infer<typeof ConvoloAiObjectSchema>;
	callSetS2lTag: z.infer<typeof ConvoloAiObjectSchema>;
	callSetRating: z.infer<typeof ConvoloAiObjectSchema>;
	callTrigger: z.infer<typeof ConvoloAiObjectSchema>;
	leadList: z.infer<typeof ConvoloAiObjectSchema>;
	leadListByPost: z.infer<typeof ConvoloAiObjectSchema>;
	leadGetOutcomeTags: z.infer<typeof ConvoloAiObjectSchema>;
	widgetList: z.infer<typeof ConvoloAiObjectSchema>;
	widgetCreate: z.infer<typeof ConvoloAiObjectSchema>;
	widgetGet: z.infer<typeof ConvoloAiObjectSchema>;
	widgetUpdate: z.infer<typeof ConvoloAiObjectSchema>;
	widgetUpdateV2: z.infer<typeof ConvoloAiObjectSchema>;
	widgetDelete: z.infer<typeof DeleteResultSchema>;
	widgetToggle: z.infer<typeof ConvoloAiObjectSchema>;
	widgetGetHtmlSiteCode: z.infer<typeof ConvoloAiObjectSchema>;
	widgetUpdateSettings: z.infer<typeof ConvoloAiObjectSchema>;
	getCustomWidgetParams: z.infer<typeof ConvoloAiObjectSchema>;
	getOpenApiDocument: z.infer<typeof ConvoloAiObjectSchema>;
};

export const ConvoloAiEndpointInputSchemas = {
	agentList: AgentListInputSchema,
	agentListV2: AgentListV2InputSchema,
	agentGet: AgentIdInputSchema,
	agentCreate: AgentCreateInputSchema,
	agentUpdate: AgentUpdateInputSchema,
	agentDelete: AgentIdInputSchema,
	agentUpdateSchedule: AgentUpdateScheduleInputSchema,
	callList: CallListInputSchema,
	callListV5: CallListV5InputSchema,
	callListWithTags: CallListWithTagsInputSchema,
	callGetDetails: CallIdInputSchema,
	callGetLog: CallIdInputSchema,
	callGetEndWebhookPayload: CallIdInputSchema,
	callListPayloadData: CallsListQuerySchema,
	callSetS2lTag: CallSetS2lTagInputSchema,
	callSetRating: CallSetRatingInputSchema,
	callTrigger: CallTriggerInputSchema,
	leadList: LeadListInputSchema,
	leadListByPost: LeadListByPostInputSchema,
	leadGetOutcomeTags: LeadOutcomeTagsInputSchema,
	widgetList: WidgetListInputSchema,
	widgetCreate: WidgetCreateInputSchema,
	widgetGet: WidgetIdInputSchema,
	widgetUpdate: WidgetUpdateInputSchema,
	widgetUpdateV2: WidgetUpdateV2InputSchema,
	widgetDelete: WidgetIdInputSchema,
	widgetToggle: WidgetToggleInputSchema,
	widgetGetHtmlSiteCode: WidgetHtmlSiteCodeInputSchema,
	widgetUpdateSettings: WidgetUpdateSettingsInputSchema,
	getCustomWidgetParams: CustomWidgetParamsInputSchema,
	getOpenApiDocument: OpenApiDocumentInputSchema,
};

export const ConvoloAiEndpointOutputSchemas = {
	agentList: ConvoloAiObjectSchema,
	agentListV2: ConvoloAiObjectSchema,
	agentGet: ConvoloAiObjectSchema,
	agentCreate: ConvoloAiObjectSchema,
	agentUpdate: ConvoloAiObjectSchema,
	agentDelete: DeleteResultSchema,
	agentUpdateSchedule: ConvoloAiObjectSchema,
	callList: ConvoloAiObjectSchema,
	callListV5: ConvoloAiObjectSchema,
	callListWithTags: ConvoloAiObjectSchema,
	callGetDetails: ConvoloAiObjectSchema,
	callGetLog: ConvoloAiObjectSchema,
	callGetEndWebhookPayload: ConvoloAiObjectSchema,
	callListPayloadData: ConvoloAiObjectSchema,
	callSetS2lTag: ConvoloAiObjectSchema,
	callSetRating: ConvoloAiObjectSchema,
	callTrigger: ConvoloAiObjectSchema,
	leadList: ConvoloAiObjectSchema,
	leadListByPost: ConvoloAiObjectSchema,
	leadGetOutcomeTags: ConvoloAiObjectSchema,
	widgetList: ConvoloAiObjectSchema,
	widgetCreate: ConvoloAiObjectSchema,
	widgetGet: ConvoloAiObjectSchema,
	widgetUpdate: ConvoloAiObjectSchema,
	widgetUpdateV2: ConvoloAiObjectSchema,
	widgetDelete: DeleteResultSchema,
	widgetToggle: ConvoloAiObjectSchema,
	widgetGetHtmlSiteCode: ConvoloAiObjectSchema,
	widgetUpdateSettings: ConvoloAiObjectSchema,
	getCustomWidgetParams: ConvoloAiObjectSchema,
	getOpenApiDocument: ConvoloAiObjectSchema,
};

export const endpointInputSchemas = ConvoloAiEndpointInputSchemas;
export const endpointOutputSchemas = ConvoloAiEndpointOutputSchemas;
