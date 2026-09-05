import { z } from 'zod';

// Agenty response payloads vary across 79 endpoints; per-route schemas are not yet mapped from API docs.
const AgentyResponseSchema = z.unknown();
// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.
const AgentyOptionalBodySchema = z.unknown().optional();
// Optional query filters vary by endpoint; values are heterogeneous JSON filter objects.
const AgentyQueryParamsSchema = z.record(z.string(), z.unknown()).optional();
// Row/item arrays contain heterogeneous objects per Agenty list and batch APIs.
const AgentyBatchItemsSchema = z.array(z.unknown());
const AgentyBatchItemsOptionalSchema = z.array(z.unknown()).optional();
// Config/scheduler/script objects are loosely typed in Agenty API docs.
const AgentyLooseRecordSchema = z.record(z.string(), z.unknown());
const AgentyLooseRecordOptionalSchema = z
	.record(z.string(), z.unknown())
	.optional();
// Live API: key_id/job_id/project_id are numbers; list_id is numeric in OpenAPI
const AgentyKeyIdSchema = z.number().int();
const AgentyJobIdSchema = z.number().int();
const AgentyProjectIdSchema = z.number().int();
const AgentyUserIdSchema = z.number().int();
const AgentyListIdSchema = z.union([z.string(), z.number()]);

// addListRows
const AddListRowsInputSchema = z.object({
	rows: AgentyBatchItemsSchema,
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AddListRowsInput = z.infer<typeof AddListRowsInputSchema>;
const AddListRowsResponseSchema = AgentyResponseSchema;
export type AddListRowsResponse = z.infer<typeof AddListRowsResponseSchema>;

// agentsControllerCreateAgent
const AgentsControllerCreateAgentInputSchema = z.object({
	icon: z.string().optional(),
	name: z.string(),
	tags: AgentyBatchItemsOptionalSchema,
	type: z.string().optional(),
	start: z.boolean().optional(),
	config: AgentyLooseRecordSchema,
	scripts: AgentyLooseRecordOptionalSchema,
	user_id: z.number().int().optional(),
	version: z.number().int().optional(),
	agent_id: z.string().optional(),
	is_public: z.boolean().optional(),
	scheduler: AgentyLooseRecordOptionalSchema,
	account_id: z.number().int().optional(),
	created_at: z.string().optional(),
	is_managed: z.boolean().optional(),
	project_id: z.number().int().optional(),
	updated_at: z.string().optional(),
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AgentsControllerCreateAgentInput = z.infer<
	typeof AgentsControllerCreateAgentInputSchema
>;
const AgentsControllerCreateAgentResponseSchema = AgentyResponseSchema;
export type AgentsControllerCreateAgentResponse = z.infer<
	typeof AgentsControllerCreateAgentResponseSchema
>;

// agentsControllerGetTemplates
const AgentsControllerGetTemplatesInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AgentsControllerGetTemplatesInput = z.infer<
	typeof AgentsControllerGetTemplatesInputSchema
>;
const AgentsControllerGetTemplatesResponseSchema = AgentyResponseSchema;
export type AgentsControllerGetTemplatesResponse = z.infer<
	typeof AgentsControllerGetTemplatesResponseSchema
>;

// agentsDeleteById
const AgentsDeleteByIdInputSchema = z.object({
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AgentsDeleteByIdInput = z.infer<typeof AgentsDeleteByIdInputSchema>;
const AgentsDeleteByIdResponseSchema = AgentyResponseSchema;
export type AgentsDeleteByIdResponse = z.infer<
	typeof AgentsDeleteByIdResponseSchema
>;

// agentsGetAll
const AgentsGetAllInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AgentsGetAllInput = z.infer<typeof AgentsGetAllInputSchema>;
const AgentsGetAllResponseSchema = AgentyResponseSchema;
export type AgentsGetAllResponse = z.infer<typeof AgentsGetAllResponseSchema>;

// agentsGetById
const AgentsGetByIdInputSchema = z.object({
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AgentsGetByIdInput = z.infer<typeof AgentsGetByIdInputSchema>;
const AgentsGetByIdResponseSchema = AgentyResponseSchema;
export type AgentsGetByIdResponse = z.infer<typeof AgentsGetByIdResponseSchema>;

// agentsUpdateById
const AgentsUpdateByIdInputSchema = z.object({
	icon: z.string().optional(),
	name: z.string(),
	tags: AgentyBatchItemsOptionalSchema,
	type: z.string().optional(),
	config: AgentyLooseRecordSchema,
	scripts: AgentyLooseRecordOptionalSchema,
	user_id: z.number().int().optional(),
	version: z.number().int().optional(),
	agent_id: z.string(),
	is_public: z.boolean().optional(),
	scheduler: AgentyLooseRecordOptionalSchema,
	account_id: z.number().int().optional(),
	created_at: z.string().optional(),
	is_managed: z.boolean().optional(),
	project_id: z.number().int().optional(),
	updated_at: z.string().optional(),
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AgentsUpdateByIdInput = z.infer<typeof AgentsUpdateByIdInputSchema>;
const AgentsUpdateByIdResponseSchema = AgentyResponseSchema;
export type AgentsUpdateByIdResponse = z.infer<
	typeof AgentsUpdateByIdResponseSchema
>;

// apiKeysControllerCreateApiKeys
const ApiKeysControllerCreateApiKeysInputSchema = z.object({
	name: z.string(),
	role: z.string().optional(),
	is_enabled: z.boolean().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysControllerCreateApiKeysInput = z.infer<
	typeof ApiKeysControllerCreateApiKeysInputSchema
>;
const ApiKeysControllerCreateApiKeysResponseSchema = AgentyResponseSchema;
export type ApiKeysControllerCreateApiKeysResponse = z.infer<
	typeof ApiKeysControllerCreateApiKeysResponseSchema
>;

// apiKeysDeleteById
const ApiKeysDeleteByIdInputSchema = z.object({
	key_id: AgentyKeyIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysDeleteByIdInput = z.infer<
	typeof ApiKeysDeleteByIdInputSchema
>;
const ApiKeysDeleteByIdResponseSchema = AgentyResponseSchema;
export type ApiKeysDeleteByIdResponse = z.infer<
	typeof ApiKeysDeleteByIdResponseSchema
>;

// apiKeysDownload
const ApiKeysDownloadInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysDownloadInput = z.infer<typeof ApiKeysDownloadInputSchema>;
const ApiKeysDownloadResponseSchema = AgentyResponseSchema;
export type ApiKeysDownloadResponse = z.infer<
	typeof ApiKeysDownloadResponseSchema
>;

// apiKeysGetAll
const ApiKeysGetAllInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysGetAllInput = z.infer<typeof ApiKeysGetAllInputSchema>;
const ApiKeysGetAllResponseSchema = AgentyResponseSchema;
export type ApiKeysGetAllResponse = z.infer<typeof ApiKeysGetAllResponseSchema>;

// apiKeysGetById
const ApiKeysGetByIdInputSchema = z.object({
	key_id: AgentyKeyIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysGetByIdInput = z.infer<typeof ApiKeysGetByIdInputSchema>;
const ApiKeysGetByIdResponseSchema = AgentyResponseSchema;
export type ApiKeysGetByIdResponse = z.infer<
	typeof ApiKeysGetByIdResponseSchema
>;

// apiKeysResetById
const ApiKeysResetByIdInputSchema = z.object({
	key_id: AgentyKeyIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysResetByIdInput = z.infer<typeof ApiKeysResetByIdInputSchema>;
const ApiKeysResetByIdResponseSchema = AgentyResponseSchema;
export type ApiKeysResetByIdResponse = z.infer<
	typeof ApiKeysResetByIdResponseSchema
>;

// apiKeysUpdateById
const ApiKeysUpdateByIdInputSchema = z.object({
	name: z.string(),
	role: z.string().optional(),
	key_id: AgentyKeyIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ApiKeysUpdateByIdInput = z.infer<
	typeof ApiKeysUpdateByIdInputSchema
>;
const ApiKeysUpdateByIdResponseSchema = AgentyResponseSchema;
export type ApiKeysUpdateByIdResponse = z.infer<
	typeof ApiKeysUpdateByIdResponseSchema
>;

// captureScreenshot
const CaptureScreenshotInputSchema = z.object({
	url: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CaptureScreenshotInput = z.infer<
	typeof CaptureScreenshotInputSchema
>;
const CaptureScreenshotResponseSchema = AgentyResponseSchema;
export type CaptureScreenshotResponse = z.infer<
	typeof CaptureScreenshotResponseSchema
>;

// captureScreenshotWithOptions
const CaptureScreenshotWithOptionsInputSchema = z.object({
	url: z.string(),
	html: z.string().optional(),
	options: AgentyLooseRecordOptionalSchema,
	blockAds: z.boolean().optional(),
	viewport: AgentyLooseRecordOptionalSchema,
	anonymous: AgentyLooseRecordOptionalSchema,
	userAgent: z.string().optional(),
	manipulate: AgentyLooseRecordOptionalSchema,
	gotoOptions: AgentyLooseRecordOptionalSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CaptureScreenshotWithOptionsInput = z.infer<
	typeof CaptureScreenshotWithOptionsInputSchema
>;
const CaptureScreenshotWithOptionsResponseSchema = AgentyResponseSchema;
export type CaptureScreenshotWithOptionsResponse = z.infer<
	typeof CaptureScreenshotWithOptionsResponseSchema
>;

// changeApiKeyStatusById
const ChangeApiKeyStatusByIdInputSchema = z.object({
	key_id: AgentyKeyIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ChangeApiKeyStatusByIdInput = z.infer<
	typeof ChangeApiKeyStatusByIdInputSchema
>;
const ChangeApiKeyStatusByIdResponseSchema = AgentyResponseSchema;
export type ChangeApiKeyStatusByIdResponse = z.infer<
	typeof ChangeApiKeyStatusByIdResponseSchema
>;

// connectionsGetAll
const ConnectionsGetAllInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ConnectionsGetAllInput = z.infer<
	typeof ConnectionsGetAllInputSchema
>;
const ConnectionsGetAllResponseSchema = AgentyResponseSchema;
export type ConnectionsGetAllResponse = z.infer<
	typeof ConnectionsGetAllResponseSchema
>;

// convertUrlToPdf
const ConvertUrlToPdfInputSchema = z.object({
	url: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ConvertUrlToPdfInput = z.infer<typeof ConvertUrlToPdfInputSchema>;
const ConvertUrlToPdfResponseSchema = AgentyResponseSchema;
export type ConvertUrlToPdfResponse = z.infer<
	typeof ConvertUrlToPdfResponseSchema
>;

// convertUrlToPdfWithOptions
const ConvertUrlToPdfWithOptionsInputSchema = z.object({
	url: z.string().optional(),
	html: z.string().optional(),
	rotate: z.number().int().optional(),
	options: AgentyLooseRecordOptionalSchema,
	anonymous: AgentyLooseRecordOptionalSchema,
	block_ads: z.boolean().optional(),
	user_agent: z.string().optional(),
	goto_options: AgentyLooseRecordOptionalSchema,
	emulate_media: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ConvertUrlToPdfWithOptionsInput = z.infer<
	typeof ConvertUrlToPdfWithOptionsInputSchema
>;
const ConvertUrlToPdfWithOptionsResponseSchema = AgentyResponseSchema;
export type ConvertUrlToPdfWithOptionsResponse = z.infer<
	typeof ConvertUrlToPdfWithOptionsResponseSchema
>;

// copyAgent
const CopyAgentInputSchema = z.object({
	name: z.string(),
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CopyAgentInput = z.infer<typeof CopyAgentInputSchema>;
const CopyAgentResponseSchema = AgentyResponseSchema;
export type CopyAgentResponse = z.infer<typeof CopyAgentResponseSchema>;

// createWorkflow
const CreateWorkflowInputSchema = z.object({
	name: z.string(),
	agents: AgentyLooseRecordSchema,
	actions: AgentyBatchItemsSchema,
	trigger: AgentyLooseRecordSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateWorkflowInput = z.infer<typeof CreateWorkflowInputSchema>;
const CreateWorkflowResponseSchema = AgentyResponseSchema;
export type CreateWorkflowResponse = z.infer<
	typeof CreateWorkflowResponseSchema
>;

// dashboardGetReportsUsage
const DashboardGetReportsUsageInputSchema = z.object({
	end: z.string().optional(),
	start: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DashboardGetReportsUsageInput = z.infer<
	typeof DashboardGetReportsUsageInputSchema
>;
const DashboardGetReportsUsageResponseSchema = AgentyResponseSchema;
export type DashboardGetReportsUsageResponse = z.infer<
	typeof DashboardGetReportsUsageResponseSchema
>;

// deleteListRow
const DeleteListRowInputSchema = z.object({
	id: z.string(),
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteListRowInput = z.infer<typeof DeleteListRowInputSchema>;
const DeleteListRowResponseSchema = AgentyResponseSchema;
export type DeleteListRowResponse = z.infer<typeof DeleteListRowResponseSchema>;

// deleteListRows
const DeleteListRowsInputSchema = z.object({
	id: AgentyBatchItemsSchema,
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteListRowsInput = z.infer<typeof DeleteListRowsInputSchema>;
const DeleteListRowsResponseSchema = AgentyResponseSchema;
export type DeleteListRowsResponse = z.infer<
	typeof DeleteListRowsResponseSchema
>;

// deleteProject
const DeleteProjectInputSchema = z.object({
	project_id: AgentyProjectIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;
const DeleteProjectResponseSchema = AgentyResponseSchema;
export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;

// deleteSchedule
const DeleteScheduleInputSchema = z.object({
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteScheduleInput = z.infer<typeof DeleteScheduleInputSchema>;
const DeleteScheduleResponseSchema = AgentyResponseSchema;
export type DeleteScheduleResponse = z.infer<
	typeof DeleteScheduleResponseSchema
>;

// deleteWorkflow
const DeleteWorkflowInputSchema = z.object({
	workflow_id: z.string(),
	id: z.union([z.string(), z.number()]).optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteWorkflowInput = z.infer<typeof DeleteWorkflowInputSchema>;
const DeleteWorkflowResponseSchema = AgentyResponseSchema;
export type DeleteWorkflowResponse = z.infer<
	typeof DeleteWorkflowResponseSchema
>;

// downloadAgentResult
const DownloadAgentResultInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	format: z.string().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	agent_id: z.string(),
	collection: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DownloadAgentResultInput = z.infer<
	typeof DownloadAgentResultInputSchema
>;
const DownloadAgentResultResponseSchema = AgentyResponseSchema;
export type DownloadAgentResultResponse = z.infer<
	typeof DownloadAgentResultResponseSchema
>;

// downloadListRows
const DownloadListRowsInputSchema = z.object({
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DownloadListRowsInput = z.infer<typeof DownloadListRowsInputSchema>;
const DownloadListRowsResponseSchema = AgentyResponseSchema;
export type DownloadListRowsResponse = z.infer<
	typeof DownloadListRowsResponseSchema
>;

// downloadUsers
const DownloadUsersInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DownloadUsersInput = z.infer<typeof DownloadUsersInputSchema>;
const DownloadUsersResponseSchema = AgentyResponseSchema;
export type DownloadUsersResponse = z.infer<typeof DownloadUsersResponseSchema>;

// downloadWorkflows
const DownloadWorkflowsInputSchema = z.object({
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DownloadWorkflowsInput = z.infer<
	typeof DownloadWorkflowsInputSchema
>;
const DownloadWorkflowsResponseSchema = AgentyResponseSchema;
export type DownloadWorkflowsResponse = z.infer<
	typeof DownloadWorkflowsResponseSchema
>;

// extractBrowserStructuredData
const ExtractBrowserStructuredDataInputSchema = z.object({
	url: z.string(),
	gotoOptions: AgentyLooseRecordOptionalSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ExtractBrowserStructuredDataInput = z.infer<
	typeof ExtractBrowserStructuredDataInputSchema
>;
const ExtractBrowserStructuredDataResponseSchema = AgentyResponseSchema;
export type ExtractBrowserStructuredDataResponse = z.infer<
	typeof ExtractBrowserStructuredDataResponseSchema
>;

// extractStructuredData
const ExtractStructuredDataInputSchema = z.object({
	url: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ExtractStructuredDataInput = z.infer<
	typeof ExtractStructuredDataInputSchema
>;
const ExtractStructuredDataResponseSchema = AgentyResponseSchema;
export type ExtractStructuredDataResponse = z.infer<
	typeof ExtractStructuredDataResponseSchema
>;

// getAgentResult
const GetAgentResultInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	agent_id: z.string(),
	collection: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAgentResultInput = z.infer<typeof GetAgentResultInputSchema>;
const GetAgentResultResponseSchema = AgentyResponseSchema;
export type GetAgentResultResponse = z.infer<
	typeof GetAgentResultResponseSchema
>;

// getAllTeamMembers
const GetAllTeamMembersInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllTeamMembersInput = z.infer<
	typeof GetAllTeamMembersInputSchema
>;
const GetAllTeamMembersResponseSchema = AgentyResponseSchema;
export type GetAllTeamMembersResponse = z.infer<
	typeof GetAllTeamMembersResponseSchema
>;

// getBrowserRedirects
const GetBrowserRedirectsInputSchema = z.object({
	url: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetBrowserRedirectsInput = z.infer<
	typeof GetBrowserRedirectsInputSchema
>;
const GetBrowserRedirectsResponseSchema = AgentyResponseSchema;
export type GetBrowserRedirectsResponse = z.infer<
	typeof GetBrowserRedirectsResponseSchema
>;

// getJobResult
const GetJobResultInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	format: z.string().optional(),
	job_id: AgentyJobIdSchema,
	offset: z.number().int().optional(),
	search: z.string().optional(),
	collection: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetJobResultInput = z.infer<typeof GetJobResultInputSchema>;
const GetJobResultResponseSchema = AgentyResponseSchema;
export type GetJobResultResponse = z.infer<typeof GetJobResultResponseSchema>;

// getListById
const GetListByIdInputSchema = z.object({
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetListByIdInput = z.infer<typeof GetListByIdInputSchema>;
const GetListByIdResponseSchema = AgentyResponseSchema;
export type GetListByIdResponse = z.infer<typeof GetListByIdResponseSchema>;

// getListRowById
const GetListRowByIdInputSchema = z.object({
	id: z.string(),
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetListRowByIdInput = z.infer<typeof GetListRowByIdInputSchema>;
const GetListRowByIdResponseSchema = AgentyResponseSchema;
export type GetListRowByIdResponse = z.infer<
	typeof GetListRowByIdResponseSchema
>;

// getPageContent
const GetPageContentInputSchema = z.object({
	url: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetPageContentInput = z.infer<typeof GetPageContentInputSchema>;
const GetPageContentResponseSchema = AgentyResponseSchema;
export type GetPageContentResponse = z.infer<
	typeof GetPageContentResponseSchema
>;

// getPageContentWithOptions
const GetPageContentWithOptionsInputSchema = z.object({
	url: z.string(),
	block_ads: z.boolean().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetPageContentWithOptionsInput = z.infer<
	typeof GetPageContentWithOptionsInputSchema
>;
const GetPageContentWithOptionsResponseSchema = AgentyResponseSchema;
export type GetPageContentWithOptionsResponse = z.infer<
	typeof GetPageContentWithOptionsResponseSchema
>;

// getProjectById
const GetProjectByIdInputSchema = z.object({
	id: AgentyProjectIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetProjectByIdInput = z.infer<typeof GetProjectByIdInputSchema>;
const GetProjectByIdResponseSchema = AgentyResponseSchema;
export type GetProjectByIdResponse = z.infer<
	typeof GetProjectByIdResponseSchema
>;

// getRedirectsWithOptions
const GetRedirectsWithOptionsInputSchema = z.object({
	url: z.string(),
	gotoOptions: AgentyLooseRecordOptionalSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetRedirectsWithOptionsInput = z.infer<
	typeof GetRedirectsWithOptionsInputSchema
>;
const GetRedirectsWithOptionsResponseSchema = AgentyResponseSchema;
export type GetRedirectsWithOptionsResponse = z.infer<
	typeof GetRedirectsWithOptionsResponseSchema
>;

// getSchedule
const GetScheduleInputSchema = z.object({
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetScheduleInput = z.infer<typeof GetScheduleInputSchema>;
const GetScheduleResponseSchema = AgentyResponseSchema;
export type GetScheduleResponse = z.infer<typeof GetScheduleResponseSchema>;

// getUserById
const GetUserByIdInputSchema = z.object({
	user_id: AgentyUserIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetUserByIdInput = z.infer<typeof GetUserByIdInputSchema>;
const GetUserByIdResponseSchema = AgentyResponseSchema;
export type GetUserByIdResponse = z.infer<typeof GetUserByIdResponseSchema>;

// getWorkflowById
const GetWorkflowByIdInputSchema = z.object({
	workflow_id: z.string(),
	id: z.union([z.string(), z.number()]).optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetWorkflowByIdInput = z.infer<typeof GetWorkflowByIdInputSchema>;
const GetWorkflowByIdResponseSchema = AgentyResponseSchema;
export type GetWorkflowByIdResponse = z.infer<
	typeof GetWorkflowByIdResponseSchema
>;

// inputsGetByAgentId
const InputsGetByAgentIdInputSchema = z.object({
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type InputsGetByAgentIdInput = z.infer<
	typeof InputsGetByAgentIdInputSchema
>;
const InputsGetByAgentIdResponseSchema = AgentyResponseSchema;
export type InputsGetByAgentIdResponse = z.infer<
	typeof InputsGetByAgentIdResponseSchema
>;

// inputsUpdateByAgentId
const InputsUpdateByAgentIdInputSchema = z.object({
	id: z.string().optional(),
	data: AgentyBatchItemsOptionalSchema,
	type: z.string().optional(),
	field: z.string().optional(),
	agent_id: z.string(),
	collection: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type InputsUpdateByAgentIdInput = z.infer<
	typeof InputsUpdateByAgentIdInputSchema
>;
const InputsUpdateByAgentIdResponseSchema = AgentyResponseSchema;
export type InputsUpdateByAgentIdResponse = z.infer<
	typeof InputsUpdateByAgentIdResponseSchema
>;

// jobsDownload
const JobsDownloadInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	agent_id: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsDownloadInput = z.infer<typeof JobsDownloadInputSchema>;
const JobsDownloadResponseSchema = AgentyResponseSchema;
export type JobsDownloadResponse = z.infer<typeof JobsDownloadResponseSchema>;

// jobsDownloadFilesById
const JobsDownloadFilesByIdInputSchema = z.object({
	name: z.string(),
	job_id: AgentyJobIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsDownloadFilesByIdInput = z.infer<
	typeof JobsDownloadFilesByIdInputSchema
>;
const JobsDownloadFilesByIdResponseSchema = AgentyResponseSchema;
export type JobsDownloadFilesByIdResponse = z.infer<
	typeof JobsDownloadFilesByIdResponseSchema
>;

// jobsDownloadResultById
const JobsDownloadResultByIdInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	format: z.string().optional(),
	job_id: AgentyJobIdSchema,
	offset: z.number().int().optional(),
	collection: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsDownloadResultByIdInput = z.infer<
	typeof JobsDownloadResultByIdInputSchema
>;
const JobsDownloadResultByIdResponseSchema = AgentyResponseSchema;
export type JobsDownloadResultByIdResponse = z.infer<
	typeof JobsDownloadResultByIdResponseSchema
>;

// jobsGetAll
const JobsGetAllInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	agent_id: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsGetAllInput = z.infer<typeof JobsGetAllInputSchema>;
const JobsGetAllResponseSchema = AgentyResponseSchema;
export type JobsGetAllResponse = z.infer<typeof JobsGetAllResponseSchema>;

// jobsGetById
const JobsGetByIdInputSchema = z.object({
	job_id: AgentyJobIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsGetByIdInput = z.infer<typeof JobsGetByIdInputSchema>;
const JobsGetByIdResponseSchema = AgentyResponseSchema;
export type JobsGetByIdResponse = z.infer<typeof JobsGetByIdResponseSchema>;

// jobsGetLogsById
const JobsGetLogsByIdInputSchema = z.object({
	limit: z.number().int().optional(),
	job_id: AgentyJobIdSchema,
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsGetLogsByIdInput = z.infer<typeof JobsGetLogsByIdInputSchema>;
const JobsGetLogsByIdResponseSchema = AgentyResponseSchema;
export type JobsGetLogsByIdResponse = z.infer<
	typeof JobsGetLogsByIdResponseSchema
>;

// jobsListFilesById
const JobsListFilesByIdInputSchema = z.object({
	job_id: AgentyJobIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsListFilesByIdInput = z.infer<
	typeof JobsListFilesByIdInputSchema
>;
const JobsListFilesByIdResponseSchema = AgentyResponseSchema;
export type JobsListFilesByIdResponse = z.infer<
	typeof JobsListFilesByIdResponseSchema
>;

// jobsStart
const JobsStartInputSchema = z.object({
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsStartInput = z.infer<typeof JobsStartInputSchema>;
const JobsStartResponseSchema = AgentyResponseSchema;
export type JobsStartResponse = z.infer<typeof JobsStartResponseSchema>;

// jobsStopById
const JobsStopByIdInputSchema = z.object({
	job_id: AgentyJobIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type JobsStopByIdInput = z.infer<typeof JobsStopByIdInputSchema>;
const JobsStopByIdResponseSchema = AgentyResponseSchema;
export type JobsStopByIdResponse = z.infer<typeof JobsStopByIdResponseSchema>;

// listsClearRows
const ListsClearRowsInputSchema = z.object({
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsClearRowsInput = z.infer<typeof ListsClearRowsInputSchema>;
const ListsClearRowsResponseSchema = AgentyResponseSchema;
export type ListsClearRowsResponse = z.infer<
	typeof ListsClearRowsResponseSchema
>;

// listsControllerCreateList
const ListsControllerCreateListInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsControllerCreateListInput = z.infer<
	typeof ListsControllerCreateListInputSchema
>;
const ListsControllerCreateListResponseSchema = AgentyResponseSchema;
export type ListsControllerCreateListResponse = z.infer<
	typeof ListsControllerCreateListResponseSchema
>;

// listsDeleteById
const ListsDeleteByIdInputSchema = z.object({
	list_id: AgentyListIdSchema,
	id: z.union([z.string(), z.number()]).optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsDeleteByIdInput = z.infer<typeof ListsDeleteByIdInputSchema>;
const ListsDeleteByIdResponseSchema = AgentyResponseSchema;
export type ListsDeleteByIdResponse = z.infer<
	typeof ListsDeleteByIdResponseSchema
>;

// listsDownload
const ListsDownloadInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsDownloadInput = z.infer<typeof ListsDownloadInputSchema>;
const ListsDownloadResponseSchema = AgentyResponseSchema;
export type ListsDownloadResponse = z.infer<typeof ListsDownloadResponseSchema>;

// listsGetAll
const ListsGetAllInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsGetAllInput = z.infer<typeof ListsGetAllInputSchema>;
const ListsGetAllResponseSchema = AgentyResponseSchema;
export type ListsGetAllResponse = z.infer<typeof ListsGetAllResponseSchema>;

// listsGetRowsById
const ListsGetRowsByIdInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsGetRowsByIdInput = z.infer<typeof ListsGetRowsByIdInputSchema>;
const ListsGetRowsByIdResponseSchema = AgentyResponseSchema;
export type ListsGetRowsByIdResponse = z.infer<
	typeof ListsGetRowsByIdResponseSchema
>;

// listsUpdateById
const ListsUpdateByIdInputSchema = z.object({
	name: z.string(),
	list_id: AgentyListIdSchema,
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsUpdateByIdInput = z.infer<typeof ListsUpdateByIdInputSchema>;
const ListsUpdateByIdResponseSchema = AgentyResponseSchema;
export type ListsUpdateByIdResponse = z.infer<
	typeof ListsUpdateByIdResponseSchema
>;

// listsUploadCsv
const ListsUploadCsvInputSchema = z.object({
	file: AgentyLooseRecordSchema,
	list_id: AgentyListIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListsUploadCsvInput = z.infer<typeof ListsUploadCsvInputSchema>;
const ListsUploadCsvResponseSchema = AgentyResponseSchema;
export type ListsUploadCsvResponse = z.infer<
	typeof ListsUploadCsvResponseSchema
>;

// patchWorkflow
const PatchWorkflowInputSchema = z.object({
	workflow_id: z.string(),
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PatchWorkflowInput = z.infer<typeof PatchWorkflowInputSchema>;
const PatchWorkflowResponseSchema = AgentyResponseSchema;
export type PatchWorkflowResponse = z.infer<typeof PatchWorkflowResponseSchema>;

// projectsAddAgents
const ProjectsAddAgentsInputSchema = z.object({
	agent_ids: z.array(z.string()),
	project_id: AgentyProjectIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ProjectsAddAgentsInput = z.infer<
	typeof ProjectsAddAgentsInputSchema
>;
const ProjectsAddAgentsResponseSchema = AgentyResponseSchema;
export type ProjectsAddAgentsResponse = z.infer<
	typeof ProjectsAddAgentsResponseSchema
>;

// projectsControllerCreateProject
const ProjectsControllerCreateProjectInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ProjectsControllerCreateProjectInput = z.infer<
	typeof ProjectsControllerCreateProjectInputSchema
>;
const ProjectsControllerCreateProjectResponseSchema = AgentyResponseSchema;
export type ProjectsControllerCreateProjectResponse = z.infer<
	typeof ProjectsControllerCreateProjectResponseSchema
>;

// projectsGetAll
const ProjectsGetAllInputSchema = z.object({
	sort: z.string().optional(),
	limit: z.number().int().optional(),
	order: z.string().optional(),
	offset: z.number().int().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ProjectsGetAllInput = z.infer<typeof ProjectsGetAllInputSchema>;
const ProjectsGetAllResponseSchema = AgentyResponseSchema;
export type ProjectsGetAllResponse = z.infer<
	typeof ProjectsGetAllResponseSchema
>;

// removeAgentFromProject
const RemoveAgentFromProjectInputSchema = z.object({
	agent_id: z.string(),
	project_id: AgentyProjectIdSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type RemoveAgentFromProjectInput = z.infer<
	typeof RemoveAgentFromProjectInputSchema
>;
const RemoveAgentFromProjectResponseSchema = AgentyResponseSchema;
export type RemoveAgentFromProjectResponse = z.infer<
	typeof RemoveAgentFromProjectResponseSchema
>;

// scrapeWebpageData
const ScrapeWebpageDataInputSchema = z.object({
	url: z.string(),
	debug: AgentyLooseRecordOptionalSchema,
	query: AgentyLooseRecordSchema,
	blockAds: z.boolean().optional(),
	userAgent: z.string().optional(),
	gotoOptions: AgentyLooseRecordOptionalSchema,
	body: AgentyOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ScrapeWebpageDataInput = z.infer<
	typeof ScrapeWebpageDataInputSchema
>;
const ScrapeWebpageDataResponseSchema = AgentyResponseSchema;
export type ScrapeWebpageDataResponse = z.infer<
	typeof ScrapeWebpageDataResponseSchema
>;

// toggleSchedule
const ToggleScheduleInputSchema = z.object({
	enabled: z.boolean(),
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ToggleScheduleInput = z.infer<typeof ToggleScheduleInputSchema>;
const ToggleScheduleResponseSchema = AgentyResponseSchema;
export type ToggleScheduleResponse = z.infer<
	typeof ToggleScheduleResponseSchema
>;

// transferAgentOwnership
const TransferAgentOwnershipInputSchema = z.object({
	email: z.string(),
	agent_id: z.string(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type TransferAgentOwnershipInput = z.infer<
	typeof TransferAgentOwnershipInputSchema
>;
const TransferAgentOwnershipResponseSchema = AgentyResponseSchema;
export type TransferAgentOwnershipResponse = z.infer<
	typeof TransferAgentOwnershipResponseSchema
>;

// updateListRow
const UpdateListRowInputSchema = z.object({
	id: z.string(),
	list_id: AgentyListIdSchema,
	row_data: AgentyLooseRecordSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateListRowInput = z.infer<typeof UpdateListRowInputSchema>;
const UpdateListRowResponseSchema = AgentyResponseSchema;
export type UpdateListRowResponse = z.infer<typeof UpdateListRowResponseSchema>;

// updateProject
const UpdateProjectInputSchema = z.object({
	id: AgentyProjectIdSchema,
	name: z.string(),
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
const UpdateProjectResponseSchema = AgentyResponseSchema;
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

// updateSchedule
const UpdateScheduleInputSchema = z.object({
	type: z.string().optional(),
	agent_id: z.string(),
	frequency: z.number().int().optional(),
	expression: z.string().optional(),
	is_enabled: z.boolean().optional(),
	description: z.string().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateScheduleInput = z.infer<typeof UpdateScheduleInputSchema>;
const UpdateScheduleResponseSchema = AgentyResponseSchema;
export type UpdateScheduleResponse = z.infer<
	typeof UpdateScheduleResponseSchema
>;

// updateUserById — OpenAPI: user_id number; email/role/status required.
const UpdateUserByIdInputSchema = z.object({
	name: z.string().optional(),
	role: z.string(),
	email: z.string(),
	avatar: z.string().optional(),
	status: z.string(),
	user_id: AgentyUserIdSchema,
	is_email_verified: z.boolean().optional(),
	is_email_subscribed: z.boolean().optional(),
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateUserByIdInput = z.infer<typeof UpdateUserByIdInputSchema>;
const UpdateUserByIdResponseSchema = AgentyResponseSchema;
export type UpdateUserByIdResponse = z.infer<
	typeof UpdateUserByIdResponseSchema
>;

// updateWorkflow
const UpdateWorkflowInputSchema = z.object({
	workflow_id: z.string(),
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string(),
	agents: AgentyLooseRecordSchema,
	actions: AgentyBatchItemsSchema,
	trigger: AgentyLooseRecordSchema,
	body: AgentyOptionalBodySchema,
	query: AgentyQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateWorkflowInput = z.infer<typeof UpdateWorkflowInputSchema>;
const UpdateWorkflowResponseSchema = AgentyResponseSchema;
export type UpdateWorkflowResponse = z.infer<
	typeof UpdateWorkflowResponseSchema
>;

export const AgentyEndpointInputSchemas = {
	addListRows: AddListRowsInputSchema,
	agentsControllerCreateAgent: AgentsControllerCreateAgentInputSchema,
	agentsControllerGetTemplates: AgentsControllerGetTemplatesInputSchema,
	agentsDeleteById: AgentsDeleteByIdInputSchema,
	agentsGetAll: AgentsGetAllInputSchema,
	agentsGetById: AgentsGetByIdInputSchema,
	agentsUpdateById: AgentsUpdateByIdInputSchema,
	apiKeysControllerCreateApiKeys: ApiKeysControllerCreateApiKeysInputSchema,
	apiKeysDeleteById: ApiKeysDeleteByIdInputSchema,
	apiKeysDownload: ApiKeysDownloadInputSchema,
	apiKeysGetAll: ApiKeysGetAllInputSchema,
	apiKeysGetById: ApiKeysGetByIdInputSchema,
	apiKeysResetById: ApiKeysResetByIdInputSchema,
	apiKeysUpdateById: ApiKeysUpdateByIdInputSchema,
	captureScreenshot: CaptureScreenshotInputSchema,
	captureScreenshotWithOptions: CaptureScreenshotWithOptionsInputSchema,
	changeApiKeyStatusById: ChangeApiKeyStatusByIdInputSchema,
	connectionsGetAll: ConnectionsGetAllInputSchema,
	convertUrlToPdf: ConvertUrlToPdfInputSchema,
	convertUrlToPdfWithOptions: ConvertUrlToPdfWithOptionsInputSchema,
	copyAgent: CopyAgentInputSchema,
	createWorkflow: CreateWorkflowInputSchema,
	dashboardGetReportsUsage: DashboardGetReportsUsageInputSchema,
	deleteListRow: DeleteListRowInputSchema,
	deleteListRows: DeleteListRowsInputSchema,
	deleteProject: DeleteProjectInputSchema,
	deleteSchedule: DeleteScheduleInputSchema,
	deleteWorkflow: DeleteWorkflowInputSchema,
	downloadAgentResult: DownloadAgentResultInputSchema,
	downloadListRows: DownloadListRowsInputSchema,
	downloadUsers: DownloadUsersInputSchema,
	downloadWorkflows: DownloadWorkflowsInputSchema,
	extractBrowserStructuredData: ExtractBrowserStructuredDataInputSchema,
	extractStructuredData: ExtractStructuredDataInputSchema,
	getAgentResult: GetAgentResultInputSchema,
	getAllTeamMembers: GetAllTeamMembersInputSchema,
	getBrowserRedirects: GetBrowserRedirectsInputSchema,
	getJobResult: GetJobResultInputSchema,
	getListById: GetListByIdInputSchema,
	getListRowById: GetListRowByIdInputSchema,
	getPageContent: GetPageContentInputSchema,
	getPageContentWithOptions: GetPageContentWithOptionsInputSchema,
	getProjectById: GetProjectByIdInputSchema,
	getRedirectsWithOptions: GetRedirectsWithOptionsInputSchema,
	getSchedule: GetScheduleInputSchema,
	getUserById: GetUserByIdInputSchema,
	getWorkflowById: GetWorkflowByIdInputSchema,
	inputsGetByAgentId: InputsGetByAgentIdInputSchema,
	inputsUpdateByAgentId: InputsUpdateByAgentIdInputSchema,
	jobsDownload: JobsDownloadInputSchema,
	jobsDownloadFilesById: JobsDownloadFilesByIdInputSchema,
	jobsDownloadResultById: JobsDownloadResultByIdInputSchema,
	jobsGetAll: JobsGetAllInputSchema,
	jobsGetById: JobsGetByIdInputSchema,
	jobsGetLogsById: JobsGetLogsByIdInputSchema,
	jobsListFilesById: JobsListFilesByIdInputSchema,
	jobsStart: JobsStartInputSchema,
	jobsStopById: JobsStopByIdInputSchema,
	listsClearRows: ListsClearRowsInputSchema,
	listsControllerCreateList: ListsControllerCreateListInputSchema,
	listsDeleteById: ListsDeleteByIdInputSchema,
	listsDownload: ListsDownloadInputSchema,
	listsGetAll: ListsGetAllInputSchema,
	listsGetRowsById: ListsGetRowsByIdInputSchema,
	listsUpdateById: ListsUpdateByIdInputSchema,
	listsUploadCsv: ListsUploadCsvInputSchema,
	patchWorkflow: PatchWorkflowInputSchema,
	projectsAddAgents: ProjectsAddAgentsInputSchema,
	projectsControllerCreateProject: ProjectsControllerCreateProjectInputSchema,
	projectsGetAll: ProjectsGetAllInputSchema,
	removeAgentFromProject: RemoveAgentFromProjectInputSchema,
	scrapeWebpageData: ScrapeWebpageDataInputSchema,
	toggleSchedule: ToggleScheduleInputSchema,
	transferAgentOwnership: TransferAgentOwnershipInputSchema,
	updateListRow: UpdateListRowInputSchema,
	updateProject: UpdateProjectInputSchema,
	updateSchedule: UpdateScheduleInputSchema,
	updateUserById: UpdateUserByIdInputSchema,
	updateWorkflow: UpdateWorkflowInputSchema,
} as const;

export type AgentyEndpointInputs = {
	[K in keyof typeof AgentyEndpointInputSchemas]: z.infer<
		(typeof AgentyEndpointInputSchemas)[K]
	>;
};

export const AgentyEndpointOutputSchemas = {
	addListRows: AddListRowsResponseSchema,
	agentsControllerCreateAgent: AgentsControllerCreateAgentResponseSchema,
	agentsControllerGetTemplates: AgentsControllerGetTemplatesResponseSchema,
	agentsDeleteById: AgentsDeleteByIdResponseSchema,
	agentsGetAll: AgentsGetAllResponseSchema,
	agentsGetById: AgentsGetByIdResponseSchema,
	agentsUpdateById: AgentsUpdateByIdResponseSchema,
	apiKeysControllerCreateApiKeys: ApiKeysControllerCreateApiKeysResponseSchema,
	apiKeysDeleteById: ApiKeysDeleteByIdResponseSchema,
	apiKeysDownload: ApiKeysDownloadResponseSchema,
	apiKeysGetAll: ApiKeysGetAllResponseSchema,
	apiKeysGetById: ApiKeysGetByIdResponseSchema,
	apiKeysResetById: ApiKeysResetByIdResponseSchema,
	apiKeysUpdateById: ApiKeysUpdateByIdResponseSchema,
	captureScreenshot: CaptureScreenshotResponseSchema,
	captureScreenshotWithOptions: CaptureScreenshotWithOptionsResponseSchema,
	changeApiKeyStatusById: ChangeApiKeyStatusByIdResponseSchema,
	connectionsGetAll: ConnectionsGetAllResponseSchema,
	convertUrlToPdf: ConvertUrlToPdfResponseSchema,
	convertUrlToPdfWithOptions: ConvertUrlToPdfWithOptionsResponseSchema,
	copyAgent: CopyAgentResponseSchema,
	createWorkflow: CreateWorkflowResponseSchema,
	dashboardGetReportsUsage: DashboardGetReportsUsageResponseSchema,
	deleteListRow: DeleteListRowResponseSchema,
	deleteListRows: DeleteListRowsResponseSchema,
	deleteProject: DeleteProjectResponseSchema,
	deleteSchedule: DeleteScheduleResponseSchema,
	deleteWorkflow: DeleteWorkflowResponseSchema,
	downloadAgentResult: DownloadAgentResultResponseSchema,
	downloadListRows: DownloadListRowsResponseSchema,
	downloadUsers: DownloadUsersResponseSchema,
	downloadWorkflows: DownloadWorkflowsResponseSchema,
	extractBrowserStructuredData: ExtractBrowserStructuredDataResponseSchema,
	extractStructuredData: ExtractStructuredDataResponseSchema,
	getAgentResult: GetAgentResultResponseSchema,
	getAllTeamMembers: GetAllTeamMembersResponseSchema,
	getBrowserRedirects: GetBrowserRedirectsResponseSchema,
	getJobResult: GetJobResultResponseSchema,
	getListById: GetListByIdResponseSchema,
	getListRowById: GetListRowByIdResponseSchema,
	getPageContent: GetPageContentResponseSchema,
	getPageContentWithOptions: GetPageContentWithOptionsResponseSchema,
	getProjectById: GetProjectByIdResponseSchema,
	getRedirectsWithOptions: GetRedirectsWithOptionsResponseSchema,
	getSchedule: GetScheduleResponseSchema,
	getUserById: GetUserByIdResponseSchema,
	getWorkflowById: GetWorkflowByIdResponseSchema,
	inputsGetByAgentId: InputsGetByAgentIdResponseSchema,
	inputsUpdateByAgentId: InputsUpdateByAgentIdResponseSchema,
	jobsDownload: JobsDownloadResponseSchema,
	jobsDownloadFilesById: JobsDownloadFilesByIdResponseSchema,
	jobsDownloadResultById: JobsDownloadResultByIdResponseSchema,
	jobsGetAll: JobsGetAllResponseSchema,
	jobsGetById: JobsGetByIdResponseSchema,
	jobsGetLogsById: JobsGetLogsByIdResponseSchema,
	jobsListFilesById: JobsListFilesByIdResponseSchema,
	jobsStart: JobsStartResponseSchema,
	jobsStopById: JobsStopByIdResponseSchema,
	listsClearRows: ListsClearRowsResponseSchema,
	listsControllerCreateList: ListsControllerCreateListResponseSchema,
	listsDeleteById: ListsDeleteByIdResponseSchema,
	listsDownload: ListsDownloadResponseSchema,
	listsGetAll: ListsGetAllResponseSchema,
	listsGetRowsById: ListsGetRowsByIdResponseSchema,
	listsUpdateById: ListsUpdateByIdResponseSchema,
	listsUploadCsv: ListsUploadCsvResponseSchema,
	patchWorkflow: PatchWorkflowResponseSchema,
	projectsAddAgents: ProjectsAddAgentsResponseSchema,
	projectsControllerCreateProject:
		ProjectsControllerCreateProjectResponseSchema,
	projectsGetAll: ProjectsGetAllResponseSchema,
	removeAgentFromProject: RemoveAgentFromProjectResponseSchema,
	scrapeWebpageData: ScrapeWebpageDataResponseSchema,
	toggleSchedule: ToggleScheduleResponseSchema,
	transferAgentOwnership: TransferAgentOwnershipResponseSchema,
	updateListRow: UpdateListRowResponseSchema,
	updateProject: UpdateProjectResponseSchema,
	updateSchedule: UpdateScheduleResponseSchema,
	updateUserById: UpdateUserByIdResponseSchema,
	updateWorkflow: UpdateWorkflowResponseSchema,
} as const;

export type AgentyEndpointOutputs = {
	[K in keyof typeof AgentyEndpointOutputSchemas]: z.infer<
		(typeof AgentyEndpointOutputSchemas)[K]
	>;
};

export type AgentyEndpointInput =
	AgentyEndpointInputs[keyof AgentyEndpointInputs] & {
		// Index signature required: factory helpers access fields by dynamic string keys across 79 ops.
		[key: string]: unknown;
	};
