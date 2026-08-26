import { z } from 'zod';
import { JigsawstackUsage } from '../schema/database';

const usage = JigsawstackUsage.optional();

const base = {
	success: z.boolean(),
	_usage: usage,
	log_id: z.string().optional(),
};

const urlOrFile = {
	url: z.string().optional(),
	file_store_key: z.string().optional(),
};

function exactlyOneUrlOrFile<
	T extends z.ZodType<{ url?: string; file_store_key?: string }>,
>(schema: T) {
	return schema.refine((v) => Boolean(v.url) !== Boolean(v.file_store_key), {
		message: 'Provide exactly one of url or file_store_key',
	});
}

// ── validate ─────────────────────────────────────────────────────────────────

/** POST /v1/validate/nsfw @see https://jigsawstack.com/docs/api-reference/validate/nsfw */
export const NsfwInputSchema = z.object(urlOrFile);
export const NsfwOutputSchema = z
	.object({
		...base,
		nsfw: z.boolean().optional(),
		nudity: z.boolean().optional(),
		gore: z.boolean().optional(),
		nsfw_score: z.number().optional(),
		nudity_score: z.number().optional(),
		gore_score: z.number().optional(),
	})
	.loose();

/** POST /v1/validate/profanity @see https://jigsawstack.com/docs/api-reference/validate/profanity */
export const ProfanityInputSchema = z.object({
	text: z.string(),
	censor_replacement: z.string().optional(),
});
export const ProfanityOutputSchema = z
	.object({
		...base,
		message: z.string().optional(),
		clean_text: z.string().optional(),
		profanities_found: z.boolean().optional(),
		profanities: z
			.array(
				z
					.object({
						profanity: z.string().nullable().optional(),
						startIndex: z.number().optional(),
						endIndex: z.number().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

/** POST /v1/validate/spam_check @see https://jigsawstack.com/docs/api-reference/validate/spam-check */
export const SpamCheckInputSchema = z.object({
	text: z.union([z.string(), z.array(z.string())]),
});
const spamItem = z
	.object({
		is_spam: z.boolean().optional(),
		score: z.number().optional(),
	})
	.loose();
export const SpamCheckOutputSchema = z
	.object({
		...base,
		check: z.union([spamItem, z.array(spamItem)]).optional(),
	})
	.loose();

/** POST /v1/validate/spell_check @see https://jigsawstack.com/docs/api-reference/validate/spell-check */
export const SpellCheckInputSchema = z.object({
	text: z.string(),
	language_code: z.string().optional(),
});
export const SpellCheckOutputSchema = z
	.object({
		...base,
		misspellings_found: z.boolean().optional(),
		auto_correct_text: z.string().optional(),
		misspellings: z
			.array(
				z
					.object({
						word: z.string().nullable().optional(),
						startIndex: z.number().optional(),
						endIndex: z.number().optional(),
						expected: z.array(z.string()).optional(),
						auto_corrected: z.boolean().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

// ── ai ───────────────────────────────────────────────────────────────────────

/** POST /v1/ai/sentiment @see https://jigsawstack.com/docs/api-reference/ai/sentiment */
export const SentimentInputSchema = z.object({ text: z.string() });
export const SentimentOutputSchema = z
	.object({
		...base,
		sentiment: z
			.object({
				emotion: z.string().optional(),
				sentiment: z.string().optional(),
				score: z.number().optional(),
				sentences: z
					.array(
						z
							.object({
								text: z.string().optional(),
								emotion: z.string().optional(),
								sentiment: z.string().optional(),
								score: z.number().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

/** POST /v1/ai/summary @see https://jigsawstack.com/docs/api-reference/ai/summary */
export const SummaryInputSchema = z
	.object({
		text: z.string().optional(),
		url: z.string().optional(),
		file_store_key: z.string().optional(),
		type: z.enum(['text', 'points']).optional(),
		max_points: z.number().optional(),
		max_characters: z.number().optional(),
	})
	.refine(
		(v) => [v.text, v.url, v.file_store_key].filter(Boolean).length === 1,
		{ message: 'Provide exactly one of text, url, or file_store_key' },
	);
export const SummaryOutputSchema = z
	.object({
		...base,
		summary: z.union([z.string(), z.array(z.string())]).optional(),
	})
	.loose();

/** POST /v1/ai/translate @see https://jigsawstack.com/docs/api-reference/ai/translate/translate */
export const TranslateInputSchema = z.object({
	text: z.union([z.string(), z.array(z.string())]),
	target_language: z.string(),
	current_language: z.string().optional(),
});
export const TranslateOutputSchema = z
	.object({
		...base,
		translated_text: z.union([z.string(), z.array(z.string())]).optional(),
	})
	.loose();

/** POST /v1/ai/prediction @see https://jigsawstack.com/docs/api-reference/ai/prediction */
export const PredictionInputSchema = z.object({
	dataset: z
		.array(
			z.object({
				value: z.union([z.number(), z.string()]),
				date: z.string(),
			}),
		)
		.min(5),
	steps: z.number().optional(),
});
export const PredictionOutputSchema = z
	.object({
		...base,
		prediction: z
			.array(
				z
					.object({
						value: z.union([z.number(), z.string()]).optional(),
						date: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

/** POST /v1/ai/image_generation @see https://jigsawstack.com/docs/api-reference/ai/image-generation */
export const ImageGenerationInputSchema = z.object({
	prompt: z.string(),
	aspect_ratio: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	steps: z.number().optional(),
	output_format: z.enum(['png', 'svg']).optional(),
	return_type: z.enum(['url', 'binary', 'base64']).optional(),
	url: z.string().optional(),
	file_store_key: z.string().optional(),
	advance_config: z
		.object({
			negative_prompt: z.string().optional(),
			guidance: z.number().optional(),
			seed: z.number().optional(),
		})
		.optional(),
});
export const ImageGenerationOutputSchema = z.union([
	z.object({
		success: z.boolean(),
		content_type: z.string(),
		base64: z.string(),
	}),
	z
		.object({
			...base,
			url: z.string().optional(),
			base64: z.string().optional(),
		})
		.loose(),
]);

// ── web ──────────────────────────────────────────────────────────────────────

/** POST /v1/ai/scrape @see https://jigsawstack.com/docs/api-reference/ai/scrape */
export const ScrapeInputSchema = z.object({
	url: z.string().optional(),
	html: z.string().optional(),
	element_prompts: z
		.union([z.array(z.string()), z.record(z.string(), z.string())])
		.optional(),
	selectors: z.array(z.string()).optional(),
	root_element_selector: z.string().optional(),
	scroll: z.boolean().optional(),
	page_position: z.number().optional(),
	features: z.array(z.enum(['meta', 'link'])).optional(),
});
export const ScrapeOutputSchema = z
	.object({
		...base,
		data: z.array(z.unknown()).optional(),
		page_position: z.number().optional(),
		page_position_length: z.number().optional(),
		meta: z.unknown().optional(),
		link: z.array(z.unknown()).optional(),
		selectors: z.record(z.string(), z.unknown()).optional(),
		context: z.unknown().optional(),
	})
	.loose();

/** POST /v1/web/html_to_any @see https://jigsawstack.com/docs/api-reference/web/html-to-any */
export const HtmlToAnyInputSchema = z.object({
	html: z.string().optional(),
	url: z.string().optional(),
	type: z.enum(['pdf', 'png', 'jpeg', 'webp']).optional(),
	full_page: z.boolean().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	return_type: z.enum(['url', 'binary', 'base64']).optional(),
	quality: z.number().optional(),
	is_mobile: z.boolean().optional(),
	dark_mode: z.boolean().optional(),
	size_preset: z.string().optional(),
});
export const HtmlToAnyOutputSchema = z
	.object({
		...base,
		url: z.string().optional(),
	})
	.loose();

/** POST /v1/web/search @see https://jigsawstack.com/docs/api-reference/web/ai-search */
export const SearchInputSchema = z.object({
	query: z.string(),
	spell_check: z.boolean().optional(),
	max_results: z.number().optional(),
	safe_search: z.enum(['strict', 'moderate', 'off']).optional(),
	ai_overview: z.boolean().optional(),
	auto_scrape: z.boolean().optional(),
	country_code: z.string().optional(),
	byo_urls: z.array(z.string()).optional(),
});
export const SearchOutputSchema = z
	.object({
		...base,
		query: z.string().optional(),
		ai_overview: z.string().optional(),
		spell_fixed: z.boolean().optional(),
		is_safe: z.boolean().optional(),
		results: z.array(z.unknown()).optional(),
		image_urls: z.array(z.string()).optional(),
		links: z.array(z.string()).optional(),
		geo_results: z.array(z.unknown()).optional(),
	})
	.loose();

/** GET /v1/web/search/suggest @see https://jigsawstack.com/docs/api-reference/web/search-suggestions */
export const SearchSuggestionsInputSchema = z.object({ query: z.string() });
export const SearchSuggestionsOutputSchema = z
	.object({
		...base,
		suggestions: z.array(z.string()).optional(),
	})
	.loose();

// ── vision ───────────────────────────────────────────────────────────────────

/** POST /v1/vocr @see https://jigsawstack.com/docs/api-reference/ai/vocr */
export const VocrInputSchema = exactlyOneUrlOrFile(
	z.object({
		...urlOrFile,
		prompt: z
			.union([
				z.string(),
				z.array(z.string()),
				z.record(z.string(), z.string()),
			])
			.optional(),
		page_range: z.array(z.number()).optional(),
		fine_grained: z.boolean().optional(),
		return_bounds: z.boolean().optional(),
	}),
);
export const VocrOutputSchema = z
	.object({
		...base,
		context: z.unknown().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		tags: z.array(z.string()).optional(),
		has_text: z.boolean().optional(),
		sections: z.array(z.unknown()).optional(),
		total_pages: z.number().optional(),
	})
	.loose();

/** POST /v1/object_detection @see https://jigsawstack.com/docs/api-reference/ai/object-detection */
export const DetectObjectsInputSchema = z.object({
	...urlOrFile,
	prompts: z.array(z.string()).optional(),
	enhance_prompts: z.boolean().optional(),
	features: z.array(z.enum(['object', 'gui'])).optional(),
	annotated_image: z.boolean().optional(),
	return_type: z.enum(['url', 'base64']).optional(),
	return_masks: z.boolean().optional(),
	return_tags: z.boolean().optional(),
});
export const DetectObjectsOutputSchema = z
	.object({
		...base,
		annotated_image: z.string().optional(),
		gui_elements: z.array(z.unknown()).optional(),
		objects: z.array(z.unknown()).optional(),
		tags: z.array(z.string()).optional(),
	})
	.loose();

// ── audio ────────────────────────────────────────────────────────────────────

/** POST /v1/ai/transcribe @see https://jigsawstack.com/docs/api-reference/ai/speech-to-text */
export const SpeechToTextInputSchema = exactlyOneUrlOrFile(
	z.object({
		...urlOrFile,
		language: z.string().optional(),
		translate: z.boolean().optional(),
		by_speaker: z.boolean().optional(),
		webhook_url: z.string().optional(),
		batch_size: z.number().optional(),
		chunk_duration: z.number().optional(),
		word_timestamps: z.boolean().optional(),
	}),
);
export const SpeechToTextOutputSchema = z
	.object({
		...base,
		text: z.string().optional(),
		chunks: z.array(z.unknown()).optional(),
		status: z.string().optional(),
		id: z.string().optional(),
		language_detected: z.unknown().optional(),
	})
	.loose();

/** POST /v1/ai/tts — returns audio bytes (verified live). */
export const TextToSpeechInputSchema = z.object({
	text: z.string().min(5),
	accent: z.string().optional(),
	voice_clone_id: z.string().optional(),
	speaker_clone_url: z.string().optional(),
	speaker_clone_file_store_key: z.string().optional(),
});
export const TextToSpeechOutputSchema = z.object({
	success: z.boolean(),
	content_type: z.string(),
	base64: z.string(),
});

/** POST /v1/ai/tts/clone — returns voice_id (verified live). */
export const CreateVoiceCloneInputSchema = z.object({
	name: z.string(),
	...urlOrFile,
});
export const CreateVoiceCloneOutputSchema = z
	.object({
		...base,
		voice_id: z.string().optional(),
	})
	.loose();

// ── embedding / classification ───────────────────────────────────────────────

/** POST /v2/embedding @see https://jigsawstack.com/docs/api-reference/ai/embedding-v2 */
export const CreateEmbeddingV2InputSchema = z.object({
	text: z.string().optional(),
	...urlOrFile,
	type: z.enum(['text', 'text-other', 'image', 'audio', 'pdf']),
	token_overflow_mode: z.enum(['truncate', 'error']).optional(),
	dimensions: z.number().optional(),
	instruction: z.string().optional(),
	query: z.boolean().optional(),
	speaker_fingerprint: z.boolean().optional(),
});
export const CreateEmbeddingV2OutputSchema = z
	.object({
		...base,
		embeddings: z.array(z.array(z.number())).optional(),
		chunks: z.unknown().optional(),
		speaker_embeddings: z.array(z.array(z.number())).optional(),
	})
	.loose();

/** POST /v1/classification @see https://jigsawstack.com/docs/api-reference/classification/classification */
export const ClassifyInputSchema = z
	.object({
		dataset: z
			.array(
				z.object({
					type: z.enum(['text', 'image']),
					value: z.string(),
				}),
			)
			.min(1)
			.max(32),
		labels: z
			.array(
				z.object({
					key: z.string().optional(),
					type: z.enum(['text', 'image']),
					value: z.string(),
				}),
			)
			.min(2)
			.max(24),
		multiple_labels: z.boolean().optional(),
	})
	.refine((v) => v.dataset.every((item) => item.type === v.dataset[0]?.type), {
		message: 'dataset items must share the same type',
	})
	.refine((v) => new Set(v.labels.map((l) => l.key ?? l.value)).size >= 2, {
		message: 'labels must include at least 2 distinct keys',
	});
export const ClassifyOutputSchema = z
	.object({
		...base,
		predictions: z.array(z.union([z.string(), z.array(z.string())])).optional(),
	})
	.loose();

// ── prompt engine ────────────────────────────────────────────────────────────

const promptGuard = z.enum([
	'defamation',
	'specialized_advice',
	'privacy',
	'intellectual_property',
	'indiscriminate_weapons',
	'hate',
	'sexual_content',
	'elections',
	'code_interpreter_abuse',
]);

const promptInput = z.object({
	key: z.string(),
	optional: z.boolean().optional(),
	initial_value: z.string().optional(),
});

/** POST /v1/prompt_engine @see https://jigsawstack.com/docs/api-reference/prompt-engine/create */
export const CreatePromptInputSchema = z.object({
	prompt: z.string(),
	name: z.string().optional(),
	return_prompt: z.unknown().optional(),
	inputs: z.array(promptInput).optional(),
	use_internet: z.boolean().optional(),
	optimize_prompt: z.boolean().optional(),
	prompt_guard: z.array(promptGuard).optional(),
});
export const CreatePromptOutputSchema = z
	.object({
		...base,
		prompt_engine_id: z.string().optional(),
	})
	.loose();

/** GET /v1/prompt_engine @see https://jigsawstack.com/docs/api-reference/prompt-engine/list */
export const ListPromptsInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});
export const ListPromptsOutputSchema = z
	.object({
		...base,
		prompt_engines: z.array(z.unknown()).optional(),
		page: z.number().optional(),
		limit: z.number().optional(),
		has_more: z.boolean().optional(),
	})
	.loose();

/** POST /v1/prompt_engine/{id} @see https://jigsawstack.com/docs/api-reference/prompt-engine/run */
export const RunPromptInputSchema = z.object({
	id: z.string(),
	input_values: z.record(z.string(), z.unknown()).optional(),
	stream: z.boolean().optional(),
});
export const RunPromptOutputSchema = z
	.object({
		...base,
		result: z.unknown().optional(),
		message: z.string().optional(),
	})
	.loose();

export const JigsawstackEndpointInputSchemas = {
	nsfw: NsfwInputSchema,
	profanity: ProfanityInputSchema,
	spamCheck: SpamCheckInputSchema,
	spellCheck: SpellCheckInputSchema,
	sentiment: SentimentInputSchema,
	summary: SummaryInputSchema,
	translate: TranslateInputSchema,
	prediction: PredictionInputSchema,
	imageGeneration: ImageGenerationInputSchema,
	scrape: ScrapeInputSchema,
	htmlToAny: HtmlToAnyInputSchema,
	search: SearchInputSchema,
	searchSuggestions: SearchSuggestionsInputSchema,
	vocr: VocrInputSchema,
	detectObjects: DetectObjectsInputSchema,
	speechToText: SpeechToTextInputSchema,
	textToSpeech: TextToSpeechInputSchema,
	createVoiceClone: CreateVoiceCloneInputSchema,
	createEmbeddingV2: CreateEmbeddingV2InputSchema,
	classify: ClassifyInputSchema,
	createPrompt: CreatePromptInputSchema,
	listPrompts: ListPromptsInputSchema,
	runPrompt: RunPromptInputSchema,
} as const;

export const JigsawstackEndpointOutputSchemas = {
	nsfw: NsfwOutputSchema,
	profanity: ProfanityOutputSchema,
	spamCheck: SpamCheckOutputSchema,
	spellCheck: SpellCheckOutputSchema,
	sentiment: SentimentOutputSchema,
	summary: SummaryOutputSchema,
	translate: TranslateOutputSchema,
	prediction: PredictionOutputSchema,
	imageGeneration: ImageGenerationOutputSchema,
	scrape: ScrapeOutputSchema,
	htmlToAny: HtmlToAnyOutputSchema,
	search: SearchOutputSchema,
	searchSuggestions: SearchSuggestionsOutputSchema,
	vocr: VocrOutputSchema,
	detectObjects: DetectObjectsOutputSchema,
	speechToText: SpeechToTextOutputSchema,
	textToSpeech: TextToSpeechOutputSchema,
	createVoiceClone: CreateVoiceCloneOutputSchema,
	createEmbeddingV2: CreateEmbeddingV2OutputSchema,
	classify: ClassifyOutputSchema,
	createPrompt: CreatePromptOutputSchema,
	listPrompts: ListPromptsOutputSchema,
	runPrompt: RunPromptOutputSchema,
} as const;

export type JigsawstackEndpointInputs = {
	[K in keyof typeof JigsawstackEndpointInputSchemas]: z.infer<
		(typeof JigsawstackEndpointInputSchemas)[K]
	>;
};

export type JigsawstackEndpointOutputs = {
	[K in keyof typeof JigsawstackEndpointOutputSchemas]: z.infer<
		(typeof JigsawstackEndpointOutputSchemas)[K]
	>;
};
