import type { AuthTypes } from '../../constants';
import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import type {
	SlackEndpointInputs,
	SlackEndpointOutputs,
	SlackReactionName,
} from './endpoints';
import {
	Channels,
	Files,
	Messages,
	Reactions,
	Stars,
	UserGroups,
	Users,
} from './endpoints';
import type { SlackCredentials } from './schema';
import { SlackSchema } from './schema';
import type {
	ChannelCreatedEvent,
	FileCreatedEvent,
	FilePublicEvent,
	FileSharedEvent,
	MessageEvent,
	ReactionAddedEvent,
	SlackWebhookOutputs,
	SlackWebhookPayload,
	TeamJoinEvent,
	UserChangeEvent,
} from './webhooks';
import {
	ChannelWebhooks,
	FileWebhooks,
	MessageWebhooks,
	ReactionWebhooks,
	UserWebhooks,
} from './webhooks';

export type { SlackReactionName } from './endpoints';

import { errorHandlers } from './error-handlers';

export type SlackContext = CorsairPluginContext<
	'slack',
	typeof SlackSchema,
	SlackPluginOptions
>;

type SlackEndpoint<K extends keyof SlackEndpointOutputs> = CorsairEndpoint<
	SlackContext,
	SlackEndpointInputs[K],
	SlackEndpointOutputs[K]
>;

export type SlackEndpoints = {
	[K in keyof SlackEndpointOutputs]: SlackEndpoint<K>;
};

/**
 * const endpoints = ctx.endpoints as SlackBoundEndpoints
 */
export type SlackBoundEndpoints = BindEndpoints<SlackEndpoints>;

type SlackWebhook<K extends keyof SlackWebhookOutputs, TEvent> = CorsairWebhook<
	SlackContext,
	SlackWebhookPayload<TEvent>,
	SlackWebhookOutputs[K]
>;

export type SlackWebhooks = {
	reactionAdded: SlackWebhook<'reactionAdded', ReactionAddedEvent>;
	message: SlackWebhook<'message', MessageEvent>;
	channelCreated: SlackWebhook<'channelCreated', ChannelCreatedEvent>;
	teamJoin: SlackWebhook<'teamJoin', TeamJoinEvent>;
	userChange: SlackWebhook<'userChange', UserChangeEvent>;
	fileCreated: SlackWebhook<'fileCreated', FileCreatedEvent>;
	filePublic: SlackWebhook<'filePublic', FilePublicEvent>;
	fileShared: SlackWebhook<'fileShared', FileSharedEvent>;
};

export type SlackBoundWebhooks = BindWebhooks<SlackWebhooks>;

const slackEndpointsNested = {
	channels: {
		archive: Channels.archive,
		close: Channels.close,
		create: Channels.create,
		get: Channels.get,
		list: Channels.list,
		getHistory: Channels.getHistory,
		invite: Channels.invite,
		join: Channels.join,
		kick: Channels.kick,
		leave: Channels.leave,
		getMembers: Channels.getMembers,
		open: Channels.open,
		rename: Channels.rename,
		getReplies: Channels.getReplies,
		setPurpose: Channels.setPurpose,
		setTopic: Channels.setTopic,
		unarchive: Channels.unarchive,
	},
	users: {
		get: Users.get,
		list: Users.list,
		getProfile: Users.getProfile,
		getPresence: Users.getPresence,
		updateProfile: Users.updateProfile,
	},
	userGroups: {
		create: UserGroups.create,
		disable: UserGroups.disable,
		enable: UserGroups.enable,
		list: UserGroups.list,
		update: UserGroups.update,
	},
	files: {
		get: Files.get,
		list: Files.list,
		upload: Files.upload,
	},
	messages: {
		delete: Messages.delete,
		getPermalink: Messages.getPermalink,
		search: Messages.search,
		post: Messages.post,
		update: Messages.update,
	},
	reactions: {
		add: Reactions.add,
		get: Reactions.get,
		remove: Reactions.remove,
	},
	stars: {
		add: Stars.add,
		remove: Stars.remove,
		list: Stars.list,
	},
} as const;

const slackWebhooksNested = {
	messages: {
		message: MessageWebhooks.message,
	},
	channels: {
		created: ChannelWebhooks.created,
	},
	reactions: {
		added: ReactionWebhooks.added,
	},
	users: {
		teamJoin: UserWebhooks.teamJoin,
		userChange: UserWebhooks.userChange,
	},
	files: {
		created: FileWebhooks.created,
		public: FileWebhooks.public,
		shared: FileWebhooks.shared,
	},
} as const;

export type SlackPluginOptions = {
	authType: AuthTypes;

	credentials: SlackCredentials;

	hooks?: SlackPlugin['hooks'] | undefined;

	webhookHooks?: SlackPlugin['webhookHooks'] | undefined;

	errorHandlers?: CorsairErrorHandler;
};

export type SlackPlugin = CorsairPlugin<
	'slack',
	typeof slackEndpointsNested,
	typeof SlackSchema,
	SlackPluginOptions,
	typeof slackWebhooksNested
>;

export function slack(options: SlackPluginOptions) {
	return {
		id: 'slack',
		schema: SlackSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: slackEndpointsNested,
		webhooks: slackWebhooksNested,
		pluginWebhookMatcher: (request) => {
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
	} satisfies SlackPlugin;
}
