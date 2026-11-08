import { z } from 'zod';

// Output schemas keep only ids as required and allow any extra field, so a
// field ElevenLabs adds or starts nulling never breaks a caller.

// ── Shared inputs ───────────────────────────────────────────────────────────

// unknown: a free-form JSON object the API defines and evolves; passed through as sent.
const JsonObjectSchema = z.record(z.string(), z.unknown());

const VoiceIdSchema = z
	.string()
	.min(1)
	.describe(
		'Voice id, for example FGY2WhTYpPnrIDTdsKH5. Find ids with voices.list.',
	);

const OutputFormatSchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'codec_samplerate_bitrate, for example mp3_22050_32 or mp3_44100_128 (the usual default). Higher quality formats may need a higher plan.',
	);

const EnableLoggingSchema = z
	.boolean()
	.optional()
	.describe(
		'false turns on zero retention (enterprise plans): no history item, so the audio can only come back in this result.',
	);

const VoiceSettingsSchema = z
	.object({
		stability: z.number().nullish(),
		similarity_boost: z.number().nullish(),
		style: z.number().nullish(),
		use_speaker_boost: z.boolean().nullish(),
		speed: z.number().nullish(),
	})
	.loose();

const PronunciationLocatorsSchema = z
	.array(
		z.object({
			pronunciation_dictionary_id: z.string(),
			version_id: z.string().nullish(),
		}),
	)
	.max(3)
	.optional();

/** For output that can be fetched again from its history item. */
const BinaryControlFields = {
	includeContent: z
		.boolean()
		.optional()
		.describe(
			'false leaves contentBase64 out of the result and returns its metadata only, which keeps a long clip out of an agent’s context. Read the audio later with history.getAudio. Default true.',
		),
	maxBytes: z
		.number()
		.int()
		.positive()
		.max(50 * 1024 * 1024)
		.optional()
		.describe(
			'Largest audio to carry in the result, in bytes. Over it, contentBase64 is left out and contentOmitted says so. Default 700000 (about 43 s of 128 kbps mp3), so the base64 fits the 1,000,000 byte cap on a script’s result on Corsair’s cloud. At most 50 MB.',
		),
};

const FileFields = {
	fileBase64: z
		.string()
		.min(1)
		.describe('The file, base64-encoded (at most 100 MB once decoded).'),
	fileName: z.string().min(1).optional(),
	contentType: z
		.string()
		.min(1)
		.optional()
		.describe('Media type of the file, for example audio/mpeg.'),
};

const FileFormatSchema = z
	.enum(['pcm_s16le_16', 'other'])
	.optional()
	.describe(
		'pcm_s16le_16 for raw 16-bit 16 kHz mono PCM, which is faster. Default other.',
	);

const PageSizeSchema = (max: number) =>
	z.number().int().min(1).max(max).optional();

// ── Shared outputs ──────────────────────────────────────────────────────────

const ResponseMetadataFields = {
	requestId: z
		.string()
		.optional()
		.describe(
			'The `request-id` header. Pass it as previousRequestIds for continuity between clips.',
		),
	traceId: z
		.string()
		.optional()
		.describe('The `x-trace-id` header; quote it to ElevenLabs support.'),
	characterCost: z
		.number()
		.optional()
		.describe(
			'Credits charged, from the `character-cost` header. Music and stem separation don’t send it; account.usageStats has their cost.',
		),
	historyItemId: z
		.string()
		.optional()
		.describe(
			'The history item holding this audio. Read it again with history.getAudio. Only speech operations have one.',
		),
};

const BinaryOutputSchema = z
	.object({
		contentBase64: z
			.string()
			.optional()
			.describe(
				'The output, base64-encoded. Missing when contentOmitted is set.',
			),
		contentType: z
			.string()
			.describe('Media type of the output, for example audio/mpeg.'),
		byteLength: z.number().describe('Size of the output in bytes.'),
		contentOmitted: z
			.enum(['not_requested', 'over_limit'])
			.optional()
			.describe(
				'Set when contentBase64 was left out: includeContent was false, or the output was over the limit.',
			),
		note: z
			.string()
			.optional()
			.describe('How to get output that was left out.'),
		songId: z
			.string()
			.optional()
			.describe('The `song-id` header, on generated music.'),
		...ResponseMetadataFields,
	})
	.loose();

const StatusOkSchema = z.object({ status: z.string().nullish() }).loose();

// ── Text to speech ──────────────────────────────────────────────────────────

const SpeechFields = {
	voiceId: VoiceIdSchema,
	text: z.string().min(1).describe('The text to speak.'),
	modelId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Model id from models.list, for example eleven_flash_v2_5 (fast and cheap) or eleven_multilingual_v2 (the default).',
		),
	languageCode: z.string().min(2).optional(),
	voiceSettings: VoiceSettingsSchema.optional().describe(
		'Overrides the voice’s stored settings for this call. Fields keep the API’s names.',
	),
	pronunciationDictionaryLocators: PronunciationLocatorsSchema,
	seed: z.number().int().optional(),
	previousText: z.string().optional(),
	nextText: z.string().optional(),
	previousRequestIds: z.array(z.string()).optional(),
	nextRequestIds: z.array(z.string()).optional(),
	applyTextNormalization: z.enum(['auto', 'on', 'off']).optional(),
	applyLanguageTextNormalization: z.boolean().optional(),
	outputFormat: OutputFormatSchema,
	enableLogging: EnableLoggingSchema,
	...BinaryControlFields,
};

const TextToSpeechConvertInputSchema = z.object(SpeechFields);
const TextToSpeechConvertWithTimestampsInputSchema = z.object(SpeechFields);

const AlignmentSchema = z
	.object({
		characters: z.array(z.string()).nullish(),
		character_start_times_seconds: z.array(z.number()).nullish(),
		character_end_times_seconds: z.array(z.number()).nullish(),
	})
	.loose();

const TextToSpeechConvertResponseSchema = BinaryOutputSchema;
const TextToSpeechConvertWithTimestampsResponseSchema =
	BinaryOutputSchema.extend({
		alignment: AlignmentSchema.nullish().describe(
			'When each character of the text starts and ends, in seconds.',
		),
		normalized_alignment: AlignmentSchema.nullish().describe(
			'The same for the text after normalization, which is what was spoken.',
		),
	});

// ── Text to dialogue ────────────────────────────────────────────────────────

const TextToDialogueConvertInputSchema = z.object({
	inputs: z
		.array(
			z.object({
				text: z.string().min(1),
				voiceId: VoiceIdSchema,
			}),
		)
		.min(1)
		.describe('The lines in order, each with the voice that speaks it.'),
	modelId: z
		.string()
		.min(1)
		.optional()
		.describe('Model id. Default eleven_v3.'),
	languageCode: z.string().min(2).optional(),
	settings: JsonObjectSchema.optional().describe(
		'Dialogue settings (stability and so on), with the API’s field names.',
	),
	seed: z.number().int().optional(),
	previousText: z.string().optional(),
	futureText: z.string().optional(),
	pronunciationDictionaryLocators: PronunciationLocatorsSchema,
	applyTextNormalization: z.enum(['auto', 'on', 'off']).optional(),
	outputFormat: OutputFormatSchema,
	enableLogging: EnableLoggingSchema,
	...BinaryControlFields,
});
const TextToDialogueConvertResponseSchema = BinaryOutputSchema;

// ── Speech to text ──────────────────────────────────────────────────────────

const TranscriptionFields = {
	language_code: z.string().nullish(),
	language_probability: z.number().nullish(),
	text: z.string().nullish(),
	// unknown: word entries carry timing and speaker fields that differ by request options.
	words: z.array(z.record(z.string(), z.unknown())).nullish(),
	transcription_id: z.string().nullish(),
	audio_duration_secs: z.number().nullish(),
};

const SpeechToTextConvertInputSchema = z
	.object({
		fileBase64: FileFields.fileBase64.optional(),
		fileName: FileFields.fileName,
		contentType: FileFields.contentType,
		sourceUrl: z
			.url()
			.optional()
			.describe(
				'URL of the audio or video to transcribe, instead of fileBase64: a hosted file or a page ElevenLabs can read, such as YouTube.',
			),
		modelId: z
			.string()
			.min(1)
			.optional()
			.describe('Model id. Default scribe_v2.'),
		languageCode: z.string().min(2).optional(),
		tagAudioEvents: z.boolean().optional(),
		numSpeakers: z.number().int().positive().optional(),
		timestampsGranularity: z.enum(['none', 'word', 'character']).optional(),
		diarize: z.boolean().optional(),
		keyterms: z.array(z.string()).optional(),
		temperature: z.number().optional(),
		seed: z.number().int().optional(),
		fileFormat: FileFormatSchema,
		useMultiChannel: z.boolean().optional(),
		webhook: z
			.boolean()
			.optional()
			.describe(
				'true returns at once with request_id and transcription_id, and delivers the transcript to the workspace’s speech-to-text webhooks (the speechToText.transcriptionCompleted event). Needs a webhook set up in ElevenLabs.',
			),
		webhookId: z
			.string()
			.min(1)
			.optional()
			.describe('Send to this webhook only. Needs webhook: true.'),
		webhookMetadata: JsonObjectSchema.optional().describe(
			'Sent back as webhook_metadata in the webhook event. Needs webhook: true.',
		),
		enableLogging: EnableLoggingSchema,
	})
	.refine((input) => Boolean(input.fileBase64) !== Boolean(input.sourceUrl), {
		message: 'Pass exactly one of fileBase64 or sourceUrl.',
	});

const SpeechToTextConvertResponseSchema = z
	.object({
		...TranscriptionFields,
		transcripts: z
			.array(z.object(TranscriptionFields).loose())
			.nullish()
			.describe('One transcript per channel, when useMultiChannel is on.'),
		message: z.string().nullish().describe('Set in webhook mode.'),
		request_id: z.string().nullish().describe('Set in webhook mode.'),
	})
	.loose();

const SpeechToTextTranscriptIdInputSchema = z.object({
	transcriptionId: z
		.string()
		.min(1)
		.describe('The transcription_id that speechToText.convert returned.'),
});
const SpeechToTextGetTranscriptResponseSchema = z
	.object({
		...TranscriptionFields,
		transcripts: z.array(z.object(TranscriptionFields).loose()).nullish(),
	})
	.loose();

// ── Forced alignment ────────────────────────────────────────────────────────

const ForcedAlignmentCreateInputSchema = z.object({
	...FileFields,
	text: z.string().min(1).describe('The text spoken in the audio.'),
});

const TimedTextSchema = z
	.object({
		text: z.string().nullish(),
		start: z.number().nullish(),
		end: z.number().nullish(),
	})
	.loose();

const ForcedAlignmentCreateResponseSchema = z
	.object({
		characters: z.array(TimedTextSchema).nullish(),
		words: z.array(TimedTextSchema).nullish(),
		loss: z.number().nullish(),
	})
	.loose();

// ── Sound effects, music, isolation, voice changer ──────────────────────────

const SoundEffectsGenerateInputSchema = z.object({
	text: z.string().min(1).describe('What the sound should be.'),
	durationSeconds: z
		.number()
		.min(0.5)
		.max(30)
		.optional()
		.describe('0.5 to 30 s. Left out, the model picks a length.'),
	loop: z.boolean().optional(),
	promptInfluence: z.number().min(0).max(1).optional(),
	modelId: z
		.string()
		.min(1)
		.optional()
		.describe('Model id. Default eleven_text_to_sound_v3.'),
	outputFormat: OutputFormatSchema,
});
const SoundEffectsGenerateResponseSchema = BinaryOutputSchema;

const MusicComposeInputSchema = z
	.object({
		prompt: z.string().min(1).optional().describe('What the song should be.'),
		compositionPlan: JsonObjectSchema.optional().describe(
			'A plan from music.plan, instead of prompt.',
		),
		musicLengthMs: z
			.number()
			.int()
			.min(3000)
			.max(600000)
			.optional()
			.describe('3 s to 10 min. Only with prompt.'),
		lyricsText: z.string().optional(),
		generationMode: z
			.enum(['track', 'loop', 'ambience', 'video_to_music'])
			.optional(),
		modelId: z
			.string()
			.min(1)
			.optional()
			.describe('Model id. Default music_v2_5.'),
		seed: z.number().int().optional(),
		forceInstrumental: z.boolean().optional(),
		outputFormat: OutputFormatSchema,
	})
	.refine((input) => Boolean(input.prompt) !== Boolean(input.compositionPlan), {
		message: 'Pass exactly one of prompt or compositionPlan.',
	})
	.refine((input) => !(input.compositionPlan && input.musicLengthMs), {
		message:
			'musicLengthMs only works with prompt; a compositionPlan sets its own length.',
		path: ['musicLengthMs'],
	});
const MusicComposeResponseSchema = BinaryOutputSchema;

const MusicPlanInputSchema = z.object({
	prompt: z.string().min(1).describe('What the song should be.'),
	musicLengthMs: z.number().int().min(3000).max(600000).optional(),
	sourceCompositionPlan: JsonObjectSchema.optional(),
	modelId: z
		.string()
		.min(1)
		.optional()
		.describe('Model id. Default music_v2_5.'),
});
const MusicPlanResponseSchema = z
	.object({
		// unknown: the plan's parts hold styles, lines and durations the API evolves, and music.compose takes them back as they are. The API's schema allows chunks or sections; music_v2_5 answered with chunks when tested.
		chunks: z.array(z.record(z.string(), z.unknown())).nullish(),
		sections: z.array(z.record(z.string(), z.unknown())).nullish(),
		positive_global_styles: z.array(z.string()).nullish(),
		negative_global_styles: z.array(z.string()).nullish(),
	})
	.loose();

const MusicSeparateStemsInputSchema = z.object({
	...FileFields,
	stemVariationId: z
		.enum(['two_stems_v1', 'six_stems_v1'])
		.optional()
		.describe('Two stems (vocals, rest) or six. Default six_stems_v1.'),
	outputFormat: OutputFormatSchema,
});
const MusicSeparateStemsResponseSchema = BinaryOutputSchema;

const AudioIsolationIsolateInputSchema = z.object({
	...FileFields,
	fileFormat: FileFormatSchema,
});
const AudioIsolationIsolateResponseSchema = BinaryOutputSchema;

const VoiceChangerConvertInputSchema = z.object({
	voiceId: VoiceIdSchema,
	...FileFields,
	modelId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Model id, for example eleven_multilingual_sts_v2. Default eleven_english_sts_v2.',
		),
	voiceSettings: VoiceSettingsSchema.optional(),
	seed: z.number().int().optional(),
	removeBackgroundNoise: z.boolean().optional(),
	fileFormat: FileFormatSchema,
	outputFormat: OutputFormatSchema,
	enableLogging: EnableLoggingSchema,
	...BinaryControlFields,
});
const VoiceChangerConvertResponseSchema = BinaryOutputSchema;

// ── Voices ──────────────────────────────────────────────────────────────────

const VoiceSchema = z
	.object({
		voice_id: z.string(),
		name: z.string().nullish(),
		category: z.string().nullish(),
		description: z.string().nullish(),
		// unknown: labels are provider-defined key/value metadata (accent, age, gender...).
		labels: z.record(z.string(), z.unknown()).nullish(),
		preview_url: z.string().nullish(),
		settings: VoiceSettingsSchema.nullish(),
		is_owner: z.boolean().nullish(),
		created_at_unix: z.number().nullish(),
	})
	.loose();

const VoicesListInputSchema = z.object({
	nextPageToken: z
		.string()
		.min(1)
		.optional()
		.describe('next_page_token from the previous page.'),
	pageSize: PageSizeSchema(100).describe('1 to 100. Default 10.'),
	search: z.string().optional(),
	sort: z.enum(['created_at_unix', 'name']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
	voiceType: z
		.string()
		.optional()
		.describe('personal, community, default, workspace, non-default or saved.'),
	category: z
		.string()
		.optional()
		.describe('premade, cloned, generated or professional.'),
	voiceIds: z.array(z.string()).max(100).optional(),
});
const VoicesListResponseSchema = z
	.object({
		voices: z.array(VoiceSchema),
		has_more: z.boolean().nullish(),
		total_count: z.number().nullish(),
		next_page_token: z.string().nullish(),
	})
	.loose();

const VoiceIdInputSchema = z.object({ voiceId: VoiceIdSchema });
const VoicesGetResponseSchema = VoiceSchema;

const VoicesSearchLibraryInputSchema = z.object({
	search: z.string().optional(),
	page: z.number().int().min(0).optional().describe('Page number from 0.'),
	pageSize: PageSizeSchema(100).describe('1 to 100. Default 30.'),
	category: z.string().optional(),
	gender: z.string().optional(),
	age: z.string().optional(),
	accent: z.string().optional(),
	language: z.string().optional(),
	locale: z.string().optional(),
	useCases: z.array(z.string()).optional(),
	descriptives: z.array(z.string()).optional(),
	featured: z.boolean().optional(),
	sort: z
		.enum([
			'created_date',
			'usage_character_count_1y',
			'trending',
			'cloned_by_count',
		])
		.optional(),
});
const SharedVoiceSchema = z
	.object({
		public_owner_id: z.string().nullish(),
		voice_id: z.string(),
		name: z.string().nullish(),
		accent: z.string().nullish(),
		gender: z.string().nullish(),
		age: z.string().nullish(),
		category: z.string().nullish(),
		language: z.string().nullish(),
		description: z.string().nullish(),
		preview_url: z.string().nullish(),
	})
	.loose();
const VoicesSearchLibraryResponseSchema = z
	.object({
		voices: z.array(SharedVoiceSchema),
		has_more: z.boolean().nullish(),
		total_count: z.number().nullish(),
	})
	.loose();

const VoicesAddFromLibraryInputSchema = z.object({
	publicUserId: z
		.string()
		.min(1)
		.describe('public_owner_id from voices.searchLibrary.'),
	voiceId: VoiceIdSchema,
	newName: z.string().min(1).describe('The name it gets in your voices.'),
});
const VoicesAddFromLibraryResponseSchema = z
	.object({ voice_id: z.string() })
	.loose();

const VoicesEditInputSchema = z.object({
	voiceId: VoiceIdSchema,
	name: z.string().min(1).describe('The voice’s name; the API requires it.'),
	description: z.string().optional(),
	labels: z.record(z.string(), z.string()).optional(),
});
const VoicesEditResponseSchema = StatusOkSchema;

const VoicesDeleteResponseSchema = StatusOkSchema;

const VoicesSettingsResponseSchema = VoiceSettingsSchema;

const VoicesEditSettingsInputSchema = z.object({
	voiceId: VoiceIdSchema,
	settings: VoiceSettingsSchema.describe(
		'The settings to store, with the API’s field names.',
	),
});
const VoicesEditSettingsResponseSchema = StatusOkSchema;

const VoicesDefaultSettingsInputSchema = z.object({});

// ── Voice design ────────────────────────────────────────────────────────────

const VoicePreviewSchema = z
	.object({
		generated_voice_id: z
			.string()
			.describe(
				'Pass it to voiceDesign.getPreview to hear the preview, or voiceDesign.create to save it.',
			),
		media_type: z.string().nullish(),
		duration_secs: z.number().nullish(),
		language: z.string().nullish(),
	})
	.loose();

const VoicePreviewsResponseSchema = z
	.object({
		previews: z.array(VoicePreviewSchema),
		text: z.string().nullish(),
		note: z.string().optional(),
	})
	.loose();

const PreviewFields = {
	text: z
		.string()
		.min(100)
		.max(1000)
		.optional()
		.describe(
			'What the previews say, 100 to 1000 characters. Or set autoGenerateText.',
		),
	autoGenerateText: z.boolean().optional(),
	loudness: z.number().min(-1).max(1).optional(),
	seed: z.number().int().optional(),
	guidanceScale: z.number().optional(),
	outputFormat: OutputFormatSchema.describe(
		'The format voiceDesign.getPreview will return, for example mp3_22050_32.',
	),
};

const VoiceDesignDesignInputSchema = z.object({
	voiceDescription: z
		.string()
		.min(20)
		.max(1000)
		.describe('What the voice sounds like, 20 to 1000 characters.'),
	modelId: z
		.string()
		.min(1)
		.optional()
		.describe('eleven_multilingual_ttv_v2 (default) or eleven_ttv_v3.'),
	shouldEnhance: z.boolean().optional(),
	...PreviewFields,
});
const VoiceDesignDesignResponseSchema = VoicePreviewsResponseSchema;

const VoiceDesignGetPreviewInputSchema = z.object({
	generatedVoiceId: z
		.string()
		.min(1)
		.describe(
			'generated_voice_id from a preview of voiceDesign.design or voiceDesign.remix.',
		),
	includeContent: BinaryControlFields.includeContent.describe(
		'false returns the size and type only. Default true.',
	),
	maxBytes: BinaryControlFields.maxBytes,
});
const VoiceDesignGetPreviewResponseSchema = BinaryOutputSchema;

const VoiceDesignCreateInputSchema = z.object({
	voiceName: z.string().min(1),
	voiceDescription: z.string().min(20).max(1000),
	generatedVoiceId: z
		.string()
		.min(1)
		.describe(
			'generated_voice_id from a preview of voiceDesign.design or voiceDesign.remix.',
		),
	labels: z.record(z.string(), z.string()).optional(),
});
const VoiceDesignCreateResponseSchema = VoiceSchema;

const VoiceDesignRemixInputSchema = z.object({
	voiceId: VoiceIdSchema,
	voiceDescription: z
		.string()
		.min(5)
		.max(1000)
		.describe('The changes to make to the voice.'),
	promptStrength: z.number().min(0).max(1).optional(),
	...PreviewFields,
});
const VoiceDesignRemixResponseSchema = VoicePreviewsResponseSchema;

// ── Dubbing ─────────────────────────────────────────────────────────────────

/**
 * Where a dub stands. `queued` and `preparing` come from the API's filter list,
 * `dubbing`, `dubbed` and `failed` were seen live. jobs.test.ts keeps the job
 * declaration in step with this list.
 */
export const DUBBING_STATES = [
	'queued',
	'preparing',
	'dubbing',
	'dubbed',
	'failed',
] as const;

const DubbingCreateInputSchema = z
	.object({
		fileBase64: FileFields.fileBase64.optional(),
		fileName: FileFields.fileName,
		contentType: FileFields.contentType,
		sourceUrl: z
			.url()
			.optional()
			.describe('URL of the video or audio, instead of fileBase64.'),
		targetLang: z
			.string()
			.min(2)
			.describe('Language to dub into, as an ISO 639 code.'),
		sourceLang: z.string().min(2).optional().describe('Default auto.'),
		name: z.string().optional(),
		numSpeakers: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('0 (default) detects them.'),
		watermark: z.boolean().optional(),
		startTime: z.number().int().min(0).optional(),
		endTime: z.number().int().min(0).optional(),
		highestResolution: z.boolean().optional(),
		dropBackgroundAudio: z.boolean().optional(),
		useProfanityFilter: z.boolean().optional(),
		disableVoiceCloning: z
			.boolean()
			.optional()
			.describe(
				'true uses a similar voice from the library instead of cloning the speakers in the source.',
			),
	})
	.refine((input) => Boolean(input.fileBase64) !== Boolean(input.sourceUrl), {
		message: 'Pass exactly one of fileBase64 or sourceUrl.',
	});
const DubbingCreateResponseSchema = z
	.object({
		dubbing_id: z.string(),
		expected_duration_sec: z.number().nullish(),
	})
	.loose();

const DubbingIdSchema = z
	.string()
	.min(1)
	.describe('The dubbing_id that dubbing.create returned.');

const DubbingIdInputSchema = z.object({ dubbingId: DubbingIdSchema });

const DubSchema = z
	.object({
		dubbing_id: z.string(),
		name: z.string().nullish(),
		status: z
			.string()
			.describe(`Where the dub stands: ${DUBBING_STATES.join(', ')}.`),
		source_language: z.string().nullish(),
		target_languages: z.array(z.string()).nullish(),
		editable: z.boolean().nullish(),
		created_at: z.string().nullish(),
		// unknown: content type and duration, with more fields as the API adds them.
		media_metadata: z.record(z.string(), z.unknown()).nullish(),
		error: z.string().nullish(),
	})
	.loose();
const DubbingGetResponseSchema = DubSchema;

const DubbingListInputSchema = z.object({
	cursor: z.string().min(1).optional(),
	pageSize: PageSizeSchema(200).describe('1 to 200. Default 100.'),
	dubbingStatus: z.enum(['dubbing', 'dubbed', 'failed']).optional(),
	filterByCreator: z.enum(['personal', 'others', 'all']).optional(),
	orderBy: z.enum(['created_at', 'name']).optional(),
	orderDirection: z.enum(['DESCENDING', 'ASCENDING']).optional(),
});
const DubbingListResponseSchema = z
	.object({
		dubs: z.array(DubSchema),
		next_cursor: z.string().nullish(),
		has_more: z.boolean().nullish(),
	})
	.loose();

const DubbingDeleteResponseSchema = StatusOkSchema;

const DubbingLanguageFields = {
	dubbingId: DubbingIdSchema,
	languageCode: z
		.string()
		.min(1)
		.describe('A target language of the dub; for transcripts also `source`.'),
};

const DubbingGetAudioInputSchema = z.object({
	...DubbingLanguageFields,
	includeContent: BinaryControlFields.includeContent.describe(
		'false returns the size and type only. Default true.',
	),
	maxBytes: BinaryControlFields.maxBytes,
});
const DubbingGetAudioResponseSchema = BinaryOutputSchema;

const DubbingGetTranscriptInputSchema = z.object({
	...DubbingLanguageFields,
	formatType: z
		.enum(['srt', 'webvtt', 'json'])
		.optional()
		.describe('Default srt.'),
});
const DubbingGetTranscriptResponseSchema = z
	.object({
		transcript_format: z.string().nullish(),
		srt: z.string().nullish(),
		webvtt: z.string().nullish(),
		json: JsonObjectSchema.nullish(),
	})
	.loose();

// ── History ─────────────────────────────────────────────────────────────────

const HistoryItemSchema = z
	.object({
		history_item_id: z.string(),
		request_id: z.string().nullish(),
		voice_id: z.string().nullish(),
		model_id: z.string().nullish(),
		voice_name: z.string().nullish(),
		voice_category: z.string().nullish(),
		text: z.string().nullish(),
		date_unix: z.number().nullish(),
		character_count_change_from: z.number().nullish(),
		character_count_change_to: z.number().nullish(),
		content_type: z.string().nullish(),
		state: z.string().nullish(),
		source: z.string().nullish(),
		output_format: z.string().nullish(),
	})
	.loose();

const HistoryListInputSchema = z.object({
	pageSize: PageSizeSchema(1000).describe(
		'1 to 1000. Default 100. Deleted items count, so a page can be short or empty while has_more is true.',
	),
	startAfterHistoryItemId: z
		.string()
		.min(1)
		.optional()
		.describe('last_history_item_id from the previous page.'),
	voiceId: z.string().min(1).optional(),
	modelId: z.string().min(1).optional(),
	dateBeforeUnix: z.number().int().optional(),
	dateAfterUnix: z.number().int().optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
	search: z.string().optional(),
	source: z.enum(['TTS', 'STS', 'Flows']).optional(),
});
const HistoryListResponseSchema = z
	.object({
		history: z.array(HistoryItemSchema),
		last_history_item_id: z.string().nullish(),
		has_more: z.boolean().nullish(),
		scanned_until: z.number().nullish(),
	})
	.loose();

const HistoryItemIdInputSchema = z.object({
	historyItemId: z
		.string()
		.min(1)
		.describe(
			'historyItemId from a speech operation, or history_item_id from history.list.',
		),
});
const HistoryGetResponseSchema = HistoryItemSchema;

const HistoryGetAudioInputSchema = z.object({
	historyItemId: HistoryItemIdInputSchema.shape.historyItemId,
	includeContent: BinaryControlFields.includeContent.describe(
		'false returns the size and type only. Default true.',
	),
	maxBytes: BinaryControlFields.maxBytes,
});
const HistoryGetAudioResponseSchema = BinaryOutputSchema;

const HistoryDeleteResponseSchema = StatusOkSchema;

// ── Models ──────────────────────────────────────────────────────────────────

const ModelsListInputSchema = z.object({});
const ModelsListResponseSchema = z
	.object({
		models: z.array(
			z
				.object({
					model_id: z.string(),
					name: z.string().nullish(),
					description: z.string().nullish(),
					can_do_text_to_speech: z.boolean().nullish(),
					can_do_voice_conversion: z.boolean().nullish(),
					maximum_text_length_per_request: z.number().nullish(),
					// unknown: each language entry is provider metadata the plugin only passes on.
					languages: z.array(z.record(z.string(), z.unknown())).nullish(),
					model_rates: JsonObjectSchema.nullish(),
				})
				.loose(),
		),
	})
	.loose();

// ── Account ─────────────────────────────────────────────────────────────────

const SubscriptionSchema = z
	.object({
		tier: z.string().nullish(),
		status: z.string().nullish(),
		character_count: z.number().nullish(),
		character_limit: z.number().nullish(),
		voice_slots_used: z.number().nullish(),
		voice_limit: z.number().nullish(),
		can_use_instant_voice_cloning: z.boolean().nullish(),
		can_use_professional_voice_cloning: z.boolean().nullish(),
		currency: z.string().nullish(),
		next_character_count_reset_unix: z.number().nullish(),
	})
	.loose();

const AccountUserInputSchema = z.object({});
const AccountUserResponseSchema = z
	.object({
		user_id: z.string().nullish(),
		workspace_id: z.string().nullish(),
		subscription: SubscriptionSchema.nullish(),
		first_name: z.string().nullish(),
		created_at: z.number().nullish(),
		seat_type: z.string().nullish(),
	})
	.loose();

const AccountSubscriptionInputSchema = z.object({});
const AccountSubscriptionResponseSchema = SubscriptionSchema;

const AccountUsageStatsInputSchema = z.object({
	startTime: z
		.number()
		.int()
		.describe('Start of the range, Unix time in milliseconds.'),
	endTime: z
		.number()
		.int()
		.describe('End of the range, Unix time in milliseconds.'),
	intervalSeconds: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Bucket size: 3600 hourly, 86400 daily. Default 86400.'),
	groupBy: z
		.array(z.string())
		.optional()
		.describe('Columns to split by, for example product_type or model.'),
	timeZone: z
		.string()
		.optional()
		.describe('IANA time zone for the buckets, for example Asia/Kolkata.'),
});
const AccountUsageStatsResponseSchema = z
	.object({
		columns: z.array(z.string()).nullish(),
		column_types: z.array(z.string()).nullish(),
		column_units: z.array(z.string().nullable()).nullish(),
		// unknown: each row holds one value per column, of the type column_types names.
		rows: z.array(z.array(z.unknown())).nullish(),
	})
	.loose();

// ── Agents ──────────────────────────────────────────────────────────────────

const AgentIdSchema = z
	.string()
	.min(1)
	.describe('Agent id, for example agent_3701k3ttaq12ewp8b7qv5rfyszkz.');

const AgentSchema = z
	.object({
		agent_id: z.string(),
		name: z.string().nullish(),
		conversation_config: JsonObjectSchema.nullish(),
		platform_settings: JsonObjectSchema.nullish(),
		workflow: JsonObjectSchema.nullish(),
		metadata: JsonObjectSchema.nullish(),
		tags: z.array(z.string()).nullish(),
		version_id: z.string().nullish(),
		branch_id: z.string().nullish(),
	})
	.loose();

const AgentsListInputSchema = z.object({
	cursor: z.string().min(1).optional(),
	pageSize: PageSizeSchema(100).describe('1 to 100. Default 30.'),
	search: z.string().optional(),
	archived: z.boolean().optional(),
	showOnlyOwnedAgents: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	sortBy: z
		.enum(['name', 'created_at', 'updated_at', 'call_count_7d'])
		.optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
});
const AgentsListResponseSchema = z
	.object({
		agents: z.array(
			z
				.object({
					agent_id: z.string(),
					name: z.string().nullish(),
					tags: z.array(z.string()).nullish(),
					created_at_unix_secs: z.number().nullish(),
					updated_at_unix_secs: z.number().nullish(),
					archived: z.boolean().nullish(),
				})
				.loose(),
		),
		next_cursor: z.string().nullish(),
		has_more: z.boolean().nullish(),
	})
	.loose();

const AgentIdInputSchema = z.object({ agentId: AgentIdSchema });
const AgentsGetInputSchema = z.object({
	agentId: AgentIdSchema,
	versionId: z.string().min(1).optional(),
	branchId: z.string().min(1).optional(),
});
const AgentsGetResponseSchema = AgentSchema;

const AgentsCreateInputSchema = z.object({
	conversationConfig: JsonObjectSchema.describe(
		'The agent’s configuration with the API’s field names, for example { agent: { first_message: "Hi", prompt: { prompt: "You are..." } }, tts: { voice_id: "..." } }.',
	),
	platformSettings: JsonObjectSchema.optional(),
	workflow: JsonObjectSchema.optional(),
	name: z.string().optional(),
	tags: z.array(z.string()).optional(),
});
const AgentsCreateResponseSchema = z.object({ agent_id: z.string() }).loose();

const AgentsUpdateInputSchema = z.object({
	agentId: AgentIdSchema,
	conversationConfig: JsonObjectSchema.optional(),
	platformSettings: JsonObjectSchema.optional(),
	workflow: JsonObjectSchema.optional(),
	name: z.string().optional(),
	tags: z.array(z.string()).optional(),
	versionDescription: z.string().optional(),
	branchId: z.string().min(1).optional(),
});
const AgentsUpdateResponseSchema = AgentSchema;

const AgentsDeleteInputSchema = z.object({
	agentId: AgentIdSchema,
	force: z
		.boolean()
		.optional()
		.describe('Delete even if other agents use this one as a subagent.'),
});
const AgentsDeleteResponseSchema = z.object({}).loose();

const AgentsConversationsListInputSchema = z.object({
	cursor: z.string().min(1).optional(),
	pageSize: PageSizeSchema(100).describe('1 to 100. Default 30.'),
	agentId: z.string().min(1).optional(),
	search: z.string().optional(),
	summaryMode: z.enum(['exclude', 'include']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
});
const AgentsConversationsListResponseSchema = z
	.object({
		conversations: z.array(
			z
				.object({
					conversation_id: z.string(),
					agent_id: z.string().nullish(),
					agent_name: z.string().nullish(),
					status: z.string().nullish(),
					start_time_unix_secs: z.number().nullish(),
					call_duration_secs: z.number().nullish(),
					message_count: z.number().nullish(),
				})
				.loose(),
		),
		next_cursor: z.string().nullish(),
		has_more: z.boolean().nullish(),
	})
	.loose();

const ConversationIdInputSchema = z.object({
	conversationId: z
		.string()
		.min(1)
		.describe('conversation_id from agents.conversationsList.'),
});
const AgentsConversationGetResponseSchema = z
	.object({
		conversation_id: z.string(),
		agent_id: z.string().nullish(),
		status: z.string().nullish(),
		// unknown: transcript turns carry tool calls and metrics that differ by agent.
		transcript: z.array(z.record(z.string(), z.unknown())).nullish(),
		metadata: JsonObjectSchema.nullish(),
		analysis: JsonObjectSchema.nullish(),
		has_audio: z.boolean().nullish(),
	})
	.loose();
const AgentsConversationDeleteResponseSchema = z.object({}).loose();

const AgentsSignedUrlInputSchema = z.object({
	agentId: AgentIdSchema,
	includeConversationId: z.boolean().optional(),
	branchId: z.string().min(1).optional(),
});
const AgentsSignedUrlResponseSchema = z
	.object({
		signed_url: z
			.string()
			.describe(
				'WebSocket URL a client can open to talk to the agent. Valid about 15 minutes; treat it as a secret.',
			),
	})
	.loose();

// ── Single-use tokens ───────────────────────────────────────────────────────

const SingleUseTokensCreateInputSchema = z.object({
	tokenType: z.enum(['realtime_scribe', 'batch_scribe', 'tts_websocket']),
});
const SingleUseTokensCreateResponseSchema = z
	.object({
		token: z
			.string()
			.describe(
				'Expires after 15 minutes and works once. Hand it to a client instead of the API key.',
			),
	})
	.loose();

// ── Exported types ──────────────────────────────────────────────────────────

export type TextToSpeechConvertInput = z.infer<
	typeof TextToSpeechConvertInputSchema
>;
export type TextToSpeechConvertResponse = z.infer<
	typeof TextToSpeechConvertResponseSchema
>;
export type TextToSpeechConvertWithTimestampsInput = z.infer<
	typeof TextToSpeechConvertWithTimestampsInputSchema
>;
export type TextToSpeechConvertWithTimestampsResponse = z.infer<
	typeof TextToSpeechConvertWithTimestampsResponseSchema
>;
export type TextToDialogueConvertInput = z.infer<
	typeof TextToDialogueConvertInputSchema
>;
export type TextToDialogueConvertResponse = z.infer<
	typeof TextToDialogueConvertResponseSchema
>;
export type SpeechToTextConvertInput = z.infer<
	typeof SpeechToTextConvertInputSchema
>;
export type SpeechToTextConvertResponse = z.infer<
	typeof SpeechToTextConvertResponseSchema
>;
export type SpeechToTextGetTranscriptInput = z.infer<
	typeof SpeechToTextTranscriptIdInputSchema
>;
export type SpeechToTextGetTranscriptResponse = z.infer<
	typeof SpeechToTextGetTranscriptResponseSchema
>;
export type SpeechToTextDeleteTranscriptInput = z.infer<
	typeof SpeechToTextTranscriptIdInputSchema
>;
export type SpeechToTextDeleteTranscriptResponse = z.infer<
	typeof StatusOkSchema
>;
export type ForcedAlignmentCreateInput = z.infer<
	typeof ForcedAlignmentCreateInputSchema
>;
export type ForcedAlignmentCreateResponse = z.infer<
	typeof ForcedAlignmentCreateResponseSchema
>;
export type SoundEffectsGenerateInput = z.infer<
	typeof SoundEffectsGenerateInputSchema
>;
export type SoundEffectsGenerateResponse = z.infer<
	typeof SoundEffectsGenerateResponseSchema
>;
export type MusicComposeInput = z.infer<typeof MusicComposeInputSchema>;
export type MusicComposeResponse = z.infer<typeof MusicComposeResponseSchema>;
export type MusicPlanInput = z.infer<typeof MusicPlanInputSchema>;
export type MusicPlanResponse = z.infer<typeof MusicPlanResponseSchema>;
export type MusicSeparateStemsInput = z.infer<
	typeof MusicSeparateStemsInputSchema
>;
export type MusicSeparateStemsResponse = z.infer<
	typeof MusicSeparateStemsResponseSchema
>;
export type AudioIsolationIsolateInput = z.infer<
	typeof AudioIsolationIsolateInputSchema
>;
export type AudioIsolationIsolateResponse = z.infer<
	typeof AudioIsolationIsolateResponseSchema
>;
export type VoiceChangerConvertInput = z.infer<
	typeof VoiceChangerConvertInputSchema
>;
export type VoiceChangerConvertResponse = z.infer<
	typeof VoiceChangerConvertResponseSchema
>;
export type VoicesListInput = z.infer<typeof VoicesListInputSchema>;
export type VoicesListResponse = z.infer<typeof VoicesListResponseSchema>;
export type VoicesGetInput = z.infer<typeof VoiceIdInputSchema>;
export type VoicesGetResponse = z.infer<typeof VoicesGetResponseSchema>;
export type VoicesSearchLibraryInput = z.infer<
	typeof VoicesSearchLibraryInputSchema
>;
export type VoicesSearchLibraryResponse = z.infer<
	typeof VoicesSearchLibraryResponseSchema
>;
export type VoicesAddFromLibraryInput = z.infer<
	typeof VoicesAddFromLibraryInputSchema
>;
export type VoicesAddFromLibraryResponse = z.infer<
	typeof VoicesAddFromLibraryResponseSchema
>;
export type VoicesEditInput = z.infer<typeof VoicesEditInputSchema>;
export type VoicesEditResponse = z.infer<typeof VoicesEditResponseSchema>;
export type VoicesDeleteInput = z.infer<typeof VoiceIdInputSchema>;
export type VoicesDeleteResponse = z.infer<typeof VoicesDeleteResponseSchema>;
export type VoicesGetSettingsInput = z.infer<typeof VoiceIdInputSchema>;
export type VoicesGetSettingsResponse = z.infer<
	typeof VoicesSettingsResponseSchema
>;
export type VoicesEditSettingsInput = z.infer<
	typeof VoicesEditSettingsInputSchema
>;
export type VoicesEditSettingsResponse = z.infer<
	typeof VoicesEditSettingsResponseSchema
>;
export type VoicesDefaultSettingsInput = z.infer<
	typeof VoicesDefaultSettingsInputSchema
>;
export type VoicesDefaultSettingsResponse = z.infer<
	typeof VoicesSettingsResponseSchema
>;
export type VoiceDesignDesignInput = z.infer<
	typeof VoiceDesignDesignInputSchema
>;
export type VoiceDesignDesignResponse = z.infer<
	typeof VoiceDesignDesignResponseSchema
>;
export type VoiceDesignGetPreviewInput = z.infer<
	typeof VoiceDesignGetPreviewInputSchema
>;
export type VoiceDesignGetPreviewResponse = z.infer<
	typeof VoiceDesignGetPreviewResponseSchema
>;
export type VoiceDesignCreateInput = z.infer<
	typeof VoiceDesignCreateInputSchema
>;
export type VoiceDesignCreateResponse = z.infer<
	typeof VoiceDesignCreateResponseSchema
>;
export type VoiceDesignRemixInput = z.infer<typeof VoiceDesignRemixInputSchema>;
export type VoiceDesignRemixResponse = z.infer<
	typeof VoiceDesignRemixResponseSchema
>;
export type DubbingCreateInput = z.infer<typeof DubbingCreateInputSchema>;
export type DubbingCreateResponse = z.infer<typeof DubbingCreateResponseSchema>;
export type DubbingGetInput = z.infer<typeof DubbingIdInputSchema>;
export type DubbingGetResponse = z.infer<typeof DubbingGetResponseSchema>;
export type DubbingListInput = z.infer<typeof DubbingListInputSchema>;
export type DubbingListResponse = z.infer<typeof DubbingListResponseSchema>;
export type DubbingDeleteInput = z.infer<typeof DubbingIdInputSchema>;
export type DubbingDeleteResponse = z.infer<typeof DubbingDeleteResponseSchema>;
export type DubbingGetAudioInput = z.infer<typeof DubbingGetAudioInputSchema>;
export type DubbingGetAudioResponse = z.infer<
	typeof DubbingGetAudioResponseSchema
>;
export type DubbingGetTranscriptInput = z.infer<
	typeof DubbingGetTranscriptInputSchema
>;
export type DubbingGetTranscriptResponse = z.infer<
	typeof DubbingGetTranscriptResponseSchema
>;
export type HistoryListInput = z.infer<typeof HistoryListInputSchema>;
export type HistoryListResponse = z.infer<typeof HistoryListResponseSchema>;
export type HistoryGetInput = z.infer<typeof HistoryItemIdInputSchema>;
export type HistoryGetResponse = z.infer<typeof HistoryGetResponseSchema>;
export type HistoryGetAudioInput = z.infer<typeof HistoryGetAudioInputSchema>;
export type HistoryGetAudioResponse = z.infer<
	typeof HistoryGetAudioResponseSchema
>;
export type HistoryDeleteInput = z.infer<typeof HistoryItemIdInputSchema>;
export type HistoryDeleteResponse = z.infer<typeof HistoryDeleteResponseSchema>;
export type ModelsListInput = z.infer<typeof ModelsListInputSchema>;
export type ModelsListResponse = z.infer<typeof ModelsListResponseSchema>;
export type AccountUserInput = z.infer<typeof AccountUserInputSchema>;
export type AccountUserResponse = z.infer<typeof AccountUserResponseSchema>;
export type AccountSubscriptionInput = z.infer<
	typeof AccountSubscriptionInputSchema
>;
export type AccountSubscriptionResponse = z.infer<
	typeof AccountSubscriptionResponseSchema
>;
export type AccountUsageStatsInput = z.infer<
	typeof AccountUsageStatsInputSchema
>;
export type AccountUsageStatsResponse = z.infer<
	typeof AccountUsageStatsResponseSchema
>;
export type AgentsListInput = z.infer<typeof AgentsListInputSchema>;
export type AgentsListResponse = z.infer<typeof AgentsListResponseSchema>;
export type AgentsGetInput = z.infer<typeof AgentsGetInputSchema>;
export type AgentsGetResponse = z.infer<typeof AgentsGetResponseSchema>;
export type AgentsCreateInput = z.infer<typeof AgentsCreateInputSchema>;
export type AgentsCreateResponse = z.infer<typeof AgentsCreateResponseSchema>;
export type AgentsUpdateInput = z.infer<typeof AgentsUpdateInputSchema>;
export type AgentsUpdateResponse = z.infer<typeof AgentsUpdateResponseSchema>;
export type AgentsDeleteInput = z.infer<typeof AgentsDeleteInputSchema>;
export type AgentsDeleteResponse = z.infer<typeof AgentsDeleteResponseSchema>;
export type AgentsConversationsListInput = z.infer<
	typeof AgentsConversationsListInputSchema
>;
export type AgentsConversationsListResponse = z.infer<
	typeof AgentsConversationsListResponseSchema
>;
export type AgentsConversationGetInput = z.infer<
	typeof ConversationIdInputSchema
>;
export type AgentsConversationGetResponse = z.infer<
	typeof AgentsConversationGetResponseSchema
>;
export type AgentsConversationDeleteInput = z.infer<
	typeof ConversationIdInputSchema
>;
export type AgentsConversationDeleteResponse = z.infer<
	typeof AgentsConversationDeleteResponseSchema
>;
export type AgentsSignedUrlInput = z.infer<typeof AgentsSignedUrlInputSchema>;
export type AgentsSignedUrlResponse = z.infer<
	typeof AgentsSignedUrlResponseSchema
>;
export type SingleUseTokensCreateInput = z.infer<
	typeof SingleUseTokensCreateInputSchema
>;
export type SingleUseTokensCreateResponse = z.infer<
	typeof SingleUseTokensCreateResponseSchema
>;

export type ElevenLabsEndpointInputs = {
	textToSpeechConvert: TextToSpeechConvertInput;
	textToSpeechConvertWithTimestamps: TextToSpeechConvertWithTimestampsInput;
	textToDialogueConvert: TextToDialogueConvertInput;
	speechToTextConvert: SpeechToTextConvertInput;
	speechToTextGetTranscript: SpeechToTextGetTranscriptInput;
	speechToTextDeleteTranscript: SpeechToTextDeleteTranscriptInput;
	forcedAlignmentCreate: ForcedAlignmentCreateInput;
	soundEffectsGenerate: SoundEffectsGenerateInput;
	musicCompose: MusicComposeInput;
	musicPlan: MusicPlanInput;
	musicSeparateStems: MusicSeparateStemsInput;
	audioIsolationIsolate: AudioIsolationIsolateInput;
	voiceChangerConvert: VoiceChangerConvertInput;
	voicesList: VoicesListInput;
	voicesGet: VoicesGetInput;
	voicesSearchLibrary: VoicesSearchLibraryInput;
	voicesAddFromLibrary: VoicesAddFromLibraryInput;
	voicesEdit: VoicesEditInput;
	voicesDelete: VoicesDeleteInput;
	voicesGetSettings: VoicesGetSettingsInput;
	voicesEditSettings: VoicesEditSettingsInput;
	voicesDefaultSettings: VoicesDefaultSettingsInput;
	voiceDesignDesign: VoiceDesignDesignInput;
	voiceDesignGetPreview: VoiceDesignGetPreviewInput;
	voiceDesignCreate: VoiceDesignCreateInput;
	voiceDesignRemix: VoiceDesignRemixInput;
	dubbingCreate: DubbingCreateInput;
	dubbingGet: DubbingGetInput;
	dubbingList: DubbingListInput;
	dubbingDelete: DubbingDeleteInput;
	dubbingGetAudio: DubbingGetAudioInput;
	dubbingGetTranscript: DubbingGetTranscriptInput;
	historyList: HistoryListInput;
	historyGet: HistoryGetInput;
	historyGetAudio: HistoryGetAudioInput;
	historyDelete: HistoryDeleteInput;
	modelsList: ModelsListInput;
	accountUser: AccountUserInput;
	accountSubscription: AccountSubscriptionInput;
	accountUsageStats: AccountUsageStatsInput;
	agentsList: AgentsListInput;
	agentsGet: AgentsGetInput;
	agentsCreate: AgentsCreateInput;
	agentsUpdate: AgentsUpdateInput;
	agentsDelete: AgentsDeleteInput;
	agentsConversationsList: AgentsConversationsListInput;
	agentsConversationGet: AgentsConversationGetInput;
	agentsConversationDelete: AgentsConversationDeleteInput;
	agentsSignedUrl: AgentsSignedUrlInput;
	singleUseTokensCreate: SingleUseTokensCreateInput;
};

export type ElevenLabsEndpointOutputs = {
	textToSpeechConvert: TextToSpeechConvertResponse;
	textToSpeechConvertWithTimestamps: TextToSpeechConvertWithTimestampsResponse;
	textToDialogueConvert: TextToDialogueConvertResponse;
	speechToTextConvert: SpeechToTextConvertResponse;
	speechToTextGetTranscript: SpeechToTextGetTranscriptResponse;
	speechToTextDeleteTranscript: SpeechToTextDeleteTranscriptResponse;
	forcedAlignmentCreate: ForcedAlignmentCreateResponse;
	soundEffectsGenerate: SoundEffectsGenerateResponse;
	musicCompose: MusicComposeResponse;
	musicPlan: MusicPlanResponse;
	musicSeparateStems: MusicSeparateStemsResponse;
	audioIsolationIsolate: AudioIsolationIsolateResponse;
	voiceChangerConvert: VoiceChangerConvertResponse;
	voicesList: VoicesListResponse;
	voicesGet: VoicesGetResponse;
	voicesSearchLibrary: VoicesSearchLibraryResponse;
	voicesAddFromLibrary: VoicesAddFromLibraryResponse;
	voicesEdit: VoicesEditResponse;
	voicesDelete: VoicesDeleteResponse;
	voicesGetSettings: VoicesGetSettingsResponse;
	voicesEditSettings: VoicesEditSettingsResponse;
	voicesDefaultSettings: VoicesDefaultSettingsResponse;
	voiceDesignDesign: VoiceDesignDesignResponse;
	voiceDesignGetPreview: VoiceDesignGetPreviewResponse;
	voiceDesignCreate: VoiceDesignCreateResponse;
	voiceDesignRemix: VoiceDesignRemixResponse;
	dubbingCreate: DubbingCreateResponse;
	dubbingGet: DubbingGetResponse;
	dubbingList: DubbingListResponse;
	dubbingDelete: DubbingDeleteResponse;
	dubbingGetAudio: DubbingGetAudioResponse;
	dubbingGetTranscript: DubbingGetTranscriptResponse;
	historyList: HistoryListResponse;
	historyGet: HistoryGetResponse;
	historyGetAudio: HistoryGetAudioResponse;
	historyDelete: HistoryDeleteResponse;
	modelsList: ModelsListResponse;
	accountUser: AccountUserResponse;
	accountSubscription: AccountSubscriptionResponse;
	accountUsageStats: AccountUsageStatsResponse;
	agentsList: AgentsListResponse;
	agentsGet: AgentsGetResponse;
	agentsCreate: AgentsCreateResponse;
	agentsUpdate: AgentsUpdateResponse;
	agentsDelete: AgentsDeleteResponse;
	agentsConversationsList: AgentsConversationsListResponse;
	agentsConversationGet: AgentsConversationGetResponse;
	agentsConversationDelete: AgentsConversationDeleteResponse;
	agentsSignedUrl: AgentsSignedUrlResponse;
	singleUseTokensCreate: SingleUseTokensCreateResponse;
};

export const ElevenLabsEndpointInputSchemas = {
	textToSpeechConvert: TextToSpeechConvertInputSchema,
	textToSpeechConvertWithTimestamps:
		TextToSpeechConvertWithTimestampsInputSchema,
	textToDialogueConvert: TextToDialogueConvertInputSchema,
	speechToTextConvert: SpeechToTextConvertInputSchema,
	speechToTextGetTranscript: SpeechToTextTranscriptIdInputSchema,
	speechToTextDeleteTranscript: SpeechToTextTranscriptIdInputSchema,
	forcedAlignmentCreate: ForcedAlignmentCreateInputSchema,
	soundEffectsGenerate: SoundEffectsGenerateInputSchema,
	musicCompose: MusicComposeInputSchema,
	musicPlan: MusicPlanInputSchema,
	musicSeparateStems: MusicSeparateStemsInputSchema,
	audioIsolationIsolate: AudioIsolationIsolateInputSchema,
	voiceChangerConvert: VoiceChangerConvertInputSchema,
	voicesList: VoicesListInputSchema,
	voicesGet: VoiceIdInputSchema,
	voicesSearchLibrary: VoicesSearchLibraryInputSchema,
	voicesAddFromLibrary: VoicesAddFromLibraryInputSchema,
	voicesEdit: VoicesEditInputSchema,
	voicesDelete: VoiceIdInputSchema,
	voicesGetSettings: VoiceIdInputSchema,
	voicesEditSettings: VoicesEditSettingsInputSchema,
	voicesDefaultSettings: VoicesDefaultSettingsInputSchema,
	voiceDesignDesign: VoiceDesignDesignInputSchema,
	voiceDesignGetPreview: VoiceDesignGetPreviewInputSchema,
	voiceDesignCreate: VoiceDesignCreateInputSchema,
	voiceDesignRemix: VoiceDesignRemixInputSchema,
	dubbingCreate: DubbingCreateInputSchema,
	dubbingGet: DubbingIdInputSchema,
	dubbingList: DubbingListInputSchema,
	dubbingDelete: DubbingIdInputSchema,
	dubbingGetAudio: DubbingGetAudioInputSchema,
	dubbingGetTranscript: DubbingGetTranscriptInputSchema,
	historyList: HistoryListInputSchema,
	historyGet: HistoryItemIdInputSchema,
	historyGetAudio: HistoryGetAudioInputSchema,
	historyDelete: HistoryItemIdInputSchema,
	modelsList: ModelsListInputSchema,
	accountUser: AccountUserInputSchema,
	accountSubscription: AccountSubscriptionInputSchema,
	accountUsageStats: AccountUsageStatsInputSchema,
	agentsList: AgentsListInputSchema,
	agentsGet: AgentsGetInputSchema,
	agentsCreate: AgentsCreateInputSchema,
	agentsUpdate: AgentsUpdateInputSchema,
	agentsDelete: AgentsDeleteInputSchema,
	agentsConversationsList: AgentsConversationsListInputSchema,
	agentsConversationGet: ConversationIdInputSchema,
	agentsConversationDelete: ConversationIdInputSchema,
	agentsSignedUrl: AgentsSignedUrlInputSchema,
	singleUseTokensCreate: SingleUseTokensCreateInputSchema,
} as const;

export const ElevenLabsEndpointOutputSchemas = {
	textToSpeechConvert: TextToSpeechConvertResponseSchema,
	textToSpeechConvertWithTimestamps:
		TextToSpeechConvertWithTimestampsResponseSchema,
	textToDialogueConvert: TextToDialogueConvertResponseSchema,
	speechToTextConvert: SpeechToTextConvertResponseSchema,
	speechToTextGetTranscript: SpeechToTextGetTranscriptResponseSchema,
	speechToTextDeleteTranscript: StatusOkSchema,
	forcedAlignmentCreate: ForcedAlignmentCreateResponseSchema,
	soundEffectsGenerate: SoundEffectsGenerateResponseSchema,
	musicCompose: MusicComposeResponseSchema,
	musicPlan: MusicPlanResponseSchema,
	musicSeparateStems: MusicSeparateStemsResponseSchema,
	audioIsolationIsolate: AudioIsolationIsolateResponseSchema,
	voiceChangerConvert: VoiceChangerConvertResponseSchema,
	voicesList: VoicesListResponseSchema,
	voicesGet: VoicesGetResponseSchema,
	voicesSearchLibrary: VoicesSearchLibraryResponseSchema,
	voicesAddFromLibrary: VoicesAddFromLibraryResponseSchema,
	voicesEdit: VoicesEditResponseSchema,
	voicesDelete: VoicesDeleteResponseSchema,
	voicesGetSettings: VoicesSettingsResponseSchema,
	voicesEditSettings: VoicesEditSettingsResponseSchema,
	voicesDefaultSettings: VoicesSettingsResponseSchema,
	voiceDesignDesign: VoiceDesignDesignResponseSchema,
	voiceDesignGetPreview: VoiceDesignGetPreviewResponseSchema,
	voiceDesignCreate: VoiceDesignCreateResponseSchema,
	voiceDesignRemix: VoiceDesignRemixResponseSchema,
	dubbingCreate: DubbingCreateResponseSchema,
	dubbingGet: DubbingGetResponseSchema,
	dubbingList: DubbingListResponseSchema,
	dubbingDelete: DubbingDeleteResponseSchema,
	dubbingGetAudio: DubbingGetAudioResponseSchema,
	dubbingGetTranscript: DubbingGetTranscriptResponseSchema,
	historyList: HistoryListResponseSchema,
	historyGet: HistoryGetResponseSchema,
	historyGetAudio: HistoryGetAudioResponseSchema,
	historyDelete: HistoryDeleteResponseSchema,
	modelsList: ModelsListResponseSchema,
	accountUser: AccountUserResponseSchema,
	accountSubscription: AccountSubscriptionResponseSchema,
	accountUsageStats: AccountUsageStatsResponseSchema,
	agentsList: AgentsListResponseSchema,
	agentsGet: AgentsGetResponseSchema,
	agentsCreate: AgentsCreateResponseSchema,
	agentsUpdate: AgentsUpdateResponseSchema,
	agentsDelete: AgentsDeleteResponseSchema,
	agentsConversationsList: AgentsConversationsListResponseSchema,
	agentsConversationGet: AgentsConversationGetResponseSchema,
	agentsConversationDelete: AgentsConversationDeleteResponseSchema,
	agentsSignedUrl: AgentsSignedUrlResponseSchema,
	singleUseTokensCreate: SingleUseTokensCreateResponseSchema,
} as const;
