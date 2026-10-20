import { z } from 'zod';

// Every input and output shape below mirrors the Octen OpenAPI document
// (https://docs.octen.ai/api-reference/openapi.json). Octen marks few response
// fields as required, so each schema requires exactly what the document
// requires and lets everything else pass through. The search, extract and
// embedding endpoints wrap their payload in the shared
// `{ code, msg, data, request_id }` envelope; those output schemas model the
// unwrapped `data` payload because client.ts strips the envelope before the
// schema runs. The Answer and generation endpoints do not use the envelope and
// return the resource directly.

// ── Shared option / media sub-schemas ───────────────────────────────────────

const AnswerModels = [
	'openai/gpt-6.1-sol',
	'openai/gpt-6-astra',
	'openai/gpt-5.6-sol',
	'openai/gpt-5.6-terra',
	'openai/gpt-5.6-luna',
	'openai/gpt-5.4',
	'anthropic/claude-fable-5.1',
	'anthropic/claude-fable-5',
	'anthropic/claude-opus-5.5',
	'anthropic/claude-opus-5',
	'anthropic/claude-opus-4.8',
	'anthropic/claude-opus-4.6',
	'anthropic/claude-sonnet-5.5',
	'anthropic/claude-sonnet-5',
	'anthropic/claude-sonnet-4.6',
	'anthropic/claude-haiku-5.5',
	'anthropic/claude-haiku-4.5',
	'google/gemini-4-argon',
	'google/gemini-3.8-flash',
	'google/gemini-3.5-flash',
	'google/gemini-3.5-flash-lite',
	'google/gemini-3.1-pro-preview',
	'google/gemini-3.1-flash-lite',
	'google/gemini-3-flash-preview',
	'moonshotai/kimi-k3',
	'moonshotai/kimi-k2.6',
	'moonshotai/kimi-k2.5',
	'minimax/minimax-m2.5',
	'qwen/qwen3.6-plus',
	'deepseek/deepseek-v4-pro',
	'deepseek/deepseek-v4-flash-0731',
] as const;

const LanguageSchema = z.enum([
	'ar',
	'de',
	'en',
	'es',
	'fr',
	'hi',
	'id',
	'it',
	'ja',
	'ko',
	'nl',
	'pl',
	'pt',
	'ru',
	'th',
	'tr',
	'vi',
	'zh',
]);

const TimeBasisSchema = z.enum(['auto', 'published', 'crawled']);
const TimeRangeSchema = z.enum([
	'day',
	'week',
	'month',
	'year',
	'd',
	'w',
	'm',
	'y',
]);
const SafeSearchSchema = z.enum(['off', 'strict']);

const HighlightOptionsSchema = z.object({
	enable: z.boolean().optional(),
	max_tokens: z.number().int().min(100).max(20000).optional(),
});

const FullContentOptionsSchema = z.object({
	enable: z.boolean().optional(),
	max_tokens: z.number().int().min(100).max(100000).optional(),
});

// Shared by the Web Search API and (`search_options`) Broad Search.
const WebSearchOptionsSchema = z.object({
	count: z.number().int().min(1).max(100).optional(),
	include_domains: z.array(z.string().max(60)).max(1200).optional(),
	exclude_domains: z.array(z.string().max(60)).max(1200).optional(),
	include_text: z.array(z.string().max(30)).max(5).optional(),
	exclude_text: z.array(z.string().max(30)).max(5).optional(),
	time_basis: TimeBasisSchema.optional(),
	time_range: TimeRangeSchema.optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	language: z.array(LanguageSchema).optional(),
	highlight: HighlightOptionsSchema.optional(),
	full_content: FullContentOptionsSchema.optional(),
	format: z.enum(['markdown', 'text']).optional(),
	safesearch: SafeSearchSchema.optional(),
	include_images: z.boolean().optional(),
});

const MediaImageSchema = z
	.object({
		url: z.string().optional(),
		description: z.string().optional(),
	})
	.passthrough();

// ── Search ──────────────────────────────────────────────────────────────────

const SearchResultSchema = z
	.object({
		title: z.string().optional(),
		url: z.string().optional(),
		highlight: z.string().optional(),
		full_content: z.string().optional(),
		authors: z.string().optional(),
		time_published: z.string().optional(),
		time_last_crawled: z.string().optional(),
		favicon: z.string().optional(),
		cover_image: MediaImageSchema.optional(),
		images: z.array(MediaImageSchema).optional(),
	})
	.passthrough();

const SearchResultGroupSchema = z
	.object({
		query: z.string().optional(),
		results: z.array(SearchResultSchema).optional(),
		latency: z.number().int().optional(),
	})
	.passthrough();

export const SearchInputSchema = WebSearchOptionsSchema.extend({
	query: z.string().min(1).max(500),
});

export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchResponseSchema = z
	.object({
		query: z.string().optional(),
		results: z.array(SearchResultSchema).optional(),
	})
	.passthrough();

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// ── Broad Search ────────────────────────────────────────────────────────────

export const BroadSearchInputSchema = z.object({
	query: z.string().min(1).max(500),
	max_queries: z.number().int().min(1).max(30).optional(),
	search_options: WebSearchOptionsSchema.optional(),
});

export type BroadSearchInput = z.infer<typeof BroadSearchInputSchema>;

export const BroadSearchResponseSchema = z
	.object({
		query: z.string().optional(),
		queries: z.array(z.string()).optional(),
		search_results: z.array(SearchResultGroupSchema).optional(),
	})
	.passthrough();

export type BroadSearchResponse = z.infer<typeof BroadSearchResponseSchema>;

// ── News Search ─────────────────────────────────────────────────────────────

const NewsArticleSchema = z
	.object({
		title: z.string().optional(),
		url: z.string().optional(),
		summary: z.string().optional(),
		highlight: z.string().optional(),
		full_content: z.string().optional(),
		authors: z.string().optional(),
		time_published: z.string().optional(),
		time_last_crawled: z.string().optional(),
		favicon: z.string().optional(),
		cover_image: MediaImageSchema.optional(),
		images: z.array(MediaImageSchema).optional(),
	})
	.passthrough();

const NewsSubjectSchema = z
	.object({
		name: z.string().optional(),
		summary: z.string().optional(),
		time_start: z.string().optional(),
		time_latest: z.string().optional(),
		top_news: NewsArticleSchema.optional(),
		sub_news: z.array(NewsArticleSchema).optional(),
	})
	.passthrough();

const NewsSubjectOptionsSchema = z.object({
	enable: z.boolean().optional(),
	count: z.number().int().min(1).max(5).optional(),
	max_sub_news: z.number().int().min(1).max(20).optional(),
});

export const NewsSearchInputSchema = z.object({
	query: z.string().min(1).max(500),
	count: z.number().int().min(1).max(100).optional(),
	include_domains: z.array(z.string().max(60)).max(1200).optional(),
	exclude_domains: z.array(z.string().max(60)).max(1200).optional(),
	time_basis: TimeBasisSchema.optional(),
	time_range: TimeRangeSchema.optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	language: z.array(LanguageSchema).optional(),
	highlight: HighlightOptionsSchema.optional(),
	full_content: FullContentOptionsSchema.optional(),
	subjects: NewsSubjectOptionsSchema.optional(),
});

export type NewsSearchInput = z.infer<typeof NewsSearchInputSchema>;

export const NewsSearchResponseSchema = z
	.object({
		query: z.string().optional(),
		results: z.array(NewsArticleSchema).optional(),
		subjects: z.array(NewsSubjectSchema).optional(),
	})
	.passthrough();

export type NewsSearchResponse = z.infer<typeof NewsSearchResponseSchema>;

// ── Business Search ─────────────────────────────────────────────────────────

const BusinessEntityOptionsSchema = z.object({
	enable: z.boolean().optional(),
	count: z.number().int().min(1).max(20).optional(),
	max_activities: z.number().int().min(1).max(20).optional(),
	max_news: z.number().int().min(1).max(20).optional(),
});

// Entity cards are a large company/person discriminated union with 20+ nested
// sections; only the discriminant is pinned and the remainder passes through.
const BusinessEntitySchema = z
	.object({
		type: z.enum(['company', 'person']).optional(),
		name: z.string().optional(),
	})
	.passthrough();

export const BusinessSearchInputSchema = z.object({
	query: z.string().min(1).max(500),
	count: z.number().int().min(1).max(100).optional(),
	include_domains: z.array(z.string().max(60)).max(1200).optional(),
	exclude_domains: z.array(z.string().max(60)).max(1200).optional(),
	time_basis: TimeBasisSchema.optional(),
	time_range: TimeRangeSchema.optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	language: z.array(LanguageSchema).optional(),
	highlight: HighlightOptionsSchema.optional(),
	full_content: FullContentOptionsSchema.optional(),
	entities: BusinessEntityOptionsSchema.optional(),
});

export type BusinessSearchInput = z.infer<typeof BusinessSearchInputSchema>;

export const BusinessSearchResponseSchema = z
	.object({
		query: z.string().optional(),
		results: z.array(SearchResultSchema).optional(),
		entities: z.array(BusinessEntitySchema).optional(),
	})
	.passthrough();

export type BusinessSearchResponse = z.infer<
	typeof BusinessSearchResponseSchema
>;

// ── Image Search ────────────────────────────────────────────────────────────

const ImageSearchInputItemSchema = z
	.object({
		type: z.enum(['text', 'image']),
		url: z.string().optional(),
		data: z.string().optional(),
	})
	.passthrough();

export const ImageSearchInputSchema = z.object({
	// The API currently accepts exactly one text or image input per request.
	inputs: z.array(ImageSearchInputItemSchema).min(1).max(1),
	count: z.number().int().min(1).max(10).optional(),
	include_domains: z.array(z.string()).optional(),
	exclude_domains: z.array(z.string()).optional(),
	safesearch: SafeSearchSchema.optional(),
});

export type ImageSearchInput = z.infer<typeof ImageSearchInputSchema>;

const ImageSearchResultSchema = z
	.object({
		title: z.string().optional(),
		url: z.string().optional(),
		source_page: z.string().optional(),
		description: z.string().optional(),
		width: z.number().int().optional(),
		height: z.number().int().optional(),
		thumbnail: z.string().optional(),
	})
	.passthrough();

export const ImageSearchResponseSchema = z
	.object({
		results: z.array(ImageSearchResultSchema).optional(),
	})
	.passthrough();

export type ImageSearchResponse = z.infer<typeof ImageSearchResponseSchema>;

// ── Video Search ────────────────────────────────────────────────────────────

const VideoSearchInputItemSchema = z
	.object({
		type: z.literal('text'),
		data: z.string().optional(),
	})
	.passthrough();

export const VideoSearchInputSchema = z.object({
	inputs: z.array(VideoSearchInputItemSchema).max(1),
	count: z.number().int().min(1).max(10).optional(),
	time_range: TimeRangeSchema.optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
	safesearch: SafeSearchSchema.optional(),
});

export type VideoSearchInput = z.infer<typeof VideoSearchInputSchema>;

const VideoSearchResultSchema = z
	.object({
		title: z.string().optional(),
		url: z.string().optional(),
		source_page: z.string().optional(),
		description: z.string().optional(),
		cover_url: z.string().optional(),
		duration_seconds: z.number().int().optional(),
		authors: z.string().optional(),
		time_published: z.string().optional(),
		time_last_crawled: z.string().optional(),
	})
	.passthrough();

export const VideoSearchResponseSchema = z
	.object({
		results: z.array(VideoSearchResultSchema).optional(),
	})
	.passthrough();

export type VideoSearchResponse = z.infer<typeof VideoSearchResponseSchema>;

// ── Extract ─────────────────────────────────────────────────────────────────

const ExtractLinkOptionsSchema = z.object({
	scope: z.enum(['prefer_internal', 'prefer_external']).optional(),
	max_links: z.number().int().min(1).max(1000).optional(),
});

export const ExtractInputSchema = z.object({
	// Documented limits: 20 URLs per request, 2048 characters per URL.
	urls: z.array(z.string().min(1).max(2048)).min(1).max(20),
	mode: z.enum(['standard', 'advanced', 'auto']).optional(),
	query: z.string().max(500).optional(),
	max_age_seconds: z.number().int().min(300).max(31536000).optional(),
	format: z.enum(['markdown', 'text']).optional(),
	timeout: z.number().int().min(1).max(60).optional(),
	include_images: z.boolean().optional(),
	include_videos: z.boolean().optional(),
	include_audio: z.boolean().optional(),
	include_links: ExtractLinkOptionsSchema.optional(),
});

export type ExtractInput = z.infer<typeof ExtractInputSchema>;

const ExtractPageStructureSchema = z
	.object({
		primary: z
			.enum(['Index Page', 'Content Page', 'No Main Content'])
			.optional(),
		secondary: z.string().nullable().optional(),
	})
	.passthrough();

const ExtractCategorySchema = z
	.object({
		primary: z.string().optional(),
		secondary: z.string().nullable().optional(),
	})
	.passthrough();

const ExtractMediaResourceSchema = z
	.object({ url: z.string().optional() })
	.passthrough();

const ExtractLinkSchema = z
	.object({
		url: z.string().optional(),
		anchor_text: z.string().optional(),
		is_external: z.boolean().optional(),
	})
	.passthrough();

// A single URL can fail while the overall request still returns 200 OK; those
// results carry `status: "failed"` plus `error_message` and are not billed.
const ExtractResultSchema = z
	.object({
		url: z.string().optional(),
		status: z.enum(['success', 'failed']).optional(),
		resolved_mode: z.enum(['standard', 'advanced']).optional(),
		title: z.string().nullable().optional(),
		full_content: z.string().nullable().optional(),
		highlights: z.array(z.string()).nullable().optional(),
		time_published: z.string().nullable().optional(),
		time_last_crawled: z.string().optional(),
		page_structure: ExtractPageStructureSchema.nullable().optional(),
		category: ExtractCategorySchema.nullable().optional(),
		favicon: z.string().nullable().optional(),
		cover_image: z.object({ url: z.string().optional() }).nullable().optional(),
		images: z.array(ExtractMediaResourceSchema).optional(),
		videos: z.array(ExtractMediaResourceSchema).optional(),
		audio: z.array(ExtractMediaResourceSchema).optional(),
		links: z.array(ExtractLinkSchema).optional(),
		error_message: z.string().optional(),
	})
	.passthrough();

export const ExtractResponseSchema = z
	.object({
		results: z.array(ExtractResultSchema).optional(),
	})
	.passthrough();

export type ExtractResponse = z.infer<typeof ExtractResponseSchema>;

// ── Embedding ───────────────────────────────────────────────────────────────

const EmbeddingModelSchema = z.enum([
	'octen-embedding-0.6b',
	'octen-embedding-4b',
	'octen-embedding-8b',
]);

export const EmbeddingInputSchema = z.object({
	input: z.array(z.string().max(10000)).max(1000),
	model: EmbeddingModelSchema.optional(),
	dimension: z.number().int().positive().optional(),
	input_type: z.enum(['query', 'document']).nullable().optional(),
});

export type EmbeddingInput = z.infer<typeof EmbeddingInputSchema>;

const EmbeddingResultSchema = z
	.object({
		index: z.number().int().optional(),
		embedding: z.array(z.number()).optional(),
	})
	.passthrough();

export const EmbeddingResponseSchema = z
	.object({
		results: z.array(EmbeddingResultSchema).optional(),
		model: z.string().optional(),
	})
	.passthrough();

export type EmbeddingResponse = z.infer<typeof EmbeddingResponseSchema>;

// ── VL Embedding ────────────────────────────────────────────────────────────

const VLEmbeddingContentSchema = z
	.object({
		text: z.string().max(10000).optional(),
		image: z.string().optional(),
		video: z.string().optional(),
	})
	.passthrough();

export const VLEmbeddingInputSchema = z.object({
	model: z.enum(['octen-vl-embedding', 'octen-vl-embedding-large']),
	input: z.object({
		contents: z.array(VLEmbeddingContentSchema).max(20),
	}),
	enable_fusion: z.boolean().optional(),
	dimension: z.number().int().positive().optional(),
	fps: z.number().min(0).max(1).optional(),
	instruct: z.string().optional(),
});

export type VLEmbeddingInput = z.infer<typeof VLEmbeddingInputSchema>;

const VLEmbeddingResultSchema = z
	.object({
		index: z.number().int().optional(),
		embedding: z.array(z.number()).optional(),
		type: z.enum(['vl', 'fusion']).optional(),
	})
	.passthrough();

export const VLEmbeddingResponseSchema = z
	.object({
		results: z.array(VLEmbeddingResultSchema).optional(),
		model: z.string().optional(),
	})
	.passthrough();

export type VLEmbeddingResponse = z.infer<typeof VLEmbeddingResponseSchema>;

// ── Answer ──────────────────────────────────────────────────────────────────

// ChatMessage is a system/developer/user/assistant/tool discriminated union
// whose `content` is a large nested content-block union; only `role` is pinned
// and the remaining fields pass through to the API unchanged.
const ChatMessageSchema = z
	.object({
		role: z.enum(['system', 'developer', 'user', 'assistant', 'tool']),
	})
	.passthrough();

export const AnswerInputSchema = z.object({
	model: z.enum(AnswerModels).optional(),
	messages: z.array(ChatMessageSchema).min(1),
	mode: z.enum(['queries_only', 'queries_and_search', 'full']).optional(),
	max_queries: z.number().int().min(1).max(30).optional(),
	web_search_options: WebSearchOptionsSchema.optional(),
});

export type AnswerInput = z.infer<typeof AnswerInputSchema>;

const SynthesisUsageSchema = z
	.object({
		num_search_queries: z.number().int(),
		prompt_tokens: z.number().int(),
		completion_tokens: z.number().int(),
		total_tokens: z.number().int(),
	})
	.passthrough();

const AnswerMetaSchema = z
	.object({
		usage: SynthesisUsageSchema.optional(),
		latency: z.number().int().optional(),
	})
	.passthrough();

const ChatCompletionMessageSchema = z
	.object({
		role: z.literal('assistant').optional(),
		content: z.string().nullable().optional(),
	})
	.passthrough();

const ChatCompletionChoiceSchema = z
	.object({
		index: z.number().int().optional(),
		finish_reason: z
			.enum(['stop', 'length', 'tool_calls', 'content_filter', 'error'])
			.optional(),
		message: ChatCompletionMessageSchema.optional(),
	})
	.passthrough();

export const AnswerResponseSchema = z
	.object({
		request_id: z.string(),
		object: z.literal('chat.completion'),
		created: z.number(),
		model: z.string(),
		choices: z.array(ChatCompletionChoiceSchema),
		queries: z.array(z.string()).optional(),
		search_results: z.array(SearchResultGroupSchema).optional(),
		meta: AnswerMetaSchema.optional(),
		warning: z.string().nullable().optional(),
	})
	.passthrough();

export type AnswerResponse = z.infer<typeof AnswerResponseSchema>;

// ── Video Generation ────────────────────────────────────────────────────────

const VideoModelSchema = z.enum([
	'minimax/minimax-h3',
	'bytedance/seedance-2.5',
	'google/veo-3.1',
	'google/veo-3.1-fast',
	'google/veo-3.1-lite',
]);

const VideoFrameImageSchema = z.object({
	image: z.string(),
	frame_type: z.enum(['first_frame', 'last_frame']),
});

const VideoInputReferenceSchema = z.object({
	image: z.string(),
});

export const VideoGenerationCreateInputSchema = z.object({
	model: VideoModelSchema,
	prompt: z.string().min(1),
	duration: z.number().int().optional(),
	resolution: z.enum(['480p', '720p', '768p', '1080p', '2K']).optional(),
	aspect_ratio: z
		.enum(['16:9', '4:3', '1:1', '3:4', '9:16', '21:9', 'adaptive'])
		.optional(),
	frame_images: z.array(VideoFrameImageSchema).optional(),
	input_references: z.array(VideoInputReferenceSchema).optional(),
	generate_audio: z.boolean().optional(),
	seed: z.number().int().optional(),
	// Vendor-specific parameters forwarded to the upstream model without
	// validation (documented as an open-ended map), so values stay unknown.
	extra_params: z.record(z.string(), z.unknown()).optional(),
});

export type VideoGenerationCreateInput = z.infer<
	typeof VideoGenerationCreateInputSchema
>;

export const VideoGenerationCreateResponseSchema = z
	.object({
		id: z.string(),
		model: z.string(),
		status: z.literal('queued'),
		created: z.number().int(),
	})
	.passthrough();

export type VideoGenerationCreateResponse = z.infer<
	typeof VideoGenerationCreateResponseSchema
>;

const VideoUsageSchema = z
	.object({
		video_seconds: z.number().int().optional(),
		video_tokens: z.number().int().optional(),
		input_image_count: z.number().int().optional(),
	})
	.passthrough();

export const VideoGenerationGetInputSchema = z.object({
	id: z.string().min(1),
});

export type VideoGenerationGetInput = z.infer<
	typeof VideoGenerationGetInputSchema
>;

export const VideoGenerationGetResponseSchema = z
	.object({
		id: z.string(),
		model: z.string(),
		status: z.enum(['queued', 'in_progress', 'completed', 'failed']),
		created: z.number().int(),
		video_url: z.string().optional(),
		expires_at: z.number().int().optional(),
		duration: z.number().int().optional(),
		resolution: z.string().optional(),
		usage: VideoUsageSchema.optional(),
		error: z.string().optional(),
		code: z.string().optional(),
	})
	.passthrough();

export type VideoGenerationGetResponse = z.infer<
	typeof VideoGenerationGetResponseSchema
>;

// ── Grounded Generation ─────────────────────────────────────────────────────

export const GroundedGenerationCreateInputSchema = z.object({
	modality: z.enum(['image', 'video']),
	prompt: z.string().min(1).max(8000),
	model: z
		.enum([
			'google/gemini-3-pro-image',
			'google/gemini-3.1-flash-image',
			'minimax/hailuo-3',
		])
		.optional(),
	aspect_ratio: z.enum(['16:9', '1:1', '9:16']).optional(),
	duration: z.number().int().min(5).max(10).optional(),
});

export type GroundedGenerationCreateInput = z.infer<
	typeof GroundedGenerationCreateInputSchema
>;

export const GroundedGenerationCreateResponseSchema = z
	.object({
		request_id: z.string().optional(),
		generation_id: z.string(),
		modality: z.enum(['image', 'video']),
		status: z.literal('queued'),
		created_at: z.number().int(),
	})
	.passthrough();

export type GroundedGenerationCreateResponse = z.infer<
	typeof GroundedGenerationCreateResponseSchema
>;

const GroundedGenerationReferenceSchema = z
	.object({
		source_id: z.string().optional(),
		url: z.string().optional(),
		title: z.string().optional(),
		cover_url: z.string().optional(),
	})
	.passthrough();

const GroundedGenerationSearchResultSchema = z
	.object({
		type: z.enum(['image', 'video']).optional(),
		title: z.string().optional(),
		url: z.string().optional(),
		source_page: z.string().optional(),
		description: z.string().optional(),
		cover_url: z.string().optional(),
	})
	.passthrough();

const GroundedGenerationSearchGroupSchema = z
	.object({
		query: z.string().optional(),
		results: z.array(GroundedGenerationSearchResultSchema).optional(),
	})
	.passthrough();

const GroundedGenerationErrorSchema = z
	.object({
		code: z
			.enum([
				'MM_GENERATION_CONTENT_POLICY',
				'MM_GENERATION_INPUT_IMAGE_PRIVACY_BLOCKED',
				'MM_GENERATION_CONTENT_NOT_SUPPORTED',
				'MM_GENERATION_NO_REFERENCE_MATERIAL',
				'MM_GENERATION_REJECTED',
				'MM_GENERATION_TIMEOUT',
				'MM_GENERATION_FAILED',
			])
			.optional(),
		message: z.string().optional(),
	})
	.passthrough();

const GroundedGenerationUsageSchema = z
	.object({
		image_count: z.number().int().optional(),
		video_count: z.number().int().optional(),
		video_seconds: z.number().int().optional(),
	})
	.passthrough();

export const GroundedGenerationGetInputSchema = z.object({
	generation_id: z.string().min(1),
});

export type GroundedGenerationGetInput = z.infer<
	typeof GroundedGenerationGetInputSchema
>;

export const GroundedGenerationGetResponseSchema = z
	.object({
		request_id: z.string().optional(),
		generation_id: z.string(),
		modality: z.enum(['image', 'video']),
		status: z.enum(['queued', 'running', 'succeeded', 'failed']),
		output_url: z.string().optional(),
		references: z.array(GroundedGenerationReferenceSchema).optional(),
		search_results: z.array(GroundedGenerationSearchGroupSchema).optional(),
		error: GroundedGenerationErrorSchema.optional(),
		created_at: z.number().int(),
		updated_at: z.number().int(),
		usage: GroundedGenerationUsageSchema.optional(),
	})
	.passthrough();

export type GroundedGenerationGetResponse = z.infer<
	typeof GroundedGenerationGetResponseSchema
>;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type OctenEndpointInputs = {
	searchPost: SearchInput;
	broadSearchPost: BroadSearchInput;
	newsSearchPost: NewsSearchInput;
	businessSearchPost: BusinessSearchInput;
	imageSearchPost: ImageSearchInput;
	videoSearchPost: VideoSearchInput;
	extractPost: ExtractInput;
	embeddingCreate: EmbeddingInput;
	vlEmbeddingCreate: VLEmbeddingInput;
	answerCreate: AnswerInput;
	videoGenerationCreate: VideoGenerationCreateInput;
	videoGenerationGet: VideoGenerationGetInput;
	groundedGenerationCreate: GroundedGenerationCreateInput;
	groundedGenerationGet: GroundedGenerationGetInput;
};

export type OctenEndpointOutputs = {
	searchPost: SearchResponse;
	broadSearchPost: BroadSearchResponse;
	newsSearchPost: NewsSearchResponse;
	businessSearchPost: BusinessSearchResponse;
	imageSearchPost: ImageSearchResponse;
	videoSearchPost: VideoSearchResponse;
	extractPost: ExtractResponse;
	embeddingCreate: EmbeddingResponse;
	vlEmbeddingCreate: VLEmbeddingResponse;
	answerCreate: AnswerResponse;
	videoGenerationCreate: VideoGenerationCreateResponse;
	videoGenerationGet: VideoGenerationGetResponse;
	groundedGenerationCreate: GroundedGenerationCreateResponse;
	groundedGenerationGet: GroundedGenerationGetResponse;
};

export const OctenEndpointInputSchemas = {
	searchPost: SearchInputSchema,
	broadSearchPost: BroadSearchInputSchema,
	newsSearchPost: NewsSearchInputSchema,
	businessSearchPost: BusinessSearchInputSchema,
	imageSearchPost: ImageSearchInputSchema,
	videoSearchPost: VideoSearchInputSchema,
	extractPost: ExtractInputSchema,
	embeddingCreate: EmbeddingInputSchema,
	vlEmbeddingCreate: VLEmbeddingInputSchema,
	answerCreate: AnswerInputSchema,
	videoGenerationCreate: VideoGenerationCreateInputSchema,
	videoGenerationGet: VideoGenerationGetInputSchema,
	groundedGenerationCreate: GroundedGenerationCreateInputSchema,
	groundedGenerationGet: GroundedGenerationGetInputSchema,
} as const;

export const OctenEndpointOutputSchemas = {
	searchPost: SearchResponseSchema,
	broadSearchPost: BroadSearchResponseSchema,
	newsSearchPost: NewsSearchResponseSchema,
	businessSearchPost: BusinessSearchResponseSchema,
	imageSearchPost: ImageSearchResponseSchema,
	videoSearchPost: VideoSearchResponseSchema,
	extractPost: ExtractResponseSchema,
	embeddingCreate: EmbeddingResponseSchema,
	vlEmbeddingCreate: VLEmbeddingResponseSchema,
	answerCreate: AnswerResponseSchema,
	videoGenerationCreate: VideoGenerationCreateResponseSchema,
	videoGenerationGet: VideoGenerationGetResponseSchema,
	groundedGenerationCreate: GroundedGenerationCreateResponseSchema,
	groundedGenerationGet: GroundedGenerationGetResponseSchema,
} as const;
