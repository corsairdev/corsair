import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

const ChatCompletionsInputSchema = z
	.object({
		model: z.string(),
		messages: z.array(
			z
				.object({
					role: z.string(),
					content: z.string(),
				})
				.loose(),
		),
		max_tokens: z.number().optional(),
		stream: z.boolean().optional(),
	})
	.loose();

export type ChatCompletionsInput = z.infer<typeof ChatCompletionsInputSchema>;

const ChatCompletionsResponseSchema = z
	.object({
		id: z.string().optional(),
		choices: z
			.array(
				z
					.object({
						index: z.number().optional(),
						message: z
							.object({
								role: z.string().optional(),
								content: z.string().optional(),
							})
							.loose()
							.optional(),
						finish_reason: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		usage: z
			.object({
				prompt_tokens: z.number().optional(),
				completion_tokens: z.number().optional(),
				total_tokens: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type ChatCompletionsResponse = z.infer<
	typeof ChatCompletionsResponseSchema
>;

const FileMetadataSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		size: z.number().optional(),
		created_at: z.string().optional(),
		labels: z.array(z.string()).optional(),
		errorCode: z.string().optional(),
		errorMessage: z.string().optional(),
	})
	.loose();

const ListLibraryFilesInputSchema = z
	.object({
		name: z.string().optional(),
		status: z.string().optional(),
		label: z.array(z.string()).optional(),
		offset: z.number().optional(),
		limit: z.number().optional(),
	})
	.loose();
export type ListLibraryFilesInput = z.infer<typeof ListLibraryFilesInputSchema>;

const ListLibraryFilesResponseSchema = z.array(FileMetadataSchema);
export type ListLibraryFilesResponse = z.infer<
	typeof ListLibraryFilesResponseSchema
>;

const UploadWorkspaceFileInputSchema = z
	.object({
		file: z.any(),
		fileName: z.string(),
		labels: z.array(z.string()).optional(),
		publicUrl: z.string().optional(),
	})
	.loose();
export type UploadWorkspaceFileInput = z.infer<
	typeof UploadWorkspaceFileInputSchema
>;

const UploadWorkspaceFileResponseSchema = z
	.object({
		id: z.string().optional(),
	})
	.loose();
export type UploadWorkspaceFileResponse = z.infer<
	typeof UploadWorkspaceFileResponseSchema
>;

const GetWorkspaceFileInputSchema = z
	.object({
		file_id: z.string(),
	})
	.loose();
export type GetWorkspaceFileInput = z.infer<typeof GetWorkspaceFileInputSchema>;

const GetWorkspaceFileResponseSchema = FileMetadataSchema;
export type GetWorkspaceFileResponse = z.infer<
	typeof GetWorkspaceFileResponseSchema
>;

const UpdateFileInputSchema = z
	.object({
		file_id: z.string(),
		publicUrl: z.string().optional(),
		labels: z.array(z.string()).optional(),
	})
	.loose();
export type UpdateFileInput = z.infer<typeof UpdateFileInputSchema>;

const UpdateFileResponseSchema = z.void();
export type UpdateFileResponse = z.infer<typeof UpdateFileResponseSchema>;

const DeleteFileInputSchema = z
	.object({
		file_id: z.string(),
	})
	.loose();
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

const DeleteFileResponseSchema = z.void();
export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;

const GetFileDownloadLinkInputSchema = z
	.object({
		file_id: z.string(),
	})
	.loose();
export type GetFileDownloadLinkInput = z.infer<
	typeof GetFileDownloadLinkInputSchema
>;

const GetFileDownloadLinkResponseSchema = z.string();
export type GetFileDownloadLinkResponse = z.infer<
	typeof GetFileDownloadLinkResponseSchema
>;

// Batch 1 Custom Operations
const CheckCanIframeInputSchema = z
	.object({
		url: z.string(),
	})
	.loose();
export type CheckCanIframeInput = z.infer<typeof CheckCanIframeInputSchema>;

const CheckCanIframeResponseSchema = z
	.object({
		canIframe: z.boolean(),
		reason: z.string().optional(),
	})
	.loose();
export type CheckCanIframeResponse = z.infer<
	typeof CheckCanIframeResponseSchema
>;

const CheckKirshGrantComplianceInputSchema = z
	.object({
		grantIds: z.array(z.string()),
	})
	.loose();
export type CheckKirshGrantComplianceInput = z.infer<
	typeof CheckKirshGrantComplianceInputSchema
>;

const CheckKirshGrantComplianceResponseSchema = z
	.object({
		complianceStatus: z.record(z.boolean()),
	})
	.loose();
export type CheckKirshGrantComplianceResponse = z.infer<
	typeof CheckKirshGrantComplianceResponseSchema
>;

const CompareTextInputSchema = z
	.object({
		original: z.string(),
		modified: z.string(),
	})
	.loose();
export type CompareTextInput = z.infer<typeof CompareTextInputSchema>;

const CompareTextResponseSchema = z
	.object({
		score: z.number(),
		differences: z.array(z.string()).optional(),
	})
	.loose();
export type CompareTextResponse = z.infer<typeof CompareTextResponseSchema>;

const CreateAftersalesPartsBatchInputSchema = z
	.object({
		cases: z.array(
			z
				.object({
					id: z.string(),
					text: z.string(),
				})
				.loose(),
		),
	})
	.loose();
export type CreateAftersalesPartsBatchInput = z.infer<
	typeof CreateAftersalesPartsBatchInputSchema
>;

const CreateAftersalesPartsBatchResponseSchema = z
	.object({
		batchId: z.string(),
		status: z.string(),
	})
	.loose();
export type CreateAftersalesPartsBatchResponse = z.infer<
	typeof CreateAftersalesPartsBatchResponseSchema
>;

const CreateAssistantInputSchema = z
	.object({
		name: z.string(),
		model: z.string().optional(),
		instructions: z.string().optional(),
	})
	.loose();
export type CreateAssistantInput = z.infer<typeof CreateAssistantInputSchema>;

const CreateAssistantResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.loose();
export type CreateAssistantResponse = z.infer<
	typeof CreateAssistantResponseSchema
>;

// Batch 2 Custom Operations
const CreateAssistantPlanInputSchema = z
	.object({
		assistantId: z.string(),
		plan: z.string(),
		config: z.record(z.any()).optional(),
	})
	.loose();
export type CreateAssistantPlanInput = z.infer<
	typeof CreateAssistantPlanInputSchema
>;

const CreateAssistantPlanResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type CreateAssistantPlanResponse = z.infer<
	typeof CreateAssistantPlanResponseSchema
>;

const CreateAssistantRouteInputSchema = z
	.object({
		assistantId: z.string(),
		route: z.string(),
		destination: z.string(),
	})
	.loose();
export type CreateAssistantRouteInput = z.infer<
	typeof CreateAssistantRouteInputSchema
>;

const CreateAssistantRouteResponseSchema = z
	.object({
		id: z.string(),
		route: z.string(),
	})
	.loose();
export type CreateAssistantRouteResponse = z.infer<
	typeof CreateAssistantRouteResponseSchema
>;

const CreateDemoInputSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
	})
	.loose();
export type CreateDemoInput = z.infer<typeof CreateDemoInputSchema>;

const CreateDemoResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.loose();
export type CreateDemoResponse = z.infer<typeof CreateDemoResponseSchema>;

const CreateKirshGrantCompliancePreviewInputSchema = z
	.object({
		grantId: z.string(),
		previewData: z.string(),
	})
	.loose();
export type CreateKirshGrantCompliancePreviewInput = z.infer<
	typeof CreateKirshGrantCompliancePreviewInputSchema
>;

const CreateKirshGrantCompliancePreviewResponseSchema = z
	.object({
		previewId: z.string(),
		status: z.string(),
	})
	.loose();
export type CreateKirshGrantCompliancePreviewResponse = z.infer<
	typeof CreateKirshGrantCompliancePreviewResponseSchema
>;

const CreateMcpStorageInputSchema = z
	.object({
		name: z.string(),
		data: z.record(z.any()),
	})
	.loose();
export type CreateMcpStorageInput = z.infer<typeof CreateMcpStorageInputSchema>;

const CreateMcpStorageResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type CreateMcpStorageResponse = z.infer<
	typeof CreateMcpStorageResponseSchema
>;

// Batch 3 Custom Operations (Delete)
const DeleteAssistantInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteAssistantInput = z.infer<typeof DeleteAssistantInputSchema>;

const DeleteAssistantResponseSchema = z.void();
export type DeleteAssistantResponse = z.infer<
	typeof DeleteAssistantResponseSchema
>;

const DeleteAssistantRouteInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteAssistantRouteInput = z.infer<
	typeof DeleteAssistantRouteInputSchema
>;

const DeleteAssistantRouteResponseSchema = z.void();
export type DeleteAssistantRouteResponse = z.infer<
	typeof DeleteAssistantRouteResponseSchema
>;

const DeleteDemoInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteDemoInput = z.infer<typeof DeleteDemoInputSchema>;

const DeleteDemoResponseSchema = z.void();
export type DeleteDemoResponse = z.infer<typeof DeleteDemoResponseSchema>;

const DeleteMcpStorageInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteMcpStorageInput = z.infer<typeof DeleteMcpStorageInputSchema>;

const DeleteMcpStorageResponseSchema = z.void();
export type DeleteMcpStorageResponse = z.infer<
	typeof DeleteMcpStorageResponseSchema
>;

const DeleteSecretInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteSecretInput = z.infer<typeof DeleteSecretInputSchema>;

const DeleteSecretResponseSchema = z.void();
export type DeleteSecretResponse = z.infer<typeof DeleteSecretResponseSchema>;

// Batch 4 Custom Operations
const DeleteWebsiteConnectorInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteWebsiteConnectorInput = z.infer<
	typeof DeleteWebsiteConnectorInputSchema
>;

const DeleteWebsiteConnectorResponseSchema = z.void();
export type DeleteWebsiteConnectorResponse = z.infer<
	typeof DeleteWebsiteConnectorResponseSchema
>;

const DownloadModifiedDocumentInputSchema = z
	.object({
		documentId: z.string(),
	})
	.loose();
export type DownloadModifiedDocumentInput = z.infer<
	typeof DownloadModifiedDocumentInputSchema
>;

const DownloadModifiedDocumentResponseSchema = z.string();
export type DownloadModifiedDocumentResponse = z.infer<
	typeof DownloadModifiedDocumentResponseSchema
>;

const GenerateRequirementsInputSchema = z
	.object({
		input: z.string(),
	})
	.loose();
export type GenerateRequirementsInput = z.infer<
	typeof GenerateRequirementsInputSchema
>;

const GenerateRequirementsResponseSchema = z
	.object({
		requirements: z.array(z.string()),
	})
	.loose();
export type GenerateRequirementsResponse = z.infer<
	typeof GenerateRequirementsResponseSchema
>;

const GenerateThreadNameInputSchema = z
	.object({
		context: z.string(),
	})
	.loose();
export type GenerateThreadNameInput = z.infer<
	typeof GenerateThreadNameInputSchema
>;

const GenerateThreadNameResponseSchema = z
	.object({
		name: z.string(),
	})
	.loose();
export type GenerateThreadNameResponse = z.infer<
	typeof GenerateThreadNameResponseSchema
>;

const GetAssistantInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetAssistantInput = z.infer<typeof GetAssistantInputSchema>;

const GetAssistantResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		model: z.string().optional(),
		instructions: z.string().optional(),
	})
	.loose();
export type GetAssistantResponse = z.infer<typeof GetAssistantResponseSchema>;

// Batch 5 Custom Operations
const GetAssistantRouteInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetAssistantRouteInput = z.infer<
	typeof GetAssistantRouteInputSchema
>;

const GetAssistantRouteResponseSchema = z
	.object({
		id: z.string(),
		route: z.string(),
		destination: z.string(),
	})
	.loose();
export type GetAssistantRouteResponse = z.infer<
	typeof GetAssistantRouteResponseSchema
>;

const GetAssistantsByMcpInputSchema = z
	.object({
		mcpId: z.string(),
	})
	.loose();
export type GetAssistantsByMcpInput = z.infer<
	typeof GetAssistantsByMcpInputSchema
>;

const GetAssistantsByMcpResponseSchema = z
	.object({
		assistants: z.array(z.any()),
	})
	.loose();
export type GetAssistantsByMcpResponse = z.infer<
	typeof GetAssistantsByMcpResponseSchema
>;

const GetBatchPredictionStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetBatchPredictionStatusInput = z.infer<
	typeof GetBatchPredictionStatusInputSchema
>;

const GetBatchPredictionStatusResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type GetBatchPredictionStatusResponse = z.infer<
	typeof GetBatchPredictionStatusResponseSchema
>;

const GetDemoInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetDemoInput = z.infer<typeof GetDemoInputSchema>;

const GetDemoResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.loose();
export type GetDemoResponse = z.infer<typeof GetDemoResponseSchema>;

const GetLibraryBatchStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetLibraryBatchStatusInput = z.infer<
	typeof GetLibraryBatchStatusInputSchema
>;

const GetLibraryBatchStatusResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type GetLibraryBatchStatusResponse = z.infer<
	typeof GetLibraryBatchStatusResponseSchema
>;

// Batch 6 Custom Operations
const GetMcpStorageInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetMcpStorageInput = z.infer<typeof GetMcpStorageInputSchema>;

const GetMcpStorageResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		data: z.record(z.any()),
	})
	.loose();
export type GetMcpStorageResponse = z.infer<typeof GetMcpStorageResponseSchema>;

const GetOutputExplanationInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetOutputExplanationInput = z.infer<
	typeof GetOutputExplanationInputSchema
>;

const GetOutputExplanationResponseSchema = z
	.object({
		explanation: z.string(),
	})
	.loose();
export type GetOutputExplanationResponse = z.infer<
	typeof GetOutputExplanationResponseSchema
>;

const GetPlanInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetPlanInput = z.infer<typeof GetPlanInputSchema>;

const GetPlanResponseSchema = z
	.object({
		id: z.string(),
		plan: z.string(),
		config: z.record(z.any()).optional(),
	})
	.loose();
export type GetPlanResponse = z.infer<typeof GetPlanResponseSchema>;

const GetWebsiteConnectorByIdInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetWebsiteConnectorByIdInput = z.infer<
	typeof GetWebsiteConnectorByIdInputSchema
>;

const GetWebsiteConnectorByIdResponseSchema = z
	.object({
		id: z.string(),
		url: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type GetWebsiteConnectorByIdResponse = z.infer<
	typeof GetWebsiteConnectorByIdResponseSchema
>;

const GetWebsiteConnectorStatusInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type GetWebsiteConnectorStatusInput = z.infer<
	typeof GetWebsiteConnectorStatusInputSchema
>;

const GetWebsiteConnectorStatusResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type GetWebsiteConnectorStatusResponse = z.infer<
	typeof GetWebsiteConnectorStatusResponseSchema
>;

// Batch 7 Custom Operations
const GetWebsiteConnectorUrlStatusInputSchema = z
	.object({
		id: z.string(),
		urlId: z.string(),
	})
	.loose();
export type GetWebsiteConnectorUrlStatusInput = z.infer<
	typeof GetWebsiteConnectorUrlStatusInputSchema
>;

const GetWebsiteConnectorUrlStatusResponseSchema = z
	.object({
		id: z.string(),
		urlId: z.string(),
		status: z.string(),
	})
	.loose();
export type GetWebsiteConnectorUrlStatusResponse = z.infer<
	typeof GetWebsiteConnectorUrlStatusResponseSchema
>;

const GrantKirshMetadataInputSchema = z
	.object({
		grantId: z.string(),
		metadata: z.record(z.any()),
	})
	.loose();
export type GrantKirshMetadataInput = z.infer<
	typeof GrantKirshMetadataInputSchema
>;

const GrantKirshMetadataResponseSchema = z
	.object({
		status: z.string(),
	})
	.loose();
export type GrantKirshMetadataResponse = z.infer<
	typeof GrantKirshMetadataResponseSchema
>;

const IngestWebsiteConnectorInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type IngestWebsiteConnectorInput = z.infer<
	typeof IngestWebsiteConnectorInputSchema
>;

const IngestWebsiteConnectorResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type IngestWebsiteConnectorResponse = z.infer<
	typeof IngestWebsiteConnectorResponseSchema
>;

const IngestWebsiteConnectorUrlInputSchema = z
	.object({
		id: z.string(),
		urlId: z.string(),
	})
	.loose();
export type IngestWebsiteConnectorUrlInput = z.infer<
	typeof IngestWebsiteConnectorUrlInputSchema
>;

const IngestWebsiteConnectorUrlResponseSchema = z
	.object({
		id: z.string(),
		urlId: z.string(),
		status: z.string(),
	})
	.loose();
export type IngestWebsiteConnectorUrlResponse = z.infer<
	typeof IngestWebsiteConnectorUrlResponseSchema
>;

const KirshGrantMetadataPreviewInputSchema = z
	.object({
		grantId: z.string(),
		previewData: z.string(),
	})
	.loose();
export type KirshGrantMetadataPreviewInput = z.infer<
	typeof KirshGrantMetadataPreviewInputSchema
>;

const KirshGrantMetadataPreviewResponseSchema = z
	.object({
		previewId: z.string(),
		status: z.string(),
	})
	.loose();
export type KirshGrantMetadataPreviewResponse = z.infer<
	typeof KirshGrantMetadataPreviewResponseSchema
>;

// Batch 8 Custom Operations
const ListAssistantsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();
export type ListAssistantsInput = z.infer<typeof ListAssistantsInputSchema>;

const ListAssistantsResponseSchema = z
	.object({
		assistants: z.array(z.any()),
	})
	.loose();
export type ListAssistantsResponse = z.infer<
	typeof ListAssistantsResponseSchema
>;

const ListAvailableModelsInputSchema = z.object({}).loose();
export type ListAvailableModelsInput = z.infer<
	typeof ListAvailableModelsInputSchema
>;

const ListAvailableModelsResponseSchema = z
	.object({
		models: z.array(z.any()),
	})
	.loose();
export type ListAvailableModelsResponse = z.infer<
	typeof ListAvailableModelsResponseSchema
>;

const ListDemosInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();
export type ListDemosInput = z.infer<typeof ListDemosInputSchema>;

const ListDemosResponseSchema = z
	.object({
		demos: z.array(z.any()),
	})
	.loose();
export type ListDemosResponse = z.infer<typeof ListDemosResponseSchema>;

const ListMcpStorageInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();
export type ListMcpStorageInput = z.infer<typeof ListMcpStorageInputSchema>;

const ListMcpStorageResponseSchema = z
	.object({
		storage: z.array(z.any()),
	})
	.loose();
export type ListMcpStorageResponse = z.infer<
	typeof ListMcpStorageResponseSchema
>;

const ListModelsInputSchema = z.object({}).loose();
export type ListModelsInput = z.infer<typeof ListModelsInputSchema>;

const ListModelsResponseSchema = z
	.object({
		models: z.array(z.any()),
	})
	.loose();
export type ListModelsResponse = z.infer<typeof ListModelsResponseSchema>;

// Batch 9 Custom Operations
const ListPlansInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();
export type ListPlansInput = z.infer<typeof ListPlansInputSchema>;

const ListPlansResponseSchema = z
	.object({
		plans: z.array(z.any()),
	})
	.loose();
export type ListPlansResponse = z.infer<typeof ListPlansResponseSchema>;

const ListSecretsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();
export type ListSecretsInput = z.infer<typeof ListSecretsInputSchema>;

const ListSecretsResponseSchema = z
	.object({
		secrets: z.array(z.any()),
	})
	.loose();
export type ListSecretsResponse = z.infer<typeof ListSecretsResponseSchema>;

const ListWebsiteConnectorsInputSchema = z
	.object({
		limit: z.number().optional(),
		offset: z.number().optional(),
	})
	.loose();
export type ListWebsiteConnectorsInput = z.infer<
	typeof ListWebsiteConnectorsInputSchema
>;

const ListWebsiteConnectorsResponseSchema = z
	.object({
		connectors: z.array(z.any()),
	})
	.loose();
export type ListWebsiteConnectorsResponse = z.infer<
	typeof ListWebsiteConnectorsResponseSchema
>;

const ListWorkspaceModelsInputSchema = z.object({}).loose();
export type ListWorkspaceModelsInput = z.infer<
	typeof ListWorkspaceModelsInputSchema
>;

const ListWorkspaceModelsResponseSchema = z
	.object({
		models: z.array(z.any()),
	})
	.loose();
export type ListWorkspaceModelsResponse = z.infer<
	typeof ListWorkspaceModelsResponseSchema
>;

const ModifyAssistantInputSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		model: z.string().optional(),
		instructions: z.string().optional(),
	})
	.loose();
export type ModifyAssistantInput = z.infer<typeof ModifyAssistantInputSchema>;

const ModifyAssistantResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		model: z.string().optional(),
		instructions: z.string().optional(),
	})
	.loose();
export type ModifyAssistantResponse = z.infer<
	typeof ModifyAssistantResponseSchema
>;

// Batch 10 Custom Operations
const ModifyAssistantPlanInputSchema = z
	.object({
		id: z.string(),
		plan: z.string().optional(),
		config: z.record(z.any()).optional(),
	})
	.loose();
export type ModifyAssistantPlanInput = z.infer<
	typeof ModifyAssistantPlanInputSchema
>;

const ModifyAssistantPlanResponseSchema = z
	.object({
		id: z.string(),
		plan: z.string(),
		config: z.record(z.any()).optional(),
	})
	.loose();
export type ModifyAssistantPlanResponse = z.infer<
	typeof ModifyAssistantPlanResponseSchema
>;

const ModifyAssistantRouteInputSchema = z
	.object({
		id: z.string(),
		route: z.string().optional(),
		destination: z.string().optional(),
	})
	.loose();
export type ModifyAssistantRouteInput = z.infer<
	typeof ModifyAssistantRouteInputSchema
>;

const ModifyAssistantRouteResponseSchema = z
	.object({
		id: z.string(),
		route: z.string(),
		destination: z.string(),
	})
	.loose();
export type ModifyAssistantRouteResponse = z.infer<
	typeof ModifyAssistantRouteResponseSchema
>;

const RetryIngestWebsiteInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type RetryIngestWebsiteInput = z.infer<
	typeof RetryIngestWebsiteInputSchema
>;

const RetryIngestWebsiteResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type RetryIngestWebsiteResponse = z.infer<
	typeof RetryIngestWebsiteResponseSchema
>;

const RunAssistantInputSchema = z
	.object({
		id: z.string(),
		input: z.string(),
	})
	.loose();
export type RunAssistantInput = z.infer<typeof RunAssistantInputSchema>;

const RunAssistantResponseSchema = z
	.object({
		id: z.string(),
		output: z.string(),
	})
	.loose();
export type RunAssistantResponse = z.infer<typeof RunAssistantResponseSchema>;

const SyncWebsiteConnectorInputSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type SyncWebsiteConnectorInput = z.infer<
	typeof SyncWebsiteConnectorInputSchema
>;

const SyncWebsiteConnectorResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type SyncWebsiteConnectorResponse = z.infer<
	typeof SyncWebsiteConnectorResponseSchema
>;

// Batch 11 Custom Operations
const UpdateDemoInputSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		content: z.string().optional(),
	})
	.loose();
export type UpdateDemoInput = z.infer<typeof UpdateDemoInputSchema>;

const UpdateDemoResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		content: z.string().optional(),
	})
	.loose();
export type UpdateDemoResponse = z.infer<typeof UpdateDemoResponseSchema>;

const UpdateMcpStorageInputSchema = z
	.object({
		id: z.string(),
		data: z.record(z.any()).optional(),
	})
	.loose();
export type UpdateMcpStorageInput = z.infer<typeof UpdateMcpStorageInputSchema>;

const UpdateMcpStorageResponseSchema = z
	.object({
		id: z.string(),
		data: z.record(z.any()),
	})
	.loose();
export type UpdateMcpStorageResponse = z.infer<
	typeof UpdateMcpStorageResponseSchema
>;

const UpdateSecretInputSchema = z
	.object({
		id: z.string(),
		value: z.string(),
	})
	.loose();
export type UpdateSecretInput = z.infer<typeof UpdateSecretInputSchema>;

const UpdateSecretResponseSchema = z
	.object({
		id: z.string(),
		status: z.string(),
	})
	.loose();
export type UpdateSecretResponse = z.infer<typeof UpdateSecretResponseSchema>;

const ValidatePlanInputSchema = z
	.object({
		plan: z.string(),
	})
	.loose();
export type ValidatePlanInput = z.infer<typeof ValidatePlanInputSchema>;

const ValidatePlanResponseSchema = z
	.object({
		isValid: z.boolean(),
		errors: z.array(z.any()).optional(),
	})
	.loose();
export type ValidatePlanResponse = z.infer<typeof ValidatePlanResponseSchema>;

export type StudioByAI21LabsEndpointInputs = {
	exampleGet: ExampleGetInput;
	chatCompletions: ChatCompletionsInput;
	listLibraryFiles: ListLibraryFilesInput;
	uploadWorkspaceFile: UploadWorkspaceFileInput;
	getWorkspaceFile: GetWorkspaceFileInput;
	updateFile: UpdateFileInput;
	deleteFile: DeleteFileInput;
	getFileDownloadLink: GetFileDownloadLinkInput;
	checkCanIframe: CheckCanIframeInput;
	checkKirshGrantCompliance: CheckKirshGrantComplianceInput;
	compareText: CompareTextInput;
	createAftersalesPartsBatch: CreateAftersalesPartsBatchInput;
	createAssistant: CreateAssistantInput;
	createAssistantPlan: CreateAssistantPlanInput;
	createAssistantRoute: CreateAssistantRouteInput;
	createDemo: CreateDemoInput;
	createKirshGrantCompliancePreview: CreateKirshGrantCompliancePreviewInput;
	createMcpStorage: CreateMcpStorageInput;
	deleteAssistant: DeleteAssistantInput;
	deleteAssistantRoute: DeleteAssistantRouteInput;
	deleteDemo: DeleteDemoInput;
	deleteMcpStorage: DeleteMcpStorageInput;
	deleteSecret: DeleteSecretInput;
	deleteWebsiteConnector: DeleteWebsiteConnectorInput;
	downloadModifiedDocument: DownloadModifiedDocumentInput;
	generateRequirements: GenerateRequirementsInput;
	generateThreadName: GenerateThreadNameInput;
	getAssistant: GetAssistantInput;
	getAssistantRoute: GetAssistantRouteInput;
	getAssistantsByMcp: GetAssistantsByMcpInput;
	getBatchPredictionStatus: GetBatchPredictionStatusInput;
	getDemo: GetDemoInput;
	getLibraryBatchStatus: GetLibraryBatchStatusInput;
	getMcpStorage: GetMcpStorageInput;
	getOutputExplanation: GetOutputExplanationInput;
	getPlan: GetPlanInput;
	getWebsiteConnectorById: GetWebsiteConnectorByIdInput;
	getWebsiteConnectorStatus: GetWebsiteConnectorStatusInput;
	getWebsiteConnectorUrlStatus: GetWebsiteConnectorUrlStatusInput;
	grantKirshMetadata: GrantKirshMetadataInput;
	ingestWebsiteConnector: IngestWebsiteConnectorInput;
	ingestWebsiteConnectorUrl: IngestWebsiteConnectorUrlInput;
	kirshGrantMetadataPreview: KirshGrantMetadataPreviewInput;
	listAssistants: ListAssistantsInput;
	listAvailableModels: ListAvailableModelsInput;
	listDemos: ListDemosInput;
	listMcpStorage: ListMcpStorageInput;
	listModels: ListModelsInput;
	listPlans: ListPlansInput;
	listSecrets: ListSecretsInput;
	listWebsiteConnectors: ListWebsiteConnectorsInput;
	listWorkspaceModels: ListWorkspaceModelsInput;
	modifyAssistant: ModifyAssistantInput;
	modifyAssistantPlan: ModifyAssistantPlanInput;
	modifyAssistantRoute: ModifyAssistantRouteInput;
	retryIngestWebsite: RetryIngestWebsiteInput;
	runAssistant: RunAssistantInput;
	syncWebsiteConnector: SyncWebsiteConnectorInput;
	updateDemo: UpdateDemoInput;
	updateMcpStorage: UpdateMcpStorageInput;
	updateSecret: UpdateSecretInput;
	validatePlan: ValidatePlanInput;
};

export type StudioByAI21LabsEndpointOutputs = {
	exampleGet: ExampleGetResponse;
	chatCompletions: ChatCompletionsResponse;
	listLibraryFiles: ListLibraryFilesResponse;
	uploadWorkspaceFile: UploadWorkspaceFileResponse;
	getWorkspaceFile: GetWorkspaceFileResponse;
	updateFile: UpdateFileResponse;
	deleteFile: DeleteFileResponse;
	getFileDownloadLink: GetFileDownloadLinkResponse;
	checkCanIframe: CheckCanIframeResponse;
	checkKirshGrantCompliance: CheckKirshGrantComplianceResponse;
	compareText: CompareTextResponse;
	createAftersalesPartsBatch: CreateAftersalesPartsBatchResponse;
	createAssistant: CreateAssistantResponse;
	createAssistantPlan: CreateAssistantPlanResponse;
	createAssistantRoute: CreateAssistantRouteResponse;
	createDemo: CreateDemoResponse;
	createKirshGrantCompliancePreview: CreateKirshGrantCompliancePreviewResponse;
	createMcpStorage: CreateMcpStorageResponse;
	deleteAssistant: DeleteAssistantResponse;
	deleteAssistantRoute: DeleteAssistantRouteResponse;
	deleteDemo: DeleteDemoResponse;
	deleteMcpStorage: DeleteMcpStorageResponse;
	deleteSecret: DeleteSecretResponse;
	deleteWebsiteConnector: DeleteWebsiteConnectorResponse;
	downloadModifiedDocument: DownloadModifiedDocumentResponse;
	generateRequirements: GenerateRequirementsResponse;
	generateThreadName: GenerateThreadNameResponse;
	getAssistant: GetAssistantResponse;
	getAssistantRoute: GetAssistantRouteResponse;
	getAssistantsByMcp: GetAssistantsByMcpResponse;
	getBatchPredictionStatus: GetBatchPredictionStatusResponse;
	getDemo: GetDemoResponse;
	getLibraryBatchStatus: GetLibraryBatchStatusResponse;
	getMcpStorage: GetMcpStorageResponse;
	getOutputExplanation: GetOutputExplanationResponse;
	getPlan: GetPlanResponse;
	getWebsiteConnectorById: GetWebsiteConnectorByIdResponse;
	getWebsiteConnectorStatus: GetWebsiteConnectorStatusResponse;
	getWebsiteConnectorUrlStatus: GetWebsiteConnectorUrlStatusResponse;
	grantKirshMetadata: GrantKirshMetadataResponse;
	ingestWebsiteConnector: IngestWebsiteConnectorResponse;
	ingestWebsiteConnectorUrl: IngestWebsiteConnectorUrlResponse;
	kirshGrantMetadataPreview: KirshGrantMetadataPreviewResponse;
	listAssistants: ListAssistantsResponse;
	listAvailableModels: ListAvailableModelsResponse;
	listDemos: ListDemosResponse;
	listMcpStorage: ListMcpStorageResponse;
	listModels: ListModelsResponse;
	listPlans: ListPlansResponse;
	listSecrets: ListSecretsResponse;
	listWebsiteConnectors: ListWebsiteConnectorsResponse;
	listWorkspaceModels: ListWorkspaceModelsResponse;
	modifyAssistant: ModifyAssistantResponse;
	modifyAssistantPlan: ModifyAssistantPlanResponse;
	modifyAssistantRoute: ModifyAssistantRouteResponse;
	retryIngestWebsite: RetryIngestWebsiteResponse;
	runAssistant: RunAssistantResponse;
	syncWebsiteConnector: SyncWebsiteConnectorResponse;
	updateDemo: UpdateDemoResponse;
	updateMcpStorage: UpdateMcpStorageResponse;
	updateSecret: UpdateSecretResponse;
	validatePlan: ValidatePlanResponse;
};

export const StudioByAI21LabsEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
	chatCompletions: ChatCompletionsInputSchema,
	listLibraryFiles: ListLibraryFilesInputSchema,
	uploadWorkspaceFile: UploadWorkspaceFileInputSchema,
	getWorkspaceFile: GetWorkspaceFileInputSchema,
	updateFile: UpdateFileInputSchema,
	deleteFile: DeleteFileInputSchema,
	getFileDownloadLink: GetFileDownloadLinkInputSchema,
	checkCanIframe: CheckCanIframeInputSchema,
	checkKirshGrantCompliance: CheckKirshGrantComplianceInputSchema,
	compareText: CompareTextInputSchema,
	createAftersalesPartsBatch: CreateAftersalesPartsBatchInputSchema,
	createAssistant: CreateAssistantInputSchema,
	createAssistantPlan: CreateAssistantPlanInputSchema,
	createAssistantRoute: CreateAssistantRouteInputSchema,
	createDemo: CreateDemoInputSchema,
	createKirshGrantCompliancePreview:
		CreateKirshGrantCompliancePreviewInputSchema,
	createMcpStorage: CreateMcpStorageInputSchema,
	deleteAssistant: DeleteAssistantInputSchema,
	deleteAssistantRoute: DeleteAssistantRouteInputSchema,
	deleteDemo: DeleteDemoInputSchema,
	deleteMcpStorage: DeleteMcpStorageInputSchema,
	deleteSecret: DeleteSecretInputSchema,
	deleteWebsiteConnector: DeleteWebsiteConnectorInputSchema,
	downloadModifiedDocument: DownloadModifiedDocumentInputSchema,
	generateRequirements: GenerateRequirementsInputSchema,
	generateThreadName: GenerateThreadNameInputSchema,
	getAssistant: GetAssistantInputSchema,
	getAssistantRoute: GetAssistantRouteInputSchema,
	getAssistantsByMcp: GetAssistantsByMcpInputSchema,
	getBatchPredictionStatus: GetBatchPredictionStatusInputSchema,
	getDemo: GetDemoInputSchema,
	getLibraryBatchStatus: GetLibraryBatchStatusInputSchema,
	getMcpStorage: GetMcpStorageInputSchema,
	getOutputExplanation: GetOutputExplanationInputSchema,
	getPlan: GetPlanInputSchema,
	getWebsiteConnectorById: GetWebsiteConnectorByIdInputSchema,
	getWebsiteConnectorStatus: GetWebsiteConnectorStatusInputSchema,
	getWebsiteConnectorUrlStatus: GetWebsiteConnectorUrlStatusInputSchema,
	grantKirshMetadata: GrantKirshMetadataInputSchema,
	ingestWebsiteConnector: IngestWebsiteConnectorInputSchema,
	ingestWebsiteConnectorUrl: IngestWebsiteConnectorUrlInputSchema,
	kirshGrantMetadataPreview: KirshGrantMetadataPreviewInputSchema,
	listAssistants: ListAssistantsInputSchema,
	listAvailableModels: ListAvailableModelsInputSchema,
	listDemos: ListDemosInputSchema,
	listMcpStorage: ListMcpStorageInputSchema,
	listModels: ListModelsInputSchema,
	listPlans: ListPlansInputSchema,
	listSecrets: ListSecretsInputSchema,
	listWebsiteConnectors: ListWebsiteConnectorsInputSchema,
	listWorkspaceModels: ListWorkspaceModelsInputSchema,
	modifyAssistant: ModifyAssistantInputSchema,
	modifyAssistantPlan: ModifyAssistantPlanInputSchema,
	modifyAssistantRoute: ModifyAssistantRouteInputSchema,
	retryIngestWebsite: RetryIngestWebsiteInputSchema,
	runAssistant: RunAssistantInputSchema,
	syncWebsiteConnector: SyncWebsiteConnectorInputSchema,
	updateDemo: UpdateDemoInputSchema,
	updateMcpStorage: UpdateMcpStorageInputSchema,
	updateSecret: UpdateSecretInputSchema,
	validatePlan: ValidatePlanInputSchema,
} as const;

export const StudioByAI21LabsEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
	chatCompletions: ChatCompletionsResponseSchema,
	listLibraryFiles: ListLibraryFilesResponseSchema,
	uploadWorkspaceFile: UploadWorkspaceFileResponseSchema,
	getWorkspaceFile: GetWorkspaceFileResponseSchema,
	updateFile: UpdateFileResponseSchema,
	deleteFile: DeleteFileResponseSchema,
	getFileDownloadLink: GetFileDownloadLinkResponseSchema,
	checkCanIframe: CheckCanIframeResponseSchema,
	checkKirshGrantCompliance: CheckKirshGrantComplianceResponseSchema,
	compareText: CompareTextResponseSchema,
	createAftersalesPartsBatch: CreateAftersalesPartsBatchResponseSchema,
	createAssistant: CreateAssistantResponseSchema,
	createAssistantPlan: CreateAssistantPlanResponseSchema,
	createAssistantRoute: CreateAssistantRouteResponseSchema,
	createDemo: CreateDemoResponseSchema,
	createKirshGrantCompliancePreview:
		CreateKirshGrantCompliancePreviewResponseSchema,
	createMcpStorage: CreateMcpStorageResponseSchema,
	deleteAssistant: DeleteAssistantResponseSchema,
	deleteAssistantRoute: DeleteAssistantRouteResponseSchema,
	deleteDemo: DeleteDemoResponseSchema,
	deleteMcpStorage: DeleteMcpStorageResponseSchema,
	deleteSecret: DeleteSecretResponseSchema,
	deleteWebsiteConnector: DeleteWebsiteConnectorResponseSchema,
	downloadModifiedDocument: DownloadModifiedDocumentResponseSchema,
	generateRequirements: GenerateRequirementsResponseSchema,
	generateThreadName: GenerateThreadNameResponseSchema,
	getAssistant: GetAssistantResponseSchema,
	getAssistantRoute: GetAssistantRouteResponseSchema,
	getAssistantsByMcp: GetAssistantsByMcpResponseSchema,
	getBatchPredictionStatus: GetBatchPredictionStatusResponseSchema,
	getDemo: GetDemoResponseSchema,
	getLibraryBatchStatus: GetLibraryBatchStatusResponseSchema,
	getMcpStorage: GetMcpStorageResponseSchema,
	getOutputExplanation: GetOutputExplanationResponseSchema,
	getPlan: GetPlanResponseSchema,
	getWebsiteConnectorById: GetWebsiteConnectorByIdResponseSchema,
	getWebsiteConnectorStatus: GetWebsiteConnectorStatusResponseSchema,
	getWebsiteConnectorUrlStatus: GetWebsiteConnectorUrlStatusResponseSchema,
	grantKirshMetadata: GrantKirshMetadataResponseSchema,
	ingestWebsiteConnector: IngestWebsiteConnectorResponseSchema,
	ingestWebsiteConnectorUrl: IngestWebsiteConnectorUrlResponseSchema,
	kirshGrantMetadataPreview: KirshGrantMetadataPreviewResponseSchema,
	listAssistants: ListAssistantsResponseSchema,
	listAvailableModels: ListAvailableModelsResponseSchema,
	listDemos: ListDemosResponseSchema,
	listMcpStorage: ListMcpStorageResponseSchema,
	listModels: ListModelsResponseSchema,
	listPlans: ListPlansResponseSchema,
	listSecrets: ListSecretsResponseSchema,
	listWebsiteConnectors: ListWebsiteConnectorsResponseSchema,
	listWorkspaceModels: ListWorkspaceModelsResponseSchema,
	modifyAssistant: ModifyAssistantResponseSchema,
	modifyAssistantPlan: ModifyAssistantPlanResponseSchema,
	modifyAssistantRoute: ModifyAssistantRouteResponseSchema,
	retryIngestWebsite: RetryIngestWebsiteResponseSchema,
	runAssistant: RunAssistantResponseSchema,
	syncWebsiteConnector: SyncWebsiteConnectorResponseSchema,
	updateDemo: UpdateDemoResponseSchema,
	updateMcpStorage: UpdateMcpStorageResponseSchema,
	updateSecret: UpdateSecretResponseSchema,
	validatePlan: ValidatePlanResponseSchema,
} as const;
