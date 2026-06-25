import { TwilioCall, TwilioMessage } from './database';

export const TwilioSchema = {
	version: '1.0.0',
	entities: {
		messages: TwilioMessage,
		calls: TwilioCall,
	},
} as const;

export type { TwilioMessage, TwilioCall };
