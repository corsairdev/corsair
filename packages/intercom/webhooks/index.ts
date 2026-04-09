import { created, deleted, tagCreated } from './contacts';
import {
	conversationAssigned,
	conversationClosed,
	conversationCreated,
} from './conversations';
import { ping } from './ping';

export const ContactWebhooks = {
	created,
	deleted,
	tagCreated,
};

export const ConversationWebhooks = {
	created: conversationCreated,
	assigned: conversationAssigned,
	closed: conversationClosed,
};

export const PingWebhooks = {
	ping,
};

export * from './types';
