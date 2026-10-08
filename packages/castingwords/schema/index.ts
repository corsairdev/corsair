import {
	CastingwordsAudiofile,
	CastingwordsInvoice,
	CastingwordsOrder,
	CastingwordsPrepayBalance,
	CastingwordsSku,
	CastingwordsWebhook,
} from './database';

export const CastingwordsSchema = {
	version: '1.0.0',
	entities: {
		orders: CastingwordsOrder,
		audiofiles: CastingwordsAudiofile,
		invoices: CastingwordsInvoice,
		balances: CastingwordsPrepayBalance,
		webhooks: CastingwordsWebhook,
		skus: CastingwordsSku,
	},
} as const;
