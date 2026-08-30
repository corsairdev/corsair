import {
	ChatbotkitBlueprint,
	ChatbotkitBot,
	ChatbotkitConversation,
	ChatbotkitDataset,
	ChatbotkitFile,
	ChatbotkitSecret,
	ChatbotkitSkillset,
	ChatbotkitTask,
} from './database';

export const ChatbotkitSchema = {
	version: '1.0.0',
	entities: {
		bots: ChatbotkitBot,
		datasets: ChatbotkitDataset,
		skillsets: ChatbotkitSkillset,
		blueprints: ChatbotkitBlueprint,
		secrets: ChatbotkitSecret,
		conversations: ChatbotkitConversation,
		files: ChatbotkitFile,
		tasks: ChatbotkitTask,
	},
} as const;
