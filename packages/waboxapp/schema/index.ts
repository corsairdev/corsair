import { WaboxappAccount, WaboxappMessage } from './database';

export const WaboxappSchema = {
	version: '1.0.0',
	entities: {
		accounts: WaboxappAccount,
		messages: WaboxappMessage,
	},
} as const;
