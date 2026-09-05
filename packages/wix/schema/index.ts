import { WixContact, WixOrder, WixProduct } from './database';

export const WixSchema = {
	version: '1.0.0',
	entities: {
		contacts: WixContact,
		products: WixProduct,
		orders: WixOrder,
	},
} as const;
