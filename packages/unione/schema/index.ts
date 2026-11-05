import {
	UnioneAccount,
	UnioneDomain,
	UnioneEventDump,
	UnioneSuppression,
	UnioneTag,
	UnioneTemplate,
	UnioneWebhook,
} from './database';

export const UnioneSchema = {
	version: '1.0.0',
	entities: {
		templates: UnioneTemplate,
		webhooks: UnioneWebhook,
		suppressions: UnioneSuppression,
		eventDumps: UnioneEventDump,
		domains: UnioneDomain,
		tags: UnioneTag,
		account: UnioneAccount,
	},
} as const;

export * from './database';
