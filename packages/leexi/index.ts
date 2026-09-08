import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Calls, MeetingEvents, Teams, Users } from './endpoints';
import type {
	LeexiEndpointInputs,
	LeexiEndpointOutputs,
} from './endpoints/types';
import {
	LeexiEndpointInputSchemas,
	LeexiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LeexiSchema } from './schema';

export type LeexiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Leexi API Key ID (Basic auth username half) */
	key?: string;
	/** Leexi API Key Secret (Basic auth password half) */
	keySecret?: string;
	hooks?: InternalLeexiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof leexiEndpointsNested>;
};

export type LeexiContext = CorsairPluginContext<
	typeof LeexiSchema,
	LeexiPluginOptions,
	undefined,
	typeof leexiAuthConfig
>;

export type LeexiKeyBuilderContext = KeyBuilderContext<
	LeexiPluginOptions,
	typeof leexiAuthConfig
>;

export type LeexiBoundEndpoints = BindEndpoints<typeof leexiEndpointsNested>;

type LeexiEndpoint<K extends keyof LeexiEndpointOutputs> = CorsairEndpoint<
	LeexiContext,
	LeexiEndpointInputs[K],
	LeexiEndpointOutputs[K]
>;

export type LeexiEndpoints = {
	meetingEventsList: LeexiEndpoint<'meetingEventsList'>;
	meetingEventsGet: LeexiEndpoint<'meetingEventsGet'>;
	meetingEventsCreate: LeexiEndpoint<'meetingEventsCreate'>;
	meetingEventsDelete: LeexiEndpoint<'meetingEventsDelete'>;
	callsList: LeexiEndpoint<'callsList'>;
	callsGet: LeexiEndpoint<'callsGet'>;
	callsRequestPresignedUrl: LeexiEndpoint<'callsRequestPresignedUrl'>;
	teamsList: LeexiEndpoint<'teamsList'>;
	usersList: LeexiEndpoint<'usersList'>;
};

export type LeexiWebhooks = Record<string, never>;
export type LeexiBoundWebhooks = BindWebhooks<LeexiWebhooks>;

const leexiEndpointsNested = {
	meetingEvents: {
		list: MeetingEvents.list,
		get: MeetingEvents.get,
		create: MeetingEvents.create,
		delete: MeetingEvents.deleteMeetingEvent,
	},
	calls: {
		list: Calls.list,
		get: Calls.get,
		requestPresignedUrl: Calls.requestPresignedUrl,
	},
	teams: {
		list: Teams.list,
	},
	users: {
		list: Users.list,
	},
} as const;

const leexiWebhooksNested = {} as const;

export const leexiEndpointSchemas = {
	'meetingEvents.list': {
		input: LeexiEndpointInputSchemas.meetingEventsList,
		output: LeexiEndpointOutputSchemas.meetingEventsList,
	},
	'meetingEvents.get': {
		input: LeexiEndpointInputSchemas.meetingEventsGet,
		output: LeexiEndpointOutputSchemas.meetingEventsGet,
	},
	'meetingEvents.create': {
		input: LeexiEndpointInputSchemas.meetingEventsCreate,
		output: LeexiEndpointOutputSchemas.meetingEventsCreate,
	},
	'meetingEvents.delete': {
		input: LeexiEndpointInputSchemas.meetingEventsDelete,
		output: LeexiEndpointOutputSchemas.meetingEventsDelete,
	},
	'calls.list': {
		input: LeexiEndpointInputSchemas.callsList,
		output: LeexiEndpointOutputSchemas.callsList,
	},
	'calls.get': {
		input: LeexiEndpointInputSchemas.callsGet,
		output: LeexiEndpointOutputSchemas.callsGet,
	},
	'calls.requestPresignedUrl': {
		input: LeexiEndpointInputSchemas.callsRequestPresignedUrl,
		output: LeexiEndpointOutputSchemas.callsRequestPresignedUrl,
	},
	'teams.list': {
		input: LeexiEndpointInputSchemas.teamsList,
		output: LeexiEndpointOutputSchemas.teamsList,
	},
	'users.list': {
		input: LeexiEndpointInputSchemas.usersList,
		output: LeexiEndpointOutputSchemas.usersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof leexiEndpointsNested>;

const leexiWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof leexiWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const leexiEndpointMeta = {
	'meetingEvents.list': {
		riskLevel: 'read',
		description: 'List meeting events in the Leexi workspace with pagination',
	},
	'meetingEvents.get': {
		riskLevel: 'read',
		description: 'Get a specific meeting event by UUID',
	},
	'meetingEvents.create': {
		riskLevel: 'write',
		description:
			'Create a new meeting event in Leexi with timing, participants, and recording preferences',
	},
	'meetingEvents.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a meeting event by UUID',
		irreversible: true,
	},
	'calls.list': {
		riskLevel: 'read',
		description: 'List call records with pagination and filters',
	},
	'calls.get': {
		riskLevel: 'read',
		description:
			'Get a specific call including topics and transcripts with paragraph and word-level timestamps',
	},
	'calls.requestPresignedUrl': {
		riskLevel: 'write',
		description:
			'Generate a presigned upload URL for a call recording (expires after 3 days if unused)',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams in the Leexi workspace with pagination',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users in the Leexi workspace with pagination',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof leexiEndpointsNested>;

export const leexiAuthConfig = {
	api_key: {
		account: ['key_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLeexiPlugin<T extends LeexiPluginOptions> = CorsairPlugin<
	'leexi',
	typeof LeexiSchema,
	typeof leexiEndpointsNested,
	typeof leexiWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof leexiAuthConfig
>;

export type InternalLeexiPlugin = BaseLeexiPlugin<LeexiPluginOptions>;

export type ExternalLeexiPlugin<T extends LeexiPluginOptions> =
	BaseLeexiPlugin<T>;

export function leexi<const T extends LeexiPluginOptions>(
	incomingOptions: LeexiPluginOptions & T = {} as LeexiPluginOptions & T,
): ExternalLeexiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'leexi',
		authConfig: leexiAuthConfig,
		schema: LeexiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: leexiEndpointsNested,
		webhooks: leexiWebhooksNested,
		endpointMeta: leexiEndpointMeta,
		endpointSchemas: leexiEndpointSchemas,
		webhookSchemas: leexiWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LeexiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('leexi', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('leexi', 'api_key');
		},
	} satisfies InternalLeexiPlugin;
}

export type {
	CallsGetResponse,
	CallsListInput,
	CallsListResponse,
	CallsRequestPresignedUrlInput,
	CallsRequestPresignedUrlResponse,
	LeexiEndpointInputs,
	LeexiEndpointOutputs,
	MeetingEventsCreateInput,
	MeetingEventsCreateResponse,
	MeetingEventsGetResponse,
	MeetingEventsListInput,
	MeetingEventsListResponse,
	TeamsListInput,
	TeamsListResponse,
	UsersListInput,
	UsersListResponse,
} from './endpoints/types';
