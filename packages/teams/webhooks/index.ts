import { channelCreated } from './channel';
import { chatMessage } from './chat';
import { membershipChanged } from './member';
import { channelMessage } from './message';

export const ChannelWebhooks = {
	message: channelMessage,
	created: channelCreated,
};

export const ChatWebhooks = {
	message: chatMessage,
};

export const MemberWebhooks = {
	changed: membershipChanged,
};

export * from './types';
