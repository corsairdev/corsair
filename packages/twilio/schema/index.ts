import { TwilioCallEntity, TwilioMessageEntity } from './database';

export const TwilioSchema = {
	version: '1.0.0',
	entities: {
		calls: TwilioCallEntity,
		messages: TwilioMessageEntity,
	},
} as const;
