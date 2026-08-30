import { FilloutForm, FilloutSubmission, FilloutWebhook } from './database';

export const FilloutFormsSchema = {
	version: '1.0.0',
	entities: {
		forms: FilloutForm,
		submissions: FilloutSubmission,
		webhooks: FilloutWebhook,
	},
} as const;
