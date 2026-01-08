import type {
	BasePluginConfig,
	BasePluginContext,
	BasePluginResponse,
	BaseDatabaseContext,
} from '../base';
import type { ResolvedSlackSchema, SlackSchemaOverride } from './schema';

export type { SlackSchemaOverride } from './schema';

export type SlackPlugin = BasePluginConfig<SlackSchemaOverride> & {
	/**
	 * Slack API token
	 */
	token: string;
	/**
	 * All channels.
	 * `[{
	 *   'name-of-channel': 'id-of-channel'
	 * }]`
	 */
	channels?: Record<string, string>;

	/**
	 * People
	 * `[{
	 *   'name-of-person': 'id-of-person'
	 * }]`
	 */
	members?: Record<string, string>;
};

export type BaseSlackPluginResponse<T extends Record<string, unknown>> =
	BasePluginResponse<T>;

// Message timestamp type (Slack uses this for message IDs)
export type MessageTs = string;

// Emoji name type
export type EmojiName = string;

// Response type for sendMessage, replyToThread, and updateMessage operations
export type MessageResponse = BaseSlackPluginResponse<{
	messageId: MessageTs;
	channel: string;
	timestamp: MessageTs;
}>;

// Message type for individual Slack messages
export type SlackMessage = {
	type: string;
	user?: string;
	text: string;
	ts: MessageTs;
	thread_ts?: MessageTs;
};

// Response type for getMessages operation
export type MessagesResponse = BaseSlackPluginResponse<{
	messages: SlackMessage[];
	hasMore: boolean;
	nextCursor?: string;
}>;

// Response type for addReaction operation
export type ReactionResponse = BaseSlackPluginResponse<{
	ok: boolean;
}>;

// Channel type for Slack channels
export type SlackChannel = {
	id: string;
	name: string;
	is_private: boolean;
	is_archived: boolean;
};

// Response type for getChannels operation
export type ChannelsResponse = BaseSlackPluginResponse<{
	channels: SlackChannel[];
	hasMore: boolean;
	nextCursor?: string;
}>;

/**
 * Database context type for plugin operations
 * This provides typed database access based on the resolved schema
 */
export type SlackDatabaseContext<
	TSchemaOverride extends SlackSchemaOverride = SlackSchemaOverride,
> = BaseDatabaseContext<ResolvedSlackSchema<TSchemaOverride>>;

/**
 * Plugin operation context
 * Includes database access and other context
 */
export type SlackPluginContext<
	TSchemaOverride extends SlackSchemaOverride = SlackSchemaOverride,
> = BasePluginContext<ResolvedSlackSchema<TSchemaOverride>>;

/**
 * Extract channel names from plugin config
 */
export type SlackChannels<T extends { channels?: Record<string, string> }> =
	keyof NonNullable<T['channels']> & string;

/**
 * Extract member names from plugin config
 */
export type SlackMembers<T extends { members?: Record<string, string> }> =
	keyof NonNullable<T['members']> & string;

/**
 * SlackClient type for operations
 */
export type { SlackClient } from './client';
