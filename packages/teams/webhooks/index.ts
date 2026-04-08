import { channelMessage } from './message';
import { chatMessage } from './chat';
import { channelCreated } from './channel';
import { membershipChanged } from './member';

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
