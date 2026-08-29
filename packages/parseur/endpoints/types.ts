import { z } from 'zod';

export const DeleteSuccessSchema = z.object({
	success: z.boolean(),
});
export type DeleteSuccess = z.infer<typeof DeleteSuccessSchema>;

export const JsonValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.unknown()),
	z.record(z.string(), z.unknown()),
]);

// ── Enums from OpenAPI ────────────────────────────────────────────────────────
export const DocumentStatusEnumSchema = z.enum([
	'NEW',
	'PARSED',
	'MANUAL',
	'PROCESSED',
	'EXPORTED',
	'QUOTA_EXCEEDED',
	'TEMPLATE_MISSING',
	'FAILED',
	'SKIPPED',
	'DELETED',
	'IN_PROCESS',
]);
export type DocumentStatusEnum = z.infer<typeof DocumentStatusEnumSchema>;

export const AIEngineEnumSchema = z
	.enum(['DEFAULT', 'ADVANCED', 'GPT4', 'CLAUDE', 'CUSTOM'])
	.or(z.string());

export const DecimalSeparatorEnumSchema = z.enum(['.', ',']);

export const ParserFieldFormatEnumSchema = z
	.enum([
		'text',
		'number',
		'date',
		'time',
		'datetime',
		'boolean',
		'table',
		'json',
		'url',
		'email',
		'phone',
	])
	.or(z.string());

export const WebhookEventEnumSchema = z
	.enum([
		'document.processed',
		'table_item.processed',
		'document.created',
		'process.failed',
		'export.failed',
	])
	.or(z.string());

// ── Pagination Metadata ───────────────────────────────────────────────────────
export const PaginatedResponseMetaSchema = z.object({
	count: z.number().int().nonnegative(),
	current: z.number().int().optional(),
	total: z.number().int().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
});

// ── Common Models ─────────────────────────────────────────────────────────────
export const ParserFieldSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string(),
		format: ParserFieldFormatEnumSchema.optional(),
		order: z.number().int().optional(),
		is_required: z.boolean().optional(),
		description: z.string().optional(),
		created: z.string().optional(),
	})
	.passthrough();
export type ParserField = z.infer<typeof ParserFieldSchema>;

export const ParserSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		slug: z.string().optional(),
		description: z.string().nullable().optional(),
		ai_engine: AIEngineEnumSchema.optional(),
		retention_days: z.number().int().nullable().optional(),
		timezone: z.string().optional(),
		decimal_separator: DecimalSeparatorEnumSchema.optional(),
		input_date_format: z.string().nullable().optional(),
		disable_table_flattening: z.boolean().optional(),
		fields_order: z.array(z.string()).optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
		document_count: z.number().int().optional(),
		email: z.string().optional(),
	})
	.passthrough();
export type Parser = z.infer<typeof ParserSchema>;

export const DocumentLogSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		created: z.string().optional(),
		status: z.string().optional(),
		source: z.string().optional(),
		message: z.string().optional(),
		details: JsonValueSchema.optional(),
	})
	.passthrough();
export type DocumentLog = z.infer<typeof DocumentLogSchema>;

export const DocumentSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		parser: z.union([z.string(), z.number()]).optional(),
		status: DocumentStatusEnumSchema.or(z.string()).optional(),
		received: z.string().optional(),
		processed: z.string().nullable().optional(),
		ocr_ready_url: z.string().nullable().optional(),
		original_document_url: z.string().nullable().optional(),
		result: z.record(z.string(), z.unknown()).nullable().optional(),
		fields: z.record(z.string(), z.unknown()).nullable().optional(),
		attached_to: z.union([z.string(), z.number()]).nullable().optional(),
		sample_set: z.array(z.unknown()).optional(),
	})
	.passthrough();
export type Document = z.infer<typeof DocumentSchema>;

export const TemplateSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		parser: z.union([z.string(), z.number()]).optional(),
		status: z.string().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
		sample_set: z.array(z.unknown()).optional(),
		fields: z.array(z.unknown()).optional(),
	})
	.passthrough();
export type Template = z.infer<typeof TemplateSchema>;

export const ExportConfigSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		format: z.string().optional(),
		parser: z.union([z.string(), z.number()]).optional(),
		include_headers: z.boolean().optional(),
		all_fields: z.boolean().optional(),
		fields: z.array(z.string()).optional(),
		options: z.record(z.string(), z.unknown()).optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.passthrough();
export type ExportConfig = z.infer<typeof ExportConfigSchema>;

export const WebhookSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		target_url: z.string().url().optional().or(z.string()),
		url: z.string().optional(),
		event: WebhookEventEnumSchema.optional(),
		parser: z.union([z.string(), z.number()]).nullable().optional(),
		is_active: z.boolean().optional(),
		name: z.string().optional(),
		created: z.string().optional(),
		updated: z.string().optional(),
	})
	.passthrough();
export type Webhook = z.infer<typeof WebhookSchema>;

export const BootstrapSchema = z
	.object({
		user: z.record(z.string(), z.unknown()).optional(),
		account: z.record(z.string(), z.unknown()).optional(),
		mailboxes: z.array(ParserSchema).optional(),
		parsers: z.array(ParserSchema).optional(),
	})
	.passthrough();
export type Bootstrap = z.infer<typeof BootstrapSchema>;

// ── Endpoint Input & Output Schemas ──────────────────────────────────────────

// 1. listMailboxes
export const ListMailboxesInputSchema = z.object({
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	search: z.string().optional(),
	ordering: z
		.enum(['name', '-name', 'created', '-created', 'slug', '-slug'])
		.optional(),
});
export type ListMailboxesInput = z.input<typeof ListMailboxesInputSchema>;

export const ListMailboxesOutputSchema = z.object({
	count: z.number().int().nonnegative(),
	current: z.number().int().optional(),
	total: z.number().int().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(ParserSchema),
});
export type ListMailboxesOutput = z.infer<typeof ListMailboxesOutputSchema>;

// 2. createMailbox
export const CreateMailboxInputSchema = z.object({
	name: z.string(),
	slug: z.string().optional(),
	description: z.string().optional(),
	ai_engine: AIEngineEnumSchema.optional(),
	retention_days: z.number().int().optional(),
	timezone: z.string().optional(),
	decimal_separator: DecimalSeparatorEnumSchema.optional(),
	input_date_format: z.string().optional(),
	disable_table_flattening: z.boolean().optional(),
	fields_order: z.array(z.string()).optional(),
});
export type CreateMailboxInput = z.input<typeof CreateMailboxInputSchema>;
export const CreateMailboxOutputSchema = ParserSchema;
export type CreateMailboxOutput = z.infer<typeof CreateMailboxOutputSchema>;

// 3. getMailbox
export const GetMailboxInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type GetMailboxInput = z.input<typeof GetMailboxInputSchema>;
export const GetMailboxOutputSchema = ParserSchema;
export type GetMailboxOutput = z.infer<typeof GetMailboxOutputSchema>;

// 4. updateMailbox
export const UpdateMailboxInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	slug: z.string().optional(),
	description: z.string().optional(),
	ai_engine: AIEngineEnumSchema.optional(),
	retention_days: z.number().int().optional(),
	timezone: z.string().optional(),
	decimal_separator: DecimalSeparatorEnumSchema.optional(),
	input_date_format: z.string().optional(),
	disable_table_flattening: z.boolean().optional(),
	fields_order: z.array(z.string()).optional(),
});
export type UpdateMailboxInput = z.input<typeof UpdateMailboxInputSchema>;
export const UpdateMailboxOutputSchema = ParserSchema;
export type UpdateMailboxOutput = z.infer<typeof UpdateMailboxOutputSchema>;

// 5. deleteMailbox
export const DeleteMailboxInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type DeleteMailboxInput = z.input<typeof DeleteMailboxInputSchema>;
export const DeleteMailboxOutputSchema = DeleteSuccessSchema;
export type DeleteMailboxOutput = z.infer<typeof DeleteMailboxOutputSchema>;

// 6. getMailboxSchema
export const GetMailboxSchemaInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type GetMailboxSchemaInput = z.input<typeof GetMailboxSchemaInputSchema>;
export const GetMailboxSchemaOutputSchema = z.union([
	z.array(ParserFieldSchema),
	z
		.object({
			fields: z.array(ParserFieldSchema).optional(),
		})
		.passthrough(),
]);
export type GetMailboxSchemaOutput = z.infer<
	typeof GetMailboxSchemaOutputSchema
>;

// 7. copyMailbox
export const CopyMailboxInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string(),
});
export type CopyMailboxInput = z.input<typeof CopyMailboxInputSchema>;
export const CopyMailboxOutputSchema = ParserSchema;
export type CopyMailboxOutput = z.infer<typeof CopyMailboxOutputSchema>;

// 8. listDocuments
export const ListDocumentsInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	search: z.string().optional(),
	ordering: z
		.enum([
			'name',
			'-name',
			'created',
			'-created',
			'processed',
			'-processed',
			'status',
			'-status',
		])
		.optional(),
	status: DocumentStatusEnumSchema.optional(),
	received_after: z.string().optional(),
	received_before: z.string().optional(),
	processed_after: z.string().optional(),
	processed_before: z.string().optional(),
	tz: z.string().optional(),
	with_result: z.boolean().optional(),
});
export type ListDocumentsInput = z.input<typeof ListDocumentsInputSchema>;

export const ListDocumentsOutputSchema = z.object({
	count: z.number().int().nonnegative(),
	current: z.number().int().optional(),
	total: z.number().int().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(DocumentSchema),
});
export type ListDocumentsOutput = z.infer<typeof ListDocumentsOutputSchema>;

// 9. getDocument
export const GetDocumentInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type GetDocumentInput = z.input<typeof GetDocumentInputSchema>;
export const GetDocumentOutputSchema = DocumentSchema;
export type GetDocumentOutput = z.infer<typeof GetDocumentOutputSchema>;

// 10. deleteDocument
export const DeleteDocumentInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type DeleteDocumentInput = z.input<typeof DeleteDocumentInputSchema>;
export const DeleteDocumentOutputSchema = DeleteSuccessSchema;
export type DeleteDocumentOutput = z.infer<typeof DeleteDocumentOutputSchema>;

// 11. getDocumentLogs
export const GetDocumentLogsInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});
export type GetDocumentLogsInput = z.input<typeof GetDocumentLogsInputSchema>;

export const GetDocumentLogsOutputSchema = z.object({
	count: z.number().int().nonnegative().optional(),
	current: z.number().int().optional(),
	total: z.number().int().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(DocumentLogSchema),
});
export type GetDocumentLogsOutput = z.infer<typeof GetDocumentLogsOutputSchema>;

// 12. uploadDocument
export const UploadDocumentInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	file: z.string(),
	file_name: z.string().optional(),
});
export type UploadDocumentInput = z.input<typeof UploadDocumentInputSchema>;
export const UploadDocumentOutputSchema = z
	.object({
		message: z.string().optional(),
		attachments: z
			.array(
				z
					.object({
						name: z.string().optional(),
						DocumentID: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		id: z.union([z.string(), z.number()]).optional(),
		status: z.string().optional(),
		name: z.string().optional(),
	})
	.passthrough();
export type UploadDocumentOutput = z.infer<typeof UploadDocumentOutputSchema>;

// 13. createEmailDocument
export const CreateEmailDocumentInputSchema = z.object({
	email: z.string().optional(),
	parser_id: z.union([z.string(), z.number()]).optional(),
	mailbox_id: z.union([z.string(), z.number()]).optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
	html: z.string().optional(),
	to: z.string().optional(),
	from: z.string().optional(),
	raw: z.string().optional(),
});
export type CreateEmailDocumentInput = z.input<
	typeof CreateEmailDocumentInputSchema
>;
export const CreateEmailDocumentOutputSchema = DocumentSchema.or(
	z
		.object({
			id: z.union([z.string(), z.number()]).optional(),
			status: z.string().optional(),
			name: z.string().optional(),
		})
		.passthrough(),
);
export type CreateEmailDocumentOutput = z.infer<
	typeof CreateEmailDocumentOutputSchema
>;

// 14. processDocument
export const ProcessDocumentInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type ProcessDocumentInput = z.input<typeof ProcessDocumentInputSchema>;
export const ProcessDocumentOutputSchema = DocumentSchema.or(
	z
		.object({
			id: z.union([z.string(), z.number()]),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type ProcessDocumentOutput = z.infer<typeof ProcessDocumentOutputSchema>;

// 15. skipDocument
export const SkipDocumentInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type SkipDocumentInput = z.input<typeof SkipDocumentInputSchema>;
export const SkipDocumentOutputSchema = DocumentSchema.or(
	z
		.object({
			id: z.union([z.string(), z.number()]),
			status: z.string().optional(),
		})
		.passthrough(),
);
export type SkipDocumentOutput = z.infer<typeof SkipDocumentOutputSchema>;

// 16. copyDocument
export const CopyDocumentInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	target_mailbox_id: z.union([z.string(), z.number()]),
});
export type CopyDocumentInput = z.input<typeof CopyDocumentInputSchema>;
export const CopyDocumentOutputSchema = DocumentSchema;
export type CopyDocumentOutput = z.infer<typeof CopyDocumentOutputSchema>;

// 17. listTemplates
export const ListTemplatesInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	search: z.string().optional(),
	ordering: z.string().optional(),
});
export type ListTemplatesInput = z.input<typeof ListTemplatesInputSchema>;

export const ListTemplatesOutputSchema = z.object({
	count: z.number().int().nonnegative().optional(),
	current: z.number().int().optional(),
	total: z.number().int().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(TemplateSchema),
});
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

// 18. getTemplate
export const GetTemplateInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type GetTemplateInput = z.input<typeof GetTemplateInputSchema>;
export const GetTemplateOutputSchema = TemplateSchema;
export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

// 19. deleteTemplate
export const DeleteTemplateInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type DeleteTemplateInput = z.input<typeof DeleteTemplateInputSchema>;
export const DeleteTemplateOutputSchema = DeleteSuccessSchema;
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

// 20. copyTemplate
export const CopyTemplateInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	target_mailbox_id: z.union([z.string(), z.number()]),
});
export type CopyTemplateInput = z.input<typeof CopyTemplateInputSchema>;
export const CopyTemplateOutputSchema = TemplateSchema;
export type CopyTemplateOutput = z.infer<typeof CopyTemplateOutputSchema>;

// 21. listExportConfigs
export const ListExportConfigsInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});
export type ListExportConfigsInput = z.input<
	typeof ListExportConfigsInputSchema
>;

export const ListExportConfigsOutputSchema = z.object({
	count: z.number().int().nonnegative().optional(),
	current: z.number().int().optional(),
	total: z.number().int().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(ExportConfigSchema),
});
export type ListExportConfigsOutput = z.infer<
	typeof ListExportConfigsOutputSchema
>;

// 22. createExportConfig
export const CreateExportConfigInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string(),
	format: z.string().optional(),
	include_headers: z.boolean().optional(),
	all_fields: z.boolean().optional(),
	fields: z.array(z.string()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
export type CreateExportConfigInput = z.input<
	typeof CreateExportConfigInputSchema
>;
export const CreateExportConfigOutputSchema = ExportConfigSchema;
export type CreateExportConfigOutput = z.infer<
	typeof CreateExportConfigOutputSchema
>;

// 23. updateExportConfig
export const UpdateExportConfigInputSchema = z.object({
	mailbox_id: z.union([z.string(), z.number()]),
	id: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	format: z.string().optional(),
	include_headers: z.boolean().optional(),
	all_fields: z.boolean().optional(),
	fields: z.array(z.string()).optional(),
	options: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateExportConfigInput = z.input<
	typeof UpdateExportConfigInputSchema
>;
export const UpdateExportConfigOutputSchema = ExportConfigSchema;
export type UpdateExportConfigOutput = z.infer<
	typeof UpdateExportConfigOutputSchema
>;

// 24. deleteExportConfig
export const DeleteExportConfigInputSchema = z.object({
	mailbox_id: z.union([z.string(), z.number()]),
	id: z.union([z.string(), z.number()]),
});
export type DeleteExportConfigInput = z.input<
	typeof DeleteExportConfigInputSchema
>;
export const DeleteExportConfigOutputSchema = DeleteSuccessSchema;
export type DeleteExportConfigOutput = z.infer<
	typeof DeleteExportConfigOutputSchema
>;

// 25. createWebhook
export const CreateWebhookInputSchema = z.object({
	target_url: z.string().url().optional().or(z.string()),
	event: WebhookEventEnumSchema.optional(),
	parser_id: z.union([z.string(), z.number()]).optional(),
	is_active: z.boolean().optional(),
	name: z.string().optional(),
});
export type CreateWebhookInput = z.input<typeof CreateWebhookInputSchema>;
export const CreateWebhookOutputSchema = WebhookSchema;
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

// 26. enableWebhook
export const EnableWebhookInputSchema = z.object({
	mailbox_id: z.union([z.string(), z.number()]),
	id: z.union([z.string(), z.number()]),
});
export type EnableWebhookInput = z.input<typeof EnableWebhookInputSchema>;
export const EnableWebhookOutputSchema = WebhookSchema.or(DeleteSuccessSchema);
export type EnableWebhookOutput = z.infer<typeof EnableWebhookOutputSchema>;

// 27. disableWebhook
export const DisableWebhookInputSchema = z.object({
	mailbox_id: z.union([z.string(), z.number()]),
	id: z.union([z.string(), z.number()]),
});
export type DisableWebhookInput = z.input<typeof DisableWebhookInputSchema>;
export const DisableWebhookOutputSchema = DeleteSuccessSchema;
export type DisableWebhookOutput = z.infer<typeof DisableWebhookOutputSchema>;

// 28. deleteWebhook
export const DeleteWebhookInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type DeleteWebhookInput = z.input<typeof DeleteWebhookInputSchema>;
export const DeleteWebhookOutputSchema = DeleteSuccessSchema;
export type DeleteWebhookOutput = z.infer<typeof DeleteWebhookOutputSchema>;

// 29. getBootstrap
export const GetBootstrapInputSchema = z.object({});
export type GetBootstrapInput = z.input<typeof GetBootstrapInputSchema>;
export const GetBootstrapOutputSchema = BootstrapSchema;
export type GetBootstrapOutput = z.infer<typeof GetBootstrapOutputSchema>;

// ── Aggregate Input/Output Schemas and Dictionaries ──────────────────────────

export const ParseurEndpointInputSchemas = {
	listMailboxes: ListMailboxesInputSchema,
	createMailbox: CreateMailboxInputSchema,
	getMailbox: GetMailboxInputSchema,
	updateMailbox: UpdateMailboxInputSchema,
	deleteMailbox: DeleteMailboxInputSchema,
	getMailboxSchema: GetMailboxSchemaInputSchema,
	copyMailbox: CopyMailboxInputSchema,

	listDocuments: ListDocumentsInputSchema,
	getDocument: GetDocumentInputSchema,
	deleteDocument: DeleteDocumentInputSchema,
	getDocumentLogs: GetDocumentLogsInputSchema,
	uploadDocument: UploadDocumentInputSchema,
	createEmailDocument: CreateEmailDocumentInputSchema,
	processDocument: ProcessDocumentInputSchema,
	skipDocument: SkipDocumentInputSchema,
	copyDocument: CopyDocumentInputSchema,

	listTemplates: ListTemplatesInputSchema,
	getTemplate: GetTemplateInputSchema,
	deleteTemplate: DeleteTemplateInputSchema,
	copyTemplate: CopyTemplateInputSchema,

	listExportConfigs: ListExportConfigsInputSchema,
	createExportConfig: CreateExportConfigInputSchema,
	updateExportConfig: UpdateExportConfigInputSchema,
	deleteExportConfig: DeleteExportConfigInputSchema,

	createWebhook: CreateWebhookInputSchema,
	enableWebhook: EnableWebhookInputSchema,
	disableWebhook: DisableWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,

	getBootstrap: GetBootstrapInputSchema,
};

export const ParseurEndpointOutputSchemas = {
	listMailboxes: ListMailboxesOutputSchema,
	createMailbox: CreateMailboxOutputSchema,
	getMailbox: GetMailboxOutputSchema,
	updateMailbox: UpdateMailboxOutputSchema,
	deleteMailbox: DeleteMailboxOutputSchema,
	getMailboxSchema: GetMailboxSchemaOutputSchema,
	copyMailbox: CopyMailboxOutputSchema,

	listDocuments: ListDocumentsOutputSchema,
	getDocument: GetDocumentOutputSchema,
	deleteDocument: DeleteDocumentOutputSchema,
	getDocumentLogs: GetDocumentLogsOutputSchema,
	uploadDocument: UploadDocumentOutputSchema,
	createEmailDocument: CreateEmailDocumentOutputSchema,
	processDocument: ProcessDocumentOutputSchema,
	skipDocument: SkipDocumentOutputSchema,
	copyDocument: CopyDocumentOutputSchema,

	listTemplates: ListTemplatesOutputSchema,
	getTemplate: GetTemplateOutputSchema,
	deleteTemplate: DeleteTemplateOutputSchema,
	copyTemplate: CopyTemplateOutputSchema,

	listExportConfigs: ListExportConfigsOutputSchema,
	createExportConfig: CreateExportConfigOutputSchema,
	updateExportConfig: UpdateExportConfigOutputSchema,
	deleteExportConfig: DeleteExportConfigOutputSchema,

	createWebhook: CreateWebhookOutputSchema,
	enableWebhook: EnableWebhookOutputSchema,
	disableWebhook: DisableWebhookOutputSchema,
	deleteWebhook: DeleteWebhookOutputSchema,

	getBootstrap: GetBootstrapOutputSchema,
};

export type ParseurEndpointInputs = {
	listMailboxes: ListMailboxesInput;
	createMailbox: CreateMailboxInput;
	getMailbox: GetMailboxInput;
	updateMailbox: UpdateMailboxInput;
	deleteMailbox: DeleteMailboxInput;
	getMailboxSchema: GetMailboxSchemaInput;
	copyMailbox: CopyMailboxInput;

	listDocuments: ListDocumentsInput;
	getDocument: GetDocumentInput;
	deleteDocument: DeleteDocumentInput;
	getDocumentLogs: GetDocumentLogsInput;
	uploadDocument: UploadDocumentInput;
	createEmailDocument: CreateEmailDocumentInput;
	processDocument: ProcessDocumentInput;
	skipDocument: SkipDocumentInput;
	copyDocument: CopyDocumentInput;

	listTemplates: ListTemplatesInput;
	getTemplate: GetTemplateInput;
	deleteTemplate: DeleteTemplateInput;
	copyTemplate: CopyTemplateInput;

	listExportConfigs: ListExportConfigsInput;
	createExportConfig: CreateExportConfigInput;
	updateExportConfig: UpdateExportConfigInput;
	deleteExportConfig: DeleteExportConfigInput;

	createWebhook: CreateWebhookInput;
	enableWebhook: EnableWebhookInput;
	disableWebhook: DisableWebhookInput;
	deleteWebhook: DeleteWebhookInput;

	getBootstrap: GetBootstrapInput;
};

export type ParseurEndpointOutputs = {
	listMailboxes: ListMailboxesOutput;
	createMailbox: CreateMailboxOutput;
	getMailbox: GetMailboxOutput;
	updateMailbox: UpdateMailboxOutput;
	deleteMailbox: DeleteMailboxOutput;
	getMailboxSchema: GetMailboxSchemaOutput;
	copyMailbox: CopyMailboxOutput;

	listDocuments: ListDocumentsOutput;
	getDocument: GetDocumentOutput;
	deleteDocument: DeleteDocumentOutput;
	getDocumentLogs: GetDocumentLogsOutput;
	uploadDocument: UploadDocumentOutput;
	createEmailDocument: CreateEmailDocumentOutput;
	processDocument: ProcessDocumentOutput;
	skipDocument: SkipDocumentOutput;
	copyDocument: CopyDocumentOutput;

	listTemplates: ListTemplatesOutput;
	getTemplate: GetTemplateOutput;
	deleteTemplate: DeleteTemplateOutput;
	copyTemplate: CopyTemplateOutput;

	listExportConfigs: ListExportConfigsOutput;
	createExportConfig: CreateExportConfigOutput;
	updateExportConfig: UpdateExportConfigOutput;
	deleteExportConfig: DeleteExportConfigOutput;

	createWebhook: CreateWebhookOutput;
	enableWebhook: EnableWebhookOutput;
	disableWebhook: DisableWebhookOutput;
	deleteWebhook: DeleteWebhookOutput;

	getBootstrap: GetBootstrapOutput;
};
