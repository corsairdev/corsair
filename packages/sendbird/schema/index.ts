import {
	SendbirdChannelSchema,
	SendbirdMessageSchema,
	SendbirdUserSchema,
} from '../endpoints/types';

export const SendbirdSchema = {
	version: '1.0.0',
	entities: {
		users: SendbirdUserSchema,
		channels: SendbirdChannelSchema,
		messages: SendbirdMessageSchema,
	},
} as const;
