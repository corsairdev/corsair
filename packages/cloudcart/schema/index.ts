import {
	CloudcartCategoryEntity,
	CloudcartCustomerEntity,
	CloudcartOrderEntity,
	CloudcartProductEntity,
	CloudcartVariantEntity,
} from './database';

export const CloudcartSchema = {
	version: '1.0.0',
	entities: {
		products: CloudcartProductEntity,
		orders: CloudcartOrderEntity,
		customers: CloudcartCustomerEntity,
		categories: CloudcartCategoryEntity,
		variants: CloudcartVariantEntity,
	},
} as const;
