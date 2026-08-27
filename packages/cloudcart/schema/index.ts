import {
	CloudcartCategory,
	CloudcartCustomer,
	CloudcartOrder,
	CloudcartProduct,
} from './database';

export const CloudcartSchema = {
	version: '1.0.0',
	entities: {
		products: CloudcartProduct,
		orders: CloudcartOrder,
		customers: CloudcartCustomer,
		categories: CloudcartCategory,
	},
} as const;

