import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared JSON model
// ─────────────────────────────────────────────────────────────────────────────
// Extraction/classification result payloads are provider-defined per document,
// so they are validated structurally with a recursive JSON schema instead of
// `unknown` fields or type assertions.

export type ExtractaJsonObject = {
	[key: string]: ExtractaJsonValue | undefined;
};

export type ExtractaJsonValue =
	| string
	| number
	| boolean
	| null
	| Array<ExtractaJsonValue>
	| ExtractaJsonObject;

export const ExtractaJsonValueSchema: z.ZodType<ExtractaJsonValue> = z.lazy(
	() =>
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null(),
			z.array(ExtractaJsonValueSchema),
			z.record(z.string(), ExtractaJsonValueSchema),
		]),
);

// ─────────────────────────────────────────────────────────────────────────────
// Shared extraction building blocks (docs: extraction-details/options, fields)
// ─────────────────────────────────────────────────────────────────────────────

export const ExtractionOptionsSchema = z
	.object({
		hasTable: z.boolean().optional(),
		hasVisuals: z.boolean().optional(),
		handwrittenTextRecognition: z.boolean().optional(),
		checkboxRecognition: z.boolean().optional(),
		longDocument: z.boolean().optional(),
		splitPdfPages: z.boolean().optional(),
		specificPageProcessing: z.boolean().optional(),
		specificPageProcessingOptions: z
			.object({
				from: z.number().int().min(1),
				to: z.number().int().min(1),
			})
			.optional(),
	})
	.refine(
		(options) =>
			options.specificPageProcessing !== true ||
			options.specificPageProcessingOptions !== undefined,
		{
			message:
				'specificPageProcessingOptions is required when specificPageProcessing is true',
			path: ['specificPageProcessingOptions'],
		},
	);

export type ExtractionOptions = z.infer<typeof ExtractionOptionsSchema>;

export type ExtractionFieldItems = {
	type: 'string' | 'object';
	example?: string;
	properties?: Array<ExtractionField>;
};

export type ExtractionField = {
	key: string;
	description?: string;
	example?: string;
	type?: 'string' | 'object' | 'array';
	properties?: Array<ExtractionField>;
	items?: ExtractionFieldItems;
};

const ExtractionFieldItemsSchema: z.ZodType<ExtractionFieldItems> = z.object({
	type: z.enum(['string', 'object']),
	example: z.string().optional(),
	properties: z
		.array(z.lazy((): z.ZodType<ExtractionField> => ExtractionFieldSchema))
		.optional(),
});

export const ExtractionFieldSchema: z.ZodType<ExtractionField> = z.object({
	key: z.string().min(1),
	description: z.string().optional(),
	example: z.string().optional(),
	type: z.enum(['string', 'object', 'array']).optional(),
	properties: z
		.array(z.lazy((): z.ZodType<ExtractionField> => ExtractionFieldSchema))
		.optional(),
	items: ExtractionFieldItemsSchema.optional(),
});

const ExtractionBatchSchema = z.object({
	filesNo: z.number().optional(),
	origin: z.string().optional(),
	startTime: z.union([z.string(), z.number()]).optional(),
	status: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Shared classification building blocks (docs: classification-details)
// ─────────────────────────────────────────────────────────────────────────────

export const DocumentTypeSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	uniqueWords: z.array(z.string().min(1)).min(1),
	extractionId: z.string().min(1).optional(),
});

export type DocumentType = z.infer<typeof DocumentTypeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_CREATE_EXTRACTION — POST /createExtraction
// ─────────────────────────────────────────────────────────────────────────────

const CreateExtractionInputSchema = z.object({
	extractionDetails: z.object({
		name: z.string().min(1),
		description: z.string().optional(),
		language: z.string().min(1),
		options: ExtractionOptionsSchema.optional(),
		fields: z.array(ExtractionFieldSchema).min(1),
	}),
});

export type CreateExtractionInput = z.infer<typeof CreateExtractionInputSchema>;

const CreateExtractionResponseSchema = z.object({
	status: z.literal('created'),
	createdAt: z.number(),
	extractionId: z.string().min(1),
});

export type CreateExtractionResponse = z.infer<
	typeof CreateExtractionResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_VIEW_EXTRACTION — POST /viewExtraction
// ─────────────────────────────────────────────────────────────────────────────

const ViewExtractionInputSchema = z.object({
	extractionId: z.string().min(1),
});

export type ViewExtractionInput = z.infer<typeof ViewExtractionInputSchema>;

const ViewExtractionResponseSchema = z.object({
	extractionId: z.string(),
	extractionDetails: z.object({
		name: z.string(),
		description: z.string().optional(),
		language: z.string(),
		options: ExtractionOptionsSchema.optional(),
		fields: z.array(ExtractionFieldSchema),
		status: z.string().optional(),
		batches: z.record(z.string(), ExtractionBatchSchema).optional(),
	}),
});

export type ViewExtractionResponse = z.infer<
	typeof ViewExtractionResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_UPDATE_EXTRACTION — PATCH /updateExtraction
// ─────────────────────────────────────────────────────────────────────────────

const UpdateExtractionInputSchema = z.object({
	extractionId: z.string().min(1),
	extractionDetails: z
		.object({
			name: z.string().min(1).optional(),
			description: z.string().optional(),
			language: z.string().min(1).optional(),
			options: ExtractionOptionsSchema.optional(),
			fields: z.array(ExtractionFieldSchema).min(1).optional(),
		})
		.refine(
			(details) => Object.keys(details).length > 0,
			'At least one extractionDetails field must be provided',
		),
});

export type UpdateExtractionInput = z.infer<typeof UpdateExtractionInputSchema>;

const UpdateExtractionResponseSchema = z.object({
	status: z.literal('updated'),
	updatedAt: z.number(),
	extractionId: z.string().min(1),
});

export type UpdateExtractionResponse = z.infer<
	typeof UpdateExtractionResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_DELETE_EXTRACTION — DELETE /deleteExtraction
// ─────────────────────────────────────────────────────────────────────────────

const DeleteExtractionInputSchema = z
	.object({
		extractionId: z.string().min(1),
		batchId: z.string().min(1).optional(),
		fileId: z.string().min(1).optional(),
	})
	.refine(
		(input) => input.fileId === undefined || input.batchId !== undefined,
		{
			message: 'batchId is required when fileId is provided',
			path: ['batchId'],
		},
	);

export type DeleteExtractionInput = z.infer<typeof DeleteExtractionInputSchema>;

const DeleteExtractionResponseSchema = z.object({
	status: z.literal('deleted'),
	deletedAt: z.number(),
});

export type DeleteExtractionResponse = z.infer<
	typeof DeleteExtractionResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_GET_BATCH_RESULTS — POST /getBatchResults
// ─────────────────────────────────────────────────────────────────────────────

const GetBatchResultsInputSchema = z.object({
	extractionId: z.string().min(1),
	batchId: z.string().min(1),
	fileId: z.string().min(1).optional(),
});

export type GetBatchResultsInput = z.infer<typeof GetBatchResultsInputSchema>;

const ExtractionResultFileSchema = z.object({
	fileId: z.string().optional(),
	fileName: z.string().optional(),
	status: z.string(),
	result: ExtractaJsonValueSchema.optional(),
	url: z.string().optional(),
});

const GetBatchResultsWaitingSchema = z.object({
	status: z.literal('waiting'),
	extractionId: z.string().optional(),
	batchId: z.string().optional(),
	fileId: z.string().optional(),
});

const GetBatchResultsCompletedSchema = z.object({
	extractionId: z.string(),
	batchId: z.string(),
	fileId: z.string().optional(),
	files: z.array(ExtractionResultFileSchema),
});

const GetBatchResultsResponseSchema = z.union([
	GetBatchResultsWaitingSchema,
	GetBatchResultsCompletedSchema,
]);

export type GetBatchResultsResponse = z.infer<
	typeof GetBatchResultsResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_GET_CREDITS — GET /credits
// ─────────────────────────────────────────────────────────────────────────────

const GetCreditsInputSchema = z.object({});

export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

const GetCreditsResponseSchema = z.object({
	status: z.literal('ok'),
	credits: z.number(),
});

export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_CREATE_CLASSIFICATION
// POST /documentClassification/createClassification
// ─────────────────────────────────────────────────────────────────────────────

const CreateClassificationInputSchema = z.object({
	classificationDetails: z.object({
		name: z.string().min(1),
		description: z.string().optional(),
		documentTypes: z.array(DocumentTypeSchema).min(1),
	}),
});

export type CreateClassificationInput = z.infer<
	typeof CreateClassificationInputSchema
>;

const CreateClassificationResponseSchema = z.object({
	status: z.literal('created'),
	createdAt: z.number(),
	classificationId: z.string().min(1),
});

export type CreateClassificationResponse = z.infer<
	typeof CreateClassificationResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_VIEW_CLASSIFICATION
// POST /documentClassification/viewClassification
// ─────────────────────────────────────────────────────────────────────────────

const ViewClassificationInputSchema = z.object({
	classificationId: z.string().min(1),
});

export type ViewClassificationInput = z.infer<
	typeof ViewClassificationInputSchema
>;

const ViewClassificationResponseSchema = z.object({
	status: z.literal('success'),
	classificationId: z.string(),
	classificationDetails: z.object({
		createdAt: z.number().optional(),
		name: z.string(),
		description: z.string().optional(),
		documentTypes: z.array(DocumentTypeSchema),
	}),
});

export type ViewClassificationResponse = z.infer<
	typeof ViewClassificationResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_UPDATE_CLASSIFICATION
// PATCH /documentClassification/updateClassification
// ─────────────────────────────────────────────────────────────────────────────

const UpdateClassificationInputSchema = z.object({
	classificationId: z.string().min(1),
	classificationDetails: z.object({
		name: z.string().min(1),
		description: z.string().min(1),
		documentTypes: z.array(DocumentTypeSchema).min(1),
	}),
});

export type UpdateClassificationInput = z.infer<
	typeof UpdateClassificationInputSchema
>;

const UpdateClassificationResponseSchema = z.object({
	status: z.literal('updated'),
	updatedAt: z.number(),
	classificationId: z.string().min(1),
});

export type UpdateClassificationResponse = z.infer<
	typeof UpdateClassificationResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTA_AI_DELETE_CLASSIFICATION
// DELETE /documentClassification/deleteClassification
// ─────────────────────────────────────────────────────────────────────────────

const DeleteClassificationInputSchema = z.object({
	classificationId: z.string().min(1),
});

export type DeleteClassificationInput = z.infer<
	typeof DeleteClassificationInputSchema
>;

const DeleteClassificationResponseSchema = z.object({
	status: z.string().min(1),
	message: z.string().optional(),
});

export type DeleteClassificationResponse = z.infer<
	typeof DeleteClassificationResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint registry
// ─────────────────────────────────────────────────────────────────────────────

export type ExtractaaiEndpointInputs = {
	extractionCreate: CreateExtractionInput;
	extractionView: ViewExtractionInput;
	extractionUpdate: UpdateExtractionInput;
	extractionDelete: DeleteExtractionInput;
	extractionGetBatchResults: GetBatchResultsInput;
	creditsGet: GetCreditsInput;
	classificationCreate: CreateClassificationInput;
	classificationView: ViewClassificationInput;
	classificationUpdate: UpdateClassificationInput;
	classificationDelete: DeleteClassificationInput;
};

export type ExtractaaiEndpointOutputs = {
	extractionCreate: CreateExtractionResponse;
	extractionView: ViewExtractionResponse;
	extractionUpdate: UpdateExtractionResponse;
	extractionDelete: DeleteExtractionResponse;
	extractionGetBatchResults: GetBatchResultsResponse;
	creditsGet: GetCreditsResponse;
	classificationCreate: CreateClassificationResponse;
	classificationView: ViewClassificationResponse;
	classificationUpdate: UpdateClassificationResponse;
	classificationDelete: DeleteClassificationResponse;
};

export const ExtractaaiEndpointInputSchemas = {
	extractionCreate: CreateExtractionInputSchema,
	extractionView: ViewExtractionInputSchema,
	extractionUpdate: UpdateExtractionInputSchema,
	extractionDelete: DeleteExtractionInputSchema,
	extractionGetBatchResults: GetBatchResultsInputSchema,
	creditsGet: GetCreditsInputSchema,
	classificationCreate: CreateClassificationInputSchema,
	classificationView: ViewClassificationInputSchema,
	classificationUpdate: UpdateClassificationInputSchema,
	classificationDelete: DeleteClassificationInputSchema,
};

export const ExtractaaiEndpointOutputSchemas = {
	extractionCreate: CreateExtractionResponseSchema,
	extractionView: ViewExtractionResponseSchema,
	extractionUpdate: UpdateExtractionResponseSchema,
	extractionDelete: DeleteExtractionResponseSchema,
	extractionGetBatchResults: GetBatchResultsResponseSchema,
	creditsGet: GetCreditsResponseSchema,
	classificationCreate: CreateClassificationResponseSchema,
	classificationView: ViewClassificationResponseSchema,
	classificationUpdate: UpdateClassificationResponseSchema,
	classificationDelete: DeleteClassificationResponseSchema,
};
