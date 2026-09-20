import {
	ParseurDocument,
	ParseurExportConfig,
	ParseurLog,
	ParseurParser,
	ParseurTemplate,
	ParseurWebhook,
} from './database';

export const ParseurSchema = {
	version: '1.0.0',
	entities: {
		parsers: ParseurParser,
		documents: ParseurDocument,
		templates: ParseurTemplate,
		exportConfigs: ParseurExportConfig,
		webhooks: ParseurWebhook,
		logs: ParseurLog,
	},
} as const;

export {
	ParseurDocument,
	ParseurExportConfig,
	ParseurLog,
	ParseurParser,
	ParseurTemplate,
	ParseurWebhook,
} from './database';
