import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Entity Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const BasinFormSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		uuid: z.string().nullable().optional(),
		name: z.string().optional(),
		timezone: z.string().optional(),
		redirect_url: z.string().nullable().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		autoreply: z.boolean().optional(),
		autoreply_body: z.string().nullable().optional(),
		whitelist_source_domains: z.string().nullable().optional(),
		force_recaptcha: z.boolean().optional(),
		force_hcaptcha: z.boolean().optional(),
		force_turnstile: z.boolean().optional(),
		turnstile_site_key: z.string().nullable().optional(),
		turnstile_secret: z.string().nullable().optional(),
		notification_cc_emails: z.string().nullable().optional(),
		notification_bcc_emails: z.string().nullable().optional(),
		notification_subject: z.string().nullable().optional(),
		notification_from_name: z.string().nullable().optional(),
		autoreply_subject: z.string().nullable().optional(),
		autoreply_from_name: z.string().nullable().optional(),
		autoreply_greeting: z.string().nullable().optional(),
		autoreply_name: z.string().nullable().optional(),
		autoreply_title: z.string().nullable().optional(),
		autoreply_email: z.string().nullable().optional(),
		logo: z.string().nullable().optional(),
		button_background_color: z.string().nullable().optional(),
		button_text_color: z.string().nullable().optional(),
		data_receipt_email: z.boolean().optional(),
		retention_days: z.number().optional(),
		hide_dashboard_button: z.boolean().optional(),
		exclude_submitter_from_reply: z.boolean().optional(),
		custom_template: z.string().nullable().optional(),
		use_custom_template: z.boolean().optional(),
		autoreply_custom_template: z.string().nullable().optional(),
		autoreply_use_custom_template: z.boolean().optional(),
		notification_mail_template_id: z.number().nullable().optional(),
		auto_response_mail_template_id: z.number().nullable().optional(),
		confirmation_mail_template_id: z.number().nullable().optional(),
		honeypot_field: z.string().nullable().optional(),
		recaptcha_failed_url: z.string().nullable().optional(),
		domain_id: z.number().nullable().optional(),
		domain_email: z.string().nullable().optional(),
		duplicate_filter: z.boolean().optional(),
		project_id: z.number().optional(),
		project_name: z.string().optional(),
		redirect_heading: z.string().nullable().optional(),
		redirect_message: z.string().nullable().optional(),
		redirect_button_background_color: z.string().nullable().optional(),
		redirect_button_text: z.string().nullable().optional(),
		redirect_button_text_color: z.string().nullable().optional(),
		content_blacklist: z.array(z.string()).nullable().optional(),
		allowed_domains: z.array(z.string()).nullable().optional(),
		blocked_domains: z.array(z.string()).nullable().optional(),
		smtp_email_validation: z.boolean().optional(),
		contribute_to_spam_training: z.boolean().optional(),
		form_webhooks: z.array(z.unknown()).optional(),
		inbox_count: z.number().optional(),
		spam_count: z.number().optional(),
		trash_count: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type BasinForm = z.infer<typeof BasinFormSchema>;

export const BasinSubmissionSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		email: z.string().nullable().optional(),
		form_id: z.number().optional(),
		spam: z.boolean().optional(),
		read: z.boolean().optional(),
		trash: z.boolean().optional(),
		spam_reason: z.string().nullable().optional(),
		webhook_sent_at: z.string().nullable().optional(),
		ip: z.string().nullable().optional(),
		referrer: z.string().nullable().optional(),
		user_agent: z.string().nullable().optional(),
		payload_params: z.record(z.string(), z.unknown()).optional(),
		attachments: z.array(z.unknown()).nullable().optional(),
		form: z
			.object({
				name: z.string().optional(),
				uuid: z.string().optional(),
			})
			.passthrough()
			.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type BasinSubmission = z.infer<typeof BasinSubmissionSchema>;

export const BasinProjectSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type BasinProject = z.infer<typeof BasinProjectSchema>;

export const BasinFormWebhookSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.number().optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
		failure_count: z.number().optional(),
		last_failure_at: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type BasinFormWebhook = z.infer<typeof BasinFormWebhookSchema>;

export const BasinFormViewSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.number().optional(),
		name: z.string().nullable().optional(),
		status: z.string().optional(),
		form_schema: z.string().nullable().optional(),
		custom_css: z.string().nullable().optional(),
		custom_head: z.string().nullable().optional(),
		background_color: z.string().nullable().optional(),
		text_color: z.string().nullable().optional(),
		inherit_styles: z.boolean().optional(),
		auto_resize: z.boolean().optional(),
		transparent_background: z.boolean().optional(),
		opens_at: z.string().nullable().optional(),
		closes_at: z.string().nullable().optional(),
		bootstrap_cdn_url: z.string().nullable().optional(),
		uuid: z.string().nullable().optional(),
		iframe_height: z.number().nullable().optional(),
		iframe_width: z.number().nullable().optional(),
		redirect_iframe_parent: z.boolean().optional(),
		center_iframe: z.boolean().optional(),
		embed_code: z.string().optional(),
		form: z
			.object({
				id: z.number().optional(),
				name: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		project: z
			.object({
				id: z.number().optional(),
				name: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type BasinFormView = z.infer<typeof BasinFormViewSchema>;

export const BasinDomainSchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		name: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export type BasinDomain = z.infer<typeof BasinDomainSchema>;

/**
 * Pagination envelope returned by every list endpoint.
 *
 * Verified against the live API: all six lists return
 * `{ <collection>: [...], meta: { count, page, per_page } }`. The submissions
 * list adds `form_name`, `inbox_count`, `spam_count` and `trash_count`, so the
 * shape stays open. The published spec documents these responses only as
 * "Success", so the wire is the source of truth here.
 */
export const BasinListMetaSchema = z
	.object({
		count: z.number().optional(),
		page: z.number().optional(),
		per_page: z.number().optional(),
	})
	.passthrough();
export type BasinListMeta = z.infer<typeof BasinListMetaSchema>;

export const BasinSuccessMessageSchema = z
	.object({
		success: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type BasinSuccessMessage = z.infer<typeof BasinSuccessMessageSchema>;

export const BasinDeleteResponseSchema = z.union([
	BasinSuccessMessageSchema,
	BasinFormSchema,
	BasinSubmissionSchema,
	BasinProjectSchema,
	BasinFormWebhookSchema,
	z.record(z.string(), z.unknown()),
]);
export type BasinDeleteResponse = z.infer<typeof BasinDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Forms Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const FormsListInputSchema = z.object({
	page: z.union([z.string(), z.number()]).optional(),
	query: z.string().optional(),
});
export type FormsListInput = z.infer<typeof FormsListInputSchema>;

export const FormsListResponseSchema = z
	.object({
		forms: z.array(BasinFormSchema),
		meta: BasinListMetaSchema.optional(),
	})
	.passthrough();
export type FormsListResponse = z.infer<typeof FormsListResponseSchema>;

export const FormsGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type FormsGetInput = z.infer<typeof FormsGetInputSchema>;

export const FormsGetResponseSchema = BasinFormSchema;
export type FormsGetResponse = z.infer<typeof FormsGetResponseSchema>;

export const FormsCreateInputSchema = z
	.object({
		name: z.string().optional(),
		project_id: z.number().optional(),
		timezone: z.string().optional(),
		redirect_url: z.string().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		autoreply: z.boolean().optional(),
		autoreply_body: z.string().optional(),
		whitelist_source_domains: z.string().optional(),
		force_recaptcha: z.boolean().optional(),
		force_hcaptcha: z.boolean().optional(),
		force_turnstile: z.boolean().optional(),
		turnstile_site_key: z.string().optional(),
		turnstile_secret: z.string().optional(),
		notification_cc_emails: z.string().optional(),
		notification_bcc_emails: z.string().optional(),
		notification_subject: z.string().optional(),
		notification_from_name: z.string().optional(),
		autoreply_subject: z.string().optional(),
		autoreply_from_name: z.string().optional(),
		autoreply_greeting: z.string().optional(),
		autoreply_name: z.string().optional(),
		autoreply_title: z.string().optional(),
		autoreply_email: z.string().optional(),
		logo: z.string().optional(),
		button_background_color: z.string().optional(),
		button_text_color: z.string().optional(),
		data_receipt_email: z.boolean().optional(),
		retention_days: z.number().optional(),
		hide_dashboard_button: z.boolean().optional(),
		exclude_submitter_from_reply: z.boolean().optional(),
		custom_template: z.string().optional(),
		use_custom_template: z.boolean().optional(),
		autoreply_custom_template: z.string().optional(),
		autoreply_use_custom_template: z.boolean().optional(),
		notification_mail_template_id: z.number().optional(),
		auto_response_mail_template_id: z.number().optional(),
		confirmation_mail_template_id: z.number().optional(),
		honeypot_field: z.string().optional(),
		recaptcha_failed_url: z.string().optional(),
		domain_id: z.number().optional(),
		domain_email: z.string().optional(),
		duplicate_filter: z.boolean().optional(),
		redirect_heading: z.string().optional(),
		redirect_message: z.string().optional(),
		redirect_button_background_color: z.string().optional(),
		redirect_button_text: z.string().optional(),
		redirect_button_text_color: z.string().optional(),
		content_blacklist: z.array(z.string()).optional(),
		allowed_domains: z.array(z.string()).optional(),
		blocked_domains: z.array(z.string()).optional(),
		smtp_email_validation: z.boolean().optional(),
		contribute_to_spam_training: z.boolean().optional(),
		form: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough()
	// An empty input produces `{ form: {} }`, which Basin rejects with 422
	// "param is missing or the value is empty or invalid: form".
	.refine(
		(value) =>
			Object.keys(value.form ?? {}).length > 0 ||
			Object.keys(value).some((key) => key !== 'form'),
		{ message: 'Provide at least one form field to create a form' },
	);
export type FormsCreateInput = z.infer<typeof FormsCreateInputSchema>;

export const FormsCreateResponseSchema = BasinFormSchema;
export type FormsCreateResponse = z.infer<typeof FormsCreateResponseSchema>;

export const FormsUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		project_id: z.number().optional(),
		timezone: z.string().optional(),
		redirect_url: z.string().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		autoreply: z.boolean().optional(),
		autoreply_body: z.string().optional(),
		whitelist_source_domains: z.string().optional(),
		force_recaptcha: z.boolean().optional(),
		force_hcaptcha: z.boolean().optional(),
		force_turnstile: z.boolean().optional(),
		turnstile_site_key: z.string().optional(),
		turnstile_secret: z.string().optional(),
		notification_cc_emails: z.string().optional(),
		notification_bcc_emails: z.string().optional(),
		notification_subject: z.string().optional(),
		notification_from_name: z.string().optional(),
		autoreply_subject: z.string().optional(),
		autoreply_from_name: z.string().optional(),
		autoreply_greeting: z.string().optional(),
		autoreply_name: z.string().optional(),
		autoreply_title: z.string().optional(),
		autoreply_email: z.string().optional(),
		logo: z.string().optional(),
		button_background_color: z.string().optional(),
		button_text_color: z.string().optional(),
		data_receipt_email: z.boolean().optional(),
		retention_days: z.number().optional(),
		hide_dashboard_button: z.boolean().optional(),
		exclude_submitter_from_reply: z.boolean().optional(),
		custom_template: z.string().optional(),
		use_custom_template: z.boolean().optional(),
		autoreply_custom_template: z.string().optional(),
		autoreply_use_custom_template: z.boolean().optional(),
		notification_mail_template_id: z.number().optional(),
		auto_response_mail_template_id: z.number().optional(),
		confirmation_mail_template_id: z.number().optional(),
		honeypot_field: z.string().optional(),
		recaptcha_failed_url: z.string().optional(),
		domain_id: z.number().optional(),
		domain_email: z.string().optional(),
		duplicate_filter: z.boolean().optional(),
		redirect_heading: z.string().optional(),
		redirect_message: z.string().optional(),
		redirect_button_background_color: z.string().optional(),
		redirect_button_text: z.string().optional(),
		redirect_button_text_color: z.string().optional(),
		content_blacklist: z.array(z.string()).optional(),
		allowed_domains: z.array(z.string()).optional(),
		blocked_domains: z.array(z.string()).optional(),
		smtp_email_validation: z.boolean().optional(),
		contribute_to_spam_training: z.boolean().optional(),
		form: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();
export type FormsUpdateInput = z.infer<typeof FormsUpdateInputSchema>;

export const FormsUpdateResponseSchema = BasinFormSchema;
export type FormsUpdateResponse = z.infer<typeof FormsUpdateResponseSchema>;

export const FormsDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type FormsDeleteInput = z.infer<typeof FormsDeleteInputSchema>;

export const FormsDeleteResponseSchema = BasinDeleteResponseSchema;
export type FormsDeleteResponse = z.infer<typeof FormsDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Submissions Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const SubmissionsListInputSchema = z.object({
	form_id: z.union([z.string(), z.number()]).optional(),
	filter_by: z.string().optional(),
	query: z.string().optional(),
	order_by: z.string().optional(),
	date_range: z.string().optional(),
	page: z.union([z.string(), z.number()]).optional(),
});
export type SubmissionsListInput = z.infer<typeof SubmissionsListInputSchema>;

export const SubmissionsListResponseSchema = z
	.object({
		submissions: z.array(BasinSubmissionSchema),
		meta: BasinListMetaSchema.optional(),
	})
	.passthrough();
export type SubmissionsListResponse = z.infer<
	typeof SubmissionsListResponseSchema
>;

export const SubmissionsGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type SubmissionsGetInput = z.infer<typeof SubmissionsGetInputSchema>;

export const SubmissionsGetResponseSchema = BasinSubmissionSchema;
export type SubmissionsGetResponse = z.infer<
	typeof SubmissionsGetResponseSchema
>;

export const SubmissionsDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type SubmissionsDeleteInput = z.infer<
	typeof SubmissionsDeleteInputSchema
>;

export const SubmissionsDeleteResponseSchema = BasinDeleteResponseSchema;
export type SubmissionsDeleteResponse = z.infer<
	typeof SubmissionsDeleteResponseSchema
>;

export const SubmissionsUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		spam: z.boolean().optional(),
		read: z.boolean().optional(),
		trash: z.boolean().optional(),
		submission: z
			.object({
				spam: z.boolean().optional(),
				read: z.boolean().optional(),
				trash: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type SubmissionsUpdateInput = z.infer<
	typeof SubmissionsUpdateInputSchema
>;

export const SubmissionsUpdateResponseSchema = BasinSubmissionSchema;
export type SubmissionsUpdateResponse = z.infer<
	typeof SubmissionsUpdateResponseSchema
>;

export const SubmissionsMarkSpamInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type SubmissionsMarkSpamInput = z.infer<
	typeof SubmissionsMarkSpamInputSchema
>;

export const SubmissionsMarkSpamResponseSchema = BasinSubmissionSchema;
export type SubmissionsMarkSpamResponse = z.infer<
	typeof SubmissionsMarkSpamResponseSchema
>;

export const SubmissionsMarkHamInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type SubmissionsMarkHamInput = z.infer<
	typeof SubmissionsMarkHamInputSchema
>;

export const SubmissionsMarkHamResponseSchema = BasinSubmissionSchema;
export type SubmissionsMarkHamResponse = z.infer<
	typeof SubmissionsMarkHamResponseSchema
>;

export const SubmissionsRefireWebhooksInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type SubmissionsRefireWebhooksInput = z.infer<
	typeof SubmissionsRefireWebhooksInputSchema
>;

export const SubmissionsRefireWebhooksResponseSchema =
	BasinSuccessMessageSchema;
export type SubmissionsRefireWebhooksResponse = z.infer<
	typeof SubmissionsRefireWebhooksResponseSchema
>;

export const SubmissionsRefireWebhooksBulkInputSchema = z.object({
	// An empty array would spend a request that re-fires nothing.
	submission_ids: z.array(z.number()).min(1),
});
export type SubmissionsRefireWebhooksBulkInput = z.infer<
	typeof SubmissionsRefireWebhooksBulkInputSchema
>;

export const SubmissionsRefireWebhooksBulkResponseSchema =
	BasinSuccessMessageSchema;
export type SubmissionsRefireWebhooksBulkResponse = z.infer<
	typeof SubmissionsRefireWebhooksBulkResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Projects Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectsListInputSchema = z.object({
	page: z.union([z.string(), z.number()]).optional(),
	query: z.string().optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

export const ProjectsListResponseSchema = z
	.object({
		projects: z.array(BasinProjectSchema),
		meta: BasinListMetaSchema.optional(),
	})
	.passthrough();
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

export const ProjectsGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

export const ProjectsGetResponseSchema = BasinProjectSchema;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

export const ProjectsCreateInputSchema = z
	.object({
		name: z.string().optional(),
		project: z
			.object({
				name: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough()
	// The handler falls back to `{ project: { name: '' } }` when no name is
	// given, and Basin answers that with 422 "Name can't be blank". Reject it
	// here so the caller gets a clear error instead of a wasted request.
	.refine(
		(value) =>
			(value.name?.trim().length ?? 0) > 0 ||
			(value.project?.name?.trim().length ?? 0) > 0,
		{ message: 'A project name is required' },
	);
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

export const ProjectsCreateResponseSchema = BasinProjectSchema;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

export const ProjectsUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		project: z
			.object({
				name: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

export const ProjectsUpdateResponseSchema = BasinProjectSchema;
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

export const ProjectsDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

export const ProjectsDeleteResponseSchema = BasinDeleteResponseSchema;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Webhooks Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const WebhooksListInputSchema = z.object({
	page: z.union([z.string(), z.number()]).optional(),
	query: z.string().optional(),
});
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

export const WebhooksListResponseSchema = z
	.object({
		form_webhooks: z.array(BasinFormWebhookSchema),
		meta: BasinListMetaSchema.optional(),
	})
	.passthrough();
export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

export const WebhooksGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

export const WebhooksGetResponseSchema = BasinFormWebhookSchema;
export type WebhooksGetResponse = z.infer<typeof WebhooksGetResponseSchema>;

export const WebhooksCreateInputSchema = z
	.object({
		form_id: z.number().optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
		form_webhook: z
			.object({
				form_id: z.number(),
				name: z.string(),
				url: z.string(),
				format: z.string().optional(),
				trigger_when_spam: z.boolean().optional(),
				enabled: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough()
	// Basin rejects an empty `form_webhook` payload with 422; a webhook without
	// a form_id and url could never be delivered anyway.
	.refine(
		(value) =>
			Object.keys(value.form_webhook ?? {}).length > 0 ||
			Object.keys(value).some((key) => key !== 'form_webhook'),
		{ message: 'Provide at least one webhook field to create a webhook' },
	);
export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

export const WebhooksCreateResponseSchema = BasinFormWebhookSchema;
export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;

export const WebhooksUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		form_id: z.number().optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
		form_webhook: z
			.object({
				form_id: z.number().optional(),
				name: z.string().optional(),
				url: z.string().optional(),
				format: z.string().optional(),
				trigger_when_spam: z.boolean().optional(),
				enabled: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

export const WebhooksUpdateResponseSchema = BasinFormWebhookSchema;
export type WebhooksUpdateResponse = z.infer<
	typeof WebhooksUpdateResponseSchema
>;

export const WebhooksDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

export const WebhooksDeleteResponseSchema = BasinDeleteResponseSchema;
export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Form Views Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const FormViewsListInputSchema = z.object({
	page: z.union([z.string(), z.number()]).optional(),
	query: z.string().optional(),
});
export type FormViewsListInput = z.infer<typeof FormViewsListInputSchema>;

export const FormViewsListResponseSchema = z
	.object({
		form_views: z.array(BasinFormViewSchema),
		meta: BasinListMetaSchema.optional(),
	})
	.passthrough();
export type FormViewsListResponse = z.infer<typeof FormViewsListResponseSchema>;

export const FormViewsGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});
export type FormViewsGetInput = z.infer<typeof FormViewsGetInputSchema>;

export const FormViewsGetResponseSchema = BasinFormViewSchema;
export type FormViewsGetResponse = z.infer<typeof FormViewsGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Custom Domains Endpoint Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const DomainsListInputSchema = z.object({
	page: z.union([z.string(), z.number()]).optional(),
	query: z.string().optional(),
});
export type DomainsListInput = z.infer<typeof DomainsListInputSchema>;

export const DomainsListResponseSchema = z
	.object({
		domains: z.array(BasinDomainSchema),
		meta: BasinListMetaSchema.optional(),
	})
	.passthrough();
export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Type Maps
// ─────────────────────────────────────────────────────────────────────────────

export type BasinEndpointInputs = {
	formsList: FormsListInput;
	formsGet: FormsGetInput;
	formsCreate: FormsCreateInput;
	formsUpdate: FormsUpdateInput;
	formsDelete: FormsDeleteInput;
	submissionsList: SubmissionsListInput;
	submissionsGet: SubmissionsGetInput;
	submissionsDelete: SubmissionsDeleteInput;
	submissionsUpdate: SubmissionsUpdateInput;
	submissionsMarkSpam: SubmissionsMarkSpamInput;
	submissionsMarkHam: SubmissionsMarkHamInput;
	submissionsRefireWebhooks: SubmissionsRefireWebhooksInput;
	submissionsRefireWebhooksBulk: SubmissionsRefireWebhooksBulkInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	webhooksList: WebhooksListInput;
	webhooksGet: WebhooksGetInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
	formViewsList: FormViewsListInput;
	formViewsGet: FormViewsGetInput;
	domainsList: DomainsListInput;
};

export type BasinEndpointOutputs = {
	formsList: FormsListResponse;
	formsGet: FormsGetResponse;
	formsCreate: FormsCreateResponse;
	formsUpdate: FormsUpdateResponse;
	formsDelete: FormsDeleteResponse;
	submissionsList: SubmissionsListResponse;
	submissionsGet: SubmissionsGetResponse;
	submissionsDelete: SubmissionsDeleteResponse;
	submissionsUpdate: SubmissionsUpdateResponse;
	submissionsMarkSpam: SubmissionsMarkSpamResponse;
	submissionsMarkHam: SubmissionsMarkHamResponse;
	submissionsRefireWebhooks: SubmissionsRefireWebhooksResponse;
	submissionsRefireWebhooksBulk: SubmissionsRefireWebhooksBulkResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
	webhooksList: WebhooksListResponse;
	webhooksGet: WebhooksGetResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksUpdate: WebhooksUpdateResponse;
	webhooksDelete: WebhooksDeleteResponse;
	formViewsList: FormViewsListResponse;
	formViewsGet: FormViewsGetResponse;
	domainsList: DomainsListResponse;
};

export const BasinEndpointInputSchemas = {
	formsList: FormsListInputSchema,
	formsGet: FormsGetInputSchema,
	formsCreate: FormsCreateInputSchema,
	formsUpdate: FormsUpdateInputSchema,
	formsDelete: FormsDeleteInputSchema,
	submissionsList: SubmissionsListInputSchema,
	submissionsGet: SubmissionsGetInputSchema,
	submissionsDelete: SubmissionsDeleteInputSchema,
	submissionsUpdate: SubmissionsUpdateInputSchema,
	submissionsMarkSpam: SubmissionsMarkSpamInputSchema,
	submissionsMarkHam: SubmissionsMarkHamInputSchema,
	submissionsRefireWebhooks: SubmissionsRefireWebhooksInputSchema,
	submissionsRefireWebhooksBulk: SubmissionsRefireWebhooksBulkInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	formViewsList: FormViewsListInputSchema,
	formViewsGet: FormViewsGetInputSchema,
	domainsList: DomainsListInputSchema,
} as const;

export const BasinEndpointOutputSchemas = {
	formsList: FormsListResponseSchema,
	formsGet: FormsGetResponseSchema,
	formsCreate: FormsCreateResponseSchema,
	formsUpdate: FormsUpdateResponseSchema,
	formsDelete: FormsDeleteResponseSchema,
	submissionsList: SubmissionsListResponseSchema,
	submissionsGet: SubmissionsGetResponseSchema,
	submissionsDelete: SubmissionsDeleteResponseSchema,
	submissionsUpdate: SubmissionsUpdateResponseSchema,
	submissionsMarkSpam: SubmissionsMarkSpamResponseSchema,
	submissionsMarkHam: SubmissionsMarkHamResponseSchema,
	submissionsRefireWebhooks: SubmissionsRefireWebhooksResponseSchema,
	submissionsRefireWebhooksBulk: SubmissionsRefireWebhooksBulkResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGet: WebhooksGetResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	formViewsList: FormViewsListResponseSchema,
	formViewsGet: FormViewsGetResponseSchema,
	domainsList: DomainsListResponseSchema,
} as const;
