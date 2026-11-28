import { z } from 'zod';

// Inputs use DocuSeal's own parameter names from the official OpenAPI 3.1
// spec (console.docuseal.com/openapi.yml). Outputs are `.loose()` and their
// nullable fields `.nullish()`, so a field DocuSeal adds or omits cannot fail
// a call that has already happened. Statuses on outputs stay open strings:
// the spec's enums cover today's values and a value outside them must not
// fail a
// read that already happened.

// ── shared primitives ─────────────────────────────────────────────────────

export const PAGE_SIZES = [
	'Letter',
	'Legal',
	'Tabloid',
	'Ledger',
	'A0',
	'A1',
	'A2',
	'A3',
	'A4',
	'A5',
	'A6',
] as const;

export const FIELD_TYPES = [
	'heading',
	'text',
	'signature',
	'initials',
	'date',
	'number',
	'image',
	'checkbox',
	'multiple',
	'file',
	'radio',
	'select',
	'cells',
	'stamp',
	'payment',
	'phone',
	'verification',
	'kba',
	'strikethrough',
] as const;

export const FONTS = ['Times', 'Helvetica', 'Courier'] as const;
export const FONT_TYPES = ['bold', 'italic', 'bold_italic'] as const;
export const FIELD_ALIGNS = ['left', 'center', 'right'] as const;
export const FIELD_VALIGNS = ['top', 'center', 'bottom'] as const;
export const CURRENCIES = [
	'USD',
	'EUR',
	'GBP',
	'CAD',
	'AUD',
	'CHF',
	'SEK',
] as const;
export const SUBMITTERS_ORDERS = ['random', 'preserved'] as const;
export const SUBMISSION_STATUSES = [
	'completed',
	'declined',
	'expired',
	'pending',
] as const;

const IdSchema = z.number().int().positive().describe('The resource id.');

// DocuSeal pages by id cursor with a page size capped at 100.
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Results per page, 1-100. DocuSeal defaults to 10.');
const AfterSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe(
		'Id cursor: pass `pagination.next` from the previous page. Cloud returns records with a larger id; self-hosted 3.4.0 pages by descending id, so the cursor selects smaller ids there.',
	);
const BeforeSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe(
		'Id cursor for the other direction (`pagination.prev`); its sense is reversed on self-hosted 3.4.0 like `after`.',
	);

const MessageSchema = z
	.object({
		subject: z.string().optional(),
		body: z.string().optional(),
	})
	.loose();

const FieldValidationSchema = z
	.object({
		pattern: z.string().optional(),
		message: z.string().optional(),
		min: z.union([z.number(), z.string()]).nullish(),
		max: z.union([z.number(), z.string()]).nullish(),
		step: z.number().nullish(),
	})
	.loose();

const FieldPreferencesSchema = z
	.object({
		font_size: z.number().nullish(),
		font_type: z.enum(FONT_TYPES).nullish(),
		font: z.enum(FONTS).nullish(),
		color: z.string().nullish(),
		background: z.string().nullish(),
		align: z.enum(FIELD_ALIGNS).nullish(),
		valign: z.enum(FIELD_VALIGNS).nullish(),
		format: z.string().nullish(),
		price: z.number().nullish(),
		currency: z.enum(CURRENCIES).nullish(),
		// The spec takes a boolean or a number of visible characters.
		mask: z.union([z.boolean(), z.number().int()]).nullish(),
		reasons: z.array(z.string()).nullish(),
	})
	.loose();

// The spec types output preferences as open strings: a font or currency
// outside the input enums must not fail a read.
const FieldPreferencesOutputSchema = z
	.object({
		font_size: z.number().nullish(),
		font_type: z.string().nullish(),
		font: z.string().nullish(),
		color: z.string().nullish(),
		background: z.string().nullish(),
		align: z.string().nullish(),
		valign: z.string().nullish(),
		format: z.string().nullish(),
		price: z.number().nullish(),
		currency: z.string().nullish(),
		mask: z.union([z.boolean(), z.number()]).nullish(),
		reasons: z.array(z.string()).nullish(),
	})
	.loose();

const FieldAreaInputSchema = z.object({
	x: z.number(),
	y: z.number(),
	w: z.number(),
	h: z.number(),
	page: z.number().int(),
	option: z.string().optional(),
});

const TemplateFieldInputSchema = z.object({
	name: z.string().optional(),
	type: z.enum(FIELD_TYPES).optional(),
	role: z.string().optional(),
	required: z.boolean().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	areas: z.array(FieldAreaInputSchema).optional(),
	options: z.array(z.string()).optional(),
	validation: FieldValidationSchema.optional(),
	preferences: FieldPreferencesSchema.optional(),
});

const SubmitterFieldInputSchema = z.object({
	name: z.string(),
	// unknown: a field default can be any scalar or a list of them.
	default_value: z
		.union([z.string(), z.number(), z.boolean(), z.array(z.unknown())])
		.optional()
		.describe(
			'Pre-filled value. A base64 file or a public image URL sets a default signature or image field.',
		),
	readonly: z.boolean().optional(),
	required: z.boolean().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	validation: FieldValidationSchema.optional(),
	preferences: FieldPreferencesSchema.optional(),
});

const SubmitterInputSchema = z.object({
	name: z.string().optional(),
	role: z
		.string()
		.optional()
		.describe('Must match a role on the template, such as `First party`.'),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	// unknown: free-form field-name to value map; DocuSeal validates the keys.
	values: z.record(z.string(), z.unknown()).optional(),
	external_id: z.string().optional(),
	completed: z.boolean().optional(),
	// unknown: free-form metadata map, stored and returned verbatim.
	metadata: z.record(z.string(), z.unknown()).optional(),
	send_email: z.boolean().optional(),
	send_sms: z.boolean().optional(),
	reply_to: z.string().optional(),
	completed_redirect_url: z.string().optional(),
	order: z.number().int().optional(),
	require_phone_2fa: z.boolean().optional(),
	require_email_2fa: z.boolean().optional(),
	invite_by: z.string().optional(),
	message: MessageSchema.optional(),
	fields: z.array(SubmitterFieldInputSchema).optional(),
	roles: z.array(z.string()).optional(),
});

// ── outputs ───────────────────────────────────────────────────────────────

const PaginationSchema = z
	.object({
		count: z.number(),
		next: z
			.number()
			.nullish()
			.describe(
				'Largest id of this page; pass it as `after` for the next batch, null on the last page.',
			),
		prev: z.number().nullish(),
	})
	.loose();

const DocumentSchema = z.object({ name: z.string(), url: z.string() }).loose();

const TemplateDocumentSchema = z
	.object({
		id: z.number(),
		uuid: z.string(),
		url: z.string(),
		// null until DocuSeal has rendered the first-page preview.
		preview_image_url: z.string().nullish(),
		filename: z.string(),
	})
	.loose();

const SchemaDocumentSchema = z
	.object({ attachment_uuid: z.string(), name: z.string() })
	.loose();

const FieldAreaSchema = z
	.object({
		x: z.number(),
		y: z.number(),
		w: z.number(),
		h: z.number(),
		attachment_uuid: z.string(),
		page: z.number(),
	})
	.loose();

const FieldSchema = z
	.object({
		uuid: z.string(),
		submitter_uuid: z.string(),
		name: z.string().nullish(),
		type: z.string(),
		required: z.boolean().nullish(),
		preferences: FieldPreferencesOutputSchema.nullish(),
		areas: z.array(FieldAreaSchema).nullish(),
	})
	.loose();

const UserSchema = z
	.object({
		id: z.number(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string(),
	})
	.loose();

const TemplateSubmitterSchema = z
	.object({ name: z.string(), uuid: z.string() })
	.loose();

const TemplateSummarySchema = z
	.object({
		id: z.number(),
		name: z.string(),
		external_id: z.string().nullish(),
		folder_name: z.string(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.loose();

const FieldValueSchema = z
	.object({
		field: z.string(),
		// unknown: DocuSeal stores any scalar or array a field accepts.
		value: z.unknown().nullish(),
	})
	.loose();

const SubmissionEventSchema = z
	.object({
		id: z.number(),
		submitter_id: z.number(),
		event_type: z.string(),
		event_timestamp: z.string(),
		// unknown: event payload varies by event type.
		data: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const TemplateSchema = z
	.object({
		id: z.number(),
		slug: z.string(),
		name: z.string(),
		// unknown: free-form template preferences map.
		preferences: z.record(z.string(), z.unknown()),
		schema: z.array(SchemaDocumentSchema),
		fields: z.array(FieldSchema),
		// unknown: variable declarations, one entry per template variable.
		variables_schema: z.record(z.string(), z.unknown()),
		submitters: z.array(TemplateSubmitterSchema),
		author_id: z.number(),
		archived_at: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string(),
		source: z.string(),
		external_id: z.string().nullish(),
		folder_id: z.number().nullish(),
		folder_name: z.string().nullish(),
		shared_link: z.boolean().nullish(),
		author: UserSchema.nullish(),
		documents: z.array(TemplateDocumentSchema),
	})
	.loose();

export type DocuSealTemplate = z.infer<typeof TemplateSchema>;

const SubmitterBaseSchema = z
	.object({
		id: z.number(),
		submission_id: z.number(),
		uuid: z.string(),
		email: z.string().nullish(),
		slug: z.string(),
		sent_at: z.string().nullish(),
		opened_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		declined_at: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string(),
		name: z.string().nullish(),
		phone: z.string().nullish(),
		external_id: z.string().nullish(),
		status: z.string(),
		role: z.string(),
		// unknown: free-form metadata map, stored and returned verbatim.
		metadata: z.record(z.string(), z.unknown()),
		// unknown: free-form submitter preferences map.
		preferences: z.record(z.string(), z.unknown()),
	})
	.loose();

export type DocuSealSubmitter = z.infer<typeof SubmitterBaseSchema>;

// The spec marks these arrays required, but DocuSeal leaves `documents` out of
// the submitters POST /submissions returns (live, 3.4.0, 11-28), so none of
// them may fail a call that already happened.
const SubmitterSchema = SubmitterBaseSchema.extend({
	// unknown: the spec types the embedded template loosely.
	template: z.unknown().nullish(),
	submission_events: z.array(SubmissionEventSchema).nullish(),
	values: z.array(FieldValueSchema).nullish(),
	documents: z.array(DocumentSchema).nullish(),
});

const SubmitterSummarySchema = SubmitterBaseSchema;

const SubmissionSubmitterSchema = SubmitterBaseSchema.extend({
	values: z.array(FieldValueSchema).nullish(),
	documents: z.array(DocumentSchema).nullish(),
});

const SubmitterCreateResultSchema = SubmitterBaseSchema.extend({
	values: z.array(FieldValueSchema).nullish(),
	documents: z.array(DocumentSchema).nullish(),
	embed_src: z.string().nullish(),
});

const SubmissionSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		slug: z.string(),
		source: z.string(),
		// An open string: a value outside the spec enum must not fail a read.
		submitters_order: z.string().nullish(),
		expire_at: z.string().nullish(),
		// unknown: submission variable values, keyed by variable name.
		variables: z.record(z.string(), z.unknown()),
		audit_log_url: z.string().nullish(),
		combined_document_url: z.string().nullish(),
		created_at: z.string(),
		updated_at: z.string(),
		archived_at: z.string().nullish(),
		status: z.string(),
		completed_at: z.string().nullish(),
		// unknown: the spec types the creating user loosely.
		created_by_user: z.unknown().nullish(),
		template: TemplateSummarySchema.nullish(),
		// Required in the spec; PUT /submissions/{id} leaves submission_events
		// out (live, 3.4.0, 11-28).
		submitters: z.array(SubmissionSubmitterSchema).nullish(),
		submission_events: z.array(SubmissionEventSchema).nullish(),
		documents: z.array(DocumentSchema).nullish(),
	})
	.loose();

export type DocuSealSubmission = z.infer<typeof SubmissionSchema>;

const SubmissionListItemSchema = SubmissionSchema.omit({
	submission_events: true,
	documents: true,
}).extend({
	submitters: z.array(SubmitterSummarySchema),
});

const SubmissionCreateOneoffResultSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		submitters: z.array(SubmitterCreateResultSchema),
		source: z.string(),
		// An open string: a value outside the spec enum must not fail a read.
		submitters_order: z.string().nullish(),
		status: z.string(),
		expire_at: z.string().nullish(),
		created_at: z.string(),
		schema: z.array(SchemaDocumentSchema).nullish(),
		fields: z.array(FieldSchema).nullish(),
	})
	.loose();

const ArchiveResultSchema = z
	.object({
		id: z.number(),
		archived_at: z.string().nullish(),
	})
	.loose();

const TemplateUpdateResultSchema = z
	.object({ id: z.number(), updated_at: z.string() })
	.loose();

const SubmissionDocumentsSchema = z
	.object({ id: z.number(), documents: z.array(DocumentSchema) })
	.loose();

// ── templates.list ────────────────────────────────────────────────────────

const TemplatesListInputSchema = z.object({
	q: z.string().optional().describe('Filter by template name.'),
	slug: z.string().optional(),
	external_id: z.string().optional(),
	folder: z.string().optional().describe('Only templates in this folder name.'),
	archived: z
		.boolean()
		.optional()
		.describe('List archived templates instead of active ones.'),
	shared: z.boolean().optional(),
	limit: LimitSchema,
	after: AfterSchema,
	before: BeforeSchema,
});

export type TemplatesListInput = z.input<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = z.object({
	data: z.array(TemplateSchema),
	pagination: PaginationSchema,
});

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

// ── templates.get ─────────────────────────────────────────────────────────

const TemplatesGetInputSchema = z.object({ id: IdSchema });

export type TemplatesGetInput = z.input<typeof TemplatesGetInputSchema>;

export type TemplatesGetResponse = DocuSealTemplate;

// ── templates.update ──────────────────────────────────────────────────────

const TemplatesUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	external_id: z.string().optional(),
	folder_name: z.string().optional(),
	roles: z
		.array(z.string())
		.optional()
		.describe('Rename the signing roles, in order.'),
	archived: z
		.boolean()
		.optional()
		.describe('True archives the template; false restores an archived one.'),
});

export type TemplatesUpdateInput = z.input<typeof TemplatesUpdateInputSchema>;

export type TemplatesUpdateResponse = z.infer<
	typeof TemplateUpdateResultSchema
>;

// ── templates.archive ─────────────────────────────────────────────────────

const TemplatesArchiveInputSchema = z.object({
	id: IdSchema.describe(
		'The template to archive. DocuSeal has no hard delete; restore it with `templates.update` and `archived: false`.',
	),
});

export type TemplatesArchiveInput = z.input<typeof TemplatesArchiveInputSchema>;

export type TemplatesArchiveResponse = z.infer<typeof ArchiveResultSchema>;

// ── templates.createFromHtml ──────────────────────────────────────────────

const TemplatesCreateFromHtmlInputSchema = z.object({
	html: z
		.string()
		.optional()
		.describe(
			'HTML document with field tags such as `<text-field name="Name" role="Signer"></text-field>` and `<signature-field>`. Required unless `documents` is given.',
		),
	html_header: z.string().optional(),
	html_footer: z.string().optional(),
	name: z.string().optional(),
	size: z
		.enum(PAGE_SIZES)
		.optional()
		.describe('Page size for the generated PDF. DocuSeal defaults to Letter.'),
	external_id: z.string().optional(),
	folder_name: z.string().optional(),
	shared_link: z.boolean().optional().describe('DocuSeal defaults to true.'),
	documents: z
		.array(z.object({ html: z.string(), name: z.string().optional() }))
		.optional()
		.describe(
			'Documents of the template; use instead of `html` for several documents.',
		),
});

export type TemplatesCreateFromHtmlInput = z.input<
	typeof TemplatesCreateFromHtmlInputSchema
>;

export type TemplatesCreateFromHtmlResponse = DocuSealTemplate;

// ── templates.createFromPdf ───────────────────────────────────────────────

const PdfDocumentInputSchema = z.object({
	name: z.string(),
	file: z.string().describe('Base64-encoded file content.'),
	position: z.number().int().nullish(),
});

const TemplatesCreateFromPdfInputSchema = z.object({
	name: z.string().optional(),
	folder_name: z.string().optional(),
	external_id: z.string().optional(),
	shared_link: z.boolean().optional().describe('DocuSeal defaults to true.'),
	documents: z
		.array(
			PdfDocumentInputSchema.extend({
				fields: z.array(TemplateFieldInputSchema).optional(),
			}),
		)
		.describe('One entry per PDF; place signature fields with `fields`.'),
	flatten: z.boolean().optional().describe('DocuSeal defaults to false.'),
	remove_tags: z.boolean().optional().describe('DocuSeal defaults to true.'),
});

export type TemplatesCreateFromPdfInput = z.input<
	typeof TemplatesCreateFromPdfInputSchema
>;

export type TemplatesCreateFromPdfResponse = DocuSealTemplate;

// ── templates.createFromDocx ──────────────────────────────────────────────

const TemplatesCreateFromDocxInputSchema = z.object({
	name: z.string().optional(),
	external_id: z.string().optional(),
	folder_name: z.string().optional(),
	shared_link: z.boolean().optional().describe('DocuSeal defaults to true.'),
	documents: z
		.array(
			z.object({
				name: z.string(),
				file: z.string().describe('Base64-encoded DOCX content.'),
				dynamic: z
					.boolean()
					.optional()
					.describe(
						'DocuSeal defaults to false; true builds fields from `{{...}}` tags.',
					),
				fields: z.array(TemplateFieldInputSchema).optional(),
			}),
		)
		.describe('May require a paid (Pro) plan.'),
});

export type TemplatesCreateFromDocxInput = z.input<
	typeof TemplatesCreateFromDocxInputSchema
>;

export type TemplatesCreateFromDocxResponse = DocuSealTemplate;

// ── templates.clone ───────────────────────────────────────────────────────

const TemplatesCloneInputSchema = z.object({
	id: IdSchema.describe('The template to clone.'),
	name: z.string().optional(),
	folder_name: z.string().optional(),
	external_id: z.string().optional(),
});

export type TemplatesCloneInput = z.input<typeof TemplatesCloneInputSchema>;

export type TemplatesCloneResponse = DocuSealTemplate;

// ── templates.merge ───────────────────────────────────────────────────────

const TemplatesMergeInputSchema = z.object({
	template_ids: z
		.array(z.number().int())
		.min(1)
		.describe('Templates to merge, in order; the sources are kept.'),
	name: z.string().optional(),
	folder_name: z.string().optional(),
	external_id: z.string().optional(),
	shared_link: z.boolean().optional().describe('DocuSeal defaults to true.'),
	roles: z
		.array(z.string())
		.optional()
		.describe('Rename the combined roles, in order.'),
});

export type TemplatesMergeInput = z.input<typeof TemplatesMergeInputSchema>;

export type TemplatesMergeResponse = DocuSealTemplate;

// ── templates.updateDocuments ─────────────────────────────────────────────

const TemplatesUpdateDocumentsInputSchema = z.object({
	id: IdSchema.describe('The template whose documents change.'),
	documents: z
		.array(
			z.object({
				name: z.string().nullish(),
				file: z
					.string()
					.nullish()
					.describe('Base64-encoded PDF or DOCX content.'),
				html: z.string().nullish(),
				position: z.number().int().nullish(),
				replace: z.boolean().optional().describe('DocuSeal defaults to false.'),
				remove: z.boolean().optional().describe('DocuSeal defaults to false.'),
			}),
		)
		.optional()
		.describe(
			'Add, replace or remove documents on the template; leave out to only merge the existing ones.',
		),
	merge: z
		.boolean()
		.optional()
		.describe(
			"Merge all of the template's documents into one PDF. DocuSeal defaults to false.",
		),
});

export type TemplatesUpdateDocumentsInput = z.input<
	typeof TemplatesUpdateDocumentsInputSchema
>;

export type TemplatesUpdateDocumentsResponse = DocuSealTemplate;

// ── submissions.list ──────────────────────────────────────────────────────

const SubmissionsListInputSchema = z.object({
	template_id: z.number().int().optional(),
	status: z
		.enum(SUBMISSION_STATUSES)
		.optional()
		.describe('Only submissions in this status.'),
	q: z.string().optional(),
	slug: z.string().optional(),
	template_folder: z.string().optional(),
	archived: z
		.boolean()
		.optional()
		.describe('List archived submissions instead of active ones.'),
	limit: LimitSchema,
	after: AfterSchema,
	before: BeforeSchema,
});

export type SubmissionsListInput = z.input<typeof SubmissionsListInputSchema>;

const SubmissionsListResponseSchema = z.object({
	data: z.array(SubmissionListItemSchema),
	pagination: PaginationSchema,
});

export type SubmissionsListResponse = z.infer<
	typeof SubmissionsListResponseSchema
>;

// ── submissions.get ───────────────────────────────────────────────────────

const SubmissionsGetInputSchema = z.object({ id: IdSchema });

export type SubmissionsGetInput = z.input<typeof SubmissionsGetInputSchema>;

export type SubmissionsGetResponse = DocuSealSubmission;

// ── submissions.create ────────────────────────────────────────────────────

const SubmissionsCreateInputSchema = z.object({
	template_id: IdSchema.describe('The template to fill.'),
	submitters: z
		.array(
			SubmitterInputSchema.refine(
				(submitter) =>
					Boolean(
						submitter.email ||
							submitter.phone ||
							submitter.name ||
							submitter.invite_by,
					),
				{
					message:
						'Each submitter needs an email, phone, name or invite_by: DocuSeal refuses a role alone',
				},
			),
		)
		.min(1)
		.describe('One entry per signing role on the template.'),
	send_email: z
		.boolean()
		.optional()
		.describe(
			'DocuSeal defaults to true: signature-request emails go out on create.',
		),
	send_sms: z.boolean().optional().describe('DocuSeal defaults to false.'),
	order: z
		.enum(SUBMITTERS_ORDERS)
		.optional()
		.describe('DocuSeal defaults to preserved.'),
	completed_redirect_url: z.string().optional(),
	bcc_completed: z
		.string()
		.optional()
		.describe('Email address that receives the completed document.'),
	reply_to: z.string().optional(),
	expire_at: z
		.string()
		.optional()
		.describe(
			'Free-form datetime as DocuSeal accepts it, e.g. `2024-09-01 12:00:00 UTC`.',
		),
	// unknown: template variable values, keyed by variable name.
	variables: z.record(z.string(), z.unknown()).optional(),
	message: MessageSchema.optional(),
});

export type SubmissionsCreateInput = z.input<
	typeof SubmissionsCreateInputSchema
>;

// POST /submissions answers a bare array, one submitter per entry.
export type SubmissionsCreateResponse = z.infer<
	typeof SubmitterCreateResultSchema
>[];

// ── submissions.createFromPdf / FromHtml / FromDocx ───────────────────────

const OneoffBaseInputSchema = z.object({
	name: z.string().optional(),
	send_email: z
		.boolean()
		.optional()
		.describe(
			'DocuSeal defaults to true: signature-request emails go out on create.',
		),
	send_sms: z.boolean().optional().describe('DocuSeal defaults to false.'),
	order: z
		.enum(SUBMITTERS_ORDERS)
		.optional()
		.describe('DocuSeal defaults to preserved.'),
	completed_redirect_url: z.string().optional(),
	bcc_completed: z.string().optional(),
	reply_to: z.string().optional(),
	expire_at: z
		.string()
		.optional()
		.describe(
			'Free-form datetime as DocuSeal accepts it, e.g. `2024-09-01 12:00:00 UTC`.',
		),
	template_ids: z
		.array(z.number().int())
		.optional()
		.describe('Reuse field schema and submitters from these templates.'),
	submitters: z.array(SubmitterInputSchema).min(1),
	message: MessageSchema.optional(),
	merge_documents: z
		.boolean()
		.optional()
		.describe('DocuSeal defaults to false.'),
});

const SubmissionsCreateFromPdfInputSchema = OneoffBaseInputSchema.extend({
	documents: z
		.array(
			PdfDocumentInputSchema.extend({
				fields: z.array(TemplateFieldInputSchema).optional(),
			}),
		)
		.describe('One entry per PDF; place signature fields with `fields`.'),
	flatten: z.boolean().optional().describe('DocuSeal defaults to false.'),
	remove_tags: z.boolean().optional().describe('DocuSeal defaults to true.'),
});

export type SubmissionsCreateFromPdfInput = z.input<
	typeof SubmissionsCreateFromPdfInputSchema
>;

export type SubmissionsCreateFromPdfResponse = z.infer<
	typeof SubmissionCreateOneoffResultSchema
>;

const SubmissionsCreateFromHtmlInputSchema = OneoffBaseInputSchema.extend({
	documents: z
		.array(
			z.object({
				html: z.string(),
				name: z.string().nullish(),
				html_header: z.string().nullish(),
				html_footer: z.string().nullish(),
				size: z
					.enum(PAGE_SIZES)
					.nullish()
					.describe(
						'Page size for the generated PDF. DocuSeal defaults to Letter.',
					),
				position: z.number().int().nullish(),
			}),
		)
		.describe('One entry per HTML document.'),
});

export type SubmissionsCreateFromHtmlInput = z.input<
	typeof SubmissionsCreateFromHtmlInputSchema
>;

export type SubmissionsCreateFromHtmlResponse = z.infer<
	typeof SubmissionCreateOneoffResultSchema
>;

const SubmissionsCreateFromDocxInputSchema = OneoffBaseInputSchema.extend({
	// unknown: values for the DOCX's `[[variable_name]]` placeholders, keyed by name.
	variables: z.record(z.string(), z.unknown()).optional(),
	documents: z
		.array(PdfDocumentInputSchema)
		.describe('DOCX files with `{{...}}` tags; may require a paid (Pro) plan.'),
	remove_tags: z.boolean().optional().describe('DocuSeal defaults to true.'),
});

export type SubmissionsCreateFromDocxInput = z.input<
	typeof SubmissionsCreateFromDocxInputSchema
>;

export type SubmissionsCreateFromDocxResponse = z.infer<
	typeof SubmissionCreateOneoffResultSchema
>;

// ── submissions.createFromEmails ──────────────────────────────────────────

const SubmissionsCreateFromEmailsInputSchema = z.object({
	template_id: IdSchema.describe('The template to send.'),
	emails: z
		.string()
		.describe(
			'Comma-separated recipient addresses; DocuSeal creates one submission per address.',
		),
	send_email: z.boolean().optional().describe('DocuSeal defaults to true.'),
	message: MessageSchema.optional(),
});

export type SubmissionsCreateFromEmailsInput = z.input<
	typeof SubmissionsCreateFromEmailsInputSchema
>;

export type SubmissionsCreateFromEmailsResponse = z.infer<
	typeof SubmitterCreateResultSchema
>[];

// ── submissions.update ────────────────────────────────────────────────────

const SubmissionsUpdateInputSchema = z.object({
	id: IdSchema,
	name: z.string().optional(),
	expire_at: z
		.string()
		.nullish()
		.describe(
			'Free-form datetime as DocuSeal accepts it; null removes the expiry.',
		),
	archived: z
		.boolean()
		.optional()
		.describe('True archives the submission; false restores an archived one.'),
});

export type SubmissionsUpdateInput = z.input<
	typeof SubmissionsUpdateInputSchema
>;

export type SubmissionsUpdateResponse = DocuSealSubmission;

// ── submissions.archive ───────────────────────────────────────────────────

const SubmissionsArchiveInputSchema = z.object({
	id: IdSchema.describe(
		'The submission to archive. DocuSeal has no hard delete; restore it with `submissions.update` and `archived: false`.',
	),
});

export type SubmissionsArchiveInput = z.input<
	typeof SubmissionsArchiveInputSchema
>;

export type SubmissionsArchiveResponse = z.infer<typeof ArchiveResultSchema>;

// ── submissions.getDocuments ──────────────────────────────────────────────

const SubmissionsGetDocumentsInputSchema = z.object({
	id: IdSchema,
	merge: z
		.boolean()
		.optional()
		.describe(
			'True merges all documents into one PDF. DocuSeal defaults to false.',
		),
});

export type SubmissionsGetDocumentsInput = z.input<
	typeof SubmissionsGetDocumentsInputSchema
>;

export type SubmissionsGetDocumentsResponse = z.infer<
	typeof SubmissionDocumentsSchema
>;

// ── submitters.list ───────────────────────────────────────────────────────

const SubmittersListInputSchema = z.object({
	submission_id: z.number().int().optional(),
	q: z.string().optional(),
	slug: z.string().optional(),
	completed_after: z
		.string()
		.optional()
		.describe(
			'A date-time DocuSeal can parse, e.g. `2024-03-05 9:32:20` or `2024-08-01T12:00:00Z`.',
		),
	completed_before: z
		.string()
		.optional()
		.describe(
			'A date-time DocuSeal can parse, e.g. `2024-03-05 9:32:20` or `2024-08-01T12:00:00Z`.',
		),
	external_id: z.string().optional(),
	limit: LimitSchema,
	after: AfterSchema,
	before: BeforeSchema,
});

export type SubmittersListInput = z.input<typeof SubmittersListInputSchema>;

const SubmittersListResponseSchema = z.object({
	data: z.array(SubmitterSchema),
	pagination: PaginationSchema,
});

export type SubmittersListResponse = z.infer<
	typeof SubmittersListResponseSchema
>;

// ── submitters.get ────────────────────────────────────────────────────────

const SubmittersGetInputSchema = z.object({ id: IdSchema });

export type SubmittersGetInput = z.input<typeof SubmittersGetInputSchema>;

export type SubmittersGetResponse = z.infer<typeof SubmitterSchema>;

// ── submitters.update ─────────────────────────────────────────────────────

const SubmittersUpdateInputSchema = z.object({
	id: IdSchema.describe('The submitter to change.'),
	name: z.string().optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	// unknown: free-form field-name to value map; DocuSeal validates the keys.
	values: z.record(z.string(), z.unknown()).optional(),
	external_id: z.string().optional(),
	send_email: z
		.boolean()
		.optional()
		.describe('True re-sends the signature-request email.'),
	send_sms: z.boolean().optional(),
	reply_to: z.string().optional(),
	// Counter-signing cannot be undone: the document is signed on the
	// submitter's behalf and DocuSeal stamps the audit trail.
	completed: z
		.boolean()
		.optional()
		.describe(
			'True counter-signs the document as this submitter and cannot be undone.',
		),
	// unknown: free-form metadata map, stored and returned verbatim.
	metadata: z.record(z.string(), z.unknown()).optional(),
	completed_redirect_url: z.string().optional(),
	require_phone_2fa: z
		.boolean()
		.optional()
		.describe('DocuSeal defaults to false.'),
	require_email_2fa: z
		.boolean()
		.optional()
		.describe('DocuSeal defaults to false.'),
	message: MessageSchema.optional(),
	fields: z.array(SubmitterFieldInputSchema).optional(),
});

export type SubmittersUpdateInput = z.input<typeof SubmittersUpdateInputSchema>;

export type SubmittersUpdateResponse = z.infer<
	typeof SubmitterCreateResultSchema
>;

// ── registries ────────────────────────────────────────────────────────────

// ── routes beyond the published spec ─────────────────────────────────────
// DocuSeal serves these from app/controllers/api (users, form_events,
// submission_events, tools) in the same release as the spec routes; the
// OpenAPI file leaves them out. Checked live on 3.4.0 (11-28).

const UsersMeInputSchema = z.object({});

const UsersMeResponseSchema = z
	.object({
		id: z.number(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

export type UsersMeInput = z.input<typeof UsersMeInputSchema>;
export type UsersMeResponse = z.infer<typeof UsersMeResponseSchema>;

// Event lists page by completion time in Unix seconds, not by id.
const EventsListInputSchema = z.object({
	limit: LimitSchema,
	after: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe(
			'Unix seconds: only events completed after this time. Pass `pagination.next` from the previous page.',
		),
	before: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Unix seconds: only events completed before this time.'),
});

const EventPaginationSchema = z
	.object({
		count: z.number(),
		next: z.number().nullish(),
		prev: z.number().nullish(),
	})
	.loose();

const EventsListFormCompletedResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					event_type: z.string(),
					timestamp: z.string().nullish(),
					// The same submitter object a form.completed webhook carries.
					data: z.object({ id: z.number() }).loose(),
				})
				.loose(),
		),
		pagination: EventPaginationSchema,
	})
	.loose();

const EventsListSubmissionCompletedResponseSchema = z
	.object({
		data: z.array(
			z
				.object({
					event_type: z.string(),
					timestamp: z.string().nullish(),
					// The same submission object submissions.get returns.
					data: z.object({ id: z.number() }).loose(),
				})
				.loose(),
		),
		pagination: EventPaginationSchema,
	})
	.loose();

export type EventsListInput = z.input<typeof EventsListInputSchema>;
export type EventsListFormCompletedResponse = z.infer<
	typeof EventsListFormCompletedResponseSchema
>;
export type EventsListSubmissionCompletedResponse = z.infer<
	typeof EventsListSubmissionCompletedResponseSchema
>;

const ToolsMergePdfsInputSchema = z.object({
	files: z
		.array(z.string())
		.min(2)
		.describe('Base64-encoded PDF files, merged in this order (at least 2).'),
});

const ToolsMergePdfsResponseSchema = z
	.object({
		data: z.string().describe('The merged PDF, base64-encoded.'),
	})
	.loose();

const ToolsVerifyPdfInputSchema = z.object({
	file: z.string().describe('A base64-encoded signed PDF.'),
});

const ToolsVerifyPdfResponseSchema = z
	.object({
		checksum_status: z
			.string()
			.describe(
				'`verified` when the file matches a document this account completed, else `not_found`.',
			),
		signatures: z.array(
			z
				.object({
					verification_result: z
						.array(
							z
								.object({
									type: z.string().nullish(),
									content: z.string().nullish(),
								})
								.loose(),
						)
						.nullish(),
					signer_name: z.string().nullish(),
					signing_reason: z.string().nullish(),
					signing_time: z.string().nullish(),
					signature_type: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type ToolsMergePdfsInput = z.input<typeof ToolsMergePdfsInputSchema>;
export type ToolsMergePdfsResponse = z.infer<
	typeof ToolsMergePdfsResponseSchema
>;
export type ToolsVerifyPdfInput = z.input<typeof ToolsVerifyPdfInputSchema>;
export type ToolsVerifyPdfResponse = z.infer<
	typeof ToolsVerifyPdfResponseSchema
>;

export type DocuSealEndpointInputs = {
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesArchive: TemplatesArchiveInput;
	templatesCreateFromHtml: TemplatesCreateFromHtmlInput;
	templatesCreateFromPdf: TemplatesCreateFromPdfInput;
	templatesCreateFromDocx: TemplatesCreateFromDocxInput;
	templatesClone: TemplatesCloneInput;
	templatesMerge: TemplatesMergeInput;
	templatesUpdateDocuments: TemplatesUpdateDocumentsInput;
	submissionsList: SubmissionsListInput;
	submissionsGet: SubmissionsGetInput;
	submissionsCreate: SubmissionsCreateInput;
	submissionsCreateFromPdf: SubmissionsCreateFromPdfInput;
	submissionsCreateFromHtml: SubmissionsCreateFromHtmlInput;
	submissionsCreateFromDocx: SubmissionsCreateFromDocxInput;
	submissionsCreateFromEmails: SubmissionsCreateFromEmailsInput;
	submissionsUpdate: SubmissionsUpdateInput;
	submissionsArchive: SubmissionsArchiveInput;
	submissionsGetDocuments: SubmissionsGetDocumentsInput;
	submittersList: SubmittersListInput;
	submittersGet: SubmittersGetInput;
	submittersUpdate: SubmittersUpdateInput;
	usersMe: UsersMeInput;
	eventsListFormCompleted: EventsListInput;
	eventsListSubmissionCompleted: EventsListInput;
	toolsMergePdfs: ToolsMergePdfsInput;
	toolsVerifyPdf: ToolsVerifyPdfInput;
};

export type DocuSealEndpointOutputs = {
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	templatesUpdate: TemplatesUpdateResponse;
	templatesArchive: TemplatesArchiveResponse;
	templatesCreateFromHtml: TemplatesCreateFromHtmlResponse;
	templatesCreateFromPdf: TemplatesCreateFromPdfResponse;
	templatesCreateFromDocx: TemplatesCreateFromDocxResponse;
	templatesClone: TemplatesCloneResponse;
	templatesMerge: TemplatesMergeResponse;
	templatesUpdateDocuments: TemplatesUpdateDocumentsResponse;
	submissionsList: SubmissionsListResponse;
	submissionsGet: SubmissionsGetResponse;
	submissionsCreate: SubmissionsCreateResponse;
	submissionsCreateFromPdf: SubmissionsCreateFromPdfResponse;
	submissionsCreateFromHtml: SubmissionsCreateFromHtmlResponse;
	submissionsCreateFromDocx: SubmissionsCreateFromDocxResponse;
	submissionsCreateFromEmails: SubmissionsCreateFromEmailsResponse;
	submissionsUpdate: SubmissionsUpdateResponse;
	submissionsArchive: SubmissionsArchiveResponse;
	submissionsGetDocuments: SubmissionsGetDocumentsResponse;
	submittersList: SubmittersListResponse;
	submittersGet: SubmittersGetResponse;
	submittersUpdate: SubmittersUpdateResponse;
	usersMe: UsersMeResponse;
	eventsListFormCompleted: EventsListFormCompletedResponse;
	eventsListSubmissionCompleted: EventsListSubmissionCompletedResponse;
	toolsMergePdfs: ToolsMergePdfsResponse;
	toolsVerifyPdf: ToolsVerifyPdfResponse;
};

export const DocuSealEndpointInputSchemas = {
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesArchive: TemplatesArchiveInputSchema,
	templatesCreateFromHtml: TemplatesCreateFromHtmlInputSchema,
	templatesCreateFromPdf: TemplatesCreateFromPdfInputSchema,
	templatesCreateFromDocx: TemplatesCreateFromDocxInputSchema,
	templatesClone: TemplatesCloneInputSchema,
	templatesMerge: TemplatesMergeInputSchema,
	templatesUpdateDocuments: TemplatesUpdateDocumentsInputSchema,
	submissionsList: SubmissionsListInputSchema,
	submissionsGet: SubmissionsGetInputSchema,
	submissionsCreate: SubmissionsCreateInputSchema,
	submissionsCreateFromPdf: SubmissionsCreateFromPdfInputSchema,
	submissionsCreateFromHtml: SubmissionsCreateFromHtmlInputSchema,
	submissionsCreateFromDocx: SubmissionsCreateFromDocxInputSchema,
	submissionsCreateFromEmails: SubmissionsCreateFromEmailsInputSchema,
	submissionsUpdate: SubmissionsUpdateInputSchema,
	submissionsArchive: SubmissionsArchiveInputSchema,
	submissionsGetDocuments: SubmissionsGetDocumentsInputSchema,
	submittersList: SubmittersListInputSchema,
	submittersGet: SubmittersGetInputSchema,
	submittersUpdate: SubmittersUpdateInputSchema,
	usersMe: UsersMeInputSchema,
	eventsListFormCompleted: EventsListInputSchema,
	eventsListSubmissionCompleted: EventsListInputSchema,
	toolsMergePdfs: ToolsMergePdfsInputSchema,
	toolsVerifyPdf: ToolsVerifyPdfInputSchema,
} as const;

export const DocuSealEndpointOutputSchemas = {
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplateSchema,
	templatesUpdate: TemplateUpdateResultSchema,
	templatesArchive: ArchiveResultSchema,
	templatesCreateFromHtml: TemplateSchema,
	templatesCreateFromPdf: TemplateSchema,
	templatesCreateFromDocx: TemplateSchema,
	templatesClone: TemplateSchema,
	templatesMerge: TemplateSchema,
	templatesUpdateDocuments: TemplateSchema,
	submissionsList: SubmissionsListResponseSchema,
	submissionsGet: SubmissionSchema,
	submissionsCreate: z.array(SubmitterCreateResultSchema),
	submissionsCreateFromPdf: SubmissionCreateOneoffResultSchema,
	submissionsCreateFromHtml: SubmissionCreateOneoffResultSchema,
	submissionsCreateFromDocx: SubmissionCreateOneoffResultSchema,
	submissionsCreateFromEmails: z.array(SubmitterCreateResultSchema),
	submissionsUpdate: SubmissionSchema,
	submissionsArchive: ArchiveResultSchema,
	submissionsGetDocuments: SubmissionDocumentsSchema,
	submittersList: SubmittersListResponseSchema,
	submittersGet: SubmitterSchema,
	submittersUpdate: SubmitterCreateResultSchema,
	usersMe: UsersMeResponseSchema,
	eventsListFormCompleted: EventsListFormCompletedResponseSchema,
	eventsListSubmissionCompleted: EventsListSubmissionCompletedResponseSchema,
	toolsMergePdfs: ToolsMergePdfsResponseSchema,
	toolsVerifyPdf: ToolsVerifyPdfResponseSchema,
} as const;
