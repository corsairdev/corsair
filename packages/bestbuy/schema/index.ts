import {
	BestBuyCategoryEntity,
	BestBuyProductEntity,
	BestBuyReviewEntity,
	BestBuyStoreEntity,
} from './database';

export const BestBuySchema = {
	version: '1.0.0',
	entities: {
		products: BestBuyProductEntity,
		categories: BestBuyCategoryEntity,
		stores: BestBuyStoreEntity,
		reviews: BestBuyReviewEntity,
	},
} as const;

export * from './database';
