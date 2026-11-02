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
	listBots: ListBotsInput;
	createBot: CreateBotInput;
	retrieveBot: RetrieveBotInput;
	updateBot: UpdateBotInput;
	deleteBot: RetrieveBotInput;
};

export type RecallaiEndpointOutputs = ArtifactEndpointOutputs & {
	listBots: ListBotsResponse;
	createBot: BotResponse;
	retrieveBot: BotResponse;
	updateBot: BotResponse;
	deleteBot: undefined;
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
