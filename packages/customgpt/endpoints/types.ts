import { z } from 'zod';
import {
	CustomGPTConversation,
	CustomGPTCustomerIntelligence,
	CustomGPTLead,
	CustomGPTLicense,
	CustomGPTMessage,
	CustomGPTPage,
	CustomGPTProject,
	CustomGPTSource,
} from '../schema/database';

/**
 * Zod contracts for every CustomGPT.ai operation exposed by this plugin.
 *
 * Field names, enum members, required-ness and pagination shapes are taken
 * from the official OpenAPI document at
 * `https://docs.customgpt.ai/openapi/openapi.json`. Each operation carries a
 * `@see` link to the matching reference page.
 */

/**
 * The API documents `status` as `success` | `error`. It is typed as a plain
 * string so an unforeseen value cannot fail response validation for an
 * otherwise successful call.
 */
const StatusSchema = z.string();

/** `{ status, data }` — the envelope wrapping every documented response. */
const envelope = <T extends z.ZodType>(data: T) =>
	z.object({ status: StatusSchema, data }).loose();

/**
 * Laravel paginator envelope returned by every paginated CustomGPT list
 * endpoint (agents, documents, personas, intelligence, leads, messages).
 */
const paginated = <T extends z.ZodType>(item: T) =>
	z
		.object({
			current_page: z.number().optional(),
			data: z.array(item),
			first_page_url: z.string().nullable().optional(),
			from: z.number().nullable().optional(),
			last_page: z.number().optional(),
			last_page_url: z.string().nullable().optional(),
			next_page_url: z.string().nullable().optional(),
			path: z.string().optional(),
			per_page: z.union([z.number(), z.string()]).optional(),
			prev_page_url: z.string().nullable().optional(),
			to: z.number().nullable().optional(),
			total: z.number().optional(),
		})
		.loose();

/** `{ status, data: { deleted } }` acknowledgement shared by delete operations. */
const DeletedAckSchema = envelope(
	z.object({ deleted: z.boolean().optional() }).loose(),
);

/** `{ status, data: { updated } }` acknowledgement shared by mutation operations. */
const UpdatedAckSchema = envelope(
	z.object({ updated: z.boolean().optional() }).loose(),
);

/** Identifier of an agent — the API calls agents "projects". */
const projectId = z.number().int().positive();
/** Identifier of an indexed document — the API calls documents "pages". */
const pageId = z.number().int().positive();
const sourceId = z.number().int().positive();
const licenseId = z.number().int().positive();
/** Conversation session identifier (a UUID string, not a numeric id). */
const sessionId = z.string().min(1);
/** Identifier of a single prompt/response exchange within a conversation. */
const promptId = z.number().int().positive();
const pageNumber = z.number().int().positive().optional();

/**
 * A file supplied to a multipart endpoint.
 *
 * The API takes raw binary uploads; content is accepted here as base64 so the
 * input stays JSON-serializable across Corsair's transport boundary, and is
 * decoded to a `Blob` before the request is sent.
 */
export const CustomGPTFileInputSchema = z.object({
	filename: z.string().min(1),
	/** Base64-encoded file contents (no `data:` URI prefix). */
	content_base64: z.string().min(1),
	content_type: z.string().optional(),
});
export type CustomGPTFileInput = z.infer<typeof CustomGPTFileInputSchema>;

const fileFields = {
	file: CustomGPTFileInputSchema.optional(),
	files: z.array(CustomGPTFileInputSchema).optional(),
};

/** Ingestion options shared by agent creation and source creation. */
const ingestionOptions = {
	sitemap_path: z.string().optional(),
	file_data_retension: z.boolean().optional(),
	/** 0 = disabled, 1 = enabled, 2 = auto. */
	is_ocr_enabled: z
		.union([z.literal(0), z.literal(1), z.literal(2)])
		.optional(),
	is_anonymized: z.boolean().optional(),
	is_vision_enabled: z.boolean().optional(),
	is_vision_compress_image: z.boolean().optional(),
	is_low_performance_mode_enabled: z.boolean().optional(),
	allow_extra_timeout: z.boolean().optional(),
	use_full_url_crawl: z.boolean().optional(),
	image_extraction_type: z.enum(['none', 'sync_from_sitemap']).optional(),
};

/* ------------------------------------------------------------------ agents */

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects */
export const ListProjectsInputSchema = z.object({
	page: pageNumber,
	duration: z.number().int().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	orderBy: z.enum(['id', 'created_at']).optional(),
	name: z.string().optional(),
	/** Width of the generated embed code. Defaults to `100%`. */
	width: z.string().optional(),
	/** Height of the generated embed code. Defaults to `100%`. */
	height: z.string().optional(),
});
export const ListProjectsResponseSchema = envelope(paginated(CustomGPTProject));

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects */
export const CreateProjectInputSchema = z
	.object({
		project_name: z.string().optional(),
		is_master: z.boolean().optional(),
		use_planner_mode: z.boolean().optional(),
		...ingestionOptions,
		...fileFields,
	})
	.refine(
		(input) =>
			Boolean(input.sitemap_path) || Boolean(input.file || input.files),
		{
			message:
				'Provide either sitemap_path or at least one file to build the agent knowledge base.',
		},
	);
export const CreateProjectResponseSchema = envelope(CustomGPTProject);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid */
export const GetProjectInputSchema = z.object({
	projectId,
	width: z.string().optional(),
	height: z.string().optional(),
});
export const GetProjectResponseSchema = envelope(CustomGPTProject);

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid */
export const UpdateProjectInputSchema = z.object({
	projectId,
	project_name: z.string().optional(),
	is_shared: z.boolean().optional(),
	are_licenses_allowed: z.boolean().optional(),
	...ingestionOptions,
	...fileFields,
});
export const UpdateProjectResponseSchema = envelope(CustomGPTProject);

/** @see https://docs.customgpt.ai/reference/delete_api-v1-projects-projectid */
export const DeleteProjectInputSchema = z.object({ projectId });
export const DeleteProjectResponseSchema = DeletedAckSchema;

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-replicate */
export const CloneProjectInputSchema = z.object({ projectId });
export const CloneProjectResponseSchema = envelope(CustomGPTProject);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-stats */
export const GetStatsInputSchema = z.object({ projectId });
export const GetStatsResponseSchema = envelope(
	z
		.object({
			pages_found: z.number().optional(),
			pages_crawled: z.number().optional(),
			pages_indexed: z.number().optional(),
			crawl_credits_used: z.number().optional(),
			query_credits_used: z.number().optional(),
			total_queries: z.number().optional(),
			total_words_indexed: z.number().optional(),
			total_storage_credits_used: z.number().optional(),
		})
		.loose(),
);

/**
 * Agent tools, exposed by the platform as "plugins".
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-actions
 */
export const GetPluginsInputSchema = z.object({ projectId });
export const GetPluginsResponseSchema = envelope(
	z
		.object({
			tools: z
				.array(
					z
						.object({
							key: z.string().optional(),
							name: z.string().optional(),
							is_enabled: z.boolean().optional(),
							settings: z.record(z.string(), z.unknown()).nullable().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
);

/* --------------------------------------------------------------- documents */

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-pages */
export const ListPagesInputSchema = z.object({
	projectId,
	page: pageNumber,
	limit: z.number().int().positive().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	/** Case-insensitive substring match against document URL and filename. */
	search: z.string().optional(),
	crawl_status: z
		.enum(['all', 'ok', 'failed', 'n/a', 'queued', 'limited'])
		.optional(),
	index_status: z
		.enum(['all', 'ok', 'failed', 'n/a', 'queued', 'limited'])
		.optional(),
});
export const ListPagesResponseSchema = envelope(
	z
		.object({
			project: CustomGPTProject.optional(),
			pages: paginated(CustomGPTPage),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/delete_api-v1-projects-projectid-pages-pageid */
export const DeletePageInputSchema = z.object({ projectId, pageId });
export const DeletePageResponseSchema = DeletedAckSchema;

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-pages-pageid-reindex */
export const ReindexPageInputSchema = z.object({ projectId, pageId });
export const ReindexPageResponseSchema = UpdatedAckSchema;

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-pages-pageid-metadata */
export const PageMetadataSchema = z
	.object({
		id: z.number().optional(),
		url: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		image: z.string().nullable().optional(),
	})
	.loose();
export const GetPageMetadataInputSchema = z.object({ projectId, pageId });
export const GetPageMetadataResponseSchema = envelope(PageMetadataSchema);

/** @see https://docs.customgpt.ai/reference/put_api-v1-projects-projectid-pages-pageid-metadata */
export const UpdatePageMetadataInputSchema = z.object({
	projectId,
	pageId,
	title: z.string().optional(),
	url: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
});
export const UpdatePageMetadataResponseSchema = envelope(PageMetadataSchema);

/* ----------------------------------------------------------------- sources */

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-sources */
export const ListSourcesInputSchema = z.object({ projectId });
/**
 * Sources are grouped by origin. `uploads` is a single object; every other
 * key is an array. Unlisted integration keys are preserved by the loose object.
 */
export const ListSourcesResponseSchema = envelope(
	z
		.object({
			uploads: CustomGPTSource.nullable().optional(),
			sitemaps: z.array(CustomGPTSource).optional(),
			zapiers: z.array(CustomGPTSource).optional(),
			confluences: z.array(CustomGPTSource).optional(),
			youtubes: z.array(CustomGPTSource).optional(),
			vimeos: z.array(CustomGPTSource).optional(),
			sharepoints: z.array(CustomGPTSource).optional(),
			sharepoint_sites: z.array(CustomGPTSource).optional(),
			one_drives: z.array(CustomGPTSource).optional(),
			google_drives: z.array(CustomGPTSource).optional(),
			notions: z.array(CustomGPTSource).optional(),
			zendesks: z.array(CustomGPTSource).optional(),
			hubspots: z.array(CustomGPTSource).optional(),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-sources */
export const AddSourceInputSchema = z
	.object({
		projectId,
		sync_all_images: z.boolean().optional(),
		...ingestionOptions,
		...fileFields,
	})
	.refine(
		(input) =>
			Boolean(input.sitemap_path) || Boolean(input.file || input.files),
		{
			message:
				'Provide either sitemap_path or at least one file to add as a source.',
		},
	);
export const AddSourceResponseSchema = envelope(CustomGPTSource);

/** @see https://docs.customgpt.ai/reference/put_api-v1-projects-projectid-sources-sourceid */
export const UpdateSourceInputSchema = z.object({
	projectId,
	sourceId,
	/** Execute JavaScript while crawling. */
	executive_js: z.boolean().optional(),
	data_refresh_frequency: z
		.enum(['never', 'daily', 'weekly', 'monthly', 'advanced'])
		.optional(),
	create_new_pages: z.boolean().optional(),
	remove_unexist_pages: z.boolean().optional(),
	refresh_existing_pages: z.enum(['never', 'always', 'if_updated']).optional(),
	/** Custom schedule, used when `data_refresh_frequency` is `advanced`. */
	refresh_schedule: z
		.object({
			/** Days of the week to refresh on. */
			days: z.array(z.number().int()).optional(),
			hours: z.array(z.string()).optional(),
		})
		.optional(),
	allow_extra_timeout: z.boolean().optional(),
	image_extraction_type: z.enum(['none', 'sync_from_sitemap']).optional(),
	update_existing_images: z.boolean().optional(),
	sync_all_images: z.boolean().optional(),
});
export const UpdateSourceResponseSchema = envelope(CustomGPTSource);

/** @see https://docs.customgpt.ai/reference/delete_api-v1-projects-projectid-sources-sourceid */
export const DeleteSourceInputSchema = z.object({ projectId, sourceId });
export const DeleteSourceResponseSchema = DeletedAckSchema;

/* ---------------------------------------------------------------- licenses */

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-licenses */
export const ListProjectLicensesInputSchema = z.object({ projectId });
export const ListProjectLicensesResponseSchema = envelope(
	z.array(CustomGPTLicense),
);

/**
 * Single-license reads and writes return the license under a `license` key
 * rather than the usual `data` key.
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-licenses-licenseid
 */
const LicenseEnvelopeSchema = z
	.object({ status: StatusSchema, license: CustomGPTLicense })
	.loose();

export const GetProjectLicenseInputSchema = z.object({ projectId, licenseId });
export const GetProjectLicenseResponseSchema = LicenseEnvelopeSchema;

/** @see https://docs.customgpt.ai/reference/put_api-v1-projects-projectid-licenses-licenseid */
export const UpdateProjectLicenseInputSchema = z.object({
	projectId,
	licenseId,
	name: z.string().min(1),
});
export const UpdateProjectLicenseResponseSchema = LicenseEnvelopeSchema;

/** @see https://docs.customgpt.ai/reference/delete_api-v1-projects-projectid-licenses-licenseid */
export const DeleteProjectLicenseInputSchema = z.object({
	projectId,
	licenseId,
});
export const DeleteProjectLicenseResponseSchema = DeletedAckSchema;

/* ---------------------------------------------------------------- settings */

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-settings */
export const ProjectSettingsSchema = z
	.object({
		chatbot_avatar: z.string().optional(),
		chatbot_background_type: z.enum(['image', 'color']).optional(),
		radius_styling: z.enum(['sharp', 'soft', 'round', 'legacy']).optional(),
		font_family: z.enum(['inter', 'public-sans']).optional(),
		chatbot_background: z.string().optional(),
		chatbot_background_color: z.string().optional(),
		chatbot_color_scheme: z.enum(['fresh', 'legacy']).optional(),
		default_prompt: z.string().optional(),
		example_questions: z.array(z.string()).optional(),
		response_source: z
			.enum(['default', 'own_content', 'openai_content'])
			.optional(),
		chatbot_msg_lang: z.string().optional(),
		chatbot_color: z.string().optional(),
		chatbot_toolbar_color: z.string().optional(),
		persona_instructions: z.string().nullable().optional(),
		citations_answer_source_label_msg: z.string().nullable().optional(),
		citations_sources_label_msg: z.string().nullable().optional(),
		hang_in_there_msg: z.string().nullable().optional(),
		chatbot_siesta_msg: z.string().nullable().optional(),
		chatbot_failed_moderation_msg: z.string().nullable().optional(),
		account_out_of_queries_msg: z.string().nullable().optional(),
		is_loading_indicator_enabled: z.boolean().nullable().optional(),
		enable_citations: z
			.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
			.nullable()
			.optional(),
		enable_feedbacks: z.boolean().nullable().optional(),
		enable_copy_button: z.boolean().nullable().optional(),
		citations_view_type: z.enum(['user', 'show', 'hide']).nullable().optional(),
		image_citation_display: z
			.enum(['default', 'first_only'])
			.nullable()
			.optional(),
		limit_image_citation_height: z.boolean().optional(),
		use_opengraph_image_citation: z.boolean().optional(),
		no_answer_message: z.string().nullable().optional(),
		ending_message: z.string().nullable().optional(),
		try_asking_questions_msg: z.string().nullable().optional(),
		view_more_msg: z.string().nullable().optional(),
		view_less_msg: z.string().nullable().optional(),
		remove_branding: z.boolean().nullable().optional(),
		private_deployment: z
			.union([z.literal(0), z.literal(1), z.literal(2)])
			.nullable()
			.optional(),
		enable_recaptcha_for_public_chatbots: z.boolean().nullable().optional(),
		chatbot_model: z
			.enum([
				'gpt-4-1',
				'gpt-4-o',
				'gpt-5.1-none',
				'gpt-5.1-low',
				'gpt-5.2-none',
				'gpt-5.2-low',
				'gpt-5.4-low',
				'gpt-4-1-mini',
				'gpt-4o-mini',
				'claude-4.8-opus',
				'claude-4.6-opus',
				'claude-4.5-opus',
				'claude-4.6-sonnet',
				'claude-4.6-sonnet-thinking',
				'claude-4.5-sonnet',
				'claude-4.5-haiku',
				'gpt-o4-mini-low',
				'gpt-o4-mini-medium',
				'gpt-o4-mini-high',
				'gemini-3.1-pro',
				'gemini-3-pro',
				'gemini-3.5-flash',
			])
			.nullable()
			.optional(),
		is_selling_enabled: z.boolean().nullable().optional(),
		license_slug: z.boolean().nullable().optional(),
		selling_url: z.string().nullable().optional(),
		can_share_conversation: z.boolean().nullable().optional(),
		can_export_conversation: z.boolean().nullable().optional(),
		hide_sources_from_responses: z.boolean().nullable().optional(),
		input_field_addendum: z.string().nullable().optional(),
		ai_disclaimer: z.string().nullable().optional(),
		user_avatar_enabled: z.boolean().optional(),
		user_avatar: z.string().optional(),
		title_avatar_enabled: z.boolean().optional(),
		spotlight_avatar_enabled: z.boolean().optional(),
		spotlight_avatar: z.string().optional(),
		spotlight_avatar_shape: z.enum(['circle', 'rectangle']).optional(),
		spotlight_avatar_type: z.enum(['default', 'image']).optional(),
		user_avatar_orientation: z.string().optional(),
		agent_title_avatar_alignment: z
			.enum(['left', 'center', 'right'])
			.optional(),
		chatbot_title: z.string().nullable().optional(),
		chatbot_title_color: z.string().nullable().optional(),
		enable_inline_citations_api: z.boolean().nullable().optional(),
		conversation_time_window: z
			.union([z.literal(0), z.literal(1), z.literal(2)])
			.nullable()
			.optional(),
		conversation_retention_period: z
			.enum(['custom', 'year', 'never'])
			.optional(),
		conversation_retention_days: z.number().optional(),
		use_context_aware_starter_question: z.boolean().nullable().optional(),
		enable_agent_knowledge_base_awareness: z.boolean().optional(),
		markdown_enabled: z.boolean().optional(),
		is_hybrid_search: z.boolean().optional(),
		user_awareness: z.boolean().optional(),
		agent_capability: z
			.enum([
				'fastest-responses',
				'optimal-choice',
				'advanced-reasoning',
				'complex-tasks',
			])
			.optional(),
		context_depth: z
			.enum(['compact', 'balanced', 'extended', 'rich', 'max', 'custom'])
			.optional(),
		use_planner_mode: z.boolean().optional(),
		master_project_smart_routing_mode: z
			.enum(['off', 'start-only', 'every-message'])
			.optional(),
		master_project_user_agent_switching_enabled: z.boolean().optional(),
		max_actions_per_query: z.number().optional(),
		is_in_chat_agent_avatar_enabled: z.boolean().optional(),
		is_in_chat_user_avatar_enabled: z.boolean().optional(),
		conversation_history: z
			.enum(['hidden', 'team_members', 'everyone'])
			.optional(),
		is_pdf_viewer: z.boolean().optional(),
		is_pdf_viewer_autoopen: z.boolean().optional(),
		is_anonymize_pdfs: z.boolean().optional(),
		is_pdf_page_visibility_limited: z.boolean().optional(),
		pdf_limited_page_label: z.string().optional(),
		is_pdf_limited_label_linked: z.boolean().optional(),
		allowed_domains_for_embedding: z.array(z.string()).nullable().optional(),
	})
	.loose();
export const GetProjectSettingsInputSchema = z.object({ projectId });
export const GetProjectSettingsResponseSchema = envelope(ProjectSettingsSchema);

/**
 * Only the fields supplied are changed; omitted fields keep their values.
 *
 * @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-settings
 */
export const UpdateProjectSettingsBodySchema = z
	.object({
		chat_bot_avatar: z.string().optional(),
		chat_bot_bg: z.string().optional(),
		chat_bot_bg_type: z.enum(['image', 'color']).optional(),
		chat_bot_bg_color: z.string().optional(),
		chat_bot_color_scheme: z.enum(['fresh', 'legacy']).optional(),
		radius_styling: z.enum(['sharp', 'soft', 'round', 'legacy']).optional(),
		font_family: z.enum(['inter', 'public-sans']).optional(),
		default_prompt: z.string().optional(),
		'example_questions[]': z.array(z.string()).optional(),
		response_source: z
			.enum(['default', 'own_content', 'openai_content'])
			.optional(),
		chatbot_msg_lang: z
			.enum([
				'sq',
				'ar',
				'hy',
				'az',
				'ba',
				'eu',
				'be',
				'bn',
				'bh',
				'bs',
				'pt-BR',
				'bg',
				'yue',
				'ca',
				'hne',
				'hr',
				'cs',
				'da',
				'doi',
				'nl',
				'en',
				'et',
				'fo',
				'fi',
				'fr',
				'gl',
				'ka',
				'de',
				'el',
				'gu',
				'hry',
				'he',
				'hi',
				'hu',
				'id',
				'ga',
				'it',
				'ja',
				'jv',
				'kn',
				'ks',
				'kk',
				'kok',
				'ko',
				'ky',
				'lv',
				'lt',
				'mk',
				'mai',
				'ms',
				'mt',
				'cmn',
				'mr',
				'mwr',
				'nan',
				'mo',
				'mn',
				'me',
				'ne',
				'no',
				'or',
				'ps',
				'fa',
				'pl',
				'pt',
				'pa',
				'raj',
				'ro',
				'ru',
				'sa',
				'sat',
				'sr',
				'sd',
				'si',
				'sk',
				'sl',
				'es',
				'sw',
				'sv',
				'tg',
				'ta',
				'tt',
				'te',
				'th',
				'tr',
				'tk',
				'uk',
				'ur',
				'uz',
				'vi',
				'cy',
				'wuu',
			])
			.optional(),
		chatbot_color: z.string().optional(),
		chatbot_toolbar_color: z.string().optional(),
		persona_instructions: z.string().nullable().optional(),
		citations_answer_source_label_msg: z.string().nullable().optional(),
		citations_sources_label_msg: z.string().nullable().optional(),
		hang_in_there_msg: z.string().nullable().optional(),
		chatbot_siesta_msg: z.string().nullable().optional(),
		chatbot_failed_moderation_msg: z.string().nullable().optional(),
		account_out_of_queries_msg: z.string().nullable().optional(),
		is_loading_indicator_enabled: z.boolean().nullable().optional(),
		enable_citations: z
			.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
			.nullable()
			.optional(),
		enable_feedbacks: z.boolean().nullable().optional(),
		enable_copy_button: z.boolean().nullable().optional(),
		citations_view_type: z.enum(['user', 'show', 'hide']).nullable().optional(),
		image_citation_display: z
			.enum(['default', 'first_only'])
			.nullable()
			.optional(),
		limit_image_citation_height: z.boolean().nullable().optional(),
		use_opengraph_image_citation: z.boolean().nullable().optional(),
		max_inline_images_per_response: z
			.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
			.optional(),
		no_answer_message: z.string().nullable().optional(),
		ending_message: z.string().nullable().optional(),
		try_asking_questions_msg: z.string().nullable().optional(),
		view_more_msg: z.string().nullable().optional(),
		view_less_msg: z.string().nullable().optional(),
		remove_branding: z.boolean().nullable().optional(),
		enable_recaptcha_for_public_chatbots: z.boolean().nullable().optional(),
		chatbot_model: z
			.enum([
				'gpt-4-1',
				'gpt-4-o',
				'gpt-5.1-none',
				'gpt-5.1-low',
				'gpt-5.2-none',
				'gpt-5.2-low',
				'gpt-5.4-low',
				'gpt-4-1-mini',
				'gpt-4o-mini',
				'claude-4.8-opus',
				'claude-4.6-opus',
				'claude-4.5-opus',
				'claude-4.6-sonnet',
				'claude-4.6-sonnet-thinking',
				'claude-4.5-sonnet',
				'claude-4.5-haiku',
				'gpt-o4-mini-low',
				'gpt-o4-mini-medium',
				'gpt-o4-mini-high',
				'gemini-3.1-pro',
				'gemini-3-pro',
				'gemini-3.5-flash',
			])
			.nullable()
			.optional(),
		is_selling_enabled: z.boolean().nullable().optional(),
		can_share_conversation: z.boolean().nullable().optional(),
		can_export_conversation: z.boolean().nullable().optional(),
		hide_sources_from_responses: z.boolean().nullable().optional(),
		agent_capability: z
			.enum([
				'fastest-responses',
				'optimal-choice',
				'advanced-reasoning',
				'complex-tasks',
			])
			.nullable()
			.optional(),
		input_field_addendum: z.string().nullable().optional(),
		ai_disclaimer: z.string().nullable().optional(),
		user_avatar_enabled: z.boolean().optional(),
		user_avatar: z.string().nullable().optional(),
		title_avatar_enabled: z.boolean().optional(),
		spotlight_avatar_enabled: z.boolean().optional(),
		spotlight_avatar: z.string().nullable().optional(),
		spotlight_avatar_shape: z
			.enum(['circle', 'rectangle'])
			.nullable()
			.optional(),
		spotlight_avatar_type: z.enum(['default', 'image']).nullable().optional(),
		user_avatar_orientation: z
			.enum([
				'agent-left-user-right',
				'agent-right-user-right',
				'agent-right-user-left',
				'agent-left-user-left',
			])
			.nullable()
			.optional(),
		agent_title_avatar_alignment: z
			.enum(['left', 'center', 'right'])
			.optional(),
		chatbot_title: z.string().nullable().optional(),
		chatbot_title_color: z.string().nullable().optional(),
		enable_inline_citations_api: z.boolean().nullable().optional(),
		conversation_time_window: z
			.union([z.literal(0), z.literal(1), z.literal(2)])
			.nullable()
			.optional(),
		conversation_retention_period: z
			.enum(['custom', 'year', 'never'])
			.optional(),
		conversation_retention_days: z.number().optional(),
		use_context_aware_starter_question: z.boolean().nullable().optional(),
		enable_agent_knowledge_base_awareness: z.boolean().optional(),
		markdown_enabled: z.boolean().nullable().optional(),
		is_hybrid_search: z.boolean().nullable().optional(),
		user_awareness: z.boolean().optional(),
		context_depth: z
			.enum(['compact', 'balanced', 'extended', 'rich', 'max', 'custom'])
			.nullable()
			.optional(),
		use_planner_mode: z.boolean().nullable().optional(),
		master_project_smart_routing_mode: z
			.enum(['off', 'start-only', 'every-message'])
			.optional(),
		master_project_user_agent_switching_enabled: z.boolean().optional(),
		max_actions_per_query: z.number().optional(),
		is_in_chat_agent_avatar_enabled: z.boolean().optional(),
		is_in_chat_user_avatar_enabled: z.boolean().optional(),
		conversation_history: z
			.enum(['hidden', 'team_members', 'everyone'])
			.optional(),
		is_pdf_viewer: z.boolean().optional(),
		is_pdf_viewer_autoopen: z.boolean().optional(),
		is_anonymize_pdfs: z.boolean().optional(),
		is_pdf_page_visibility_limited: z.boolean().optional(),
		pdf_limited_page_label: z.string().optional(),
		is_pdf_limited_label_linked: z.boolean().optional(),
		allowed_domains_for_embedding: z.array(z.string()).nullable().optional(),
	})
	.loose();
export const UpdateProjectSettingsInputSchema =
	UpdateProjectSettingsBodySchema.extend({ projectId });
export const UpdateProjectSettingsResponseSchema = UpdatedAckSchema;

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-settings-personas */
export const PersonaSchema = z
	.object({
		version: z.number().optional(),
		is_active: z.boolean().optional(),
		created_at: z.string().optional(),
		instructions: z.string().nullable().optional(),
	})
	.loose();
export const ListPersonasInputSchema = z.object({
	projectId,
	page: pageNumber,
	limit: z.number().int().positive().optional(),
});
export const ListPersonasResponseSchema = envelope(paginated(PersonaSchema));

/** @see https://docs.customgpt.ai/reference/put_api-v1-projects-projectid-settings-persona-activate-version */
export const ActivatePersonaVersionInputSchema = z.object({
	projectId,
	/** Persona version number to make active. */
	version: z.number().int().positive(),
});
export const ActivatePersonaVersionResponseSchema = UpdatedAckSchema;

/* ----------------------------------------------------- conversations & chat */

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations */
export const CreateConversationInputSchema = z.object({
	projectId,
	name: z.string().optional(),
});
export const CreateConversationResponseSchema = envelope(CustomGPTConversation);

/**
 * Sends a prompt to the agent and returns its grounded answer.
 *
 * Streaming (`?stream=true`) is intentionally not exposed: this endpoint
 * resolves to a single validated JSON response.
 *
 * @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations-sessionid-messages
 */
export const SendMessageInputSchema = z.object({
	projectId,
	sessionId,
	prompt: z.string().min(1),
	/** ISO 639-1 code for the response language, e.g. `es`, `fr`, `de`. */
	lang: z.string().optional(),
	/** Caller-side identifier propagated to reporting (CRM correlation). */
	external_id: z.string().optional(),
	/** Overrides the agent's stored persona for this message only. */
	custom_persona: z.string().optional(),
	custom_context: z.string().optional(),
	child_project_id: z.number().int().positive().optional(),
	chatbot_model: z.string().optional(),
	response_source: z
		.enum(['default', 'own_content', 'openai_content'])
		.optional(),
	agent_capability: z
		.enum([
			'fastest-responses',
			'optimal-choice',
			'advanced-reasoning',
			'complex-tasks',
		])
		.optional(),
	/** Restricts retrieval to documents carrying these access-control labels. */
	labels: z.array(z.string()).optional(),
	labels_exclusive: z.boolean().optional(),
	action_overrides: z
		.object({
			enabled: z.array(z.string()).optional(),
			disabled: z.array(z.string()).optional(),
		})
		.optional(),
	...fileFields,
});
export const SendMessageResponseSchema = envelope(CustomGPTMessage);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-conversations-sessionid-messages */
export const ListConversationMessagesInputSchema = z.object({
	projectId,
	sessionId,
	page: pageNumber,
	order: z.enum(['asc', 'desc']).optional(),
	/** Include per-query customer intelligence analytics in each message. */
	includeInsights: z.boolean().optional(),
});
export const ListConversationMessagesResponseSchema = envelope(
	z
		.object({
			conversation: CustomGPTConversation.optional(),
			messages: paginated(CustomGPTMessage),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-conversations-sessionid-messages-promptid */
export const GetMessageInputSchema = z.object({
	projectId,
	sessionId,
	promptId,
	includeInsights: z.boolean().optional(),
});
export const GetMessageResponseSchema = envelope(CustomGPTMessage);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-conversations-sessionid-messages-promptid-trust-score */
export const GetMessageTrustScoreInputSchema = z.object({
	projectId,
	sessionId,
	promptId,
});
export const GetMessageTrustScoreResponseSchema = envelope(
	z
		.object({
			overall_status: z.string().optional(),
			stakeholder_analysis: z
				.object({
					end_user: z
						.object({
							flag: z.string().optional(),
							rationale: z.string().optional(),
							stakeholder: z.string().optional(),
							recommendations: z.array(z.string()).optional(),
						})
						.loose()
						.optional(),
					security_it: z
						.object({
							flag: z.string().optional(),
							rationale: z.string().optional(),
							stakeholder: z.string().optional(),
							recommendations: z.array(z.string()).optional(),
						})
						.loose()
						.optional(),
					risk_compliance: z
						.object({
							flag: z.string().optional(),
							rationale: z.string().optional(),
							stakeholder: z.string().optional(),
							recommendations: z.array(z.string()).optional(),
						})
						.loose()
						.optional(),
					legal_compliance: z
						.object({
							flag: z.string().optional(),
							rationale: z.string().optional(),
							stakeholder: z.string().optional(),
							recommendations: z.array(z.string()).optional(),
						})
						.loose()
						.optional(),
					public_relations: z
						.object({
							flag: z.string().optional(),
							rationale: z.string().optional(),
							stakeholder: z.string().optional(),
							recommendations: z.array(z.string()).optional(),
						})
						.loose()
						.optional(),
					executive_leadership: z
						.object({
							flag: z.string().optional(),
							rationale: z.string().optional(),
							stakeholder: z.string().optional(),
							recommendations: z.array(z.string()).optional(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations-sessionid-messages-promptid-verify */
export const VerifyMessageInputSchema = z.object({
	projectId,
	sessionId,
	promptId,
});
export const VerifyMessageResponseSchema = envelope(
	z.object({ message: z.string().optional() }).loose(),
);

/** @see https://docs.customgpt.ai/reference/put_api-v1-projects-projectid-conversations-sessionid-messages-promptid-feedback */
export const SubmitMessageFeedbackInputSchema = z.object({
	projectId,
	sessionId,
	promptId,
	reaction: z.enum(['neutral', 'disliked', 'liked']),
	includeInsights: z.boolean().optional(),
});
export const SubmitMessageFeedbackResponseSchema = envelope(CustomGPTMessage);

/* ----------------------------------------------------------------- reports */

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-analysis */
const AnalysisSeriesSchema = z.array(
	z
		.object({
			queries_number: z.number().optional(),
			created_at_interval: z.string().optional(),
		})
		.loose(),
);
export const GetReportAnalysisInputSchema = z.object({
	projectId,
	/** Required by the API; at least one series must be requested. */
	filters: z
		.array(z.enum(['queries', 'conversations', 'queries_per_conversation']))
		.min(1),
	interval: z.enum(['daily', 'weekly']).optional(),
});
export const GetReportAnalysisResponseSchema = envelope(
	z
		.object({
			queries: AnalysisSeriesSchema.optional(),
			conversations: AnalysisSeriesSchema.optional(),
			queries_per_conversation: AnalysisSeriesSchema.optional(),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-conversations */
export const GetReportConversationsInputSchema = z.object({
	projectId,
	filters: z
		.array(z.enum(['total', 'average_queries_per_conversation']))
		.min(1),
});
export const GetReportConversationsResponseSchema = envelope(
	z
		.object({
			total: z.number().optional(),
			average_queries_per_conversation: z.number().optional(),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-traffic */
export const GetReportTrafficInputSchema = z.object({
	projectId,
	filters: z.array(z.literal('sources')).min(1).default(['sources']),
});
export const GetReportTrafficResponseSchema = envelope(
	z
		.object({
			sources: z
				.array(
					z
						.object({
							request_source: z.string().optional(),
							request_source_number: z.number().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-intelligence */
export const GetReportIntelligenceInputSchema = z.object({
	projectId,
	page: pageNumber,
	/** Items per page; the API caps this at 100. */
	limit: z.number().int().positive().max(100).optional(),
	/** ISO 8601 datetime, e.g. `2024-01-15T00:00:00Z`. */
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	content_source: z
		.array(z.enum(['in-context', 'out-of-context', 'not-used']))
		.optional(),
	/** Verified-claims score range, formatted `min-max`, e.g. `0-100`. */
	accuracy: z
		.string()
		.regex(/^[\d.]+-[\d.]+$/)
		.optional(),
	stakeholder_status: z
		.array(z.enum(['APPROVED', 'FLAGGED', 'BLOCKED']))
		.optional(),
	user_emotion: z
		.array(
			z.enum([
				'positive',
				'neutral',
				'frustration',
				'dissatisfaction',
				'confusion',
				'unclear',
			]),
		)
		.optional(),
	user_intent: z
		.array(
			z.enum([
				'informational',
				'troubleshooting',
				'instructional',
				'greetings',
				'transactional',
				'navigational',
				'follow-up',
				'unclear',
			]),
		)
		.optional(),
	human_request: z.array(z.enum(['true', 'false', 'unclear'])).optional(),
	language: z.array(z.string()).optional(),
	external_id: z.array(z.string()).optional(),
	country: z.array(z.string()).optional(),
	tools: z.array(z.string()).optional(),
	leads: z.array(z.union([z.literal(0), z.literal(1)])).optional(),
	request_source: z.array(z.string()).optional(),
	risk_fidelity: z.array(z.string()).optional(),
	risk_jailbreak: z.array(z.string()).optional(),
	risk_prompt_leakage: z.array(z.string()).optional(),
	risk_profanity: z.array(z.string()).optional(),
});
export const GetReportIntelligenceResponseSchema = z
	.object({
		status: StatusSchema,
		data: paginated(CustomGPTCustomerIntelligence),
		total_queries: z.number().optional(),
	})
	.loose();

/** @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-leads */
export const ExportLeadsInputSchema = z.object({
	projectId,
	/** ISO 8601 date bounding the start of the export range. */
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	page: pageNumber,
	/** Records per page; the API caps this at 100. */
	limit: z.number().int().positive().max(100).optional(),
	/** Restrict the export to a single conversation. */
	session_id: z.string().optional(),
});
export const ExportLeadsResponseSchema = envelope(
	paginated(CustomGPTLead.omit({ id: true })),
);

/* ----------------------------------------------------------------- account */

/** @see https://docs.customgpt.ai/reference/get_api-v1-limits-usage */
export const GetUsageLimitsInputSchema = z.object({});
export const GetUsageLimitsResponseSchema = envelope(
	z
		.object({
			max_projects_num: z.number().optional(),
			current_projects_num: z.number().optional(),
			max_total_storage_credits: z.number().optional(),
			current_total_storage_credits: z.number().optional(),
			max_queries: z.number().optional(),
			current_queries: z.number().optional(),
		})
		.loose(),
);

/** @see https://docs.customgpt.ai/reference/get_api-v1-user */
export const CustomGPTUserSchema = z
	.object({
		id: z.number().optional(),
		email: z.string().optional(),
		name: z.string().nullable().optional(),
		current_team_id: z.number().nullable().optional(),
		profile_photo_url: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();
export const GetUserProfileInputSchema = z.object({});
export const GetUserProfileResponseSchema = envelope(CustomGPTUserSchema);

/** @see https://docs.customgpt.ai/reference/post_api-v1-user */
export const UpdateUserProfileInputSchema = z
	.object({
		name: z.string().optional(),
		/** Replacement profile photo, uploaded as multipart. */
		profile_photo: CustomGPTFileInputSchema.optional(),
	})
	.refine(
		(input) => input.name !== undefined || input.profile_photo !== undefined,
		{
			message: 'Provide at least one of name or profile_photo to update.',
		},
	);
export const UpdateUserProfileResponseSchema = envelope(CustomGPTUserSchema);

/** @see https://docs.customgpt.ai/reference/get_api-v1-user-search-team-member */
export const SearchTeamMembersInputSchema = z
	.object({
		email: z.string().optional(),
		user_id: z.number().int().positive().optional(),
	})
	.refine((input) => Boolean(input.email) || input.user_id !== undefined, {
		message: 'Provide either email or user_id to search for a team member.',
	});
export const SearchTeamMembersResponseSchema = envelope(CustomGPTUserSchema);

/* ------------------------------------------------- operation registries */

export type CustomGPTEndpointInputs = {
	listProjects: z.infer<typeof ListProjectsInputSchema>;
	createProject: z.infer<typeof CreateProjectInputSchema>;
	getProject: z.infer<typeof GetProjectInputSchema>;
	updateProject: z.infer<typeof UpdateProjectInputSchema>;
	deleteProject: z.infer<typeof DeleteProjectInputSchema>;
	cloneProject: z.infer<typeof CloneProjectInputSchema>;
	getStats: z.infer<typeof GetStatsInputSchema>;
	getPlugins: z.infer<typeof GetPluginsInputSchema>;
	listPages: z.infer<typeof ListPagesInputSchema>;
	deletePage: z.infer<typeof DeletePageInputSchema>;
	reindexPage: z.infer<typeof ReindexPageInputSchema>;
	getPageMetadata: z.infer<typeof GetPageMetadataInputSchema>;
	updatePageMetadata: z.infer<typeof UpdatePageMetadataInputSchema>;
	listSources: z.infer<typeof ListSourcesInputSchema>;
	addSource: z.infer<typeof AddSourceInputSchema>;
	updateSource: z.infer<typeof UpdateSourceInputSchema>;
	deleteSource: z.infer<typeof DeleteSourceInputSchema>;
	listProjectLicenses: z.infer<typeof ListProjectLicensesInputSchema>;
	getProjectLicense: z.infer<typeof GetProjectLicenseInputSchema>;
	updateProjectLicense: z.infer<typeof UpdateProjectLicenseInputSchema>;
	deleteProjectLicense: z.infer<typeof DeleteProjectLicenseInputSchema>;
	getProjectSettings: z.infer<typeof GetProjectSettingsInputSchema>;
	updateProjectSettings: z.infer<typeof UpdateProjectSettingsInputSchema>;
	listPersonas: z.infer<typeof ListPersonasInputSchema>;
	activatePersonaVersion: z.infer<typeof ActivatePersonaVersionInputSchema>;
	createConversation: z.infer<typeof CreateConversationInputSchema>;
	listConversationMessages: z.infer<typeof ListConversationMessagesInputSchema>;
	getMessage: z.infer<typeof GetMessageInputSchema>;
	getMessageTrustScore: z.infer<typeof GetMessageTrustScoreInputSchema>;
	verifyMessage: z.infer<typeof VerifyMessageInputSchema>;
	submitMessageFeedback: z.infer<typeof SubmitMessageFeedbackInputSchema>;
	getReportAnalysis: z.infer<typeof GetReportAnalysisInputSchema>;
	getReportConversations: z.infer<typeof GetReportConversationsInputSchema>;
	getReportIntelligence: z.infer<typeof GetReportIntelligenceInputSchema>;
	getReportTraffic: z.infer<typeof GetReportTrafficInputSchema>;
	exportLeads: z.infer<typeof ExportLeadsInputSchema>;
	getUsageLimits: z.infer<typeof GetUsageLimitsInputSchema>;
	getUserProfile: z.infer<typeof GetUserProfileInputSchema>;
	updateUserProfile: z.infer<typeof UpdateUserProfileInputSchema>;
	searchTeamMembers: z.infer<typeof SearchTeamMembersInputSchema>;
};

export type CustomGPTEndpointOutputs = {
	listProjects: z.infer<typeof ListProjectsResponseSchema>;
	createProject: z.infer<typeof CreateProjectResponseSchema>;
	getProject: z.infer<typeof GetProjectResponseSchema>;
	updateProject: z.infer<typeof UpdateProjectResponseSchema>;
	deleteProject: z.infer<typeof DeleteProjectResponseSchema>;
	cloneProject: z.infer<typeof CloneProjectResponseSchema>;
	getStats: z.infer<typeof GetStatsResponseSchema>;
	getPlugins: z.infer<typeof GetPluginsResponseSchema>;
	listPages: z.infer<typeof ListPagesResponseSchema>;
	deletePage: z.infer<typeof DeletePageResponseSchema>;
	reindexPage: z.infer<typeof ReindexPageResponseSchema>;
	getPageMetadata: z.infer<typeof GetPageMetadataResponseSchema>;
	updatePageMetadata: z.infer<typeof UpdatePageMetadataResponseSchema>;
	listSources: z.infer<typeof ListSourcesResponseSchema>;
	addSource: z.infer<typeof AddSourceResponseSchema>;
	updateSource: z.infer<typeof UpdateSourceResponseSchema>;
	deleteSource: z.infer<typeof DeleteSourceResponseSchema>;
	listProjectLicenses: z.infer<typeof ListProjectLicensesResponseSchema>;
	getProjectLicense: z.infer<typeof GetProjectLicenseResponseSchema>;
	updateProjectLicense: z.infer<typeof UpdateProjectLicenseResponseSchema>;
	deleteProjectLicense: z.infer<typeof DeleteProjectLicenseResponseSchema>;
	getProjectSettings: z.infer<typeof GetProjectSettingsResponseSchema>;
	updateProjectSettings: z.infer<typeof UpdateProjectSettingsResponseSchema>;
	listPersonas: z.infer<typeof ListPersonasResponseSchema>;
	activatePersonaVersion: z.infer<typeof ActivatePersonaVersionResponseSchema>;
	createConversation: z.infer<typeof CreateConversationResponseSchema>;
	listConversationMessages: z.infer<
		typeof ListConversationMessagesResponseSchema
	>;
	getMessage: z.infer<typeof GetMessageResponseSchema>;
	getMessageTrustScore: z.infer<typeof GetMessageTrustScoreResponseSchema>;
	verifyMessage: z.infer<typeof VerifyMessageResponseSchema>;
	submitMessageFeedback: z.infer<typeof SubmitMessageFeedbackResponseSchema>;
	getReportAnalysis: z.infer<typeof GetReportAnalysisResponseSchema>;
	getReportConversations: z.infer<typeof GetReportConversationsResponseSchema>;
	getReportIntelligence: z.infer<typeof GetReportIntelligenceResponseSchema>;
	getReportTraffic: z.infer<typeof GetReportTrafficResponseSchema>;
	exportLeads: z.infer<typeof ExportLeadsResponseSchema>;
	getUsageLimits: z.infer<typeof GetUsageLimitsResponseSchema>;
	getUserProfile: z.infer<typeof GetUserProfileResponseSchema>;
	updateUserProfile: z.infer<typeof UpdateUserProfileResponseSchema>;
	searchTeamMembers: z.infer<typeof SearchTeamMembersResponseSchema>;
};

export const CustomGPTEndpointInputSchemas = {
	listProjects: ListProjectsInputSchema,
	createProject: CreateProjectInputSchema,
	getProject: GetProjectInputSchema,
	updateProject: UpdateProjectInputSchema,
	deleteProject: DeleteProjectInputSchema,
	cloneProject: CloneProjectInputSchema,
	getStats: GetStatsInputSchema,
	getPlugins: GetPluginsInputSchema,
	listPages: ListPagesInputSchema,
	deletePage: DeletePageInputSchema,
	reindexPage: ReindexPageInputSchema,
	getPageMetadata: GetPageMetadataInputSchema,
	updatePageMetadata: UpdatePageMetadataInputSchema,
	listSources: ListSourcesInputSchema,
	addSource: AddSourceInputSchema,
	updateSource: UpdateSourceInputSchema,
	deleteSource: DeleteSourceInputSchema,
	listProjectLicenses: ListProjectLicensesInputSchema,
	getProjectLicense: GetProjectLicenseInputSchema,
	updateProjectLicense: UpdateProjectLicenseInputSchema,
	deleteProjectLicense: DeleteProjectLicenseInputSchema,
	getProjectSettings: GetProjectSettingsInputSchema,
	updateProjectSettings: UpdateProjectSettingsInputSchema,
	listPersonas: ListPersonasInputSchema,
	activatePersonaVersion: ActivatePersonaVersionInputSchema,
	createConversation: CreateConversationInputSchema,
	listConversationMessages: ListConversationMessagesInputSchema,
	getMessage: GetMessageInputSchema,
	getMessageTrustScore: GetMessageTrustScoreInputSchema,
	verifyMessage: VerifyMessageInputSchema,
	submitMessageFeedback: SubmitMessageFeedbackInputSchema,
	getReportAnalysis: GetReportAnalysisInputSchema,
	getReportConversations: GetReportConversationsInputSchema,
	getReportIntelligence: GetReportIntelligenceInputSchema,
	getReportTraffic: GetReportTrafficInputSchema,
	exportLeads: ExportLeadsInputSchema,
	getUsageLimits: GetUsageLimitsInputSchema,
	getUserProfile: GetUserProfileInputSchema,
	updateUserProfile: UpdateUserProfileInputSchema,
	searchTeamMembers: SearchTeamMembersInputSchema,
} as const;

export const CustomGPTEndpointOutputSchemas = {
	listProjects: ListProjectsResponseSchema,
	createProject: CreateProjectResponseSchema,
	getProject: GetProjectResponseSchema,
	updateProject: UpdateProjectResponseSchema,
	deleteProject: DeleteProjectResponseSchema,
	cloneProject: CloneProjectResponseSchema,
	getStats: GetStatsResponseSchema,
	getPlugins: GetPluginsResponseSchema,
	listPages: ListPagesResponseSchema,
	deletePage: DeletePageResponseSchema,
	reindexPage: ReindexPageResponseSchema,
	getPageMetadata: GetPageMetadataResponseSchema,
	updatePageMetadata: UpdatePageMetadataResponseSchema,
	listSources: ListSourcesResponseSchema,
	addSource: AddSourceResponseSchema,
	updateSource: UpdateSourceResponseSchema,
	deleteSource: DeleteSourceResponseSchema,
	listProjectLicenses: ListProjectLicensesResponseSchema,
	getProjectLicense: GetProjectLicenseResponseSchema,
	updateProjectLicense: UpdateProjectLicenseResponseSchema,
	deleteProjectLicense: DeleteProjectLicenseResponseSchema,
	getProjectSettings: GetProjectSettingsResponseSchema,
	updateProjectSettings: UpdateProjectSettingsResponseSchema,
	listPersonas: ListPersonasResponseSchema,
	activatePersonaVersion: ActivatePersonaVersionResponseSchema,
	createConversation: CreateConversationResponseSchema,
	listConversationMessages: ListConversationMessagesResponseSchema,
	getMessage: GetMessageResponseSchema,
	getMessageTrustScore: GetMessageTrustScoreResponseSchema,
	verifyMessage: VerifyMessageResponseSchema,
	submitMessageFeedback: SubmitMessageFeedbackResponseSchema,
	getReportAnalysis: GetReportAnalysisResponseSchema,
	getReportConversations: GetReportConversationsResponseSchema,
	getReportIntelligence: GetReportIntelligenceResponseSchema,
	getReportTraffic: GetReportTrafficResponseSchema,
	exportLeads: ExportLeadsResponseSchema,
	getUsageLimits: GetUsageLimitsResponseSchema,
	getUserProfile: GetUserProfileResponseSchema,
	updateUserProfile: UpdateUserProfileResponseSchema,
	searchTeamMembers: SearchTeamMembersResponseSchema,
} as const;

export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;
export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;
export type CloneProjectResponse = z.infer<typeof CloneProjectResponseSchema>;
export type GetStatsResponse = z.infer<typeof GetStatsResponseSchema>;
export type GetPluginsResponse = z.infer<typeof GetPluginsResponseSchema>;
export type ListPagesResponse = z.infer<typeof ListPagesResponseSchema>;
export type DeletePageResponse = z.infer<typeof DeletePageResponseSchema>;
export type ReindexPageResponse = z.infer<typeof ReindexPageResponseSchema>;
export type GetPageMetadataResponse = z.infer<
	typeof GetPageMetadataResponseSchema
>;
export type UpdatePageMetadataResponse = z.infer<
	typeof UpdatePageMetadataResponseSchema
>;
export type ListSourcesResponse = z.infer<typeof ListSourcesResponseSchema>;
export type AddSourceResponse = z.infer<typeof AddSourceResponseSchema>;
export type UpdateSourceResponse = z.infer<typeof UpdateSourceResponseSchema>;
export type DeleteSourceResponse = z.infer<typeof DeleteSourceResponseSchema>;
export type ListProjectLicensesResponse = z.infer<
	typeof ListProjectLicensesResponseSchema
>;
export type GetProjectLicenseResponse = z.infer<
	typeof GetProjectLicenseResponseSchema
>;
export type UpdateProjectLicenseResponse = z.infer<
	typeof UpdateProjectLicenseResponseSchema
>;
export type DeleteProjectLicenseResponse = z.infer<
	typeof DeleteProjectLicenseResponseSchema
>;
export type GetProjectSettingsResponse = z.infer<
	typeof GetProjectSettingsResponseSchema
>;
export type UpdateProjectSettingsResponse = z.infer<
	typeof UpdateProjectSettingsResponseSchema
>;
export type ListPersonasResponse = z.infer<typeof ListPersonasResponseSchema>;
export type ActivatePersonaVersionResponse = z.infer<
	typeof ActivatePersonaVersionResponseSchema
>;
export type CreateConversationResponse = z.infer<
	typeof CreateConversationResponseSchema
>;
export type ListConversationMessagesResponse = z.infer<
	typeof ListConversationMessagesResponseSchema
>;
export type GetMessageResponse = z.infer<typeof GetMessageResponseSchema>;
export type GetMessageTrustScoreResponse = z.infer<
	typeof GetMessageTrustScoreResponseSchema
>;
export type VerifyMessageResponse = z.infer<typeof VerifyMessageResponseSchema>;
export type SubmitMessageFeedbackResponse = z.infer<
	typeof SubmitMessageFeedbackResponseSchema
>;
export type GetReportAnalysisResponse = z.infer<
	typeof GetReportAnalysisResponseSchema
>;
export type GetReportConversationsResponse = z.infer<
	typeof GetReportConversationsResponseSchema
>;
export type GetReportTrafficResponse = z.infer<
	typeof GetReportTrafficResponseSchema
>;
export type GetReportIntelligenceResponse = z.infer<
	typeof GetReportIntelligenceResponseSchema
>;
export type ExportLeadsResponse = z.infer<typeof ExportLeadsResponseSchema>;
export type GetUsageLimitsResponse = z.infer<
	typeof GetUsageLimitsResponseSchema
>;
export type GetUserProfileResponse = z.infer<
	typeof GetUserProfileResponseSchema
>;
export type UpdateUserProfileResponse = z.infer<
	typeof UpdateUserProfileResponseSchema
>;
export type SearchTeamMembersResponse = z.infer<
	typeof SearchTeamMembersResponseSchema
>;
