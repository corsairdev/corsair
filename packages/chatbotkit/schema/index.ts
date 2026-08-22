import {
	ChatbotkitBlueprint,
	ChatbotkitBot,
	ChatbotkitDataset,
	ChatbotkitSecret,
	ChatbotkitSkillset,
} from './database';

export const ChatbotkitSchema = {
	version: '1.0.0',
	entities: {
		bots: ChatbotkitBot,
		datasets: ChatbotkitDataset,
		skillsets: ChatbotkitSkillset,
		blueprints: ChatbotkitBlueprint,
		secrets: ChatbotkitSecret,
	},
} as const;
