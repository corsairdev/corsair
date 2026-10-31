import { z } from 'zod';

// Request and response shapes mirror the official OpenAPI specs published at
// https://platform.minimax.io/docs/api-reference (one spec per resource
// family, linked per section below). MiniMax wraps most JSON responses in a
// `base_resp` block; the request client turns a non-zero `status_code` into a
// MinimaxAPIError before output parsing, so output schemas only describe
// success payloads yet still accept the envelope.

// ── Shared building blocks ──────────────────────────────────────────────────

const BaseRespSchema = z
	.object({
		status_code: z.number(),
		status_msg: z.string().optional(),
	})
	.passthrough();

/**
 * Canonical ordinary text choices. Keep this list separate from validation:
 * callers may still send saved, legacy, or custom model IDs explicitly.
 */
export const MINIMAX_TEXT_MODELS = [
	'MiniMax-M3.1-Flash',
	'MiniMax-M3',
	'MiniMax-M2.7',
	'MiniMax-M2.7-highspeed',
	'MiniMax-M2.5',
	'MiniMax-M2.5-highspeed',
	'MiniMax-M2.1',
	'MiniMax-M2',
] as const;

export const DEFAULT_MINIMAX_TEXT_MODEL = MINIMAX_TEXT_MODELS[0];

// Explicit IDs are intentionally open-ended so saved/custom/legacy model
// selections remain usable even when the upstream catalog changes.
const TextModelSchema = z
	.string()
	.min(1)
	.default(DEFAULT_MINIMAX_TEXT_MODEL)
	.describe(
		`Recommended: ${MINIMAX_TEXT_MODELS.join(', ')}. Explicit model IDs are preserved.`,
	);

function validateFlashOptions(
	input: Record<string, unknown>,
	ctx: z.RefinementCtx,
) {
	if (input.model !== DEFAULT_MINIMAX_TEXT_MODEL) return;
	const thinking = input.thinking;
	if (
		thinking &&
		typeof thinking === 'object' &&
		'type' in thinking &&
		thinking.type !== 'adaptive'
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['thinking', 'type'],
			message: 'Flash requires adaptive thinking',
		});
	}
	const reasoning = input.reasoning;
	const effort =
		reasoning && typeof reasoning === 'object' && 'effort' in reasoning
			? reasoning.effort
			: undefined;
	for (const [path, value] of [
		['reasoning_effort', input.reasoning_effort],
		['reasoning', effort],
	] as const) {
		if (
			value !== undefined &&
			!['low', 'medium', 'high', 'xhigh', 'max'].includes(String(value))
		) {
			ctx.addIssue({
				code: 'custom',
				path: [path],
				message: 'Flash effort must be low, medium, high, xhigh, or max',
			});
		}
	}
	if (input.service_tier !== undefined) {
		ctx.addIssue({
			code: 'custom',
			path: ['service_tier'],
			message: 'Flash does not support service_tier',
		});
	}
	if (input.reasoning_split === false) {
		ctx.addIssue({
			code: 'custom',
			path: ['reasoning_split'],
			message: 'Flash requires separate reasoning',
		});
	}
}

const SPEECH_MODELS = [
	'speech-2.8-hd',
	'speech-2.8-turbo',
	'speech-2.6-hd',
	'speech-2.6-turbo',
	'speech-02-hd',
	'speech-02-turbo',
	'speech-01-hd',
	'speech-01-turbo',
] as const;

const SpeechModelSchema = z.enum(SPEECH_MODELS);

const LANGUAGE_BOOST_VALUES = [
	'Chinese',
	'Chinese,Yue',
	'English',
	'Arabic',
	'Russian',
	'Spanish',
	'French',
	'Portuguese',
	'German',
	'Turkish',
	'Dutch',
	'Ukrainian',
	'Vietnamese',
	'Indonesian',
	'Japanese',
	'Italian',
	'Korean',
	'Thai',
	'Polish',
	'Romanian',
	'Greek',
	'Czech',
	'Finnish',
	'Hindi',
	'Bulgarian',
	'Danish',
	'Hebrew',
	'Malay',
	'Persian',
	'Slovak',
	'Swedish',
	'Croatian',
	'Filipino',
	'Hungarian',
	'Norwegian',
	'Slovenian',
	'Catalan',
	'Nynorsk',
	'Tamil',
	'Afrikaans',
	'auto',
] as const;

const LanguageBoostSchema = z.enum(LANGUAGE_BOOST_VALUES);

const VoiceEmotionSchema = z.enum([
	'happy',
	'sad',
	'angry',
	'fearful',
	'disgusted',
	'surprised',
	'calm',
	'fluent',
	'whisper',
]);

const VoiceModifySchema = z
	.object({
		pitch: z.number().int().optional(),
		intensity: z.number().int().optional(),
		timbre: z.number().int().optional(),
		sound_effects: z
			.enum(['spacious_echo', 'auditorium_echo', 'lofi_telephone', 'robotic'])
			.optional(),
	})
	.passthrough();

const PronunciationDictSchema = z
	.object({
		tone: z.array(z.string()).optional(),
	})
	.passthrough();

const TimbreWeightsSchema = z
	.object({
		voice_id: z.string().min(1),
		weight: z.number().int(),
	})
	.passthrough();

// ── Chat (spec: api-reference/text) ─────────────────────────────────────────

const ChatContentPartSchema = z
	.object({
		type: z.string().optional(),
	})
	.passthrough();

const ChatMessageSchema = z
	.object({
		role: z.enum(['system', 'user', 'assistant', 'tool']),
		name: z.string().optional(),
		content: z.union([z.string(), z.array(ChatContentPartSchema)]).nullish(),
		tool_calls: z.array(ChatContentPartSchema).optional(),
	})
	.passthrough();

const ChatToolSchema = z
	.object({
		type: z.string().min(1),
		function: z
			.object({
				name: z.string().min(1),
				description: z.string().optional(),
				parameters: z.object({}).passthrough().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const ChatCompletionInputSchema = z
	.object({
		model: TextModelSchema,
		messages: z.array(ChatMessageSchema).min(1),
		max_completion_tokens: z.number().int().positive().optional(),
		max_tokens: z.number().int().positive().optional(),
		temperature: z.number().gt(0).lte(1).optional(),
		top_p: z.number().gt(0).lte(1).optional(),
		tool_choice: z.enum(['none', 'auto']).optional(),
		tools: z.array(ChatToolSchema).optional(),
		response_format: z
			.object({ type: z.string().min(1) })
			.passthrough()
			.optional(),
		mask_sensitive_info: z.boolean().optional(),
		// Streaming is out of scope: the transport returns the `text/event-stream`
		// body as a string and the object output schema would then fail *after*
		// the generation was billed. Reject it locally instead.
		stream: z.literal(false).optional(),
	})
	.passthrough()
	.superRefine(validateFlashOptions);

export type ChatCompletionInput = z.input<typeof ChatCompletionInputSchema>;

export const ChatCompletionOutputSchema = z
	.object({
		id: z.string().optional(),
		choices: z
			.array(
				z
					.object({
						finish_reason: z.string().optional(),
						index: z.number().int().optional(),
						message: ChatMessageSchema.optional(),
					})
					.passthrough(),
			)
			.optional(),
		created: z.number().int().optional(),
		model: z.string().optional(),
		object: z.enum(['chat.completion', 'chat.completion.chunk']).optional(),
		usage: z
			.object({ total_tokens: z.number().int().optional() })
			.passthrough()
			.optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type ChatCompletionOutput = z.infer<typeof ChatCompletionOutputSchema>;

const ResponseContentPartSchema = z
	.object({
		type: z.string().optional(),
	})
	.passthrough();

const ResponseInputItemSchema = z
	.object({
		type: z
			.enum(['message', 'function_call', 'function_call_output', 'reasoning'])
			.optional(),
		role: z
			.enum(['user', 'assistant', 'system', 'developer', 'tool'])
			.optional(),
		content: z
			.union([z.string(), z.array(ResponseContentPartSchema)])
			.optional(),
		call_id: z.string().optional(),
		name: z.string().optional(),
		arguments: z.string().optional(),
		output: z
			.union([z.string(), z.array(ResponseContentPartSchema)])
			.optional(),
		summary: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();

const ResponseToolSchema = z.object({ type: z.string().min(1) }).passthrough();

export const CreateResponseInputSchema = z
	.object({
		model: TextModelSchema,
		input: z.union([z.string(), z.array(ResponseInputItemSchema)]),
		instructions: z.string().optional(),
		max_output_tokens: z.number().int().positive().optional(),
		temperature: z.number().gt(0).lte(1).optional(),
		top_p: z.number().gt(0).lte(1).optional(),
		service_tier: z.enum(['standard', 'priority']).optional(),
		tools: z.array(ResponseToolSchema).optional(),
		tool_choice: z.enum(['none', 'auto']).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		prompt_cache_key: z.string().optional(),
		text: z
			.object({ format: z.object({}).passthrough().optional() })
			.passthrough()
			.optional(),
		reasoning: z
			.object({ effort: z.string().optional() })
			.passthrough()
			.optional(),
		// See ChatCompletionInputSchema: streaming cannot be represented by the
		// object output schema, so reject it before the request is billed.
		stream: z.literal(false).optional(),
	})
	.passthrough()
	.superRefine(validateFlashOptions);

export type CreateResponseInput = z.input<typeof CreateResponseInputSchema>;

export const CreateResponseOutputSchema = z
	.object({
		id: z.string().optional(),
		object: z.string().optional(),
		created_at: z.number().int().optional(),
		model: z.string().optional(),
		status: z.enum(['completed', 'incomplete', 'failed']).optional(),
		output: z.array(ResponseContentPartSchema).optional(),
		output_text: z.string().optional(),
		usage: z.object({}).passthrough().optional(),
		error: z
			.object({ code: z.string().optional(), message: z.string().optional() })
			.passthrough()
			.nullish(),
		incomplete_details: z
			.object({ reason: z.string().optional() })
			.passthrough()
			.nullish(),
		parallel_tool_calls: z.boolean().optional(),
		store: z.boolean().optional(),
		truncation: z.string().optional(),
	})
	.passthrough();

export type CreateResponseOutput = z.infer<typeof CreateResponseOutputSchema>;

export const EstimateInputTokensInputSchema = z
	.object({
		model: TextModelSchema,
		input: z.union([z.string(), z.array(ResponseInputItemSchema)]),
		instructions: z.string().optional(),
		tools: z.array(ResponseToolSchema).optional(),
		tool_choice: z.enum(['none', 'auto']).optional(),
		text: z
			.object({ format: z.object({}).passthrough().optional() })
			.passthrough()
			.optional(),
		reasoning: z
			.object({ effort: z.string().optional() })
			.passthrough()
			.optional(),
		// See ChatCompletionInputSchema: reject streaming before any billed call.
		stream: z.literal(false).optional(),
	})
	.passthrough()
	.superRefine(validateFlashOptions);

export type EstimateInputTokensInput = z.input<
	typeof EstimateInputTokensInputSchema
>;

export const EstimateInputTokensOutputSchema = z
	.object({
		object: z.literal('response.input_tokens'),
		input_tokens: z.number().int(),
	})
	.passthrough();

export type EstimateInputTokensOutput = z.infer<
	typeof EstimateInputTokensOutputSchema
>;

// ── Speech synthesis (spec: api-reference/speech/t2a, speech/t2a-async) ─────

const T2aVoiceSettingSchema = z
	.object({
		voice_id: z.string().min(1),
		speed: z.number().optional(),
		vol: z.number().optional(),
		pitch: z.number().int().optional(),
		emotion: VoiceEmotionSchema.optional(),
		text_normalization: z.boolean().optional(),
		latex_read: z.boolean().optional(),
	})
	.passthrough();

const T2aAudioSettingSchema = z
	.object({
		sample_rate: z.number().int().optional(),
		bitrate: z.number().int().optional(),
		format: z
			.enum(['mp3', 'pcm', 'flac', 'wav', 'pcmu_raw', 'pcmu_wav', 'opus'])
			.optional(),
		channel: z.number().int().optional(),
		force_cbr: z.boolean().optional(),
	})
	.passthrough();

export const T2aInputSchema = z
	.object({
		model: SpeechModelSchema,
		text: z.string().min(1),
		voice_setting: T2aVoiceSettingSchema.optional(),
		audio_setting: T2aAudioSettingSchema.optional(),
		pronunciation_dict: PronunciationDictSchema.optional(),
		timbre_weights: z.array(TimbreWeightsSchema).optional(),
		language_boost: LanguageBoostSchema.optional(),
		text_normalization_mode: z.enum(['basic', 'quality']).optional(),
		voice_modify: VoiceModifySchema.optional(),
		subtitle_enable: z.boolean().optional(),
		subtitle_type: z.enum(['sentence', 'word', 'word_streaming']).optional(),
		output_format: z.enum(['url', 'hex']).optional(),
	})
	.passthrough();

export type T2aInput = z.infer<typeof T2aInputSchema>;

export const T2aOutputSchema = z
	.object({
		data: z
			.object({
				audio: z.string().optional(),
				status: z.number().int().optional(),
				subtitle_file: z.string().optional(),
				subtitle: z.string().optional(),
				subtitles: z.array(z.object({}).passthrough()).optional(),
			})
			.passthrough()
			.optional(),
		trace_id: z.string().optional(),
		extra_info: z
			.object({
				audio_length: z.number().optional(),
				audio_sample_rate: z.number().optional(),
				audio_size: z.number().optional(),
				bitrate: z.number().optional(),
				audio_format: z.string().optional(),
				audio_channel: z.number().optional(),
				usage_characters: z.number().optional(),
				word_count: z.number().optional(),
			})
			.passthrough()
			.optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type T2aOutput = z.infer<typeof T2aOutputSchema>;

const AsyncVoiceSettingSchema = z
	.object({
		voice_id: z.string().min(1),
		speed: z.number().optional(),
		vol: z.number().optional(),
		pitch: z.number().int().optional(),
		emotion: VoiceEmotionSchema.optional(),
		english_normalization: z.boolean().optional(),
		latex_read: z.boolean().optional(),
	})
	.passthrough();

const AsyncAudioSettingSchema = z
	.object({
		audio_sample_rate: z.number().int().optional(),
		bitrate: z.number().int().optional(),
		format: z
			.enum(['mp3', 'pcm', 'flac', 'wav', 'pcmu_raw', 'pcmu_wav', 'opus'])
			.optional(),
		channel: z.number().int().optional(),
	})
	.passthrough();

export const SpeechCreateAsyncTaskInputSchema = z
	.object({
		model: SpeechModelSchema,
		// Exactly one of the two documented input modes is required: inline
		// `text` or the `file_id` of an uploaded text file.
		text: z.string().min(1).optional(),
		text_file_id: z.number().int().optional(),
		voice_setting: AsyncVoiceSettingSchema,
		audio_setting: AsyncAudioSettingSchema.optional(),
		pronunciation_dict: PronunciationDictSchema.optional(),
		language_boost: LanguageBoostSchema.optional(),
		voice_modify: VoiceModifySchema.optional(),
	})
	.passthrough()
	.refine(
		(value) =>
			(value.text !== undefined) !== (value.text_file_id !== undefined),
		{ message: 'Provide exactly one of text or text_file_id' },
	);

export type SpeechCreateAsyncTaskInput = z.infer<
	typeof SpeechCreateAsyncTaskInputSchema
>;

export const SpeechCreateAsyncTaskOutputSchema = z
	.object({
		task_id: z.string(),
		file_id: z.number().int().optional(),
		task_token: z.string().optional(),
		usage_characters: z.number().int().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type SpeechCreateAsyncTaskOutput = z.infer<
	typeof SpeechCreateAsyncTaskOutputSchema
>;

export const SpeechQueryAsyncTaskInputSchema = z.object({
	// Create returns a string task_id while the query spec types it as int64;
	// both forms are accepted so the id can be fed straight back in.
	task_id: z.union([z.string().min(1), z.number().int()]),
});

export type SpeechQueryAsyncTaskInput = z.infer<
	typeof SpeechQueryAsyncTaskInputSchema
>;

export const SpeechQueryAsyncTaskOutputSchema = z
	.object({
		task_id: z.union([z.string(), z.number()]).optional(),
		// The docs capitalise these in examples ("Processing", "Success", ...)
		// while other parts of the same page use the lowercase forms; accept
		// both so a real response never throws.
		status: z.enum([
			'success',
			'failed',
			'expired',
			'processing',
			'Success',
			'Failed',
			'Expired',
			'Processing',
		]),
		file_id: z.number().int().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type SpeechQueryAsyncTaskOutput = z.infer<
	typeof SpeechQueryAsyncTaskOutputSchema
>;

// ── Voice management (spec: voice-management, voice-cloning, voice-design) ──

const VoiceInfoSchema = z
	.object({
		voice_id: z.string(),
		voice_name: z.string().optional(),
		description: z.array(z.string()).optional(),
		created_time: z.string().optional(),
	})
	.passthrough();

export const VoiceListInputSchema = z.object({
	voice_type: z.enum(['system', 'voice_cloning', 'voice_generation', 'all']),
});

export type VoiceListInput = z.infer<typeof VoiceListInputSchema>;

export const VoiceListOutputSchema = z
	.object({
		system_voice: z.array(VoiceInfoSchema).optional(),
		voice_cloning: z.array(VoiceInfoSchema).optional(),
		voice_generation: z.array(VoiceInfoSchema).optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VoiceListOutput = z.infer<typeof VoiceListOutputSchema>;

const ClonePromptSchema = z
	.object({
		prompt_audio: z.number().int(),
		prompt_text: z.string(),
	})
	.passthrough();

export const VoiceCloneInputSchema = z
	.object({
		file_id: z.number().int(),
		voice_id: z.string().min(1),
		clone_prompt: ClonePromptSchema.optional(),
		text: z.string().optional(),
		model: SpeechModelSchema.optional(),
		language_boost: LanguageBoostSchema.optional(),
		text_validation: z.string().optional(),
		accuracy: z.number().optional(),
		need_noise_reduction: z.boolean().optional(),
		need_volume_normalization: z.boolean().optional(),
		aigc_watermark: z.boolean().optional(),
	})
	.passthrough();

export type VoiceCloneInput = z.infer<typeof VoiceCloneInputSchema>;

export const VoiceCloneOutputSchema = z
	.object({
		demo_audio: z.string().optional(),
		input_sensitive: z
			.object({ type: z.number().int().optional() })
			.passthrough()
			.optional(),
		extra_info: z.object({}).passthrough().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VoiceCloneOutput = z.infer<typeof VoiceCloneOutputSchema>;

export const VoiceDesignInputSchema = z
	.object({
		prompt: z.string().min(1),
		preview_text: z.string().min(1),
		voice_id: z.string().optional(),
	})
	.passthrough();

export type VoiceDesignInput = z.infer<typeof VoiceDesignInputSchema>;

export const VoiceDesignOutputSchema = z
	.object({
		voice_id: z.string(),
		trial_audio: z.string().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VoiceDesignOutput = z.infer<typeof VoiceDesignOutputSchema>;

export const VoiceDeleteInputSchema = z.object({
	voice_type: z.enum(['voice_cloning', 'voice_generation']),
	voice_id: z.string().min(1),
});

export type VoiceDeleteInput = z.infer<typeof VoiceDeleteInputSchema>;

export const VoiceDeleteOutputSchema = z
	.object({
		voice_id: z.string().optional(),
		created_time: z.string().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VoiceDeleteOutput = z.infer<typeof VoiceDeleteOutputSchema>;

// ── Music (spec: music, music/lyrics) ───────────────────────────────────────

const MusicAudioSettingSchema = z
	.object({
		sample_rate: z.number().int().optional(),
		bitrate: z.number().int().optional(),
		format: z.enum(['mp3', 'wav', 'pcm']).optional(),
	})
	.passthrough();

const MUSIC_MODELS = [
	'music-3.0',
	'music-2.6',
	'music-cover',
	'music-3.0-free',
	'music-2.6-free',
	'music-cover-free',
] as const;

export const MusicGenerateInputSchema = z
	.object({
		model: z.enum(MUSIC_MODELS),
		prompt: z.string().optional(),
		lyrics: z.string().optional(),
		output_format: z.enum(['url', 'hex']).optional(),
		audio_setting: MusicAudioSettingSchema.optional(),
		lyrics_optimizer: z.boolean().optional(),
		is_instrumental: z.boolean().optional(),
		audio_url: z.string().optional(),
		audio_base64: z.string().optional(),
		cover_feature_id: z.string().optional(),
	})
	.passthrough();

export type MusicGenerateInput = z.infer<typeof MusicGenerateInputSchema>;

export const MusicGenerateOutputSchema = z
	.object({
		data: z
			.object({
				status: z.number().int().optional(),
				audio: z.string().optional(),
			})
			.passthrough()
			.optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type MusicGenerateOutput = z.infer<typeof MusicGenerateOutputSchema>;

export const MusicCoverPreprocessInputSchema = z
	.object({
		model: z.literal('music-cover'),
		audio_url: z.string().optional(),
		audio_base64: z.string().optional(),
	})
	.passthrough();

export type MusicCoverPreprocessInput = z.infer<
	typeof MusicCoverPreprocessInputSchema
>;

export const MusicCoverPreprocessOutputSchema = z
	.object({
		cover_feature_id: z.string().optional(),
		formatted_lyrics: z.string().optional(),
		structure_result: z.string().optional(),
		audio_duration: z.number().optional(),
		trace_id: z.string().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type MusicCoverPreprocessOutput = z.infer<
	typeof MusicCoverPreprocessOutputSchema
>;

export const MusicGenerateLyricsInputSchema = z
	.object({
		mode: z.enum(['write_full_song', 'edit']),
		prompt: z.string().optional(),
		lyrics: z.string().optional(),
		title: z.string().optional(),
	})
	.passthrough();

export type MusicGenerateLyricsInput = z.infer<
	typeof MusicGenerateLyricsInputSchema
>;

export const MusicGenerateLyricsOutputSchema = z
	.object({
		song_title: z.string().optional(),
		style_tags: z.string().optional(),
		lyrics: z.string().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type MusicGenerateLyricsOutput = z.infer<
	typeof MusicGenerateLyricsOutputSchema
>;

// ── Image generation (spec: image/generation) ───────────────────────────────

const IMAGE_ASPECT_RATIOS = [
	'1:1',
	'16:9',
	'4:3',
	'3:2',
	'2:3',
	'3:4',
	'9:16',
	'21:9',
] as const;

const ImageSubjectReferenceSchema = z
	.object({
		type: z.literal('character'),
		image_file: z.string().min(1),
	})
	.passthrough();

export const ImageGenerateInputSchema = z
	.object({
		model: z.enum(['image-01', 'image-01-live']),
		prompt: z.string().min(1),
		subject_reference: z.array(ImageSubjectReferenceSchema).optional(),
		aspect_ratio: z.enum(IMAGE_ASPECT_RATIOS).optional(),
		width: z.number().int().optional(),
		height: z.number().int().optional(),
		response_format: z.enum(['url', 'base64']).optional(),
		seed: z.number().int().optional(),
		n: z.number().int().optional(),
		prompt_optimizer: z.boolean().optional(),
	})
	.passthrough();

export type ImageGenerateInput = z.infer<typeof ImageGenerateInputSchema>;

export const ImageGenerateOutputSchema = z
	.object({
		data: z
			.object({
				image_urls: z.array(z.string()).optional(),
				image_base64: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
		metadata: z
			.object({
				success_count: z.number().int().optional(),
				failed_count: z.number().int().optional(),
			})
			.passthrough()
			.optional(),
		id: z.string().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type ImageGenerateOutput = z.infer<typeof ImageGenerateOutputSchema>;

// ── Video generation (spec: video/generation, video/agent) ──────────────────

const VideoProcessStatusSchema = z.enum([
	'Preparing',
	'Queueing',
	'Processing',
	'Success',
	'Fail',
]);

const HAILUO_MODELS = [
	'MiniMax-Hailuo-2.3',
	'MiniMax-Hailuo-2.3-Fast',
	'MiniMax-Hailuo-02',
	'T2V-01-Director',
	'T2V-01',
	'I2V-01-Director',
	'I2V-01-live',
	'I2V-01',
	'S2V-01',
] as const;

const SubjectReferenceSchema = z
	.object({
		type: z.literal('character'),
		image: z.array(z.string()).min(1),
	})
	.passthrough();

export const VideoGenerateInputSchema = z
	.object({
		model: z.enum(HAILUO_MODELS),
		prompt: z.string().optional(),
		first_frame_image: z.string().optional(),
		last_frame_image: z.string().optional(),
		subject_reference: z.array(SubjectReferenceSchema).optional(),
		prompt_optimizer: z.boolean().optional(),
		fast_pretreatment: z.boolean().optional(),
		duration: z.number().int().optional(),
		resolution: z.enum(['512P', '720P', '768P', '1080P']).optional(),
		callback_url: z.string().optional(),
	})
	.passthrough();

export type VideoGenerateInput = z.infer<typeof VideoGenerateInputSchema>;

export const VideoGenerateOutputSchema = z
	.object({
		task_id: z.string(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VideoGenerateOutput = z.infer<typeof VideoGenerateOutputSchema>;

export const VideoQueryInputSchema = z.object({
	task_id: z.string().min(1),
});

export type VideoQueryInput = z.infer<typeof VideoQueryInputSchema>;

export const VideoQueryOutputSchema = z
	.object({
		task_id: z.string().optional(),
		status: VideoProcessStatusSchema.optional(),
		file_id: z.string().optional(),
		video_width: z.number().int().optional(),
		video_height: z.number().int().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VideoQueryOutput = z.infer<typeof VideoQueryOutputSchema>;

const MediaUrlSchema = z.object({ url: z.string().min(1) }).passthrough();

const VideoContentItemSchema = z
	.object({
		type: z.enum(['text', 'image_url', 'video_url', 'audio_url']),
		text: z.string().optional(),
		image_url: MediaUrlSchema.optional(),
		video_url: MediaUrlSchema.optional(),
		audio_url: MediaUrlSchema.optional(),
		role: z
			.enum([
				'first_frame',
				'last_frame',
				'reference_image',
				'reference_video',
				'reference_audio',
			])
			.optional(),
	})
	.passthrough();

const RegenContentItemSchema = z
	.object({
		type: z.enum(['text', 'image_url', 'video_url', 'audio_url']),
		text: z.string().optional(),
		image_url: MediaUrlSchema.optional(),
		video_url: MediaUrlSchema.optional(),
		audio_url: MediaUrlSchema.optional(),
		role: z
			.enum([
				'base_video',
				'first_frame',
				'last_frame',
				'reference_image',
				'reference_video',
				'reference_audio',
			])
			.optional(),
	})
	.passthrough();

const VIDEO_V2_RATIOS = [
	'adaptive',
	'21:9',
	'16:9',
	'4:3',
	'1:1',
	'3:4',
	'9:16',
] as const;

const VIDEO_V2_DURATION = z.number().int().min(4).max(15);

export const VideoGenerateV2InputSchema = z
	.object({
		model: z.enum(['MiniMax-H3', 'MiniMax-H3-Max']),
		content: z.array(VideoContentItemSchema).min(1),
		resolution: z.enum(['480P', '768P', '2K']),
		duration: VIDEO_V2_DURATION,
		ratio: z.enum(VIDEO_V2_RATIOS).optional(),
		extra: z
			.object({ prompt_expansion_mode: z.string().optional() })
			.passthrough()
			.optional(),
		callback_url: z.string().optional(),
	})
	.passthrough();

export type VideoGenerateV2Input = z.infer<typeof VideoGenerateV2InputSchema>;

export const VideoGenerateV2OutputSchema = z
	.object({ task_id: z.string() })
	.passthrough();

export type VideoGenerateV2Output = z.infer<typeof VideoGenerateV2OutputSchema>;

export const VideoQueryV2InputSchema = z.object({
	task_id: z.string().min(1),
});

export type VideoQueryV2Input = z.infer<typeof VideoQueryV2InputSchema>;

const VideoTaskSchema = z
	.object({
		id: z.string().optional(),
		model: z.string().optional(),
		status: z
			.enum(['queued', 'running', 'succeeded', 'failed', 'cancelled'])
			.optional(),
		error: z
			.object({ code: z.string().optional(), message: z.string().optional() })
			.passthrough()
			.optional(),
		created_at: z.number().int().optional(),
		updated_at: z.number().int().optional(),
		content: z
			.object({ url: z.string().optional(), prompt: z.string().optional() })
			.passthrough()
			.optional(),
		resolution: z.string().optional(),
		duration: z.number().int().optional(),
		usage: z.object({}).passthrough().optional(),
		ratio: z.string().optional(),
		task_type: z
			.enum(['generation', 'h3_context_ir', 'regeneration'])
			.optional(),
		modality: z.enum(['video', 'text']).optional(),
	})
	.passthrough();

export const VideoQueryV2OutputSchema = z
	.object({ task: VideoTaskSchema })
	.passthrough();

export type VideoQueryV2Output = z.infer<typeof VideoQueryV2OutputSchema>;

export const VideoListV2InputSchema = z
	.object({
		pageNum: z.number().int().positive().optional(),
		pageSize: z.number().int().positive().optional(),
		status: z
			.enum(['queued', 'running', 'succeeded', 'failed', 'cancelled'])
			.optional(),
		taskIds: z.array(z.string()).optional(),
		model: z.string().optional(),
		taskType: z
			.enum(['generation', 'h3_context_ir', 'regeneration'])
			.optional(),
	})
	.passthrough();

export type VideoListV2Input = z.infer<typeof VideoListV2InputSchema>;

export const VideoListV2OutputSchema = z
	.object({
		items: z.array(VideoTaskSchema),
		total: z.number().int().optional(),
	})
	.passthrough();

export type VideoListV2Output = z.infer<typeof VideoListV2OutputSchema>;

export const VideoCancelOrDeleteV2InputSchema = z.object({
	task_id: z.string().min(1),
});

export type VideoCancelOrDeleteV2Input = z.infer<
	typeof VideoCancelOrDeleteV2InputSchema
>;

export const VideoCancelOrDeleteV2OutputSchema = z
	.object({
		task_id: z.string().optional(),
		action: z.enum(['cancelled', 'deleted']).optional(),
		status: z.enum(['cancelled', 'deleted']).optional(),
	})
	.passthrough();

export type VideoCancelOrDeleteV2Output = z.infer<
	typeof VideoCancelOrDeleteV2OutputSchema
>;

export const VideoContextIrInputSchema = z
	.object({
		model: z.literal('MiniMax-H3'),
		content: z.array(VideoContentItemSchema).min(1),
		duration: VIDEO_V2_DURATION,
		ratio: z.enum(VIDEO_V2_RATIOS).optional(),
		callback_url: z.string().optional(),
	})
	.passthrough();

export type VideoContextIrInput = z.infer<typeof VideoContextIrInputSchema>;

export const VideoRegenerateInputSchema = z
	.object({
		model: z.literal('MiniMax-H3'),
		// Exactly one of the two documented input modes is required: reference
		// an existing successful task, or resend the original content.
		source_task_id: z.string().min(1).optional(),
		content: z.array(RegenContentItemSchema).optional(),
		resolution: z.literal('2K'),
		callback_url: z.string().optional(),
		aigc_watermark: z.boolean().optional(),
	})
	.passthrough()
	.refine(
		(value) =>
			(value.source_task_id !== undefined) !== (value.content !== undefined),
		{ message: 'Provide exactly one of source_task_id or content' },
	);

export type VideoRegenerateInput = z.infer<typeof VideoRegenerateInputSchema>;

const TextInputSchema = z.object({ value: z.string() }).passthrough();

export const VideoTemplateGenerateInputSchema = z
	.object({
		template_id: z.string().min(1),
		text_inputs: z.array(TextInputSchema).optional(),
		media_inputs: z.array(TextInputSchema).optional(),
		callback_url: z.string().optional(),
	})
	.passthrough();

export type VideoTemplateGenerateInput = z.infer<
	typeof VideoTemplateGenerateInputSchema
>;

export const VideoTemplateGenerateOutputSchema = z
	.object({
		task_id: z.string(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VideoTemplateGenerateOutput = z.infer<
	typeof VideoTemplateGenerateOutputSchema
>;

export const VideoTemplateQueryInputSchema = z.object({
	task_id: z.string().min(1),
});

export type VideoTemplateQueryInput = z.infer<
	typeof VideoTemplateQueryInputSchema
>;

export const VideoTemplateQueryOutputSchema = z
	.object({
		task_id: z.string().optional(),
		status: VideoProcessStatusSchema.optional(),
		video_url: z.string().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type VideoTemplateQueryOutput = z.infer<
	typeof VideoTemplateQueryOutputSchema
>;

// ── File management (spec: file/management) ─────────────────────────────────

const FileObjectSchema = z
	.object({
		file_id: z.number().int().optional(),
		bytes: z.number().int().optional(),
		created_at: z.number().int().optional(),
		filename: z.string().optional(),
		purpose: z.string().optional(),
		download_url: z.string().optional(),
	})
	.passthrough();

export const FilesListInputSchema = z.object({
	purpose: z.enum([
		'voice_clone',
		'prompt_audio',
		't2a_async_input',
		'video_generation_input',
	]),
});

export type FilesListInput = z.infer<typeof FilesListInputSchema>;

export const FilesListOutputSchema = z
	.object({
		files: z.array(FileObjectSchema),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type FilesListOutput = z.infer<typeof FilesListOutputSchema>;

export const FilesRetrieveInputSchema = z.object({
	file_id: z.number().int(),
});

export type FilesRetrieveInput = z.infer<typeof FilesRetrieveInputSchema>;

export const FilesRetrieveOutputSchema = z
	.object({
		file: FileObjectSchema,
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type FilesRetrieveOutput = z.infer<typeof FilesRetrieveOutputSchema>;

export const FilesDeleteInputSchema = z.object({
	file_id: z.number().int(),
	purpose: z.enum([
		'voice_clone',
		'prompt_audio',
		't2a_async',
		't2a_async_input',
		'video_generation',
	]),
});

export type FilesDeleteInput = z.infer<typeof FilesDeleteInputSchema>;

export const FilesDeleteOutputSchema = z
	.object({
		file_id: z.number().int().optional(),
		base_resp: BaseRespSchema.optional(),
	})
	.passthrough();

export type FilesDeleteOutput = z.infer<typeof FilesDeleteOutputSchema>;

// ── Models (spec: models/openai, models/anthropic) ──────────────────────────

export const ModelsListInputSchema = z.object({}).passthrough();

export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;

export const ModelsListOutputSchema = z
	.object({
		object: z.string().optional(),
		data: z.array(
			z
				.object({
					id: z.string(),
					object: z.string().optional(),
					created: z.number().int().optional(),
					owned_by: z.string().optional(),
				})
				.passthrough(),
		),
	})
	.passthrough();

export type ModelsListOutput = z.infer<typeof ModelsListOutputSchema>;

export const ModelsRetrieveInputSchema = z.object({
	model_id: z.string().min(1),
});

export type ModelsRetrieveInput = z.infer<typeof ModelsRetrieveInputSchema>;

export const ModelsRetrieveOutputSchema = z
	.object({
		id: z.string(),
		object: z.string().optional(),
		created: z.number().int().optional(),
		owned_by: z.string().optional(),
	})
	.passthrough();

export type ModelsRetrieveOutput = z.infer<typeof ModelsRetrieveOutputSchema>;

export const ModelsListAnthropicInputSchema = z
	.object({
		limit: z.number().int().positive().optional(),
		after_id: z.string().optional(),
		before_id: z.string().optional(),
	})
	.passthrough();

export type ModelsListAnthropicInput = z.infer<
	typeof ModelsListAnthropicInputSchema
>;

export const ModelsListAnthropicOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					created_at: z.string().optional(),
					display_name: z.string().optional(),
					type: z.string().optional(),
				})
				.passthrough(),
		),
		first_id: z.string().optional(),
		has_more: z.boolean().optional(),
		last_id: z.string().optional(),
	})
	.passthrough();

export type ModelsListAnthropicOutput = z.infer<
	typeof ModelsListAnthropicOutputSchema
>;

export const ModelsRetrieveAnthropicInputSchema = z.object({
	model_id: z.string().min(1),
});

export type ModelsRetrieveAnthropicInput = z.infer<
	typeof ModelsRetrieveAnthropicInputSchema
>;

export const ModelsRetrieveAnthropicOutputSchema = z
	.object({
		id: z.string(),
		created_at: z.string().optional(),
		display_name: z.string().optional(),
		type: z.string().optional(),
	})
	.passthrough();

export type ModelsRetrieveAnthropicOutput = z.infer<
	typeof ModelsRetrieveAnthropicOutputSchema
>;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type MinimaxEndpointInputs = {
	chatCompletion: ChatCompletionInput;
	chatCreateResponse: CreateResponseInput;
	chatEstimateInputTokens: EstimateInputTokensInput;
	speechT2a: T2aInput;
	speechCreateAsyncTask: SpeechCreateAsyncTaskInput;
	speechQueryAsyncTask: SpeechQueryAsyncTaskInput;
	voiceList: VoiceListInput;
	voiceClone: VoiceCloneInput;
	voiceDesign: VoiceDesignInput;
	voiceDelete: VoiceDeleteInput;
	musicGenerate: MusicGenerateInput;
	musicCoverPreprocess: MusicCoverPreprocessInput;
	musicGenerateLyrics: MusicGenerateLyricsInput;
	imageGenerate: ImageGenerateInput;
	videoGenerate: VideoGenerateInput;
	videoQuery: VideoQueryInput;
	videoGenerateV2: VideoGenerateV2Input;
	videoQueryV2: VideoQueryV2Input;
	videoListV2: VideoListV2Input;
	videoCancelOrDeleteV2: VideoCancelOrDeleteV2Input;
	videoContextIr: VideoContextIrInput;
	videoRegenerate: VideoRegenerateInput;
	videoTemplateGenerate: VideoTemplateGenerateInput;
	videoTemplateQuery: VideoTemplateQueryInput;
	filesList: FilesListInput;
	filesRetrieve: FilesRetrieveInput;
	filesDelete: FilesDeleteInput;
	modelsList: ModelsListInput;
	modelsRetrieve: ModelsRetrieveInput;
	modelsListAnthropic: ModelsListAnthropicInput;
	modelsRetrieveAnthropic: ModelsRetrieveAnthropicInput;
};

export type MinimaxEndpointOutputs = {
	chatCompletion: ChatCompletionOutput;
	chatCreateResponse: CreateResponseOutput;
	chatEstimateInputTokens: EstimateInputTokensOutput;
	speechT2a: T2aOutput;
	speechCreateAsyncTask: SpeechCreateAsyncTaskOutput;
	speechQueryAsyncTask: SpeechQueryAsyncTaskOutput;
	voiceList: VoiceListOutput;
	voiceClone: VoiceCloneOutput;
	voiceDesign: VoiceDesignOutput;
	voiceDelete: VoiceDeleteOutput;
	musicGenerate: MusicGenerateOutput;
	musicCoverPreprocess: MusicCoverPreprocessOutput;
	musicGenerateLyrics: MusicGenerateLyricsOutput;
	imageGenerate: ImageGenerateOutput;
	videoGenerate: VideoGenerateOutput;
	videoQuery: VideoQueryOutput;
	videoGenerateV2: VideoGenerateV2Output;
	videoQueryV2: VideoQueryV2Output;
	videoListV2: VideoListV2Output;
	videoCancelOrDeleteV2: VideoCancelOrDeleteV2Output;
	videoContextIr: VideoGenerateV2Output;
	videoRegenerate: VideoGenerateV2Output;
	videoTemplateGenerate: VideoTemplateGenerateOutput;
	videoTemplateQuery: VideoTemplateQueryOutput;
	filesList: FilesListOutput;
	filesRetrieve: FilesRetrieveOutput;
	filesDelete: FilesDeleteOutput;
	modelsList: ModelsListOutput;
	modelsRetrieve: ModelsRetrieveOutput;
	modelsListAnthropic: ModelsListAnthropicOutput;
	modelsRetrieveAnthropic: ModelsRetrieveAnthropicOutput;
};

export const MinimaxEndpointInputSchemas = {
	chatCompletion: ChatCompletionInputSchema,
	chatCreateResponse: CreateResponseInputSchema,
	chatEstimateInputTokens: EstimateInputTokensInputSchema,
	speechT2a: T2aInputSchema,
	speechCreateAsyncTask: SpeechCreateAsyncTaskInputSchema,
	speechQueryAsyncTask: SpeechQueryAsyncTaskInputSchema,
	voiceList: VoiceListInputSchema,
	voiceClone: VoiceCloneInputSchema,
	voiceDesign: VoiceDesignInputSchema,
	voiceDelete: VoiceDeleteInputSchema,
	musicGenerate: MusicGenerateInputSchema,
	musicCoverPreprocess: MusicCoverPreprocessInputSchema,
	musicGenerateLyrics: MusicGenerateLyricsInputSchema,
	imageGenerate: ImageGenerateInputSchema,
	videoGenerate: VideoGenerateInputSchema,
	videoQuery: VideoQueryInputSchema,
	videoGenerateV2: VideoGenerateV2InputSchema,
	videoQueryV2: VideoQueryV2InputSchema,
	videoListV2: VideoListV2InputSchema,
	videoCancelOrDeleteV2: VideoCancelOrDeleteV2InputSchema,
	videoContextIr: VideoContextIrInputSchema,
	videoRegenerate: VideoRegenerateInputSchema,
	videoTemplateGenerate: VideoTemplateGenerateInputSchema,
	videoTemplateQuery: VideoTemplateQueryInputSchema,
	filesList: FilesListInputSchema,
	filesRetrieve: FilesRetrieveInputSchema,
	filesDelete: FilesDeleteInputSchema,
	modelsList: ModelsListInputSchema,
	modelsRetrieve: ModelsRetrieveInputSchema,
	modelsListAnthropic: ModelsListAnthropicInputSchema,
	modelsRetrieveAnthropic: ModelsRetrieveAnthropicInputSchema,
} as const;

export const MinimaxEndpointOutputSchemas = {
	chatCompletion: ChatCompletionOutputSchema,
	chatCreateResponse: CreateResponseOutputSchema,
	chatEstimateInputTokens: EstimateInputTokensOutputSchema,
	speechT2a: T2aOutputSchema,
	speechCreateAsyncTask: SpeechCreateAsyncTaskOutputSchema,
	speechQueryAsyncTask: SpeechQueryAsyncTaskOutputSchema,
	voiceList: VoiceListOutputSchema,
	voiceClone: VoiceCloneOutputSchema,
	voiceDesign: VoiceDesignOutputSchema,
	voiceDelete: VoiceDeleteOutputSchema,
	musicGenerate: MusicGenerateOutputSchema,
	musicCoverPreprocess: MusicCoverPreprocessOutputSchema,
	musicGenerateLyrics: MusicGenerateLyricsOutputSchema,
	imageGenerate: ImageGenerateOutputSchema,
	videoGenerate: VideoGenerateOutputSchema,
	videoQuery: VideoQueryOutputSchema,
	videoGenerateV2: VideoGenerateV2OutputSchema,
	videoQueryV2: VideoQueryV2OutputSchema,
	videoListV2: VideoListV2OutputSchema,
	videoCancelOrDeleteV2: VideoCancelOrDeleteV2OutputSchema,
	videoContextIr: VideoGenerateV2OutputSchema,
	videoRegenerate: VideoGenerateV2OutputSchema,
	videoTemplateGenerate: VideoTemplateGenerateOutputSchema,
	videoTemplateQuery: VideoTemplateQueryOutputSchema,
	filesList: FilesListOutputSchema,
	filesRetrieve: FilesRetrieveOutputSchema,
	filesDelete: FilesDeleteOutputSchema,
	modelsList: ModelsListOutputSchema,
	modelsRetrieve: ModelsRetrieveOutputSchema,
	modelsListAnthropic: ModelsListAnthropicOutputSchema,
	modelsRetrieveAnthropic: ModelsRetrieveAnthropicOutputSchema,
} as const;
