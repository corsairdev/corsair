import { HumanitixEvent, HumanitixTag } from './database';

export const HumanitixSchema = {
	version: '1.0.0',
	entities: {
		events: HumanitixEvent,
		tags: HumanitixTag,
	},
} as const;
