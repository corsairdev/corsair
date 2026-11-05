import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeRecallaiContextRequest } from '../client';
import type {
	RecallaiContext,
	RecallaiEndpointOutputs,
	RecallaiEndpoints,
} from '../index';
import type { RecallaiJsonObject } from '../json';
import { RecallaiJsonObjectSchema } from '../json';

const id = z.string().uuid();
const opaque = RecallaiJsonObjectSchema;
const artifact = z
	.object({
		id,
		recording: opaque.optional(),
		metadata: opaque.optional(),
		status: opaque.optional(),
		data: opaque.optional(),
	})
	.passthrough();
const page = z.object({
	count: z.number().int().nonnegative().optional(),
	next: z.string().url().nullable().optional(),
	previous: z.string().url().nullable().optional(),
	results: z.array(artifact),
});
// Each Recall list takes its own filters; these follow the API reference.
const recordingListInput = z.object({
	bot_id: id.optional(),
	desktop_sdk_upload_id: id.optional(),
	created_at_after: z.string().datetime({ offset: true }).optional(),
	created_at_before: z.string().datetime({ offset: true }).optional(),
	cursor: z.string().optional(),
	status_code: z.enum(['processing', 'paused', 'done', 'failed']).optional(),
});
const realtimeEndpointListInput = z.object({
	recording_id: id.optional(),
	created_at_after: z.string().datetime({ offset: true }).optional(),
	created_at_before: z.string().datetime({ offset: true }).optional(),
	cursor: z.string().optional(),
	status_code: z.enum(['running', 'done', 'failed']).optional(),
	type: z
		.enum(['desktop_sdk_callback', 'rtmp', 'webhook', 'websocket'])
		.optional(),
});
const sdkUploadListInput = z.object({ cursor: z.string().optional() });
const itemInput = z.object({ id });
const updateInput = z
	.object({ id, metadata: opaque.optional() })
	.refine(({ metadata }) => metadata !== undefined);
const transcriptProviderNames = [
	'assembly_ai_async',
	'deepgram_async',
	'gladia_v2_async',
	'recallai_async',
	'rev_async',
	'speechmatics_async',
	'google_speech_v2_async',
	'aws_transcribe_async',
	'soniox_async',
	'elevenlabs_async',
] as const;
// Recall takes the provider as an object keyed by provider name, e.g.
// `{ recallai_async: { language_code: 'en' } }`; the value holds that
// provider's own options, which Recall documents per provider.
const transcriptProvider = z
	.object(
		Object.fromEntries(
			transcriptProviderNames.map((name) => [name, opaque.optional()]),
		) as Record<
			(typeof transcriptProviderNames)[number],
			z.ZodOptional<typeof opaque>
		>,
	)
	.strict()
	.refine(
		(provider) =>
			Object.values(provider).filter((value) => value !== undefined).length ===
			1,
		{ message: 'Pass exactly one transcription provider' },
	);
const transcriptInput = z.object({
	id,
	provider: transcriptProvider,
	diarization: z
		.object({ use_separate_streams_when_available: z.boolean().optional() })
		.optional(),
	metadata: opaque.optional(),
});

const path = (resource: string, idValue?: string) =>
	`/api/v1/${resource}/${idValue ? `${encodeURIComponent(idValue)}/` : ''}`;

const list = async (
	ctx: Parameters<RecallaiEndpoints['listRecording']>[0],
	// Validated by the operation's own list schema before this point.
	input: Record<string, string | undefined>,
	resource: string,
	event: string,
) => {
	const result = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['listRecording']
	>(ctx, path(resource), { method: 'GET', query: input });
	await logEventFromContext(ctx, event, {}, 'completed');
	return result;
};

export const listRecording: RecallaiEndpoints['listRecording'] = (ctx, input) =>
	list(ctx, input, 'recording', 'recallai.recording.list');
export const retrieveRecording: RecallaiEndpoints['retrieveRecording'] = async (
	ctx,
	input,
) => {
	const parsed = itemInput.parse(input);
	const result = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['retrieveRecording']
	>(ctx, path('recording', parsed.id), { method: 'GET' });
	await logEventFromContext(
		ctx,
		'recallai.recording.retrieve',
		{ id: parsed.id },
		'completed',
	);
	return result;
};
export const updateRecording: RecallaiEndpoints['updateRecording'] = async (
	ctx,
	input,
) => {
	const parsed = updateInput.parse(input);
	const { id: resourceId, ...body } = parsed;
	const result = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['updateRecording']
	>(ctx, path('recording', resourceId), { method: 'PATCH', body });
	await logEventFromContext(
		ctx,
		'recallai.recording.update',
		{ id: resourceId },
		'completed',
	);
	return result;
};
export const deleteRecording: RecallaiEndpoints['deleteRecording'] = async (
	ctx,
	input,
) => {
	const parsed = itemInput.parse(input);
	await makeRecallaiContextRequest(ctx, path('recording', parsed.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'recallai.recording.delete',
		{ id: parsed.id },
		'completed',
	);
};
export const createAsyncTranscript: RecallaiEndpoints['createAsyncTranscript'] =
	async (ctx, input) => {
		const parsed = transcriptInput.parse(input);
		const { id: recordingId, ...body } = parsed;
		const result = await makeRecallaiContextRequest<
			RecallaiEndpointOutputs['createAsyncTranscript']
		>(ctx, path('recording', recordingId) + 'create_transcript/', {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'recallai.recording.createTranscript',
			{ id: recordingId },
			'completed',
		);
		return result;
	};

export const listRealtimeEndpoints: RecallaiEndpoints['listRealtimeEndpoints'] =
	(ctx, input) =>
		list(ctx, input, 'realtime_endpoint', 'recallai.realtimeEndpoint.list');
export const retrieveRealtimeEndpoints: RecallaiEndpoints['retrieveRealtimeEndpoints'] =
	async (ctx, input) => {
		const parsed = itemInput.parse(input);
		const result = await makeRecallaiContextRequest<
			RecallaiEndpointOutputs['retrieveRealtimeEndpoints']
		>(ctx, path('realtime_endpoint', parsed.id), { method: 'GET' });
		await logEventFromContext(
			ctx,
			'recallai.realtimeEndpoint.retrieve',
			{ id: parsed.id },
			'completed',
		);
		return result;
	};
export const updateRealtimeEndpoints: RecallaiEndpoints['updateRealtimeEndpoints'] =
	async (ctx, input) => {
		const parsed = updateInput.parse(input);
		const { id: resourceId, ...body } = parsed;
		const result = await makeRecallaiContextRequest<
			RecallaiEndpointOutputs['updateRealtimeEndpoints']
		>(ctx, path('realtime_endpoint', resourceId), {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'recallai.realtimeEndpoint.update',
			{ id: resourceId },
			'completed',
		);
		return result;
	};
export const listSdkUploads = async (
	ctx: RecallaiContext,
	input: z.infer<typeof sdkUploadListInput>,
): Promise<{
	count?: number;
	next?: string | null;
	previous?: string | null;
	results: RecallaiJsonObject[];
}> => list(ctx, input, 'sdk_upload', 'recallai.sdkUpload.list');

const createSdkUploadInput = z.object({
	recording_config: opaque.optional(),
	_1080p: z.boolean().optional(),
	metadata: opaque.optional(),
});

export const createSdkUpload: RecallaiEndpoints['createSdkUpload'] = async (
	ctx,
	input,
) => {
	const parsed = createSdkUploadInput.parse(input);
	const result = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['createSdkUpload']
	>(ctx, '/api/v1/sdk_upload/', { method: 'POST', body: parsed });
	await logEventFromContext(ctx, 'recallai.sdkUpload.create', {}, 'completed');
	return result;
};

export const retrieveSdkUpload: RecallaiEndpoints['retrieveSdkUpload'] = async (
	ctx,
	input,
) => {
	const parsed = itemInput.parse(input);
	const result = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['retrieveSdkUpload']
	>(ctx, path('sdk_upload', parsed.id), { method: 'GET' });
	await logEventFromContext(
		ctx,
		'recallai.sdkUpload.retrieve',
		{ id: parsed.id },
		'completed',
	);
	return result;
};

export const recordingSchemas = {
	listRecording: { input: recordingListInput, output: page },
	retrieveRecording: { input: itemInput, output: artifact },
	updateRecording: { input: updateInput, output: artifact },
	deleteRecording: { input: itemInput, output: z.undefined() },
	createAsyncTranscript: { input: transcriptInput, output: artifact },
	listRealtimeEndpoints: { input: realtimeEndpointListInput, output: page },
	retrieveRealtimeEndpoints: { input: itemInput, output: artifact },
	updateRealtimeEndpoints: { input: updateInput, output: artifact },
	listSdkUploads: { input: sdkUploadListInput, output: page },
	createSdkUpload: { input: createSdkUploadInput, output: artifact },
	retrieveSdkUpload: { input: itemInput, output: artifact },
} as const;

export type RecordingListInput = z.infer<typeof recordingListInput>;
export type RealtimeEndpointListInput = z.infer<
	typeof realtimeEndpointListInput
>;
export type SdkUploadListInput = z.infer<typeof sdkUploadListInput>;
export type CreateAsyncTranscriptInput = z.infer<typeof transcriptInput>;
