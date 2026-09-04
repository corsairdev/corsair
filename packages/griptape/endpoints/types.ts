import { z } from 'zod';

export const AssistantDetailSchema = z.object({
	assistant_id: z.uuid(),
	created_at: z.string().datetime(),
	created_by: z.string(),
	description: z.string(),
	input: z.string().optional(),
	knowledge_base_ids: z.array(z.uuid()),
	model: z.string().optional(),
	name: z.string(),
	organization_id: z.uuid(),
	retriever_ids: z.array(z.uuid()),
	ruleset_ids: z.array(z.uuid()),
	structure_ids: z.array(z.uuid()),
	tool_ids: z.array(z.uuid()),
	updated_at: z.string().datetime(),
});

const AssistantGetInputSchema = z.object({
	assistant_id: z.uuid(),
});

const AssistantGetResponseSchema = AssistantDetailSchema;

const PaginationSchema = z.object({
	next_page: z.number().optional(),
	page_number: z.number(),
	page_size: z.number(),
	previous_page: z.number().optional(),
	total_count: z.number(),
	total_pages: z.number(),
});

const AssistantListInputSchema = z.object({
	page: z.number().optional(),
	page_size: z.number().optional(),
});

const AssistantListResponseSchema = z.object({
	assistants: z.array(AssistantDetailSchema),
	pagination: PaginationSchema,
});

export type AssistantListInput = z.infer<typeof AssistantListInputSchema>;

export type AssistantListResponse = z.infer<typeof AssistantListResponseSchema>;

export type AssistantGetInput = z.infer<typeof AssistantGetInputSchema>;

export type AssistantGetResponse = z.infer<typeof AssistantGetResponseSchema>;

// ---------------------------------------------------------------------------
// Shared shapes for the wider Griptape Cloud surface.
//
// Method/path bindings below are verified against the canonical Griptape Cloud
// OpenAPI spec (https://griptape-cloud-assets.s3.amazonaws.com/Griptape.openapi.yaml,
// the same spec the official griptape-cloud-python-client is generated from).
// Cloud-managed response payloads are validated as objects with passthrough:
// the spec defines ~200 response models and they evolve, so per-field strict
// schemas would reject valid server output. The two assistant ops above keep
// strict schemas as the fully-pinned exemplar.
// ---------------------------------------------------------------------------

/** Any Cloud-managed JSON object payload (detail/get/create/update output). */
const CloudObjectSchema = z.looseObject({});

/** Any Cloud-managed list payload. List endpoints expose page/page_size (or
 * limit/offset for event timelines) when the provider offers them. */
const CloudListSchema = z.looseObject({
	pagination: PaginationSchema.optional(),
});

/** Delete endpoints answer 204 with no body, so any (including undefined). */
const DeleteResultSchema = z.unknown();

/** Standard page/page_size pagination offered by most list endpoints. */
const PageQuerySchema = z.object({
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});

/** limit/offset pagination used by run-event timelines. */
const LimitOffsetQuerySchema = z.object({
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
});

/** Generic mutation payload for create/update bodies whose exact model is
 * Cloud-managed. Callers pass the documented Cloud fields as an object. */
const MutationBodySchema = z.record(z.string(), z.unknown());

const NonEmptyId = z.string().min(1);

// ---------------------------------------------------------------------------
// Per-operation input schemas (143 ops; op key -> spec operationId in comment)
// ---------------------------------------------------------------------------

const AssistantCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const AssistantUpdateInputSchema = z.object({
	assistant_id: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const AssistantDeleteInputSchema = z.object({
	assistant_id: NonEmptyId,
});

// CreateAssistantRun — fields verified against CreateAssistantRunRequestContent.
const AssistantRunCreateInputSchema = z.object({
	assistant_id: NonEmptyId,
	additional_knowledge_base_ids: z.array(z.string()).optional(),
	additional_retriever_ids: z.array(z.string()).optional(),
	additional_ruleset_ids: z.array(z.string()).optional(),
	additional_structure_ids: z.array(z.string()).optional(),
	additional_tool_ids: z.array(z.string()).optional(),
	args: z.array(z.string()).optional(),
	input: z.string().optional(),
	knowledge_base_ids: z.array(z.string()).optional(),
	model: z.string().optional(),
	new_thread: z.boolean().optional(),
	retriever_ids: z.array(z.string()).optional(),
	ruleset_ids: z.array(z.string()).optional(),
	stream: z.boolean().optional(),
	structure_ids: z.array(z.string()).optional(),
	thread_id: z.string().optional(),
	tool_ids: z.array(z.string()).optional(),
});

const AssistantRunListInputSchema = z.object({
	assistant_id: NonEmptyId,
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});

const AssistantRunIdInputSchema = z.object({
	assistant_run_id: NonEmptyId,
});

const AssistantRunEventsInputSchema = z.object({
	assistant_run_id: NonEmptyId,
	limit: z.number().int().positive().optional(),
	offset: z.number().int().nonnegative().optional(),
});

const ThreadListInputSchema = z.object({
	alias: z.string().optional(),
	created_by: z.string().optional(),
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	starts_with: z.string().optional(),
});

const ThreadCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const ThreadIdInputSchema = z.object({
	thread_id: NonEmptyId,
});

const ThreadUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	thread_id: NonEmptyId,
});

const ThreadMessageListInputSchema = z.object({
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	thread_id: NonEmptyId,
});

// CreateMessage — {input, output} required, verified against
// CreateMessageRequestContent.
const ThreadMessageCreateInputSchema = z.object({
	input: z.string(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	output: z.string(),
	thread_id: NonEmptyId,
});

const MessageIdInputSchema = z.object({
	message_id: NonEmptyId,
});

const MessageUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	message_id: NonEmptyId,
});

const KnowledgeBaseQueryInputSchema = z.object({
	knowledge_base_id: NonEmptyId,
	query: z.string().min(1),
	query_args: z.unknown().optional(),
});

const KnowledgeBaseSearchInputSchema = z.object({
	knowledge_base_id: NonEmptyId,
	query: z.string().min(1),
	query_args: z.unknown().optional(),
});

const KnowledgeBaseIdInputSchema = z.object({
	knowledge_base_id: NonEmptyId,
});

const KnowledgeBaseCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const KnowledgeBaseUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	knowledge_base_id: NonEmptyId,
});

const KnowledgeBaseJobCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	knowledge_base_id: NonEmptyId,
});

const KnowledgeBaseJobIdInputSchema = z.object({
	knowledge_base_job_id: NonEmptyId,
});

const KnowledgeBaseSearchIdInputSchema = z.object({
	knowledge_base_search_id: NonEmptyId,
});

const DataConnectorCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const DataConnectorIdInputSchema = z.object({
	data_connector_id: NonEmptyId,
});

const DataConnectorUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	data_connector_id: NonEmptyId,
});

const DataConnectorJobCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	data_connector_id: NonEmptyId,
});

const DataJobIdInputSchema = z.object({
	data_job_id: NonEmptyId,
});

const StructureCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const StructureIdInputSchema = z.object({
	structure_id: NonEmptyId,
});

const StructureUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	structure_id: NonEmptyId,
});

const StructureDashboardInputSchema = z.object({
	end_time: z.string().optional(),
	period: z.string().optional(),
	start_time: z.string().optional(),
	structure_ids: z.array(z.string()).optional(),
});

const StructureDeploymentCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	structure_id: NonEmptyId,
});

const ToolCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const ToolIdInputSchema = z.object({
	tool_id: NonEmptyId,
});

const ToolUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	tool_id: NonEmptyId,
});

const ToolDeploymentCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	tool_id: NonEmptyId,
});

const ToolDeploymentStatusInputSchema = z.object({
	deployment_id: NonEmptyId,
});

const FunctionCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const FunctionIdInputSchema = z.object({
	function_id: NonEmptyId,
});

const FunctionUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	function_id: NonEmptyId,
});

const FunctionDeploymentCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	function_id: NonEmptyId,
});

const RuleCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const RuleIdInputSchema = z.object({
	rule_id: NonEmptyId,
});

const RuleUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	rule_id: NonEmptyId,
});

const RulesetCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const RulesetIdInputSchema = z.object({
	ruleset_id: NonEmptyId,
});

const RulesetUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	ruleset_id: NonEmptyId,
});

const RulesetByAliasInputSchema = z.object({
	alias: z.string().min(1),
});

const RetrieverQueryInputSchema = z.object({
	query: z.string().min(1),
	retriever_components_query_args: z.unknown().optional(),
	retriever_id: NonEmptyId,
});

const RetrieverCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const RetrieverIdInputSchema = z.object({
	retriever_id: NonEmptyId,
});

const RetrieverUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	retriever_id: NonEmptyId,
});

const RetrieverComponentCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const RetrieverComponentIdInputSchema = z.object({
	retriever_component_id: NonEmptyId,
});

const RetrieverComponentUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	retriever_component_id: NonEmptyId,
});

const LibraryCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const LibraryIdInputSchema = z.object({
	library_id: NonEmptyId,
});

const LibraryUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	library_id: NonEmptyId,
});

const IntegrationCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const IntegrationIdInputSchema = z.object({
	integration_id: NonEmptyId,
});

const IntegrationUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	integration_id: NonEmptyId,
});

const BucketCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const BucketIdInputSchema = z.object({
	bucket_id: NonEmptyId,
});

const BucketUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	bucket_id: NonEmptyId,
});

const BucketAssetListInputSchema = z.object({
	bucket_id: NonEmptyId,
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	postfix: z.string().optional(),
	prefix: z.string().optional(),
});

const BucketAssetIdInputSchema = z.object({
	bucket_id: NonEmptyId,
	name: z.string().min(1),
});

const BucketAssetCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	bucket_id: NonEmptyId,
	name: z.string().min(1),
});

const BucketAssetUrlInputSchema = z.object({
	body: MutationBodySchema.optional(),
	bucket_id: NonEmptyId,
	name: z.string().min(1),
});

const SecretCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const SecretIdInputSchema = z.object({
	secret_id: NonEmptyId,
});

const SecretUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	secret_id: NonEmptyId,
});

const ModelCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const ModelIdInputSchema = z.object({
	model_config_id: NonEmptyId,
});

const ModelUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	model_config_id: NonEmptyId,
});

const ModelAuthConfigCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const ModelAuthConfigIdInputSchema = z.object({
	auth_config_id: NonEmptyId,
});

const ModelAuthConfigUpdateInputSchema = z.object({
	auth_config_id: NonEmptyId,
	body: MutationBodySchema.optional(),
});

const OrganizationIdInputSchema = z.object({
	organization_id: NonEmptyId,
});

const OrganizationUpdateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	organization_id: NonEmptyId,
});

const OrganizationApiKeyCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
	organization_id: NonEmptyId,
});

const UserIdInputSchema = z.object({
	user_id: NonEmptyId,
});

const ApiKeyIdInputSchema = z.object({
	api_key_id: NonEmptyId,
});

const ExportJobCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const ExportJobIdInputSchema = z.object({
	export_job_id: NonEmptyId,
});

const ImportJobCreateInputSchema = z.object({
	body: MutationBodySchema.optional(),
});

const ImportJobIdInputSchema = z.object({
	import_job_id: NonEmptyId,
});

const ConnectionListInputSchema = z.object({
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	type: z.string().optional(),
});

const EmptyInputSchema = z.object({});

export type GriptapeEndpointInputs = {
	assistantList: AssistantListInput;
	assistantGet: AssistantGetInput;
	assistantCreate: z.infer<typeof AssistantCreateInputSchema>;
	assistantUpdate: z.infer<typeof AssistantUpdateInputSchema>;
	assistantDelete: z.infer<typeof AssistantDeleteInputSchema>;
	assistantRunCreate: z.infer<typeof AssistantRunCreateInputSchema>;
	assistantRunList: z.infer<typeof AssistantRunListInputSchema>;
	assistantRunGet: z.infer<typeof AssistantRunIdInputSchema>;
	assistantRunCancel: z.infer<typeof AssistantRunIdInputSchema>;
	assistantRunResult: z.infer<typeof AssistantRunIdInputSchema>;
	assistantRunErrorDetails: z.infer<typeof AssistantRunIdInputSchema>;
	assistantRunLogs: z.infer<typeof AssistantRunEventsInputSchema>;
	assistantRunEvents: z.infer<typeof AssistantRunEventsInputSchema>;
	threadList: z.infer<typeof ThreadListInputSchema>;
	threadCreate: z.infer<typeof ThreadCreateInputSchema>;
	threadGet: z.infer<typeof ThreadIdInputSchema>;
	threadUpdate: z.infer<typeof ThreadUpdateInputSchema>;
	threadDelete: z.infer<typeof ThreadIdInputSchema>;
	threadMessageList: z.infer<typeof ThreadMessageListInputSchema>;
	threadMessageCreate: z.infer<typeof ThreadMessageCreateInputSchema>;
	messageGet: z.infer<typeof MessageIdInputSchema>;
	messageUpdate: z.infer<typeof MessageUpdateInputSchema>;
	messageDelete: z.infer<typeof MessageIdInputSchema>;
	knowledgeBaseList: z.infer<typeof PageQuerySchema>;
	knowledgeBaseCreate: z.infer<typeof KnowledgeBaseCreateInputSchema>;
	knowledgeBaseGet: z.infer<typeof KnowledgeBaseIdInputSchema>;
	knowledgeBaseUpdate: z.infer<typeof KnowledgeBaseUpdateInputSchema>;
	knowledgeBaseDelete: z.infer<typeof KnowledgeBaseIdInputSchema>;
	knowledgeBaseQuery: z.infer<typeof KnowledgeBaseQueryInputSchema>;
	knowledgeBaseSearch: z.infer<typeof KnowledgeBaseSearchInputSchema>;
	knowledgeBaseListQueries: z.infer<typeof KnowledgeBaseIdInputSchema>;
	knowledgeBaseListSearches: z.infer<typeof KnowledgeBaseIdInputSchema>;
	knowledgeBaseGetSearch: z.infer<typeof KnowledgeBaseSearchIdInputSchema>;
	knowledgeBaseCreateJob: z.infer<typeof KnowledgeBaseJobCreateInputSchema>;
	knowledgeBaseListJobs: z.infer<typeof KnowledgeBaseIdInputSchema>;
	knowledgeBaseGetJob: z.infer<typeof KnowledgeBaseJobIdInputSchema>;
	dataConnectorList: z.infer<typeof PageQuerySchema>;
	dataConnectorCreate: z.infer<typeof DataConnectorCreateInputSchema>;
	dataConnectorGet: z.infer<typeof DataConnectorIdInputSchema>;
	dataConnectorUpdate: z.infer<typeof DataConnectorUpdateInputSchema>;
	dataConnectorDelete: z.infer<typeof DataConnectorIdInputSchema>;
	dataConnectorCreateJob: z.infer<typeof DataConnectorJobCreateInputSchema>;
	dataJobGet: z.infer<typeof DataJobIdInputSchema>;
	dataJobCancel: z.infer<typeof DataJobIdInputSchema>;
	structureList: z.infer<typeof PageQuerySchema>;
	structureCreate: z.infer<typeof StructureCreateInputSchema>;
	structureGet: z.infer<typeof StructureIdInputSchema>;
	structureUpdate: z.infer<typeof StructureUpdateInputSchema>;
	structureDelete: z.infer<typeof StructureIdInputSchema>;
	structureDashboard: z.infer<typeof StructureDashboardInputSchema>;
	structureListRuns: z.infer<typeof StructureIdInputSchema>;
	structureListDeployments: z.infer<typeof StructureIdInputSchema>;
	structureCreateDeployment: z.infer<
		typeof StructureDeploymentCreateInputSchema
	>;
	toolList: z.infer<typeof PageQuerySchema>;
	toolCreate: z.infer<typeof ToolCreateInputSchema>;
	toolGet: z.infer<typeof ToolIdInputSchema>;
	toolUpdate: z.infer<typeof ToolUpdateInputSchema>;
	toolDelete: z.infer<typeof ToolIdInputSchema>;
	toolListRuns: z.infer<typeof ToolIdInputSchema>;
	toolListDeployments: z.infer<typeof ToolIdInputSchema>;
	toolCreateDeployment: z.infer<typeof ToolDeploymentCreateInputSchema>;
	toolDeploymentStatus: z.infer<typeof ToolDeploymentStatusInputSchema>;
	functionList: z.infer<typeof PageQuerySchema>;
	functionCreate: z.infer<typeof FunctionCreateInputSchema>;
	functionGet: z.infer<typeof FunctionIdInputSchema>;
	functionUpdate: z.infer<typeof FunctionUpdateInputSchema>;
	functionDelete: z.infer<typeof FunctionIdInputSchema>;
	functionListDeployments: z.infer<typeof FunctionIdInputSchema>;
	functionCreateDeployment: z.infer<typeof FunctionDeploymentCreateInputSchema>;
	ruleList: z.infer<typeof PageQuerySchema>;
	ruleCreate: z.infer<typeof RuleCreateInputSchema>;
	ruleGet: z.infer<typeof RuleIdInputSchema>;
	ruleUpdate: z.infer<typeof RuleUpdateInputSchema>;
	ruleDelete: z.infer<typeof RuleIdInputSchema>;
	rulesetCreate: z.infer<typeof RulesetCreateInputSchema>;
	rulesetGet: z.infer<typeof RulesetIdInputSchema>;
	rulesetGetByAlias: z.infer<typeof RulesetByAliasInputSchema>;
	rulesetUpdate: z.infer<typeof RulesetUpdateInputSchema>;
	rulesetDelete: z.infer<typeof RulesetIdInputSchema>;
	retrieverList: z.infer<typeof PageQuerySchema>;
	retrieverCreate: z.infer<typeof RetrieverCreateInputSchema>;
	retrieverGet: z.infer<typeof RetrieverIdInputSchema>;
	retrieverUpdate: z.infer<typeof RetrieverUpdateInputSchema>;
	retrieverQuery: z.infer<typeof RetrieverQueryInputSchema>;
	retrieverComponentList: z.infer<typeof PageQuerySchema>;
	retrieverComponentCreate: z.infer<typeof RetrieverComponentCreateInputSchema>;
	retrieverComponentGet: z.infer<typeof RetrieverComponentIdInputSchema>;
	retrieverComponentUpdate: z.infer<typeof RetrieverComponentUpdateInputSchema>;
	libraryList: z.infer<typeof PageQuerySchema>;
	libraryCreate: z.infer<typeof LibraryCreateInputSchema>;
	libraryGet: z.infer<typeof LibraryIdInputSchema>;
	libraryUpdate: z.infer<typeof LibraryUpdateInputSchema>;
	libraryDelete: z.infer<typeof LibraryIdInputSchema>;
	integrationList: z.infer<typeof PageQuerySchema>;
	integrationCreate: z.infer<typeof IntegrationCreateInputSchema>;
	integrationGet: z.infer<typeof IntegrationIdInputSchema>;
	integrationUpdate: z.infer<typeof IntegrationUpdateInputSchema>;
	integrationDelete: z.infer<typeof IntegrationIdInputSchema>;
	bucketList: z.infer<typeof PageQuerySchema>;
	bucketCreate: z.infer<typeof BucketCreateInputSchema>;
	bucketGet: z.infer<typeof BucketIdInputSchema>;
	bucketUpdate: z.infer<typeof BucketUpdateInputSchema>;
	bucketDelete: z.infer<typeof BucketIdInputSchema>;
	bucketListAssets: z.infer<typeof BucketAssetListInputSchema>;
	bucketGetAsset: z.infer<typeof BucketAssetIdInputSchema>;
	bucketCreateAsset: z.infer<typeof BucketAssetCreateInputSchema>;
	bucketDeleteAsset: z.infer<typeof BucketAssetIdInputSchema>;
	bucketAssetUrl: z.infer<typeof BucketAssetUrlInputSchema>;
	secretList: z.infer<typeof PageQuerySchema>;
	secretCreate: z.infer<typeof SecretCreateInputSchema>;
	secretGet: z.infer<typeof SecretIdInputSchema>;
	secretUpdate: z.infer<typeof SecretUpdateInputSchema>;
	secretDelete: z.infer<typeof SecretIdInputSchema>;
	modelList: z.infer<typeof PageQuerySchema>;
	modelCreate: z.infer<typeof ModelCreateInputSchema>;
	modelGet: z.infer<typeof ModelIdInputSchema>;
	modelUpdate: z.infer<typeof ModelUpdateInputSchema>;
	modelDelete: z.infer<typeof ModelIdInputSchema>;
	modelListAuthConfigs: z.infer<typeof PageQuerySchema>;
	modelCreateAuthConfig: z.infer<typeof ModelAuthConfigCreateInputSchema>;
	modelGetAuthConfig: z.infer<typeof ModelAuthConfigIdInputSchema>;
	modelUpdateAuthConfig: z.infer<typeof ModelAuthConfigUpdateInputSchema>;
	modelDeleteAuthConfig: z.infer<typeof ModelAuthConfigIdInputSchema>;
	organizationList: z.infer<typeof PageQuerySchema>;
	organizationGet: z.infer<typeof OrganizationIdInputSchema>;
	organizationUpdate: z.infer<typeof OrganizationUpdateInputSchema>;
	organizationListApiKeys: z.infer<typeof OrganizationIdInputSchema>;
	organizationCreateApiKey: z.infer<typeof OrganizationApiKeyCreateInputSchema>;
	userList: z.infer<typeof PageQuerySchema>;
	userGet: z.infer<typeof UserIdInputSchema>;
	userGetApiKey: z.infer<typeof ApiKeyIdInputSchema>;
	userDeleteApiKey: z.infer<typeof ApiKeyIdInputSchema>;
	billingManagementUrl: z.infer<typeof EmptyInputSchema>;
	creditsBalance: z.infer<typeof EmptyInputSchema>;
	usageGet: z.infer<typeof EmptyInputSchema>;
	configGet: z.infer<typeof EmptyInputSchema>;
	connectionList: z.infer<typeof ConnectionListInputSchema>;
	exportJobList: z.infer<typeof PageQuerySchema>;
	exportJobCreate: z.infer<typeof ExportJobCreateInputSchema>;
	exportJobGet: z.infer<typeof ExportJobIdInputSchema>;
	importJobList: z.infer<typeof PageQuerySchema>;
	importJobCreate: z.infer<typeof ImportJobCreateInputSchema>;
	importJobGet: z.infer<typeof ImportJobIdInputSchema>;
};

export type GriptapeEndpointOutputs = {
	assistantList: AssistantListResponse;
	assistantGet: AssistantGetResponse;
	assistantCreate: z.infer<typeof CloudObjectSchema>;
	assistantUpdate: z.infer<typeof CloudObjectSchema>;
	assistantDelete: z.infer<typeof DeleteResultSchema>;
	assistantRunCreate: z.infer<typeof CloudObjectSchema>;
	assistantRunList: z.infer<typeof CloudListSchema>;
	assistantRunGet: z.infer<typeof CloudObjectSchema>;
	assistantRunCancel: z.infer<typeof CloudObjectSchema>;
	assistantRunResult: z.infer<typeof CloudObjectSchema>;
	assistantRunErrorDetails: z.infer<typeof CloudObjectSchema>;
	assistantRunLogs: z.infer<typeof CloudListSchema>;
	assistantRunEvents: z.infer<typeof CloudListSchema>;
	threadList: z.infer<typeof CloudListSchema>;
	threadCreate: z.infer<typeof CloudObjectSchema>;
	threadGet: z.infer<typeof CloudObjectSchema>;
	threadUpdate: z.infer<typeof CloudObjectSchema>;
	threadDelete: z.infer<typeof DeleteResultSchema>;
	threadMessageList: z.infer<typeof CloudListSchema>;
	threadMessageCreate: z.infer<typeof CloudObjectSchema>;
	messageGet: z.infer<typeof CloudObjectSchema>;
	messageUpdate: z.infer<typeof CloudObjectSchema>;
	messageDelete: z.infer<typeof DeleteResultSchema>;
	knowledgeBaseList: z.infer<typeof CloudListSchema>;
	knowledgeBaseCreate: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseGet: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseUpdate: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseDelete: z.infer<typeof DeleteResultSchema>;
	knowledgeBaseQuery: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseSearch: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseListQueries: z.infer<typeof CloudListSchema>;
	knowledgeBaseListSearches: z.infer<typeof CloudListSchema>;
	knowledgeBaseGetSearch: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseCreateJob: z.infer<typeof CloudObjectSchema>;
	knowledgeBaseListJobs: z.infer<typeof CloudListSchema>;
	knowledgeBaseGetJob: z.infer<typeof CloudObjectSchema>;
	dataConnectorList: z.infer<typeof CloudListSchema>;
	dataConnectorCreate: z.infer<typeof CloudObjectSchema>;
	dataConnectorGet: z.infer<typeof CloudObjectSchema>;
	dataConnectorUpdate: z.infer<typeof CloudObjectSchema>;
	dataConnectorDelete: z.infer<typeof DeleteResultSchema>;
	dataConnectorCreateJob: z.infer<typeof CloudObjectSchema>;
	dataJobGet: z.infer<typeof CloudObjectSchema>;
	dataJobCancel: z.infer<typeof CloudObjectSchema>;
	structureList: z.infer<typeof CloudListSchema>;
	structureCreate: z.infer<typeof CloudObjectSchema>;
	structureGet: z.infer<typeof CloudObjectSchema>;
	structureUpdate: z.infer<typeof CloudObjectSchema>;
	structureDelete: z.infer<typeof DeleteResultSchema>;
	structureDashboard: z.infer<typeof CloudObjectSchema>;
	structureListRuns: z.infer<typeof CloudListSchema>;
	structureListDeployments: z.infer<typeof CloudListSchema>;
	structureCreateDeployment: z.infer<typeof CloudObjectSchema>;
	toolList: z.infer<typeof CloudListSchema>;
	toolCreate: z.infer<typeof CloudObjectSchema>;
	toolGet: z.infer<typeof CloudObjectSchema>;
	toolUpdate: z.infer<typeof CloudObjectSchema>;
	toolDelete: z.infer<typeof DeleteResultSchema>;
	toolListRuns: z.infer<typeof CloudListSchema>;
	toolListDeployments: z.infer<typeof CloudListSchema>;
	toolCreateDeployment: z.infer<typeof CloudObjectSchema>;
	toolDeploymentStatus: z.infer<typeof CloudObjectSchema>;
	functionList: z.infer<typeof CloudListSchema>;
	functionCreate: z.infer<typeof CloudObjectSchema>;
	functionGet: z.infer<typeof CloudObjectSchema>;
	functionUpdate: z.infer<typeof CloudObjectSchema>;
	functionDelete: z.infer<typeof DeleteResultSchema>;
	functionListDeployments: z.infer<typeof CloudListSchema>;
	functionCreateDeployment: z.infer<typeof CloudObjectSchema>;
	ruleList: z.infer<typeof CloudListSchema>;
	ruleCreate: z.infer<typeof CloudObjectSchema>;
	ruleGet: z.infer<typeof CloudObjectSchema>;
	ruleUpdate: z.infer<typeof CloudObjectSchema>;
	ruleDelete: z.infer<typeof DeleteResultSchema>;
	rulesetCreate: z.infer<typeof CloudObjectSchema>;
	rulesetGet: z.infer<typeof CloudObjectSchema>;
	rulesetGetByAlias: z.infer<typeof CloudListSchema>;
	rulesetUpdate: z.infer<typeof CloudObjectSchema>;
	rulesetDelete: z.infer<typeof DeleteResultSchema>;
	retrieverList: z.infer<typeof CloudListSchema>;
	retrieverCreate: z.infer<typeof CloudObjectSchema>;
	retrieverGet: z.infer<typeof CloudObjectSchema>;
	retrieverUpdate: z.infer<typeof CloudObjectSchema>;
	retrieverQuery: z.infer<typeof CloudObjectSchema>;
	retrieverComponentList: z.infer<typeof CloudListSchema>;
	retrieverComponentCreate: z.infer<typeof CloudObjectSchema>;
	retrieverComponentGet: z.infer<typeof CloudObjectSchema>;
	retrieverComponentUpdate: z.infer<typeof CloudObjectSchema>;
	libraryList: z.infer<typeof CloudListSchema>;
	libraryCreate: z.infer<typeof CloudObjectSchema>;
	libraryGet: z.infer<typeof CloudObjectSchema>;
	libraryUpdate: z.infer<typeof CloudObjectSchema>;
	libraryDelete: z.infer<typeof DeleteResultSchema>;
	integrationList: z.infer<typeof CloudListSchema>;
	integrationCreate: z.infer<typeof CloudObjectSchema>;
	integrationGet: z.infer<typeof CloudObjectSchema>;
	integrationUpdate: z.infer<typeof CloudObjectSchema>;
	integrationDelete: z.infer<typeof DeleteResultSchema>;
	bucketList: z.infer<typeof CloudListSchema>;
	bucketCreate: z.infer<typeof CloudObjectSchema>;
	bucketGet: z.infer<typeof CloudObjectSchema>;
	bucketUpdate: z.infer<typeof CloudObjectSchema>;
	bucketDelete: z.infer<typeof DeleteResultSchema>;
	bucketListAssets: z.infer<typeof CloudListSchema>;
	bucketGetAsset: z.infer<typeof CloudObjectSchema>;
	bucketCreateAsset: z.infer<typeof CloudObjectSchema>;
	bucketDeleteAsset: z.infer<typeof DeleteResultSchema>;
	bucketAssetUrl: z.infer<typeof CloudObjectSchema>;
	secretList: z.infer<typeof CloudListSchema>;
	secretCreate: z.infer<typeof CloudObjectSchema>;
	secretGet: z.infer<typeof CloudObjectSchema>;
	secretUpdate: z.infer<typeof CloudObjectSchema>;
	secretDelete: z.infer<typeof DeleteResultSchema>;
	modelList: z.infer<typeof CloudListSchema>;
	modelCreate: z.infer<typeof CloudObjectSchema>;
	modelGet: z.infer<typeof CloudObjectSchema>;
	modelUpdate: z.infer<typeof CloudObjectSchema>;
	modelDelete: z.infer<typeof DeleteResultSchema>;
	modelListAuthConfigs: z.infer<typeof CloudListSchema>;
	modelCreateAuthConfig: z.infer<typeof CloudObjectSchema>;
	modelGetAuthConfig: z.infer<typeof CloudObjectSchema>;
	modelUpdateAuthConfig: z.infer<typeof CloudObjectSchema>;
	modelDeleteAuthConfig: z.infer<typeof DeleteResultSchema>;
	organizationList: z.infer<typeof CloudListSchema>;
	organizationGet: z.infer<typeof CloudObjectSchema>;
	organizationUpdate: z.infer<typeof CloudObjectSchema>;
	organizationListApiKeys: z.infer<typeof CloudListSchema>;
	organizationCreateApiKey: z.infer<typeof CloudObjectSchema>;
	userList: z.infer<typeof CloudListSchema>;
	userGet: z.infer<typeof CloudObjectSchema>;
	userGetApiKey: z.infer<typeof CloudObjectSchema>;
	userDeleteApiKey: z.infer<typeof DeleteResultSchema>;
	billingManagementUrl: z.infer<typeof CloudObjectSchema>;
	creditsBalance: z.infer<typeof CloudObjectSchema>;
	usageGet: z.infer<typeof CloudObjectSchema>;
	configGet: z.infer<typeof CloudObjectSchema>;
	connectionList: z.infer<typeof CloudListSchema>;
	exportJobList: z.infer<typeof CloudListSchema>;
	exportJobCreate: z.infer<typeof CloudObjectSchema>;
	exportJobGet: z.infer<typeof CloudObjectSchema>;
	importJobList: z.infer<typeof CloudListSchema>;
	importJobCreate: z.infer<typeof CloudObjectSchema>;
	importJobGet: z.infer<typeof CloudObjectSchema>;
};

export const GriptapeEndpointInputSchemas = {
	assistantList: AssistantListInputSchema,
	assistantGet: AssistantGetInputSchema,
	assistantCreate: AssistantCreateInputSchema,
	assistantUpdate: AssistantUpdateInputSchema,
	assistantDelete: AssistantDeleteInputSchema,
	assistantRunCreate: AssistantRunCreateInputSchema,
	assistantRunList: AssistantRunListInputSchema,
	assistantRunGet: AssistantRunIdInputSchema,
	assistantRunCancel: AssistantRunIdInputSchema,
	assistantRunResult: AssistantRunIdInputSchema,
	assistantRunErrorDetails: AssistantRunIdInputSchema,
	assistantRunLogs: AssistantRunEventsInputSchema,
	assistantRunEvents: AssistantRunEventsInputSchema,
	threadList: ThreadListInputSchema,
	threadCreate: ThreadCreateInputSchema,
	threadGet: ThreadIdInputSchema,
	threadUpdate: ThreadUpdateInputSchema,
	threadDelete: ThreadIdInputSchema,
	threadMessageList: ThreadMessageListInputSchema,
	threadMessageCreate: ThreadMessageCreateInputSchema,
	messageGet: MessageIdInputSchema,
	messageUpdate: MessageUpdateInputSchema,
	messageDelete: MessageIdInputSchema,
	knowledgeBaseList: PageQuerySchema,
	knowledgeBaseCreate: KnowledgeBaseCreateInputSchema,
	knowledgeBaseGet: KnowledgeBaseIdInputSchema,
	knowledgeBaseUpdate: KnowledgeBaseUpdateInputSchema,
	knowledgeBaseDelete: KnowledgeBaseIdInputSchema,
	knowledgeBaseQuery: KnowledgeBaseQueryInputSchema,
	knowledgeBaseSearch: KnowledgeBaseSearchInputSchema,
	knowledgeBaseListQueries: KnowledgeBaseIdInputSchema,
	knowledgeBaseListSearches: KnowledgeBaseIdInputSchema,
	knowledgeBaseGetSearch: KnowledgeBaseSearchIdInputSchema,
	knowledgeBaseCreateJob: KnowledgeBaseJobCreateInputSchema,
	knowledgeBaseListJobs: KnowledgeBaseIdInputSchema,
	knowledgeBaseGetJob: KnowledgeBaseJobIdInputSchema,
	dataConnectorList: PageQuerySchema,
	dataConnectorCreate: DataConnectorCreateInputSchema,
	dataConnectorGet: DataConnectorIdInputSchema,
	dataConnectorUpdate: DataConnectorUpdateInputSchema,
	dataConnectorDelete: DataConnectorIdInputSchema,
	dataConnectorCreateJob: DataConnectorJobCreateInputSchema,
	dataJobGet: DataJobIdInputSchema,
	dataJobCancel: DataJobIdInputSchema,
	structureList: PageQuerySchema,
	structureCreate: StructureCreateInputSchema,
	structureGet: StructureIdInputSchema,
	structureUpdate: StructureUpdateInputSchema,
	structureDelete: StructureIdInputSchema,
	structureDashboard: StructureDashboardInputSchema,
	structureListRuns: StructureIdInputSchema,
	structureListDeployments: StructureIdInputSchema,
	structureCreateDeployment: StructureDeploymentCreateInputSchema,
	toolList: PageQuerySchema,
	toolCreate: ToolCreateInputSchema,
	toolGet: ToolIdInputSchema,
	toolUpdate: ToolUpdateInputSchema,
	toolDelete: ToolIdInputSchema,
	toolListRuns: ToolIdInputSchema,
	toolListDeployments: ToolIdInputSchema,
	toolCreateDeployment: ToolDeploymentCreateInputSchema,
	toolDeploymentStatus: ToolDeploymentStatusInputSchema,
	functionList: PageQuerySchema,
	functionCreate: FunctionCreateInputSchema,
	functionGet: FunctionIdInputSchema,
	functionUpdate: FunctionUpdateInputSchema,
	functionDelete: FunctionIdInputSchema,
	functionListDeployments: FunctionIdInputSchema,
	functionCreateDeployment: FunctionDeploymentCreateInputSchema,
	ruleList: PageQuerySchema,
	ruleCreate: RuleCreateInputSchema,
	ruleGet: RuleIdInputSchema,
	ruleUpdate: RuleUpdateInputSchema,
	ruleDelete: RuleIdInputSchema,
	rulesetCreate: RulesetCreateInputSchema,
	rulesetGet: RulesetIdInputSchema,
	rulesetGetByAlias: RulesetByAliasInputSchema,
	rulesetUpdate: RulesetUpdateInputSchema,
	rulesetDelete: RulesetIdInputSchema,
	retrieverList: PageQuerySchema,
	retrieverCreate: RetrieverCreateInputSchema,
	retrieverGet: RetrieverIdInputSchema,
	retrieverUpdate: RetrieverUpdateInputSchema,
	retrieverQuery: RetrieverQueryInputSchema,
	retrieverComponentList: PageQuerySchema,
	retrieverComponentCreate: RetrieverComponentCreateInputSchema,
	retrieverComponentGet: RetrieverComponentIdInputSchema,
	retrieverComponentUpdate: RetrieverComponentUpdateInputSchema,
	libraryList: PageQuerySchema,
	libraryCreate: LibraryCreateInputSchema,
	libraryGet: LibraryIdInputSchema,
	libraryUpdate: LibraryUpdateInputSchema,
	libraryDelete: LibraryIdInputSchema,
	integrationList: PageQuerySchema,
	integrationCreate: IntegrationCreateInputSchema,
	integrationGet: IntegrationIdInputSchema,
	integrationUpdate: IntegrationUpdateInputSchema,
	integrationDelete: IntegrationIdInputSchema,
	bucketList: PageQuerySchema,
	bucketCreate: BucketCreateInputSchema,
	bucketGet: BucketIdInputSchema,
	bucketUpdate: BucketUpdateInputSchema,
	bucketDelete: BucketIdInputSchema,
	bucketListAssets: BucketAssetListInputSchema,
	bucketGetAsset: BucketAssetIdInputSchema,
	bucketCreateAsset: BucketAssetCreateInputSchema,
	bucketDeleteAsset: BucketAssetIdInputSchema,
	bucketAssetUrl: BucketAssetUrlInputSchema,
	secretList: PageQuerySchema,
	secretCreate: SecretCreateInputSchema,
	secretGet: SecretIdInputSchema,
	secretUpdate: SecretUpdateInputSchema,
	secretDelete: SecretIdInputSchema,
	modelList: PageQuerySchema,
	modelCreate: ModelCreateInputSchema,
	modelGet: ModelIdInputSchema,
	modelUpdate: ModelUpdateInputSchema,
	modelDelete: ModelIdInputSchema,
	modelListAuthConfigs: PageQuerySchema,
	modelCreateAuthConfig: ModelAuthConfigCreateInputSchema,
	modelGetAuthConfig: ModelAuthConfigIdInputSchema,
	modelUpdateAuthConfig: ModelAuthConfigUpdateInputSchema,
	modelDeleteAuthConfig: ModelAuthConfigIdInputSchema,
	organizationList: PageQuerySchema,
	organizationGet: OrganizationIdInputSchema,
	organizationUpdate: OrganizationUpdateInputSchema,
	organizationListApiKeys: OrganizationIdInputSchema,
	organizationCreateApiKey: OrganizationApiKeyCreateInputSchema,
	userList: PageQuerySchema,
	userGet: UserIdInputSchema,
	userGetApiKey: ApiKeyIdInputSchema,
	userDeleteApiKey: ApiKeyIdInputSchema,
	billingManagementUrl: EmptyInputSchema,
	creditsBalance: EmptyInputSchema,
	usageGet: EmptyInputSchema,
	configGet: EmptyInputSchema,
	connectionList: ConnectionListInputSchema,
	exportJobList: PageQuerySchema,
	exportJobCreate: ExportJobCreateInputSchema,
	exportJobGet: ExportJobIdInputSchema,
	importJobList: PageQuerySchema,
	importJobCreate: ImportJobCreateInputSchema,
	importJobGet: ImportJobIdInputSchema,
} as const;

export const GriptapeEndpointOutputSchemas = {
	assistantList: AssistantListResponseSchema,
	assistantGet: AssistantGetResponseSchema,
	assistantCreate: CloudObjectSchema,
	assistantUpdate: CloudObjectSchema,
	assistantDelete: DeleteResultSchema,
	assistantRunCreate: CloudObjectSchema,
	assistantRunList: CloudListSchema,
	assistantRunGet: CloudObjectSchema,
	assistantRunCancel: CloudObjectSchema,
	assistantRunResult: CloudObjectSchema,
	assistantRunErrorDetails: CloudObjectSchema,
	assistantRunLogs: CloudListSchema,
	assistantRunEvents: CloudListSchema,
	threadList: CloudListSchema,
	threadCreate: CloudObjectSchema,
	threadGet: CloudObjectSchema,
	threadUpdate: CloudObjectSchema,
	threadDelete: DeleteResultSchema,
	threadMessageList: CloudListSchema,
	threadMessageCreate: CloudObjectSchema,
	messageGet: CloudObjectSchema,
	messageUpdate: CloudObjectSchema,
	messageDelete: DeleteResultSchema,
	knowledgeBaseList: CloudListSchema,
	knowledgeBaseCreate: CloudObjectSchema,
	knowledgeBaseGet: CloudObjectSchema,
	knowledgeBaseUpdate: CloudObjectSchema,
	knowledgeBaseDelete: DeleteResultSchema,
	knowledgeBaseQuery: CloudObjectSchema,
	knowledgeBaseSearch: CloudObjectSchema,
	knowledgeBaseListQueries: CloudListSchema,
	knowledgeBaseListSearches: CloudListSchema,
	knowledgeBaseGetSearch: CloudObjectSchema,
	knowledgeBaseCreateJob: CloudObjectSchema,
	knowledgeBaseListJobs: CloudListSchema,
	knowledgeBaseGetJob: CloudObjectSchema,
	dataConnectorList: CloudListSchema,
	dataConnectorCreate: CloudObjectSchema,
	dataConnectorGet: CloudObjectSchema,
	dataConnectorUpdate: CloudObjectSchema,
	dataConnectorDelete: DeleteResultSchema,
	dataConnectorCreateJob: CloudObjectSchema,
	dataJobGet: CloudObjectSchema,
	dataJobCancel: CloudObjectSchema,
	structureList: CloudListSchema,
	structureCreate: CloudObjectSchema,
	structureGet: CloudObjectSchema,
	structureUpdate: CloudObjectSchema,
	structureDelete: DeleteResultSchema,
	structureDashboard: CloudObjectSchema,
	structureListRuns: CloudListSchema,
	structureListDeployments: CloudListSchema,
	structureCreateDeployment: CloudObjectSchema,
	toolList: CloudListSchema,
	toolCreate: CloudObjectSchema,
	toolGet: CloudObjectSchema,
	toolUpdate: CloudObjectSchema,
	toolDelete: DeleteResultSchema,
	toolListRuns: CloudListSchema,
	toolListDeployments: CloudListSchema,
	toolCreateDeployment: CloudObjectSchema,
	toolDeploymentStatus: CloudObjectSchema,
	functionList: CloudListSchema,
	functionCreate: CloudObjectSchema,
	functionGet: CloudObjectSchema,
	functionUpdate: CloudObjectSchema,
	functionDelete: DeleteResultSchema,
	functionListDeployments: CloudListSchema,
	functionCreateDeployment: CloudObjectSchema,
	ruleList: CloudListSchema,
	ruleCreate: CloudObjectSchema,
	ruleGet: CloudObjectSchema,
	ruleUpdate: CloudObjectSchema,
	ruleDelete: DeleteResultSchema,
	rulesetCreate: CloudObjectSchema,
	rulesetGet: CloudObjectSchema,
	rulesetGetByAlias: CloudListSchema,
	rulesetUpdate: CloudObjectSchema,
	rulesetDelete: DeleteResultSchema,
	retrieverList: CloudListSchema,
	retrieverCreate: CloudObjectSchema,
	retrieverGet: CloudObjectSchema,
	retrieverUpdate: CloudObjectSchema,
	retrieverQuery: CloudObjectSchema,
	retrieverComponentList: CloudListSchema,
	retrieverComponentCreate: CloudObjectSchema,
	retrieverComponentGet: CloudObjectSchema,
	retrieverComponentUpdate: CloudObjectSchema,
	libraryList: CloudListSchema,
	libraryCreate: CloudObjectSchema,
	libraryGet: CloudObjectSchema,
	libraryUpdate: CloudObjectSchema,
	libraryDelete: DeleteResultSchema,
	integrationList: CloudListSchema,
	integrationCreate: CloudObjectSchema,
	integrationGet: CloudObjectSchema,
	integrationUpdate: CloudObjectSchema,
	integrationDelete: DeleteResultSchema,
	bucketList: CloudListSchema,
	bucketCreate: CloudObjectSchema,
	bucketGet: CloudObjectSchema,
	bucketUpdate: CloudObjectSchema,
	bucketDelete: DeleteResultSchema,
	bucketListAssets: CloudListSchema,
	bucketGetAsset: CloudObjectSchema,
	bucketCreateAsset: CloudObjectSchema,
	bucketDeleteAsset: DeleteResultSchema,
	bucketAssetUrl: CloudObjectSchema,
	secretList: CloudListSchema,
	secretCreate: CloudObjectSchema,
	secretGet: CloudObjectSchema,
	secretUpdate: CloudObjectSchema,
	secretDelete: DeleteResultSchema,
	modelList: CloudListSchema,
	modelCreate: CloudObjectSchema,
	modelGet: CloudObjectSchema,
	modelUpdate: CloudObjectSchema,
	modelDelete: DeleteResultSchema,
	modelListAuthConfigs: CloudListSchema,
	modelCreateAuthConfig: CloudObjectSchema,
	modelGetAuthConfig: CloudObjectSchema,
	modelUpdateAuthConfig: CloudObjectSchema,
	modelDeleteAuthConfig: DeleteResultSchema,
	organizationList: CloudListSchema,
	organizationGet: CloudObjectSchema,
	organizationUpdate: CloudObjectSchema,
	organizationListApiKeys: CloudListSchema,
	organizationCreateApiKey: CloudObjectSchema,
	userList: CloudListSchema,
	userGet: CloudObjectSchema,
	userGetApiKey: CloudObjectSchema,
	userDeleteApiKey: DeleteResultSchema,
	billingManagementUrl: CloudObjectSchema,
	creditsBalance: CloudObjectSchema,
	usageGet: CloudObjectSchema,
	configGet: CloudObjectSchema,
	connectionList: CloudListSchema,
	exportJobList: CloudListSchema,
	exportJobCreate: CloudObjectSchema,
	exportJobGet: CloudObjectSchema,
	importJobList: CloudListSchema,
	importJobCreate: CloudObjectSchema,
	importJobGet: CloudObjectSchema,
} as const;
