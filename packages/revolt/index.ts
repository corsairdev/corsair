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
import type { RevoltCredential } from './client';
import { Endpoints } from './endpoints';
import type {
	RevoltEndpointInputs,
	RevoltEndpointOutputs,
} from './endpoints/types';
import {
	RevoltEndpointInputSchemas,
	RevoltEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RevoltSchema } from './schema';

export type { RevoltCredential } from './client';

export type RevoltPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Which header carries the token. A bot token goes in `X-Bot-Token`, a user
	 * token in `X-Session-Token`; the two are not interchangeable and a bot token
	 * in the session header is rejected.
	 */
	credential?: RevoltCredential;
	/**
	 * The API host. Defaults to Stoat's, which serves the current API; a
	 * self-hosted instance is a different host.
	 */
	base_url?: string;
	hooks?: InternalRevoltPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof revoltEndpointsNested>;
};

export type RevoltContext = CorsairPluginContext<
	typeof RevoltSchema,
	RevoltPluginOptions
>;

export type RevoltKeyBuilderContext = KeyBuilderContext<RevoltPluginOptions>;

export type RevoltBoundEndpoints = BindEndpoints<typeof revoltEndpointsNested>;

type RevoltEndpoint<K extends keyof RevoltEndpointOutputs> = CorsairEndpoint<
	RevoltContext,
	RevoltEndpointInputs[K],
	RevoltEndpointOutputs[K]
>;

export type RevoltEndpoints = {
	userMe: RevoltEndpoint<'userMe'>;
	userGet: RevoltEndpoint<'userGet'>;
	userDms: RevoltEndpoint<'userDms'>;
	channelGet: RevoltEndpoint<'channelGet'>;
	channelEdit: RevoltEndpoint<'channelEdit'>;
	channelDelete: RevoltEndpoint<'channelDelete'>;
	messagesList: RevoltEndpoint<'messagesList'>;
	messagesGet: RevoltEndpoint<'messagesGet'>;
	messagesSend: RevoltEndpoint<'messagesSend'>;
	messagesEdit: RevoltEndpoint<'messagesEdit'>;
	messagesDelete: RevoltEndpoint<'messagesDelete'>;
	reactionsAdd: RevoltEndpoint<'reactionsAdd'>;
	serverGet: RevoltEndpoint<'serverGet'>;
	serverMembers: RevoltEndpoint<'serverMembers'>;
};

const revoltEndpointsNested = {
	users: {
		me: Endpoints.userMe,
		get: Endpoints.userGet,
		dms: Endpoints.userDms,
	},
	channels: {
		get: Endpoints.channelGet,
		edit: Endpoints.channelEdit,
		delete: Endpoints.channelDelete,
	},
	messages: {
		list: Endpoints.messagesList,
		get: Endpoints.messagesGet,
		send: Endpoints.messagesSend,
		edit: Endpoints.messagesEdit,
		delete: Endpoints.messagesDelete,
	},
	reactions: {
		add: Endpoints.reactionsAdd,
	},
	servers: {
		get: Endpoints.serverGet,
		members: Endpoints.serverMembers,
	},
} as const;

export const revoltEndpointSchemas = {
	'users.me': {
		input: RevoltEndpointInputSchemas.userMe,
		output: RevoltEndpointOutputSchemas.userMe,
	},
	'users.get': {
		input: RevoltEndpointInputSchemas.userGet,
		output: RevoltEndpointOutputSchemas.userGet,
	},
	'users.dms': {
		input: RevoltEndpointInputSchemas.userDms,
		output: RevoltEndpointOutputSchemas.userDms,
	},
	'channels.get': {
		input: RevoltEndpointInputSchemas.channelGet,
		output: RevoltEndpointOutputSchemas.channelGet,
	},
	'channels.edit': {
		input: RevoltEndpointInputSchemas.channelEdit,
		output: RevoltEndpointOutputSchemas.channelEdit,
	},
	'channels.delete': {
		input: RevoltEndpointInputSchemas.channelDelete,
		output: RevoltEndpointOutputSchemas.channelDelete,
	},
	'messages.list': {
		input: RevoltEndpointInputSchemas.messagesList,
		output: RevoltEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: RevoltEndpointInputSchemas.messagesGet,
		output: RevoltEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: RevoltEndpointInputSchemas.messagesSend,
		output: RevoltEndpointOutputSchemas.messagesSend,
	},
	'messages.edit': {
		input: RevoltEndpointInputSchemas.messagesEdit,
		output: RevoltEndpointOutputSchemas.messagesEdit,
	},
	'messages.delete': {
		input: RevoltEndpointInputSchemas.messagesDelete,
		output: RevoltEndpointOutputSchemas.messagesDelete,
	},
	'reactions.add': {
		input: RevoltEndpointInputSchemas.reactionsAdd,
		output: RevoltEndpointOutputSchemas.reactionsAdd,
	},
	'servers.get': {
		input: RevoltEndpointInputSchemas.serverGet,
		output: RevoltEndpointOutputSchemas.serverGet,
	},
	'servers.members': {
		input: RevoltEndpointInputSchemas.serverMembers,
		output: RevoltEndpointOutputSchemas.serverMembers,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof revoltEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const revoltEndpointMeta = {
	'users.me': {
		riskLevel: 'read',
		description:
			'Read the account behind the token: its id, username, discriminator and status',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Fetch one user by id with their profile and presence',
	},
	'users.dms': {
		riskLevel: 'read',
		description:
			'List the direct-message and group channels the account is in, with their recipient ids',
	},
	'channels.get': {
		riskLevel: 'read',
		description: 'Fetch one channel with its type, name and permissions',
	},
	'channels.edit': {
		riskLevel: 'write',
		description: 'Rename or redescribe a group or server channel',
	},
	'channels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Close a channel permanently; its message history is gone',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'Read a channel’s messages with time cursors, already carrying their authors',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Fetch one message by id',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a message to a channel, optionally replying or attaching files',
	},
	'messages.edit': {
		riskLevel: 'write',
		description: 'Edit a message the account posted, replacing its content',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a message permanently',
	},
	'reactions.add': {
		riskLevel: 'write',
		description: 'Add an emoji reaction to a message',
	},
	'servers.get': {
		riskLevel: 'read',
		description:
			'Fetch one server with its channels, roles and default permissions',
	},
	'servers.members': {
		riskLevel: 'read',
		description:
			'List a server’s members with their users, optionally excluding offline ones',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof revoltEndpointsNested>;

export type BaseRevoltPlugin<T extends RevoltPluginOptions> = CorsairPlugin<
	'revolt',
	typeof RevoltSchema,
	typeof revoltEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRevoltPlugin = BaseRevoltPlugin<RevoltPluginOptions>;

export type ExternalRevoltPlugin<T extends RevoltPluginOptions> =
	BaseRevoltPlugin<T>;

export function revolt<const T extends RevoltPluginOptions>(
	incomingOptions: RevoltPluginOptions & T = {} as RevoltPluginOptions & T,
): ExternalRevoltPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		credential: incomingOptions.credential ?? ('bot' as const),
	};
	return {
		id: 'revolt',
		schema: RevoltSchema,
		options: options,
		hooks: options.hooks,
		endpoints: revoltEndpointsNested,
		webhooks: {},
		endpointMeta: revoltEndpointMeta,
		endpointSchemas: revoltEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RevoltKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('revolt', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRevoltPlugin;
}

export { REVOLT_TOKEN_HEADERS, RevoltAPIError } from './client';

export type {
	ChannelDeleteInput,
	ChannelDeleteResponse,
	ChannelEditInput,
	ChannelEditResponse,
	ChannelGetInput,
	ChannelGetResponse,
	MessagesDeleteInput,
	MessagesDeleteResponse,
	MessagesEditInput,
	MessagesEditResponse,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesSendInput,
	MessagesSendResponse,
	ReactionsAddInput,
	ReactionsAddResponse,
	RevoltChannel,
	RevoltEndpointInputs,
	RevoltEndpointOutputs,
	RevoltMember,
	RevoltMessage,
	RevoltServer,
	RevoltUser,
	ServerGetInput,
	ServerGetResponse,
	ServerMembersInput,
	ServerMembersResponse,
	UserDmsInput,
	UserDmsResponse,
	UserGetInput,
	UserGetResponse,
	UserMeInput,
	UserMeResponse,
} from './endpoints/types';
