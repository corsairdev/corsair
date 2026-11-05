import {
	FilloutForm,
	FilloutSubmission,
	FilloutWebhook,
	ZiteDatabase,
	ZiteRecord,
} from './database';

export const FilloutFormsSchema = {
	version: '1.0.0',
	entities: {
		forms: FilloutForm,
		submissions: FilloutSubmission,
		webhooks: FilloutWebhook,
		databases: ZiteDatabase,
		records: ZiteRecord,
	},
} as const;
