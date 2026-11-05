import {
	CustomGPTConversation,
	CustomGPTLead,
	CustomGPTLicense,
	CustomGPTMessage,
	CustomGPTPage,
	CustomGPTProject,
	CustomGPTSource,
} from './database';

export * from './database';

export const CustomGPTSchema = {
	version: '1.0.0',
	entities: {
		projects: CustomGPTProject,
		pages: CustomGPTPage,
		sources: CustomGPTSource,
		conversations: CustomGPTConversation,
		messages: CustomGPTMessage,
		licenses: CustomGPTLicense,
		leads: CustomGPTLead,
	},
} as const;
