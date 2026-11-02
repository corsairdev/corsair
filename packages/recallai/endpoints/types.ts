import { z } from 'zod';
import type {
	ArtifactEndpointInputs,
	ArtifactEndpointOutputs,
} from './artifact-types';
export { UpdateParticipantEventsInputSchema } from './artifact-types';

const id = z.string().min(1).refine((value) => !/[\\/]/.test(value), {
	message: 'Identifiers cannot contain path separators',
});

// Recall returns provider-specific nested configuration objects. The known
// envelope is validated while these opaque sections remain extensible.
const opaqueObject = z.record(z.string(), z.unknown());

const BotSchema = z.object({
	id: z.string().uuid().optional(),
	meeting_url: z.union([z.string().url(), opaqueObject]).optional(),
	bot_name: z.string().max(100).optional(),
	join_at: z.string().datetime().optional(),
	status_changes: z.array(opaqueObject).optional(),
	recordings: z.array(opaqueObject).optional(),
	metadata: opaqueObject.optional(),
}).passthrough();

const ListBotsResponseSchema = z.object({
	count: z.number().int().nonnegative(),
	next: z.string().url().nullable().optional(),
	previous: z.string().url().nullable().optional(),
	results: z.array(BotSchema),
});

const ListBotsInputSchema = z.object({
	join_at_after: z.string().datetime().optional(),
	join_at_before: z.string().datetime().optional(),
	meeting_url: z.string().url().optional(),
	page: z.number().int().positive().optional(),
	platform: z.array(z.string()).optional(),
	status: z.array(z.string()).optional(),
	use_cursor: z.string().optional(),
});

const CreateBotInputSchema = z.object({
	meeting_url: z.union([z.string().url(), opaqueObject]),
	bot_name: z.string().max(100).optional(),
	join_at: z.string().datetime().optional(),
	recording_config: opaqueObject.optional(),
	metadata: opaqueObject.optional(),
}).passthrough();

const RetrieveBotInputSchema = z.object({ id });

const UpdateBotInputSchema = z.object({
	id,
	bot_name: z.string().max(100).optional(),
	metadata: opaqueObject.optional(),
	recording_config: opaqueObject.optional(),
}).refine(({ bot_name, metadata, recording_config }) =>
	bot_name !== undefined || metadata !== undefined || recording_config !== undefined,
);

export type ListBotsInput = z.infer<typeof ListBotsInputSchema>;
export type CreateBotInput = z.infer<typeof CreateBotInputSchema>;
export type RetrieveBotInput = z.infer<typeof RetrieveBotInputSchema>;
export type UpdateBotInput = z.infer<typeof UpdateBotInputSchema>;
export type BotResponse = z.infer<typeof BotSchema>;
export type ListBotsResponse = z.infer<typeof ListBotsResponseSchema>;

export type RecallaiEndpointInputs = ArtifactEndpointInputs & {
	listRecording: { cursor?: string; created_at_after?: string; created_at_before?: string; recording_id?: string; status_code?: 'processing' | 'done' | 'failed' | 'deleted' };
	retrieveRecording: { id: string }; updateRecording: { id: string; metadata: Record<string, unknown> }; deleteRecording: { id: string };
	createAsyncTranscript: { id: string; provider?: string };
	listRealtimeEndpoints: { cursor?: string; created_at_after?: string; created_at_before?: string; recording_id?: string; status_code?: 'processing' | 'done' | 'failed' | 'deleted' };
	retrieveRealtimeEndpoints: { id: string }; updateRealtimeEndpoints: { id: string; metadata: Record<string, unknown> };
	listSdkUploads: { cursor?: string; created_at_after?: string; created_at_before?: string; recording_id?: string; status_code?: 'processing' | 'done' | 'failed' | 'deleted' };
	listBots: ListBotsInput;
	createBot: CreateBotInput;
	retrieveBot: RetrieveBotInput;
	updateBot: UpdateBotInput;
	deleteBot: RetrieveBotInput;
	deleteBotMedia: BotActionInput; leaveBotCall: BotActionInput; outputAudio: AudioOutputInput; stopOutputAudio: BotActionInput;
	outputMedia: OutputMediaInput; stopOutputMedia: BotActionInput; startScreenshare: AudioOutputInput; stopScreenshare: BotActionInput;
	outputVideo: AudioOutputInput; stopOutputVideo: BotActionInput; pauseRecording: BotActionInput; pinParticipant: PinParticipantInput;
	resumeRecording: BotActionInput; sendChatMessage: SendChatMessageInput; startRecording: BotActionInput; stopRecording: BotActionInput;
};

export type RecallaiEndpointOutputs = ArtifactEndpointOutputs & {
	listRecording: { count?: number; next?: string | null; previous?: string | null; results: Record<string, unknown>[] };
	retrieveRecording: Record<string, unknown>; updateRecording: Record<string, unknown>; deleteRecording: undefined; createAsyncTranscript: Record<string, unknown>;
	listRealtimeEndpoints: { count?: number; next?: string | null; previous?: string | null; results: Record<string, unknown>[] };
	retrieveRealtimeEndpoints: Record<string, unknown>; updateRealtimeEndpoints: Record<string, unknown>;
	listSdkUploads: { count?: number; next?: string | null; previous?: string | null; results: Record<string, unknown>[] };
	listBots: ListBotsResponse;
	createBot: BotResponse;
	retrieveBot: BotResponse;
	updateBot: BotResponse;
	deleteBot: undefined;
	deleteBotMedia: undefined; leaveBotCall: undefined; outputAudio: Record<string, unknown>; stopOutputAudio: undefined;
	outputMedia: Record<string, unknown>; stopOutputMedia: undefined; startScreenshare: Record<string, unknown>;
	stopScreenshare: undefined; outputVideo: Record<string, unknown>; stopOutputVideo: undefined;
	pauseRecording: undefined; pinParticipant: undefined; resumeRecording: undefined; sendChatMessage: undefined;
	startRecording: undefined; stopRecording: undefined;
};

export const RecallaiEndpointInputSchemas = {
	listBots: ListBotsInputSchema,
	createBot: CreateBotInputSchema,
	retrieveBot: RetrieveBotInputSchema,
	updateBot: UpdateBotInputSchema,
	deleteBot: RetrieveBotInputSchema,
} as const;

export const RecallaiEndpointOutputSchemas = {
	listBots: ListBotsResponseSchema,
	createBot: BotSchema,
	retrieveBot: BotSchema,
	updateBot: BotSchema,
	deleteBot: z.undefined(),
	deleteBotMedia: z.undefined(), leaveBotCall: z.undefined(), outputAudio: z.record(z.string(), z.unknown()).optional(),
	stopOutputAudio: z.undefined(), outputMedia: z.record(z.string(), z.unknown()).optional(), stopOutputMedia: z.undefined(),
	startScreenshare: z.record(z.string(), z.unknown()).optional(), stopScreenshare: z.undefined(),
	outputVideo: z.record(z.string(), z.unknown()).optional(), stopOutputVideo: z.undefined(), pauseRecording: z.undefined(),
	pinParticipant: z.undefined(), resumeRecording: z.undefined(), sendChatMessage: z.undefined(), startRecording: z.undefined(), stopRecording: z.undefined(),
} as const;

const BotActionInputSchema = z.object({ id });
const AudioOutputInputSchema = BotActionInputSchema.extend({
	kind: z.string().min(1),
	b64_data: z.string().min(1),
});
const VideoOutputInputSchema = AudioOutputInputSchema;
const OutputMediaInputSchema = BotActionInputSchema.extend({
	camera: opaqueObject.optional(),
	screenshare: opaqueObject.optional(),
});
const PinParticipantInputSchema = z.object({ bot_id: id, participant_id: z.number().int() });
const SendChatMessageInputSchema = BotActionInputSchema.extend({
	to: z.string().optional(),
	message: z.string().min(1),
	pin: z.boolean().optional(),
});

export type BotActionInput = z.infer<typeof BotActionInputSchema>;
export type AudioOutputInput = z.infer<typeof AudioOutputInputSchema>;
export type OutputMediaInput = z.infer<typeof OutputMediaInputSchema>;
export type PinParticipantInput = z.infer<typeof PinParticipantInputSchema>;
export type SendChatMessageInput = z.infer<typeof SendChatMessageInputSchema>;

export const RecallaiBotActionInputSchemas = {
	deleteBotMedia: BotActionInputSchema,
	leaveBotCall: BotActionInputSchema,
	outputAudio: AudioOutputInputSchema,
	outputMedia: OutputMediaInputSchema,
	outputScreenshare: VideoOutputInputSchema,
	outputVideo: VideoOutputInputSchema,
	pauseRecording: BotActionInputSchema,
	pinParticipant: PinParticipantInputSchema,
	resumeRecording: BotActionInputSchema,
	sendChatMessage: SendChatMessageInputSchema,
	startRecording: BotActionInputSchema,
	stopRecording: BotActionInputSchema,
} as const;
