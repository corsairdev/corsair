import { defineUnipileWebhook } from './define';
import { MessageNewEventSchema, MessageReceiptReadEventSchema } from './types';

// Fires for received messages and for messages the account sent, including
// ones sent from LinkedIn itself; check payload.is_sender.
export const messageNew = defineUnipileWebhook(
	'messageNew',
	'message.new',
	MessageNewEventSchema,
);

export const messageReceiptRead = defineUnipileWebhook(
	'messageReceiptRead',
	'message.receipt.read',
	MessageReceiptReadEventSchema,
);
