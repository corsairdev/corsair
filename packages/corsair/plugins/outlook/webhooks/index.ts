import { newMessage, sentMessage } from './messages';
import { newEvent, eventChange } from './events';
import { newContact } from './contacts';
import { subscriptionValidation } from './validation';

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

export const ValidationWebhooks = {
	subscriptionValidation,
};

export * from './types';
