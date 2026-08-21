import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

export const BasinFormSchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		uuid: z.string().nullable().optional(),
		name: z.string().optional(),
		timezone: z.string().optional(),
		redirect_url: z.string().nullable().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		notification_cc_emails: z.string().nullable().optional(),
		notification_bcc_emails: z.string().nullable().optional(),
		notification_subject: z.string().nullable().optional(),
		notification_from_name: z.string().nullable().optional(),
		autoreply: z.boolean().optional(),
		autoreply_subject: z.string().nullable().optional(),
		autoreply_from_name: z.string().nullable().optional(),
		autoreply_body: z.string().nullable().optional(),
		whitelist_source_domains: z.string().nullable().optional(),
		force_recaptcha: z.boolean().optional(),
		force_hcaptcha: z.boolean().optional(),
		force_turnstile: z.boolean().optional(),
		turnstile_site_key: z.string().nullable().optional(),
		turnstile_secret: z.string().nullable().optional(),
		project_id: z.number().nullable().optional(),
		project_name: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		form_webhooks: z.array(z.unknown()).optional(),
		inbox_count: z.number().optional(),
		spam_count: z.number().optional(),
		trash_count: z.number().optional(),
	})
	.passthrough();

export const BasinSubmissionSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.union([z.number(), z.string()]).optional(),
		email: z.string().nullable().optional(),
		payload_params: z.record(z.string(), z.unknown()).optional(),
		spam: z.boolean().optional(),
		read: z.boolean().optional(),
		trash: z.boolean().optional(),
		spam_reason: z.string().nullable().optional(),
		webhook_sent_at: z.string().nullable().optional(),
		ip: z.string().nullable().optional(),
		referrer: z.string().nullable().optional(),
		user_agent: z.string().nullable().optional(),
		attachments: z.array(z.unknown()).nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		form: z
			.object({
				id: z.union([z.number(), z.string()]).optional(),
				name: z.string().optional(),
				uuid: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const BasinProjectSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const BasinFormWebhookSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		form_id: z.union([z.number(), z.string()]).optional(),
		name: z.string().optional(),
		url: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		failure_count: z.number().optional(),
		last_failure_at: z.string().nullable().optional(),
	})
	.passthrough();

export const BasinDomainSchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		domain: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const BasinFormViewSchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		form_id: z.union([z.number(), z.string()]).optional(),
		name: z.string().nullable().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
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
				id: z.union([z.number(), z.string()]).optional(),
				name: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		project: z
			.object({
				id: z.union([z.number(), z.string()]).optional(),
				name: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// 1. Forms Operation Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const FormsCreateInputSchema = z
	.object({
		name: z.string(),
		project_id: z.number().optional(),
		redirect_url: z.string().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		notification_cc_emails: z.string().optional(),
		notification_bcc_emails: z.string().optional(),
		notification_subject: z.string().optional(),
		notification_from_name: z.string().optional(),
		autoreply: z.boolean().optional(),
		autoreply_subject: z.string().optional(),
		autoreply_from_name: z.string().optional(),
		autoreply_body: z.string().optional(),
		whitelist_source_domains: z.string().optional(),
		timezone: z.string().optional(),
		force_recaptcha: z.boolean().optional(),
		force_hcaptcha: z.boolean().optional(),
		force_turnstile: z.boolean().optional(),
		turnstile_site_key: z.string().optional(),
		turnstile_secret: z.string().optional(),
	})
	.passthrough();

export const FormsCreateResponseSchema = BasinFormSchema;

export const FormsListInputSchema = z
	.object({
		page: z.union([z.string(), z.number()]).optional(),
		query: z.string().optional(),
	})
	.optional();

export const FormsListResponseSchema = z.union([
	z.array(BasinFormSchema),
	z
		.object({
			forms: z.array(BasinFormSchema).optional(),
			page: z.number().optional(),
			total_pages: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

export const FormsGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const FormsGetResponseSchema = BasinFormSchema;

export const FormsUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().optional(),
		project_id: z.number().optional(),
		redirect_url: z.string().optional(),
		use_ajax: z.boolean().optional(),
		notification_emails: z.string().optional(),
		notification_cc_emails: z.string().optional(),
		notification_bcc_emails: z.string().optional(),
		notification_subject: z.string().optional(),
		notification_from_name: z.string().optional(),
		autoreply: z.boolean().optional(),
		autoreply_subject: z.string().optional(),
		autoreply_from_name: z.string().optional(),
		autoreply_body: z.string().optional(),
		whitelist_source_domains: z.string().optional(),
		timezone: z.string().optional(),
		force_recaptcha: z.boolean().optional(),
		force_hcaptcha: z.boolean().optional(),
		force_turnstile: z.boolean().optional(),
		turnstile_site_key: z.string().optional(),
		turnstile_secret: z.string().optional(),
	})
	.passthrough();

export const FormsUpdateResponseSchema = BasinFormSchema;

export const FormsDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const FormsDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// 2. Submissions Operation Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const SubmissionsListInputSchema = z
	.object({
		form_id: z.union([z.string(), z.number()]).optional(),
		filter_by: z.string().optional(),
		query: z.string().optional(),
		order_by: z.string().optional(),
		date_range: z.string().optional(),
		page: z.union([z.string(), z.number()]).optional(),
	})
	.optional();

export const SubmissionsListResponseSchema = z.union([
	z.array(BasinSubmissionSchema),
	z
		.object({
			submissions: z.array(BasinSubmissionSchema).optional(),
			page: z.number().optional(),
			total_pages: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

export const SubmissionsDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const SubmissionsDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// 3. Projects Operation Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectsCreateInputSchema = z
	.object({
		name: z.string(),
	})
	.passthrough();

export const ProjectsCreateResponseSchema = BasinProjectSchema;

export const ProjectsListInputSchema = z
	.object({
		page: z.union([z.string(), z.number()]).optional(),
		query: z.string().optional(),
	})
	.optional();

export const ProjectsListResponseSchema = z.union([
	z.array(BasinProjectSchema),
	z
		.object({
			projects: z.array(BasinProjectSchema).optional(),
			page: z.number().optional(),
			total_pages: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

export const ProjectsGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const ProjectsGetResponseSchema = BasinProjectSchema;

export const ProjectsUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
	})
	.passthrough();

export const ProjectsUpdateResponseSchema = BasinProjectSchema;

export const ProjectsDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const ProjectsDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// 4. Webhooks Operation Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const WebhooksCreateInputSchema = z
	.object({
		form_id: z.union([z.string(), z.number()]),
		url: z.string(),
		name: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
	})
	.passthrough();

export const WebhooksCreateResponseSchema = BasinFormWebhookSchema;

export const WebhooksListForFormInputSchema = z.object({
	form_id: z.union([z.string(), z.number()]),
	page: z.union([z.string(), z.number()]).optional(),
});

export const WebhooksListForFormResponseSchema = z.union([
	z.array(BasinFormWebhookSchema),
	z
		.object({
			form_webhooks: z.array(BasinFormWebhookSchema).optional(),
			page: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

export const WebhooksGetInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const WebhooksGetResponseSchema = BasinFormWebhookSchema;

export const WebhooksListInputSchema = z
	.object({
		page: z.union([z.string(), z.number()]).optional(),
		query: z.string().optional(),
	})
	.optional();

export const WebhooksListResponseSchema = z.union([
	z.array(BasinFormWebhookSchema),
	z
		.object({
			form_webhooks: z.array(BasinFormWebhookSchema).optional(),
			page: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

export const WebhooksUpdateInputSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		form_id: z.union([z.string(), z.number()]).optional(),
		url: z.string().optional(),
		name: z.string().optional(),
		format: z.string().optional(),
		trigger_when_spam: z.boolean().optional(),
		enabled: z.boolean().optional(),
	})
	.passthrough();

export const WebhooksUpdateResponseSchema = BasinFormWebhookSchema;

export const WebhooksDeleteInputSchema = z.object({
	id: z.union([z.string(), z.number()]),
});

export const WebhooksDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// 5. Form Views & Domains Operation Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const FormViewsListInputSchema = z
	.object({
		page: z.union([z.string(), z.number()]).optional(),
		query: z.string().optional(),
	})
	.optional();

export const FormViewsListResponseSchema = z.union([
	z.array(BasinFormViewSchema),
	z
		.object({
			form_views: z.array(BasinFormViewSchema).optional(),
			page: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

export const DomainsListInputSchema = z
	.object({
		page: z.union([z.string(), z.number()]).optional(),
		query: z.string().optional(),
	})
	.optional();

export const DomainsListResponseSchema = z.union([
	z.array(BasinDomainSchema),
	z
		.object({
			domains: z.array(BasinDomainSchema).optional(),
			page: z.number().optional(),
		})
		.passthrough(),
	z.record(z.string(), z.unknown()),
]);

// ─────────────────────────────────────────────────────────────────────────────
// Inferred TypeScript Types
// ─────────────────────────────────────────────────────────────────────────────

export type FormsCreateInput = z.infer<typeof FormsCreateInputSchema>;
export type FormsCreateResponse = z.infer<typeof FormsCreateResponseSchema>;
export type FormsListInput = z.infer<typeof FormsListInputSchema>;
export type FormsListResponse = z.infer<typeof FormsListResponseSchema>;
export type FormsGetInput = z.infer<typeof FormsGetInputSchema>;
export type FormsGetResponse = z.infer<typeof FormsGetResponseSchema>;
export type FormsUpdateInput = z.infer<typeof FormsUpdateInputSchema>;
export type FormsUpdateResponse = z.infer<typeof FormsUpdateResponseSchema>;
export type FormsDeleteInput = z.infer<typeof FormsDeleteInputSchema>;
export type FormsDeleteResponse = z.infer<typeof FormsDeleteResponseSchema>;

export type SubmissionsListInput = z.infer<typeof SubmissionsListInputSchema>;
export type SubmissionsListResponse = z.infer<
	typeof SubmissionsListResponseSchema
>;
export type SubmissionsDeleteInput = z.infer<
	typeof SubmissionsDeleteInputSchema
>;
export type SubmissionsDeleteResponse = z.infer<
	typeof SubmissionsDeleteResponseSchema
>;

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;
export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;
export type WebhooksListForFormInput = z.infer<
	typeof WebhooksListForFormInputSchema
>;
export type WebhooksListForFormResponse = z.infer<
	typeof WebhooksListForFormResponseSchema
>;
export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;
export type WebhooksGetResponse = z.infer<typeof WebhooksGetResponseSchema>;
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;
export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;
export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;
export type WebhooksUpdateResponse = z.infer<
	typeof WebhooksUpdateResponseSchema
>;
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;
export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

export type FormViewsListInput = z.infer<typeof FormViewsListInputSchema>;
export type FormViewsListResponse = z.infer<typeof FormViewsListResponseSchema>;
export type DomainsListInput = z.infer<typeof DomainsListInputSchema>;
export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Map Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type BasinEndpointInputs = {
	formsCreate: FormsCreateInput;
	formsList: FormsListInput;
	formsGet: FormsGetInput;
	formsUpdate: FormsUpdateInput;
	formsDelete: FormsDeleteInput;
	submissionsList: SubmissionsListInput;
	submissionsDelete: SubmissionsDeleteInput;
	projectsCreate: ProjectsCreateInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksListForForm: WebhooksListForFormInput;
	webhooksGet: WebhooksGetInput;
	webhooksList: WebhooksListInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
	formViewsList: FormViewsListInput;
	domainsList: DomainsListInput;
};

export type BasinEndpointOutputs = {
	formsCreate: FormsCreateResponse;
	formsList: FormsListResponse;
	formsGet: FormsGetResponse;
	formsUpdate: FormsUpdateResponse;
	formsDelete: FormsDeleteResponse;
	submissionsList: SubmissionsListResponse;
	submissionsDelete: SubmissionsDeleteResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksListForForm: WebhooksListForFormResponse;
	webhooksGet: WebhooksGetResponse;
	webhooksList: WebhooksListResponse;
	webhooksUpdate: WebhooksUpdateResponse;
	webhooksDelete: WebhooksDeleteResponse;
	formViewsList: FormViewsListResponse;
	domainsList: DomainsListResponse;
};

export const BasinEndpointInputSchemas = {
	formsCreate: FormsCreateInputSchema,
	formsList: FormsListInputSchema,
	formsGet: FormsGetInputSchema,
	formsUpdate: FormsUpdateInputSchema,
	formsDelete: FormsDeleteInputSchema,
	submissionsList: SubmissionsListInputSchema,
	submissionsDelete: SubmissionsDeleteInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksListForForm: WebhooksListForFormInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	formViewsList: FormViewsListInputSchema,
	domainsList: DomainsListInputSchema,
} as const;

export const BasinEndpointOutputSchemas = {
	formsCreate: FormsCreateResponseSchema,
	formsList: FormsListResponseSchema,
	formsGet: FormsGetResponseSchema,
	formsUpdate: FormsUpdateResponseSchema,
	formsDelete: FormsDeleteResponseSchema,
	submissionsList: SubmissionsListResponseSchema,
	submissionsDelete: SubmissionsDeleteResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksListForForm: WebhooksListForFormResponseSchema,
	webhooksGet: WebhooksGetResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	formViewsList: FormViewsListResponseSchema,
	domainsList: DomainsListResponseSchema,
} as const;
