import { callbackQuery } from './callback-query';
import { channelPost } from './channel-post';
import { editedChannelPost } from './edited-channel-post';
import { editedMessage } from './edited-message';
import { inlineQuery } from './inline-query';
import { message } from './message';
import { poll } from './poll';
import { preCheckoutQuery } from './pre-checkout-query';
import { shippingQuery } from './shipping-query';

export const CallbackQueryWebhooks = {
	callbackQuery,
};

export const ChannelPostWebhooks = {
	channelPost,
};

export const EditedChannelPostWebhooks = {
	editedChannelPost,
};

export const EditedMessageWebhooks = {
	editedMessage,
};

export const InlineQueryWebhooks = {
	inlineQuery,
};

export const MessageWebhooks = {
	message,
};

export const PollWebhooks = {
	poll,
};

export const PreCheckoutQueryWebhooks = {
	preCheckoutQuery,
};

export const ShippingQueryWebhooks = {
	shippingQuery,
};

export * from './types';
