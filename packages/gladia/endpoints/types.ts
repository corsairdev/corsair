import { z } from 'zod';

const JsonRecordSchema = z.record(
	z.string(),
	// unknown is necessary because Gladia accepts arbitrary JSON metadata values; a closed value union is infeasible because metadata keys are caller-defined
	z.unknown(),
);
const JsonRecordOptionalSchema = JsonRecordSchema.optional();
const StatusSchema = z.enum(['queued', 'processing', 'done', 'error']);

const FileMetadataSchema = z
	.object({
		id: z.string().optional(),
		filename: z.string().optional(),
		extension: z.string().optional(),
		size: z.number().optional(),
		audio_duration: z.number().optional(),
		number_of_channels: z.number().optional(),
		source: z.string().optional(),
	})
	.passthrough();

const JobSchema = z
	.object({
		id: z.string(),
		request_id: z.string().optional(),
		version: z.number().optional(),
		status: StatusSchema.optional(),
		created_at: z.string().optional(),
		completed_at: z.string().nullable().optional(),
		kind: z.enum(['live', 'pre-recorded']).optional(),
		custom_metadata: JsonRecordOptionalSchema,
		error_code: z.number().nullable().optional(),
		file: FileMetadataSchema.nullable().optional(),
		request_params: JsonRecordSchema.nullable().optional(),
		// unknown is necessary because transcription results differ by feature combination; a closed result union is infeasible because Gladia composes optional processing outputs
		result: z.unknown().optional(),
		post_session_metadata: JsonRecordOptionalSchema,
	})
	.passthrough();

const JobListSchema = z.object({
	first: z.string().url(),
	current: z.string().url(),
	next: z.string().url().nullable(),
	items: z.array(JobSchema),
});

const ListInputSchema = z.object({
	offset: z.number().int().nonnegative().optional(),
	limit: z.number().int().positive().optional(),
	date: z.string().optional(),
	before_date: z.string().optional(),
	after_date: z.string().optional(),
	status: z.array(StatusSchema).optional(),
	custom_metadata: JsonRecordOptionalSchema,
});

const IdInputSchema = z.object({ id: z.string().min(1) });
const UploadInputSchema = z.object({
	audio: z.custom<Blob>(
		(value) => typeof Blob !== 'undefined' && value instanceof Blob,
	),
	filename: z.string().optional(),
});
const UploadResponseSchema = z.object({
	audio_url: z.string().url(),
	audio_metadata: FileMetadataSchema,
});

const LiveInputSchema = z
	.object({
		region: z.enum(['us-west', 'eu-west']).optional(),
		encoding: z.enum(['wav/pcm', 'wav/alaw', 'wav/ulaw']).optional(),
		bit_depth: z
			.union([z.literal(8), z.literal(16), z.literal(24), z.literal(32)])
			.optional(),
		sample_rate: z
			.union([
				z.literal(8000),
				z.literal(16000),
				z.literal(32000),
				z.literal(44100),
				z.literal(48000),
			])
			.optional(),
		channels: z.number().int().min(1).max(8).optional(),
		custom_metadata: JsonRecordOptionalSchema,
		model: z.string().optional(),
		endpointing: z.number().min(0.01).max(10).optional(),
		maximum_duration_without_endpointing: z.number().min(5).max(60).optional(),
		language_config: JsonRecordOptionalSchema,
		pre_processing: JsonRecordOptionalSchema,
		realtime_processing: JsonRecordOptionalSchema,
		post_processing: JsonRecordOptionalSchema,
		messages_config: JsonRecordOptionalSchema,
		callback: z.boolean().optional(),
		callback_config: JsonRecordOptionalSchema,
	})
	.refine(
		(value) =>
			(value.encoding !== 'wav/alaw' && value.encoding !== 'wav/ulaw') ||
			value.bit_depth === 8,
		{
			message: 'wav/alaw and wav/ulaw encodings require 8-bit audio',
			path: ['bit_depth'],
		},
	);
const LiveResponseSchema = z.object({
	id: z.string(),
	created_at: z.string(),
	url: z.string().url(),
});

const PreRecordedInputSchema = z.object({
	audio_url: z.string().url(),
	custom_vocabulary: z.boolean().optional(),
	custom_vocabulary_config: JsonRecordOptionalSchema,
	callback_url: z.string().url().optional(),
	callback: z.boolean().optional(),
	callback_config: JsonRecordOptionalSchema,
	subtitles: z.boolean().optional(),
	subtitles_config: JsonRecordOptionalSchema,
	diarization: z.boolean().optional(),
	diarization_config: JsonRecordOptionalSchema,
	translation: z.boolean().optional(),
	translation_config: JsonRecordOptionalSchema,
	summarization: z.boolean().optional(),
	summarization_config: JsonRecordOptionalSchema,
	named_entity_recognition: z.boolean().optional(),
	custom_spelling: z.boolean().optional(),
	custom_spelling_config: JsonRecordOptionalSchema,
	sentiment_analysis: z.boolean().optional(),
	audio_to_llm: z.boolean().optional(),
	audio_to_llm_config: JsonRecordOptionalSchema,
	pii_redaction: z.boolean().optional(),
	pii_redaction_config: JsonRecordOptionalSchema,
	custom_metadata: JsonRecordOptionalSchema,
	sentences: z.boolean().optional(),
	punctuation_enhanced: z.boolean().optional(),
	language_config: JsonRecordOptionalSchema,
	model: z.string().optional(),
});
const PreRecordedInitResponseSchema = z.object({
	id: z.string(),
	result_url: z.string().url(),
});

const DeleteAcknowledgementSchema = z.union([
	z.undefined(),
	z.object({
		message: z.string(),
	}),
]);

export type GladiaUploadAudioVideoFileInput = z.infer<typeof UploadInputSchema>;
export type GladiaUploadAudioVideoFileResponse = z.infer<
	typeof UploadResponseSchema
>;
export type GladiaInitiateLiveTranscriptionSessionInput = z.infer<
	typeof LiveInputSchema
>;
export type GladiaInitiateLiveTranscriptionSessionResponse = z.infer<
	typeof LiveResponseSchema
>;
export type GladiaListLiveTranscriptionJobsInput = z.infer<
	typeof ListInputSchema
>;
export type GladiaListLiveTranscriptionJobsResponse = z.infer<
	typeof JobListSchema
>;
export type GladiaGetLiveTranscriptionResultInput = z.infer<
	typeof IdInputSchema
>;
export type GladiaGetLiveTranscriptionResultResponse = z.infer<
	typeof JobSchema
>;
export type GladiaDeleteLiveSessionInput = z.infer<typeof IdInputSchema>;
export type GladiaInitiatePreRecordedTranscriptionInput = z.infer<
	typeof PreRecordedInputSchema
>;
export type GladiaInitiatePreRecordedTranscriptionResponse = z.infer<
	typeof PreRecordedInitResponseSchema
>;
export type GladiaListPreRecordedJobsInput = z.infer<typeof ListInputSchema>;
export type GladiaListPreRecordedJobsResponse = z.infer<typeof JobListSchema>;
export type GladiaGetPreRecordedJobInput = z.infer<typeof IdInputSchema>;
export type GladiaGetPreRecordedJobResponse = z.infer<typeof JobSchema>;
export type GladiaDeleteLiveSessionResponse = z.infer<
	typeof DeleteAcknowledgementSchema
>;
export type GladiaDeletePreRecordedJobInput = z.infer<typeof IdInputSchema>;
export type GladiaDeletePreRecordedJobResponse = z.infer<
	typeof DeleteAcknowledgementSchema
>;

export type GladiaEndpointInputs = {
	uploadAudioVideoFile: GladiaUploadAudioVideoFileInput;
	initiateLiveTranscriptionSession: GladiaInitiateLiveTranscriptionSessionInput;
	listLiveTranscriptionJobs: GladiaListLiveTranscriptionJobsInput;
	getLiveTranscriptionResult: GladiaGetLiveTranscriptionResultInput;
	deleteLiveSession: GladiaDeleteLiveSessionInput;
	initiatePreRecordedTranscription: GladiaInitiatePreRecordedTranscriptionInput;
	listPreRecordedJobs: GladiaListPreRecordedJobsInput;
	getPreRecordedJob: GladiaGetPreRecordedJobInput;
	deletePreRecordedJob: GladiaDeletePreRecordedJobInput;
};

export type GladiaEndpointOutputs = {
	uploadAudioVideoFile: GladiaUploadAudioVideoFileResponse;
	initiateLiveTranscriptionSession: GladiaInitiateLiveTranscriptionSessionResponse;
	listLiveTranscriptionJobs: GladiaListLiveTranscriptionJobsResponse;
	getLiveTranscriptionResult: GladiaGetLiveTranscriptionResultResponse;
	deleteLiveSession: GladiaDeleteLiveSessionResponse;
	initiatePreRecordedTranscription: GladiaInitiatePreRecordedTranscriptionResponse;
	listPreRecordedJobs: GladiaListPreRecordedJobsResponse;
	getPreRecordedJob: GladiaGetPreRecordedJobResponse;
	deletePreRecordedJob: GladiaDeletePreRecordedJobResponse;
};

export const GladiaEndpointInputSchemas = {
	uploadAudioVideoFile: UploadInputSchema,
	initiateLiveTranscriptionSession: LiveInputSchema,
	listLiveTranscriptionJobs: ListInputSchema,
	getLiveTranscriptionResult: IdInputSchema,
	deleteLiveSession: IdInputSchema,
	initiatePreRecordedTranscription: PreRecordedInputSchema,
	listPreRecordedJobs: ListInputSchema,
	getPreRecordedJob: IdInputSchema,
	deletePreRecordedJob: IdInputSchema,
} as const;

export const GladiaEndpointOutputSchemas = {
	uploadAudioVideoFile: UploadResponseSchema,
	initiateLiveTranscriptionSession: LiveResponseSchema,
	listLiveTranscriptionJobs: JobListSchema,
	getLiveTranscriptionResult: JobSchema,
	deleteLiveSession: DeleteAcknowledgementSchema,
	initiatePreRecordedTranscription: PreRecordedInitResponseSchema,
	listPreRecordedJobs: JobListSchema,
	getPreRecordedJob: JobSchema,
	deletePreRecordedJob: DeleteAcknowledgementSchema,
} as const;
