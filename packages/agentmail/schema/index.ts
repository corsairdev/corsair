import { AgentMailMessage } from './database';

export const AgentMailSchema = {
	version: '1.0.0',
	entities: {
		messages: AgentMailMessage,
	},
} as const;

export type { AgentMailMessage } from './database';
