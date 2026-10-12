import {
	CallPageCall,
	CallPageManager,
	CallPageSmsMessage,
	CallPageUser,
	CallPageVoiceMessage,
	CallPageWidget,
} from './database';

export const CallPageSchema = {
	version: '1.0.0',
	entities: {
		users: CallPageUser,
		widgets: CallPageWidget,
		managers: CallPageManager,
		calls: CallPageCall,
		smsMessages: CallPageSmsMessage,
		voiceMessages: CallPageVoiceMessage,
	},
} as const;

export * from './database';
