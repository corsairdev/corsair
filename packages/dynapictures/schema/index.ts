import {
	DynapicturesMediaAsset,
	DynapicturesTemplate,
	DynapicturesWebhook,
	DynapicturesWorkspace,
} from './database';

export const DynapicturesSchema = {
	version: '1.0.0',
	entities: {
		workspaces: DynapicturesWorkspace,
		templates: DynapicturesTemplate,
		media: DynapicturesMediaAsset,
		webhooks: DynapicturesWebhook,
	},
} as const;

export * from './database';
