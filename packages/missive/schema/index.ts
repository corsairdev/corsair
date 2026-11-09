import {
	MissiveContactEntitySchema,
	MissiveConversationEntitySchema,
} from './database';

export const MissiveSchema = {
	version: '1.0.0',
	entities: {
		contacts: MissiveContactEntitySchema,
		conversations: MissiveConversationEntitySchema,
	},
} as const;
