import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Messages, People, Rooms, Webhooks } from './endpoints';
import type {
	WebexEndpointInputs,
	WebexEndpointOutputs,
} from './endpoints/types';
import {
	WebexEndpointInputSchemas,
	WebexEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { WebexSchema } from './schema';

export type WebexPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWebexPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof webexEndpointsNested>;
};

export type WebexContext = CorsairPluginContext<
	typeof WebexSchema,
	WebexPluginOptions
>;

export type WebexKeyBuilderContext = KeyBuilderContext<WebexPluginOptions>;

export type WebexBoundEndpoints = BindEndpoints<typeof webexEndpointsNested>;

type WebexEndpoint<K extends keyof WebexEndpointOutputs> = CorsairEndpoint<
	WebexContext,
	WebexEndpointInputs[K],
	WebexEndpointOutputs[K]
>;

export type WebexEndpoints = {
	roomsList: WebexEndpoint<'roomsList'>;
	roomsGet: WebexEndpoint<'roomsGet'>;
	roomsCreate: WebexEndpoint<'roomsCreate'>;
	roomsUpdate: WebexEndpoint<'roomsUpdate'>;
	roomsDelete: WebexEndpoint<'roomsDelete'>;
	messagesList: WebexEndpoint<'messagesList'>;
	messagesGet: WebexEndpoint<'messagesGet'>;
	messagesCreate: WebexEndpoint<'messagesCreate'>;
	messagesUpdate: WebexEndpoint<'messagesUpdate'>;
	messagesDelete: WebexEndpoint<'messagesDelete'>;
	peopleList: WebexEndpoint<'peopleList'>;
	peopleMe: WebexEndpoint<'peopleMe'>;
	peopleGet: WebexEndpoint<'peopleGet'>;
	teamsList: WebexEndpoint<'teamsList'>;
	teamsGet: WebexEndpoint<'teamsGet'>;
	teamsCreate: WebexEndpoint<'teamsCreate'>;
	teamsDelete: WebexEndpoint<'teamsDelete'>;
	teamMembershipsList: WebexEndpoint<'teamMembershipsList'>;
	teamMembershipsCreate: WebexEndpoint<'teamMembershipsCreate'>;
	teamMembershipsDelete: WebexEndpoint<'teamMembershipsDelete'>;
	membershipsList: WebexEndpoint<'membershipsList'>;
	membershipsCreate: WebexEndpoint<'membershipsCreate'>;
	membershipsDelete: WebexEndpoint<'membershipsDelete'>;
	webhooksList: WebexEndpoint<'webhooksList'>;
	webhooksGet: WebexEndpoint<'webhooksGet'>;
	webhooksCreate: WebexEndpoint<'webhooksCreate'>;
	webhooksUpdate: WebexEndpoint<'webhooksUpdate'>;
	webhooksDelete: WebexEndpoint<'webhooksDelete'>;
};

const webexEndpointsNested = {
	rooms: {
		list: Rooms.list,
		get: Rooms.get,
		create: Rooms.create,
		update: Rooms.update,
		delete: Rooms.remove,
	},
	messages: {
		list: Messages.list,
		get: Messages.get,
		create: Messages.create,
		update: Messages.update,
		delete: Messages.remove,
	},
	people: {
		list: People.list,
		me: People.me,
		get: People.get,
	},
	teams: {
		list: People.teams,
		get: People.teamGet,
		create: People.teamCreate,
		delete: People.teamRemove,
	},
	teamMemberships: {
		list: People.teamMembershipsList,
		create: People.teamMembershipsCreate,
		delete: People.teamMembershipsRemove,
	},
	memberships: {
		list: People.membershipsList,
		create: People.membershipsCreate,
		delete: People.membershipsRemove,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
} as const;

export const webexEndpointSchemas = {
	'rooms.list': {
		input: WebexEndpointInputSchemas.roomsList,
		output: WebexEndpointOutputSchemas.roomsList,
	},
	'rooms.get': {
		input: WebexEndpointInputSchemas.roomsGet,
		output: WebexEndpointOutputSchemas.roomsGet,
	},
	'rooms.create': {
		input: WebexEndpointInputSchemas.roomsCreate,
		output: WebexEndpointOutputSchemas.roomsCreate,
	},
	'rooms.update': {
		input: WebexEndpointInputSchemas.roomsUpdate,
		output: WebexEndpointOutputSchemas.roomsUpdate,
	},
	'rooms.delete': {
		input: WebexEndpointInputSchemas.roomsDelete,
		output: WebexEndpointOutputSchemas.roomsDelete,
	},
	'messages.list': {
		input: WebexEndpointInputSchemas.messagesList,
		output: WebexEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: WebexEndpointInputSchemas.messagesGet,
		output: WebexEndpointOutputSchemas.messagesGet,
	},
	'messages.create': {
		input: WebexEndpointInputSchemas.messagesCreate,
		output: WebexEndpointOutputSchemas.messagesCreate,
	},
	'messages.update': {
		input: WebexEndpointInputSchemas.messagesUpdate,
		output: WebexEndpointOutputSchemas.messagesUpdate,
	},
	'messages.delete': {
		input: WebexEndpointInputSchemas.messagesDelete,
		output: WebexEndpointOutputSchemas.messagesDelete,
	},
	'people.list': {
		input: WebexEndpointInputSchemas.peopleList,
		output: WebexEndpointOutputSchemas.peopleList,
	},
	'people.me': {
		input: WebexEndpointInputSchemas.peopleMe,
		output: WebexEndpointOutputSchemas.peopleMe,
	},
	'people.get': {
		input: WebexEndpointInputSchemas.peopleGet,
		output: WebexEndpointOutputSchemas.peopleGet,
	},
	'teams.list': {
		input: WebexEndpointInputSchemas.teamsList,
		output: WebexEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: WebexEndpointInputSchemas.teamsGet,
		output: WebexEndpointOutputSchemas.teamsGet,
	},
	'teams.create': {
		input: WebexEndpointInputSchemas.teamsCreate,
		output: WebexEndpointOutputSchemas.teamsCreate,
	},
	'teams.delete': {
		input: WebexEndpointInputSchemas.teamsDelete,
		output: WebexEndpointOutputSchemas.teamsDelete,
	},
	'teamMemberships.list': {
		input: WebexEndpointInputSchemas.teamMembershipsList,
		output: WebexEndpointOutputSchemas.teamMembershipsList,
	},
	'teamMemberships.create': {
		input: WebexEndpointInputSchemas.teamMembershipsCreate,
		output: WebexEndpointOutputSchemas.teamMembershipsCreate,
	},
	'teamMemberships.delete': {
		input: WebexEndpointInputSchemas.teamMembershipsDelete,
		output: WebexEndpointOutputSchemas.teamMembershipsDelete,
	},
	'memberships.list': {
		input: WebexEndpointInputSchemas.membershipsList,
		output: WebexEndpointOutputSchemas.membershipsList,
	},
	'memberships.create': {
		input: WebexEndpointInputSchemas.membershipsCreate,
		output: WebexEndpointOutputSchemas.membershipsCreate,
	},
	'memberships.delete': {
		input: WebexEndpointInputSchemas.membershipsDelete,
		output: WebexEndpointOutputSchemas.membershipsDelete,
	},
	'webhooks.list': {
		input: WebexEndpointInputSchemas.webhooksList,
		output: WebexEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: WebexEndpointInputSchemas.webhooksGet,
		output: WebexEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: WebexEndpointInputSchemas.webhooksCreate,
		output: WebexEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: WebexEndpointInputSchemas.webhooksUpdate,
		output: WebexEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: WebexEndpointInputSchemas.webhooksDelete,
		output: WebexEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof webexEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const webexEndpointMeta = {
	'rooms.list': {
		riskLevel: 'read',
		description:
			'List spaces, filtered by type or team and sorted by id, last activity or creation',
	},
	'rooms.get': {
		riskLevel: 'read',
		description: 'Read one space with its title, type and creator',
	},
	'rooms.create': {
		riskLevel: 'write',
		description:
			'Create a space, optionally within a team and with lock or read-only settings',
	},
	'rooms.update': {
		riskLevel: 'write',
		description:
			'Change a space title, description or lock and read-only settings; the title is always sent',
	},
	'rooms.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a space and its message history; this cannot be undone',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List messages in a room, or the replies in one of its threads, optionally before a time or message id',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Read one message with its text, files and thread parent',
	},
	'messages.create': {
		riskLevel: 'write',
		description:
			'Post a message to a room or directly to a person, with text, markdown, html or one file attachment',
	},
	'messages.update': {
		riskLevel: 'write',
		description:
			'Edit the text or markdown of a message you sent, up to 10 times per message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one message permanently',
	},
	'people.list': {
		riskLevel: 'read',
		description: 'List people by email, display name, id or organization',
	},
	'people.me': {
		riskLevel: 'read',
		description:
			'Read the account behind the token, which is the cheapest way to check it',
	},
	'people.get': {
		riskLevel: 'read',
		description: 'Read one person by id',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams on the workspace',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Read one team with its name and creator',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team with a name',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team, leaving its spaces in place',
	},
	'teamMemberships.list': {
		riskLevel: 'read',
		description: 'List the members of a team',
	},
	'teamMemberships.create': {
		riskLevel: 'write',
		description: 'Add a person to a team, optionally as a moderator',
	},
	'teamMemberships.delete': {
		riskLevel: 'destructive',
		description: 'Remove a person from a team',
	},
	'memberships.list': {
		riskLevel: 'read',
		description: 'List the memberships of a room or of a person',
	},
	'memberships.create': {
		riskLevel: 'write',
		description: 'Add a person to a room, optionally as a moderator',
	},
	'memberships.delete': {
		riskLevel: 'destructive',
		description: 'Remove a person from a room',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook and what it fires on',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe a URL to a resource event, optionally filtered to one room and signed with a secret',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			'Change a webhook name, target or secret, or reactivate one Webex disabled; name and target are always sent',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof webexEndpointsNested>;

export type BaseWebexPlugin<T extends WebexPluginOptions> = CorsairPlugin<
	'webex',
	typeof WebexSchema,
	typeof webexEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWebexPlugin = BaseWebexPlugin<WebexPluginOptions>;

export type ExternalWebexPlugin<T extends WebexPluginOptions> =
	BaseWebexPlugin<T>;

export function webex<const T extends WebexPluginOptions>(
	incomingOptions: WebexPluginOptions & T = {} as WebexPluginOptions & T,
): ExternalWebexPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'webex',
		schema: WebexSchema,
		options: options,
		hooks: options.hooks,
		endpoints: webexEndpointsNested,
		webhooks: {},
		endpointMeta: webexEndpointMeta,
		endpointSchemas: webexEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: WebexKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('webex', ctx.authType ?? 'api_key');
		},
	} satisfies InternalWebexPlugin;
}

export {
	isWebexFailure,
	nextPageFromLink,
	segment,
	WEBEX_API_BASE,
	WebexAPIError,
} from './client';

export type {
	DeleteResponse,
	MeInput,
	MembershipResponse,
	MembershipsCreateInput,
	MembershipsDeleteInput,
	MembershipsListInput,
	MembershipsListResponse,
	MeResponse,
	MessageResponse,
	MessagesCreateInput,
	MessagesDeleteInput,
	MessagesGetInput,
	MessagesListInput,
	MessagesListResponse,
	MessagesUpdateInput,
	PeopleGetInput,
	PeopleListInput,
	PeopleListResponse,
	RoomResponse,
	RoomsCreateInput,
	RoomsDeleteInput,
	RoomsGetInput,
	RoomsListInput,
	RoomsListResponse,
	RoomsUpdateInput,
	TeamMembershipResponse,
	TeamMembershipsCreateInput,
	TeamMembershipsDeleteInput,
	TeamMembershipsListInput,
	TeamMembershipsListResponse,
	TeamResponse,
	TeamsCreateInput,
	TeamsDeleteInput,
	TeamsGetInput,
	TeamsListInput,
	TeamsListResponse,
	WebexEndpointInputs,
	WebexEndpointOutputs,
	WebexMembership,
	WebexMessage,
	WebexPerson,
	WebexRoom,
	WebexTeam,
	WebexTeamMembership,
	WebexWebhook,
	WebhookResponse,
	WebhooksCreateInput,
	WebhooksDeleteInput,
	WebhooksGetInput,
	WebhooksListInput,
	WebhooksListResponse,
	WebhooksUpdateInput,
} from './endpoints/types';
