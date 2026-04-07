import {
	TypeformForm,
	TypeformImage,
	TypeformResponse,
	TypeformTheme,
	TypeformWebhookConfig,
	TypeformWorkspace,
} from './database';

export const TypeformSchema = {
	version: '1.0.0',
	entities: {
		forms: TypeformForm,
		responses: TypeformResponse,
		workspaces: TypeformWorkspace,
		images: TypeformImage,
		themes: TypeformTheme,
		webhookConfigs: TypeformWebhookConfig,
	},
} as const;
