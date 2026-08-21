import {
	BotpressBotEntity,
	BotpressIntegrationEntity,
	BotpressWorkspaceEntity,
} from './database';

export const BotpressSchema = {
	version: '1.0.0',
	entities: {
		workspaces: BotpressWorkspaceEntity,
		bots: BotpressBotEntity,
		integrations: BotpressIntegrationEntity,
	},
} as const;
