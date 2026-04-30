import {
	VapiAssistant,
	VapiCall,
	VapiFile,
	VapiKnowledgeBase,
	VapiPhoneNumber,
	VapiSquad,
	VapiTool,
} from './database';

export const VapiSchema = {
	version: '1.0.0',
	entities: {
		assistants: VapiAssistant,
		calls: VapiCall,
		phoneNumbers: VapiPhoneNumber,
		squads: VapiSquad,
		tools: VapiTool,
		files: VapiFile,
		knowledgeBases: VapiKnowledgeBase,
	},
} as const;
