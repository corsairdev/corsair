import {
	messageDeleted,
	messageLabelChanged,
	messageReceived,
} from './messages';

export const MessageWebhooks = {
	messageReceived,
	messageDeleted,
	messageLabelChanged,
};

export * from './types';
