import { z } from 'zod';

/**
 * SignWell's own names are used throughout; this plugin does not rename fields.
 * Outputs are `.loose()` and their optional fields `.nullish()` so a field
 * SignWell starts or stops sending cannot fail a call that already happened.
 * Contract: https://developers.signwell.com/reference/getting-started-with-your-api-1
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const Uuid = z.uuid();

const Email = z.string().describe('An email address.');

const Timestamp = z.string().describe('ISO 8601 timestamp.');

/**
 * SignWell accepts a file either as a public URL or as base64, never both. The
 * refinement is here rather than at the provider because a request carrying
 * both is rejected with a 422 that costs an API call.
 */
const DocumentFileSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.describe(
				'File name with its extension. SignWell reads the extension: .pdf, .doc, .docx, .pages, .ppt, .pptx, .key, .xls, .xlsx, .numbers, .jpg, .jpeg, .png, .tiff, .tif, .webp, .html, .htm.',
			),
		file_url: z.string().optional().describe('A publicly reachable URL.'),
		file_base64: z
			.string()
			.optional()
			.describe('The file itself, as an RFC 4648 base64 string.'),
	})
	.superRefine((value, ctx) => {
		const given = [value.file_url, value.file_base64].filter(
			(entry) => entry !== undefined,
		);
		if (given.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['file_url'],
				message:
					'Supply exactly one of file_url or file_base64 for each file; SignWell rejects a file with both or neither.',
			});
		}
	});

const RecipientSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			'Your own identifier for this recipient, used to attach fields. Number them 1, 2, 3.',
		),
	name: z
		.string()
		.min(1)
		.optional()
		.describe('Required on 21 CFR Part 11 documents.'),
	email: Email.optional().describe('Required unless delivery_method is sms.'),
	phone_number: z
		.string()
		.optional()
		.describe('Required when delivery_method is sms or email_and_sms.'),
	send_sms: z.boolean().optional(),
	send_sms_delay: z
		.number()
		.int()
		.optional()
		.describe('Minutes to wait before texting this recipient.'),
	delivery_method: z
		.enum(['email', 'sms', 'email_and_sms'])
		.optional()
		.describe('How to notify this recipient. Defaults to email.'),
	subject: z
		.string()
		.optional()
		.describe('Overrides the document subject for this recipient.'),
	message: z
		.string()
		.optional()
		.describe('Overrides the document message for this recipient.'),
	send_email: z
		.boolean()
		.optional()
		.describe(
			'Deprecated by SignWell in favour of delivery_method, but still accepted.',
		),
	send_email_delay: z
		.number()
		.int()
		.optional()
		.describe('Minutes to wait before notifying this recipient.'),
	signing_order: z
		.number()
		.int()
		.optional()
		.describe('Only meaningful when the document sets apply_signing_order.'),
	passcode: z
		.string()
		.optional()
		.describe(
			'The signer must enter this before opening the document. SignWell generates one itself on 21 CFR Part 11 documents, so a passcode here returns a 422 there.',
		),
});

const PlaceholderSchema = z.object({
	id: z.string().min(1).describe('Your own identifier for this placeholder.'),
	name: z.string().min(1),
	preassigned_recipient_name: z.string().optional(),
	preassigned_recipient_email: Email.optional(),
});

const CopiedContactSchema = z.object({
	name: z.string().min(1).optional(),
	email: Email,
});

const CopiedPlaceholderSchema = z.object({
	name: z.string().min(1),
	preassigned_recipient_name: z.string().optional(),
	preassigned_recipient_email: Email.optional(),
});

const FieldTypeSchema = z.enum([
	'initials',
	'signature',
	'checkbox',
	'date',
	'select',
	'text',
	'dropdown',
	'autofill_company',
	'autofill_email',
	'autofill_first_name',
	'autofill_last_name',
	'autofill_name',
	'autofill_phone',
	'autofill_title',
	'autofill_date_signed',
]);

/**
 * SignWell wants one array of fields per file, so a document sends
 * `[[field, field], [field]]`. A field belongs to either a recipient (document)
 * or a placeholder (template), which is why the id field differs per route.
 */
const baseField = {
	x: z.number().describe('Horizontal position in pixels on its page.'),
	y: z.number().describe('Vertical position in pixels on its page.'),
	page: z.number().int().min(1).describe('1-based page number.'),
	type: FieldTypeSchema,
	required: z.boolean().optional().describe('Defaults to true.'),
	api_id: z
		.string()
		.optional()
		.describe('Your identifier for this field, used by conditional rules.'),
	value: z
		.union([z.string(), z.boolean(), z.number()])
		.optional()
		.describe('Prefilled value: text, a number, or true for a checkbox.'),
	label: z.string().optional(),
	name: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	validation: z
		.enum([
			'no_text_validation',
			'numbers',
			'letters',
			'email_address',
			'us_phone_number',
			'us_zip_code',
			'us_ssn',
			'us_age',
			'alphanumeric',
			'us_bank_routing_number',
			'us_bank_account_number',
			'custom',
		])
		.optional()
		.describe('Text field validation; custom uses validation_regex.'),
	validation_regex: z.string().optional(),
	validation_regex_error_message: z.string().optional(),
	date_format: z.string().optional().describe('Date fields, e.g. MM/DD/YYYY.'),
	fixed_width: z.boolean().optional(),
	lock_sign_date: z.boolean().optional(),
	options: z
		.array(
			z.union([
				z.string(),
				z.object({
					name: z.string().min(1),
					api_id: z.string().optional(),
					is_other: z.boolean().optional(),
				}),
			]),
		)
		.optional()
		.describe('Choices for a dropdown or select field.'),
	default_option: z.string().optional(),
	allow_other: z.boolean().optional(),
};

const DocumentFieldSchema = z.object({
	...baseField,
	recipient_id: z
		.string()
		.min(1)
		.describe("The id of one of this document's recipients."),
});

const TemplateFieldSchema = z.object({
	...baseField,
	placeholder_id: z
		.string()
		.min(1)
		.describe("The id of one of this template's placeholders."),
});

/** One array per file, in the same order as `files`. */
const documentFields = z
	.array(z.array(DocumentFieldSchema))
	.describe(
		'Fields per file; one inner array for each entry in files. SignWell requires at least one field when draft is false and with_signature_page is not set.',
	);

const templateFields = z
	.array(z.array(TemplateFieldSchema))
	.describe('Fields per file; one inner array for each entry in files.');

const LabelSchema = z.object({
	name: z.string().min(1),
	color: z.string().optional().describe('A hex colour such as #ff0000.'),
});

const AttachmentRequestSchema = z.object({
	name: z.string().min(1),
	recipient_id: z
		.string()
		.min(1)
		.describe('The recipient who uploads the attachment.'),
	required: z.boolean().optional().describe('Defaults to true.'),
});

const TemplateAttachmentRequestSchema = z.object({
	name: z.string().min(1),
	placeholder_id: z
		.string()
		.min(1)
		.describe('The placeholder whose recipient uploads the attachment.'),
	required: z.boolean().optional().describe('Defaults to true.'),
});

const ConditionalRuleSchema = z
	.object({
		id: z
			.string()
			.optional()
			.describe('On an update, the rule to change; omit it to add a rule.'),
		deleted: z
			.boolean()
			.optional()
			.describe('On an update, true together with id removes the rule.'),
		target_id: z
			.string()
			.min(1)
			.optional()
			.describe('api_id of the field that owns the rule. Required on create.'),
		action_type: z
			.enum(['show', 'hide', 'require'])
			.optional()
			.describe('Required on create.'),
		action_field_ids: z
			.array(z.string())
			.optional()
			.describe('api_ids of the fields the action applies to.'),
		conditions: z
			.array(
				z.object({
					condition_type: z.enum(['any_of', 'all_of', 'none_of', 'not_all_of']),
					status: z.enum(['completed', 'not_completed']),
					field_api_ids: z.array(z.string()).min(1),
					join_operator: z.enum(['and_operator', 'or_operator']).optional(),
					position: z.number().int().optional(),
				}),
			)
			.min(1)
			.max(5)
			.optional()
			.describe('1 to 5 conditions that trigger the rule.'),
	})
	.describe('A conditional logic rule, as SignWell documents it.');

/** The options every create route shares, minus the body-specific ones. */
const commonSendingOptions = {
	test_mode: z
		.boolean()
		.optional()
		.describe(
			'SignWell does not bill a test-mode document and it is not legally binding. Defaults to false.',
		),
	name: z
		.string()
		.optional()
		.describe('The document name shown in the SignWell UI.'),
	subject: z
		.string()
		.optional()
		.describe('Email subject. Applies to email notifications only.'),
	message: z
		.string()
		.optional()
		.describe('Email body. Applies to email notifications only.'),
	draft: z
		.boolean()
		.optional()
		.describe(
			'When true the document is not sent. Defaults to false, which sends it immediately.',
		),
	expires_in: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Days before the request expires.'),
	reminders: z
		.boolean()
		.optional()
		.describe(
			'Send reminders on days 3, 6 and 9 to recipients who have not signed.',
		),
	apply_signing_order: z
		.boolean()
		.optional()
		.describe('Recipients sign one at a time, in order.'),
	redirect_url: z
		.string()
		.optional()
		.describe('Where recipients land after signing.'),
	decline_redirect_url: z
		.string()
		.optional()
		.describe('Where recipients land after declining.'),
	allow_decline: z.boolean().optional(),
	allow_reassign: z.boolean().optional(),
	language: z
		.string()
		.optional()
		.describe('A supported language code, such as en or fr.'),
	text_tags: z
		.boolean()
		.optional()
		.describe(
			'Place fields with text tags in the document instead of coordinates.',
		),
	metadata: z
		.record(z.string(), z.string())
		.optional()
		.describe('Your own key-value data, returned on every read.'),
	labels: z.array(LabelSchema).optional(),
	attachment_requests: z.array(AttachmentRequestSchema).optional(),
	conditional_rules: z.array(ConditionalRuleSchema).optional(),
	api_application_id: z
		.string()
		.optional()
		.describe("Use a specific API application's branding and settings."),
};

// ── Output pieces ─────────────────────────────────────────────────────────

const DocumentRecipientSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string().nullish(),
		body: z.string().nullish(),
		message: z.string().nullish(),
		subject: z.string().nullish(),
		send_email: z.boolean().nullish(),
		send_email_delay: z.number().nullish(),
		delivery_method: z.enum(['email', 'sms', 'email_and_sms']).nullish(),
		signing_order: z.number().nullish(),
		signing_url: z.string().nullish(),
		embedded_signing_url: z.string().nullish(),
		bounced: z.boolean().nullish(),
		status: z.string().nullish(),
	})
	.loose();

export type SignwellDocumentRecipient = z.infer<typeof DocumentRecipientSchema>;

const EmbeddedBrandingSchema = z
	.object({
		logo_file: z.string().nullish(),
		logo_url: z.string().nullish(),
		primary_color: z.string().nullish(),
		link_text_color: z.string().nullish(),
		button_text_color: z.string().nullish(),
		buttons_border_radius: z.number().nullish(),
	})
	.loose();

/** A document as `documents.get` and every create route return it. */
const DocumentSchema = z
	.object({
		id: z.string(),
		test_mode: z.boolean(),
		cfr_part11: z.boolean().optional(),
		cfr_part11_signing_mode: z.enum(['streamlined', 'per_signature']).nullish(),
		api_application_id: z.string().nullish(),
		requester_email_address: z.string().nullish(),
		custom_requester_name: z.string().nullish(),
		custom_requester_email: z.string().nullish(),
		name: z.string().nullish(),
		subject: z.string().nullish(),
		message: z.string().nullish(),
		metadata: z.record(z.string(), z.string()).nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
		recipients: z.array(DocumentRecipientSchema).nullish(),
		/**
		 * SignWell documents the values in prose rather than an enum, so this
		 * stays a string: a new status must not fail a read that succeeded.
		 */
		status: z
			.string()
			.nullish()
			.describe(
				'Draft, Created, Sending, Sent, Pending, Viewed, Completed, Manually completed, Declined, Canceled, Bounced, Blocked, Error or Expired.',
			),
		reminders: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		/**
		 * The spec types this as a branding object, but SignWell's own event
		 * example sends `false` for a document with no embedded settings, so
		 * both shapes are accepted.
		 */
		embedded: z.union([z.boolean(), EmbeddedBrandingSchema]).nullish(),
		embedded_signing: z.boolean().nullish(),
		embedded_edit_url: z.string().nullish(),
		embedded_preview_url: z.string().nullish(),
		apply_signing_order: z.boolean().nullish(),
		redirect_url: z.string().nullish(),
		decline_redirect_url: z.string().nullish(),
		language: z.string().nullish(),
		expires_in: z.number().nullish(),
		decline_message: z.string().nullish(),
		error_message: z.string().nullish(),
		template_id: z.string().nullish(),
		template_ids: z.array(z.string()).nullish(),
		embedded_signing_notifications: z.boolean().nullish(),
		files: z.array(z.object({ name: z.string().nullish() }).loose()).nullish(),
		copied_contacts: z.array(CopiedContactSchema.loose()).nullish(),
		allow_decline: z.boolean().nullish(),
		allow_reassign: z.boolean().nullish(),
		labels: z.array(LabelSchema.loose()).nullish(),
		conditional_rules: z
			.array(z.record(z.string(), z.unknown())) // unknown: rule shape per type
			.nullish(),
	})
	.loose();

export type SignwellDocument = z.infer<typeof DocumentSchema>;

const TemplateSchema = z
	.object({
		id: z.string(),
		api_application_id: z.string().nullish(),
		requester_email_address: z.string().nullish(),
		custom_requester_name: z.string().nullish(),
		custom_requester_email: z.string().nullish(),
		name: z.string().nullish(),
		subject: z.string().nullish(),
		message: z.string().nullish(),
		metadata: z.record(z.string(), z.string()).nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
		placeholders: z
			.array(z.record(z.string(), z.unknown())) // unknown: placeholder extras
			.nullish(),
		copied_placeholders: z
			.array(z.record(z.string(), z.unknown())) // unknown: see above
			.nullish(),
		status: z.string().nullish(),
		reminders: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		embedded_edit_url: z.string().nullish(),
		template_link: z.string().nullish(),
		template_id: z.string().nullish(),
		apply_signing_order: z.boolean().nullish(),
		redirect_url: z.string().nullish(),
		decline_redirect_url: z.string().nullish(),
		language: z.string().nullish(),
		expires_in: z.number().nullish(),
		files: z.array(z.object({ name: z.string().nullish() }).loose()).nullish(),
		allow_decline: z.boolean().nullish(),
		allow_reassign: z.boolean().nullish(),
		labels: z.array(LabelSchema.loose()).nullish(),
	})
	.loose();

export type SignwellTemplate = z.infer<typeof TemplateSchema>;

const WebhookSchema = z
	.object({
		id: Uuid,
		callback_url: z.string(),
		api_application_id: z.string().nullish(),
	})
	.loose();

export type SignwellWebhook = z.infer<typeof WebhookSchema>;

const AccountPreferencesSchema = z
	.object({
		date_format: z.string().nullish(),
		days_until_links_expire: z.number().nullish(),
		disable_apply_everywhere: z.boolean().nullish(),
		disable_apply_everywhere_effective: z.boolean().nullish(),
		disable_drawn_signatures: z.boolean().nullish(),
		disable_typed_signatures: z.boolean().nullish(),
		disable_uploaded_signatures: z.boolean().nullish(),
		enable_redirect: z.boolean().nullish(),
		hide_document_id_in_audit: z.boolean().nullish(),
		mute_branding: z.boolean().nullish(),
		redirect_url: z.string().nullish(),
		separate_audit_pdf: z.boolean().nullish(),
		separate_completed_file: z.boolean().nullish(),
		enable_nom151_compliance: z.boolean().nullish(),
		time_zone: z.string().nullish(),
		recipient_language: z.string().nullish(),
	})
	.loose();

const AccountInfoSchema = z
	.object({
		id: Uuid.nullish(),
		name: z.string().nullish(),
	})
	.loose();

const BulkSendListItemSchema = z
	.object({
		id: Uuid,
		name: z.string(),
		api_application_id: z.string().nullish(),
		documents_count: z.number(),
		documents_completed: z.number(),
		documents_not_completed: z.number(),
		created_at: Timestamp,
		user_id: z.string().nullish(),
		status: z.string(),
		template_ids: z
			.array(z.string())
			.nullish()
			.describe('Absent on a send created from a single template.'),
	})
	.loose();

export type SignwellBulkSendListItem = z.infer<typeof BulkSendListItemSchema>;

const BulkSendSchema = z
	.object({
		id: Uuid,
		name: z.string().nullish(),
		api_application_id: z.string().nullish(),
		documents_count: z.number(),
		documents_completed: z.number().nullish(),
		documents_not_completed: z.number().nullish(),
		created_at: Timestamp,
		user_id: z.string().nullish(),
		status: z.string(),
		templates: z
			.array(z.object({ id: z.string(), name: z.string() }).loose())
			.nullish(),
	})
	.loose();

export type SignwellBulkSend = z.infer<typeof BulkSendSchema>;

const paginationFields = {
	current_page: z.number(),
	next_page: z.number().nullish(),
	previous_page: z.number().nullish(),
	total_count: z.number(),
	total_pages: z.number(),
};

// ── me.get ────────────────────────────────────────────────────────────────

const MeGetInputSchema = z.object({});

export type MeGetInput = z.infer<typeof MeGetInputSchema>;

const MeGetResponseSchema = z
	.object({
		id: Uuid.describe('Membership id.'),
		role: z.string().describe('owner, admin or member.'),
		archived: z.boolean().nullish(),
		user: z
			.object({
				id: z.string(),
				name: z.string(),
				email: z.string(),
				first_name: z.string().nullish(),
				has_google_registration: z.boolean().nullish(),
				preferences: z
					.object({
						sales_document: z.boolean().nullish(),
						time_zone: z.string().nullish(),
						smart_fields: z.boolean().nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose(),
		account: AccountInfoSchema,
		workspace: AccountInfoSchema,
		contact: z
			.object({
				id: Uuid,
				email: z.string(),
				name: z.string(),
				company_name: z.string().nullish(),
				phone_number: z.string().nullish(),
				alt_phone_number: z.string().nullish(),
				website: z.string().nullish(),
				initials: z.string().nullish(),
				archived: z.boolean().nullish(),
			})
			.loose(),
	})
	.loose();

export type MeGetResponse = z.infer<typeof MeGetResponseSchema>;

// ── account ───────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

const AccountGetResponseSchema = z
	.object({
		id: Uuid,
		name: z.string(),
		logo_url: z.string().nullish(),
		plan_tier: z.string(),
		preferences: AccountPreferencesSchema,
	})
	.loose();

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

const AccountUpdateInputSchema = z.object({
	name: z.string().optional(),
	logo: z
		.string()
		.optional()
		.describe(
			'A base64 PNG or JPG (a data URI works), or a public URL. The decoded image must be under 300 KB.',
		),
	time_zone: z
		.string()
		.optional()
		.describe(
			'An IANA name SignWell supports. A few newer aliases are rejected: send Europe/Kiev, not Europe/Kyiv.',
		),
	date_format: z
		.enum([
			'MM/DD/YYYY',
			'DD/MM/YYYY',
			'YYYY/MM/DD',
			'Month DD, YYYY',
			'MM/DD/YYYY hh:mm:ss a',
		])
		.optional(),
	recipient_language: z.string().nullish(),
});

export type AccountUpdateInput = z.infer<typeof AccountUpdateInputSchema>;

const AccountUpdateResponseSchema = AccountGetResponseSchema;

export type AccountUpdateResponse = z.infer<typeof AccountUpdateResponseSchema>;

// ── documents ─────────────────────────────────────────────────────────────

const DocumentIdInputSchema = z.object({
	id: z.string().min(1).describe('The document id.'),
});

export type DocumentIdInput = z.infer<typeof DocumentIdInputSchema>;

const DocumentGetResponseSchema = DocumentSchema;

export type DocumentGetResponse = z.infer<typeof DocumentGetResponseSchema>;

const DocumentsCreateInputSchema = z.object({
	files: z.array(DocumentFileSchema).min(1),
	recipients: z.array(RecipientSchema).min(1),
	...commonSendingOptions,
	self_sign: z
		.boolean()
		.optional()
		.describe(
			'The creator signs without any field setup, using embedded_edit_url. Unavailable on 21 CFR Part 11 documents.',
		),
	with_signature_page: z
		.boolean()
		.optional()
		.describe(
			'Append a signature page and require every signer to sign there.',
		),
	embedded_signing: z.boolean().optional(),
	embedded_signing_notifications: z.boolean().optional(),
	fields: documentFields.optional(),
	copied_contacts: z.array(CopiedContactSchema).optional(),
	sms_test_email: z
		.boolean()
		.optional()
		.describe('On a test-mode document, send SMS notifications here instead.'),
});

export type DocumentsCreateInput = z.infer<typeof DocumentsCreateInputSchema>;

const DocumentsCreateResponseSchema = DocumentSchema;

export type DocumentsCreateResponse = z.infer<
	typeof DocumentsCreateResponseSchema
>;

const DocumentsCreateFromTemplateInputSchema = z
	.object({
		template_id: z
			.string()
			.optional()
			.describe('Use for one template. Supply this or template_ids, not both.'),
		template_ids: z
			.array(z.string())
			.min(1)
			.optional()
			.describe(
				'Use for several templates. Supply this or template_id, not both.',
			),
		name: z.string().optional(),
		subject: z.string().optional(),
		message: z.string().optional(),
		/**
		 * Template placeholders become document recipients here, so the key is
		 * `placeholder` rather than `recipient`.
		 */
		recipients: z
			.array(
				z.object({
					id: z.string().min(1).describe('The template placeholder id.'),
					placeholder_name: z
						.string()
						.optional()
						.describe('The placeholder this recipient is assigned to.'),
					name: z.string().min(1).optional(),
					email: Email.optional().describe(
						'Required unless delivery_method is sms.',
					),
					phone_number: z
						.string()
						.optional()
						.describe('Required when delivery_method is sms or email_and_sms.'),
					subject: z.string().optional(),
					message: z.string().optional(),
					passcode: z.string().optional(),
					delivery_method: z.enum(['email', 'sms', 'email_and_sms']).optional(),
				}),
			)
			.min(1),
		test_mode: z.boolean().optional(),
		draft: z.boolean().optional(),
		embedded_signing: z.boolean().optional(),
		embedded_signing_notifications: z.boolean().optional(),
		api_application_id: z.string().optional(),
		copied_contacts: z.array(CopiedContactSchema).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		expires_in: z.number().int().min(1).optional(),
		reminders: z.boolean().optional(),
		apply_signing_order: z.boolean().optional(),
		redirect_url: z.string().optional(),
		decline_redirect_url: z.string().optional(),
		allow_decline: z.boolean().optional(),
		allow_reassign: z.boolean().optional(),
		language: z.string().optional(),
		labels: z.array(LabelSchema).optional(),
		template_fields: z
			.array(
				z.object({
					api_id: z
						.string()
						.min(1)
						.describe("The template field's API id (case sensitive)."),
					value: z.union([z.string(), z.boolean(), z.number()]),
				}),
			)
			.optional()
			.describe("Prefill the template's existing fields by api_id."),
		fields: z
			.array(z.array(z.record(z.string(), z.unknown()))) // unknown: field shape
			.optional()
			.describe(
				"SignWell's fields for appended files; to prefill the template's own fields use template_fields.",
			),
	})
	.superRefine((value, ctx) => {
		const given = [value.template_id, value.template_ids].filter(
			(entry) => entry !== undefined,
		);
		if (given.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['template_id'],
				message:
					'Supply exactly one of template_id or template_ids; SignWell rejects a request with both or neither.',
			});
		}
	});

export type DocumentsCreateFromTemplateInput = z.infer<
	typeof DocumentsCreateFromTemplateInputSchema
>;

const DocumentsCreateFromTemplateResponseSchema = DocumentSchema;

export type DocumentsCreateFromTemplateResponse = z.infer<
	typeof DocumentsCreateFromTemplateResponseSchema
>;

const DocumentsSendInputSchema = z.object({
	id: z.string().min(1),
	test_mode: z
		.boolean()
		.optional()
		.describe(
			'Test mode does not carry over from the draft. Set it here too, or the send is billed as live.',
		),
	name: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().optional(),
	expires_in: z.number().int().min(1).optional(),
	reminders: z.boolean().optional(),
	apply_signing_order: z.boolean().optional(),
	api_application_id: z.string().optional(),
	embedded_signing: z.boolean().optional(),
	embedded_signing_notifications: z.boolean().optional(),
	redirect_url: z.string().optional(),
	decline_redirect_url: z.string().optional(),
	allow_decline: z.boolean().optional(),
	allow_reassign: z.boolean().optional(),
	language: z.string().optional(),
	text_tags: z.boolean().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	labels: z.array(LabelSchema).optional(),
	attachment_requests: z.array(AttachmentRequestSchema).optional(),
	copied_contacts: z.array(CopiedContactSchema).optional(),
	fields: documentFields.optional(),
});

export type DocumentsSendInput = z.infer<typeof DocumentsSendInputSchema>;

const DocumentsSendResponseSchema = DocumentSchema;

export type DocumentsSendResponse = z.infer<typeof DocumentsSendResponseSchema>;

const DocumentsUpdateRecipientsInputSchema = z.object({
	id: z.string().min(1),
	recipients: z
		.array(
			z.object({
				id: z
					.string()
					.min(1)
					.describe(
						'From the recipients array of documents.get, not the one you supplied at creation.',
					),
				name: z.string().min(1),
				email: Email,
				subject: z.string().optional(),
				message: z.string().optional(),
				passcode: z.string().optional(),
				send_email_delay: z.number().int().optional(),
				delivery_method: z.enum(['email', 'sms', 'email_and_sms']).optional(),
			}),
		)
		.min(1)
		.describe('Only recipients who have not started signing can be updated.'),
});

export type DocumentsUpdateRecipientsInput = z.infer<
	typeof DocumentsUpdateRecipientsInputSchema
>;

const DocumentsUpdateRecipientsResponseSchema = DocumentSchema;

export type DocumentsUpdateRecipientsResponse = z.infer<
	typeof DocumentsUpdateRecipientsResponseSchema
>;

const DocumentsUpdateAuthenticationInputSchema = z.object({
	id: z.string().min(1),
	recipients: z
		.array(
			z.object({
				id: z.string().min(1).describe('The recipient id from documents.get.'),
				passcode: z
					.string()
					.optional()
					.describe(
						'SignWell generates its own passcode on 21 CFR Part 11 documents, so this returns a 422 there.',
					),
				passcode_delivery: z
					.object({
						enabled: z.boolean(),
						methods: z.array(z.enum(['email'])).optional(),
						expire_after_access: z
							.boolean()
							.optional()
							.describe('Clear the passcode after the signer authenticates.'),
					})
					.optional(),
			}),
		)
		.min(1)
		.describe('Only recipients who have not started signing can be updated.'),
});

export type DocumentsUpdateAuthenticationInput = z.infer<
	typeof DocumentsUpdateAuthenticationInputSchema
>;

const DocumentsUpdateAuthenticationResponseSchema = DocumentSchema;

export type DocumentsUpdateAuthenticationResponse = z.infer<
	typeof DocumentsUpdateAuthenticationResponseSchema
>;

const DocumentsSendReminderInputSchema = z.object({
	id: z.string().min(1),
	recipients: z
		.array(
			z.object({
				name: z
					.string()
					.optional()
					.describe('Required when several recipients share an email address.'),
				email: Email.optional().describe(
					'Not needed for SMS-only recipients, who can be matched by name.',
				),
			}),
		)
		.optional()
		.describe('Omit to remind everyone who has not signed yet.'),
});

export type DocumentsSendReminderInput = z.infer<
	typeof DocumentsSendReminderInputSchema
>;

const DocumentsSendReminderResponseSchema = z
	.object({
		message: z.string().nullish(),
		recipients: z
			.array(
				z
					.object({
						id: z.string().nullish(),
						name: z.string().nullish(),
						email: z.string().nullish(),
						delivery_method: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type DocumentsSendReminderResponse = z.infer<
	typeof DocumentsSendReminderResponseSchema
>;

const DocumentsDeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type DocumentsDeleteResponse = z.infer<
	typeof DocumentsDeleteResponseSchema
>;

/**
 * The completed PDF and ZIP are binary. core's client reads a non-JSON body as
 * text, which corrupts a PDF, so this plugin asks for `url_only` and returns the
 * URL SignWell generates instead. `data` is present only when SignWell answers a
 * base64 payload rather than a URL.
 */
const DocumentsGetCompletedPdfInputSchema = z.object({
	id: z.string().min(1),
	audit_page: z
		.boolean()
		.optional()
		.describe('Include the audit page in the file SignWell prepares.'),
	file_format: z
		.enum(['pdf', 'zip'])
		.optional()
		.describe(
			'zip packages the document and the audit page separately. SignWell defaults to pdf.',
		),
});

export type DocumentsGetCompletedPdfInput = z.infer<
	typeof DocumentsGetCompletedPdfInputSchema
>;

const DocumentsGetCompletedPdfResponseSchema = z.object({
	file_url: z
		.string()
		.describe('A temporary download URL for the completed document.'),
	document_id: z.string(),
});

export type DocumentsGetCompletedPdfResponse = z.infer<
	typeof DocumentsGetCompletedPdfResponseSchema
>;

const DocumentsGetNom151CertificateInputSchema = z.object({
	id: z.string().min(1),
});

export type DocumentsGetNom151CertificateInput = z.infer<
	typeof DocumentsGetNom151CertificateInputSchema
>;

const DocumentsGetNom151CertificateResponseSchema = z.object({
	file_url: z
		.string()
		.describe('A temporary download URL for the certificate ZIP.'),
	document_id: z.string(),
});

export type DocumentsGetNom151CertificateResponse = z.infer<
	typeof DocumentsGetNom151CertificateResponseSchema
>;

// ── templates ─────────────────────────────────────────────────────────────

const TemplateIdInputSchema = z.object({
	id: z.string().min(1).describe('The template id.'),
});

export type TemplateIdInput = z.infer<typeof TemplateIdInputSchema>;

const TemplatesGetResponseSchema = TemplateSchema;

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

const TemplatesCreateInputSchema = z.object({
	files: z.array(DocumentFileSchema).min(1),
	placeholders: z.array(PlaceholderSchema).min(1),
	name: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().optional(),
	copied_placeholders: z.array(CopiedPlaceholderSchema).optional(),
	draft: z.boolean().optional(),
	expires_in: z.number().int().min(1).optional(),
	reminders: z.boolean().optional(),
	apply_signing_order: z.boolean().optional(),
	api_application_id: z.string().optional(),
	text_tags: z.boolean().optional(),
	redirect_url: z.string().optional(),
	decline_redirect_url: z.string().optional(),
	allow_decline: z.boolean().optional(),
	allow_reassign: z.boolean().optional(),
	language: z.string().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	labels: z.array(LabelSchema).optional(),
	attachment_requests: z.array(TemplateAttachmentRequestSchema).optional(),
	conditional_rules: z.array(ConditionalRuleSchema).optional(),
	fields: templateFields.optional(),
});

export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

const TemplatesCreateResponseSchema = TemplateSchema;

export type TemplatesCreateResponse = z.infer<
	typeof TemplatesCreateResponseSchema
>;

const TemplatesUpdateInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().optional(),
	draft: z.boolean().optional(),
	expires_in: z.number().int().min(1).optional(),
	reminders: z.boolean().optional(),
	apply_signing_order: z.boolean().optional(),
	api_application_id: z.string().optional(),
	redirect_url: z.string().optional(),
	decline_redirect_url: z.string().optional(),
	allow_decline: z.boolean().optional(),
	allow_reassign: z.boolean().optional(),
	language: z.string().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	labels: z.array(LabelSchema).optional(),
	placeholders: z.array(PlaceholderSchema).optional(),
	copied_placeholders: z.array(CopiedPlaceholderSchema).optional(),
	fields: templateFields.optional(),
});

export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

const TemplatesUpdateResponseSchema = TemplateSchema;

export type TemplatesUpdateResponse = z.infer<
	typeof TemplatesUpdateResponseSchema
>;

const TemplatesDeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

const WebhooksListInputSchema = z.object({});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z.object({
	webhooks: z
		.array(WebhookSchema)
		.describe(
			'Every webhook registered on the account; this route does not page.',
		),
});

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksCreateInputSchema = z.object({
	callback_url: z
		.string()
		.describe(
			'The HTTPS endpoint SignWell posts document and template events to.',
		),
	api_application_id: z.string().optional(),
});

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

const WebhooksCreateResponseSchema = WebhookSchema;

export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;

const WebhooksDeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ── apiApplications ───────────────────────────────────────────────────────

const ApiApplicationIdInputSchema = z.object({
	id: z.string().min(1).describe('The API application id.'),
});

export type ApiApplicationIdInput = z.infer<typeof ApiApplicationIdInputSchema>;

const ApiApplicationSchema = z
	.object({
		id: Uuid,
		name: z.string(),
		callback_urls: z.array(z.string()).nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
		owner: z
			.object({
				id: z.string().nullish(),
				account_id: z.string().nullish(),
				name: z.string(),
				email: z.string(),
			})
			.loose()
			.nullish(),
		preferences: z
			.object({
				button_text_color: z.string().nullish(),
				buttons_border_radius: z.number().nullish(),
				custom_logo_file: z.string().nullish(),
				link_text_color: z.string().nullish(),
				primary_color: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const ApiApplicationsGetResponseSchema = ApiApplicationSchema;

export type ApiApplicationsGetResponse = z.infer<
	typeof ApiApplicationsGetResponseSchema
>;

const ApiApplicationsDeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type ApiApplicationsDeleteResponse = z.infer<
	typeof ApiApplicationsDeleteResponseSchema
>;

// ── bulkSends ─────────────────────────────────────────────────────────────

const BulkSendsListInputSchema = z.object({
	user_email: z
		.string()
		.optional()
		.describe('Only sends created by this user.'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page size; SignWell applies its own default when omitted.'),
	page: z.number().int().min(1).optional().describe('1-based page number.'),
	api_application_id: z.string().optional(),
});

export type BulkSendsListInput = z.infer<typeof BulkSendsListInputSchema>;

const BulkSendsListResponseSchema = z
	.object({
		bulk_sends: z.array(BulkSendListItemSchema),
		...paginationFields,
	})
	.loose();

export type BulkSendsListResponse = z.infer<typeof BulkSendsListResponseSchema>;

const BulkSendsGetInputSchema = z.object({
	id: z.string().min(1),
});

export type BulkSendsGetInput = z.infer<typeof BulkSendsGetInputSchema>;

const BulkSendsGetResponseSchema = BulkSendSchema;

export type BulkSendsGetResponse = z.infer<typeof BulkSendsGetResponseSchema>;

const BulkSendsGetDocumentsInputSchema = z.object({
	id: z.string().min(1),
	limit: z.number().int().min(1).optional(),
	page: z.number().int().min(1).optional(),
});

export type BulkSendsGetDocumentsInput = z.infer<
	typeof BulkSendsGetDocumentsInputSchema
>;

const BulkSendsGetDocumentsResponseSchema = z
	.object({
		id: Uuid,
		name: z.string().nullish(),
		api_application_id: z.string().nullish(),
		created_at: Timestamp.nullish(),
		user_id: z.string().nullish(),
		status: z.string().nullish(),
		documents: z.array(DocumentSchema),
		...paginationFields,
	})
	.loose();

export type BulkSendsGetDocumentsResponse = z.infer<
	typeof BulkSendsGetDocumentsResponseSchema
>;

const BulkSendsCreateInputSchema = z.object({
	template_ids: z.array(z.string()).min(1),
	bulk_send_csv: z
		.string()
		.min(1)
		.describe('The filled-in CSV, base64 encoded.'),
	skip_row_errors: z
		.boolean()
		.optional()
		.describe('Defaults to false, which fails the whole send on a bad row.'),
	api_application_id: z.string().optional(),
	name: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().optional(),
	apply_signing_order: z.boolean().optional(),
});

export type BulkSendsCreateInput = z.infer<typeof BulkSendsCreateInputSchema>;

const BulkSendsCreateResponseSchema = z
	.object({
		id: Uuid,
		name: z.string().nullish(),
		status: z.string().nullish(),
		documents_count: z.number().nullish(),
		created_at: Timestamp.nullish(),
	})
	.loose();

export type BulkSendsCreateResponse = z.infer<
	typeof BulkSendsCreateResponseSchema
>;

const BulkSendsGetCsvTemplateInputSchema = z.object({
	template_ids: z
		.array(z.string())
		.min(1)
		.describe('The templates the CSV columns are built from.'),
});

export type BulkSendsGetCsvTemplateInput = z.infer<
	typeof BulkSendsGetCsvTemplateInputSchema
>;

const BulkSendsGetCsvTemplateResponseSchema = z.object({
	data: z.string().describe('The blank CSV, base64 encoded.'),
});

export type BulkSendsGetCsvTemplateResponse = z.infer<
	typeof BulkSendsGetCsvTemplateResponseSchema
>;

const BulkSendsValidateCsvInputSchema = z.object({
	template_ids: z.array(z.string()).min(1),
	bulk_send_csv: z
		.string()
		.min(1)
		.describe('The CSV to check, base64 encoded.'),
	skip_row_errors: z.boolean().optional(),
	api_application_id: z.string().optional(),
	name: z.string().optional(),
	subject: z.string().optional(),
	message: z.string().optional(),
	apply_signing_order: z.boolean().optional(),
});

export type BulkSendsValidateCsvInput = z.infer<
	typeof BulkSendsValidateCsvInputSchema
>;

const BulkSendsValidateCsvResponseSchema = z
	.object({
		bulk_send_csv: z.string(),
		template_ids: z.array(z.string()),
		skip_row_errors: z.boolean().nullish(),
		api_application_id: z.string().nullish(),
		name: z.string().nullish(),
		subject: z.string().nullish(),
		message: z.string().nullish(),
		apply_signing_order: z.boolean().nullish(),
	})
	.loose();

export type BulkSendsValidateCsvResponse = z.infer<
	typeof BulkSendsValidateCsvResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SignwellEndpointInputs = {
	meGet: MeGetInput;
	accountGet: AccountGetInput;
	accountUpdate: AccountUpdateInput;
	documentsGet: DocumentIdInput;
	documentsCreate: DocumentsCreateInput;
	documentsCreateFromTemplate: DocumentsCreateFromTemplateInput;
	documentsSend: DocumentsSendInput;
	documentsUpdateRecipients: DocumentsUpdateRecipientsInput;
	documentsUpdateAuthentication: DocumentsUpdateAuthenticationInput;
	documentsSendReminder: DocumentsSendReminderInput;
	documentsDelete: DocumentIdInput;
	documentsGetCompletedPdf: DocumentsGetCompletedPdfInput;
	documentsGetNom151Certificate: DocumentsGetNom151CertificateInput;
	templatesGet: TemplateIdInput;
	templatesCreate: TemplatesCreateInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesDelete: TemplateIdInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksDelete: DocumentIdInput;
	apiApplicationsGet: ApiApplicationIdInput;
	apiApplicationsDelete: ApiApplicationIdInput;
	bulkSendsList: BulkSendsListInput;
	bulkSendsGet: BulkSendsGetInput;
	bulkSendsGetDocuments: BulkSendsGetDocumentsInput;
	bulkSendsCreate: BulkSendsCreateInput;
	bulkSendsGetCsvTemplate: BulkSendsGetCsvTemplateInput;
	bulkSendsValidateCsv: BulkSendsValidateCsvInput;
};

export type SignwellEndpointOutputs = {
	meGet: MeGetResponse;
	accountGet: AccountGetResponse;
	accountUpdate: AccountUpdateResponse;
	documentsGet: DocumentGetResponse;
	documentsCreate: DocumentsCreateResponse;
	documentsCreateFromTemplate: DocumentsCreateFromTemplateResponse;
	documentsSend: DocumentsSendResponse;
	documentsUpdateRecipients: DocumentsUpdateRecipientsResponse;
	documentsUpdateAuthentication: DocumentsUpdateAuthenticationResponse;
	documentsSendReminder: DocumentsSendReminderResponse;
	documentsDelete: DocumentsDeleteResponse;
	documentsGetCompletedPdf: DocumentsGetCompletedPdfResponse;
	documentsGetNom151Certificate: DocumentsGetNom151CertificateResponse;
	templatesGet: TemplatesGetResponse;
	templatesCreate: TemplatesCreateResponse;
	templatesUpdate: TemplatesUpdateResponse;
	templatesDelete: TemplatesDeleteResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksDelete: WebhooksDeleteResponse;
	apiApplicationsGet: ApiApplicationsGetResponse;
	apiApplicationsDelete: ApiApplicationsDeleteResponse;
	bulkSendsList: BulkSendsListResponse;
	bulkSendsGet: BulkSendsGetResponse;
	bulkSendsGetDocuments: BulkSendsGetDocumentsResponse;
	bulkSendsCreate: BulkSendsCreateResponse;
	bulkSendsGetCsvTemplate: BulkSendsGetCsvTemplateResponse;
	bulkSendsValidateCsv: BulkSendsValidateCsvResponse;
};

export const SignwellEndpointInputSchemas = {
	meGet: MeGetInputSchema,
	accountGet: AccountGetInputSchema,
	accountUpdate: AccountUpdateInputSchema,
	documentsGet: DocumentIdInputSchema,
	documentsCreate: DocumentsCreateInputSchema,
	documentsCreateFromTemplate: DocumentsCreateFromTemplateInputSchema,
	documentsSend: DocumentsSendInputSchema,
	documentsUpdateRecipients: DocumentsUpdateRecipientsInputSchema,
	documentsUpdateAuthentication: DocumentsUpdateAuthenticationInputSchema,
	documentsSendReminder: DocumentsSendReminderInputSchema,
	documentsDelete: DocumentIdInputSchema,
	documentsGetCompletedPdf: DocumentsGetCompletedPdfInputSchema,
	documentsGetNom151Certificate: DocumentsGetNom151CertificateInputSchema,
	templatesGet: TemplateIdInputSchema,
	templatesCreate: TemplatesCreateInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplateIdInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: DocumentIdInputSchema,
	apiApplicationsGet: ApiApplicationIdInputSchema,
	apiApplicationsDelete: ApiApplicationIdInputSchema,
	bulkSendsList: BulkSendsListInputSchema,
	bulkSendsGet: BulkSendsGetInputSchema,
	bulkSendsGetDocuments: BulkSendsGetDocumentsInputSchema,
	bulkSendsCreate: BulkSendsCreateInputSchema,
	bulkSendsGetCsvTemplate: BulkSendsGetCsvTemplateInputSchema,
	bulkSendsValidateCsv: BulkSendsValidateCsvInputSchema,
} as const;

export const SignwellEndpointOutputSchemas = {
	meGet: MeGetResponseSchema,
	accountGet: AccountGetResponseSchema,
	accountUpdate: AccountUpdateResponseSchema,
	documentsGet: DocumentGetResponseSchema,
	documentsCreate: DocumentsCreateResponseSchema,
	documentsCreateFromTemplate: DocumentsCreateFromTemplateResponseSchema,
	documentsSend: DocumentsSendResponseSchema,
	documentsUpdateRecipients: DocumentsUpdateRecipientsResponseSchema,
	documentsUpdateAuthentication: DocumentsUpdateAuthenticationResponseSchema,
	documentsSendReminder: DocumentsSendReminderResponseSchema,
	documentsDelete: DocumentsDeleteResponseSchema,
	documentsGetCompletedPdf: DocumentsGetCompletedPdfResponseSchema,
	documentsGetNom151Certificate: DocumentsGetNom151CertificateResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesCreate: TemplatesCreateResponseSchema,
	templatesUpdate: TemplatesUpdateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	apiApplicationsGet: ApiApplicationsGetResponseSchema,
	apiApplicationsDelete: ApiApplicationsDeleteResponseSchema,
	bulkSendsList: BulkSendsListResponseSchema,
	bulkSendsGet: BulkSendsGetResponseSchema,
	bulkSendsGetDocuments: BulkSendsGetDocumentsResponseSchema,
	bulkSendsCreate: BulkSendsCreateResponseSchema,
	bulkSendsGetCsvTemplate: BulkSendsGetCsvTemplateResponseSchema,
	bulkSendsValidateCsv: BulkSendsValidateCsvResponseSchema,
} as const;
