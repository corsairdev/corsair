import { defineUnipileWebhook } from './define';
import {
	MessageDeleteEventSchema,
	MessageNewEventSchema,
	MessageReactionDeleteEventSchema,
	MessageReactionNewEventSchema,
	MessageReceiptDeliveryEventSchema,
	MessageReceiptReadEventSchema,
	MessageUpdateEventSchema,
} from './types';

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

export const messageUpdate = defineUnipileWebhook(
	'messageUpdate',
	'message.update',
	MessageUpdateEventSchema,
);

export const messageDelete = defineUnipileWebhook(
	'messageDelete',
	'message.delete',
	MessageDeleteEventSchema,
);

export const messageReceiptDelivery = defineUnipileWebhook(
	'messageReceiptDelivery',
	'message.receipt.delivery',
	MessageReceiptDeliveryEventSchema,
);

export const messageReactionNew = defineUnipileWebhook(
	'messageReactionNew',
	'message.reaction.new',
	MessageReactionNewEventSchema,
);

export const messageReactionDelete = defineUnipileWebhook(
	'messageReactionDelete',
	'message.reaction.delete',
	MessageReactionDeleteEventSchema,
);
