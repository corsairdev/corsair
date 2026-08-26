import { z } from 'zod';

/**
 * Persisted entity shapes for the CustomGPT.ai integration.
 *
 * Every schema below mirrors a named component from the official CustomGPT.ai
 * OpenAPI document (`https://docs.customgpt.ai/openapi/openapi.json`); the
 * `@see` tag on each one points at the reference page that documents it.
 * Objects are declared `.loose()` so additive API changes are stored rather
 * than stripped, and all non-identifying fields are optional because the spec
 * marks no response property as required.
 *
 * Note on terminology: the API calls agents "projects" and documents "pages"
 * for backward compatibility. Entity names here follow the API, not the UI.
 *
 * @see https://docs.customgpt.ai/reference/terminology
 */

/** Timestamp recording when Corsair last refreshed a cached row. */
const syncedAt = z.coerce.date().optional();

/**
 * An agent (called a "project" in the API).
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects
 */
export const CustomGPTProject = z
	.object({
		id: z.coerce.number(),
		project_name: z.string().optional(),
		sitemap_path: z.string().nullable().optional(),
		is_chat_active: z.boolean().optional(),
		is_master: z.boolean().optional(),
		user_id: z.number().optional(),
		team_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		deleted_at: z.string().nullable().optional(),
		type: z.enum(['SITEMAP', 'URL']).optional(),
		is_shared: z.boolean().optional(),
		shareable_slug: z.string().nullable().optional(),
		shareable_link: z.string().nullable().optional(),
		embed_code: z.string().nullable().optional(),
		live_chat_code: z.string().nullable().optional(),
		are_licenses_allowed: z.boolean().optional(),
		subdomain_slug: z.string().nullable().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTProject = z.infer<typeof CustomGPTProject>;

/**
 * An indexed document in an agent's knowledge base (called a "page" in the API).
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-pages
 */
export const CustomGPTPage = z
	.object({
		id: z.coerce.number(),
		page_url: z.string().optional(),
		page_url_hash: z.string().optional(),
		project_id: z.number().optional(),
		s3_path: z.string().nullable().optional(),
		crawl_status: z
			.enum(['ok', 'queued', 'failed', 'n/a', 'limited'])
			.optional(),
		index_status: z
			.enum(['ok', 'queued', 'failed', 'n/a', 'limited'])
			.optional(),
		is_file: z.boolean().optional(),
		is_refreshable: z.boolean().optional(),
		is_file_kept: z.boolean().optional(),
		filename: z.string().nullable().optional(),
		filesize: z.number().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		deleted_at: z.string().nullable().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTPage = z.infer<typeof CustomGPTPage>;

/**
 * Crawl/sync configuration attached to a data source.
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-sources
 */
export const CustomGPTSourceSettings = z
	.object({
		executive_js: z.boolean().optional(),
		data_refresh_frequency: z
			.enum(['never', 'daily', 'weekly', 'monthly', 'advanced'])
			.optional(),
		create_new_pages: z.boolean().optional(),
		remove_unexist_pages: z.boolean().optional(),
		refresh_existing_pages: z
			.enum(['never', 'always', 'if_updated'])
			.optional(),
		sitemap_path: z.string().nullable().optional(),
		image_extraction_type: z.enum(['none', 'sync_from_sitemap']).optional(),
		update_existing_images: z.boolean().optional(),
		sync_all_images: z.boolean().optional(),
	})
	.loose();
export type CustomGPTSourceSettings = z.infer<typeof CustomGPTSourceSettings>;

/**
 * A data source feeding an agent's knowledge base (sitemap, upload, or integration).
 *
 * @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-sources
 */
export const CustomGPTSource = z
	.object({
		id: z.coerce.number(),
		project_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		type: z.enum(['sitemap', 'upload']).optional(),
		settings: CustomGPTSourceSettings.optional(),
		pages: z.array(CustomGPTPage).nullable().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTSource = z.infer<typeof CustomGPTSource>;

/**
 * A chat session against an agent. Keyed by `session_id`, which is the
 * identifier every message endpoint takes.
 *
 * @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations
 */
export const CustomGPTConversation = z
	.object({
		id: z.coerce.number().optional(),
		session_id: z.string(),
		name: z.string().nullable().optional(),
		project_id: z.union([z.string(), z.number()]).optional(),
		created_by: z.union([z.string(), z.number()]).nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		deleted_at: z.string().nullable().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTConversation = z.infer<typeof CustomGPTConversation>;

/**
 * AI-derived analytics attached to a single query, surfaced by the customer
 * intelligence report and optionally inlined on message responses.
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-intelligence
 */
export const CustomGPTCustomerIntelligence = z
	.object({
		prompt_id: z.number().optional(),
		conversation_id: z.number().optional(),
		project_id: z.number().optional(),
		user_query: z.string().nullable().optional(),
		ai_response: z.string().nullable().optional(),
		created_at: z.string().optional(),
		content_source: z.string().nullable().optional(),
		user_emotion: z.string().nullable().optional(),
		user_intent: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		human_request: z.enum(['true', 'false', 'unclear']).nullable().optional(),
		user_id: z.number().nullable().optional(),
		feedback: z.string().nullable().optional(),
		user_location: z.string().nullable().optional(),
		chatbot_deployment: z.string().nullable().optional(),
		risk_fidelity: z.string().nullable().optional(),
		risk_jailbreak: z.string().nullable().optional(),
		risk_prompt_leakage: z.string().nullable().optional(),
		risk_profanity: z.string().nullable().optional(),
		accuracy: z.string().nullable().optional(),
		stakeholder_status: z.string().nullable().optional(),
		browser: z.string().nullable().optional(),
	})
	.loose();
export type CustomGPTCustomerIntelligence = z.infer<
	typeof CustomGPTCustomerIntelligence
>;

/**
 * A single prompt/response exchange (the API's `PromptHistory` component).
 * `citations` holds citation IDs, resolvable via the citation endpoint.
 *
 * @see https://docs.customgpt.ai/reference/post_api-v1-projects-projectid-conversations-sessionid-messages
 */
export const CustomGPTMessage = z
	.object({
		id: z.coerce.number(),
		conversation_id: z.number().optional(),
		user_id: z.number().nullable().optional(),
		user_query: z.string().nullable().optional(),
		openai_response: z.string().nullable().optional(),
		citations: z.array(z.number()).nullable().optional(),
		tools: z.array(z.string()).nullable().optional(),
		metadata: z
			.object({
				user_ip: z.string().nullable().optional(),
				user_agent: z.string().nullable().optional(),
				external_id: z.string().nullable().optional(),
				request_source: z.string().nullable().optional(),
			})
			.loose()
			.nullable()
			.optional(),
		response_feedback: z
			.object({
				created_at: z.string().optional(),
				updated_at: z.string().optional(),
				user_id: z.number().nullable().optional(),
				reaction: z.enum(['neutral', 'disliked', 'liked']).optional(),
			})
			.loose()
			.nullable()
			.optional(),
		customer_intelligence: CustomGPTCustomerIntelligence.nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTMessage = z.infer<typeof CustomGPTMessage>;

/**
 * A license key issued for an agent. Keyed by `key`, since the list endpoint
 * returns no separate numeric identifier.
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-licenses
 */
export const CustomGPTLicense = z
	.object({
		key: z.string(),
		name: z.string().optional(),
		project_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTLicense = z.infer<typeof CustomGPTLicense>;

/**
 * A contact captured from a conversation by the lead-capture feature.
 *
 * @see https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-reports-leads
 */
export const CustomGPTLead = z
	.object({
		/** Synthesized as `<session_id>:<query_id>` — the API returns no single key. */
		id: z.string(),
		project_id: z.number().optional(),
		session_id: z.string().optional(),
		query_id: z.number().optional(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		captured_at: z.string().nullable().optional(),
		other_data: z.record(z.string(), z.unknown()).nullable().optional(),
		user_defined: z.record(z.string(), z.unknown()).nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		syncedAt,
	})
	.loose();
export type CustomGPTLead = z.infer<typeof CustomGPTLead>;
