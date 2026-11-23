import type {
	AuthTypes,
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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Meetings, Recordings, Teams, Users, Webhooks } from './endpoints';
import type {
	FathomAiEndpointInputs,
	FathomAiEndpointOutputs,
} from './endpoints/types';
import {
	FathomAiEndpointInputSchemas,
	FathomAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FathomAiSchema } from './schema';
import { MeetingWebhooks, withClaimRelease } from './webhooks';
import type {
	FathomAiWebhookOutputs,
	MeetingContentReadyEvent,
} from './webhooks/types';
import {
	isFathomAiDelivery,
	MeetingContentReadyEventSchema,
} from './webhooks/types';

export type FathomAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalFathomAiPlugin['hooks'];
	webhookHooks?: InternalFathomAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fathomAiEndpointsNested>;
};

export type FathomAiContext = CorsairPluginContext<
	typeof FathomAiSchema,
	FathomAiPluginOptions
>;

export type FathomAiKeyBuilderContext =
	KeyBuilderContext<FathomAiPluginOptions>;

export type FathomAiBoundEndpoints = BindEndpoints<
	typeof fathomAiEndpointsNested
>;

type FathomAiEndpoint<K extends keyof FathomAiEndpointOutputs> =
	CorsairEndpoint<
		FathomAiContext,
		FathomAiEndpointInputs[K],
		FathomAiEndpointOutputs[K]
	>;

export type FathomAiEndpoints = {
	meetingsList: FathomAiEndpoint<'meetingsList'>;
	meetingTypesList: FathomAiEndpoint<'meetingTypesList'>;
	recordingsGetSummary: FathomAiEndpoint<'recordingsGetSummary'>;
	recordingsGetTranscript: FathomAiEndpoint<'recordingsGetTranscript'>;
	recordingsSendSummary: FathomAiEndpoint<'recordingsSendSummary'>;
	recordingsSendTranscript: FathomAiEndpoint<'recordingsSendTranscript'>;
	recordingsRequestDownload: FathomAiEndpoint<'recordingsRequestDownload'>;
	recordingsGetDownload: FathomAiEndpoint<'recordingsGetDownload'>;
	teamsList: FathomAiEndpoint<'teamsList'>;
	teamMembersList: FathomAiEndpoint<'teamMembersList'>;
	usersList: FathomAiEndpoint<'usersList'>;
	webhooksCreate: FathomAiEndpoint<'webhooksCreate'>;
	webhooksDelete: FathomAiEndpoint<'webhooksDelete'>;
};

export type FathomAiWebhooks = {
	meetingContentReady: CorsairWebhook<
		FathomAiContext,
		MeetingContentReadyEvent,
		FathomAiWebhookOutputs['meetingContentReady']
	>;
};

export type FathomAiBoundWebhooks = BindWebhooks<typeof fathomAiWebhooksNested>;

const fathomAiEndpointsNested = {
	meetings: {
		list: Meetings.list,
	},
	meetingTypes: {
		list: Meetings.listTypes,
	},
	recordings: {
		getSummary: Recordings.getSummary,
		getTranscript: Recordings.getTranscript,
		sendSummary: Recordings.sendSummary,
		sendTranscript: Recordings.sendTranscript,
		requestDownload: Recordings.requestDownload,
		getDownload: Recordings.getDownload,
	},
	teams: {
		list: Teams.list,
	},
	teamMembers: {
		list: Teams.listMembers,
	},
	users: {
		list: Users.list,
	},
	webhooks: {
		create: Webhooks.create,
		delete: Webhooks.remove,
	},
} as const;

const fathomAiWebhooksNested = {
	meetings: {
		contentReady: MeetingWebhooks.contentReady,
	},
} as const;

export const fathomAiEndpointSchemas = {
	'meetings.list': {
		input: FathomAiEndpointInputSchemas.meetingsList,
		output: FathomAiEndpointOutputSchemas.meetingsList,
	},
	'meetingTypes.list': {
		input: FathomAiEndpointInputSchemas.meetingTypesList,
		output: FathomAiEndpointOutputSchemas.meetingTypesList,
	},
	'recordings.getSummary': {
		input: FathomAiEndpointInputSchemas.recordingsGetSummary,
		output: FathomAiEndpointOutputSchemas.recordingsGetSummary,
	},
	'recordings.getTranscript': {
		input: FathomAiEndpointInputSchemas.recordingsGetTranscript,
		output: FathomAiEndpointOutputSchemas.recordingsGetTranscript,
	},
	'recordings.sendSummary': {
		input: FathomAiEndpointInputSchemas.recordingsSendSummary,
		output: FathomAiEndpointOutputSchemas.recordingsSendSummary,
	},
	'recordings.sendTranscript': {
		input: FathomAiEndpointInputSchemas.recordingsSendTranscript,
		output: FathomAiEndpointOutputSchemas.recordingsSendTranscript,
	},
	'recordings.requestDownload': {
		input: FathomAiEndpointInputSchemas.recordingsRequestDownload,
		output: FathomAiEndpointOutputSchemas.recordingsRequestDownload,
	},
	'recordings.getDownload': {
		input: FathomAiEndpointInputSchemas.recordingsGetDownload,
		output: FathomAiEndpointOutputSchemas.recordingsGetDownload,
	},
	'teams.list': {
		input: FathomAiEndpointInputSchemas.teamsList,
		output: FathomAiEndpointOutputSchemas.teamsList,
	},
	'teamMembers.list': {
		input: FathomAiEndpointInputSchemas.teamMembersList,
		output: FathomAiEndpointOutputSchemas.teamMembersList,
	},
	'users.list': {
		input: FathomAiEndpointInputSchemas.usersList,
		output: FathomAiEndpointOutputSchemas.usersList,
	},
	'webhooks.create': {
		input: FathomAiEndpointInputSchemas.webhooksCreate,
		output: FathomAiEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: FathomAiEndpointInputSchemas.webhooksDelete,
		output: FathomAiEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof fathomAiEndpointsNested
>;

const fathomAiWebhookSchemas = {
	'meetings.contentReady': {
		description:
			'A recorded meeting finished processing; carries the meeting with the transcript, summary, action items and CRM matches the webhook was set to include',
		payload: MeetingContentReadyEventSchema,
		response: MeetingContentReadyEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof fathomAiWebhooksNested
>;

const fathomAiEndpointMeta = {
	'meetings.list': {
		riskLevel: 'read',
		description:
			'List recorded meetings with filters, optionally including transcript, summary, action items, highlights and CRM matches',
	},
	'meetingTypes.list': {
		riskLevel: 'read',
		description: 'List the org meeting types; their names filter meetings.list',
	},
	'recordings.getSummary': {
		riskLevel: 'read',
		description: 'Get the AI summary of a recording',
	},
	'recordings.getTranscript': {
		riskLevel: 'read',
		description: 'Get the speaker-labelled transcript of a recording',
	},
	// Sends meeting content to a server the caller picks (R8: a send is destructive).
	'recordings.sendSummary': {
		riskLevel: 'destructive',
		description:
			'Have Fathom POST the AI summary of a recording to a destination_url',
	},
	'recordings.sendTranscript': {
		riskLevel: 'destructive',
		description:
			'Have Fathom POST the speaker-labelled transcript of a recording to a destination_url',
	},
	'recordings.requestDownload': {
		riskLevel: 'write',
		description:
			'Start generating a downloadable video or audio file for a recording',
	},
	'recordings.getDownload': {
		riskLevel: 'read',
		description:
			'Poll a recording download; a completed one carries a signed file URL valid for about 24 hours',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams in the Fathom account',
	},
	'teamMembers.list': {
		riskLevel: 'read',
		description: 'List team members, optionally filtered by team name',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List account users with their status and permissions. Needs an account admin key',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook that fires when new meeting content is ready; returns its signing secret once',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook so it stops receiving meeting content',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fathomAiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const fathomAiAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseFathomAiPlugin<T extends FathomAiPluginOptions> = CorsairPlugin<
	'fathomai',
	typeof FathomAiSchema,
	typeof fathomAiEndpointsNested,
	typeof fathomAiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalFathomAiPlugin = BaseFathomAiPlugin<FathomAiPluginOptions>;

export type ExternalFathomAiPlugin<T extends FathomAiPluginOptions> =
	BaseFathomAiPlugin<T>;

export function fathomai<const T extends FathomAiPluginOptions>(
	// Safe: every FathomAiPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: FathomAiPluginOptions & T = {} as FathomAiPluginOptions & T,
): ExternalFathomAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fathomai',
		authConfig: fathomAiAuthConfig,
		schema: FathomAiSchema,
		options,
		hooks: options.hooks,
		webhookHooks: withClaimRelease(options.webhookHooks),
		endpoints: fathomAiEndpointsNested,
		webhooks: fathomAiWebhooksNested,
		endpointMeta: fathomAiEndpointMeta,
		endpointSchemas: fathomAiEndpointSchemas,
		webhookSchemas: fathomAiWebhookSchemas,
		pluginWebhookMatcher: isFathomAiDelivery,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FathomAiKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}
			if (options.key) return options.key;
			return (await ctx.keys.get_api_key()) ?? '';
		},
	} satisfies InternalFathomAiPlugin;
}

export type {
	FathomAiEndpointInputs,
	FathomAiEndpointOutputs,
	Meeting,
	MeetingType,
	RecordingDownload,
	Team,
	TeamMember,
	User,
	Webhook,
} from './endpoints/types';
export type {
	FathomAiWebhookOutputs,
	MeetingContentReadyEvent,
} from './webhooks/types';
