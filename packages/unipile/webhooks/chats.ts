import { defineUnipileWebhook } from './define';
import { ChatDeleteEventSchema, ChatUpdateEventSchema } from './types';

// A chat changed: folder, unread count, archive state, participants or name.
export const chatUpdate = defineUnipileWebhook(
	'chatUpdate',
	'chat.update',
	ChatUpdateEventSchema,
);

export const chatDelete = defineUnipileWebhook(
	'chatDelete',
	'chat.delete',
	ChatDeleteEventSchema,
);
