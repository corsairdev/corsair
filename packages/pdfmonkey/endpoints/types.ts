import { z } from 'zod';

const DeleteSuccessSchema = z.object({ success: z.boolean() });
export type DeleteSuccess = z.infer<typeof DeleteSuccessSchema>;

const JsonValueSchema = z.unknown();

export const PaginationMetaSchema = z.object({
	current_page: z.number().int().nonnegative(),
	next_page: z.number().int().nullable(),
	prev_page: z.number().int().nullable(),
	total_pages: z.number().int().nonnegative(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

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

export const DocumentTemplateSchema = z.object({
	id: z.string(),
	app_id: z.string(),
	identifier: z.string().optional(),
	body: z.string().optional(),
	body_draft: z.string().optional(),
	scss_style: z.string().optional(),
	scss_style_draft: z.string().optional(),
	sample_data: z.string().optional(),
	sample_data_draft: z.string().optional(),
	settings: JsonValueSchema.optional(),
	settings_draft: JsonValueSchema.optional(),
	pdf_engine_id: z.string().nullable().optional(),
	pdf_engine_draft_id: z.string().nullable().optional(),
	template_folder_id: z.string().nullable().optional(),
	template_folder_identifier: z.string().optional(),
	ttl: z.number().int().nullable().optional(),
	edition_mode: z.enum(['code', 'builder']).optional(),
	output_type: z.enum(['pdf', 'image']).optional(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type DocumentTemplate = z.infer<typeof DocumentTemplateSchema>;

export const ListTemplateCardsInputSchema = z.object({
	page: z.number().int().positive().default(1),
	q: z.object({
		workspace_id: z.string(),
		folders: z.string().optional(),
	}),
	sort: z.string().optional(),
});

export type ListTemplateCardsInput = z.input<
	typeof ListTemplateCardsInputSchema
>;

export const ListTemplateCardsOutputSchema = z.object({
	document_template_cards: z.array(DocumentTemplateCardSchema),
	meta: PaginationMetaSchema.optional(),
});

export type ListTemplateCardsOutput = z.infer<
	typeof ListTemplateCardsOutputSchema
>;

export const GetTemplateInputSchema = z.object({
	id: z.string(),
});

export type GetTemplateInput = z.input<typeof GetTemplateInputSchema>;

export const GetTemplateOutputSchema = z.object({
	document_template: DocumentTemplateSchema,
});

export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

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
		settings: JsonValueSchema.optional(),
		settings_draft: JsonValueSchema.optional(),
		pdf_engine_id: z.string().optional(),
		pdf_engine_draft_id: z.string().optional(),
		template_folder_id: z.string().optional(),
		ttl: z.number().int().nullable().optional(),
		edition_mode: z.enum(['code', 'builder']).optional().default('code'),
		output_type: z.enum(['pdf', 'image']).optional().default('pdf'),
	}),
});

export type CreateTemplateInput = z.input<typeof CreateTemplateInputSchema>;

export const CreateTemplateOutputSchema = z.object({
	document_template: z.object({
		id: z.string(),
	}),
});

export type CreateTemplateOutput = z.infer<typeof CreateTemplateOutputSchema>;

export const UpdateTemplateInputSchema = z.object({
	document_template_id: z.string(),
	document_template: z.object({
		identifier: z.string().optional(),
		body: z.string().optional(),
		body_draft: z.string().optional(),
		scss_style: z.string().optional(),
		scss_style_draft: z.string().optional(),
		sample_data: z.string().optional(),
		sample_data_draft: z.string().optional(),
		settings: JsonValueSchema.optional(),
		settings_draft: JsonValueSchema.optional(),
		pdf_engine_id: z.string().optional(),
		pdf_engine_draft_id: z.string().optional(),
		template_folder_id: z.string().optional(),
		ttl: z.number().int().nullable().optional(),
		edition_mode: z.enum(['code', 'builder']).optional(),
		output_type: z.enum(['pdf', 'image']).optional(),
	}),
});

export type UpdateTemplateInput = z.input<typeof UpdateTemplateInputSchema>;

export const UpdateTemplateOutputSchema = CreateTemplateOutputSchema;

export type UpdateTemplateOutput = z.infer<typeof UpdateTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z.object({
	id: z.string(),
});

export type DeleteTemplateInput = z.input<typeof DeleteTemplateInputSchema>;

export const DocumentCardSchema = z.object({
	id: z.string(),
	app_id: z.string(),
	document_template_id: z.string().optional(),
	document_template_identifier: z.string().optional(),
	status: z.enum(['draft', 'pending', 'generating', 'success', 'failure']),
	filename: z.string().nullable().optional(),
	download_url: z.url().nullable().optional(),
	preview_url: z.url().nullable().optional(),
	public_share_link: z.url().nullable().optional(),
	failure_cause: z.string().nullable().optional(),
	meta: JsonValueSchema.nullable().optional(),
	output_type: z.enum(['pdf', 'image']).optional(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type DocumentCard = z.infer<typeof DocumentCardSchema>;

export const DocumentSchema = z.object({
	id: z.string(),
	app_id: z.string(),
	document_template_id: z.string(),
	document_template_identifier: z.string().optional(),
	status: z.enum(['draft', 'pending', 'generating', 'success', 'failure']),
	payload: JsonValueSchema.nullable(),
	meta: JsonValueSchema.nullable(),
	filename: z.string().nullable(),
	download_url: z.url().nullable(),
	preview_url: z.url().nullable(),
	public_share_link: z.url().nullable(),
	checksum: z.string().nullable(),
	generation_logs: z.array(JsonValueSchema).optional(),
	failure_cause: z.string().nullable(),
	output_type: z.enum(['pdf', 'image']).optional(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type Document = z.infer<typeof DocumentSchema>;

export const DocumentResponseSchema = z.object({
	document: DocumentSchema,
});

export type DocumentResponse = z.infer<typeof DocumentResponseSchema>;

export const DocumentCardResponseSchema = z.object({
	document_card: DocumentCardSchema,
});

export type DocumentCardResponse = z.infer<typeof DocumentCardResponseSchema>;

export const DocumentCreateRequestSchema = z.object({
	document: z.object({
		document_template_id: z.string(),
		status: z.enum(['draft', 'pending']).optional(),
		payload: JsonValueSchema.optional(),
		meta: JsonValueSchema.optional(),
	}),
});

export type DocumentCreateRequest = z.infer<typeof DocumentCreateRequestSchema>;

export const CreateDocumentInputSchema = DocumentCreateRequestSchema;

export type CreateDocumentInput = z.input<typeof CreateDocumentInputSchema>;

export const CreateDocumentSyncInputSchema = z.object({
	document: z.object({
		document_template_id: z.string(),
		status: z.enum(['draft', 'pending']).optional().default('pending'),
		payload: JsonValueSchema.optional(),
		meta: JsonValueSchema.optional(),
	}),
});

export type CreateDocumentSyncInput = z.input<
	typeof CreateDocumentSyncInputSchema
>;

export const GetDocumentCardInputSchema = z.object({
	id: z.string(),
});

export type GetDocumentCardInput = z.input<typeof GetDocumentCardInputSchema>;

export const ListDocumentCardsInputSchema = z.object({
	page: z.number().int().positive().default(1),
	q: z
		.object({
			document_template_id: z.string().optional(),
			status: z
				.enum(['draft', 'pending', 'generating', 'success', 'failure'])
				.optional(),
			workspace_id: z.string().optional(),
			updated_since: z.string().optional(),
			search: z.string().optional(),
		})
		.optional(),
});

export type ListDocumentCardsInput = z.input<
	typeof ListDocumentCardsInputSchema
>;

export const ListDocumentCardsOutputSchema = z.object({
	document_cards: z.array(DocumentCardSchema),
	meta: PaginationMetaSchema.optional(),
});

export type ListDocumentCardsOutput = z.infer<
	typeof ListDocumentCardsOutputSchema
>;

export const GetDocumentInputSchema = z.object({
	id: z.string(),
});

export type GetDocumentInput = z.input<typeof GetDocumentInputSchema>;

export const UpdateDocumentInputSchema = z.object({
	document_id: z.string(),
	document: z.object({
		document_template_id: z.string().optional(),
		status: z.enum(['draft', 'pending']).optional(),
		payload: JsonValueSchema.optional(),
		meta: JsonValueSchema.optional(),
	}),
});

export type UpdateDocumentInput = z.input<typeof UpdateDocumentInputSchema>;

export const DeleteDocumentInputSchema = z.object({
	id: z.string(),
});

export type DeleteDocumentInput = z.input<typeof DeleteDocumentInputSchema>;

export type PDFMonkeyEndpointInputs = {
	listTemplateCards: ListTemplateCardsInput;
	getTemplate: GetTemplateInput;
	createTemplate: CreateTemplateInput;
	updateTemplate: UpdateTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	createDocument: CreateDocumentInput;
	createDocumentSync: CreateDocumentSyncInput;
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
	createDocument: Document;
	createDocumentSync: DocumentCard;
	getDocumentCard: DocumentCard;
	listDocumentCards: ListDocumentCardsOutput;
	getDocument: Document;
	updateDocument: Document;
	deleteDocument: DeleteSuccess;
};

export const PDFMonkeyEndpointInputSchemas = {
	listTemplateCards: ListTemplateCardsInputSchema,
	getTemplate: GetTemplateInputSchema,
	createTemplate: CreateTemplateInputSchema,
	updateTemplate: UpdateTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	createDocument: CreateDocumentInputSchema,
	createDocumentSync: CreateDocumentSyncInputSchema,
	getDocumentCard: GetDocumentCardInputSchema,
	listDocumentCards: ListDocumentCardsInputSchema,
	getDocument: GetDocumentInputSchema,
	updateDocument: UpdateDocumentInputSchema,
	deleteDocument: DeleteDocumentInputSchema,
} as const;

export const PDFMonkeyEndpointOutputSchemas = {
	listTemplateCards: ListTemplateCardsOutputSchema,
	getTemplate: GetTemplateOutputSchema,
	createTemplate: CreateTemplateOutputSchema,
	updateTemplate: UpdateTemplateOutputSchema,
	deleteTemplate: DeleteSuccessSchema,
	createDocument: DocumentSchema,
	createDocumentSync: DocumentCardSchema,
	getDocumentCard: DocumentCardSchema,
	listDocumentCards: ListDocumentCardsOutputSchema,
	getDocument: DocumentSchema,
	updateDocument: DocumentSchema,
	deleteDocument: DeleteSuccessSchema,
} as const;
