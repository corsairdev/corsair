import {
	BasinDomain,
	BasinForm,
	BasinFormView,
	BasinFormWebhook,
	BasinProject,
	BasinSubmission,
} from './database';

export const BasinSchema = {
	version: '1.0.0',
	entities: {
		forms: BasinForm,
		submissions: BasinSubmission,
		projects: BasinProject,
		webhooks: BasinFormWebhook,
		domains: BasinDomain,
		formViews: BasinFormView,
	},
} as const;

export * from './database';
