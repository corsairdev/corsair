import {
	ConvoloAiAgent,
	ConvoloAiCall,
	ConvoloAiLead,
	ConvoloAiWidget,
} from './database';

export const ConvoloAiSchema = {
	version: '1.0.0',
	entities: {
		agents: ConvoloAiAgent,
		calls: ConvoloAiCall,
		leads: ConvoloAiLead,
		widgets: ConvoloAiWidget,
	},
} as const;
