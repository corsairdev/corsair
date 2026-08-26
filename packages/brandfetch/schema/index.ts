import {
	BrandfetchBrand,
	BrandfetchCompany,
	BrandfetchWebhook,
} from './database';

export const BrandfetchSchema = {
	version: '1.0.0',
	entities: {
		brands: BrandfetchBrand,
		companies: BrandfetchCompany,
		webhooks: BrandfetchWebhook,
	},
} as const;
