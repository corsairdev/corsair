import {
	BlackbaudBatchGift,
	BlackbaudGift,
	BlackbaudMembership,
	BlackbaudOneRosterKey,
	BlackbaudPaymentTransaction,
} from './database';

export const BlackbaudSchema = {
	version: '1.0.0',
	entities: {
		gifts: BlackbaudGift,
		batchGifts: BlackbaudBatchGift,
		memberships: BlackbaudMembership,
		paymentTransactions: BlackbaudPaymentTransaction,
		oneRosterKeys: BlackbaudOneRosterKey,
	},
} as const;
