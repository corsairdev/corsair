import { WebvizioProject, WebvizioWebhook } from './database';

export const WebvizioSchema = {
	version: '1.0.0',
	entities: {
		projects: WebvizioProject,
		webhooks: WebvizioWebhook,
	},
} as const;

export { WebvizioProject, WebvizioWebhook } from './database';
