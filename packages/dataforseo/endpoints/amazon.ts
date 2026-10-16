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
		// One row per ASIN and market: the same product has its own price and
		// availability on each Amazon domain.
		for (const result of results(response)) {
			if (result.location_code == null) continue;
			for (const product of result.items ?? []) {
				if (!product.data_asin) continue;
				const id = [
					product.data_asin,
					result.se_domain ?? 'amazon',
					result.location_code,
					result.language_code ?? 'any',
				].join(':');
				try {
					await ctx.db.amazonProducts.upsertByEntityId(id, {
						id,
						asin: product.data_asin,
						seDomain: result.se_domain ?? undefined,
						locationCode: result.location_code,
						languageCode: result.language_code ?? undefined,
						title: product.title ?? undefined,
						priceFrom: product.price_from ?? undefined,
						currency: product.currency ?? undefined,
						rating: product.rating?.value ?? undefined,
						ratingCount: product.rating?.votes_count ?? undefined,
						isAvailable: product.is_available ?? undefined,
						updatedAt: new Date(),
					});
				} catch (error) {
					console.warn('Failed to save DataForSEO Amazon product:', error);
				}
			}
		}
	}
	return response;
};
