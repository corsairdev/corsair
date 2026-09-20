import { z } from 'zod';

// Anchor Browser response payloads vary across 64 endpoints; per-route schemas are not yet mapped from API docs.
const AnchorBrowserResponseSchema = z.unknown();
// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.
const AnchorBrowserOptionalBodySchema = z.unknown().optional();
// Optional query filters vary by endpoint; values are heterogeneous JSON filter objects.
const AnchorBrowserQueryParamsSchema = z
	.record(z.string(), z.unknown())
	.optional();
// Row/item arrays contain heterogeneous objects per Anchor Browser list and batch APIs.
const AnchorBrowserBatchItemsSchema = z.array(z.unknown());
const AnchorBrowserBatchItemsOptionalSchema = z.array(z.unknown()).optional();
// Config/metadata objects are loosely typed in Anchor Browser API docs.
const AnchorBrowserLooseRecordSchema = z.record(z.string(), z.unknown());
const AnchorBrowserLooseRecordOptionalSchema = z
	.record(z.string(), z.unknown())
	.optional();

// clickMouse
const ClickMouseInputSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	button: z.string().optional(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ClickMouseInput = z.infer<typeof ClickMouseInputSchema>;
const ClickMouseResponseSchema = AnchorBrowserResponseSchema;
export type ClickMouseResponse = z.infer<typeof ClickMouseResponseSchema>;

// copySelectedText
const CopySelectedTextInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CopySelectedTextInput = z.infer<typeof CopySelectedTextInputSchema>;
const CopySelectedTextResponseSchema = AnchorBrowserResponseSchema;
export type CopySelectedTextResponse = z.infer<
	typeof CopySelectedTextResponseSchema
>;

// createIntegration
const CreateIntegrationInputSchema = z.object({
	name: z.string(),
	type: z.string(),
	credentials: AnchorBrowserLooseRecordSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateIntegrationInput = z.infer<
	typeof CreateIntegrationInputSchema
>;
const CreateIntegrationResponseSchema = AnchorBrowserResponseSchema;
export type CreateIntegrationResponse = z.infer<
	typeof CreateIntegrationResponseSchema
>;

// createOrUpdateTaskDraft
const CreateOrUpdateTaskDraftInputSchema = z.object({
	code: z.string(),
	taskId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateOrUpdateTaskDraftInput = z.infer<
	typeof CreateOrUpdateTaskDraftInputSchema
>;
const CreateOrUpdateTaskDraftResponseSchema = AnchorBrowserResponseSchema;
export type CreateOrUpdateTaskDraftResponse = z.infer<
	typeof CreateOrUpdateTaskDraftResponseSchema
>;

// createProfile
const CreateProfileInputSchema = z.object({
	name: z.string(),
	source: z.string().optional(),
	session_id: z.string(),
	description: z.string().optional(),
	dedicated_sticky_ip: z.boolean().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateProfileInput = z.infer<typeof CreateProfileInputSchema>;
const CreateProfileResponseSchema = AnchorBrowserResponseSchema;
export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>;

// createTask
const CreateTaskInputSchema = z.object({
	code: z.string().optional(),
	name: z.string(),
	language: z.string(),
	description: z.string().optional(),
	browserConfiguration: AnchorBrowserLooseRecordOptionalSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
const CreateTaskResponseSchema = AnchorBrowserResponseSchema;
export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

// deleteExtension
const DeleteExtensionInputSchema = z.object({
	id: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteExtensionInput = z.infer<typeof DeleteExtensionInputSchema>;
const DeleteExtensionResponseSchema = AnchorBrowserResponseSchema;
export type DeleteExtensionResponse = z.infer<
	typeof DeleteExtensionResponseSchema
>;

// deleteIntegration
const DeleteIntegrationInputSchema = z.object({
	integrationId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteIntegrationInput = z.infer<
	typeof DeleteIntegrationInputSchema
>;
const DeleteIntegrationResponseSchema = AnchorBrowserResponseSchema;
export type DeleteIntegrationResponse = z.infer<
	typeof DeleteIntegrationResponseSchema
>;

// deleteProfile
const DeleteProfileInputSchema = z.object({
	name: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteProfileInput = z.infer<typeof DeleteProfileInputSchema>;
const DeleteProfileResponseSchema = AnchorBrowserResponseSchema;
export type DeleteProfileResponse = z.infer<typeof DeleteProfileResponseSchema>;

// deleteTask
const DeleteTaskInputSchema = z.object({
	taskId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteTaskInput = z.infer<typeof DeleteTaskInputSchema>;
const DeleteTaskResponseSchema = AnchorBrowserResponseSchema;
export type DeleteTaskResponse = z.infer<typeof DeleteTaskResponseSchema>;

// deleteTaskVersion
const DeleteTaskVersionInputSchema = z.object({
	taskId: z.string(),
	taskVersion: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteTaskVersionInput = z.infer<
	typeof DeleteTaskVersionInputSchema
>;
const DeleteTaskVersionResponseSchema = AnchorBrowserResponseSchema;
export type DeleteTaskVersionResponse = z.infer<
	typeof DeleteTaskVersionResponseSchema
>;

// deployTask
const DeployTaskInputSchema = z.object({
	code: z.string(),
	taskId: z.string(),
	language: z.string().optional(),
	description: z.string().optional(),
	browserConfiguration: AnchorBrowserLooseRecordOptionalSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeployTaskInput = z.infer<typeof DeployTaskInputSchema>;
const DeployTaskResponseSchema = AnchorBrowserResponseSchema;
export type DeployTaskResponse = z.infer<typeof DeployTaskResponseSchema>;

// doubleClickMouse
const DoubleClickMouseInputSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DoubleClickMouseInput = z.infer<typeof DoubleClickMouseInputSchema>;
const DoubleClickMouseResponseSchema = AnchorBrowserResponseSchema;
export type DoubleClickMouseResponse = z.infer<
	typeof DoubleClickMouseResponseSchema
>;

// dragAndDrop
const DragAndDropInputSchema = z.object({
	endX: z.number(),
	endY: z.number(),
	startX: z.number(),
	startY: z.number(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DragAndDropInput = z.infer<typeof DragAndDropInputSchema>;
const DragAndDropResponseSchema = AnchorBrowserResponseSchema;
export type DragAndDropResponse = z.infer<typeof DragAndDropResponseSchema>;

// endAllSessions
const EndAllSessionsInputSchema = z.object({
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type EndAllSessionsInput = z.infer<typeof EndAllSessionsInputSchema>;
const EndAllSessionsResponseSchema = AnchorBrowserResponseSchema;
export type EndAllSessionsResponse = z.infer<
	typeof EndAllSessionsResponseSchema
>;

// endBrowserSession
const EndBrowserSessionInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type EndBrowserSessionInput = z.infer<
	typeof EndBrowserSessionInputSchema
>;
const EndBrowserSessionResponseSchema = AnchorBrowserResponseSchema;
export type EndBrowserSessionResponse = z.infer<
	typeof EndBrowserSessionResponseSchema
>;

// getBatchSessionStatus
const GetBatchSessionStatusInputSchema = z.object({
	batchId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetBatchSessionStatusInput = z.infer<
	typeof GetBatchSessionStatusInputSchema
>;
const GetBatchSessionStatusResponseSchema = AnchorBrowserResponseSchema;
export type GetBatchSessionStatusResponse = z.infer<
	typeof GetBatchSessionStatusResponseSchema
>;

// getBrowserSession
const GetBrowserSessionInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetBrowserSessionInput = z.infer<
	typeof GetBrowserSessionInputSchema
>;
const GetBrowserSessionResponseSchema = AnchorBrowserResponseSchema;
export type GetBrowserSessionResponse = z.infer<
	typeof GetBrowserSessionResponseSchema
>;

// getClipboardContent
const GetClipboardContentInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetClipboardContentInput = z.infer<
	typeof GetClipboardContentInputSchema
>;
const GetClipboardContentResponseSchema = AnchorBrowserResponseSchema;
export type GetClipboardContentResponse = z.infer<
	typeof GetClipboardContentResponseSchema
>;

// getLatestTaskVersion
const GetLatestTaskVersionInputSchema = z.object({
	taskId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetLatestTaskVersionInput = z.infer<
	typeof GetLatestTaskVersionInputSchema
>;
const GetLatestTaskVersionResponseSchema = AnchorBrowserResponseSchema;
export type GetLatestTaskVersionResponse = z.infer<
	typeof GetLatestTaskVersionResponseSchema
>;

// getProfile
const GetProfileInputSchema = z.object({
	name: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetProfileInput = z.infer<typeof GetProfileInputSchema>;
const GetProfileResponseSchema = AnchorBrowserResponseSchema;
export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;

// getSessionPages
const GetSessionPagesInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetSessionPagesInput = z.infer<typeof GetSessionPagesInputSchema>;
const GetSessionPagesResponseSchema = AnchorBrowserResponseSchema;
export type GetSessionPagesResponse = z.infer<
	typeof GetSessionPagesResponseSchema
>;

// getTaskDraft
const GetTaskDraftInputSchema = z.object({
	taskId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTaskDraftInput = z.infer<typeof GetTaskDraftInputSchema>;
const GetTaskDraftResponseSchema = AnchorBrowserResponseSchema;
export type GetTaskDraftResponse = z.infer<typeof GetTaskDraftResponseSchema>;

// getTaskExecutionResult
const GetTaskExecutionResultInputSchema = z.object({
	taskId: z.string(),
	executionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTaskExecutionResultInput = z.infer<
	typeof GetTaskExecutionResultInputSchema
>;
const GetTaskExecutionResultResponseSchema = AnchorBrowserResponseSchema;
export type GetTaskExecutionResultResponse = z.infer<
	typeof GetTaskExecutionResultResponseSchema
>;

// getTaskMetadata
const GetTaskMetadataInputSchema = z.object({
	taskId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTaskMetadataInput = z.infer<typeof GetTaskMetadataInputSchema>;
const GetTaskMetadataResponseSchema = AnchorBrowserResponseSchema;
export type GetTaskMetadataResponse = z.infer<
	typeof GetTaskMetadataResponseSchema
>;

// getTaskVersion
const GetTaskVersionInputSchema = z.object({
	taskId: z.string(),
	taskVersion: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTaskVersionInput = z.infer<typeof GetTaskVersionInputSchema>;
const GetTaskVersionResponseSchema = AnchorBrowserResponseSchema;
export type GetTaskVersionResponse = z.infer<
	typeof GetTaskVersionResponseSchema
>;

// getWebpageContent
const GetWebpageContentInputSchema = z.object({
	url: z.string().optional(),
	wait: z.number().int().optional(),
	format: z.string().optional(),
	new_page: z.boolean().optional(),
	sessionId: z.string().optional(),
	page_index: z.number().int().optional(),
	return_partial_on_timeout: z.boolean().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetWebpageContentInput = z.infer<
	typeof GetWebpageContentInputSchema
>;
const GetWebpageContentResponseSchema = AnchorBrowserResponseSchema;
export type GetWebpageContentResponse = z.infer<
	typeof GetWebpageContentResponseSchema
>;

// listAgentResources
const ListAgentResourcesInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListAgentResourcesInput = z.infer<
	typeof ListAgentResourcesInputSchema
>;
const ListAgentResourcesResponseSchema = AnchorBrowserResponseSchema;
export type ListAgentResourcesResponse = z.infer<
	typeof ListAgentResourcesResponseSchema
>;

// listExtensions
const ListExtensionsInputSchema = z.object({
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListExtensionsInput = z.infer<typeof ListExtensionsInputSchema>;
const ListExtensionsResponseSchema = AnchorBrowserResponseSchema;
export type ListExtensionsResponse = z.infer<
	typeof ListExtensionsResponseSchema
>;

// listIntegrations
const ListIntegrationsInputSchema = z.object({
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListIntegrationsInput = z.infer<typeof ListIntegrationsInputSchema>;
const ListIntegrationsResponseSchema = AnchorBrowserResponseSchema;
export type ListIntegrationsResponse = z.infer<
	typeof ListIntegrationsResponseSchema
>;

// listProfiles
const ListProfilesInputSchema = z.object({
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListProfilesInput = z.infer<typeof ListProfilesInputSchema>;
const ListProfilesResponseSchema = AnchorBrowserResponseSchema;
export type ListProfilesResponse = z.infer<typeof ListProfilesResponseSchema>;

// listSessionDownloads
const ListSessionDownloadsInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListSessionDownloadsInput = z.infer<
	typeof ListSessionDownloadsInputSchema
>;
const ListSessionDownloadsResponseSchema = AnchorBrowserResponseSchema;
export type ListSessionDownloadsResponse = z.infer<
	typeof ListSessionDownloadsResponseSchema
>;

// listSessionRecordings
const ListSessionRecordingsInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListSessionRecordingsInput = z.infer<
	typeof ListSessionRecordingsInputSchema
>;
const ListSessionRecordingsResponseSchema = AnchorBrowserResponseSchema;
export type ListSessionRecordingsResponse = z.infer<
	typeof ListSessionRecordingsResponseSchema
>;

// listSessions
const ListSessionsInputSchema = z.object({
	// Documented query parameters for GET /v1/sessions (pagination + filters).
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	sort_by: z.string().optional(),
	sort_order: z.string().optional(),
	search: z.string().optional(),
	status: z.string().optional(),
	tags: z.string().optional(),
	domains: z.string().optional(),
	created_from: z.string().optional(),
	created_to: z.string().optional(),
	batch_id: z.string().optional(),
	task_initiated: z.boolean().optional(),
	playground: z.boolean().optional(),
	proxy: z.boolean().optional(),
	extra_stealth: z.boolean().optional(),
	profile_name: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListSessionsInput = z.infer<typeof ListSessionsInputSchema>;
const ListSessionsResponseSchema = AnchorBrowserResponseSchema;
export type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;

// listTaskExecutions
const ListTaskExecutionsInputSchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
	status: z.string().optional(),
	taskId: z.string(),
	version: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListTaskExecutionsInput = z.infer<
	typeof ListTaskExecutionsInputSchema
>;
const ListTaskExecutionsResponseSchema = AnchorBrowserResponseSchema;
export type ListTaskExecutionsResponse = z.infer<
	typeof ListTaskExecutionsResponseSchema
>;

// listTasks
const ListTasksInputSchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListTasksInput = z.infer<typeof ListTasksInputSchema>;
const ListTasksResponseSchema = AnchorBrowserResponseSchema;
export type ListTasksResponse = z.infer<typeof ListTasksResponseSchema>;

// listTaskVersions
const ListTaskVersionsInputSchema = z.object({
	taskId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListTaskVersionsInput = z.infer<typeof ListTaskVersionsInputSchema>;
const ListTaskVersionsResponseSchema = AnchorBrowserResponseSchema;
export type ListTaskVersionsResponse = z.infer<
	typeof ListTaskVersionsResponseSchema
>;

// moveMouse
const MoveMouseInputSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type MoveMouseInput = z.infer<typeof MoveMouseInputSchema>;
const MoveMouseResponseSchema = AnchorBrowserResponseSchema;
export type MoveMouseResponse = z.infer<typeof MoveMouseResponseSchema>;

// navigateToUrl
const NavigateToUrlInputSchema = z.object({
	url: z.string(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type NavigateToUrlInput = z.infer<typeof NavigateToUrlInputSchema>;
const NavigateToUrlResponseSchema = AnchorBrowserResponseSchema;
export type NavigateToUrlResponse = z.infer<typeof NavigateToUrlResponseSchema>;

// pasteText
const PasteTextInputSchema = z.object({
	text: z.string(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PasteTextInput = z.infer<typeof PasteTextInputSchema>;
const PasteTextResponseSchema = AnchorBrowserResponseSchema;
export type PasteTextResponse = z.infer<typeof PasteTextResponseSchema>;

// pauseAgent
const PauseAgentInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PauseAgentInput = z.infer<typeof PauseAgentInputSchema>;
const PauseAgentResponseSchema = AnchorBrowserResponseSchema;
export type PauseAgentResponse = z.infer<typeof PauseAgentResponseSchema>;

// pauseSessionRecording
const PauseSessionRecordingInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PauseSessionRecordingInput = z.infer<
	typeof PauseSessionRecordingInputSchema
>;
const PauseSessionRecordingResponseSchema = AnchorBrowserResponseSchema;
export type PauseSessionRecordingResponse = z.infer<
	typeof PauseSessionRecordingResponseSchema
>;

// performKeyboardShortcut
const PerformKeyboardShortcutInputSchema = z.object({
	keys: AnchorBrowserBatchItemsSchema,
	hold_time: z.number().int().optional(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PerformKeyboardShortcutInput = z.infer<
	typeof PerformKeyboardShortcutInputSchema
>;
const PerformKeyboardShortcutResponseSchema = AnchorBrowserResponseSchema;
export type PerformKeyboardShortcutResponse = z.infer<
	typeof PerformKeyboardShortcutResponseSchema
>;

// performWebTask
const PerformWebTaskInputSchema = z.object({
	url: z.string().optional(),
	agent: z.string().optional(),
	async: z.boolean().optional(),
	model: z.string().optional(),
	prompt: z.string(),
	provider: z.string().optional(),
	max_steps: z.number().int().optional(),
	sessionId: z.string().optional(),
	output_schema: AnchorBrowserLooseRecordOptionalSchema,
	secret_values: AnchorBrowserLooseRecordOptionalSchema,
	detect_elements: z.boolean().optional(),
	highlight_elements: z.boolean().optional(),
	human_intervention: z.boolean().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PerformWebTaskInput = z.infer<typeof PerformWebTaskInputSchema>;
const PerformWebTaskResponseSchema = AnchorBrowserResponseSchema;
export type PerformWebTaskResponse = z.infer<
	typeof PerformWebTaskResponseSchema
>;

// pressMouseButton
const PressMouseButtonInputSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	button: z.string().optional(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PressMouseButtonInput = z.infer<typeof PressMouseButtonInputSchema>;
const PressMouseButtonResponseSchema = AnchorBrowserResponseSchema;
export type PressMouseButtonResponse = z.infer<
	typeof PressMouseButtonResponseSchema
>;

// publishTaskVersion
const PublishTaskVersionInputSchema = z.object({
	code: z.string(),
	taskId: z.string(),
	language: z.string().optional(),
	description: z.string().optional(),
	taskVersion: z.string(),
	browserConfiguration: AnchorBrowserLooseRecordOptionalSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type PublishTaskVersionInput = z.infer<
	typeof PublishTaskVersionInputSchema
>;
const PublishTaskVersionResponseSchema = AnchorBrowserResponseSchema;
export type PublishTaskVersionResponse = z.infer<
	typeof PublishTaskVersionResponseSchema
>;

// releaseMouseButton
const ReleaseMouseButtonInputSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	button: z.string().optional(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ReleaseMouseButtonInput = z.infer<
	typeof ReleaseMouseButtonInputSchema
>;
const ReleaseMouseButtonResponseSchema = AnchorBrowserResponseSchema;
export type ReleaseMouseButtonResponse = z.infer<
	typeof ReleaseMouseButtonResponseSchema
>;

// resumeAgent
const ResumeAgentInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ResumeAgentInput = z.infer<typeof ResumeAgentInputSchema>;
const ResumeAgentResponseSchema = AnchorBrowserResponseSchema;
export type ResumeAgentResponse = z.infer<typeof ResumeAgentResponseSchema>;

// resumeSessionRecording
const ResumeSessionRecordingInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ResumeSessionRecordingInput = z.infer<
	typeof ResumeSessionRecordingInputSchema
>;
const ResumeSessionRecordingResponseSchema = AnchorBrowserResponseSchema;
export type ResumeSessionRecordingResponse = z.infer<
	typeof ResumeSessionRecordingResponseSchema
>;

// runTask
const RunTaskInputSchema = z.object({
	async: z.boolean().optional(),
	inputs: AnchorBrowserLooseRecordOptionalSchema,
	taskId: z.string(),
	version: z.string().optional(),
	sessionId: z.string().optional(),
	cleanupSessions: z.boolean().optional(),
	overrideBrowserConfiguration: AnchorBrowserLooseRecordOptionalSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type RunTaskInput = z.infer<typeof RunTaskInputSchema>;
const RunTaskResponseSchema = AnchorBrowserResponseSchema;
export type RunTaskResponse = z.infer<typeof RunTaskResponseSchema>;

// runTaskByName
const RunTaskByNameInputSchema = z.object({
	inputs: AnchorBrowserLooseRecordOptionalSchema,
	taskName: z.string(),
	sessionId: z.string().optional(),
	taskSessionId: z.string().optional(),
	overrideBrowserConfiguration: AnchorBrowserLooseRecordOptionalSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type RunTaskByNameInput = z.infer<typeof RunTaskByNameInputSchema>;
const RunTaskByNameResponseSchema = AnchorBrowserResponseSchema;
export type RunTaskByNameResponse = z.infer<typeof RunTaskByNameResponseSchema>;

// screenshotWebpage
const ScreenshotWebpageInputSchema = z.object({
	url: z.string(),
	wait: z.number().int().optional(),
	width: z.number().int().optional(),
	height: z.number().int().optional(),
	sessionId: z.string().optional(),
	image_quality: z.number().int().optional(),
	s3_target_address: z.string().optional(),
	scroll_all_content: z.boolean().optional(),
	capture_full_height: z.boolean().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ScreenshotWebpageInput = z.infer<
	typeof ScreenshotWebpageInputSchema
>;
const ScreenshotWebpageResponseSchema = AnchorBrowserResponseSchema;
export type ScreenshotWebpageResponse = z.infer<
	typeof ScreenshotWebpageResponseSchema
>;

// scrollSession
const ScrollSessionInputSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
	steps: z.number().int().optional(),
	useOs: z.boolean().optional(),
	deltaX: z.number().int().optional(),
	deltaY: z.number().int(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ScrollSessionInput = z.infer<typeof ScrollSessionInputSchema>;
const ScrollSessionResponseSchema = AnchorBrowserResponseSchema;
export type ScrollSessionResponse = z.infer<typeof ScrollSessionResponseSchema>;

// setClipboardContent
const SetClipboardContentInputSchema = z.object({
	text: z.string(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type SetClipboardContentInput = z.infer<
	typeof SetClipboardContentInputSchema
>;
const SetClipboardContentResponseSchema = AnchorBrowserResponseSchema;
export type SetClipboardContentResponse = z.infer<
	typeof SetClipboardContentResponseSchema
>;

// signalEvent
const SignalEventInputSchema = z.object({
	data: AnchorBrowserLooseRecordSchema,
	eventName: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type SignalEventInput = z.infer<typeof SignalEventInputSchema>;
const SignalEventResponseSchema = AnchorBrowserResponseSchema;
export type SignalEventResponse = z.infer<typeof SignalEventResponseSchema>;

// startBrowserSession
const StartBrowserSessionInputSchema = z.object({
	browser: AnchorBrowserLooseRecordOptionalSchema,
	session: AnchorBrowserLooseRecordOptionalSchema,
	identities: AnchorBrowserBatchItemsOptionalSchema,
	integrations: AnchorBrowserBatchItemsOptionalSchema,
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type StartBrowserSessionInput = z.infer<
	typeof StartBrowserSessionInputSchema
>;
const StartBrowserSessionResponseSchema = AnchorBrowserResponseSchema;
export type StartBrowserSessionResponse = z.infer<
	typeof StartBrowserSessionResponseSchema
>;

// takeScreenshot
const TakeScreenshotInputSchema = z.object({
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type TakeScreenshotInput = z.infer<typeof TakeScreenshotInputSchema>;
const TakeScreenshotResponseSchema = AnchorBrowserResponseSchema;
export type TakeScreenshotResponse = z.infer<
	typeof TakeScreenshotResponseSchema
>;

// typeText
const TypeTextInputSchema = z.object({
	text: z.string(),
	delay: z.number().int().optional(),
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type TypeTextInput = z.infer<typeof TypeTextInputSchema>;
const TypeTextResponseSchema = AnchorBrowserResponseSchema;
export type TypeTextResponse = z.infer<typeof TypeTextResponseSchema>;

// updateProfile
const UpdateProfileInputSchema = z.object({
	name: z.string(),
	source: z.string().optional(),
	session_id: z.string(),
	description: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
const UpdateProfileResponseSchema = AnchorBrowserResponseSchema;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

// updateTaskMetadata
const UpdateTaskMetadataInputSchema = z.object({
	name: z.string().optional(),
	taskId: z.string(),
	description: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateTaskMetadataInput = z.infer<
	typeof UpdateTaskMetadataInputSchema
>;
const UpdateTaskMetadataResponseSchema = AnchorBrowserResponseSchema;
export type UpdateTaskMetadataResponse = z.infer<
	typeof UpdateTaskMetadataResponseSchema
>;

// uploadExtension
const UploadExtensionInputSchema = z.object({
	file: AnchorBrowserLooseRecordOptionalSchema,
	name: z.string(),
	file_name: z.string().optional(),
	file_content_base64: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UploadExtensionInput = z.infer<typeof UploadExtensionInputSchema>;
const UploadExtensionResponseSchema = AnchorBrowserResponseSchema;
export type UploadExtensionResponse = z.infer<
	typeof UploadExtensionResponseSchema
>;

// uploadFile
const UploadFileInputSchema = z.object({
	file: AnchorBrowserLooseRecordSchema,
	sessionId: z.string(),
	file_content_base64: z.string().optional(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;
const UploadFileResponseSchema = AnchorBrowserResponseSchema;
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;

// uploadFilesToSession
const UploadFilesToSessionInputSchema = z.object({
	file: AnchorBrowserLooseRecordSchema,
	sessionId: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UploadFilesToSessionInput = z.infer<
	typeof UploadFilesToSessionInputSchema
>;
const UploadFilesToSessionResponseSchema = AnchorBrowserResponseSchema;
export type UploadFilesToSessionResponse = z.infer<
	typeof UploadFilesToSessionResponseSchema
>;

// waitForEvent
const WaitForEventInputSchema = z.object({
	timeoutMs: z.number().int().optional(),
	eventName: z.string(),
	body: AnchorBrowserOptionalBodySchema,
	query: AnchorBrowserQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type WaitForEventInput = z.infer<typeof WaitForEventInputSchema>;
const WaitForEventResponseSchema = AnchorBrowserResponseSchema;
export type WaitForEventResponse = z.infer<typeof WaitForEventResponseSchema>;

export const AnchorBrowserEndpointInputSchemas = {
	clickMouse: ClickMouseInputSchema,
	copySelectedText: CopySelectedTextInputSchema,
	createIntegration: CreateIntegrationInputSchema,
	createOrUpdateTaskDraft: CreateOrUpdateTaskDraftInputSchema,
	createProfile: CreateProfileInputSchema,
	createTask: CreateTaskInputSchema,
	deleteExtension: DeleteExtensionInputSchema,
	deleteIntegration: DeleteIntegrationInputSchema,
	deleteProfile: DeleteProfileInputSchema,
	deleteTask: DeleteTaskInputSchema,
	deleteTaskVersion: DeleteTaskVersionInputSchema,
	deployTask: DeployTaskInputSchema,
	doubleClickMouse: DoubleClickMouseInputSchema,
	dragAndDrop: DragAndDropInputSchema,
	endAllSessions: EndAllSessionsInputSchema,
	endBrowserSession: EndBrowserSessionInputSchema,
	getBatchSessionStatus: GetBatchSessionStatusInputSchema,
	getBrowserSession: GetBrowserSessionInputSchema,
	getClipboardContent: GetClipboardContentInputSchema,
	getLatestTaskVersion: GetLatestTaskVersionInputSchema,
	getProfile: GetProfileInputSchema,
	getSessionPages: GetSessionPagesInputSchema,
	getTaskDraft: GetTaskDraftInputSchema,
	getTaskExecutionResult: GetTaskExecutionResultInputSchema,
	getTaskMetadata: GetTaskMetadataInputSchema,
	getTaskVersion: GetTaskVersionInputSchema,
	getWebpageContent: GetWebpageContentInputSchema,
	listAgentResources: ListAgentResourcesInputSchema,
	listExtensions: ListExtensionsInputSchema,
	listIntegrations: ListIntegrationsInputSchema,
	listProfiles: ListProfilesInputSchema,
	listSessionDownloads: ListSessionDownloadsInputSchema,
	listSessionRecordings: ListSessionRecordingsInputSchema,
	listSessions: ListSessionsInputSchema,
	listTaskExecutions: ListTaskExecutionsInputSchema,
	listTasks: ListTasksInputSchema,
	listTaskVersions: ListTaskVersionsInputSchema,
	moveMouse: MoveMouseInputSchema,
	navigateToUrl: NavigateToUrlInputSchema,
	pasteText: PasteTextInputSchema,
	pauseAgent: PauseAgentInputSchema,
	pauseSessionRecording: PauseSessionRecordingInputSchema,
	performKeyboardShortcut: PerformKeyboardShortcutInputSchema,
	performWebTask: PerformWebTaskInputSchema,
	pressMouseButton: PressMouseButtonInputSchema,
	publishTaskVersion: PublishTaskVersionInputSchema,
	releaseMouseButton: ReleaseMouseButtonInputSchema,
	resumeAgent: ResumeAgentInputSchema,
	resumeSessionRecording: ResumeSessionRecordingInputSchema,
	runTask: RunTaskInputSchema,
	runTaskByName: RunTaskByNameInputSchema,
	screenshotWebpage: ScreenshotWebpageInputSchema,
	scrollSession: ScrollSessionInputSchema,
	setClipboardContent: SetClipboardContentInputSchema,
	signalEvent: SignalEventInputSchema,
	startBrowserSession: StartBrowserSessionInputSchema,
	takeScreenshot: TakeScreenshotInputSchema,
	typeText: TypeTextInputSchema,
	updateProfile: UpdateProfileInputSchema,
	updateTaskMetadata: UpdateTaskMetadataInputSchema,
	uploadExtension: UploadExtensionInputSchema,
	uploadFile: UploadFileInputSchema,
	uploadFilesToSession: UploadFilesToSessionInputSchema,
	waitForEvent: WaitForEventInputSchema,
} as const;

export type AnchorBrowserEndpointInputs = {
	[K in keyof typeof AnchorBrowserEndpointInputSchemas]: z.infer<
		(typeof AnchorBrowserEndpointInputSchemas)[K]
	>;
};

export const AnchorBrowserEndpointOutputSchemas = {
	clickMouse: ClickMouseResponseSchema,
	copySelectedText: CopySelectedTextResponseSchema,
	createIntegration: CreateIntegrationResponseSchema,
	createOrUpdateTaskDraft: CreateOrUpdateTaskDraftResponseSchema,
	createProfile: CreateProfileResponseSchema,
	createTask: CreateTaskResponseSchema,
	deleteExtension: DeleteExtensionResponseSchema,
	deleteIntegration: DeleteIntegrationResponseSchema,
	deleteProfile: DeleteProfileResponseSchema,
	deleteTask: DeleteTaskResponseSchema,
	deleteTaskVersion: DeleteTaskVersionResponseSchema,
	deployTask: DeployTaskResponseSchema,
	doubleClickMouse: DoubleClickMouseResponseSchema,
	dragAndDrop: DragAndDropResponseSchema,
	endAllSessions: EndAllSessionsResponseSchema,
	endBrowserSession: EndBrowserSessionResponseSchema,
	getBatchSessionStatus: GetBatchSessionStatusResponseSchema,
	getBrowserSession: GetBrowserSessionResponseSchema,
	getClipboardContent: GetClipboardContentResponseSchema,
	getLatestTaskVersion: GetLatestTaskVersionResponseSchema,
	getProfile: GetProfileResponseSchema,
	getSessionPages: GetSessionPagesResponseSchema,
	getTaskDraft: GetTaskDraftResponseSchema,
	getTaskExecutionResult: GetTaskExecutionResultResponseSchema,
	getTaskMetadata: GetTaskMetadataResponseSchema,
	getTaskVersion: GetTaskVersionResponseSchema,
	getWebpageContent: GetWebpageContentResponseSchema,
	listAgentResources: ListAgentResourcesResponseSchema,
	listExtensions: ListExtensionsResponseSchema,
	listIntegrations: ListIntegrationsResponseSchema,
	listProfiles: ListProfilesResponseSchema,
	listSessionDownloads: ListSessionDownloadsResponseSchema,
	listSessionRecordings: ListSessionRecordingsResponseSchema,
	listSessions: ListSessionsResponseSchema,
	listTaskExecutions: ListTaskExecutionsResponseSchema,
	listTasks: ListTasksResponseSchema,
	listTaskVersions: ListTaskVersionsResponseSchema,
	moveMouse: MoveMouseResponseSchema,
	navigateToUrl: NavigateToUrlResponseSchema,
	pasteText: PasteTextResponseSchema,
	pauseAgent: PauseAgentResponseSchema,
	pauseSessionRecording: PauseSessionRecordingResponseSchema,
	performKeyboardShortcut: PerformKeyboardShortcutResponseSchema,
	performWebTask: PerformWebTaskResponseSchema,
	pressMouseButton: PressMouseButtonResponseSchema,
	publishTaskVersion: PublishTaskVersionResponseSchema,
	releaseMouseButton: ReleaseMouseButtonResponseSchema,
	resumeAgent: ResumeAgentResponseSchema,
	resumeSessionRecording: ResumeSessionRecordingResponseSchema,
	runTask: RunTaskResponseSchema,
	runTaskByName: RunTaskByNameResponseSchema,
	screenshotWebpage: ScreenshotWebpageResponseSchema,
	scrollSession: ScrollSessionResponseSchema,
	setClipboardContent: SetClipboardContentResponseSchema,
	signalEvent: SignalEventResponseSchema,
	startBrowserSession: StartBrowserSessionResponseSchema,
	takeScreenshot: TakeScreenshotResponseSchema,
	typeText: TypeTextResponseSchema,
	updateProfile: UpdateProfileResponseSchema,
	updateTaskMetadata: UpdateTaskMetadataResponseSchema,
	uploadExtension: UploadExtensionResponseSchema,
	uploadFile: UploadFileResponseSchema,
	uploadFilesToSession: UploadFilesToSessionResponseSchema,
	waitForEvent: WaitForEventResponseSchema,
} as const;

export type AnchorBrowserEndpointOutputs = {
	[K in keyof typeof AnchorBrowserEndpointOutputSchemas]: z.infer<
		(typeof AnchorBrowserEndpointOutputSchemas)[K]
	>;
};

export type AnchorBrowserEndpointInput =
	AnchorBrowserEndpointInputs[keyof AnchorBrowserEndpointInputs] & {
		// Passthrough for extra fields not yet mapped from Anchor Browser OpenAPI definitions.
		[key: string]: unknown;
	};
