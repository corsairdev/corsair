import type { DataForSeoEndpoints } from '..';
import { call, results } from './call';

export const products: DataForSeoEndpoints['amazonProducts'] = (ctx, input) =>
	call(
		ctx,
		'amazonProducts',
		'amazon.products',
		{
			method: 'POST',
			path: '/v3/merchant/amazon/products/live/advanced',
		},
		input,
	);

export const asin: DataForSeoEndpoints['amazonAsin'] = async (ctx, input) => {
	const response = await call(
		ctx,
		'amazonAsin',
		'amazon.asin',
		{
			method: 'POST',
			path: '/v3/merchant/amazon/asin/live/advanced',
		},
		input,
	);
	if (ctx.db.amazonProducts) {
		try {
			for (const product of results(response).flatMap((r) => r.items ?? [])) {
				if (!product.data_asin) continue;
				await ctx.db.amazonProducts.upsertByEntityId(product.data_asin, {
					asin: product.data_asin,
					title: product.title ?? undefined,
					priceFrom: product.price_from ?? undefined,
					currency: product.currency ?? undefined,
					rating: product.rating?.value ?? undefined,
					ratingCount: product.rating?.votes_count ?? undefined,
					isAvailable: product.is_available ?? undefined,
					updatedAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save DataForSEO Amazon product:', error);
		}
	}
	return response;
};
