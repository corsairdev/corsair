import {
	WixContact,
	WixCoupon,
	WixInventoryItem,
	WixOrder,
	WixProduct,
} from './database';

export const WixSchema = {
	version: '1.0.0',
	entities: {
		contacts: WixContact,
		products: WixProduct,
		orders: WixOrder,
		inventoryItems: WixInventoryItem,
		coupons: WixCoupon,
	},
} as const;
