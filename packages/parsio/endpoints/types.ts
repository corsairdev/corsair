import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const isoDate = z
	.string()
	.regex(DATE_REGEX, 'Expected a date in YYYY-MM-DD format');

/**
 * The document object Parsio returns from imports, GET /docs/{id} and its
 * webhooks, as the response examples publish it.
 */
export const DocumentSchema = z
	.object({
		doc_id: z.string().min(1).describe('Document id'),
		// GET /docs/{id} answers neither doc_id nor this flag (live); the
		// shaper fills doc_id from _id.
		parsing_in_progress: z
			.boolean()
			.nullish()
			.describe('Whether parsing is still running'),
		// Absent when the API answers only the new document's id.
		status: z
			.string()
			.nullish()
			.describe('Document status, e.g. parsing, parsed'),
		name: z.string().nullish().describe('Document name; null while parsing'),
		content_type: z
			.string()
			.nullish()
			.describe('Media type of the source document'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		processed_at: z.string().nullish().describe('When parsing finished'),
		// unknown: the json object's keys are the parsed fields the mailbox's
		// parser produced, so it stays an open record.
		json: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('The parsed data'),
	})
	.loose()
	.describe('A Parsio document with its parsed data');
export type ParsioDocument = z.infer<typeof DocumentSchema>;

/**
 * Document answers come in three shapes (live, 2026-11-21): the documented
 * object with doc_id, the stored record with _id (GET /docs/{id}), and a
 * bare id string (async create and uploads). All become a document with a
 * doc_id.
 */
// unknown: raw is the untouched response body; the output schema checks the result.
export function shapeDocument(raw: unknown): unknown {
	if (typeof raw === 'string' && raw.length > 0) return { doc_id: raw };
	if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
		const record = raw as Record<string, unknown>;
		if (record.doc_id === undefined && typeof record._id === 'string') {
			return { ...record, doc_id: record._id };
		}
	}
	return raw;
}

/** The pagination fields Parsio's list answers carry. */
const pageFields = {
	totalDocs: z.number().nullish().describe('Documents in total'),
	limit: z.number().nullish().describe('Page size'),
	page: z.number().nullish().describe('Current page'),
	totalPages: z.number().nullish().describe('Pages in total'),
	hasNextPage: z.boolean().nullish().describe('Whether another page follows'),
	nextPage: z.number().nullish().describe('Next page number'),
};

// ── mailboxes ──────────────────────────────────────────────────────────────

export const MailboxSchema = z
	.object({
		_id: z.string().min(1).describe('Mailbox id'),
		name: z.string().nullish().describe('Mailbox name'),
		preset: z.string().nullish().describe('Parser type or preset'),
	})
	.loose()
	.describe('A Parsio mailbox');
export type Mailbox = z.infer<typeof MailboxSchema>;

export const ListMailboxesInputSchema = z
	.object({})
	.describe('Input for listing mailboxes (none)');
export type ListMailboxesInput = z.infer<typeof ListMailboxesInputSchema>;

export const ListMailboxesOutputSchema = z
	.array(MailboxSchema)
	.describe('All mailboxes available to the authenticated user');
export type ListMailboxesOutput = z.infer<typeof ListMailboxesOutputSchema>;

export const GetMailboxInputSchema = z
	.object({ mailboxId: z.string().min(1).describe('Mailbox id') })
	.describe('Input for reading one mailbox');
export type GetMailboxInput = z.infer<typeof GetMailboxInputSchema>;

export const GetMailboxOutputSchema = MailboxSchema.describe(
	'Mailbox settings and configuration',
);
export type GetMailboxOutput = z.infer<typeof GetMailboxOutputSchema>;

export const CreateMailboxInputSchema = z
	.object({
		name: z.string().min(1).describe('Mailbox name'),
		preset: z.string().optional().describe('Parser type or preset'),
		ml_model: z
			.string()
			.optional()
			.describe('OCR or AI model, depending on mailbox type'),
		has_raw_data: z
			.boolean()
			.optional()
			.describe('Keep the raw document content'),
		parse_sig: z.boolean().optional().describe('Parse email signatures'),
	})
	.describe('Create a mailbox');
export type CreateMailboxInput = z.infer<typeof CreateMailboxInputSchema>;

export const CreateMailboxOutputSchema = MailboxSchema.describe(
	'The mailbox as created',
);
export type CreateMailboxOutput = z.infer<typeof CreateMailboxOutputSchema>;

export const UpdateMailboxInputSchema = z
	.object({
		mailboxId: z.string().min(1).describe('Mailbox id'),
		name: z.string().optional().describe('Mailbox name'),
		email_prefix: z
			.string()
			.optional()
			.describe('Prefix of the mailbox email address'),
		process_attachments: z
			.boolean()
			.optional()
			.describe('Store or ignore email attachments'),
		collect_emails: z
			.boolean()
			.optional()
			.describe('Collect email addresses automatically'),
		alert_email_h: z
			.number()
			.optional()
			.describe('Email alert frequency in hours'),
		receive_email: z
			.boolean()
			.optional()
			.describe('Whether the mailbox accepts incoming emails'),
		preset: z.string().optional().describe('Parser type or preset'),
		ml_model: z.string().optional().describe('OCR or AI model'),
	})
	.superRefine((input, ctx) => {
		const touched = Object.entries(input).some(
			([key, value]) => key !== 'mailboxId' && value !== undefined,
		);
		if (!touched) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'Give at least one field to update',
			});
		}
	})
	.describe('Update mailbox settings');
export type UpdateMailboxInput = z.infer<typeof UpdateMailboxInputSchema>;

// The update RPC answers { isError, errMsg, errFields } (live).
export const UpdateMailboxOutputSchema = z
	.object({
		isError: z.boolean().nullish().describe('Whether Parsio refused it'),
		errMsg: z.string().nullish().describe('Why, when it did'),
		// unknown: per-field error messages keyed by field name.
		errFields: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Per-field errors'),
	})
	.loose()
	.describe('The update result');
export type UpdateMailboxOutput = z.infer<typeof UpdateMailboxOutputSchema>;

export const DeleteMailboxInputSchema = z
	.object({ mailboxId: z.string().min(1).describe('Mailbox id') })
	.describe('Delete a mailbox');
export type DeleteMailboxInput = z.infer<typeof DeleteMailboxInputSchema>;

export const DeleteMailboxOutputSchema = z
	.object({
		mailboxId: z.string().describe('Deleted mailbox id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The mailbox was deleted (the API answers 204 with no body)');
export type DeleteMailboxOutput = z.infer<typeof DeleteMailboxOutputSchema>;

export const ListTableFieldsInputSchema = z
	.object({ mailboxId: z.string().min(1).describe('Mailbox id') })
	.describe('Input for listing the table fields configured in a mailbox');
export type ListTableFieldsInput = z.infer<typeof ListTableFieldsInputSchema>;

export const ListTableFieldsOutputSchema = z
	.array(z.object({}).loose())
	.describe('The table fields configured in the mailbox');
export type ListTableFieldsOutput = z.infer<typeof ListTableFieldsOutputSchema>;

// ── documents ──────────────────────────────────────────────────────────────

/** The body both document-creation endpoints take. */
const DocumentBodySchema = {
	html: z
		.string()
		.optional()
		.describe('HTML content to parse; wins when both html and text are sent'),
	text: z.string().optional().describe('Plain text content to parse'),
	__meta__: z
		// unknown: the custom payload is caller-defined and lands in the
		// parsed JSON verbatim, so it stays an open record.
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom payload included in the parsed JSON as __meta__'),
};

export const CreateDocumentSyncInputSchema = z
	.object({
		mailboxId: z
			.string()
			.min(1)
			.describe('Mailbox id that parses the document'),
		...DocumentBodySchema,
	})
	.superRefine((input, ctx) => {
		if (!input.html && !input.text) {
			ctx.addIssue({
				code: 'custom',
				path: ['html'],
				message: 'Provide html or text content',
			});
		}
	})
	.describe(
		'Create a document from HTML or text and wait for the parsed result (template and GPT parsers only)',
	);
export type CreateDocumentSyncInput = z.infer<
	typeof CreateDocumentSyncInputSchema
>;

export const CreateDocumentSyncOutputSchema = DocumentSchema.describe(
	'The parsed document; when parsing_in_progress is true the result is not ready yet and documents.get polls it',
);
export type CreateDocumentSyncOutput = z.infer<
	typeof CreateDocumentSyncOutputSchema
>;

export const CreateDocumentAsyncInputSchema = z
	.object({
		mailboxId: z
			.string()
			.min(1)
			.describe('Mailbox id that parses the document'),
		...DocumentBodySchema,
	})
	.superRefine((input, ctx) => {
		if (!input.html && !input.text) {
			ctx.addIssue({
				code: 'custom',
				path: ['html'],
				message: 'Provide html or text content',
			});
		}
	})
	.describe('Create a document from HTML or text and parse it asynchronously');
export type CreateDocumentAsyncInput = z.infer<
	typeof CreateDocumentAsyncInputSchema
>;

export const CreateDocumentAsyncOutputSchema = DocumentSchema.describe(
	'The created document with parsing_in_progress true; documents.get polls the parsed result',
);
export type CreateDocumentAsyncOutput = z.infer<
	typeof CreateDocumentAsyncOutputSchema
>;

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export const UploadDocumentSyncInputSchema = z
	.object({
		mailboxId: z
			.string()
			.min(1)
			.describe('Mailbox id that parses the document'),
		filename: z.string().min(1).describe('Name of the file, e.g. receipt.pdf'),
		contentBase64: z
			.string()
			.min(1)
			.refine((value) => {
				const bytes = Math.floor((value.length * 3) / 4);
				return bytes <= 20 * 1024 * 1024;
			}, 'Sync upload accepts at most 20MB')
			.describe(
				'The file, base64-encoded; sync upload accepts one file of at most 20MB, no ZIP',
			),
	})
	.describe('Upload one file and wait for the parsed result');
export type UploadDocumentSyncInput = z.infer<
	typeof UploadDocumentSyncInputSchema
>;

export const UploadDocumentSyncOutputSchema = DocumentSchema.describe(
	'The parsed document; when parsing_in_progress is true the result is not ready yet and documents.get polls it',
);
export type UploadDocumentSyncOutput = z.infer<
	typeof UploadDocumentSyncOutputSchema
>;

export const UploadDocumentAsyncInputSchema = z
	.object({
		mailboxId: z
			.string()
			.min(1)
			.describe('Mailbox id that parses the document'),
		filename: z.string().min(1).describe('Name of the file, e.g. receipts.zip'),
		contentBase64: z
			.string()
			.min(1)
			.refine(
				(value) => Math.floor((value.length * 3) / 4) <= MAX_UPLOAD_BYTES,
				'Async upload accepts at most 50MB',
			)
			.describe(
				'The file, base64-encoded; async upload accepts one file of at most 50MB, ZIPs included',
			),
	})
	.describe('Upload one file and parse it asynchronously');
export type UploadDocumentAsyncInput = z.infer<
	typeof UploadDocumentAsyncInputSchema
>;

export const UploadDocumentAsyncOutputSchema = DocumentSchema.describe(
	'The created document with parsing_in_progress true; documents.get polls the parsed result',
);
export type UploadDocumentAsyncOutput = z.infer<
	typeof UploadDocumentAsyncOutputSchema
>;

export const ListDocumentsInputSchema = z
	.object({
		mailboxId: z.string().min(1).describe('Mailbox id'),
		page: z.number().int().min(1).optional().describe('Page number'),
		per_page: z
			.number()
			.int()
			.min(1)
			.max(500)
			.optional()
			.describe('Results per page, at most 500'),
		from: isoDate.optional().describe('Start date in YYYY-MM-DD format'),
		to: isoDate.optional().describe('End date in YYYY-MM-DD format'),
		q: z.string().optional().describe('Search by document name'),
		status: z
			.array(z.string())
			.optional()
			.describe('Filter by document status, e.g. parsed, parsing'),
	})
	.describe('Query parameters for listing the documents of a mailbox');
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;

export const ListDocumentsOutputSchema = z
	.object({
		docs: z
			.array(
				z
					.object({
						_id: z.string().describe('Document id'),
						name: z.string().nullish().describe('Document name'),
						status: z.string().nullish().describe('Document status'),
						type: z.string().nullish().describe('Source type, e.g. html'),
						created_at: z.string().nullish().describe('Creation timestamp'),
						processed_at: z
							.string()
							.nullish()
							.describe('When parsing finished'),
					})
					.loose(),
			)
			.describe('The documents on this page'),
		...pageFields,
	})
	.loose()
	.describe('A page of documents (the API answers a paginated object)');
export type ListDocumentsOutput = z.infer<typeof ListDocumentsOutputSchema>;

export const GetDocumentInputSchema = z
	.object({ documentId: z.string().min(1).describe('Document id') })
	.describe('Input for reading one parsed document');
export type GetDocumentInput = z.infer<typeof GetDocumentInputSchema>;

export const GetDocumentOutputSchema = DocumentSchema.describe(
	'The parsed document; this is the same JSON payload style Parsio webhooks deliver',
);
export type GetDocumentOutput = z.infer<typeof GetDocumentOutputSchema>;

export const ReparseDocumentInputSchema = z
	.object({ documentId: z.string().min(1).describe('Document id') })
	.describe('Queue a document for reprocessing');
export type ReparseDocumentInput = z.infer<typeof ReparseDocumentInputSchema>;

export const ReparseDocumentOutputSchema = z
	.object({
		doc_id: z.string().describe('The document queued for parsing again'),
		queued: z.boolean().describe('Whether Parsio accepted the request'),
		// unknown: the API answers a bare number it does not document.
		result: z.unknown().optional().describe('What the API answered'),
	})
	.describe('The document queued for reprocessing');
export type ReparseDocumentOutput = z.infer<typeof ReparseDocumentOutputSchema>;

export const SkipDocumentsInputSchema = z
	.object({
		mailboxId: z.string().min(1).describe('Mailbox id'),
		ids: z.array(z.string().min(1)).min(1).describe('Document ids to skip'),
	})
	.describe('Skip parsing for the given documents');
export type SkipDocumentsInput = z.infer<typeof SkipDocumentsInputSchema>;

export const SkipDocumentsOutputSchema = z
	.object({
		count: z.number().describe('Number of documents skipped'),
		success: z.boolean().describe('Whether the skip succeeded'),
	})
	.describe('The documents were skipped (the API answers 204 with no body)');
export type SkipDocumentsOutput = z.infer<typeof SkipDocumentsOutputSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const WebhookSchema = z
	.object({
		_id: z.string().min(1).describe('Webhook id'),
		name: z.string().nullish().describe('Webhook name'),
		url: z.string().nullish().describe('Endpoint deliveries are posted to'),
		event: z.string().nullish().describe('Event the webhook delivers'),
		enabled: z.boolean().nullish().describe('Whether deliveries are active'),
	})
	.loose()
	.describe('A Parsio webhook subscription');
export type Webhook = z.infer<typeof WebhookSchema>;

export const ListWebhooksInputSchema = z
	.object({ mailboxId: z.string().min(1).describe('Mailbox id') })
	.describe('Input for listing the webhooks of a mailbox');
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const ListWebhooksOutputSchema = z
	.array(WebhookSchema)
	.describe('The webhooks of the mailbox');
export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

export const GetWebhookInputSchema = z
	.object({ webhookId: z.string().min(1).describe('Webhook id') })
	.describe('Input for reading one webhook');
export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;

export const GetWebhookOutputSchema = WebhookSchema.describe('The webhook');
export type GetWebhookOutput = z.infer<typeof GetWebhookOutputSchema>;

export const CreateWebhookInputSchema = z
	.object({
		mailboxId: z.string().min(1).describe('Mailbox the webhook belongs to'),
		name: z.string().optional().describe('Webhook name'),
		url: z.string().url().describe('Endpoint deliveries are posted to'),
		event: z
			.enum([
				'doc.parsed',
				'doc.parsed.flat',
				'doc.fail',
				'doc.received',
				'table.parsed',
			])
			.describe('Event the webhook delivers'),
		enabled: z.boolean().optional().describe('Whether deliveries are active'),
		table_id: z
			.string()
			.optional()
			.describe('Required only when the event is table.parsed'),
	})
	.superRefine((input, ctx) => {
		if (input.event === 'table.parsed' && !input.table_id) {
			ctx.addIssue({
				code: 'custom',
				path: ['table_id'],
				message: 'table_id is required when the event is table.parsed',
			});
		}
	})
	.describe(
		'Create a webhook; Parsio generates a signing secret the app shows for verifying deliveries',
	);
export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

export const CreateWebhookOutputSchema = WebhookSchema.describe(
	'The webhook as created',
);
export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

export const UpdateWebhookInputSchema = z
	.object({
		webhookId: z.string().min(1).describe('Webhook id (sent as _id)'),
		name: z.string().optional().describe('Webhook name'),
		url: z
			.string()
			.url()
			.optional()
			.describe('Endpoint deliveries are posted to'),
		event: z
			.enum([
				'doc.parsed',
				'doc.parsed.flat',
				'doc.fail',
				'doc.received',
				'table.parsed',
			])
			.optional()
			.describe('Event the webhook delivers'),
		enabled: z.boolean().optional().describe('Whether deliveries are active'),
		table_id: z
			.string()
			.optional()
			.describe('Required only when the event is table.parsed'),
	})
	.describe('Update a webhook');
export type UpdateWebhookInput = z.infer<typeof UpdateWebhookInputSchema>;

// The update answers { isError, errMsg, errFields } (live), like the
// mailbox update.
export const UpdateWebhookOutputSchema =
	UpdateMailboxOutputSchema.describe('The update result');
export type UpdateWebhookOutput = z.infer<typeof UpdateWebhookOutputSchema>;

export const DeleteWebhooksInputSchema = z
	.object({
		ids: z.array(z.string().min(1)).min(1).describe('Webhook ids to delete'),
	})
	.describe('Delete webhooks');
export type DeleteWebhooksInput = z.infer<typeof DeleteWebhooksInputSchema>;

export const DeleteWebhooksOutputSchema = z
	.object({
		ids: z.array(z.string()).describe('Deleted webhook ids'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The webhooks were deleted (the API answers 204 with no body)');
export type DeleteWebhooksOutput = z.infer<typeof DeleteWebhooksOutputSchema>;

// ── data ───────────────────────────────────────────────────────────────────

export const GetParsedDataInputSchema = z
	.object({
		mailboxId: z.string().min(1).describe('Mailbox id'),
		page: z.number().int().min(1).optional().describe('Page number'),
		from: isoDate.optional().describe('Start date in YYYY-MM-DD format'),
		to: isoDate.optional().describe('End date in YYYY-MM-DD format'),
	})
	.describe('Query parameters for the parsed data of a mailbox');
export type GetParsedDataInput = z.infer<typeof GetParsedDataInputSchema>;

export const GetParsedDataOutputSchema = z
	.object({
		docs: z
			.array(
				z
					.object({
						doc_id: z
							.string()
							.nullish()
							.describe('Document id the data came from'),
						// unknown: parsed data records carry the mailbox's parsed
						// fields, so they stay open records.
					})
					.loose(),
			)
			.describe('The parsed data records on this page'),
		docIds: z
			.array(z.string())
			.nullish()
			.describe('Ids of the documents on this page'),
		...pageFields,
	})
	.loose()
	.describe('A page of parsed data (the API answers a paginated object)');
export type GetParsedDataOutput = z.infer<typeof GetParsedDataOutputSchema>;

export const ListEmailsInputSchema = z
	.object({ mailboxId: z.string().min(1).describe('Mailbox id') })
	.describe('Input for listing the email addresses the mailbox collected');
export type ListEmailsInput = z.infer<typeof ListEmailsInputSchema>;

export const ListEmailsOutputSchema = z
	.array(
		z
			.object({
				email: z.string().nullish().describe('Collected email address'),
			})
			.loose(),
	)
	.describe('The collected email addresses');
export type ListEmailsOutput = z.infer<typeof ListEmailsOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const ParsioEndpointInputSchemas = {
	mailboxesList: ListMailboxesInputSchema,
	mailboxesGet: GetMailboxInputSchema,
	mailboxesCreate: CreateMailboxInputSchema,
	mailboxesUpdate: UpdateMailboxInputSchema,
	mailboxesDelete: DeleteMailboxInputSchema,
	mailboxesTableFields: ListTableFieldsInputSchema,
	documentsCreateSync: CreateDocumentSyncInputSchema,
	documentsCreateAsync: CreateDocumentAsyncInputSchema,
	documentsUploadSync: UploadDocumentSyncInputSchema,
	documentsUploadAsync: UploadDocumentAsyncInputSchema,
	documentsList: ListDocumentsInputSchema,
	documentsGet: GetDocumentInputSchema,
	documentsReparse: ReparseDocumentInputSchema,
	documentsSkipMany: SkipDocumentsInputSchema,
	webhooksListForMailbox: ListWebhooksInputSchema,
	webhooksGet: GetWebhookInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksDelete: DeleteWebhooksInputSchema,
	dataGetParsed: GetParsedDataInputSchema,
	dataListEmails: ListEmailsInputSchema,
};

export const ParsioEndpointOutputSchemas = {
	mailboxesList: ListMailboxesOutputSchema,
	mailboxesGet: GetMailboxOutputSchema,
	mailboxesCreate: CreateMailboxOutputSchema,
	mailboxesUpdate: UpdateMailboxOutputSchema,
	mailboxesDelete: DeleteMailboxOutputSchema,
	mailboxesTableFields: ListTableFieldsOutputSchema,
	documentsCreateSync: CreateDocumentSyncOutputSchema,
	documentsCreateAsync: CreateDocumentAsyncOutputSchema,
	documentsUploadSync: UploadDocumentSyncOutputSchema,
	documentsUploadAsync: UploadDocumentAsyncOutputSchema,
	documentsList: ListDocumentsOutputSchema,
	documentsGet: GetDocumentOutputSchema,
	documentsReparse: ReparseDocumentOutputSchema,
	documentsSkipMany: SkipDocumentsOutputSchema,
	webhooksListForMailbox: ListWebhooksOutputSchema,
	webhooksGet: GetWebhookOutputSchema,
	webhooksCreate: CreateWebhookOutputSchema,
	webhooksUpdate: UpdateWebhookOutputSchema,
	webhooksDelete: DeleteWebhooksOutputSchema,
	dataGetParsed: GetParsedDataOutputSchema,
	dataListEmails: ListEmailsOutputSchema,
};

export type ParsioEndpointInputs = {
	[K in keyof typeof ParsioEndpointInputSchemas]: z.input<
		(typeof ParsioEndpointInputSchemas)[K]
	>;
};

export type ParsioEndpointOutputs = {
	[K in keyof typeof ParsioEndpointOutputSchemas]: z.infer<
		(typeof ParsioEndpointOutputSchemas)[K]
	>;
};

/** Decodes a base64 file input into the Blob the multipart body needs. */
const MEDIA_TYPES: Record<string, string> = {
	pdf: 'application/pdf',
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	tif: 'image/tiff',
	tiff: 'image/tiff',
	txt: 'text/plain',
	csv: 'text/csv',
	html: 'text/html',
	htm: 'text/html',
	eml: 'message/rfc822',
	json: 'application/json',
	xml: 'application/xml',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

/**
 * The upload part carries the file name and a media type from its
 * extension: Parsio refuses a nameless octet-stream part with "File is not
 * allowed" (live, 2026-11-21).
 */
export function decodeFile(filename: string, contentBase64: string): File {
	const bytes = Buffer.from(contentBase64, 'base64');
	const extension = filename.split('.').pop()?.toLowerCase() ?? '';
	return new File([bytes], filename, {
		type: MEDIA_TYPES[extension] ?? 'application/octet-stream',
	});
}
