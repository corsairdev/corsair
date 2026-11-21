import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** ISO-8601 timestamp, as the API's date-time query parameters expect. */
const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const isoDatetime = z
	.string()
	.regex(
		ISO_DATETIME_REGEX,
		'Expected an ISO-8601 timestamp like 2024-07-02T16:21:35.770196Z',
	);

/** A recipient of a document: who signs or is copied, and in which order. */
export const RecipientSchema = z
	.object({
		email: z
			.string()
			.min(1)
			.nullish()
			.describe(
				'Recipient email address; a recipient needs an email or a phone number',
			),
		first_name: z.string().nullish().describe('Recipient first name'),
		last_name: z.string().nullish().describe('Recipient last name'),
		phone: z.string().nullish().describe('Recipient phone number'),
		role: z
			.string()
			.nullish()
			.describe('Role name from the template (who signs what)'),
		signing_order: z
			.number()
			.int()
			.nullish()
			.describe('Position of the recipient in the signing order'),
	})
	.loose()
	.describe('A document recipient');
export type Recipient = z.infer<typeof RecipientSchema>;

/** A recipient as the API returns it: any field can be null or missing. */
const RecipientResponseSchema = z
	.object({
		id: z.string().nullish().describe('Recipient id'),
		email: z.string().nullish().describe('Recipient email address'),
		first_name: z.string().nullish().describe('Recipient first name'),
		last_name: z.string().nullish().describe('Recipient last name'),
		phone: z.string().nullish().describe('Recipient phone number'),
		role: z.string().nullish().describe('Role name from the template'),
		signing_order: z
			.number()
			.nullish()
			.describe('Position of the recipient in the signing order'),
	})
	.loose()
	.describe('A document recipient as stored');

/** A template token to replace, e.g. "cosigner". */
export const TokenSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe('The token (variable) name, e.g. Client.CompanyName'),
		value: z.string().describe('Value the token is replaced with'),
	})
	.loose()
	.describe('A document token replacement');

export const DocumentStatusSchema = z
	.string()
	.min(1)
	.describe(
		'Document lifecycle status, e.g. document.draft, document.sent, document.completed',
	);

// ── documents ──────────────────────────────────────────────────────────────

// The API's DocumentOrderingFieldsEnum: each field also sorts descending
// with a "-" prefix, and date_status_changed is the documented default.
const ORDER_BY_VALUES = [
	'name',
	'date_created',
	'date_status_changed',
	'date_of_last_action',
	'date_modified',
	'date_sent',
	'date_completed',
	'date_expiration',
	'date_declined',
	'status',
	'-name',
	'-date_created',
	'-date_status_changed',
	'-date_of_last_action',
	'-date_modified',
	'-date_sent',
	'-date_completed',
	'-date_expiration',
	'-date_declined',
	'-status',
] as const;

const orderBy = z
	.enum(ORDER_BY_VALUES)
	.optional()
	.describe(
		'Sort field; values with a "-" prefix sort descending. Defaults to date_status_changed.',
	);

/**
 * A single metadata filter, in the API's documented format
 * `metadata_{key}={value}`, repeated once per filter.
 */
const metadataFilter = z
	.string()
	.regex(
		/^metadata_[^=]+=[^=]+$/,
		'Expected the format metadata_key=value, e.g. metadata_opportunity_id=2181432',
	)
	.describe('Metadata filter, e.g. "metadata_opportunity_id=2181432"');

export const ListDocumentsInputSchema = z
	.object({
		count: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Results per page; default 50, maximum 100'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number, starting at 1'),
		status: z
			.number()
			.int()
			.optional()
			.describe(
				'Filter by numeric status: 0 document.draft, 1 document.sent, 2 document.completed, 3 document.uploaded, 4 document.error, 5 document.viewed, 6 document.waiting_approval',
			),
		statusNe: z
			.number()
			.int()
			.optional()
			.describe('Exclude this numeric status (sent as status__ne)'),
		deleted: z.boolean().optional().describe('Return only deleted documents'),
		q: z.string().optional().describe('Filter by name or reference number'),
		id: z.string().optional().describe('Search for a document by its id'),
		folderUuid: z
			.string()
			.optional()
			.describe('Filter by folder (sent as folder_uuid)'),
		templateId: z
			.string()
			.optional()
			.describe('Filter by template (sent as template_id)'),
		contactId: z
			.string()
			.optional()
			.describe('Filter by contact (sent as contact_id)'),
		orderBy: orderBy.describe('Sort field (sent as order_by)'),
		createdFrom: isoDatetime
			.optional()
			.describe('Created at or after (sent as created_from)'),
		createdTo: isoDatetime
			.optional()
			.describe('Created at or before (sent as created_to)'),
		completedFrom: isoDatetime
			.optional()
			.describe('Completed at or after (sent as completed_from)'),
		completedTo: isoDatetime
			.optional()
			.describe('Completed at or before (sent as completed_to)'),
		modifiedFrom: isoDatetime
			.optional()
			.describe('Modified at or after (sent as modified_from)'),
		modifiedTo: isoDatetime
			.optional()
			.describe('Modified at or before (sent as modified_to)'),
		metadata: z
			.array(metadataFilter)
			.optional()
			.describe('Metadata filters, repeated once per entry'),
		tag: z.string().optional().describe('Filter by tag'),
	})
	.superRefine((input, ctx) => {
		if (
			input.createdFrom &&
			input.createdTo &&
			// Date.parse, not string order: fractional seconds of different
			// precision sort wrongly as strings ("...35Z" > "...35.1Z").
			Date.parse(input.createdFrom) > Date.parse(input.createdTo)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['createdTo'],
				message: 'createdTo must not be earlier than createdFrom',
			});
		}
	})
	.describe('Query parameters for listing documents');
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;

/** A document as the list and details endpoints return it. */
export const DocumentSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		name: z.string().describe('Document name'),
		status: DocumentStatusSchema,
		uuid: z.string().nullish().describe('Document uuid'),
		version: z.string().nullish().describe('Document version'),
		folder_uuid: z.string().nullish().describe('Folder the document lives in'),
		ref_number: z
			.string()
			.nullish()
			.describe('Reference number from the template'),
		date_created: isoDatetime.nullish().describe('Creation timestamp'),
		date_modified: isoDatetime
			.nullish()
			.describe('Last modification timestamp'),
		date_sent: isoDatetime
			.nullish()
			.describe('Sent timestamp; null until sent'),
		date_completed: isoDatetime.nullish().describe('Completion timestamp'),
		expiration_date: isoDatetime.nullish().describe('Expiration timestamp'),
	})
	.loose()
	.describe('A PandaDoc document');
export type Document = z.infer<typeof DocumentSchema>;

export const ListDocumentsOutputSchema = z
	.object({
		results: z.array(DocumentSchema).describe('Documents on this page'),
	})
	.loose()
	.describe('A page of documents');
export type ListDocumentsOutput = z.infer<typeof ListDocumentsOutputSchema>;

export const GetDocumentInputSchema = z
	.object({ id: z.string().min(1).describe('Document id') })
	.describe('Input for reading one document');
export type GetDocumentInput = z.infer<typeof GetDocumentInputSchema>;

export const GetDocumentOutputSchema = DocumentSchema.extend({
	recipients: z
		.array(RecipientResponseSchema)
		.nullish()
		.describe('Recipients with their roles and signing order'),
	tokens: z
		.array(
			z
				.object({
					name: z.string().nullish().describe('Token name'),
					value: z.string().nullish().describe('Token value'),
				})
				.loose(),
		)
		.nullish()
		.describe('Template tokens (variables) and their values'),
	// unknown: metadata values are whatever the caller stored on the document.
	metadata: z
		.record(z.string(), z.unknown())
		.nullish()
		.describe('Metadata stored on the document'),
	tags: z.array(z.string()).nullish().describe('Tags on the document'),
}).describe('Full document details');
export type GetDocumentOutput = z.infer<typeof GetDocumentOutputSchema>;

const OwnerSchema = z
	.object({
		membership_id: z
			.string()
			.nullish()
			.describe('Workspace membership id of the owner'),
		email: z.string().nullish().describe('Email of the owner'),
	})
	.loose()
	.describe('The workspace member the document belongs to');

export const CreateDocumentInputSchema = z
	.object({
		template_uuid: z
			.string()
			.min(1)
			.optional()
			.describe('Create from this template'),
		url: z
			.string()
			.url()
			.optional()
			.describe('Create from a publicly accessible HTTPS PDF'),
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Document name; required when creating from a PDF URL'),
		recipients: z
			.array(RecipientSchema)
			.optional()
			.describe('Recipients; required when creating from a template'),
		fields: z
			// unknown: field values are provider-defined (strings, booleans,
			// arrays), so the record cannot be stricter.
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Prefilled fields, keyed by field name or uuid; values are strings, booleans or arrays',
			),
		tokens: z.array(TokenSchema).optional().describe('Token replacements'),
		metadata: z
			.record(z.string(), z.string())
			.optional()
			.describe(
				'Arbitrary metadata key/value pairs, filterable on documents.list',
			),
		tags: z.array(z.string()).optional().describe('Tags for the document'),
		folder_uuid: z
			.string()
			.optional()
			.describe('Place the document in this folder'),
		owner: OwnerSchema.optional().describe(
			'Create the document on a member’s behalf',
		),
		parse_form_fields: z
			.boolean()
			.optional()
			.describe(
				'Convert native PDF form fields into PandaDoc fields (PDF creation only)',
			),
		editable: z
			.boolean()
			.optional()
			.describe('Let recipients edit the uploaded PDF (PDF creation only)'),
	})
	.superRefine((input, ctx) => {
		// The API documents two creation bodies: from a template
		// (template_uuid + recipients) and from a PDF URL (url + name).
		for (const [index, recipient] of (input.recipients ?? []).entries()) {
			if (!recipient.email && !recipient.phone) {
				ctx.addIssue({
					code: 'custom',
					path: ['recipients', index, 'email'],
					message: 'Each recipient needs an email or a phone number',
				});
			}
		}
		if (input.template_uuid && input.url) {
			ctx.addIssue({
				code: 'custom',
				path: ['url'],
				message: 'Pass template_uuid or url, not both',
			});
		}
		if (!input.template_uuid && !input.url) {
			ctx.addIssue({
				code: 'custom',
				path: ['template_uuid'],
				message:
					'Either template_uuid (create from template) or url (create from a PDF) is required',
			});
		}
		if (
			input.template_uuid &&
			(!input.recipients || input.recipients.length === 0)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['recipients'],
				message: 'recipients is required when creating from a template',
			});
		}
		if (input.url && !input.name) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'name is required when creating from a PDF URL',
			});
		}
	})
	.describe(
		'Create a document from a template or from a publicly available PDF',
	);
export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;

export const CreateDocumentOutputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		name: z.string().nullish().describe('Document name'),
		status: DocumentStatusSchema.nullish(),
		uuid: z.string().nullish().describe('Document uuid'),
		version: z.string().nullish().describe('Document version'),
		date_created: isoDatetime.nullish().describe('Creation timestamp'),
		recipients: z
			.array(RecipientResponseSchema)
			.nullish()
			.describe('Recipients as stored'),
	})
	.loose()
	.describe(
		'The document as created; creation from a template or PDF is asynchronous, so the status starts at document.create_pending',
	);
export type CreateDocumentOutput = z.infer<typeof CreateDocumentOutputSchema>;

export const SendDocumentInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		message: z.string().optional().describe('Email body for the recipients'),
		subject: z.string().optional().describe('Email subject for the recipients'),
		silent: z
			.boolean()
			.optional()
			.describe(
				'Send without email notifications to the recipients and the sender, and without scheduled reminders (approval notifications still go out); leave false for recipients to get the signing email',
			),
		reply_to: z.string().email().optional().describe('Reply-to email address'),
		sender: z
			.object({
				membership_id: z
					.string()
					.optional()
					.describe('Workspace membership id of the sender'),
				email: z
					.string()
					.email()
					.optional()
					.describe('Email of a workspace member to send as'),
			})
			.loose()
			.optional()
			.describe('Send as another workspace member, by email or membership_id'),
		forwarding_settings: z
			.object({
				forwarding_allowed: z
					.boolean()
					.optional()
					.describe('Let recipients forward the document to another address'),
				forwarding_with_reassigning_allowed: z
					.boolean()
					.optional()
					.describe(
						'Let recipients hand their fields (signature included) to someone else',
					),
			})
			.loose()
			.optional()
			.describe('Control whether recipients can forward the document'),
	})
	.describe('Send a draft document to its recipients for signing');
export type SendDocumentInput = z.infer<typeof SendDocumentInputSchema>;

export const SendDocumentOutputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		name: z.string().nullish().describe('Document name'),
		status: DocumentStatusSchema.nullish(),
		uuid: z.string().nullish().describe('Document uuid'),
		version: z.string().nullish().describe('Document version'),
		recipients: z
			.array(RecipientResponseSchema)
			.nullish()
			.describe('Recipients the document was sent to'),
	})
	.loose()
	.describe('The sent document');
export type SendDocumentOutput = z.infer<typeof SendDocumentOutputSchema>;

export const UpdateDocumentInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		name: z.string().min(1).optional().describe('New document name'),
		recipients: z
			.array(RecipientSchema)
			.optional()
			.describe('Replace the recipients'),
		fields: z
			// unknown: field values are provider-defined, so the record cannot
			// be stricter.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Updated prefilled field values'),
		tokens: z.array(TokenSchema).optional().describe('Token replacements'),
		metadata: z
			.record(z.string(), z.string())
			.optional()
			.describe('Metadata key/value pairs'),
		tags: z.array(z.string()).optional().describe('Tags for the document'),
	})
	.describe('Update a draft document');
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentInputSchema>;

export const UpdateDocumentOutputSchema = z
	.object({
		id: z.string().describe('Updated document id'),
		success: z.boolean().describe('Whether the update succeeded'),
	})
	.describe('The document was updated (the API answers 204 with no body)');
export type UpdateDocumentOutput = z.infer<typeof UpdateDocumentOutputSchema>;

export const DeleteDocumentInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		forever: z
			.boolean()
			.optional()
			.describe('Delete permanently instead of moving to deleted documents'),
	})
	.describe('Delete a document');
export type DeleteDocumentInput = z.infer<typeof DeleteDocumentInputSchema>;

export const DeleteDocumentOutputSchema = z
	.object({
		id: z.string().describe('Deleted document id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The document was deleted (the API answers 204 with no body)');
export type DeleteDocumentOutput = z.infer<typeof DeleteDocumentOutputSchema>;

export const DownloadDocumentInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		watermark_color: z
			.string()
			.optional()
			.describe('Watermark color, e.g. #FF0000'),
		watermark_font_size: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Watermark font size'),
		watermark_opacity: z
			.number()
			.min(0)
			.max(1)
			.optional()
			.describe('Watermark opacity, 0.0-1.0'),
		watermark_text: z.string().optional().describe('Watermark text'),
		separate_files: z
			.boolean()
			.optional()
			.describe('Return a zip of per-recipient files instead of one PDF'),
	})
	.describe('Download a document as PDF');
export type DownloadDocumentInput = z.infer<typeof DownloadDocumentInputSchema>;

/**
 * A downloaded file. PandaDoc answers 202 while it renders, with an empty
 * body; the endpoint reports that as `pending: true` with no content rather
 * than as a zero-byte file.
 */
export const FileDownloadSchema = z
	.object({
		contentType: z.string().describe('Media type, for example application/pdf'),
		byteLength: z.number().describe('Size of the file in bytes'),
		contentBase64: z
			.string()
			.optional()
			.describe('The PDF, base64-encoded; missing while the render is pending'),
		pending: z
			.boolean()
			.describe(
				'True when PandaDoc answered 202 and the file is still rendering',
			),
	})
	.describe('A downloaded PDF file');
export type FileDownload = z.infer<typeof FileDownloadSchema>;

export const DownloadDocumentOutputSchema =
	FileDownloadSchema.describe('The document PDF');
export type DownloadDocumentOutput = z.infer<
	typeof DownloadDocumentOutputSchema
>;

export const DownloadProtectedDocumentInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		separate_files: z
			.boolean()
			.optional()
			.describe('Return a zip of per-recipient files instead of one PDF'),
	})
	.describe('Download a completed document as a protected (flattened) PDF');
export type DownloadProtectedDocumentInput = z.infer<
	typeof DownloadProtectedDocumentInputSchema
>;

export const DownloadProtectedDocumentOutputSchema =
	FileDownloadSchema.describe('The protected PDF');
export type DownloadProtectedDocumentOutput = z.infer<
	typeof DownloadProtectedDocumentOutputSchema
>;

export const ListDocumentFieldsInputSchema = z
	.object({ id: z.string().min(1).describe('Document id') })
	.describe('Input for reading the fields placed on a document');
export type ListDocumentFieldsInput = z.infer<
	typeof ListDocumentFieldsInputSchema
>;

export const ListDocumentFieldsOutputSchema = z
	.object({
		fields: z
			.array(
				z
					.object({
						uuid: z.string().nullish().describe('Field uuid'),
						name: z.string().nullish().describe('Field name'),
						type: z
							.string()
							.nullish()
							.describe('Field type, e.g. text, signature, date'),
					})
					.loose(),
			)
			.describe('Fields placed on the document, with their coordinates'),
	})
	.loose()
	.describe('The fields placed on a document');
export type ListDocumentFieldsOutput = z.infer<
	typeof ListDocumentFieldsOutputSchema
>;

const FieldLayoutSchema = z
	.object({
		page: z.number().int().min(0).describe('Page the field sits on'),
		position: z
			.object({
				offset_x: z.number().min(0).describe('X offset in percentage points'),
				offset_y: z.number().min(0).describe('Y offset in percentage points'),
				anchor_point: z
					.enum(['topleft', 'topright', 'bottomleft', 'bottomright'])
					.describe('Which point of the field the offsets measure from'),
			})
			.loose()
			.describe('Field position on the page'),
		style: z
			.object({
				width: z
					.number()
					.int()
					.min(0)
					.describe('Field width in percentage points'),
				height: z
					.number()
					.int()
					.min(0)
					.describe('Field height in percentage points'),
			})
			.loose()
			.describe('Field size'),
	})
	.loose()
	.describe('Where and how large the field is, as the API documents it');

export const CreateDocumentFieldsInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		fields: z
			.array(
				z
					.object({
						type: z
							.enum([
								'checkbox',
								'collect_file',
								'date',
								'dropdown',
								'initials',
								'payment_details',
								'radio_buttons',
								'signature',
								'stamp',
								'text',
							])
							.describe('Field type'),
						layout: FieldLayoutSchema,
						field_id: z
							.string()
							.nullish()
							.describe('Optional unique identifier'),
						merge_field: z
							.string()
							.nullish()
							.describe('CRM or API key this field populates from'),
						assigned_to: z
							.string()
							.nullish()
							.describe('Recipient uuid the field is assigned to'),
					})
					.loose(),
			)
			.min(1)
			.describe('Fields to place on the document'),
	})
	.describe('Place new fields on a document');
export type CreateDocumentFieldsInput = z.infer<
	typeof CreateDocumentFieldsInputSchema
>;

export const CreateDocumentFieldsOutputSchema = z
	.object({
		fields: z
			.array(
				z
					.object({
						uuid: z.string().nullish().describe('Field uuid'),
						name: z.string().nullish().describe('Field name'),
						type: z.string().nullish().describe('Field type'),
					})
					.loose(),
			)
			.describe('All fields on the document after the change'),
	})
	.loose()
	.describe('The fields on the document after placement');
export type CreateDocumentFieldsOutput = z.infer<
	typeof CreateDocumentFieldsOutputSchema
>;

export const MoveDocumentInputSchema = z
	.object({
		id: z.string().min(1).describe('Document id'),
		folderId: z
			.string()
			.min(1)
			.describe('Destination folder uuid (sent in the path as folder_id)'),
	})
	.describe('Move a document into a folder');
export type MoveDocumentInput = z.infer<typeof MoveDocumentInputSchema>;

export const MoveDocumentOutputSchema = z
	.object({
		id: z.string().describe('Moved document id'),
		folderId: z.string().describe('Folder the document now lives in'),
		success: z.boolean().describe('Whether the move succeeded'),
	})
	.describe('The document was moved (the API answers 204 with no body)');
export type MoveDocumentOutput = z.infer<typeof MoveDocumentOutputSchema>;

// ── templates ──────────────────────────────────────────────────────────────

export const ListTemplatesInputSchema = z
	.object({
		count: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Results per page; default 50, maximum 100'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number, starting at 1'),
		q: z.string().optional().describe('Filter by template name'),
		id: z.string().optional().describe('Search for a template by its id'),
		folderUuid: z
			.string()
			.optional()
			.describe('Filter by folder (sent as folder_uuid)'),
		deleted: z.boolean().optional().describe('Return only deleted templates'),
		shared: z
			.boolean()
			.optional()
			.describe('Return templates shared with the workspace'),
		tag: z.string().optional().describe('Filter by tag'),
		fields: z
			.array(z.enum(['content_date_modified']))
			.optional()
			.describe(
				'Extra fields to include, sent comma-separated; the API documents content_date_modified',
			),
	})
	.describe('Query parameters for listing templates');
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const TemplateSchema = z
	.object({
		id: z.string().min(1).describe('Template id'),
		name: z.string().describe('Template name'),
		status: z
			.string()
			.nullish()
			.describe('Template status, e.g. template.active'),
		folder_uuid: z.string().nullish().describe('Folder the template lives in'),
		date_created: isoDatetime.nullish().describe('Creation timestamp'),
		date_modified: isoDatetime
			.nullish()
			.describe('Last modification timestamp'),
		tags: z.array(z.string()).nullish().describe('Tags on the template'),
	})
	.loose()
	.describe('A PandaDoc template');
export type Template = z.infer<typeof TemplateSchema>;

export const ListTemplatesOutputSchema = z
	.object({
		results: z.array(TemplateSchema).describe('Templates on this page'),
	})
	.loose()
	.describe('A page of templates');
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const GetTemplateInputSchema = z
	.object({ id: z.string().min(1).describe('Template id') })
	.describe('Input for reading one template');
export type GetTemplateInput = z.infer<typeof GetTemplateInputSchema>;

export const GetTemplateOutputSchema = z
	.object({
		id: z.string().min(1).describe('Template id'),
		name: z.string().describe('Template name'),
		folder_uuid: z.string().nullish().describe('Folder the template lives in'),
		date_created: isoDatetime.nullish().describe('Creation timestamp'),
		date_modified: isoDatetime
			.nullish()
			.describe('Last modification timestamp'),
		tokens: z
			.array(
				z.object({ name: z.string().nullish().describe('Token name') }).loose(),
			)
			.nullish()
			.describe('Tokens the template declares'),
		fields: z
			// unknown: template field definitions are provider-defined objects
			// keyed by field markup, so the record cannot be stricter.
			.array(z.record(z.string(), z.unknown()))
			.nullish()
			.describe('Fields the template places on documents'),
		roles: z
			.array(
				z.object({ name: z.string().nullish().describe('Role name') }).loose(),
			)
			.nullish()
			.describe('Signing roles the template defines'),
		tags: z.array(z.string()).nullish().describe('Tags on the template'),
		// unknown: template metadata is caller-defined, so the record cannot
		// be stricter.
		metadata: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Template metadata'),
	})
	.loose()
	.describe('Full template details, including fields, tokens and roles');
export type GetTemplateOutput = z.infer<typeof GetTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z
	.object({ id: z.string().min(1).describe('Template id') })
	.describe('Delete a template');
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;

export const DeleteTemplateOutputSchema = z
	.object({
		id: z.string().describe('Deleted template id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The template was deleted (the API answers 204 with no body)');
export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

// ── contacts ───────────────────────────────────────────────────────────────

export const ContactSchema = z
	.object({
		id: z.string().min(1).describe('Contact id'),
		email: z.string().nullish().describe('Contact email address'),
		first_name: z.string().nullish().describe('Contact first name'),
		last_name: z.string().nullish().describe('Contact last name'),
		company: z.string().nullish().describe('Contact company'),
		job_title: z.string().nullish().describe('Contact job title'),
		phone: z.string().nullish().describe('Contact phone number'),
		country: z.string().nullish().describe('Contact country'),
		state: z.string().nullish().describe('Contact state'),
		street_address: z.string().nullish().describe('Contact street address'),
		city: z.string().nullish().describe('Contact city'),
		postal_code: z.string().nullish().describe('Contact postal code'),
	})
	.loose()
	.describe('A PandaDoc contact');
export type Contact = z.infer<typeof ContactSchema>;

export const ListContactsInputSchema = z
	.object({
		email: z
			.string()
			.email()
			.optional()
			.describe('Filter contacts by exact email address'),
	})
	.describe('Query parameters for listing contacts');
export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;

export const ListContactsOutputSchema = z
	.object({
		results: z.array(ContactSchema).describe('Contacts matching the filter'),
	})
	.loose()
	.describe('The contacts matching the filter');
export type ListContactsOutput = z.infer<typeof ListContactsOutputSchema>;

export const GetContactInputSchema = z
	.object({ id: z.string().min(1).describe('Contact id') })
	.describe('Input for reading one contact');
export type GetContactInput = z.infer<typeof GetContactInputSchema>;

export const GetContactOutputSchema = ContactSchema.describe(
	'Full contact details',
);
export type GetContactOutput = z.infer<typeof GetContactOutputSchema>;

const ContactBodyFields = {
	first_name: z.string().nullish().describe('Contact first name'),
	last_name: z.string().nullish().describe('Contact last name'),
	company: z.string().nullish().describe('Contact company'),
	job_title: z.string().nullish().describe('Contact job title'),
	phone: z.string().nullish().describe('Contact phone number'),
	country: z.string().nullish().describe('Contact country'),
	state: z.string().nullish().describe('Contact state'),
	street_address: z.string().nullish().describe('Contact street address'),
	city: z.string().nullish().describe('Contact city'),
	postal_code: z.string().nullish().describe('Contact postal code'),
};

export const CreateContactInputSchema = z
	.object({
		email: z.string().email().optional().describe('Contact email address'),
		...ContactBodyFields,
	})
	.superRefine((input, ctx) => {
		// The API accepts a contact with no email, but then nothing identifies
		// it to a human; a name is the minimum the reference examples show.
		const hasName =
			input.first_name !== undefined || input.last_name !== undefined;
		if (!input.email && !hasName) {
			ctx.addIssue({
				code: 'custom',
				path: ['email'],
				message: 'Give the contact an email address or a first/last name',
			});
		}
	})
	.describe('Create a contact');
export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;

export const CreateContactOutputSchema = ContactSchema.describe(
	'The contact as created',
);
export type CreateContactOutput = z.infer<typeof CreateContactOutputSchema>;

export const UpdateContactInputSchema = z
	.object({
		id: z.string().min(1).describe('Contact id'),
		...ContactBodyFields,
	})
	.describe(
		'Update a contact; the API does not change the email of an existing contact',
	);
export type UpdateContactInput = z.infer<typeof UpdateContactInputSchema>;

export const UpdateContactOutputSchema = ContactSchema.describe(
	'The contact as updated',
);
export type UpdateContactOutput = z.infer<typeof UpdateContactOutputSchema>;

export const DeleteContactInputSchema = z
	.object({ id: z.string().min(1).describe('Contact id') })
	.describe('Delete a contact');
export type DeleteContactInput = z.infer<typeof DeleteContactInputSchema>;

export const DeleteContactOutputSchema = z
	.object({
		id: z.string().describe('Deleted contact id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The contact was deleted (the API answers 204 with no body)');
export type DeleteContactOutput = z.infer<typeof DeleteContactOutputSchema>;

// ── folders ────────────────────────────────────────────────────────────────

export const FolderSchema = z
	.object({
		uuid: z.string().min(1).describe('Folder uuid'),
		name: z.string().describe('Folder name'),
		parent_uuid: z.string().nullish().describe('Parent folder uuid'),
		date_created: isoDatetime.nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A PandaDoc documents folder');
export type Folder = z.infer<typeof FolderSchema>;

export const ListFoldersInputSchema = z
	.object({
		parentUuid: z
			.string()
			.optional()
			.describe('List children of this folder (sent as parent_uuid)'),
		count: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Results per page; default 50, maximum 100'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number, starting at 1'),
	})
	.describe('Query parameters for listing document folders');
export type ListFoldersInput = z.infer<typeof ListFoldersInputSchema>;

export const ListFoldersOutputSchema = z
	.object({ results: z.array(FolderSchema).describe('Folders on this page') })
	.loose()
	.describe('A page of document folders');
export type ListFoldersOutput = z.infer<typeof ListFoldersOutputSchema>;

export const CreateFolderInputSchema = z
	.object({
		name: z.string().min(1).describe('Folder name'),
		parent_uuid: z
			.string()
			.optional()
			.describe('Create the folder inside this parent folder'),
	})
	.describe('Create a documents folder');
export type CreateFolderInput = z.infer<typeof CreateFolderInputSchema>;

export const CreateFolderOutputSchema = FolderSchema.describe(
	'The folder as created',
);
export type CreateFolderOutput = z.infer<typeof CreateFolderOutputSchema>;

export const RenameFolderInputSchema = z
	.object({
		id: z.string().min(1).describe('Folder uuid'),
		name: z.string().min(1).describe('New folder name'),
	})
	.describe('Rename a documents folder');
export type RenameFolderInput = z.infer<typeof RenameFolderInputSchema>;

export const RenameFolderOutputSchema = FolderSchema.describe(
	'The folder as renamed',
);
export type RenameFolderOutput = z.infer<typeof RenameFolderOutputSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

const WEBHOOK_PAYLOAD_VALUES = [
	'metadata',
	'fields',
	'products',
	'tokens',
	'pricing',
] as const;

export const WebhookSubscriptionSchema = z
	.object({
		uuid: z.string().min(1).describe('Subscription id'),
		name: z.string().describe('Subscription name'),
		url: z.string().url().describe('Endpoint deliveries are posted to'),
		active: z.boolean().nullish().describe('Whether deliveries are active'),
		triggers: z
			.array(z.string())
			.describe('Event names the subscription delivers'),
		payload: z
			.array(z.enum(WEBHOOK_PAYLOAD_VALUES))
			.nullish()
			.describe('Extra payload sections the subscription asks for'),
		workspace_id: z
			.string()
			.nullish()
			.describe('Workspace the subscription belongs to'),
		shared_key: z
			.string()
			.nullish()
			.describe(
				'Key used to verify delivery signatures (HMAC-SHA256 over the raw body, hex, in the signature query parameter)',
			),
		status: z
			.enum(['ACTIVE', 'INACTIVE', 'DEACTIVATED'])
			.nullish()
			.describe('Subscription status'),
	})
	.loose()
	.describe('A PandaDoc webhook subscription');
export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

export const ListWebhookSubscriptionsInputSchema = z
	.object({})
	.describe('Input for listing webhook subscriptions (none)');
export type ListWebhookSubscriptionsInput = z.infer<
	typeof ListWebhookSubscriptionsInputSchema
>;

export const ListWebhookSubscriptionsOutputSchema = z
	.object({
		items: z
			.array(WebhookSubscriptionSchema)
			.describe('Subscriptions in the workspace'),
	})
	.loose()
	.describe('The webhook subscriptions in the workspace');
export type ListWebhookSubscriptionsOutput = z.infer<
	typeof ListWebhookSubscriptionsOutputSchema
>;

export const CreateWebhookSubscriptionInputSchema = z
	.object({
		name: z.string().min(1).describe('Subscription name'),
		url: z.string().url().describe('Endpoint deliveries are posted to'),
		triggers: z
			.array(z.string().min(1))
			.min(1)
			.describe(
				'Event names to subscribe to, e.g. document_state_changed, recipient_completed, document_deleted, document_updated, document_creation_failed, document_completed_pdf_ready, quote_updated, template_created, template_updated, template_deleted',
			),
		active: z.boolean().optional().describe('Whether deliveries start active'),
		payload: z
			.array(z.enum(WEBHOOK_PAYLOAD_VALUES))
			.optional()
			.describe('Extra payload sections to include in every delivery'),
	})
	.describe('Create a webhook subscription');
export type CreateWebhookSubscriptionInput = z.infer<
	typeof CreateWebhookSubscriptionInputSchema
>;

export const CreateWebhookSubscriptionOutputSchema =
	WebhookSubscriptionSchema.describe(
		'The subscription as created; the response carries the shared_key used to verify deliveries',
	);
export type CreateWebhookSubscriptionOutput = z.infer<
	typeof CreateWebhookSubscriptionOutputSchema
>;

export const DeleteWebhookSubscriptionInputSchema = z
	.object({ id: z.string().min(1).describe('Subscription uuid') })
	.describe('Delete a webhook subscription');
export type DeleteWebhookSubscriptionInput = z.infer<
	typeof DeleteWebhookSubscriptionInputSchema
>;

export const DeleteWebhookSubscriptionOutputSchema = z
	.object({
		id: z.string().describe('Deleted subscription id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The subscription was deleted (the API answers 204 with no body)');
export type DeleteWebhookSubscriptionOutput = z.infer<
	typeof DeleteWebhookSubscriptionOutputSchema
>;

export const GetWebhookEventInputSchema = z
	.object({
		id: z
			.string()
			.min(1)
			.describe(
				'Webhook event id (from the X-PandaDoc-Webhook-Event-Id delivery header)',
			),
	})
	.describe('Input for reading one webhook event');
export type GetWebhookEventInput = z.infer<typeof GetWebhookEventInputSchema>;

export const GetWebhookEventOutputSchema = z
	.object({
		id: z.string().nullish().describe('Event id'),
		event: z.string().nullish().describe('Event name'),
		created_on: isoDatetime.nullish().describe('When the event happened'),
		// unknown: the data object's keys depend on the event type, so it
		// stays an open record.
		data: z.record(z.string(), z.unknown()).nullish().describe('Event payload'),
	})
	.loose()
	.describe('A webhook event as recorded by PandaDoc');
export type GetWebhookEventOutput = z.infer<typeof GetWebhookEventOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PandadocEndpointInputSchemas = {
	documentsList: ListDocumentsInputSchema,
	documentsGet: GetDocumentInputSchema,
	documentsCreate: CreateDocumentInputSchema,
	documentsSend: SendDocumentInputSchema,
	documentsUpdate: UpdateDocumentInputSchema,
	documentsDelete: DeleteDocumentInputSchema,
	documentsDownload: DownloadDocumentInputSchema,
	documentsDownloadProtected: DownloadProtectedDocumentInputSchema,
	documentsListFields: ListDocumentFieldsInputSchema,
	documentsCreateFields: CreateDocumentFieldsInputSchema,
	documentsMove: MoveDocumentInputSchema,
	templatesList: ListTemplatesInputSchema,
	templatesGet: GetTemplateInputSchema,
	templatesDelete: DeleteTemplateInputSchema,
	contactsList: ListContactsInputSchema,
	contactsGet: GetContactInputSchema,
	contactsCreate: CreateContactInputSchema,
	contactsUpdate: UpdateContactInputSchema,
	contactsDelete: DeleteContactInputSchema,
	foldersList: ListFoldersInputSchema,
	foldersCreate: CreateFolderInputSchema,
	foldersRename: RenameFolderInputSchema,
	webhooksListSubscriptions: ListWebhookSubscriptionsInputSchema,
	webhooksCreateSubscription: CreateWebhookSubscriptionInputSchema,
	webhooksDeleteSubscription: DeleteWebhookSubscriptionInputSchema,
	webhooksGetEvent: GetWebhookEventInputSchema,
};

export const PandadocEndpointOutputSchemas = {
	documentsList: ListDocumentsOutputSchema,
	documentsGet: GetDocumentOutputSchema,
	documentsCreate: CreateDocumentOutputSchema,
	documentsSend: SendDocumentOutputSchema,
	documentsUpdate: UpdateDocumentOutputSchema,
	documentsDelete: DeleteDocumentOutputSchema,
	documentsDownload: DownloadDocumentOutputSchema,
	documentsDownloadProtected: DownloadProtectedDocumentOutputSchema,
	documentsListFields: ListDocumentFieldsOutputSchema,
	documentsCreateFields: CreateDocumentFieldsOutputSchema,
	documentsMove: MoveDocumentOutputSchema,
	templatesList: ListTemplatesOutputSchema,
	templatesGet: GetTemplateOutputSchema,
	templatesDelete: DeleteTemplateOutputSchema,
	contactsList: ListContactsOutputSchema,
	contactsGet: GetContactOutputSchema,
	contactsCreate: CreateContactOutputSchema,
	contactsUpdate: UpdateContactOutputSchema,
	contactsDelete: DeleteContactOutputSchema,
	foldersList: ListFoldersOutputSchema,
	foldersCreate: CreateFolderOutputSchema,
	foldersRename: RenameFolderOutputSchema,
	webhooksListSubscriptions: ListWebhookSubscriptionsOutputSchema,
	webhooksCreateSubscription: CreateWebhookSubscriptionOutputSchema,
	webhooksDeleteSubscription: DeleteWebhookSubscriptionOutputSchema,
	webhooksGetEvent: GetWebhookEventOutputSchema,
};

export type PandadocEndpointInputs = {
	[K in keyof typeof PandadocEndpointInputSchemas]: z.input<
		(typeof PandadocEndpointInputSchemas)[K]
	>;
};

export type PandadocEndpointOutputs = {
	[K in keyof typeof PandadocEndpointOutputSchemas]: z.infer<
		(typeof PandadocEndpointOutputSchemas)[K]
	>;
};
