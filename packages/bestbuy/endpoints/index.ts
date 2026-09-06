import { logEventFromContext } from 'corsair/core';
import type { BestBuyEndpoints } from '../index';
import {
	attrEquals,
	attrIn,
	bestbuyCall,
	collectionPath,
	pageQuery,
	salePriceFilter,
} from './shared';
import type { BestBuyEndpointOutputs } from './types';

export const getProducts: BestBuyEndpoints['getProducts'] = async (
	ctx,
	input,
) => {
	const filters: string[] = [];
	if (input.sku) filters.push(attrEquals('sku', input.sku));
	if (input.upc) filters.push(attrEquals('upc', input.upc));
	if (input.name) filters.push(attrEquals('name', input.name));
	if (input.salePrice) filters.push(salePriceFilter(input.salePrice));
	if (input.categoryPathId) {
		filters.push(attrEquals('categoryPath.id', input.categoryPathId));
	}

	const result = await bestbuyCall<BestBuyEndpointOutputs['getProducts']>(
		ctx,
		collectionPath('products', filters),
		pageQuery(input),
	);
	await logEventFromContext(ctx, 'bestbuy.products.list', input, 'completed');
	return result;
};

export const getProductDetails: BestBuyEndpoints['getProductDetails'] = async (
	ctx,
	input,
) => {
	const result = await bestbuyCall<BestBuyEndpointOutputs['getProductDetails']>(
		ctx,
		`products/${encodeURIComponent(input.sku)}.json`,
		{ show: input.show },
	);
	await logEventFromContext(
		ctx,
		'bestbuy.products.get',
		{ sku: input.sku },
		'completed',
	);
	return result;
};

export const getCategories: BestBuyEndpoints['getCategories'] = async (
	ctx,
	input,
) => {
	const filters: string[] = [];
	if (input.id) filters.push(attrIn('id', input.id));
	if (input.name) filters.push(attrIn('name', input.name));

	const result = await bestbuyCall<BestBuyEndpointOutputs['getCategories']>(
		ctx,
		collectionPath('categories', filters),
		pageQuery(input),
	);
	await logEventFromContext(ctx, 'bestbuy.categories.list', input, 'completed');
	return result;
};

export const getCategoryDetails: BestBuyEndpoints['getCategoryDetails'] =
	async (ctx, input) => {
		const result = await bestbuyCall<
			BestBuyEndpointOutputs['getCategoryDetails']
		>(ctx, `categories/${encodeURIComponent(input.id)}.json`, {
			show: input.show,
		});
		await logEventFromContext(
			ctx,
			'bestbuy.categories.get',
			{ id: input.id },
			'completed',
		);
		return result;
	};

export const getStores: BestBuyEndpoints['getStores'] = async (ctx, input) => {
	const filters: string[] = [];
	if (input.geo) {
		const distance = input.geo.distance ?? 10;
		if (input.geo.postalCode) {
			filters.push(`area(${input.geo.postalCode},${distance})`);
		} else if (input.geo.lat !== undefined && input.geo.lng !== undefined) {
			filters.push(`area(${input.geo.lat},${input.geo.lng},${distance})`);
		}
	}
	if (input.city) filters.push(attrEquals('city', input.city));
	const region = input.region ?? input.state;
	if (region) filters.push(attrEquals('region', region));
	if (input.storeId !== undefined) {
		filters.push(attrEquals('storeId', input.storeId));
	}
	if (input.postalCode) {
		filters.push(attrEquals('postalCode', input.postalCode));
	}
	if (input.storeType) filters.push(attrEquals('storeType', input.storeType));
	if (input.services) {
		filters.push(attrIn('services.service', input.services));
	}

	const result = await bestbuyCall<BestBuyEndpointOutputs['getStores']>(
		ctx,
		collectionPath('stores', filters),
		pageQuery(input),
	);
	await logEventFromContext(ctx, 'bestbuy.stores.list', input, 'completed');
	return result;
};

export const getStoreDetails: BestBuyEndpoints['getStoreDetails'] = async (
	ctx,
	input,
) => {
	const result = await bestbuyCall<BestBuyEndpointOutputs['getStoreDetails']>(
		ctx,
		`stores/${encodeURIComponent(input.storeId)}.json`,
		{ show: input.show },
	);
	await logEventFromContext(
		ctx,
		'bestbuy.stores.get',
		{ storeId: input.storeId },
		'completed',
	);
	return result;
};

export const getReviews: BestBuyEndpoints['getReviews'] = async (
	ctx,
	input,
) => {
	const filters: string[] = [];
	if (input.sku) filters.push(attrEquals('sku', input.sku));
	if (input.reviewer) filters.push(attrEquals('reviewer.name', input.reviewer));
	if (input.minScore !== undefined) filters.push(`rating>=${input.minScore}`);
	if (input.maxScore !== undefined) filters.push(`rating<=${input.maxScore}`);

	const result = await bestbuyCall<BestBuyEndpointOutputs['getReviews']>(
		ctx,
		collectionPath('reviews', filters),
		pageQuery(input),
	);
	await logEventFromContext(ctx, 'bestbuy.reviews.list', input, 'completed');
	return result;
};

export const getReviewDetails: BestBuyEndpoints['getReviewDetails'] = async (
	ctx,
	input,
) => {
	const result = await bestbuyCall<BestBuyEndpointOutputs['getReviewDetails']>(
		ctx,
		`reviews/${encodeURIComponent(input.id)}.json`,
		{ show: input.show },
	);
	await logEventFromContext(
		ctx,
		'bestbuy.reviews.get',
		{ id: input.id },
		'completed',
	);
	return result;
};
