import { z } from 'zod';
import type { RecallaiJsonObject } from '../json';
import { RecallaiJsonObjectSchema } from '../json';
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
import {
	CalendarAccessTokenResponseSchema,
	CalendarIdInputSchema,
	CalendarResponseSchema,
	CalendarUndefinedResponseSchema,
	CreateCalendarInputSchema,
	ListCalendarsInputSchema,
	UpdateCalendarInputSchema,
} from './calendars';
import type {
	GoogleLoginEndpointInputs,
	GoogleLoginEndpointOutputs,
} from './google-logins';
import {
	GoogleLoginInputSchemas,
	GoogleLoginOutputSchemas,
} from './google-logins';
import { mediaSchemas } from './media';
import type {
	CreateAsyncTranscriptInput,
	RealtimeEndpointListInput,
	RecordingListInput,
	SdkUploadListInput,
} from './recordings';
import type {
	RecallaiWorkspaceOperationInputs,
	RecallaiWorkspaceOperationOutputs,
} from './workspace-operations';
import {
	RecallaiWorkspaceOperationInputSchemas,
	RecallaiWorkspaceOperationOutputSchemas,
} from './workspace-operations';

export { UpdateParticipantEventsInputSchema } from './artifact-types';

// Recall identifies every bot by UUID. Requiring one keeps `.`, `..` and
// path separators out of the request path.
const id = z.string().uuid();

// Recall returns provider-specific nested configuration objects. The known
// envelope is validated while these opaque sections remain extensible.
const opaqueObject = RecallaiJsonObjectSchema;

// Output fields stay loose (plain strings, open objects) so a new value from
// Recall does not fail a call that already succeeded.
const BotSchema = z
	.object({
		id: z.string(),
		meeting_url: z.union([z.string(), opaqueObject]).nullable().optional(),
		bot_name: z.string().optional(),
		join_at: z.string().nullable().optional(),
		status_changes: z.array(opaqueObject).optional(),
		recordings: z.array(opaqueObject).optional(),
		metadata: opaqueObject.nullable().optional(),
	})
	.passthrough();

const ListBotsResponseSchema = z.object({
	// Recall leaves `count` out of cursor-paginated pages.
	count: z.number().int().nonnegative().optional(),
	next: z.string().nullable().optional(),
	previous: z.string().nullable().optional(),
	results: z.array(BotSchema),
});

const BotPlatformSchema = z.enum([
	'chime_sdk',
	'google_meet',
	'google_meet_media_api',
	'goto_meeting',
	'microsoft_teams',
	'microsoft_teams_live',
	'slack_authenticator',
	'slack_huddle_observer',
	'webex',
	'zoom',
	'zoom_rtms',
]);
const BotStatusSchema = z.enum([
	'analysis_done',
	'analysis_failed',
	'call_ended',
	'done',
	'fatal',
	'in_call_not_recording',
	'in_call_recording',
	'in_waiting_room',
	'joining_call',
	'media_expired',
	'ready',
	'recording_done',
	'recording_permission_allowed',
	'recording_permission_denied',
]);

const ListBotsInputSchema = z.object({
	// Recall takes a date (2026-01-31) or a full ISO timestamp here.
	join_at_after: z.string().min(1).optional(),
	join_at_before: z.string().min(1).optional(),
	meeting_url: z.string().url().optional(),
	page: z.number().int().positive().optional(),
	platform: z.array(BotPlatformSchema).optional(),
	status: z.array(BotStatusSchema).optional(),
	// Any value switches the list to cursor pagination; pass the `cursor`
	// from the previous page's `next` URL to continue.
	use_cursor: z.string().optional(),
	cursor: z.string().optional(),
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

// Only scheduled bots that have not joined yet can be updated.
const UpdateBotInputSchema = z
	.object({
		id,
		meeting_url: z.string().url().optional(),
		join_at: z.string().datetime({ offset: true }).optional(),
		bot_name: z.string().max(100).optional(),
		metadata: opaqueObject.optional(),
		recording_config: opaqueObject.optional(),
	})
	.refine(
		({ id: _id, ...fields }) =>
			Object.values(fields).some((value) => value !== undefined),
		{ message: 'Pass at least one field to update' },
	);

export type ListBotsInput = z.infer<typeof ListBotsInputSchema>;
export type CreateBotInput = z.infer<typeof CreateBotInputSchema>;
export type RetrieveBotInput = z.infer<typeof RetrieveBotInputSchema>;
export type UpdateBotInput = z.infer<typeof UpdateBotInputSchema>;
export type BotResponse = z.infer<typeof BotSchema>;
export type ListBotsResponse = z.infer<typeof ListBotsResponseSchema>;

export type RecallaiEndpointInputs = ArtifactEndpointInputs &
	CalendarEndpointInputs &
	GoogleLoginEndpointInputs &
	RecallaiWorkspaceOperationInputs & {
		listCalendars: z.infer<typeof ListCalendarsInputSchema>;
		createCalendar: z.infer<typeof CreateCalendarInputSchema>;
		retrieveCalendar: z.infer<typeof CalendarIdInputSchema>;
		updateCalendar: z.infer<typeof UpdateCalendarInputSchema>;
		deleteCalendar: z.infer<typeof CalendarIdInputSchema>;
		createCalendarAccessToken: z.infer<typeof CalendarIdInputSchema>;
		listRecording: RecordingListInput;
		retrieveRecording: { id: string };
		updateRecording: { id: string; metadata: RecallaiJsonObject };
		deleteRecording: { id: string };
		createAsyncTranscript: CreateAsyncTranscriptInput;
		listRealtimeEndpoints: RealtimeEndpointListInput;
		retrieveRealtimeEndpoints: { id: string };
		updateRealtimeEndpoints: { id: string; metadata: RecallaiJsonObject };
		listSdkUploads: SdkUploadListInput;
		createSdkUpload: {
			recording_config?: RecallaiJsonObject;
			_1080p?: boolean;
			metadata?: RecallaiJsonObject;
		};
		retrieveSdkUpload: { id: string };
		updateMeetingMetadata: { id: string; metadata: RecallaiJsonObject };
		deleteMeetingMetadata: { id: string };
		deleteParticipantEvents: { id: string };
		updateTranscript: { id: string; metadata: RecallaiJsonObject };
		deleteTranscript: { id: string };
		listAudioMixed: z.infer<typeof mediaSchemas.audioMixed.list.input>;
		retrieveAudioMixed: { id: string };
		updateAudioMixed: { id: string; metadata: RecallaiJsonObject };
		deleteAudioMixed: { id: string };
		listAudioSeparate: z.infer<typeof mediaSchemas.audioSeparate.list.input>;
		retrieveAudioSeparate: { id: string };
		updateAudioSeparate: { id: string; metadata: RecallaiJsonObject };
		deleteAudioSeparate: { id: string };
		listVideoMixed: z.infer<typeof mediaSchemas.videoMixed.list.input>;
		retrieveVideoMixed: { id: string };
		updateVideoMixed: { id: string; metadata: RecallaiJsonObject };
		deleteVideoMixed: { id: string };
		listVideoSeparate: z.infer<typeof mediaSchemas.videoSeparate.list.input>;
		retrieveVideoSeparate: { id: string };
		updateVideoSeparate: { id: string; metadata: RecallaiJsonObject };
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
		stopOutputMedia: StopOutputMediaInput;
		startScreenshare: VideoOutputInput;
		stopScreenshare: BotActionInput;
		outputVideo: VideoOutputInput;
		stopOutputVideo: BotActionInput;
		pauseRecording: BotActionInput;
		pinParticipant: PinParticipantInput;
		resumeRecording: BotActionInput;
		sendChatMessage: SendChatMessageInput;
		startRecording: StartRecordingInput;
		stopRecording: BotActionInput;
	};

export type RecallaiEndpointOutputs = ArtifactEndpointOutputs &
	CalendarEndpointOutputs &
	GoogleLoginEndpointOutputs &
	RecallaiWorkspaceOperationOutputs & {
		listCalendars: z.infer<
			typeof import('./calendars').calendarsSchemas.list.output
		>;
		createCalendar: z.infer<typeof CalendarResponseSchema>;
		retrieveCalendar: z.infer<typeof CalendarResponseSchema>;
		updateCalendar: z.infer<typeof CalendarResponseSchema>;
		deleteCalendar: undefined;
		createCalendarAccessToken: z.infer<
			typeof CalendarAccessTokenResponseSchema
		>;
		listRecording: {
			count?: number;
			next?: string | null;
			previous?: string | null;
			results: RecallaiJsonObject[];
		};
		retrieveRecording: RecallaiJsonObject;
		updateRecording: RecallaiJsonObject;
		deleteRecording: undefined;
		createAsyncTranscript: RecallaiJsonObject;
		listRealtimeEndpoints: {
			count?: number;
			next?: string | null;
			previous?: string | null;
			results: RecallaiJsonObject[];
		};
		retrieveRealtimeEndpoints: RecallaiJsonObject;
		updateRealtimeEndpoints: RecallaiJsonObject;
		listSdkUploads: {
			count?: number;
			next?: string | null;
			previous?: string | null;
			results: RecallaiJsonObject[];
		};
		createSdkUpload: RecallaiJsonObject;
		retrieveSdkUpload: RecallaiJsonObject;
		updateMeetingMetadata: RecallaiJsonObject;
		deleteMeetingMetadata: undefined;
		deleteParticipantEvents: undefined;
		updateTranscript: RecallaiJsonObject;
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
		deleteBotMedia: BotResponse;
		leaveBotCall: BotResponse;
		outputAudio: BotResponse;
		stopOutputAudio: undefined;
		outputMedia: BotResponse;
		stopOutputMedia: undefined;
		startScreenshare: BotResponse;
		stopScreenshare: undefined;
		outputVideo: BotResponse;
		stopOutputVideo: undefined;
		pauseRecording: BotResponse;
		pinParticipant: BotResponse;
		resumeRecording: BotResponse;
		sendChatMessage: BotResponse;
		startRecording: BotResponse;
		stopRecording: BotResponse;
	};

export const RecallaiEndpointInputSchemas = {
	...GoogleLoginInputSchemas,
	...RecallaiWorkspaceOperationInputSchemas,
	listCalendars: ListCalendarsInputSchema,
	createCalendar: CreateCalendarInputSchema,
	retrieveCalendar: CalendarIdInputSchema,
	updateCalendar: UpdateCalendarInputSchema,
	deleteCalendar: CalendarIdInputSchema,
	createCalendarAccessToken: CalendarIdInputSchema,
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
	listAudioMixed: mediaSchemas.audioMixed.list.input,
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
	...GoogleLoginOutputSchemas,
	...RecallaiWorkspaceOperationOutputSchemas,
	listCalendars: z
		.object({
			next: z.string().nullable().optional(),
			previous: z.string().nullable().optional(),
			results: z.array(CalendarResponseSchema),
		})
		.passthrough(),
	createCalendar: CalendarResponseSchema,
	retrieveCalendar: CalendarResponseSchema,
	updateCalendar: CalendarResponseSchema,
	deleteCalendar: CalendarUndefinedResponseSchema,
	createCalendarAccessToken: CalendarAccessTokenResponseSchema,
	listBots: ListBotsResponseSchema,
	createBot: BotSchema,
	retrieveBot: BotSchema,
	updateBot: BotSchema,
	deleteBot: z.undefined(),
	// Every bot action POST answers with the updated bot; the stop calls
	// (DELETE) answer 204.
	deleteBotMedia: BotSchema,
	leaveBotCall: BotSchema,
	outputAudio: BotSchema,
	stopOutputAudio: z.undefined(),
	outputMedia: BotSchema,
	stopOutputMedia: z.undefined(),
	startScreenshare: BotSchema,
	stopScreenshare: z.undefined(),
	outputVideo: BotSchema,
	stopOutputVideo: z.undefined(),
	pauseRecording: BotSchema,
	pinParticipant: BotSchema,
	resumeRecording: BotSchema,
	sendChatMessage: BotSchema,
	startRecording: BotSchema,
	stopRecording: BotSchema,
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
	kind: z.literal('mp3'),
	b64_data: z.string().min(1),
});
const VideoOutputInputSchema = BotActionInputSchema.extend({
	kind: z.literal('jpeg'),
	b64_data: z.string().min(1),
});
const OutputMediaInputSchema = BotActionInputSchema.extend({
	camera: opaqueObject.optional(),
	screenshare: opaqueObject.optional(),
});
const StopOutputMediaInputSchema = BotActionInputSchema.extend({
	camera: z.boolean(),
	screenshare: z.boolean(),
});
const StartRecordingInputSchema = BotActionInputSchema.extend({
	// Same shape as `recording_config` on bots.create; sent as the request
	// body. Omit it to restart with the bot's current configuration.
	recording_config: opaqueObject.optional(),
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
export type VideoOutputInput = z.infer<typeof VideoOutputInputSchema>;
export type OutputMediaInput = z.infer<typeof OutputMediaInputSchema>;
export type StopOutputMediaInput = z.infer<typeof StopOutputMediaInputSchema>;
export type StartRecordingInput = z.infer<typeof StartRecordingInputSchema>;
export type PinParticipantInput = z.infer<typeof PinParticipantInputSchema>;
export type SendChatMessageInput = z.infer<typeof SendChatMessageInputSchema>;

export const RecallaiBotActionInputSchemas = {
	deleteBotMedia: BotActionInputSchema,
	leaveBotCall: BotActionInputSchema,
	outputAudio: AudioOutputInputSchema,
	stopOutput: BotActionInputSchema,
	outputMedia: OutputMediaInputSchema,
	stopOutputMedia: StopOutputMediaInputSchema,
	outputScreenshare: VideoOutputInputSchema,
	outputVideo: VideoOutputInputSchema,
	pauseRecording: BotActionInputSchema,
	pinParticipant: PinParticipantInputSchema,
	resumeRecording: BotActionInputSchema,
	sendChatMessage: SendChatMessageInputSchema,
	startRecording: StartRecordingInputSchema,
	stopRecording: BotActionInputSchema,
} as const;
