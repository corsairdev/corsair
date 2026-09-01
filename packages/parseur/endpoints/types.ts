import { z } from 'zod';

const Id = z.union([z.string(), z.number()]);

export const DeleteSuccessSchema = z.object({
	success: z.boolean(),
});
export type DeleteSuccess = z.infer<typeof DeleteSuccessSchema>;

/** Official: DocumentStatusEnum. https://developer.parseur.com/documentstatusenum-8573517d0 */
export const DocumentStatusEnumSchema = z.enum([
	'INCOMING',
	'ANALYZING',
	'PROGRESS',
	'PARSEDOK',
	'PARSEDKO',
	'QUOTAEXC',
	'SKIPPED',
	'SPLIT',
	'EXPORTKO',
	'TRANSKO',
	'INVALID',
]);
export type DocumentStatusEnum = z.infer<typeof DocumentStatusEnumSchema>;

/** Official: AIEngineEnum */
export const AIEngineEnumSchema = z.enum([
	'DISABLED',
	'GCP_AI_2',
	'GCP_AI_2_5',
	'GCP_AI_3_TXT',
]);

/** Official: ParserFieldFormatEnum */
export const ParserFieldFormatEnumSchema = z.enum([
	'TEXT',
	'ONELINE',
	'DATE',
	'TIME',
	'DATETIME',
	'NUMBER',
	'NAME',
	'ADDRESS',
	'TABLE',
	'LINK',
]);

/** Official: WebhookEventEnum */
export const WebhookEventEnumSchema = z.enum([
	'document.processed',
	'document.processed.flattened',
	'document.template_needed',
	'document.export_failed',
	'table.processed',
]);

/** Official: WebhookCategory */
export const WebhookCategoryEnumSchema = z.enum([
	'CUSTOM',
	'ZAPIER',
	'MAKE',
	'FLOW',
	'N8N',
]);

export const DecimalSeparatorEnumSchema = z.enum(['.', ',']);

export const PaginatedSchema = z
	.object({
		count: z.number().int().optional(),
		current: z.number().int().optional(),
		total: z.number().int().optional(),
	})
	.loose();

export const ParserSchema = z
	.object({
		id: Id,
		name: z.string().optional(),
		account_uuid: z.string().optional(),
		ai_engine: z.string().optional(),
		ai_instructions: z.string().nullable().optional(),
		email_prefix: z.string().optional(),
		document_count: z.number().int().optional(),
		template_count: z.number().int().optional(),
		webhook_count: z.number().int().optional(),
		attachments_only: z.boolean().optional(),
		is_master: z.boolean().optional(),
		webhook_set: z.array(z.unknown()).optional(),
		available_webhook_set: z.array(z.unknown()).optional(),
	})
	.loose();
export type Parser = z.infer<typeof ParserSchema>;

export const DocumentSchema = z
	.object({
		id: Id,
		name: z.string().optional(),
		parser: z.number().optional(),
		status: DocumentStatusEnumSchema.or(z.string()).optional(),
		received: z.string().optional(),
		processed: z.string().nullable().optional(),
		result: z
			.union([z.string(), z.record(z.string(), z.unknown()), z.null()])
			.optional(),
		json_download_url: z.string().nullable().optional(),
		csv_download_url: z.string().nullable().optional(),
		xls_download_url: z.string().nullable().optional(),
	})
	.loose();
export type Document = z.infer<typeof DocumentSchema>;

export const DocumentLogSchema = z
	.object({
		id: Id,
		created: z.string().optional(),
		status: z.string().optional(),
		source: z.string().optional(),
		message: z.string().optional(),
		code: z.string().optional(),
	})
	.loose();
export type DocumentLog = z.infer<typeof DocumentLogSchema>;

export const TemplateSchema = z
	.object({
		id: Id,
		name: z.string().optional(),
		parser: z.number().optional(),
		engine: z.enum(['TXT', 'OCR']).or(z.string()).optional(),
		action: z.string().optional(),
		status: z.enum(['DRAFT', 'PROD']).or(z.string()).optional(),
	})
	.loose();
export type Template = z.infer<typeof TemplateSchema>;

/** Official: ExportConfig. type PARSER | PARSER_FIELD; items are field names. */
export const ExportConfigSchema = z
	.object({
		id: z.number(),
		name: z.string().nullable().optional(),
		type: z.enum(['PARSER', 'PARSER_FIELD']).optional(),
		items: z.array(z.string()).optional(),
		parser_field_id: z.string().nullable().optional(),
		parser_field_name: z.string().nullable().optional(),
		csv_download: z.string().optional(),
		xls_download: z.string().optional(),
	})
	.loose();
export type ExportConfig = z.infer<typeof ExportConfigSchema>;

/** Official: Webhook. wire field is `target`, not target_url. */
export const WebhookSchema = z
	.object({
		id: z.number(),
		event: WebhookEventEnumSchema.or(z.string()),
		target: z.string().url(),
		name: z.string().optional(),
		headers: z.record(z.string(), z.string()).nullable().optional(),
		category: WebhookCategoryEnumSchema.or(z.string()),
		parser_field_set: z.array(z.string()).optional(),
	})
	.loose();
export type Webhook = z.infer<typeof WebhookSchema>;

/** Official GET /bootstrap 200 required keys. */
export const BootstrapSchema = z
	.object({
		choices: z.record(z.string(), z.unknown()),
		mappings: z.record(z.string(), z.unknown()),
		max_field_lengths: z.record(z.string(), z.unknown()),
		email_domain: z.string(),
		extra_fields: z.array(z.unknown()),
		master_parser_set: z.array(z.unknown()),
	})
	.loose();
export type Bootstrap = z.infer<typeof BootstrapSchema>;

export const ListMailboxesInputSchema = z.object({
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	search: z.string().optional(),
	ordering: z
		.enum([
			'name',
			'-name',
			'document_count',
			'-document_count',
			'template_count',
			'-template_count',
			'PARSEDOK_count',
			'-PARSEDOK_count',
			'PARSEDKO_count',
			'-PARSEDKO_count',
			'QUOTAEXC_count',
			'-QUOTAEXC_count',
			'EXPORTKO_count',
			'-EXPORTKO_count',
			'TRANSKO_count',
			'-TRANSKO_count',
		])
		.optional(),
});
export type ListMailboxesInput = z.input<typeof ListMailboxesInputSchema>;
export const ListMailboxesOutputSchema = PaginatedSchema.extend({
	results: z.array(ParserSchema),
});
export type ListMailboxesOutput = z.infer<typeof ListMailboxesOutputSchema>;

export const CreateMailboxInputSchema = z.object({
	name: z.string().optional(),
	ai_engine: AIEngineEnumSchema.optional(),
	ai_instructions: z.string().nullable().optional(),
	email_prefix: z.string().optional(),
	attachments_only_override: z.boolean().nullable().optional(),
	disable_deskew: z.boolean().optional(),
	force_ocr: z.boolean().optional(),
	decimal_separator: DecimalSeparatorEnumSchema.optional(),
	input_date_format: z.enum(['MONTH_FIRST', 'DAY_FIRST']).nullable().optional(),
	retention_policy: z.unknown().optional(),
});
export type CreateMailboxInput = z.input<typeof CreateMailboxInputSchema>;
export const CreateMailboxOutputSchema = ParserSchema;
export type CreateMailboxOutput = z.infer<typeof CreateMailboxOutputSchema>;

export const GetMailboxInputSchema = z.object({ id: Id });
export type GetMailboxInput = z.input<typeof GetMailboxInputSchema>;
export const GetMailboxOutputSchema = ParserSchema;
export type GetMailboxOutput = z.infer<typeof GetMailboxOutputSchema>;

export const UpdateMailboxInputSchema = CreateMailboxInputSchema.extend({
	id: Id,
});
export type UpdateMailboxInput = z.input<typeof UpdateMailboxInputSchema>;
export const UpdateMailboxOutputSchema = ParserSchema;
export type UpdateMailboxOutput = z.infer<typeof UpdateMailboxOutputSchema>;

export const DeleteMailboxInputSchema = z.object({ id: Id });
export type DeleteMailboxInput = z.input<typeof DeleteMailboxInputSchema>;
export const DeleteMailboxOutputSchema = DeleteSuccessSchema;
export type DeleteMailboxOutput = z.infer<typeof DeleteMailboxOutputSchema>;

/** Official async receipt for copy/process operations. */
export const NotificationSetSchema = z
	.object({
		notification_set: z
			.object({
				info: z.array(z.string()),
			})
			.loose(),
	})
	.loose();
export type NotificationSet = z.infer<typeof NotificationSetSchema>;

export const GetMailboxSchemaInputSchema = z.object({ id: Id });
export type GetMailboxSchemaInput = z.input<typeof GetMailboxSchemaInputSchema>;
export const GetMailboxSchemaOutputSchema = z
	.object({
		type: z.string(),
		properties: z.record(z.string(), z.unknown()),
	})
	.loose();
export type GetMailboxSchemaOutput = z.infer<
	typeof GetMailboxSchemaOutputSchema
>;

export const CopyMailboxInputSchema = z.object({ id: Id });
export type CopyMailboxInput = z.input<typeof CopyMailboxInputSchema>;
export const CopyMailboxOutputSchema = NotificationSetSchema;
export type CopyMailboxOutput = z.infer<typeof CopyMailboxOutputSchema>;

export const ListDocumentsInputSchema = z.object({
	id: Id,
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
	tz: z.string().optional(),
	with_result: z.boolean().optional(),
});
export type ListDocumentsInput = z.input<typeof ListDocumentsInputSchema>;
export const ListDocumentsOutputSchema = PaginatedSchema.extend({
	results: z.array(DocumentSchema),
});
export type ListDocumentsOutput = z.infer<typeof ListDocumentsOutputSchema>;

export const GetDocumentInputSchema = z.object({ id: Id });
export type GetDocumentInput = z.input<typeof GetDocumentInputSchema>;
export const GetDocumentOutputSchema = DocumentSchema;
export type GetDocumentOutput = z.infer<typeof GetDocumentOutputSchema>;

export const DeleteDocumentInputSchema = z.object({ id: Id });
export type DeleteDocumentInput = z.input<typeof DeleteDocumentInputSchema>;
export const DeleteDocumentOutputSchema = DeleteSuccessSchema;
export type DeleteDocumentOutput = z.infer<typeof DeleteDocumentOutputSchema>;

export const GetDocumentLogsInputSchema = z.object({
	id: Id,
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});
export type GetDocumentLogsInput = z.input<typeof GetDocumentLogsInputSchema>;
export const GetDocumentLogsOutputSchema = PaginatedSchema.extend({
	results: z.array(DocumentLogSchema),
});
export type GetDocumentLogsOutput = z.infer<typeof GetDocumentLogsOutputSchema>;

export const UploadDocumentInputSchema = z.object({
	id: Id,
	file: z.string(),
	file_name: z.string().optional(),
});
export type UploadDocumentInput = z.input<typeof UploadDocumentInputSchema>;
export const UploadDocumentOutputSchema = z
	.object({
		message: z.string(),
		attachments: z.array(
			z
				.object({
					name: z.string().optional(),
					DocumentID: z.string().optional(),
				})
				.loose(),
		),
	})
	.loose();
export type UploadDocumentOutput = z.infer<typeof UploadDocumentOutputSchema>;

export const CreateEmailDocumentInputSchema = z.object({
	subject: z.string(),
	from: z.string(),
	recipient: z.string(),
	to: z.string().optional(),
	cc: z.string().optional(),
	bcc: z.string().optional(),
	body_html: z.string().optional(),
	body_plain: z.string().optional(),
	message_headers: z.array(z.tuple([z.string(), z.string()])).optional(),
});
export type CreateEmailDocumentInput = z.input<
	typeof CreateEmailDocumentInputSchema
>;
export const CreateEmailDocumentOutputSchema = z
	.object({
		message: z.string().optional(),
		DocumentID: z.string().optional(),
		DocumentIDs: z.array(z.string()).optional(),
		attachments: z
			.array(
				z
					.object({
						name: z.string().optional(),
						DocumentID: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();
export type CreateEmailDocumentOutput = z.infer<
	typeof CreateEmailDocumentOutputSchema
>;

export const ProcessDocumentInputSchema = z.object({ id: Id });
export type ProcessDocumentInput = z.input<typeof ProcessDocumentInputSchema>;
export const ProcessDocumentOutputSchema = NotificationSetSchema;
export type ProcessDocumentOutput = z.infer<typeof ProcessDocumentOutputSchema>;

export const SkipDocumentInputSchema = z.object({ id: Id });
export type SkipDocumentInput = z.input<typeof SkipDocumentInputSchema>;
export const SkipDocumentOutputSchema = DocumentSchema;
export type SkipDocumentOutput = z.infer<typeof SkipDocumentOutputSchema>;

export const CopyDocumentInputSchema = z.object({
	id: Id,
	target_mailbox_id: Id,
});
export type CopyDocumentInput = z.input<typeof CopyDocumentInputSchema>;
export const CopyDocumentOutputSchema = NotificationSetSchema;
export type CopyDocumentOutput = z.infer<typeof CopyDocumentOutputSchema>;

export const ListTemplatesInputSchema = z.object({
	id: Id,
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
	search: z.string().optional(),
	ordering: z.string().optional(),
});
export type ListTemplatesInput = z.input<typeof ListTemplatesInputSchema>;
export const ListTemplatesOutputSchema = PaginatedSchema.extend({
	results: z.array(TemplateSchema),
});
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const GetTemplateInputSchema = z.object({ id: Id });
export type GetTemplateInput = z.input<typeof GetTemplateInputSchema>;
export const GetTemplateOutputSchema = TemplateSchema;
export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z.object({ id: Id });
export type DeleteTemplateInput = z.input<typeof DeleteTemplateInputSchema>;
export const DeleteTemplateOutputSchema = DeleteSuccessSchema;
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

export const CopyTemplateInputSchema = z.object({
	id: Id,
	target_mailbox_id: Id,
});
export type CopyTemplateInput = z.input<typeof CopyTemplateInputSchema>;
export const CopyTemplateOutputSchema = NotificationSetSchema;
export type CopyTemplateOutput = z.infer<typeof CopyTemplateOutputSchema>;

export const ListExportConfigsInputSchema = z.object({
	id: Id,
	page: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});
export type ListExportConfigsInput = z.input<
	typeof ListExportConfigsInputSchema
>;
export const ListExportConfigsOutputSchema = PaginatedSchema.extend({
	results: z.array(ExportConfigSchema),
});
export type ListExportConfigsOutput = z.infer<
	typeof ListExportConfigsOutputSchema
>;

export const CreateExportConfigInputSchema = z.object({
	id: Id,
	name: z.string(),
	type: z.enum(['PARSER', 'PARSER_FIELD']).optional(),
	items: z.array(z.string()),
	parser_field_id: z.string().optional(),
});
export type CreateExportConfigInput = z.input<
	typeof CreateExportConfigInputSchema
>;
export const CreateExportConfigOutputSchema = ExportConfigSchema;
export type CreateExportConfigOutput = z.infer<
	typeof CreateExportConfigOutputSchema
>;

export const UpdateExportConfigInputSchema = z.object({
	mailbox_id: Id,
	id: Id,
	name: z.string().optional(),
	type: z.enum(['PARSER', 'PARSER_FIELD']).optional(),
	items: z.array(z.string()).optional(),
	parser_field_id: z.string().nullable().optional(),
});
export type UpdateExportConfigInput = z.input<
	typeof UpdateExportConfigInputSchema
>;
export const UpdateExportConfigOutputSchema = ExportConfigSchema;
export type UpdateExportConfigOutput = z.infer<
	typeof UpdateExportConfigOutputSchema
>;

export const DeleteExportConfigInputSchema = z.object({
	mailbox_id: Id,
	id: Id,
});
export type DeleteExportConfigInput = z.input<
	typeof DeleteExportConfigInputSchema
>;
export const DeleteExportConfigOutputSchema = DeleteSuccessSchema;
export type DeleteExportConfigOutput = z.infer<
	typeof DeleteExportConfigOutputSchema
>;

export const CreateWebhookInputSchema = z.object({
	event: WebhookEventEnumSchema,
	target: z.string().url(),
	category: WebhookCategoryEnumSchema.optional(),
	name: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
	parser: z.number().optional(),
	parser_field: z.string().optional(),
});
export type CreateWebhookInput = z.input<typeof CreateWebhookInputSchema>;
export const CreateWebhookOutputSchema = WebhookSchema;
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

export const EnableWebhookInputSchema = z.object({
	mailbox_id: Id,
	id: Id,
});
export type EnableWebhookInput = z.input<typeof EnableWebhookInputSchema>;
export const EnableWebhookOutputSchema = ParserSchema;
export type EnableWebhookOutput = z.infer<typeof EnableWebhookOutputSchema>;

export const DisableWebhookInputSchema = z.object({
	mailbox_id: Id,
	id: Id,
});
export type DisableWebhookInput = z.input<typeof DisableWebhookInputSchema>;
export const DisableWebhookOutputSchema = DeleteSuccessSchema;
export type DisableWebhookOutput = z.infer<typeof DisableWebhookOutputSchema>;

export const DeleteWebhookInputSchema = z.object({ id: Id });
export type DeleteWebhookInput = z.input<typeof DeleteWebhookInputSchema>;
export const DeleteWebhookOutputSchema = DeleteSuccessSchema;
export type DeleteWebhookOutput = z.infer<typeof DeleteWebhookOutputSchema>;

export const ListWebhooksInputSchema = z.object({ id: Id });
export type ListWebhooksInput = z.input<typeof ListWebhooksInputSchema>;
export const ListWebhooksOutputSchema = z
	.object({
		webhook_set: z.array(WebhookSchema),
		available_webhook_set: z.array(WebhookSchema),
	})
	.loose();
export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

export const GetBootstrapInputSchema = z.object({});
export type GetBootstrapInput = z.input<typeof GetBootstrapInputSchema>;
export const GetBootstrapOutputSchema = BootstrapSchema;
export type GetBootstrapOutput = z.infer<typeof GetBootstrapOutputSchema>;

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
	listWebhooks: ListWebhooksInputSchema,
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
	listWebhooks: ListWebhooksOutputSchema,
	getBootstrap: GetBootstrapOutputSchema,
};

export type ParseurEndpointInputs = {
	[K in keyof typeof ParseurEndpointInputSchemas]: z.input<
		(typeof ParseurEndpointInputSchemas)[K]
	>;
};

export type ParseurEndpointOutputs = {
	[K in keyof typeof ParseurEndpointOutputSchemas]: z.infer<
		(typeof ParseurEndpointOutputSchemas)[K]
	>;
};
