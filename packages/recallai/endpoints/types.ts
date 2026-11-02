import { z } from 'zod';
import type {
	ArtifactEndpointInputs,
	ArtifactEndpointOutputs,
} from './artifact-types';
import type {
	CalendarEndpointInputs,
	CalendarEndpointOutputs,
} from './calendar-types';
import {
	CalendarAuthenticateInputSchema,
	CalendarDisconnectInputSchema,
	CalendarEventBotInputSchema,
	CalendarEventInputSchema,
	CalendarEventsListInputSchema,
	CalendarMeetingInputSchema,
	CalendarMeetingsListInputSchema,
	CalendarMeetingUpdateInputSchema,
	CalendarUserAuthInputSchema,
	CalendarUsersListInputSchema,
	CalendarUserUpdateInputSchema,
} from './calendar-types';
import { mediaSchemas } from './media';

export { UpdateParticipantEventsInputSchema } from './artifact-types';

const id = z
	.string()
	.min(1)
	.refine((value) => !/[\\/]/.test(value), {
		message: 'Identifiers cannot contain path separators',
	});

// Recall returns provider-specific nested configuration objects. The known
// envelope is validated while these opaque sections remain extensible.
const opaqueObject = z.record(z.string(), z.unknown());

const BotSchema = z
	.object({
		id: z.string().uuid().optional(),
		meeting_url: z.union([z.string().url(), opaqueObject]).optional(),
		bot_name: z.string().max(100).optional(),
		join_at: z.string().datetime().optional(),
		status_changes: z.array(opaqueObject).optional(),
		recordings: z.array(opaqueObject).optional(),
		metadata: opaqueObject.optional(),
	})
	.passthrough();

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

const CreateBotInputSchema = z
	.object({
		meeting_url: z.union([z.string().url(), opaqueObject]),
		bot_name: z.string().max(100).optional(),
		join_at: z.string().datetime().optional(),
		recording_config: opaqueObject.optional(),
		metadata: opaqueObject.optional(),
	})
	.passthrough();

const RetrieveBotInputSchema = z.object({ id });

const UpdateBotInputSchema = z
	.object({
		id,
		bot_name: z.string().max(100).optional(),
		metadata: opaqueObject.optional(),
		recording_config: opaqueObject.optional(),
	})
	.refine(
		({ bot_name, metadata, recording_config }) =>
			bot_name !== undefined ||
			metadata !== undefined ||
			recording_config !== undefined,
	);

export type ListBotsInput = z.infer<typeof ListBotsInputSchema>;
export type CreateBotInput = z.infer<typeof CreateBotInputSchema>;
export type RetrieveBotInput = z.infer<typeof RetrieveBotInputSchema>;
export type UpdateBotInput = z.infer<typeof UpdateBotInputSchema>;
export type BotResponse = z.infer<typeof BotSchema>;
export type ListBotsResponse = z.infer<typeof ListBotsResponseSchema>;

export type RecallaiEndpointInputs = ArtifactEndpointInputs &
	CalendarEndpointInputs & {
		listRecording: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		retrieveRecording: { id: string };
		updateRecording: { id: string; metadata: Record<string, unknown> };
		deleteRecording: { id: string };
		createAsyncTranscript: { id: string; provider?: string };
		listRealtimeEndpoints: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		retrieveRealtimeEndpoints: { id: string };
		updateRealtimeEndpoints: { id: string; metadata: Record<string, unknown> };
		listSdkUploads: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		createSdkUpload: {
			recording_config?: Record<string, unknown>;
			_1080p?: boolean;
			metadata?: Record<string, unknown>;
		};
		retrieveSdkUpload: { id: string };
		updateMeetingMetadata: { id: string; metadata: Record<string, unknown> };
		deleteMeetingMetadata: { id: string };
		deleteParticipantEvents: { id: string };
		updateTranscript: { id: string; metadata: Record<string, unknown> };
		deleteTranscript: { id: string };
		listAudioMixed: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		retrieveAudioMixed: { id: string };
		updateAudioMixed: { id: string; metadata: Record<string, unknown> };
		deleteAudioMixed: { id: string };
		listAudioSeparate: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		retrieveAudioSeparate: { id: string };
		updateAudioSeparate: { id: string; metadata: Record<string, unknown> };
		deleteAudioSeparate: { id: string };
		listVideoMixed: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		retrieveVideoMixed: { id: string };
		updateVideoMixed: { id: string; metadata: Record<string, unknown> };
		deleteVideoMixed: { id: string };
		listVideoSeparate: {
			cursor?: string;
			created_at_after?: string;
			created_at_before?: string;
			recording_id?: string;
			status_code?: 'processing' | 'done' | 'failed' | 'deleted';
		};
		retrieveVideoSeparate: { id: string };
		updateVideoSeparate: { id: string; metadata: Record<string, unknown> };
		deleteVideoSeparate: { id: string };
		listBots: ListBotsInput;
		createBot: CreateBotInput;
		retrieveBot: RetrieveBotInput;
		updateBot: UpdateBotInput;
		deleteBot: RetrieveBotInput;
		deleteBotMedia: BotActionInput;
		leaveBotCall: BotActionInput;
		outputAudio: AudioOutputInput;
		stopOutputAudio: BotActionInput;
		outputMedia: OutputMediaInput;
		stopOutputMedia: BotActionInput;
		startScreenshare: AudioOutputInput;
		stopScreenshare: BotActionInput;
		outputVideo: AudioOutputInput;
		stopOutputVideo: BotActionInput;
		pauseRecording: BotActionInput;
		pinParticipant: PinParticipantInput;
		resumeRecording: BotActionInput;
		sendChatMessage: SendChatMessageInput;
		startRecording: BotActionInput;
		stopRecording: BotActionInput;
	};

export type RecallaiEndpointOutputs = ArtifactEndpointOutputs &
	CalendarEndpointOutputs & {
		listRecording: {
			count?: number;
			next?: string | null;
			previous?: string | null;
			results: Record<string, unknown>[];
		};
		retrieveRecording: Record<string, unknown>;
		updateRecording: Record<string, unknown>;
		deleteRecording: undefined;
		createAsyncTranscript: Record<string, unknown>;
		listRealtimeEndpoints: {
			count?: number;
			next?: string | null;
			previous?: string | null;
			results: Record<string, unknown>[];
		};
		retrieveRealtimeEndpoints: Record<string, unknown>;
		updateRealtimeEndpoints: Record<string, unknown>;
		listSdkUploads: {
			count?: number;
			next?: string | null;
			previous?: string | null;
			results: Record<string, unknown>[];
		};
		createSdkUpload: Record<string, unknown>;
		retrieveSdkUpload: Record<string, unknown>;
		updateMeetingMetadata: Record<string, unknown>;
		deleteMeetingMetadata: undefined;
		deleteParticipantEvents: undefined;
		updateTranscript: Record<string, unknown>;
		deleteTranscript: undefined;
		listAudioMixed: z.infer<typeof mediaSchemas.audioMixed.list.output>;
		retrieveAudioMixed: z.infer<typeof mediaSchemas.audioMixed.retrieve.output>;
		updateAudioMixed: z.infer<typeof mediaSchemas.audioMixed.update.output>;
		deleteAudioMixed: undefined;
		listAudioSeparate: z.infer<typeof mediaSchemas.audioSeparate.list.output>;
		retrieveAudioSeparate: z.infer<
			typeof mediaSchemas.audioSeparate.retrieve.output
		>;
		updateAudioSeparate: z.infer<
			typeof mediaSchemas.audioSeparate.update.output
		>;
		deleteAudioSeparate: undefined;
		listVideoMixed: z.infer<typeof mediaSchemas.videoMixed.list.output>;
		retrieveVideoMixed: z.infer<typeof mediaSchemas.videoMixed.retrieve.output>;
		updateVideoMixed: z.infer<typeof mediaSchemas.videoMixed.update.output>;
		deleteVideoMixed: undefined;
		listVideoSeparate: z.infer<typeof mediaSchemas.videoSeparate.list.output>;
		retrieveVideoSeparate: z.infer<
			typeof mediaSchemas.videoSeparate.retrieve.output
		>;
		updateVideoSeparate: z.infer<
			typeof mediaSchemas.videoSeparate.update.output
		>;
		deleteVideoSeparate: undefined;
		listBots: ListBotsResponse;
		createBot: BotResponse;
		retrieveBot: BotResponse;
		updateBot: BotResponse;
		deleteBot: undefined;
		deleteBotMedia: undefined;
		leaveBotCall: undefined;
		outputAudio: Record<string, unknown>;
		stopOutputAudio: undefined;
		outputMedia: Record<string, unknown>;
		stopOutputMedia: undefined;
		startScreenshare: Record<string, unknown>;
		stopScreenshare: undefined;
		outputVideo: Record<string, unknown>;
		stopOutputVideo: undefined;
		pauseRecording: undefined;
		pinParticipant: undefined;
		resumeRecording: undefined;
		sendChatMessage: undefined;
		startRecording: undefined;
		stopRecording: undefined;
	};

export const RecallaiEndpointInputSchemas = {
	listBots: ListBotsInputSchema,
	createBot: CreateBotInputSchema,
	retrieveBot: RetrieveBotInputSchema,
	updateBot: UpdateBotInputSchema,
	deleteBot: RetrieveBotInputSchema,
	createSdkUpload: z.object({
		recording_config: opaqueObject.optional(),
		_1080p: z.boolean().optional(),
		metadata: opaqueObject.optional(),
	}),
	retrieveSdkUpload: z.object({ id }),
	updateMeetingMetadata: z.object({ id, metadata: opaqueObject }),
	deleteMeetingMetadata: z.object({ id }),
	deleteParticipantEvents: z.object({ id }),
	updateTranscript: z.object({ id, metadata: opaqueObject }),
	deleteTranscript: z.object({ id }),
	authenticateCalendar: CalendarAuthenticateInputSchema,
	listCalendarMeetings: CalendarMeetingsListInputSchema,
	retrieveCalendarMeeting: CalendarMeetingInputSchema,
	updateCalendarMeeting: CalendarMeetingUpdateInputSchema,
	refreshCalendarMeetings: CalendarUserAuthInputSchema,
	retrieveCalendarUser: CalendarUserAuthInputSchema,
	updateCalendarUser: CalendarUserUpdateInputSchema,
	deleteCalendarUser: CalendarUserAuthInputSchema,
	disconnectCalendarPlatform: CalendarDisconnectInputSchema,
	listCalendarUsers: CalendarUsersListInputSchema,
	listCalendarEvents: CalendarEventsListInputSchema,
	retrieveCalendarEvent: CalendarEventInputSchema,
	scheduleBotForCalendarEvent: CalendarEventBotInputSchema,
	unscheduleBotForCalendarEvent: CalendarEventInputSchema,
	listAudioMixed: z.object({
		cursor: z.string().optional(),
		created_at_after: z.string().datetime().optional(),
		created_at_before: z.string().datetime().optional(),
		recording_id: id.optional(),
		status_code: z.enum(['processing', 'done', 'failed', 'deleted']).optional(),
	}),
	retrieveAudioMixed: mediaSchemas.audioMixed.retrieve.input,
	updateAudioMixed: mediaSchemas.audioMixed.update.input,
	deleteAudioMixed: mediaSchemas.audioMixed.delete.input,
	listAudioSeparate: mediaSchemas.audioSeparate.list.input,
	retrieveAudioSeparate: mediaSchemas.audioSeparate.retrieve.input,
	updateAudioSeparate: mediaSchemas.audioSeparate.update.input,
	deleteAudioSeparate: mediaSchemas.audioSeparate.delete.input,
	listVideoMixed: mediaSchemas.videoMixed.list.input,
	retrieveVideoMixed: mediaSchemas.videoMixed.retrieve.input,
	updateVideoMixed: mediaSchemas.videoMixed.update.input,
	deleteVideoMixed: mediaSchemas.videoMixed.delete.input,
	listVideoSeparate: mediaSchemas.videoSeparate.list.input,
	retrieveVideoSeparate: mediaSchemas.videoSeparate.retrieve.input,
	updateVideoSeparate: mediaSchemas.videoSeparate.update.input,
	deleteVideoSeparate: mediaSchemas.videoSeparate.delete.input,
} as const;

export const RecallaiEndpointOutputSchemas = {
	listBots: ListBotsResponseSchema,
	createBot: BotSchema,
	retrieveBot: BotSchema,
	updateBot: BotSchema,
	deleteBot: z.undefined(),
	deleteBotMedia: z.undefined(),
	leaveBotCall: z.undefined(),
	outputAudio: z.record(z.string(), z.unknown()).optional(),
	stopOutputAudio: z.undefined(),
	outputMedia: z.record(z.string(), z.unknown()).optional(),
	stopOutputMedia: z.undefined(),
	startScreenshare: z.record(z.string(), z.unknown()).optional(),
	stopScreenshare: z.undefined(),
	outputVideo: z.record(z.string(), z.unknown()).optional(),
	stopOutputVideo: z.undefined(),
	pauseRecording: z.undefined(),
	pinParticipant: z.undefined(),
	resumeRecording: z.undefined(),
	sendChatMessage: z.undefined(),
	startRecording: z.undefined(),
	stopRecording: z.undefined(),
	createSdkUpload: opaqueObject,
	retrieveSdkUpload: opaqueObject,
	updateMeetingMetadata: opaqueObject,
	deleteMeetingMetadata: z.undefined(),
	deleteParticipantEvents: z.undefined(),
	updateTranscript: opaqueObject,
	deleteTranscript: z.undefined(),
	authenticateCalendar: opaqueObject,
	listCalendarMeetings: z.array(opaqueObject),
	retrieveCalendarMeeting: opaqueObject,
	updateCalendarMeeting: opaqueObject,
	refreshCalendarMeetings: z.array(opaqueObject),
	retrieveCalendarUser: opaqueObject,
	updateCalendarUser: opaqueObject,
	deleteCalendarUser: z.undefined(),
	disconnectCalendarPlatform: opaqueObject,
	listCalendarUsers: z.array(opaqueObject),
	listCalendarEvents: opaqueObject,
	retrieveCalendarEvent: opaqueObject,
	scheduleBotForCalendarEvent: opaqueObject,
	unscheduleBotForCalendarEvent: opaqueObject,
	listAudioMixed: mediaSchemas.audioMixed.list.output,
	retrieveAudioMixed: mediaSchemas.audioMixed.retrieve.output,
	updateAudioMixed: mediaSchemas.audioMixed.update.output,
	deleteAudioMixed: z.undefined(),
	listAudioSeparate: mediaSchemas.audioSeparate.list.output,
	retrieveAudioSeparate: mediaSchemas.audioSeparate.retrieve.output,
	updateAudioSeparate: mediaSchemas.audioSeparate.update.output,
	deleteAudioSeparate: z.undefined(),
	listVideoMixed: mediaSchemas.videoMixed.list.output,
	retrieveVideoMixed: mediaSchemas.videoMixed.retrieve.output,
	updateVideoMixed: mediaSchemas.videoMixed.update.output,
	deleteVideoMixed: z.undefined(),
	listVideoSeparate: mediaSchemas.videoSeparate.list.output,
	retrieveVideoSeparate: mediaSchemas.videoSeparate.retrieve.output,
	updateVideoSeparate: mediaSchemas.videoSeparate.update.output,
	deleteVideoSeparate: z.undefined(),
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
const PinParticipantInputSchema = z.object({
	bot_id: id,
	participant_id: z.number().int(),
});
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
