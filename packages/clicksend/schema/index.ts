import { ClickSendContact, ClickSendMessage } from './database';

export const ClickSendSchema = {
	version: '1.0.0',
	entities: {
		messages: ClickSendMessage,
		contacts: ClickSendContact,
	},
} as const;

export type { ClickSendMessage, ClickSendContact };
