import {
	SynthflowAiAction,
	SynthflowAiAssistant,
	SynthflowAiCall,
	SynthflowAiContact,
	SynthflowAiKnowledgeBase,
	SynthflowAiMemoryStore,
	SynthflowAiPhoneBook,
	SynthflowAiVoice,
} from './database';

export const SynthflowAiSchema = {
	version: '1.0.0',
	entities: {
		assistants: SynthflowAiAssistant,
		calls: SynthflowAiCall,
		contacts: SynthflowAiContact,
		knowledgeBases: SynthflowAiKnowledgeBase,
		memoryStores: SynthflowAiMemoryStore,
		phoneBooks: SynthflowAiPhoneBook,
		actions: SynthflowAiAction,
		voices: SynthflowAiVoice,
	},
} as const;

export {
	SynthflowAiAction,
	SynthflowAiAssistant,
	SynthflowAiCall,
	SynthflowAiContact,
	SynthflowAiKnowledgeBase,
	SynthflowAiMemoryStore,
	SynthflowAiPhoneBook,
	SynthflowAiVoice,
} from './database';
