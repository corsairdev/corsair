import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	ArchiveFiles,
	Devices,
	Meetings,
	Participants,
	Recordings,
	Reports,
	Webinars,
} from './endpoints';
import type {
	ZoomEndpointInputs,
	ZoomEndpointOutputs,
} from './endpoints/types';
import {
	ZoomEndpointInputSchemas,
	ZoomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZoomSchema } from './schema';
import {
	MeetingWebhooks,
	RecordingWebhooks,
	WebinarWebhooks,
} from './webhooks';
import type {
	MeetingCancelledEvent,
	MeetingCreatedEvent,
	MeetingEndedEvent,
	MeetingParticipantJoinedEvent,
	MeetingParticipantLeftEvent,
	MeetingStartedEvent,
	RecordingCompletedEvent,
	WebinarStartedEvent,
	ZoomWebhookOutputs,
} from './webhooks/types';
import {
	MeetingCancelledPayloadSchema,
	MeetingCreatedPayloadSchema,
	MeetingEndedPayloadSchema,
	MeetingParticipantJoinedPayloadSchema,
	MeetingParticipantLeftPayloadSchema,
	MeetingStartedPayloadSchema,
	RecordingCompletedPayloadSchema,
	WebinarStartedPayloadSchema,
} from './webhooks/types';

export type ZoomPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZoomPlugin['hooks'];
	webhookHooks?: InternalZoomPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zoomEndpointsNested>;
};

export type ZoomContext = CorsairPluginContext<
	typeof ZoomSchema,
	ZoomPluginOptions
>;

export type ZoomKeyBuilderContext = KeyBuilderContext<ZoomPluginOptions>;

export type ZoomBoundEndpoints = BindEndpoints<typeof zoomEndpointsNested>;

type ZoomEndpoint<K extends keyof ZoomEndpointOutputs> = CorsairEndpoint<
	ZoomContext,
	ZoomEndpointInputs[K],
	ZoomEndpointOutputs[K]
>;

export type ZoomEndpoints = {
	meetingsCreate: ZoomEndpoint<'meetingsCreate'>;
	meetingsGet: ZoomEndpoint<'meetingsGet'>;
	meetingsList: ZoomEndpoint<'meetingsList'>;
	meetingsUpdate: ZoomEndpoint<'meetingsUpdate'>;
	meetingsAddRegistrant: ZoomEndpoint<'meetingsAddRegistrant'>;
	meetingsGetSummary: ZoomEndpoint<'meetingsGetSummary'>;
	recordingsGetMeeting: ZoomEndpoint<'recordingsGetMeeting'>;
	recordingsDeleteMeeting: ZoomEndpoint<'recordingsDeleteMeeting'>;
	recordingsListAll: ZoomEndpoint<'recordingsListAll'>;
	webinarsGet: ZoomEndpoint<'webinarsGet'>;
	webinarsList: ZoomEndpoint<'webinarsList'>;
	webinarsAddRegistrant: ZoomEndpoint<'webinarsAddRegistrant'>;
	webinarsListParticipants: ZoomEndpoint<'webinarsListParticipants'>;
	reportsDailyUsage: ZoomEndpoint<'reportsDailyUsage'>;
	participantsGetPastMeeting: ZoomEndpoint<'participantsGetPastMeeting'>;
	devicesList: ZoomEndpoint<'devicesList'>;
	archiveFilesList: ZoomEndpoint<'archiveFilesList'>;
};

type ZoomWebhook<K extends keyof ZoomWebhookOutputs, TEvent> = CorsairWebhook<
	ZoomContext,
	TEvent,
	ZoomWebhookOutputs[K]
>;

export type ZoomWebhooks = {
	meetingCreated: ZoomWebhook<'meetingCreated', MeetingCreatedEvent>;
	meetingCancelled: ZoomWebhook<'meetingCancelled', MeetingCancelledEvent>;
	meetingStarted: ZoomWebhook<'meetingStarted', MeetingStartedEvent>;
	meetingEnded: ZoomWebhook<'meetingEnded', MeetingEndedEvent>;
	meetingParticipantJoined: ZoomWebhook<
		'meetingParticipantJoined',
		MeetingParticipantJoinedEvent
	>;
	meetingParticipantLeft: ZoomWebhook<
		'meetingParticipantLeft',
		MeetingParticipantLeftEvent
	>;
	recordingCompleted: ZoomWebhook<
		'recordingCompleted',
		RecordingCompletedEvent
	>;
	webinarStarted: ZoomWebhook<'webinarStarted', WebinarStartedEvent>;
};

export type ZoomBoundWebhooks = BindWebhooks<ZoomWebhooks>;

const zoomEndpointsNested = {
	meetings: {
		create: Meetings.create,
		get: Meetings.get,
		list: Meetings.list,
		update: Meetings.update,
		addRegistrant: Meetings.addRegistrant,
		getSummary: Meetings.getSummary,
	},
	recordings: {
		getMeeting: Recordings.getMeeting,
		deleteMeeting: Recordings.deleteMeeting,
		listAll: Recordings.listAll,
	},
	webinars: {
		get: Webinars.get,
		list: Webinars.list,
		addRegistrant: Webinars.addRegistrant,
		listParticipants: Webinars.listParticipants,
	},
	reports: {
		dailyUsage: Reports.dailyUsage,
	},
	participants: {
		getPastMeeting: Participants.getPastMeeting,
	},
	devices: {
		list: Devices.list,
	},
	archiveFiles: {
		list: ArchiveFiles.list,
	},
} as const;

const zoomWebhooksNested = {
	meetings: {
		created: MeetingWebhooks.created,
		cancelled: MeetingWebhooks.cancelled,
		started: MeetingWebhooks.started,
		ended: MeetingWebhooks.ended,
		participantJoined: MeetingWebhooks.participantJoined,
		participantLeft: MeetingWebhooks.participantLeft,
	},
	recordings: {
		completed: RecordingWebhooks.completed,
	},
	webinars: {
		started: WebinarWebhooks.started,
	},
} as const;

export const zoomEndpointSchemas = {
	'meetings.create': {
		input: ZoomEndpointInputSchemas.meetingsCreate,
		output: ZoomEndpointOutputSchemas.meetingsCreate,
	},
	'meetings.get': {
		input: ZoomEndpointInputSchemas.meetingsGet,
		output: ZoomEndpointOutputSchemas.meetingsGet,
	},
	'meetings.list': {
		input: ZoomEndpointInputSchemas.meetingsList,
		output: ZoomEndpointOutputSchemas.meetingsList,
	},
	'meetings.update': {
		input: ZoomEndpointInputSchemas.meetingsUpdate,
		output: ZoomEndpointOutputSchemas.meetingsUpdate,
	},
	'meetings.addRegistrant': {
		input: ZoomEndpointInputSchemas.meetingsAddRegistrant,
		output: ZoomEndpointOutputSchemas.meetingsAddRegistrant,
	},
	'meetings.getSummary': {
		input: ZoomEndpointInputSchemas.meetingsGetSummary,
		output: ZoomEndpointOutputSchemas.meetingsGetSummary,
	},
	'recordings.getMeeting': {
		input: ZoomEndpointInputSchemas.recordingsGetMeeting,
		output: ZoomEndpointOutputSchemas.recordingsGetMeeting,
	},
	'recordings.deleteMeeting': {
		input: ZoomEndpointInputSchemas.recordingsDeleteMeeting,
		output: ZoomEndpointOutputSchemas.recordingsDeleteMeeting,
	},
	'recordings.listAll': {
		input: ZoomEndpointInputSchemas.recordingsListAll,
		output: ZoomEndpointOutputSchemas.recordingsListAll,
	},
	'webinars.get': {
		input: ZoomEndpointInputSchemas.webinarsGet,
		output: ZoomEndpointOutputSchemas.webinarsGet,
	},
	'webinars.list': {
		input: ZoomEndpointInputSchemas.webinarsList,
		output: ZoomEndpointOutputSchemas.webinarsList,
	},
	'webinars.addRegistrant': {
		input: ZoomEndpointInputSchemas.webinarsAddRegistrant,
		output: ZoomEndpointOutputSchemas.webinarsAddRegistrant,
	},
	'webinars.listParticipants': {
		input: ZoomEndpointInputSchemas.webinarsListParticipants,
		output: ZoomEndpointOutputSchemas.webinarsListParticipants,
	},
	'reports.dailyUsage': {
		input: ZoomEndpointInputSchemas.reportsDailyUsage,
		output: ZoomEndpointOutputSchemas.reportsDailyUsage,
	},
	'participants.getPastMeeting': {
		input: ZoomEndpointInputSchemas.participantsGetPastMeeting,
		output: ZoomEndpointOutputSchemas.participantsGetPastMeeting,
	},
	'devices.list': {
		input: ZoomEndpointInputSchemas.devicesList,
		output: ZoomEndpointOutputSchemas.devicesList,
	},
	'archiveFiles.list': {
		input: ZoomEndpointInputSchemas.archiveFilesList,
		output: ZoomEndpointOutputSchemas.archiveFilesList,
	},
} as const;

const zoomWebhookSchemas = {
	'meetings.created': {
		description: 'A meeting has been created',
		payload: MeetingCreatedPayloadSchema,
		response: MeetingCreatedPayloadSchema,
	},
	'meetings.cancelled': {
		description: 'A meeting has been cancelled or deleted',
		payload: MeetingCancelledPayloadSchema,
		response: MeetingCancelledPayloadSchema,
	},
	'meetings.started': {
		description: 'A meeting has started',
		payload: MeetingStartedPayloadSchema,
		response: MeetingStartedPayloadSchema,
	},
	'meetings.ended': {
		description: 'A meeting has ended',
		payload: MeetingEndedPayloadSchema,
		response: MeetingEndedPayloadSchema,
	},
	'meetings.participantJoined': {
		description: 'A participant joined a meeting',
		payload: MeetingParticipantJoinedPayloadSchema,
		response: MeetingParticipantJoinedPayloadSchema,
	},
	'meetings.participantLeft': {
		description: 'A participant left a meeting',
		payload: MeetingParticipantLeftPayloadSchema,
		response: MeetingParticipantLeftPayloadSchema,
	},
	'recordings.completed': {
		description: 'A cloud recording has completed processing',
		payload: RecordingCompletedPayloadSchema,
		response: RecordingCompletedPayloadSchema,
	},
	'webinars.started': {
		description: 'A webinar has started',
		payload: WebinarStartedPayloadSchema,
		response: WebinarStartedPayloadSchema,
	},
} as const;

const zoomEndpointMeta = {
	'meetings.create': {
		riskLevel: 'write',
		description: 'Create a new meeting for the authenticated user',
	},
	'meetings.get': {
		riskLevel: 'read',
		description: 'Get details of a specific meeting',
	},
	'meetings.list': {
		riskLevel: 'read',
		description: 'List all meetings for the authenticated user',
	},
	'meetings.update': {
		riskLevel: 'write',
		description: 'Update a meeting',
	},
	'meetings.addRegistrant': {
		riskLevel: 'write',
		description: 'Add a registrant to a meeting',
	},
	'meetings.getSummary': {
		riskLevel: 'read',
		description: 'Get the AI-generated summary of a meeting',
	},
	'recordings.getMeeting': {
		riskLevel: 'read',
		description: 'Get cloud recordings for a specific meeting',
	},
	'recordings.deleteMeeting': {
		riskLevel: 'destructive',
		description: 'Delete cloud recordings for a meeting [DESTRUCTIVE]',
	},
	'recordings.listAll': {
		riskLevel: 'read',
		description: 'List all cloud recordings for the authenticated user',
	},
	'webinars.get': {
		riskLevel: 'read',
		description: 'Get details of a specific webinar',
	},
	'webinars.list': {
		riskLevel: 'read',
		description: 'List all webinars for the authenticated user',
	},
	'webinars.addRegistrant': {
		riskLevel: 'write',
		description: 'Add a registrant to a webinar',
	},
	'webinars.listParticipants': {
		riskLevel: 'read',
		description: 'List participants of a past webinar',
	},
	'reports.dailyUsage': {
		riskLevel: 'read',
		description: 'Get the daily usage report for a given month',
	},
	'participants.getPastMeeting': {
		riskLevel: 'read',
		description: 'Get participants of a past meeting',
	},
	'devices.list': {
		riskLevel: 'read',
		description: 'List all Zoom devices',
	},
	'archiveFiles.list': {
		riskLevel: 'read',
		description: 'List all archived meeting or webinar files',
	},
} satisfies RequiredPluginEndpointMeta<typeof zoomEndpointsNested>;

export const zoomAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType = 'oauth_2' as const;

export type BaseZoomPlugin<PluginOptions extends ZoomPluginOptions> =
	CorsairPlugin<
		'zoom',
		typeof ZoomSchema,
		typeof zoomEndpointsNested,
		typeof zoomWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

export type InternalZoomPlugin = BaseZoomPlugin<ZoomPluginOptions>;

export type ExternalZoomPlugin<PluginOptions extends ZoomPluginOptions> =
	BaseZoomPlugin<PluginOptions>;

export function zoom<const PluginOptions extends ZoomPluginOptions>(
	// Default to empty object; callers that omit options satisfy the constraint at runtime
	incomingOptions: ZoomPluginOptions & PluginOptions = {} as ZoomPluginOptions &
		PluginOptions,
): ExternalZoomPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zoom',
		schema: ZoomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zoomEndpointsNested,
		webhooks: zoomWebhooksNested,
		endpointMeta: zoomEndpointMeta,
		endpointSchemas: zoomEndpointSchemas,
		webhookSchemas: zoomWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-zm-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZoomKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalZoomPlugin;
}

export type {
	ArchiveFileListResponse,
	DeviceListResponse,
	MeetingAddRegistrantResponse,
	MeetingCreateResponse,
	MeetingGetResponse,
	MeetingGetSummaryResponse,
	MeetingListResponse,
	MeetingUpdateResponse,
	ParticipantGetPastMeetingResponse,
	RecordingDeleteMeetingResponse,
	RecordingGetMeetingResponse,
	RecordingListAllResponse,
	ReportDailyUsageResponse,
	WebinarAddRegistrantResponse,
	WebinarGetResponse,
	WebinarListParticipantsResponse,
	WebinarListResponse,
	ZoomEndpointInputs,
	ZoomEndpointOutputs,
} from './endpoints/types';
export type {
	MeetingCancelledEvent,
	MeetingCreatedEvent,
	MeetingEndedEvent,
	MeetingParticipantJoinedEvent,
	MeetingParticipantLeftEvent,
	MeetingStartedEvent,
	RecordingCompletedEvent,
	WebinarStartedEvent,
	ZoomWebhookOutputs,
} from './webhooks/types';
export { createZoomEventMatch } from './webhooks/types';
