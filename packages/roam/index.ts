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
import { Endpoints } from './endpoints';
import type {
	RoamEndpointInputs,
	RoamEndpointOutputs,
} from './endpoints/types';
import {
	RoamEndpointInputSchemas,
	RoamEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RoamSchema } from './schema';

export type RoamPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRoamPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof roamEndpointsNested>;
};

export type RoamContext = CorsairPluginContext<
	typeof RoamSchema,
	RoamPluginOptions
>;

export type RoamKeyBuilderContext = KeyBuilderContext<RoamPluginOptions>;

export type RoamBoundEndpoints = BindEndpoints<typeof roamEndpointsNested>;

type RoamEndpoint<K extends keyof RoamEndpointOutputs> = CorsairEndpoint<
	RoamContext,
	RoamEndpointInputs[K],
	RoamEndpointOutputs[K]
>;

export type RoamEndpoints = {
	tokenInfo: RoamEndpoint<'tokenInfo'>;
	userInfo: RoamEndpoint<'userInfo'>;
	userList: RoamEndpoint<'userList'>;
	chatList: RoamEndpoint<'chatList'>;
	chatHistory: RoamEndpoint<'chatHistory'>;
	chatPost: RoamEndpoint<'chatPost'>;
	chatUpdate: RoamEndpoint<'chatUpdate'>;
	reactionAdd: RoamEndpoint<'reactionAdd'>;
	reactionList: RoamEndpoint<'reactionList'>;
	groupList: RoamEndpoint<'groupList'>;
	meetingList: RoamEndpoint<'meetingList'>;
	meetingTranscript: RoamEndpoint<'meetingTranscript'>;
};

const roamEndpointsNested = {
	token: {
		info: Endpoints.tokenInfo,
	},
	users: {
		info: Endpoints.userInfo,
		list: Endpoints.userList,
	},
	chat: {
		list: Endpoints.chatList,
		history: Endpoints.chatHistory,
		post: Endpoints.chatPost,
		update: Endpoints.chatUpdate,
	},
	reactions: {
		add: Endpoints.reactionAdd,
		list: Endpoints.reactionList,
	},
	groups: {
		list: Endpoints.groupList,
	},
	meetings: {
		list: Endpoints.meetingList,
		transcript: Endpoints.meetingTranscript,
	},
} as const;

export const roamEndpointSchemas = {
	'token.info': {
		input: RoamEndpointInputSchemas.tokenInfo,
		output: RoamEndpointOutputSchemas.tokenInfo,
	},
	'users.info': {
		input: RoamEndpointInputSchemas.userInfo,
		output: RoamEndpointOutputSchemas.userInfo,
	},
	'users.list': {
		input: RoamEndpointInputSchemas.userList,
		output: RoamEndpointOutputSchemas.userList,
	},
	'chat.list': {
		input: RoamEndpointInputSchemas.chatList,
		output: RoamEndpointOutputSchemas.chatList,
	},
	'chat.history': {
		input: RoamEndpointInputSchemas.chatHistory,
		output: RoamEndpointOutputSchemas.chatHistory,
	},
	'chat.post': {
		input: RoamEndpointInputSchemas.chatPost,
		output: RoamEndpointOutputSchemas.chatPost,
	},
	'chat.update': {
		input: RoamEndpointInputSchemas.chatUpdate,
		output: RoamEndpointOutputSchemas.chatUpdate,
	},
	'reactions.add': {
		input: RoamEndpointInputSchemas.reactionAdd,
		output: RoamEndpointOutputSchemas.reactionAdd,
	},
	'reactions.list': {
		input: RoamEndpointInputSchemas.reactionList,
		output: RoamEndpointOutputSchemas.reactionList,
	},
	'groups.list': {
		input: RoamEndpointInputSchemas.groupList,
		output: RoamEndpointOutputSchemas.groupList,
	},
	'meetings.list': {
		input: RoamEndpointInputSchemas.meetingList,
		output: RoamEndpointOutputSchemas.meetingList,
	},
	'meetings.transcript': {
		input: RoamEndpointInputSchemas.meetingTranscript,
		output: RoamEndpointOutputSchemas.meetingTranscript,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof roamEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const roamEndpointMeta = {
	'token.info': {
		riskLevel: 'read',
		description:
			'Read the account behind the token: its user, granted scopes and pinned API version',
	},
	'users.info': {
		riskLevel: 'read',
		description:
			'Look up one person or bot by uuid or email, including their role and availability',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List directory members with a search phrase or an explicit id list, plus cursor paging',
	},
	'chat.list': {
		riskLevel: 'read',
		description: 'List the chats the token can see, with cursor paging',
	},
	'chat.history': {
		riskLevel: 'read',
		description:
			'Read a chat or group’s messages with time-window and thread filters plus cursor paging',
	},
	'chat.post': {
		riskLevel: 'write',
		description:
			'Post a message to a chat, group or direct conversation, or schedule one for later',
	},
	'chat.update': {
		riskLevel: 'write',
		description: 'Edit a message the token posted, replacing its content',
	},
	'reactions.add': {
		riskLevel: 'write',
		description: 'Add an emoji reaction to a message',
	},
	'reactions.list': {
		riskLevel: 'read',
		description: 'List the reactions on a message with their counts and users',
	},
	'groups.list': {
		riskLevel: 'read',
		description:
			'List groups with a search phrase and type filter, plus cursor paging',
	},
	'meetings.list': {
		riskLevel: 'read',
		description: 'List meetings with a time window, plus cursor paging',
	},
	'meetings.transcript': {
		riskLevel: 'read',
		description:
			'Fetch a meeting’s transcript cues with their speaker id and timing',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof roamEndpointsNested>;

export type BaseRoamPlugin<T extends RoamPluginOptions> = CorsairPlugin<
	'roam',
	typeof RoamSchema,
	typeof roamEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRoamPlugin = BaseRoamPlugin<RoamPluginOptions>;

export type ExternalRoamPlugin<T extends RoamPluginOptions> = BaseRoamPlugin<T>;

export function roam<const T extends RoamPluginOptions>(
	incomingOptions: RoamPluginOptions & T = {} as RoamPluginOptions & T,
): ExternalRoamPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'roam',
		schema: RoamSchema,
		options: options,
		hooks: options.hooks,
		endpoints: roamEndpointsNested,
		webhooks: {},
		endpointMeta: roamEndpointMeta,
		endpointSchemas: roamEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RoamKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('roam', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRoamPlugin;
}

export { RoamAPIError } from './client';

export type {
	ChatHistoryInput,
	ChatHistoryResponse,
	ChatListInput,
	ChatListResponse,
	ChatPostInput,
	ChatPostResponse,
	ChatUpdateInput,
	ChatUpdateResponse,
	GroupListInput,
	GroupListResponse,
	MeetingListInput,
	MeetingListResponse,
	MeetingTranscriptInput,
	MeetingTranscriptResponse,
	ReactionAddInput,
	ReactionAddResponse,
	ReactionListInput,
	ReactionListResponse,
	RoamChat,
	RoamChatItem,
	RoamChatMessage,
	RoamEndpointInputs,
	RoamEndpointOutputs,
	RoamGroup,
	RoamMeeting,
	RoamReaction,
	RoamUser,
	RoamUserRef,
	TokenInfoInput,
	TokenInfoResponse,
	UserInfoInput,
	UserInfoResponse,
	UserListInput,
	UserListResponse,
} from './endpoints/types';
