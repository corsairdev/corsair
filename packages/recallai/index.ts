import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';

import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';
import {
	authenticateCalendar,
	CalendarArrayResponseSchema,
	CalendarObjectResponseSchema,
	CalendarUndefinedResponseSchema,
	CalendarUsersResponseSchema,
	createAsyncTranscript,
	createBot,
	createSdkUpload,
	deleteAudioMixed,
	deleteAudioSeparate,
	deleteBot,
	deleteBotMedia,
	deleteCalendarUser,
	deleteMeetingMetadata,
	deleteParticipantEvents,
	deleteRecording,
	deleteTranscript,
	deleteVideoMixed,
	deleteVideoSeparate,
	disconnectCalendarPlatform,
	leaveBotCall,
	listAudioMixed,
	listAudioSeparate,
	listBots,
	listCalendarEvents,
	listCalendarMeetings,
	listCalendarUsers,
	listMeetingMetadata,
	listParticipantEvents,
	listRealtimeEndpoints,
	listRecording,
	listSdkUploads,
	listTranscripts,
	listVideoMixed,
	listVideoSeparate,
	mediaSchemas,
	outputAudio,
	outputMedia,
	outputVideo,
	pauseRecording,
	pinParticipant,
	recordingSchemas,
	refreshCalendarMeetings,
	resumeRecording,
	retrieveAudioMixed,
	retrieveAudioSeparate,
	retrieveBot,
	retrieveCalendarEvent,
	retrieveCalendarMeeting,
	retrieveCalendarUser,
	retrieveMeetingMetadata,
	retrieveParticipantEvents,
	retrieveRealtimeEndpoints,
	retrieveRecording,
	retrieveSdkUpload,
	retrieveTranscript,
	retrieveVideoMixed,
	retrieveVideoSeparate,
	scheduleBotForCalendarEvent,
	sendChatMessage,
	startRecording,
	startScreenshare,
	stopOutputAudio,
	stopOutputMedia,
	stopOutputVideo,
	stopRecording,
	stopScreenshare,
	unscheduleBotForCalendarEvent,
	updateAudioMixed,
	updateAudioSeparate,
	updateBot,
	updateCalendarMeeting,
	updateCalendarUser,
	updateMeetingMetadata,
	updateParticipantEvents,
	updateRealtimeEndpoints,
	updateRecording,
	updateTranscript,
	updateVideoMixed,
	updateVideoSeparate,
} from './endpoints';
import {
	ArtifactListInputSchema,
	ArtifactListResponseSchema,
	ArtifactResponseSchema,
	RetrieveArtifactInputSchema,
	UpdateParticipantEventsInputSchema,
} from './endpoints/artifact-types';
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
} from './endpoints/calendar-types';
import type {
	RecallaiEndpointInputs,
	RecallaiEndpointOutputs,
} from './endpoints/types';
import {
	RecallaiBotActionInputSchemas,
	RecallaiEndpointInputSchemas,
	RecallaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RecallaiSchema } from './schema';

export type RecallaiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRecallaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof recallaiEndpointsNested>;
};

export type RecallaiContext = CorsairPluginContext<
	typeof RecallaiSchema,
	RecallaiPluginOptions
>;
export type RecallaiKeyBuilderContext =
	KeyBuilderContext<RecallaiPluginOptions>;
export type RecallaiBoundEndpoints = BindEndpoints<
	typeof recallaiEndpointsNested
>;

type RecallaiEndpoint<K extends keyof RecallaiEndpointOutputs> =
	CorsairEndpoint<
		RecallaiContext,
		RecallaiEndpointInputs[K],
		RecallaiEndpointOutputs[K]
	>;

export type RecallaiEndpoints = {
	listBots: RecallaiEndpoint<'listBots'>;
	createBot: RecallaiEndpoint<'createBot'>;
	retrieveBot: RecallaiEndpoint<'retrieveBot'>;
	updateBot: RecallaiEndpoint<'updateBot'>;
	deleteBot: RecallaiEndpoint<'deleteBot'>;
	deleteBotMedia: RecallaiEndpoint<'deleteBotMedia'>;
	leaveBotCall: RecallaiEndpoint<'leaveBotCall'>;
	outputAudio: RecallaiEndpoint<'outputAudio'>;
	stopOutputAudio: RecallaiEndpoint<'stopOutputAudio'>;
	outputMedia: RecallaiEndpoint<'outputMedia'>;
	stopOutputMedia: RecallaiEndpoint<'stopOutputMedia'>;
	startScreenshare: RecallaiEndpoint<'startScreenshare'>;
	stopScreenshare: RecallaiEndpoint<'stopScreenshare'>;
	outputVideo: RecallaiEndpoint<'outputVideo'>;
	stopOutputVideo: RecallaiEndpoint<'stopOutputVideo'>;
	pauseRecording: RecallaiEndpoint<'pauseRecording'>;
	pinParticipant: RecallaiEndpoint<'pinParticipant'>;
	resumeRecording: RecallaiEndpoint<'resumeRecording'>;
	sendChatMessage: RecallaiEndpoint<'sendChatMessage'>;
	startRecording: RecallaiEndpoint<'startRecording'>;
	stopRecording: RecallaiEndpoint<'stopRecording'>;
	listRecording: RecallaiEndpoint<'listRecording'>;
	retrieveRecording: RecallaiEndpoint<'retrieveRecording'>;
	updateRecording: RecallaiEndpoint<'updateRecording'>;
	deleteRecording: RecallaiEndpoint<'deleteRecording'>;
	createAsyncTranscript: RecallaiEndpoint<'createAsyncTranscript'>;
	listRealtimeEndpoints: RecallaiEndpoint<'listRealtimeEndpoints'>;
	retrieveRealtimeEndpoints: RecallaiEndpoint<'retrieveRealtimeEndpoints'>;
	updateRealtimeEndpoints: RecallaiEndpoint<'updateRealtimeEndpoints'>;
	listSdkUploads: RecallaiEndpoint<'listSdkUploads'>;
	createSdkUpload: RecallaiEndpoint<'createSdkUpload'>;
	retrieveSdkUpload: RecallaiEndpoint<'retrieveSdkUpload'>;
	listMeetingMetadata: RecallaiEndpoint<'listMeetingMetadata'>;
	retrieveMeetingMetadata: RecallaiEndpoint<'retrieveMeetingMetadata'>;
	updateMeetingMetadata: RecallaiEndpoint<'updateMeetingMetadata'>;
	deleteMeetingMetadata: RecallaiEndpoint<'deleteMeetingMetadata'>;
	listParticipantEvents: RecallaiEndpoint<'listParticipantEvents'>;
	retrieveParticipantEvents: RecallaiEndpoint<'retrieveParticipantEvents'>;
	updateParticipantEvents: RecallaiEndpoint<'updateParticipantEvents'>;
	deleteParticipantEvents: RecallaiEndpoint<'deleteParticipantEvents'>;
	listTranscripts: RecallaiEndpoint<'listTranscripts'>;
	retrieveTranscript: RecallaiEndpoint<'retrieveTranscript'>;
	updateTranscript: RecallaiEndpoint<'updateTranscript'>;
	deleteTranscript: RecallaiEndpoint<'deleteTranscript'>;
	listAudioMixed: RecallaiEndpoint<'listAudioMixed'>;
	retrieveAudioMixed: RecallaiEndpoint<'retrieveAudioMixed'>;
	updateAudioMixed: RecallaiEndpoint<'updateAudioMixed'>;
	deleteAudioMixed: RecallaiEndpoint<'deleteAudioMixed'>;
	listAudioSeparate: RecallaiEndpoint<'listAudioSeparate'>;
	retrieveAudioSeparate: RecallaiEndpoint<'retrieveAudioSeparate'>;
	updateAudioSeparate: RecallaiEndpoint<'updateAudioSeparate'>;
	deleteAudioSeparate: RecallaiEndpoint<'deleteAudioSeparate'>;
	listVideoMixed: RecallaiEndpoint<'listVideoMixed'>;
	retrieveVideoMixed: RecallaiEndpoint<'retrieveVideoMixed'>;
	updateVideoMixed: RecallaiEndpoint<'updateVideoMixed'>;
	deleteVideoMixed: RecallaiEndpoint<'deleteVideoMixed'>;
	listVideoSeparate: RecallaiEndpoint<'listVideoSeparate'>;
	retrieveVideoSeparate: RecallaiEndpoint<'retrieveVideoSeparate'>;
	updateVideoSeparate: RecallaiEndpoint<'updateVideoSeparate'>;
	deleteVideoSeparate: RecallaiEndpoint<'deleteVideoSeparate'>;
	authenticateCalendar: RecallaiEndpoint<'authenticateCalendar'>;
	listCalendarMeetings: RecallaiEndpoint<'listCalendarMeetings'>;
	retrieveCalendarMeeting: RecallaiEndpoint<'retrieveCalendarMeeting'>;
	updateCalendarMeeting: RecallaiEndpoint<'updateCalendarMeeting'>;
	refreshCalendarMeetings: RecallaiEndpoint<'refreshCalendarMeetings'>;
	retrieveCalendarUser: RecallaiEndpoint<'retrieveCalendarUser'>;
	updateCalendarUser: RecallaiEndpoint<'updateCalendarUser'>;
	deleteCalendarUser: RecallaiEndpoint<'deleteCalendarUser'>;
	disconnectCalendarPlatform: RecallaiEndpoint<'disconnectCalendarPlatform'>;
	listCalendarUsers: RecallaiEndpoint<'listCalendarUsers'>;
	listCalendarEvents: RecallaiEndpoint<'listCalendarEvents'>;
	retrieveCalendarEvent: RecallaiEndpoint<'retrieveCalendarEvent'>;
	scheduleBotForCalendarEvent: RecallaiEndpoint<'scheduleBotForCalendarEvent'>;
	unscheduleBotForCalendarEvent: RecallaiEndpoint<'unscheduleBotForCalendarEvent'>;
};

const recallaiEndpointsNested = {
	bots: {
		list: listBots,
		create: createBot,
		retrieve: retrieveBot,
		update: updateBot,
		delete: deleteBot,
	},
	botActions: {
		deleteBotMedia,
		leaveBotCall,
		outputAudio,
		stopOutputAudio,
		outputMedia,
		stopOutputMedia,
		startScreenshare,
		stopScreenshare,
		outputVideo,
		stopOutputVideo,
		pauseRecording,
		pinParticipant,
		resumeRecording,
		sendChatMessage,
		startRecording,
		stopRecording,
	},
	recordings: {
		list: listRecording,
		retrieve: retrieveRecording,
		update: updateRecording,
		delete: deleteRecording,
		createTranscript: createAsyncTranscript,
	},
	realtimeEndpoints: {
		list: listRealtimeEndpoints,
		retrieve: retrieveRealtimeEndpoints,
		update: updateRealtimeEndpoints,
	},
	sdkUploads: {
		list: listSdkUploads,
		create: createSdkUpload,
		retrieve: retrieveSdkUpload,
	},
	meetingMetadata: {
		list: listMeetingMetadata,
		retrieve: retrieveMeetingMetadata,
		update: updateMeetingMetadata,
		delete: deleteMeetingMetadata,
	},
	participantEvents: {
		list: listParticipantEvents,
		retrieve: retrieveParticipantEvents,
		update: updateParticipantEvents,
		delete: deleteParticipantEvents,
	},
	transcripts: {
		list: listTranscripts,
		retrieve: retrieveTranscript,
		update: updateTranscript,
		delete: deleteTranscript,
	},
	audioMixed: {
		list: listAudioMixed,
		retrieve: retrieveAudioMixed,
		update: updateAudioMixed,
		delete: deleteAudioMixed,
	},
	audioSeparate: {
		list: listAudioSeparate,
		retrieve: retrieveAudioSeparate,
		update: updateAudioSeparate,
		delete: deleteAudioSeparate,
	},
	videoMixed: {
		list: listVideoMixed,
		retrieve: retrieveVideoMixed,
		update: updateVideoMixed,
		delete: deleteVideoMixed,
	},
	videoSeparate: {
		list: listVideoSeparate,
		retrieve: retrieveVideoSeparate,
		update: updateVideoSeparate,
		delete: deleteVideoSeparate,
	},
	calendar: {
		authenticate: authenticateCalendar,
		listMeetings: listCalendarMeetings,
		retrieveMeeting: retrieveCalendarMeeting,
		updateMeeting: updateCalendarMeeting,
		refreshMeetings: refreshCalendarMeetings,
		retrieveUser: retrieveCalendarUser,
		updateUser: updateCalendarUser,
		deleteUser: deleteCalendarUser,
		disconnectPlatform: disconnectCalendarPlatform,
		listUsers: listCalendarUsers,
		listEvents: listCalendarEvents,
		retrieveEvent: retrieveCalendarEvent,
		scheduleBot: scheduleBotForCalendarEvent,
		unscheduleBot: unscheduleBotForCalendarEvent,
	},
} as const;

export const recallaiEndpointSchemas = {
	'bots.list': {
		input: RecallaiEndpointInputSchemas.listBots,
		output: RecallaiEndpointOutputSchemas.listBots,
	},
	'bots.create': {
		input: RecallaiEndpointInputSchemas.createBot,
		output: RecallaiEndpointOutputSchemas.createBot,
	},
	'bots.retrieve': {
		input: RecallaiEndpointInputSchemas.retrieveBot,
		output: RecallaiEndpointOutputSchemas.retrieveBot,
	},
	'bots.update': {
		input: RecallaiEndpointInputSchemas.updateBot,
		output: RecallaiEndpointOutputSchemas.updateBot,
	},
	'bots.delete': {
		input: RecallaiEndpointInputSchemas.deleteBot,
		output: RecallaiEndpointOutputSchemas.deleteBot,
	},
	'botActions.deleteBotMedia': {
		input: RecallaiBotActionInputSchemas.deleteBotMedia,
		output: RecallaiEndpointOutputSchemas.deleteBotMedia,
	},
	'botActions.leaveBotCall': {
		input: RecallaiBotActionInputSchemas.leaveBotCall,
		output: RecallaiEndpointOutputSchemas.leaveBotCall,
	},
	'botActions.outputAudio': {
		input: RecallaiBotActionInputSchemas.outputAudio,
		output: RecallaiEndpointOutputSchemas.outputAudio,
	},
	'botActions.stopOutputAudio': {
		input: RecallaiBotActionInputSchemas.outputAudio,
		output: RecallaiEndpointOutputSchemas.stopOutputAudio,
	},
	'botActions.outputMedia': {
		input: RecallaiBotActionInputSchemas.outputMedia,
		output: RecallaiEndpointOutputSchemas.outputMedia,
	},
	'botActions.stopOutputMedia': {
		input: RecallaiBotActionInputSchemas.outputMedia,
		output: RecallaiEndpointOutputSchemas.stopOutputMedia,
	},
	'botActions.startScreenshare': {
		input: RecallaiBotActionInputSchemas.outputScreenshare,
		output: RecallaiEndpointOutputSchemas.startScreenshare,
	},
	'botActions.stopScreenshare': {
		input: RecallaiBotActionInputSchemas.outputScreenshare,
		output: RecallaiEndpointOutputSchemas.stopScreenshare,
	},
	'botActions.outputVideo': {
		input: RecallaiBotActionInputSchemas.outputVideo,
		output: RecallaiEndpointOutputSchemas.outputVideo,
	},
	'botActions.stopOutputVideo': {
		input: RecallaiBotActionInputSchemas.outputVideo,
		output: RecallaiEndpointOutputSchemas.stopOutputVideo,
	},
	'botActions.pauseRecording': {
		input: RecallaiBotActionInputSchemas.pauseRecording,
		output: RecallaiEndpointOutputSchemas.pauseRecording,
	},
	'botActions.pinParticipant': {
		input: RecallaiBotActionInputSchemas.pinParticipant,
		output: RecallaiEndpointOutputSchemas.pinParticipant,
	},
	'botActions.resumeRecording': {
		input: RecallaiBotActionInputSchemas.resumeRecording,
		output: RecallaiEndpointOutputSchemas.resumeRecording,
	},
	'botActions.sendChatMessage': {
		input: RecallaiBotActionInputSchemas.sendChatMessage,
		output: RecallaiEndpointOutputSchemas.sendChatMessage,
	},
	'botActions.startRecording': {
		input: RecallaiBotActionInputSchemas.startRecording,
		output: RecallaiEndpointOutputSchemas.startRecording,
	},
	'botActions.stopRecording': {
		input: RecallaiBotActionInputSchemas.stopRecording,
		output: RecallaiEndpointOutputSchemas.stopRecording,
	},
	'recordings.list': {
		input: recordingSchemas.listRecording.input,
		output: recordingSchemas.listRecording.output,
	},
	'recordings.retrieve': {
		input: recordingSchemas.retrieveRecording.input,
		output: recordingSchemas.retrieveRecording.output,
	},
	'recordings.update': {
		input: recordingSchemas.updateRecording.input,
		output: recordingSchemas.updateRecording.output,
	},
	'recordings.delete': {
		input: recordingSchemas.deleteRecording.input,
		output: recordingSchemas.deleteRecording.output,
	},
	'recordings.createTranscript': {
		input: recordingSchemas.createAsyncTranscript.input,
		output: recordingSchemas.createAsyncTranscript.output,
	},
	'realtimeEndpoints.list': {
		input: recordingSchemas.listRealtimeEndpoints.input,
		output: recordingSchemas.listRealtimeEndpoints.output,
	},
	'realtimeEndpoints.retrieve': {
		input: recordingSchemas.retrieveRealtimeEndpoints.input,
		output: recordingSchemas.retrieveRealtimeEndpoints.output,
	},
	'realtimeEndpoints.update': {
		input: recordingSchemas.updateRealtimeEndpoints.input,
		output: recordingSchemas.updateRealtimeEndpoints.output,
	},
	'sdkUploads.list': {
		input: recordingSchemas.listSdkUploads.input,
		output: recordingSchemas.listSdkUploads.output,
	},
	'sdkUploads.create': {
		input: recordingSchemas.createSdkUpload.input,
		output: recordingSchemas.createSdkUpload.output,
	},
	'sdkUploads.retrieve': {
		input: recordingSchemas.retrieveSdkUpload.input,
		output: recordingSchemas.retrieveSdkUpload.output,
	},
	'meetingMetadata.list': {
		input: ArtifactListInputSchema,
		output: ArtifactListResponseSchema,
	},
	'meetingMetadata.retrieve': {
		input: RetrieveArtifactInputSchema,
		output: ArtifactResponseSchema,
	},
	'meetingMetadata.update': {
		input: RecallaiEndpointInputSchemas.updateMeetingMetadata,
		output: ArtifactResponseSchema,
	},
	'meetingMetadata.delete': {
		input: RecallaiEndpointInputSchemas.deleteMeetingMetadata,
		output: z.undefined(),
	},
	'participantEvents.list': {
		input: ArtifactListInputSchema,
		output: ArtifactListResponseSchema,
	},
	'participantEvents.retrieve': {
		input: RetrieveArtifactInputSchema,
		output: ArtifactResponseSchema,
	},
	'participantEvents.update': {
		input: UpdateParticipantEventsInputSchema,
		output: ArtifactResponseSchema,
	},
	'participantEvents.delete': {
		input: RecallaiEndpointInputSchemas.deleteParticipantEvents,
		output: z.undefined(),
	},
	'transcripts.list': {
		input: ArtifactListInputSchema,
		output: ArtifactListResponseSchema,
	},
	'transcripts.retrieve': {
		input: RetrieveArtifactInputSchema,
		output: ArtifactResponseSchema,
	},
	'transcripts.update': {
		input: RecallaiEndpointInputSchemas.updateTranscript,
		output: ArtifactResponseSchema,
	},
	'transcripts.delete': {
		input: RecallaiEndpointInputSchemas.deleteTranscript,
		output: z.undefined(),
	},
	'audioMixed.list': {
		input: mediaSchemas.audioMixed.list.input,
		output: mediaSchemas.audioMixed.list.output,
	},
	'audioMixed.retrieve': {
		input: mediaSchemas.audioMixed.retrieve.input,
		output: mediaSchemas.audioMixed.retrieve.output,
	},
	'audioMixed.update': {
		input: mediaSchemas.audioMixed.update.input,
		output: mediaSchemas.audioMixed.update.output,
	},
	'audioMixed.delete': {
		input: mediaSchemas.audioMixed.delete.input,
		output: mediaSchemas.audioMixed.delete.output,
	},
	'audioSeparate.list': {
		input: mediaSchemas.audioSeparate.list.input,
		output: mediaSchemas.audioSeparate.list.output,
	},
	'audioSeparate.retrieve': {
		input: mediaSchemas.audioSeparate.retrieve.input,
		output: mediaSchemas.audioSeparate.retrieve.output,
	},
	'audioSeparate.update': {
		input: mediaSchemas.audioSeparate.update.input,
		output: mediaSchemas.audioSeparate.update.output,
	},
	'audioSeparate.delete': {
		input: mediaSchemas.audioSeparate.delete.input,
		output: mediaSchemas.audioSeparate.delete.output,
	},
	'videoMixed.list': {
		input: mediaSchemas.videoMixed.list.input,
		output: mediaSchemas.videoMixed.list.output,
	},
	'videoMixed.retrieve': {
		input: mediaSchemas.videoMixed.retrieve.input,
		output: mediaSchemas.videoMixed.retrieve.output,
	},
	'videoMixed.update': {
		input: mediaSchemas.videoMixed.update.input,
		output: mediaSchemas.videoMixed.update.output,
	},
	'videoMixed.delete': {
		input: mediaSchemas.videoMixed.delete.input,
		output: mediaSchemas.videoMixed.delete.output,
	},
	'videoSeparate.list': {
		input: mediaSchemas.videoSeparate.list.input,
		output: mediaSchemas.videoSeparate.list.output,
	},
	'videoSeparate.retrieve': {
		input: mediaSchemas.videoSeparate.retrieve.input,
		output: mediaSchemas.videoSeparate.retrieve.output,
	},
	'videoSeparate.update': {
		input: mediaSchemas.videoSeparate.update.input,
		output: mediaSchemas.videoSeparate.update.output,
	},
	'videoSeparate.delete': {
		input: mediaSchemas.videoSeparate.delete.input,
		output: mediaSchemas.videoSeparate.delete.output,
	},
	'calendar.authenticate': {
		input: CalendarAuthenticateInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.listMeetings': {
		input: CalendarMeetingsListInputSchema,
		output: CalendarArrayResponseSchema,
	},
	'calendar.retrieveMeeting': {
		input: CalendarMeetingInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.updateMeeting': {
		input: CalendarMeetingUpdateInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.refreshMeetings': {
		input: CalendarUserAuthInputSchema,
		output: CalendarArrayResponseSchema,
	},
	'calendar.retrieveUser': {
		input: CalendarUserAuthInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.updateUser': {
		input: CalendarUserUpdateInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.deleteUser': {
		input: CalendarUserAuthInputSchema,
		output: CalendarUndefinedResponseSchema,
	},
	'calendar.disconnectPlatform': {
		input: CalendarDisconnectInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.listUsers': {
		input: CalendarUsersListInputSchema,
		output: CalendarUsersResponseSchema,
	},
	'calendar.listEvents': {
		input: CalendarEventsListInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.retrieveEvent': {
		input: CalendarEventInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.scheduleBot': {
		input: CalendarEventBotInputSchema,
		output: CalendarObjectResponseSchema,
	},
	'calendar.unscheduleBot': {
		input: CalendarEventInputSchema,
		output: CalendarObjectResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof recallaiEndpointsNested
>;

// unknown: endpoint trees contain nested groups and callable handlers, so the
// wrapper narrows each branch before applying its public Zod contract.
type RecallaiEndpointTree = Record<string, unknown>;
// unknown: the core invokes endpoint handlers with a context and input whose
// concrete types are recovered by the endpoint's public contract.
type RecallaiEndpointHandler = (
	ctx: unknown,
	input: unknown,
) => Promise<unknown>;

function withRecallaiSchemas<T extends RecallaiEndpointTree>(
	tree: T,
	prefix = '',
): T {
	const entries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				recallaiEndpointSchemas[
					operation as keyof typeof recallaiEndpointSchemas
				];
			if (!schema)
				throw new Error(`Missing Recall.ai endpoint schema for ${operation}`);
			const endpoint = value as RecallaiEndpointHandler;
			const validated: RecallaiEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				withRecallaiSchemas(value as RecallaiEndpointTree, operation),
			];
		}
		return [key, value];
	});
	return Object.fromEntries(entries) as T;
}

const validatedRecallaiEndpointsNested = withRecallaiSchemas(
	recallaiEndpointsNested,
);

const recallaiEndpointMeta = {
	'bots.list': {
		riskLevel: 'read',
		description: 'List Recall.ai meeting bots',
	},
	'bots.create': {
		riskLevel: 'write',
		description: 'Create a Recall.ai meeting bot',
	},
	'bots.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai meeting bot',
	},
	'bots.update': {
		riskLevel: 'write',
		description: 'Update a Recall.ai meeting bot',
	},
	'bots.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai meeting bot',
	},
	'botActions.deleteBotMedia': {
		riskLevel: 'destructive',
		description: 'Delete stored media for a Recall.ai bot',
	},
	'botActions.leaveBotCall': {
		riskLevel: 'destructive',
		description: 'Remove a Recall.ai bot from its meeting',
	},
	'botActions.outputAudio': {
		riskLevel: 'write',
		description: 'Output audio from a Recall.ai bot',
	},
	'botActions.stopOutputAudio': {
		riskLevel: 'write',
		description: 'Stop bot audio output in Recall.ai',
	},
	'botActions.outputMedia': {
		riskLevel: 'write',
		description: 'Start media output from a Recall.ai bot',
	},
	'botActions.stopOutputMedia': {
		riskLevel: 'write',
		description: 'Stop bot media output in Recall.ai',
	},
	'botActions.startScreenshare': {
		riskLevel: 'write',
		description: 'Start bot screenshare in Recall.ai',
	},
	'botActions.stopScreenshare': {
		riskLevel: 'write',
		description: 'Stop bot screenshare in Recall.ai',
	},
	'botActions.outputVideo': {
		riskLevel: 'write',
		description: 'Output video from a Recall.ai bot',
	},
	'botActions.stopOutputVideo': {
		riskLevel: 'write',
		description: 'Stop bot video output in Recall.ai',
	},
	'botActions.pauseRecording': {
		riskLevel: 'write',
		description: 'Pause a Recall.ai bot recording',
	},
	'botActions.pinParticipant': {
		riskLevel: 'write',
		description: 'Pin a participant for a Recall.ai bot',
	},
	'botActions.resumeRecording': {
		riskLevel: 'write',
		description: 'Resume a Recall.ai bot recording',
	},
	'botActions.sendChatMessage': {
		riskLevel: 'write',
		description: 'Send a chat message from a Recall.ai bot',
	},
	'botActions.startRecording': {
		riskLevel: 'write',
		description: 'Start a Recall.ai bot recording',
	},
	'botActions.stopRecording': {
		riskLevel: 'write',
		description: 'Stop a Recall.ai bot recording',
	},
	'recordings.list': {
		riskLevel: 'read',
		description: 'List Recall.ai recording artifacts',
	},
	'recordings.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai recording artifact',
	},
	'recordings.update': {
		riskLevel: 'write',
		description: 'Update Recall.ai recording metadata',
	},
	'recordings.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai recording artifact',
	},
	'recordings.createTranscript': {
		riskLevel: 'write',
		description: 'Create an asynchronous Recall.ai transcript',
	},
	'realtimeEndpoints.list': {
		riskLevel: 'read',
		description: 'List Recall.ai real-time endpoints',
	},
	'realtimeEndpoints.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai real-time endpoint',
	},
	'realtimeEndpoints.update': {
		riskLevel: 'write',
		description: 'Update a Recall.ai real-time endpoint',
	},
	'sdkUploads.list': {
		riskLevel: 'read',
		description: 'List Recall.ai Desktop SDK uploads',
	},
	'sdkUploads.create': {
		riskLevel: 'write',
		description: 'Create a Recall.ai Desktop SDK upload',
	},
	'sdkUploads.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai Desktop SDK upload',
	},
	'meetingMetadata.list': {
		riskLevel: 'read',
		description: 'List Recall.ai meeting metadata artifacts',
	},
	'meetingMetadata.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai meeting metadata artifact',
	},
	'meetingMetadata.update': {
		riskLevel: 'write',
		description: 'Update Recall.ai meeting metadata',
	},
	'meetingMetadata.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai meeting metadata artifact',
	},
	'participantEvents.list': {
		riskLevel: 'read',
		description: 'List Recall.ai participant event artifacts',
	},
	'participantEvents.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai participant event artifact',
	},
	'participantEvents.update': {
		riskLevel: 'write',
		description: 'Update Recall.ai participant event metadata',
	},
	'participantEvents.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai participant event artifact',
	},
	'transcripts.list': {
		riskLevel: 'read',
		description: 'List Recall.ai transcript artifacts',
	},
	'transcripts.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai transcript artifact',
	},
	'transcripts.update': {
		riskLevel: 'write',
		description: 'Update Recall.ai transcript metadata',
	},
	'transcripts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai transcript artifact',
	},
	'audioMixed.list': {
		riskLevel: 'read',
		description: 'List mixed audio artifacts',
	},
	'audioMixed.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a mixed audio artifact',
	},
	'audioMixed.update': {
		riskLevel: 'write',
		description: 'Update mixed audio artifact metadata',
	},
	'audioMixed.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mixed audio artifact',
	},
	'audioSeparate.list': {
		riskLevel: 'read',
		description: 'List separate audio artifacts',
	},
	'audioSeparate.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a separate audio artifact',
	},
	'audioSeparate.update': {
		riskLevel: 'write',
		description: 'Update separate audio artifact metadata',
	},
	'audioSeparate.delete': {
		riskLevel: 'destructive',
		description: 'Delete a separate audio artifact',
	},
	'videoMixed.list': {
		riskLevel: 'read',
		description: 'List mixed video artifacts',
	},
	'videoMixed.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a mixed video artifact',
	},
	'videoMixed.update': {
		riskLevel: 'write',
		description: 'Update mixed video artifact metadata',
	},
	'videoMixed.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mixed video artifact',
	},
	'videoSeparate.list': {
		riskLevel: 'read',
		description: 'List separate video artifacts',
	},
	'videoSeparate.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a separate video artifact',
	},
	'videoSeparate.update': {
		riskLevel: 'write',
		description: 'Update separate video artifact metadata',
	},
	'videoSeparate.delete': {
		riskLevel: 'destructive',
		description: 'Delete a separate video artifact',
	},
	'calendar.authenticate': {
		riskLevel: 'write',
		description: 'Create a Recall.ai calendar auth token',
	},
	'calendar.listMeetings': {
		riskLevel: 'read',
		description: 'List Recall.ai calendar meetings',
	},
	'calendar.retrieveMeeting': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai calendar meeting',
	},
	'calendar.updateMeeting': {
		riskLevel: 'write',
		description: 'Update a Recall.ai calendar meeting',
	},
	'calendar.refreshMeetings': {
		riskLevel: 'write',
		description: 'Refresh Recall.ai calendar meetings',
	},
	'calendar.retrieveUser': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai calendar user',
	},
	'calendar.updateUser': {
		riskLevel: 'write',
		description: 'Update a Recall.ai calendar user',
	},
	'calendar.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete a Recall.ai calendar user',
	},
	'calendar.disconnectPlatform': {
		riskLevel: 'destructive',
		description: 'Disconnect a Recall.ai calendar platform',
	},
	'calendar.listUsers': {
		riskLevel: 'read',
		description: 'List Recall.ai calendar users',
	},
	'calendar.listEvents': {
		riskLevel: 'read',
		description: 'List Recall.ai calendar events',
	},
	'calendar.retrieveEvent': {
		riskLevel: 'read',
		description: 'Retrieve a Recall.ai calendar event',
	},
	'calendar.scheduleBot': {
		riskLevel: 'write',
		description: 'Schedule a Recall.ai bot for a calendar event',
	},
	'calendar.unscheduleBot': {
		riskLevel: 'destructive',
		description: 'Remove a scheduled Recall.ai bot from a calendar event',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof recallaiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const recallaiAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseRecallaiPlugin<T extends RecallaiPluginOptions> = CorsairPlugin<
	'recallai',
	typeof RecallaiSchema,
	typeof recallaiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalRecallaiPlugin = BaseRecallaiPlugin<RecallaiPluginOptions>;
export type ExternalRecallaiPlugin<T extends RecallaiPluginOptions> =
	BaseRecallaiPlugin<T>;

export function recallai<const T extends RecallaiPluginOptions>(
	incomingOptions: RecallaiPluginOptions & T = {} as RecallaiPluginOptions & T,
): ExternalRecallaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'recallai',
		authConfig: recallaiAuthConfig,
		schema: RecallaiSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedRecallaiEndpointsNested,
		webhooks: {},
		endpointMeta: recallaiEndpointMeta,
		endpointSchemas: recallaiEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: RecallaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('recallai', 'api_key');
		},
	} satisfies InternalRecallaiPlugin;
}

export type {
	RecallaiEndpointInputs,
	RecallaiEndpointOutputs,
} from './endpoints/types';
