import { initializePlugin } from '../base';
import { createSlackClient } from './client';
import { addReaction } from './operations/add-reaction';
import { getChannels } from './operations/get-channels';
import { getMessages } from './operations/get-messages';
import { replyToThread } from './operations/reply-to-thread';
import { sendMessage } from './operations/send-message';
import { updateMessage } from './operations/update-message';
import { slackDefaultSchema } from './schema';
import type {
	SlackDatabaseContext,
	SlackPlugin,
	SlackPluginContext,
	SlackSchemaOverride,
} from './types';

/**
 * Creates a Slack plugin instance with database access
 * Uses the unified initialization flow from base plugin system
 */
export function createSlackPlugin<
	TSchemaOverride extends SlackSchemaOverride = SlackSchemaOverride,
	TDatabase extends
		SlackDatabaseContext<TSchemaOverride> = SlackDatabaseContext<TSchemaOverride>,
>(config: SlackPlugin, db: unknown) {
	// Initialize plugin using unified flow
	const initResult = initializePlugin(
		config,
		slackDefaultSchema,
		db,
		(config) => createSlackClient(config.token),
	);
	const { config: pluginConfig, client, ctx } = {
		...initResult,
		ctx: {
			...initResult.ctx,
			db: initResult.db as SlackDatabaseContext<TSchemaOverride>,
		},
	} as {
		config: SlackPlugin;
		client: ReturnType<typeof createSlackClient>;
		ctx: SlackPluginContext<TSchemaOverride>;
	};

	return {
		sendMessage: async (params: {
			channelId: string;
			content: string;
		}): Promise<ReturnType<typeof sendMessage>> => {
			return sendMessage({
				config: pluginConfig,
				client,
				channelId: params.channelId,
				content: params.content,
				ctx,
			});
		},

		replyToThread: async (params: {
			channelId: string;
			threadTs: string;
			content: string;
		}): Promise<ReturnType<typeof replyToThread>> => {
			return replyToThread({
				config: pluginConfig,
				client,
				channelId: params.channelId,
				threadTs: params.threadTs,
				content: params.content,
				ctx,
			});
		},

		getMessages: async (params: {
			channelId: string;
			options?: {
				limit?: number;
				oldest?: string;
				latest?: string;
				cursor?: string;
			};
		}): Promise<ReturnType<typeof getMessages>> => {
			return getMessages({
				config: pluginConfig,
				client,
				channelId: params.channelId,
				options: params.options,
				ctx,
			});
		},

		updateMessage: async (params: {
			channelId: string;
			messageTs: string;
			content: string;
		}): Promise<ReturnType<typeof updateMessage>> => {
			return updateMessage({
				config: pluginConfig,
				client,
				channelId: params.channelId,
				messageTs: params.messageTs,
				content: params.content,
				ctx,
			});
		},

		addReaction: async (params: {
			channelId: string;
			messageTs: string;
			emoji: string;
		}): Promise<ReturnType<typeof addReaction>> => {
			return addReaction({
				config: pluginConfig,
				client,
				channelId: params.channelId,
				messageTs: params.messageTs,
				emoji: params.emoji,
				ctx,
			});
		},

		getChannels: async (params?: {
			types?: string;
			exclude_archived?: boolean;
			limit?: number;
			cursor?: string;
		}): Promise<ReturnType<typeof getChannels>> => {
			return getChannels({
				config: pluginConfig,
				client,
				options: params,
				ctx,
			});
		},
	};
}

export type { SlackPlugin, SlackSchemaOverride, SlackPluginContext };
