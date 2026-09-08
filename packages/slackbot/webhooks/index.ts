import { challenge } from './challenge';
import { channelCreated } from './channels';
import {
	botMessage,
	directMessage,
	groupDirectMessage,
	message,
	privateChannelMessage,
	threadReply,
} from './messages';
import { reactionAdded, reactionRemoved } from './reactions';

/**
 * Incoming messages, partitioned by surface and author so exactly one trigger
 * fires per Slack event.
 */
export const MessageWebhooks = {
	message,
	directMessage,
	groupDirectMessage,
	privateChannelMessage,
	botMessage,
	threadReply,
};

export const ReactionWebhooks = {
	added: reactionAdded,
	removed: reactionRemoved,
};

export const ChannelWebhooks = {
	created: channelCreated,
};

/** Slack's Events API setup handshake, not a subscribable event. */
export const SetupWebhooks = {
	challenge,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
