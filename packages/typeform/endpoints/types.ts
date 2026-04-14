import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const ThemeColorsSchema = z
	.object({
		answer: z.string().optional(),
		button: z.string().optional(),
		question: z.string().optional(),
		background: z.string().optional(),
	})
	.passthrough();

const ThemeFieldsSchema = z
	.object({
		alignment: z.enum(['left', 'center']).optional(),
		font_size: z.enum(['small', 'medium', 'large']).optional(),
	})
	.passthrough();

const ThemeBackgroundSchema = z
	.object({
		href: z.string().optional(),
		layout: z.enum(['fullscreen', 'repeat', 'no-repeat']).optional(),
		brightness: z.number().optional(),
	})
	.passthrough();

const ThemeScreensSchema = z
	.object({
		// screens config is freeform per Typeform's schema
		font_size: z.string().optional(),
		alignment: z.string().optional(),
	})
	.passthrough();

const WorkspaceMemberSchema = z
	.object({
		name: z.string().optional(),
		role: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

const WorkspaceFormsInfoSchema = z
	.object({
		href: z.string().optional(),
		count: z.number().optional(),
	})
	.passthrough();

const ImageResponseSchema = z
	.object({
		id: z.string().optional(),
		src: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		avg_color: z.string().optional(),
		file_name: z.string().optional(),
		has_alpha: z.boolean().optional(),
		media_type: z.string().optional(),
	})
	.passthrough();

const WebhookConfigSchema = z
	.object({
		id: z.string().optional(),
		tag: z.string().optional(),
		url: z.string().optional(),
		secret: z.string().optional(),
		enabled: z.boolean().optional(),
		form_id: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		verify_ssl: z.boolean().optional(),
		event_types: z.array(z.string()).optional(),
	})
	.passthrough();

const FormFieldSchema = z
	.object({
		id: z.string().optional(),
		ref: z.string().optional(),
		type: z.string().optional(),
		title: z.string().optional(),
		attachment: z
			.object({
				href: z.string().optional(),
				type: z.string().optional(),
				scale: z.number().optional(),
				// properties is freeform per field type
				properties: z.record(z.unknown()).optional(),
			})
			.passthrough()
			.optional(),
		properties: z
			.object({
				// sub-fields for group/matrix fields have dynamic nested structure
				fields: z.array(z.unknown()).optional(),
				// choices have various sub-types depending on field
				choices: z.array(z.unknown()).optional(),
				randomize: z.boolean().optional(),
				hide_marks: z.boolean().optional(),
				button_text: z.string().optional(),
				description: z.string().optional(),
				allow_other_choice: z.boolean().optional(),
				alphabetical_order: z.boolean().optional(),
				vertical_alignment: z.boolean().optional(),
				allow_multiple_selection: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
		validations: z
			.object({
				required: z.boolean().optional(),
				max_value: z.number().optional(),
				min_value: z.number().optional(),
				max_length: z.number().optional(),
				min_length: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const FormSettingsSchema = z
	.object({
		is_trial: z.boolean().optional(),
		language: z.string().optional(),
		is_public: z.boolean().optional(),
		progress_bar: z.string().optional(),
		facebook_pixel: z.string().optional(),
		hide_navigation: z.boolean().optional(),
		google_analytics: z.string().optional(),
		autosave_progress: z.boolean().optional(),
		show_progress_bar: z.boolean().optional(),
		are_uploads_public: z.boolean().optional(),
		google_tag_manager: z.string().optional(),
		show_cookie_consent: z.boolean().optional(),
		free_form_navigation: z.boolean().optional(),
		show_question_number: z.boolean().optional(),
		pro_subdomain_enabled: z.boolean().optional(),
		show_time_to_complete: z.boolean().optional(),
		show_typeform_branding: z.boolean().optional(),
		show_key_hint_on_choices: z.boolean().optional(),
		redirect_after_submit_url: z.string().optional(),
		show_number_of_submissions: z.boolean().optional(),
		// capabilities and notifications have dynamic sub-structures
		capabilities: z.record(z.unknown()).optional(),
		notifications: z.record(z.unknown()).optional(),
	})
	.passthrough();

const WelcomeScreenSchema = z
	.object({
		ref: z.string().optional(),
		title: z.string().optional(),
		attachment: z
			.object({
				href: z.string().optional(),
				type: z.string().optional(),
				scale: z.number().optional(),
				properties: z.record(z.unknown()).optional(),
			})
			.passthrough()
			.optional(),
		properties: z
			.object({
				button_text: z.string().optional(),
				show_button: z.boolean().optional(),
				description: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const ThankyouScreenSchema = z
	.object({
		ref: z.string().optional(),
		title: z.string().optional(),
		attachment: z
			.object({
				href: z.string().optional(),
				type: z.string().optional(),
				scale: z.number().optional(),
				properties: z.record(z.unknown()).optional(),
			})
			.passthrough()
			.optional(),
		properties: z
			.object({
				button_text: z.string().optional(),
				button_mode: z.string().optional(),
				redirect_url: z.string().optional(),
				show_button: z.boolean().optional(),
				description: z.string().optional(),
				share_icons: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const LogicJumpSchema = z
	.object({
		ref: z.string().optional(),
		type: z.string().optional(),
		// actions have dynamic condition trees per Typeform's logic system
		actions: z.array(z.unknown()).optional(),
	})
	.passthrough();

const JsonPatchOperationSchema = z
	.object({
		op: z.enum(['add', 'remove', 'replace', 'move', 'copy', 'test']),
		path: z.string(),
		// value can be any JSON type depending on the path being patched
		value: z.unknown().optional(),
		from: z.string().optional(),
	})
	.passthrough();

const ResponseAnswerSchema = z
	.object({
		type: z.string().optional(),
		text: z.string().optional(),
		email: z.string().optional(),
		url: z.string().optional(),
		date: z.string().optional(),
		number: z.number().optional(),
		boolean: z.boolean().optional(),
		phone_number: z.string().optional(),
		file_url: z.string().optional(),
		choice: z
			.object({
				id: z.string().optional(),
				ref: z.string().optional(),
				label: z.string().optional(),
				other: z.string().optional(),
			})
			.passthrough()
			.optional(),
		choices: z
			.object({
				ids: z.array(z.string()).optional(),
				refs: z.array(z.string()).optional(),
				labels: z.array(z.string()).optional(),
				other: z.string().optional(),
			})
			.passthrough()
			.optional(),
		field: z
			.object({
				id: z.string().optional(),
				ref: z.string().optional(),
				type: z.string().optional(),
			})
			.passthrough()
			.optional(),
		// payment details vary and have no fixed schema
		payment: z.record(z.unknown()).optional(),
		// multi_format (audio/video) has provider-specific structure
		multi_format: z.record(z.unknown()).optional(),
	})
	.passthrough();

// ── Input Schemas ─────────────────────────────────────────────────────────────

// Me
const MeGetInputSchema = z.object({}).passthrough();

// Forms
const FormsListInputSchema = z.object({
	page: z.number().optional(),
	search: z.string().optional(),
	sort_by: z.enum(['created_at', 'last_updated_at']).optional(),
	order_by: z.enum(['asc', 'desc']).optional(),
	page_size: z.number().optional(),
	workspace_id: z.string().optional(),
});

const FormsGetInputSchema = z
	.object({
		form_id: z.string(),
	})
	.passthrough();

const FormsCreateInputSchema = z
	.object({
		title: z.string(),
		type: z.string().optional(),
		fields: z.array(FormFieldSchema).optional(),
		logic: z.array(LogicJumpSchema).optional(),
		theme: z.object({ href: z.string() }).passthrough().optional(),
		settings: FormSettingsSchema.optional(),
		workspace: z.object({ href: z.string() }).passthrough().optional(),
		welcome_screens: z.array(WelcomeScreenSchema).optional(),
		thankyou_screens: z.array(ThankyouScreenSchema).optional(),
	})
	.passthrough();

const FormsUpdateInputSchema = z
	.object({
		form_id: z.string(),
		title: z.string().optional(),
		type: z.string().optional(),
		fields: z.array(FormFieldSchema).optional(),
		logic: z.array(LogicJumpSchema).optional(),
		theme: z.object({ href: z.string() }).passthrough().optional(),
		hidden: z.array(z.string()).optional(),
		settings: FormSettingsSchema.optional(),
		variables: z.record(z.unknown()).optional(),
		workspace: z.object({ href: z.string() }).passthrough().optional(),
		welcome_screens: z.array(WelcomeScreenSchema).optional(),
		thankyou_screens: z.array(ThankyouScreenSchema).optional(),
	})
	.passthrough();

const FormsPatchInputSchema = z
	.object({
		form_id: z.string(),
		operations: z.array(JsonPatchOperationSchema),
	})
	.passthrough();

const FormsDeleteInputSchema = z
	.object({
		form_id: z.string(),
	})
	.passthrough();

const FormsGetMessagesInputSchema = z
	.object({
		form_id: z.string(),
	})
	.passthrough();

const FormsUpdateMessagesInputSchema = z
	.object({
		form_id: z.string(),
		label_button_submit: z.string().optional(),
		label_error_required: z.string().optional(),
		label_buttonHint_default: z.string().optional(),
		block_shortText_placeholder: z.string().optional(),
		label_buttonNoAnswer_default: z.string().optional(),
	})
	.passthrough();

// Responses
const ResponsesListInputSchema = z
	.object({
		form_id: z.string(),
		sort: z.string().optional(),
		after: z.string().optional(),
		query: z.string().optional(),
		since: z.string().optional(),
		until: z.string().optional(),
		before: z.string().optional(),
		fields: z.array(z.string()).optional(),
		page_size: z.number().optional(),
		response_type: z.array(z.string()).optional(),
		answered_fields: z.array(z.string()).optional(),
		excluded_response_ids: z.string().optional(),
		included_response_ids: z.string().optional(),
	})
	.passthrough();

const ResponsesDeleteInputSchema = z
	.object({
		form_id: z.string(),
		included_response_ids: z.string(),
	})
	.passthrough();

const ResponsesGetAllFilesInputSchema = z
	.object({
		form_id: z.string(),
	})
	.passthrough();

// Workspaces
const WorkspacesListInputSchema = z
	.object({
		page: z.number().optional(),
		search: z.string().optional(),
		page_size: z.number().optional(),
	})
	.passthrough();

const WorkspacesGetInputSchema = z
	.object({
		workspace_id: z.string(),
	})
	.passthrough();

const WorkspacesCreateInputSchema = z
	.object({
		name: z.string(),
	})
	.passthrough();

const WorkspacesCreateForAccountInputSchema = z
	.object({
		name: z.string(),
		account_id: z.string(),
	})
	.passthrough();

const WorkspacesUpdateInputSchema = z
	.object({
		workspace_id: z.string(),
		operations: z.array(JsonPatchOperationSchema),
	})
	.passthrough();

const WorkspacesDeleteInputSchema = z
	.object({
		workspace_id: z.string(),
	})
	.passthrough();

// Images
const ImagesListInputSchema = z.object({}).passthrough();

const ImagesCreateInputSchema = z
	.object({
		file_name: z.string(),
		url: z.string().optional(),
		image: z.string().optional(),
	})
	.passthrough();

const ImagesDeleteInputSchema = z
	.object({
		image_id: z.string(),
	})
	.passthrough();

const ImagesGetBySizeInputSchema = z
	.object({
		image_id: z.string(),
		size: z.string(),
	})
	.passthrough();

const ImagesGetBackgroundBySizeInputSchema = z
	.object({
		image_id: z.string(),
		size: z.string(),
	})
	.passthrough();

const ImagesGetChoiceImageBySizeInputSchema = z
	.object({
		image_id: z.string(),
		size: z.string(),
	})
	.passthrough();

// Themes
const ThemesListInputSchema = z
	.object({
		page: z.number().optional(),
		page_size: z.number().optional(),
	})
	.passthrough();

const ThemesGetInputSchema = z
	.object({
		theme_id: z.string(),
	})
	.passthrough();

const ThemesCreateInputSchema = z
	.object({
		font: z.string(),
		colors: ThemeColorsSchema,
		fields: ThemeFieldsSchema,
		name: z.string().optional(),
		background: ThemeBackgroundSchema.optional(),
		rounded_corners: z.string().optional(),
		has_transparent_button: z.boolean().optional(),
	})
	.passthrough();

const ThemesUpdateInputSchema = z
	.object({
		theme_id: z.string(),
		font: z.string(),
		name: z.string(),
		colors: ThemeColorsSchema,
		fields: ThemeFieldsSchema.optional(),
		screens: ThemeScreensSchema.optional(),
		background: ThemeBackgroundSchema.optional(),
		rounded_corners: z.string().optional(),
		has_transparent_button: z.boolean().optional(),
	})
	.passthrough();

const ThemesPatchInputSchema = z
	.object({
		theme_id: z.string(),
		font: z.string().optional(),
		name: z.string().optional(),
		colors: ThemeColorsSchema.optional(),
		fields: ThemeFieldsSchema.optional(),
		screens: ThemeScreensSchema.optional(),
		background: ThemeBackgroundSchema.optional(),
		rounded_corners: z.string().optional(),
		has_transparent_button: z.boolean().optional(),
	})
	.passthrough();

const ThemesDeleteInputSchema = z
	.object({
		theme_id: z.string(),
	})
	.passthrough();

// Webhooks Config
const WebhooksConfigListInputSchema = z
	.object({
		form_id: z.string(),
	})
	.passthrough();

const WebhooksConfigGetInputSchema = z
	.object({
		form_id: z.string(),
		tag: z.string(),
	})
	.passthrough();

const WebhooksConfigCreateOrUpdateInputSchema = z
	.object({
		form_id: z.string(),
		tag: z.string(),
		url: z.string(),
		enabled: z.boolean().optional(),
		secret: z.string().optional(),
		verify_ssl: z.boolean().optional(),
		event_types: z.array(z.string()).optional(),
	})
	.passthrough();

const WebhooksConfigDeleteInputSchema = z
	.object({
		form_id: z.string(),
		tag: z.string(),
	})
	.passthrough();

// Videos
const VideosUploadInputSchema = z
	.object({
		form_id: z.string(),
		field_id: z.string(),
		language: z.string(),
	})
	.passthrough();

// ── Output Schemas ─────────────────────────────────────────────────────────────

const MeGetResponseSchema = z
	.object({
		// owner_info has no fixed structure in Typeform's schema
		owner_info: z.record(z.unknown()).optional(),
	})
	.passthrough();

const FormsListResponseSchema = z
	.object({
		items: z
			.array(
				z
					.object({
						id: z.string().optional(),
						title: z.string().optional(),
						created_at: z.string().optional(),
						last_updated_at: z.string().optional(),
						settings: z
							.object({ is_public: z.boolean().optional() })
							.passthrough()
							.optional(),
						theme: z
							.object({ href: z.string().optional() })
							.passthrough()
							.optional(),
						// _links contains href refs whose keys vary by form
						_links: z.record(z.unknown()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		page_count: z.number().optional(),
		total_items: z.number().optional(),
	})
	.passthrough();

const FormsGetResponseSchema = z
	.object({
		id: z.string().optional(),
		title: z.string().optional(),
		type: z.string().optional(),
		created_at: z.string().optional(),
		last_updated_at: z.string().optional(),
		fields: z.array(FormFieldSchema).optional(),
		logic: z.array(LogicJumpSchema).optional(),
		theme: z.object({ href: z.string().optional() }).passthrough().optional(),
		hidden: z.array(z.string()).optional(),
		settings: FormSettingsSchema.optional(),
		// variables have dynamic keys keyed by variable name
		variables: z.record(z.unknown()).optional(),
		workspace: z
			.object({ href: z.string().optional() })
			.passthrough()
			.optional(),
		welcome_screens: z.array(WelcomeScreenSchema).optional(),
		thankyou_screens: z.array(ThankyouScreenSchema).optional(),
		// _links structure varies and cannot be fully typed statically
		_links: z.record(z.unknown()).optional(),
		// cui_settings and captcha have no fixed public schema
		cui_settings: z.record(z.unknown()).optional(),
		captcha: z.record(z.unknown()).optional(),
		meta: z.record(z.unknown()).optional(),
		links: z.record(z.unknown()).optional(),
		language: z.string().optional(),
		duplicate_prevention: z.boolean().optional(),
	})
	.passthrough();

const FormsCreateResponseSchema = FormsGetResponseSchema;

const FormsUpdateResponseSchema = FormsGetResponseSchema;

// Typeform PATCH /forms returns 204 No Content (no body)
const FormsPatchResponseSchema = z.unknown();

// Typeform DELETE /forms returns 204 No Content (no body)
const FormsDeleteResponseSchema = z.unknown();

const FormsGetMessagesResponseSchema = z
	.object({
		// messages are keyed by message key (e.g. "block.shortText.placeholder")
		block: z.string().optional(),
		label: z.string().optional(),
	})
	.passthrough();

const FormsUpdateMessagesResponseSchema = z
	.object({
		message: z.string().optional(),
		success: z.boolean().optional(),
	})
	.passthrough();

const ResponsesListResponseSchema = z
	.object({
		items: z
			.array(
				z
					.object({
						token: z.string().optional(),
						response_id: z.string().optional(),
						submitted_at: z.string().optional(),
						landed_at: z.string().optional(),
						answers: z.array(ResponseAnswerSchema).optional(),
						calculated: z
							.object({ score: z.number().optional() })
							.passthrough()
							.optional(),
						metadata: z
							.object({
								browser: z.string().optional(),
								referer: z.string().optional(),
								platform: z.string().optional(),
								network_id: z.string().optional(),
								user_agent: z.string().optional(),
							})
							.passthrough()
							.optional(),
						// hidden fields have dynamic string keys set by form creator
						hidden: z.record(z.string()).optional(),
						variables: z
							.array(
								z
									.object({
										key: z.string().optional(),
										type: z.string().optional(),
										text: z.string().optional(),
										number: z.number().optional(),
									})
									.passthrough(),
							)
							.optional(),
					})
					.passthrough(),
			)
			.optional(),
		page_count: z.number().optional(),
		total_items: z.number().optional(),
	})
	.passthrough();

const ResponsesDeleteResponseSchema = z
	.object({
		status: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

// GET /responses/files returns a ZIP binary or empty body when no files exist
const ResponsesGetAllFilesResponseSchema = z.unknown();

const WorkspaceItemSchema = z
	.object({
		id: z.string().optional(),
		href: z.string().optional(),
		name: z.string().optional(),
		forms: WorkspaceFormsInfoSchema.optional(),
		// members list items have no guaranteed sub-structure
		members: z.array(WorkspaceMemberSchema).optional(),
		shared: z.boolean().optional(),
		default: z.boolean().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();

const WorkspacesListResponseSchema = z
	.object({
		workspaces: z.array(WorkspaceItemSchema).optional(),
	})
	.passthrough();

const WorkspacesGetResponseSchema = WorkspaceItemSchema;

const WorkspacesCreateResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		self: z.object({ href: z.string().optional() }).passthrough().optional(),
		forms: WorkspaceFormsInfoSchema.optional(),
		shared: z.boolean().optional(),
		default: z.boolean().optional(),
		members: z.array(WorkspaceMemberSchema).optional(),
		account_id: z.string().optional(),
	})
	.passthrough();

const WorkspacesCreateForAccountResponseSchema = WorkspacesCreateResponseSchema;

// Typeform PATCH /workspaces returns 204 No Content (no body)
const WorkspacesUpdateResponseSchema = z.unknown();

// Typeform DELETE /workspaces returns 204 No Content (no body)
const WorkspacesDeleteResponseSchema = z.unknown();

// Typeform GET /images returns a raw array, not a wrapped object
const ImagesListResponseSchema = z.array(ImageResponseSchema);

const ImagesCreateResponseSchema = ImageResponseSchema;

// Typeform DELETE /images returns 204 No Content (no body)
const ImagesDeleteResponseSchema = z.unknown();

const ImagesGetBySizeResponseSchema = ImageResponseSchema;

const ImagesGetBackgroundBySizeResponseSchema = ImageResponseSchema;

const ImagesGetChoiceImageBySizeResponseSchema = ImageResponseSchema;

const ThemeResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		font: z.string().optional(),
		visibility: z.string().optional(),
		rounded_corners: z.string().optional(),
		has_transparent_button: z.boolean().optional(),
		colors: ThemeColorsSchema.optional(),
		background: ThemeBackgroundSchema.optional(),
		fields: ThemeFieldsSchema.optional(),
		// screens styling has no fixed public schema
		screens: z.record(z.unknown()).optional(),
	})
	.passthrough();

const ThemesListResponseSchema = z
	.object({
		items: z.array(ThemeResponseSchema).optional(),
		page_count: z.number().optional(),
		total_items: z.number().optional(),
	})
	.passthrough();

const ThemesGetResponseSchema = ThemeResponseSchema;

const ThemesCreateResponseSchema = ThemeResponseSchema;

const ThemesUpdateResponseSchema = ThemeResponseSchema;

const ThemesPatchResponseSchema = ThemeResponseSchema;

// Typeform DELETE /themes returns 204 No Content (no body)
const ThemesDeleteResponseSchema = z.unknown();

const WebhooksConfigListResponseSchema = z
	.object({
		webhooks: z.array(WebhookConfigSchema).optional(),
	})
	.passthrough();

const WebhooksConfigGetResponseSchema = WebhookConfigSchema;

const WebhooksConfigCreateOrUpdateResponseSchema = WebhookConfigSchema;

const WebhooksConfigDeleteResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();

const VideosUploadResponseSchema = z
	.object({
		id: z.string().optional(),
		upload_url: z.string().optional(),
		transcode_status: z.string().optional(),
	})
	.passthrough();

// ── Type Exports ──────────────────────────────────────────────────────────────

export type MeGetInput = z.infer<typeof MeGetInputSchema>;
export type MeGetResponse = z.infer<typeof MeGetResponseSchema>;

export type FormsListInput = z.infer<typeof FormsListInputSchema>;
export type FormsListResponse = z.infer<typeof FormsListResponseSchema>;
export type FormsGetInput = z.infer<typeof FormsGetInputSchema>;
export type FormsGetResponse = z.infer<typeof FormsGetResponseSchema>;
export type FormsCreateInput = z.infer<typeof FormsCreateInputSchema>;
export type FormsCreateResponse = z.infer<typeof FormsCreateResponseSchema>;
export type FormsUpdateInput = z.infer<typeof FormsUpdateInputSchema>;
export type FormsUpdateResponse = z.infer<typeof FormsUpdateResponseSchema>;
export type FormsPatchInput = z.infer<typeof FormsPatchInputSchema>;
export type FormsPatchResponse = z.infer<typeof FormsPatchResponseSchema>;
export type FormsDeleteInput = z.infer<typeof FormsDeleteInputSchema>;
export type FormsDeleteResponse = z.infer<typeof FormsDeleteResponseSchema>;
export type FormsGetMessagesInput = z.infer<typeof FormsGetMessagesInputSchema>;
export type FormsGetMessagesResponse = z.infer<
	typeof FormsGetMessagesResponseSchema
>;
export type FormsUpdateMessagesInput = z.infer<
	typeof FormsUpdateMessagesInputSchema
>;
export type FormsUpdateMessagesResponse = z.infer<
	typeof FormsUpdateMessagesResponseSchema
>;

export type ResponsesListInput = z.infer<typeof ResponsesListInputSchema>;
export type ResponsesListResponse = z.infer<typeof ResponsesListResponseSchema>;
export type ResponsesDeleteInput = z.infer<typeof ResponsesDeleteInputSchema>;
export type ResponsesDeleteResponse = z.infer<
	typeof ResponsesDeleteResponseSchema
>;
export type ResponsesGetAllFilesInput = z.infer<
	typeof ResponsesGetAllFilesInputSchema
>;
export type ResponsesGetAllFilesResponse = z.infer<
	typeof ResponsesGetAllFilesResponseSchema
>;

export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;
export type WorkspacesListResponse = z.infer<
	typeof WorkspacesListResponseSchema
>;
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;
export type WorkspacesGetResponse = z.infer<typeof WorkspacesGetResponseSchema>;
export type WorkspacesCreateInput = z.infer<typeof WorkspacesCreateInputSchema>;
export type WorkspacesCreateResponse = z.infer<
	typeof WorkspacesCreateResponseSchema
>;
export type WorkspacesCreateForAccountInput = z.infer<
	typeof WorkspacesCreateForAccountInputSchema
>;
export type WorkspacesCreateForAccountResponse = z.infer<
	typeof WorkspacesCreateForAccountResponseSchema
>;
export type WorkspacesUpdateInput = z.infer<typeof WorkspacesUpdateInputSchema>;
export type WorkspacesUpdateResponse = z.infer<
	typeof WorkspacesUpdateResponseSchema
>;
export type WorkspacesDeleteInput = z.infer<typeof WorkspacesDeleteInputSchema>;
export type WorkspacesDeleteResponse = z.infer<
	typeof WorkspacesDeleteResponseSchema
>;

export type ImagesListInput = z.infer<typeof ImagesListInputSchema>;
export type ImagesListResponse = z.infer<typeof ImagesListResponseSchema>;
export type ImagesCreateInput = z.infer<typeof ImagesCreateInputSchema>;
export type ImagesCreateResponse = z.infer<typeof ImagesCreateResponseSchema>;
export type ImagesDeleteInput = z.infer<typeof ImagesDeleteInputSchema>;
export type ImagesDeleteResponse = z.infer<typeof ImagesDeleteResponseSchema>;
export type ImagesGetBySizeInput = z.infer<typeof ImagesGetBySizeInputSchema>;
export type ImagesGetBySizeResponse = z.infer<
	typeof ImagesGetBySizeResponseSchema
>;
export type ImagesGetBackgroundBySizeInput = z.infer<
	typeof ImagesGetBackgroundBySizeInputSchema
>;
export type ImagesGetBackgroundBySizeResponse = z.infer<
	typeof ImagesGetBackgroundBySizeResponseSchema
>;
export type ImagesGetChoiceImageBySizeInput = z.infer<
	typeof ImagesGetChoiceImageBySizeInputSchema
>;
export type ImagesGetChoiceImageBySizeResponse = z.infer<
	typeof ImagesGetChoiceImageBySizeResponseSchema
>;

export type ThemesListInput = z.infer<typeof ThemesListInputSchema>;
export type ThemesListResponse = z.infer<typeof ThemesListResponseSchema>;
export type ThemesGetInput = z.infer<typeof ThemesGetInputSchema>;
export type ThemesGetResponse = z.infer<typeof ThemesGetResponseSchema>;
export type ThemesCreateInput = z.infer<typeof ThemesCreateInputSchema>;
export type ThemesCreateResponse = z.infer<typeof ThemesCreateResponseSchema>;
export type ThemesUpdateInput = z.infer<typeof ThemesUpdateInputSchema>;
export type ThemesUpdateResponse = z.infer<typeof ThemesUpdateResponseSchema>;
export type ThemesPatchInput = z.infer<typeof ThemesPatchInputSchema>;
export type ThemesPatchResponse = z.infer<typeof ThemesPatchResponseSchema>;
export type ThemesDeleteInput = z.infer<typeof ThemesDeleteInputSchema>;
export type ThemesDeleteResponse = z.infer<typeof ThemesDeleteResponseSchema>;

export type WebhooksConfigListInput = z.infer<
	typeof WebhooksConfigListInputSchema
>;
export type WebhooksConfigListResponse = z.infer<
	typeof WebhooksConfigListResponseSchema
>;
export type WebhooksConfigGetInput = z.infer<
	typeof WebhooksConfigGetInputSchema
>;
export type WebhooksConfigGetResponse = z.infer<
	typeof WebhooksConfigGetResponseSchema
>;
export type WebhooksConfigCreateOrUpdateInput = z.infer<
	typeof WebhooksConfigCreateOrUpdateInputSchema
>;
export type WebhooksConfigCreateOrUpdateResponse = z.infer<
	typeof WebhooksConfigCreateOrUpdateResponseSchema
>;
export type WebhooksConfigDeleteInput = z.infer<
	typeof WebhooksConfigDeleteInputSchema
>;
export type WebhooksConfigDeleteResponse = z.infer<
	typeof WebhooksConfigDeleteResponseSchema
>;

export type VideosUploadInput = z.infer<typeof VideosUploadInputSchema>;
export type VideosUploadResponse = z.infer<typeof VideosUploadResponseSchema>;

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export type TypeformEndpointInputs = {
	meGet: MeGetInput;
	formsList: FormsListInput;
	formsGet: FormsGetInput;
	formsCreate: FormsCreateInput;
	formsUpdate: FormsUpdateInput;
	formsPatch: FormsPatchInput;
	formsDelete: FormsDeleteInput;
	formsGetMessages: FormsGetMessagesInput;
	formsUpdateMessages: FormsUpdateMessagesInput;
	responsesList: ResponsesListInput;
	responsesDelete: ResponsesDeleteInput;
	responsesGetAllFiles: ResponsesGetAllFilesInput;
	workspacesList: WorkspacesListInput;
	workspacesGet: WorkspacesGetInput;
	workspacesCreate: WorkspacesCreateInput;
	workspacesCreateForAccount: WorkspacesCreateForAccountInput;
	workspacesUpdate: WorkspacesUpdateInput;
	workspacesDelete: WorkspacesDeleteInput;
	imagesList: ImagesListInput;
	imagesCreate: ImagesCreateInput;
	imagesDelete: ImagesDeleteInput;
	imagesGetBySize: ImagesGetBySizeInput;
	imagesGetBackgroundBySize: ImagesGetBackgroundBySizeInput;
	imagesGetChoiceImageBySize: ImagesGetChoiceImageBySizeInput;
	themesList: ThemesListInput;
	themesGet: ThemesGetInput;
	themesCreate: ThemesCreateInput;
	themesUpdate: ThemesUpdateInput;
	themesPatch: ThemesPatchInput;
	themesDelete: ThemesDeleteInput;
	webhooksConfigList: WebhooksConfigListInput;
	webhooksConfigGet: WebhooksConfigGetInput;
	webhooksConfigCreateOrUpdate: WebhooksConfigCreateOrUpdateInput;
	webhooksConfigDelete: WebhooksConfigDeleteInput;
	videosUpload: VideosUploadInput;
};

export type TypeformEndpointOutputs = {
	meGet: MeGetResponse;
	formsList: FormsListResponse;
	formsGet: FormsGetResponse;
	formsCreate: FormsCreateResponse;
	formsUpdate: FormsUpdateResponse;
	formsPatch: FormsPatchResponse;
	formsDelete: FormsDeleteResponse;
	formsGetMessages: FormsGetMessagesResponse;
	formsUpdateMessages: FormsUpdateMessagesResponse;
	responsesList: ResponsesListResponse;
	responsesDelete: ResponsesDeleteResponse;
	responsesGetAllFiles: ResponsesGetAllFilesResponse;
	workspacesList: WorkspacesListResponse;
	workspacesGet: WorkspacesGetResponse;
	workspacesCreate: WorkspacesCreateResponse;
	workspacesCreateForAccount: WorkspacesCreateForAccountResponse;
	workspacesUpdate: WorkspacesUpdateResponse;
	workspacesDelete: WorkspacesDeleteResponse;
	imagesList: ImagesListResponse;
	imagesCreate: ImagesCreateResponse;
	imagesDelete: ImagesDeleteResponse;
	imagesGetBySize: ImagesGetBySizeResponse;
	imagesGetBackgroundBySize: ImagesGetBackgroundBySizeResponse;
	imagesGetChoiceImageBySize: ImagesGetChoiceImageBySizeResponse;
	themesList: ThemesListResponse;
	themesGet: ThemesGetResponse;
	themesCreate: ThemesCreateResponse;
	themesUpdate: ThemesUpdateResponse;
	themesPatch: ThemesPatchResponse;
	themesDelete: ThemesDeleteResponse;
	webhooksConfigList: WebhooksConfigListResponse;
	webhooksConfigGet: WebhooksConfigGetResponse;
	webhooksConfigCreateOrUpdate: WebhooksConfigCreateOrUpdateResponse;
	webhooksConfigDelete: WebhooksConfigDeleteResponse;
	videosUpload: VideosUploadResponse;
};

export const TypeformEndpointInputSchemas = {
	meGet: MeGetInputSchema,
	formsList: FormsListInputSchema,
	formsGet: FormsGetInputSchema,
	formsCreate: FormsCreateInputSchema,
	formsUpdate: FormsUpdateInputSchema,
	formsPatch: FormsPatchInputSchema,
	formsDelete: FormsDeleteInputSchema,
	formsGetMessages: FormsGetMessagesInputSchema,
	formsUpdateMessages: FormsUpdateMessagesInputSchema,
	responsesList: ResponsesListInputSchema,
	responsesDelete: ResponsesDeleteInputSchema,
	responsesGetAllFiles: ResponsesGetAllFilesInputSchema,
	workspacesList: WorkspacesListInputSchema,
	workspacesGet: WorkspacesGetInputSchema,
	workspacesCreate: WorkspacesCreateInputSchema,
	workspacesCreateForAccount: WorkspacesCreateForAccountInputSchema,
	workspacesUpdate: WorkspacesUpdateInputSchema,
	workspacesDelete: WorkspacesDeleteInputSchema,
	imagesList: ImagesListInputSchema,
	imagesCreate: ImagesCreateInputSchema,
	imagesDelete: ImagesDeleteInputSchema,
	imagesGetBySize: ImagesGetBySizeInputSchema,
	imagesGetBackgroundBySize: ImagesGetBackgroundBySizeInputSchema,
	imagesGetChoiceImageBySize: ImagesGetChoiceImageBySizeInputSchema,
	themesList: ThemesListInputSchema,
	themesGet: ThemesGetInputSchema,
	themesCreate: ThemesCreateInputSchema,
	themesUpdate: ThemesUpdateInputSchema,
	themesPatch: ThemesPatchInputSchema,
	themesDelete: ThemesDeleteInputSchema,
	webhooksConfigList: WebhooksConfigListInputSchema,
	webhooksConfigGet: WebhooksConfigGetInputSchema,
	webhooksConfigCreateOrUpdate: WebhooksConfigCreateOrUpdateInputSchema,
	webhooksConfigDelete: WebhooksConfigDeleteInputSchema,
	videosUpload: VideosUploadInputSchema,
} as const;

export const TypeformEndpointOutputSchemas = {
	meGet: MeGetResponseSchema,
	formsList: FormsListResponseSchema,
	formsGet: FormsGetResponseSchema,
	formsCreate: FormsCreateResponseSchema,
	formsUpdate: FormsUpdateResponseSchema,
	formsPatch: FormsPatchResponseSchema,
	formsDelete: FormsDeleteResponseSchema,
	formsGetMessages: FormsGetMessagesResponseSchema,
	formsUpdateMessages: FormsUpdateMessagesResponseSchema,
	responsesList: ResponsesListResponseSchema,
	responsesDelete: ResponsesDeleteResponseSchema,
	responsesGetAllFiles: ResponsesGetAllFilesResponseSchema,
	workspacesList: WorkspacesListResponseSchema,
	workspacesGet: WorkspacesGetResponseSchema,
	workspacesCreate: WorkspacesCreateResponseSchema,
	workspacesCreateForAccount: WorkspacesCreateForAccountResponseSchema,
	workspacesUpdate: WorkspacesUpdateResponseSchema,
	workspacesDelete: WorkspacesDeleteResponseSchema,
	imagesList: ImagesListResponseSchema,
	imagesCreate: ImagesCreateResponseSchema,
	imagesDelete: ImagesDeleteResponseSchema,
	imagesGetBySize: ImagesGetBySizeResponseSchema,
	imagesGetBackgroundBySize: ImagesGetBackgroundBySizeResponseSchema,
	imagesGetChoiceImageBySize: ImagesGetChoiceImageBySizeResponseSchema,
	themesList: ThemesListResponseSchema,
	themesGet: ThemesGetResponseSchema,
	themesCreate: ThemesCreateResponseSchema,
	themesUpdate: ThemesUpdateResponseSchema,
	themesPatch: ThemesPatchResponseSchema,
	themesDelete: ThemesDeleteResponseSchema,
	webhooksConfigList: WebhooksConfigListResponseSchema,
	webhooksConfigGet: WebhooksConfigGetResponseSchema,
	webhooksConfigCreateOrUpdate: WebhooksConfigCreateOrUpdateResponseSchema,
	webhooksConfigDelete: WebhooksConfigDeleteResponseSchema,
	videosUpload: VideosUploadResponseSchema,
} as const;
