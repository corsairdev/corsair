import {
	ExaEvent,
	ExaImport,
	ExaMonitor,
	ExaSearchResult,
	ExaWebhookConfig,
	ExaWebset,
} from './database';

export const ExaSchema = {
	version: '1.2.0',
	entities: {
		searchResults: ExaSearchResult,
		websets: ExaWebset,
		imports: ExaImport,
		monitors: ExaMonitor,
		events: ExaEvent,
		webhookConfigs: ExaWebhookConfig,
	},
} as const;
