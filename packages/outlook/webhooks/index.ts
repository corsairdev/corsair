import { newContact } from './contacts';
import { eventChange, newEvent } from './events';
import { newMessage, sentMessage } from './messages';
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
