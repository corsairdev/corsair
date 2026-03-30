import {
	FigmaComment,
	FigmaComponent,
	FigmaFileMetadata,
	FigmaVersion,
	FigmaWebhookConfig,
} from './database';

export const FigmaSchema = {
	version: '1.0.0',
	entities: {
		comments: FigmaComment,
		webhookConfigs: FigmaWebhookConfig,
		components: FigmaComponent,
		fileMetadata: FigmaFileMetadata,
		versions: FigmaVersion,
	},
} as const;
