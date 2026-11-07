import { z } from 'zod';

// Inputs use Nanonets's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Nanonets adds, omits or nulls cannot
// fail a call that has already happened. Field reference:
// https://docs.nanonets.com/reference/overview

const ModelIdSchema = z.string().min(1).describe('The Nanonets model ID.');

const FileIdSchema = z.string().min(1).describe('The Nanonets file ID.');

const ScoreSchema = z.union([z.string(), z.number()]).nullish();

// ── shared output pieces ───────────────────────────────────────────────────

const BoxSchema = z
	.object({
		id: z.string().nullish(),
		label: z.string().nullish(),
		xmin: z.number().nullish(),
		ymin: z.number().nullish(),
		xmax: z.number().nullish(),
		ymax: z.number().nullish(),
		score: ScoreSchema,
		ocr_text: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		validation_status: z.string().nullish(),
		validation_message: z.string().nullish(),
		page: z.union([z.number(), z.string()]).nullish(),
		page_no: z.number().nullish(),
		label_id: z.string().nullish(),
		verification_status: z.string().nullish(),
		failed_validation: z.boolean().nullish(),
		row: z.number().nullish(),
		col: z.number().nullish(),
		row_span: z.number().nullish(),
		col_span: z.number().nullish(),
		text: z.string().nullish(),
		lookup_edited: z.boolean().nullish(),
		lookup_parent_box_ids: z.array(z.string()).nullish(),
		is_new: z.boolean().nullish(),
		// unknown: table cells repeat this box shape.
		cells: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type NanonetsBox = z.infer<typeof BoxSchema>;

const SignedUrlsSchema = z
	.union([
		z.record(z.string(), z.record(z.string(), z.string())),
		// Files without signed URLs have been seen answering [null].
		z.array(z.record(z.string(), z.string()).nullish()),
	])
	.nullish();

const PredictionPageSchema = z
	.object({
		message: z.string().nullish(),
		input: z.string().nullish(),
		prediction: z.array(BoxSchema).nullish(),
		predicted_boxes: z.array(BoxSchema).nullish(),
		moderated_boxes: z.array(BoxSchema).nullish(),
		// unknown: raw OCR fields vary by document and engine.
		raw_ocr: z.record(z.string(), z.unknown()).nullish(),
		page: z.union([z.number(), z.string()]).nullish(),
		request_file_id: z.string().nullish(),
		id: z.string().nullish(),
		is_moderated: z.boolean().nullish(),
		request_metadata: z.string().nullish(),
		processing_type: z.string().nullish(),
		size: z
			.object({
				width: z.number().nullish(),
				height: z.number().nullish(),
			})
			.loose()
			.nullish(),
		rotation: z.number().nullish(),
		file_url: z.string().nullish(),
		filepath: z.string().nullish(),
		approval_status: z.string().nullish(),
		export_status: z.string().nullish(),
		exported_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		verified_at: z.string().nullish(),
		verified_by: z.string().nullish(),
		current_stage_id: z.string().nullish(),
		uploaded_by: z.string().nullish(),
		upload_channel: z.string().nullish(),
		assigned_member: z.string().nullish(),
		assigned_members: z.array(z.string()).nullish(),
		no_of_fields: z.number().nullish(),
		original_file_name: z.string().nullish(),
		day_since_epoch: z.number().nullish(),
		url: z.string().nullish(),
		// unknown: file metadata flags vary by workflow configuration.
		file_metadata: z.record(z.string(), z.unknown()).nullish(),
		// unknown: the vendor OCR payload varies by engine.
		raw_ocr_api_response: z.unknown().nullish(),
	})
	.loose();

export type NanonetsPredictionPage = z.infer<typeof PredictionPageSchema>;

const PredictionEnvelopeSchema = z
	.object({
		message: z.string().nullish(),
		result: z.array(PredictionPageSchema).nullish(),
		signed_urls: SignedUrlsSchema,
	})
	.loose();

const ModelObjectSchema = z
	.object({
		model_id: z.string().nullish(),
		model_type: z.string().nullish(),
		state: z.union([z.string(), z.number()]).nullish(),
		message: z.string().nullish(),
	})
	.loose();

const PredictionFileSummarySchema = z
	.object({
		model_id: z.string().nullish(),
		day_since_epoch: z.number().nullish(),
		is_moderated: z.boolean().nullish(),
		id: z.string().nullish(),
		url: z.string().nullish(),
		predicted_boxes: z.array(BoxSchema).nullish(),
		moderated_boxes: z.array(BoxSchema).nullish(),
		size: z
			.object({
				width: z.number().nullish(),
				height: z.number().nullish(),
			})
			.loose()
			.nullish(),
		page: z.union([z.number(), z.string()]).nullish(),
		request_file_id: z.string().nullish(),
		original_file_name: z.string().nullish(),
		assigned_member: z.string().nullish(),
		assigned_members: z.array(z.string()).nullish(),
		no_of_fields: z.number().nullish(),
		export_status: z.string().nullish(),
		exported_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		verified_at: z.string().nullish(),
		verified_by: z.string().nullish(),
		current_stage_id: z.string().nullish(),
		uploaded_by: z.string().nullish(),
		upload_channel: z.string().nullish(),
		file_url: z.string().nullish(),
		request_metadata: z.string().nullish(),
		// unknown: raw OCR fields vary by document and engine.
		raw_ocr: z.record(z.string(), z.unknown()).nullish(),
		approval_status: z.string().nullish(),
		processing_type: z.string().nullish(),
	})
	.loose();

// Nanonets documents no response body for the workflow actions; whatever
// comes back is passed through.
// unknown: the undocumented action payloads vary per endpoint.
const WorkflowActionResponseSchema = z.record(z.string(), z.unknown());

// ── predictions.createFromFile ─────────────────────────────────────────────

const PredictionsCreateFromFileInputSchema = z.object({
	model_id: ModelIdSchema,
	base64_data: z
		.string()
		.min(1)
		.describe('Base64-encoded PNG or JPEG image to extract fields from.'),
	request_metadata: z
		.string()
		.min(1)
		.optional()
		.describe('Your identifier for the request, returned with the result.'),
	pages_to_process: z
		.string()
		.min(1)
		.optional()
		.describe('Comma-separated page numbers to process, e.g. "1,2".'),
	l: z
		.string()
		.min(1)
		.optional()
		.describe('ISO language code of the document; omit for best results.'),
	async: z
		.boolean()
		.optional()
		.describe(
			'Process asynchronously: returns pending with a request_file_id to poll. Recommended above 3 pages.',
		),
});

export type PredictionsCreateFromFileInput = z.input<
	typeof PredictionsCreateFromFileInputSchema
>;

const PredictionsCreateFromFileResponseSchema = PredictionEnvelopeSchema;

export type PredictionsCreateFromFileResponse = z.infer<
	typeof PredictionsCreateFromFileResponseSchema
>;

// ── predictions.createFromUrls ─────────────────────────────────────────────

const PredictionsCreateFromUrlsInputSchema = z.object({
	model_id: ModelIdSchema,
	urls: z
		.array(z.string().min(1))
		.min(1)
		.describe('Public image URLs to extract fields from.'),
	request_metadata: z
		.string()
		.min(1)
		.optional()
		.describe('Your identifier for the request, returned with the result.'),
	pages_to_process: z
		.string()
		.min(1)
		.optional()
		.describe('Comma-separated page numbers to process, e.g. "1,2".'),
	l: z
		.string()
		.min(1)
		.optional()
		.describe('ISO language code of the document; omit for best results.'),
	async: z
		.boolean()
		.optional()
		.describe(
			'Process asynchronously: returns pending with a request_file_id to poll.',
		),
});

export type PredictionsCreateFromUrlsInput = z.input<
	typeof PredictionsCreateFromUrlsInputSchema
>;

const PredictionsCreateFromUrlsResponseSchema = PredictionEnvelopeSchema;

export type PredictionsCreateFromUrlsResponse = z.infer<
	typeof PredictionsCreateFromUrlsResponseSchema
>;

// ── predictions.listFiles ──────────────────────────────────────────────────

const PredictionsListFilesInputSchema = z.object({
	model_id: ModelIdSchema,
	start_day_interval: z
		.number()
		.int()
		.describe('Window start as days since 1970-01-01 GMT.'),
	current_batch_day: z
		.number()
		.int()
		.describe('Window end as days since 1970-01-01 GMT.'),
});

export type PredictionsListFilesInput = z.input<
	typeof PredictionsListFilesInputSchema
>;

const PredictionsListFilesResponseSchema = z
	.object({
		moderated_images_count: z.number().nullish(),
		unmoderated_images_count: z.number().nullish(),
		moderated_images: z.array(PredictionFileSummarySchema).nullish(),
		unmoderated_images: z.array(PredictionFileSummarySchema).nullish(),
		signed_urls: SignedUrlsSchema,
	})
	.loose();

export type PredictionsListFilesResponse = z.infer<
	typeof PredictionsListFilesResponseSchema
>;

// ── predictions.getFileByPageId / getFileByFileId ──────────────────────────

const PredictionsGetFileByPageIdInputSchema = z.object({
	model_id: ModelIdSchema,
	id: z.string().min(1).describe('The page ID, from a list or async response.'),
});

export type PredictionsGetFileByPageIdInput = z.input<
	typeof PredictionsGetFileByPageIdInputSchema
>;

const PredictionsGetFileByPageIdResponseSchema = PredictionEnvelopeSchema;

export type PredictionsGetFileByPageIdResponse = z.infer<
	typeof PredictionsGetFileByPageIdResponseSchema
>;

const PredictionsGetFileByFileIdInputSchema = z.object({
	model_id: ModelIdSchema,
	request_file_id: FileIdSchema,
});

export type PredictionsGetFileByFileIdInput = z.input<
	typeof PredictionsGetFileByFileIdInputSchema
>;

const PredictionsGetFileByFileIdResponseSchema = PredictionEnvelopeSchema;

export type PredictionsGetFileByFileIdResponse = z.infer<
	typeof PredictionsGetFileByFileIdResponseSchema
>;

// ── models.uploadTrainingUrls ──────────────────────────────────────────────

const ModelsUploadTrainingUrlsInputSchema = z.object({
	model_id: ModelIdSchema,
	urls: z.array(z.string().min(1)).min(1).describe('Training image URLs.'),
});

export type ModelsUploadTrainingUrlsInput = z.input<
	typeof ModelsUploadTrainingUrlsInputSchema
>;

const ModelsUploadTrainingUrlsResponseSchema = ModelObjectSchema;

export type ModelsUploadTrainingUrlsResponse = z.infer<
	typeof ModelsUploadTrainingUrlsResponseSchema
>;

// ── models.train ───────────────────────────────────────────────────────────

const ModelsTrainInputSchema = z.object({
	model_id: ModelIdSchema,
});

export type ModelsTrainInput = z.input<typeof ModelsTrainInputSchema>;

const ModelsTrainResponseSchema = ModelObjectSchema;

export type ModelsTrainResponse = z.infer<typeof ModelsTrainResponseSchema>;

// ── models.updateGuidelines ────────────────────────────────────────────────

const ModelsUpdateGuidelinesInputSchema = z.object({
	model_id: ModelIdSchema,
	field_instructions: z
		.string()
		.min(1)
		.describe('Natural-language extraction instructions for fields.'),
	table_instructions: z
		.string()
		.min(1)
		.describe('Natural-language extraction instructions for tables.'),
	ai_guidelines: z
		.literal(true)
		.describe('Must be true to apply the guidelines.'),
});

export type ModelsUpdateGuidelinesInput = z.input<
	typeof ModelsUpdateGuidelinesInputSchema
>;

const ModelsUpdateGuidelinesResponseSchema = WorkflowActionResponseSchema;

export type ModelsUpdateGuidelinesResponse = z.infer<
	typeof ModelsUpdateGuidelinesResponseSchema
>;

// ── files.approve / files.unapprove ────────────────────────────────────────

const FilesApproveInputSchema = z.object({
	model_id: ModelIdSchema,
	request_file_id: FileIdSchema,
});

export type FilesApproveInput = z.input<typeof FilesApproveInputSchema>;

const FilesApproveResponseSchema = WorkflowActionResponseSchema;

export type FilesApproveResponse = z.infer<typeof FilesApproveResponseSchema>;

const FilesUnapproveInputSchema = z.object({
	model_id: ModelIdSchema,
	request_file_id: FileIdSchema,
});

export type FilesUnapproveInput = z.input<typeof FilesUnapproveInputSchema>;

const FilesUnapproveResponseSchema = WorkflowActionResponseSchema;

export type FilesUnapproveResponse = z.infer<
	typeof FilesUnapproveResponseSchema
>;

// ── files.delete ───────────────────────────────────────────────────────────

const FilesDeleteInputSchema = z.object({
	model_id: ModelIdSchema,
	file_id: FileIdSchema,
});

export type FilesDeleteInput = z.input<typeof FilesDeleteInputSchema>;

const FilesDeleteResponseSchema = WorkflowActionResponseSchema;

export type FilesDeleteResponse = z.infer<typeof FilesDeleteResponseSchema>;

// ── files.updateFields ─────────────────────────────────────────────────────

const FilesUpdateFieldsInputSchema = z.object({
	model_id: ModelIdSchema,
	moderated_boxes: z
		.array(BoxSchema)
		.describe(
			'The full field list: existing boxes unchanged, new boxes with is_new: true, any omitted field is deleted, and an empty array removes every field.',
		),
});

export type FilesUpdateFieldsInput = z.input<
	typeof FilesUpdateFieldsInputSchema
>;

const FilesUpdateFieldsResponseSchema = WorkflowActionResponseSchema;

export type FilesUpdateFieldsResponse = z.infer<
	typeof FilesUpdateFieldsResponseSchema
>;

// ── files.assign ───────────────────────────────────────────────────────────

const FilesAssignInputSchema = z.object({
	model_id: ModelIdSchema,
	member: z.string().min(1).describe('Team member email to assign to.'),
	file_ids: z.array(FileIdSchema).min(1).describe('File IDs to assign.'),
});

export type FilesAssignInput = z.input<typeof FilesAssignInputSchema>;

const FilesAssignResponseSchema = WorkflowActionResponseSchema;

export type FilesAssignResponse = z.infer<typeof FilesAssignResponseSchema>;

// ── files.retryExports ─────────────────────────────────────────────────────

const FilesRetryExportsInputSchema = z.object({
	model_id: ModelIdSchema,
	file_ids: z.array(FileIdSchema).min(1).describe('File IDs to re-export.'),
});

export type FilesRetryExportsInput = z.input<
	typeof FilesRetryExportsInputSchema
>;

const FilesRetryExportsResponseSchema = WorkflowActionResponseSchema;

export type FilesRetryExportsResponse = z.infer<
	typeof FilesRetryExportsResponseSchema
>;

// ── files.retryPredictions ─────────────────────────────────────────────────

const FilesRetryPredictionsInputSchema = z.object({
	model_id: ModelIdSchema,
	file_ids: z.array(FileIdSchema).min(1).describe('File IDs to re-run OCR on.'),
});

export type FilesRetryPredictionsInput = z.input<
	typeof FilesRetryPredictionsInputSchema
>;

const FilesRetryPredictionsResponseSchema = WorkflowActionResponseSchema;

export type FilesRetryPredictionsResponse = z.infer<
	typeof FilesRetryPredictionsResponseSchema
>;

// ── integrations.list ──────────────────────────────────────────────────────

const IntegrationsListInputSchema = z.object({});

export type IntegrationsListInput = z.input<typeof IntegrationsListInputSchema>;

const IntegrationSchema = z
	.object({
		id: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		// unknown: connection info varies by integration type and is masked.
		info: z.record(z.string(), z.unknown()).nullish(),
		status: z.string().nullish(),
		is_internal: z.boolean().nullish(),
	})
	.loose();

export type NanonetsIntegration = z.infer<typeof IntegrationSchema>;

const IntegrationsListResponseSchema = z.object({
	integrations: z.array(IntegrationSchema),
});

export type IntegrationsListResponse = z.infer<
	typeof IntegrationsListResponseSchema
>;

// ── integrations.executeQuery ──────────────────────────────────────────────

const IntegrationsExecuteQueryInputSchema = z.object({
	external_integration_id: z
		.string()
		.min(1)
		.describe('The integration to query, from integrations.list.'),
	query: z
		.string()
		.min(1)
		.describe(
			'SQL to run against the connected store; documented examples include UPDATE, which cannot be undone.',
		),
});

export type IntegrationsExecuteQueryInput = z.input<
	typeof IntegrationsExecuteQueryInputSchema
>;

const IntegrationsExecuteQueryResponseSchema = z.object({
	// unknown: row shape depends entirely on the query.
	rows: z.array(z.record(z.string(), z.unknown())),
});

export type IntegrationsExecuteQueryResponse = z.infer<
	typeof IntegrationsExecuteQueryResponseSchema
>;

// ── registry ───────────────────────────────────────────────────────────────

export type NanonetsEndpointInputs = {
	predictionsCreateFromFile: PredictionsCreateFromFileInput;
	predictionsCreateFromUrls: PredictionsCreateFromUrlsInput;
	predictionsListFiles: PredictionsListFilesInput;
	predictionsGetFileByPageId: PredictionsGetFileByPageIdInput;
	predictionsGetFileByFileId: PredictionsGetFileByFileIdInput;
	modelsUploadTrainingUrls: ModelsUploadTrainingUrlsInput;
	modelsTrain: ModelsTrainInput;
	modelsUpdateGuidelines: ModelsUpdateGuidelinesInput;
	filesApprove: FilesApproveInput;
	filesUnapprove: FilesUnapproveInput;
	filesDelete: FilesDeleteInput;
	filesUpdateFields: FilesUpdateFieldsInput;
	filesAssign: FilesAssignInput;
	filesRetryExports: FilesRetryExportsInput;
	filesRetryPredictions: FilesRetryPredictionsInput;
	integrationsList: IntegrationsListInput;
	integrationsExecuteQuery: IntegrationsExecuteQueryInput;
};

export type NanonetsEndpointOutputs = {
	predictionsCreateFromFile: PredictionsCreateFromFileResponse;
	predictionsCreateFromUrls: PredictionsCreateFromUrlsResponse;
	predictionsListFiles: PredictionsListFilesResponse;
	predictionsGetFileByPageId: PredictionsGetFileByPageIdResponse;
	predictionsGetFileByFileId: PredictionsGetFileByFileIdResponse;
	modelsUploadTrainingUrls: ModelsUploadTrainingUrlsResponse;
	modelsTrain: ModelsTrainResponse;
	modelsUpdateGuidelines: ModelsUpdateGuidelinesResponse;
	filesApprove: FilesApproveResponse;
	filesUnapprove: FilesUnapproveResponse;
	filesDelete: FilesDeleteResponse;
	filesUpdateFields: FilesUpdateFieldsResponse;
	filesAssign: FilesAssignResponse;
	filesRetryExports: FilesRetryExportsResponse;
	filesRetryPredictions: FilesRetryPredictionsResponse;
	integrationsList: IntegrationsListResponse;
	integrationsExecuteQuery: IntegrationsExecuteQueryResponse;
};

export const NanonetsEndpointInputSchemas = {
	predictionsCreateFromFile: PredictionsCreateFromFileInputSchema,
	predictionsCreateFromUrls: PredictionsCreateFromUrlsInputSchema,
	predictionsListFiles: PredictionsListFilesInputSchema,
	predictionsGetFileByPageId: PredictionsGetFileByPageIdInputSchema,
	predictionsGetFileByFileId: PredictionsGetFileByFileIdInputSchema,
	modelsUploadTrainingUrls: ModelsUploadTrainingUrlsInputSchema,
	modelsTrain: ModelsTrainInputSchema,
	modelsUpdateGuidelines: ModelsUpdateGuidelinesInputSchema,
	filesApprove: FilesApproveInputSchema,
	filesUnapprove: FilesUnapproveInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesUpdateFields: FilesUpdateFieldsInputSchema,
	filesAssign: FilesAssignInputSchema,
	filesRetryExports: FilesRetryExportsInputSchema,
	filesRetryPredictions: FilesRetryPredictionsInputSchema,
	integrationsList: IntegrationsListInputSchema,
	integrationsExecuteQuery: IntegrationsExecuteQueryInputSchema,
} as const;

export const NanonetsEndpointOutputSchemas = {
	predictionsCreateFromFile: PredictionsCreateFromFileResponseSchema,
	predictionsCreateFromUrls: PredictionsCreateFromUrlsResponseSchema,
	predictionsListFiles: PredictionsListFilesResponseSchema,
	predictionsGetFileByPageId: PredictionsGetFileByPageIdResponseSchema,
	predictionsGetFileByFileId: PredictionsGetFileByFileIdResponseSchema,
	modelsUploadTrainingUrls: ModelsUploadTrainingUrlsResponseSchema,
	modelsTrain: ModelsTrainResponseSchema,
	modelsUpdateGuidelines: ModelsUpdateGuidelinesResponseSchema,
	filesApprove: FilesApproveResponseSchema,
	filesUnapprove: FilesUnapproveResponseSchema,
	filesDelete: FilesDeleteResponseSchema,
	filesUpdateFields: FilesUpdateFieldsResponseSchema,
	filesAssign: FilesAssignResponseSchema,
	filesRetryExports: FilesRetryExportsResponseSchema,
	filesRetryPredictions: FilesRetryPredictionsResponseSchema,
	integrationsList: IntegrationsListResponseSchema,
	integrationsExecuteQuery: IntegrationsExecuteQueryResponseSchema,
} as const;
