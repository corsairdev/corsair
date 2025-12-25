import { createSlackClient } from './client';
import type {
	SlackDatabaseContext,
	SlackPlugin,
	SlackPluginContext,
	SlackSchemaOverride,
} from './types';
import { sendMessage } from './operations/send-message';
import { replyToThread } from './operations/reply-to-thread';
import { getMessages } from './operations/get-messages';
import { updateMessage } from './operations/update-message';
import { addReaction } from './operations/add-reaction';
import { getChannels } from './operations/get-channels';

/**
 * Creates a Slack plugin instance with database access
 */
export function createSlackPlugin<
	TSchemaOverride extends SlackSchemaOverride = SlackSchemaOverride,
	TDatabase extends SlackDatabaseContext<TSchemaOverride> = SlackDatabaseContext<TSchemaOverride>,
>(config: SlackPlugin, db: TDatabase) {
	const client = createSlackClient(config.token);

	return {
		sendMessage: async (params: {
			channelId: string;
			content: string;
		}): Promise<ReturnType<typeof sendMessage>> => {
			return sendMessage({
				config,
				client,
				channelId: params.channelId,
				content: params.content,
				ctx: { db, userId: undefined },
			});
		},

		replyToThread: async (params: {
			channelId: string;
			threadTs: string;
			content: string;
		}): Promise<ReturnType<typeof replyToThread>> => {
			return replyToThread({
				config,
				client,
				channelId: params.channelId,
				threadTs: params.threadTs,
				content: params.content,
				ctx: { db, userId: undefined },
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
				config,
				client,
				channelId: params.channelId,
				options: params.options,
				ctx: { db, userId: undefined },
			});
		},

		updateMessage: async (params: {
			channelId: string;
			messageTs: string;
			content: string;
		}): Promise<ReturnType<typeof updateMessage>> => {
			return updateMessage({
				config,
				client,
				channelId: params.channelId,
				messageTs: params.messageTs,
				content: params.content,
				ctx: { db, userId: undefined },
			});
		},

		addReaction: async (params: {
			channelId: string;
			messageTs: string;
			emoji: string;
		}): Promise<ReturnType<typeof addReaction>> => {
			return addReaction({
				config,
				client,
				channelId: params.channelId,
				messageTs: params.messageTs,
				emoji: params.emoji,
				ctx: { db, userId: undefined },
			});
		},

		getChannels: async (params?: {
			types?: string;
			exclude_archived?: boolean;
			limit?: number;
			cursor?: string;
		}): Promise<ReturnType<typeof getChannels>> => {
			return getChannels({
				config,
				client,
				options: params,
				ctx: { db, userId: undefined },
			});
		},
	};
}

export type { SlackPlugin, SlackSchemaOverride, SlackPluginContext };
