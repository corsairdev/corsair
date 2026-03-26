import { newMessage, sentMessage } from './messages';
import { newEvent, eventChange } from './events';
import { newContact } from './contacts';

export const MessageWebhooks = {
	newMessage,
	sentMessage,
};

export const EventWebhooks = {
	newEvent,
	eventChange,
};

export const ContactWebhooks = {
	newContact,
};

export * from './types';
