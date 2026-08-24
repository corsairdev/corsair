import { z } from 'zod';

/** Simple success response for delete operations */
const DeleteSuccessSchema = z.object({ success: z.boolean() });
export type DeleteSuccess = z.infer<typeof DeleteSuccessSchema>;

/**
 * Template Card - lightweight template object for listing
 */
export const DocumentTemplateCardSchema = z.object({
	id: z.string(),
	app_id: z.string(),
	identifier: z.string().optional(),
	edition_mode: z.enum(['code', 'builder']).optional(),
	output_type: z.enum(['pdf', 'image']).optional(),
	is_draft: z.boolean().optional(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type DocumentTemplateCard = z.infer<typeof DocumentTemplateCardSchema>;

/** Input for listing template cards */
export const ListTemplateCardsInputSchema = z.object({
	q_workspace_id: z.string(),
	q_folders: z.string().optional(),
	page: z.number().int().positive().default(1),
	sort: z.string().optional(),
});

export type ListTemplateCardsInput = z.infer<
	typeof ListTemplateCardsInputSchema
>;

export const ListTemplateCardsOutputSchema = z.object({
	document_template_cards: z.array(DocumentTemplateCardSchema),
	meta: z
		.object({
			page: z.number().int().positive(),
			total: z.number().int().positive(),
			totalPages: z.number().int().positive(),
		})
		.optional(),
});

export type ListTemplateCardsOutput = z.infer<
	typeof ListTemplateCardsOutputSchema
>;

/** Input for getting a single template */
export const GetTemplateInputSchema = z.object({
	id: z.string(),
});

export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;

export const GetTemplateOutputSchema = z.object({
	document_template: z.object({
		id: z.string(),
		app_id: z.string(),
		identifier: z.string().optional(),
		body: z.string().optional(),
		body_draft: z.string().optional(),
		scss_style: z.string().optional(),
		scss_style_draft: z.string().optional(),
		sample_data: z.string().optional(),
		sample_data_draft: z.string().optional(),
		settings: z.any().optional(),
		settings_draft: z.any().optional(),
		pdf_engine_id: z.string().nullable().optional(),
		pdf_engine_draft_id: z.string().nullable().optional(),
		template_folder_id: z.string().nullable().optional(),
		template_folder_identifier: z.string().optional(),
		ttl: z.number().int().nullable().optional(),
		edition_mode: z.enum(['code', 'builder']).optional(),
		output_type: z.enum(['pdf', 'image']).optional(),
		created_at: z.string(),
		updated_at: z.string(),
	}),
});

export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

/** Input for creating a template */
export const CreateTemplateInputSchema = z.object({
	document_template: z.object({
		app_id: z.string(),
		identifier: z.string(),
		body: z.string(),
		body_draft: z.string().optional(),
		scss_style: z.string().optional(),
		scss_style_draft: z.string().optional(),
		sample_data: z.string().optional(),
		sample_data_draft: z.string().optional(),
		settings: z.any().optional(),
		settings_draft: z.any().optional(),
		pdf_engine_id: z.string().optional(),
		pdf_engine_draft_id: z.string().optional(),
		template_folder_id: z.string().optional(),
		ttl: z.number().int().nullable().optional(),
		edition_mode: z.enum(['code', 'builder']).optional().default('code'),
		output_type: z.enum(['pdf', 'image']).optional().default('pdf'),
	}),
});

export type CreateTemplateInput = z.infer<typeof CreateTemplateInputSchema>;

export const CreateTemplateOutputSchema = z.object({
	document_template: z.object({
		id: z.string(),
	}),
});

export type CreateTemplateOutput = z.infer<typeof CreateTemplateOutputSchema>;

/** Input for updating a template */
export const UpdateTemplateInputSchema = z.object({
	document_template_id: z.string(),
	document_template: z
		.object({
			identifier: z.string().optional(),
			body: z.string().optional(),
			body_draft: z.string().optional(),
			scss_style: z.string().optional(),
			scss_style_draft: z.string().optional(),
			sample_data: z.string().optional(),
			sample_data_draft: z.string().optional(),
			settings: z.any().optional(),
			settings_draft: z.any().optional(),
			pdf_engine_id: z.string().optional(),
			pdf_engine_draft_id: z.string().optional(),
			template_folder_id: z.string().optional(),
			ttl: z.number().int().nullable().optional(),
			edition_mode: z.enum(['code', 'builder']).optional(),
			output_type: z.enum(['pdf', 'image']).optional(),
		})
		.optional(),
});

export type UpdateTemplateInput = z.infer<typeof UpdateTemplateInputSchema>;

export const UpdateTemplateOutputSchema = z.object({
	document_template: z.object({
		id: z.string(),
	}),
});

export type UpdateTemplateOutput = z.infer<typeof UpdateTemplateOutputSchema>;

/** Input for deleting a template */
export const DeleteTemplateInputSchema = z.object({
	id: z.string(),
});

export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;

/**
 * Document Card - lightweight document object for listing/status
 */
export const DocumentCardSchema = z.object({
	id: z.string(),
	app_id: z.string(),
	document_template_identifier: z.string().optional(),
	status: z.enum(['draft', 'pending', 'generating', 'success', 'failure']),
	download_url: z.string().url().nullable(),
	preview_url: z.string().url().nullable(),
	public_share_link: z.string().url().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type DocumentCard = z.infer<typeof DocumentCardSchema>;

/** Full Document object */
export const DocumentSchema = z.object({
	id: z.string(),
	app_id: z.string(),
	document_template_id: z.string(),
	document_template_identifier: z.string().optional(),
	status: z.enum(['draft', 'pending', 'generating', 'success', 'failure']),
	payload: z.any().nullable(),
	meta: z.any().nullable(),
	filename: z.string().nullable(),
	download_url: z.string().url().nullable(),
	preview_url: z.string().url().nullable(),
	public_share_link: z.string().url().nullable(),
	checksum: z.string().nullable(),
	generation_logs: z.array(z.any()).optional(),
	failure_cause: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type Document = z.infer<typeof DocumentSchema>;

/** DocumentCreateRequest - nested under "document" key in API */
export const DocumentCreateRequestSchema = z.object({
	document: z.object({
		document_template_id: z.string(),
		status: z.enum(['draft', 'pending']).optional(),
		payload: z.any().optional(),
		meta: z.any().optional(),
	}),
});

export type DocumentCreateRequest = z.infer<typeof DocumentCreateRequestSchema>;

/** DocumentCreateResponse - the full Document response */
export const DocumentCreateResponseSchema = DocumentSchema;

export type DocumentCreateResponse = z.infer<
	typeof DocumentCreateResponseSchema
>;

/** Document sync response (same as create, waits for generation) */
export const DocumentSyncResponseSchema = DocumentSchema;

export type DocumentSyncResponse = z.infer<typeof DocumentSyncResponseSchema>;

/** Input for creating a document */
export const CreateDocumentInputSchema = DocumentCreateRequestSchema;

export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;

/** Input for getting a document card */
export const GetDocumentCardInputSchema = z.object({
	id: z.string(),
});

export type GetDocumentCardInput = z.infer<typeof GetDocumentCardInputSchema>;

/** Input for listing document cards */
export const ListDocumentCardsInputSchema = z.object({
	page: z.number().int().positive().default(1),
	q_document_template_id: z.string().optional(),
	q_status: z
		.enum(['draft', 'pending', 'generating', 'success', 'failure'])
		.optional(),
	q_workspace_id: z.string().optional(),
	q_updated_since: z.string().optional(),
	q_search: z.string().optional(),
});

export type ListDocumentCardsInput = z.infer<
	typeof ListDocumentCardsInputSchema
>;

export const ListDocumentCardsOutputSchema = z.object({
	document_cards: z.array(DocumentCardSchema),
	meta: z
		.object({
			page: z.number().int().positive(),
			total: z.number().int().positive(),
			totalPages: z.number().int().positive(),
		})
		.optional(),
});

export type ListDocumentCardsOutput = z.infer<
	typeof ListDocumentCardsOutputSchema
>;

/** Input for getting a full document */
export const GetDocumentInputSchema = z.object({
	id: z.string(),
});

export type GetDocumentInput = z.infer<typeof GetDocumentInputSchema>;

/** Input for updating a document */
export const UpdateDocumentInputSchema = z.object({
	document_id: z.string(),
	document: z
		.object({
			document_template_id: z.string().optional(),
			status: z.enum(['draft', 'pending']).optional(),
			payload: z.any().optional(),
			meta: z.any().optional(),
		})
		.optional(),
});

export type UpdateDocumentInput = z.infer<typeof UpdateDocumentInputSchema>;

export const UpdateDocumentOutputSchema = DocumentCreateResponseSchema;

export type UpdateDocumentOutput = z.infer<typeof UpdateDocumentOutputSchema>;

/** Input for deleting a document */
export const DeleteDocumentInputSchema = z.object({
	id: z.string(),
});

export type DeleteDocumentInput = z.infer<typeof DeleteDocumentInputSchema>;

/**
 * PDFMonkey Endpoint Input/Output Schemas
 */

export type PDFMonkeyEndpointInputs = {
	listTemplateCards: ListTemplateCardsInput;
	getTemplate: GetTemplateInput;
	createTemplate: CreateTemplateInput;
	updateTemplate: UpdateTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	createDocument: CreateDocumentInput;
	createDocumentSync: CreateDocumentInput;
	getDocumentCard: GetDocumentCardInput;
	listDocumentCards: ListDocumentCardsInput;
	getDocument: GetDocumentInput;
	updateDocument: UpdateDocumentInput;
	deleteDocument: DeleteDocumentInput;
};

export type PDFMonkeyEndpointOutputs = {
	listTemplateCards: ListTemplateCardsOutput;
	getTemplate: GetTemplateOutput;
	createTemplate: CreateTemplateOutput;
	updateTemplate: UpdateTemplateOutput;
	deleteTemplate: DeleteSuccess;
	createDocument: DocumentCreateResponse;
	createDocumentSync: DocumentSyncResponse;
	getDocumentCard: DocumentCard;
	listDocumentCards: ListDocumentCardsOutput;
	getDocument: Document;
	updateDocument: Document;
	deleteDocument: DeleteSuccess;
};

/** Input schemas map, used for endpoint schema registration */
export const PDFMonkeyEndpointInputSchemas = {
	listTemplateCards: ListTemplateCardsInputSchema,
	getTemplate: GetTemplateInputSchema,
	createTemplate: CreateTemplateInputSchema,
	updateTemplate: UpdateTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	createDocument: DocumentCreateRequestSchema,
	createDocumentSync: DocumentCreateRequestSchema,
	getDocumentCard: GetDocumentCardInputSchema,
	listDocumentCards: ListDocumentCardsInputSchema,
	getDocument: GetDocumentInputSchema,
	updateDocument: UpdateDocumentInputSchema,
	deleteDocument: DeleteDocumentInputSchema,
} as const;

/** Output schemas map, used for endpoint schema registration */
export const PDFMonkeyEndpointOutputSchemas = {
	listTemplateCards: ListTemplateCardsOutputSchema,
	getTemplate: GetTemplateOutputSchema,
	createTemplate: CreateTemplateOutputSchema,
	updateTemplate: UpdateTemplateOutputSchema,
	deleteTemplate: DeleteSuccessSchema,
	createDocument: DocumentCreateResponseSchema,
	createDocumentSync: DocumentSyncResponseSchema,
	getDocumentCard: DocumentCardSchema,
	listDocumentCards: ListDocumentCardsOutputSchema,
	getDocument: DocumentSchema,
	updateDocument: DocumentSchema,
	deleteDocument: DeleteSuccessSchema,
} as const;
