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
import {
	BestBuyEndpointInputSchemas,
	BestBuyEndpointOutputSchemas,
} from './types';

export const getProducts: BestBuyEndpoints['getProducts'] = async (
	ctx,
	input,
) => {
	const parsed = BestBuyEndpointInputSchemas.getProducts.parse(input);
	const filters: string[] = [];
	if (parsed.sku) filters.push(attrEquals('sku', parsed.sku));
	if (parsed.upc) filters.push(attrEquals('upc', parsed.upc));
	if (parsed.name) filters.push(attrEquals('name', parsed.name));
	if (parsed.salePrice) filters.push(salePriceFilter(parsed.salePrice));
	if (parsed.categoryPathId) {
		filters.push(attrEquals('categoryPath.id', parsed.categoryPathId));
	}

	const result = await bestbuyCall(
		ctx,
		collectionPath('products', filters),
		BestBuyEndpointOutputSchemas.getProducts,
		pageQuery(parsed),
	);
	await logEventFromContext(ctx, 'bestbuy.products.list', parsed, 'completed');
	return result;
};

export const getProductDetails: BestBuyEndpoints['getProductDetails'] = async (
	ctx,
	input,
) => {
	const parsed = BestBuyEndpointInputSchemas.getProductDetails.parse(input);
	const result = await bestbuyCall(
		ctx,
		`products/${encodeURIComponent(parsed.sku)}.json`,
		BestBuyEndpointOutputSchemas.getProductDetails,
		{ show: parsed.show },
	);
	await logEventFromContext(
		ctx,
		'bestbuy.products.get',
		{ sku: parsed.sku },
		'completed',
	);
	return result;
};

export const getCategories: BestBuyEndpoints['getCategories'] = async (
	ctx,
	input,
) => {
	const parsed = BestBuyEndpointInputSchemas.getCategories.parse(input);
	const filters: string[] = [];
	if (parsed.id) filters.push(attrIn('id', parsed.id));
	if (parsed.name) filters.push(attrIn('name', parsed.name));

	const result = await bestbuyCall(
		ctx,
		collectionPath('categories', filters),
		BestBuyEndpointOutputSchemas.getCategories,
		pageQuery(parsed),
	);
	await logEventFromContext(
		ctx,
		'bestbuy.categories.list',
		parsed,
		'completed',
	);
	return result;
};

export const getCategoryDetails: BestBuyEndpoints['getCategoryDetails'] =
	async (ctx, input) => {
		const parsed = BestBuyEndpointInputSchemas.getCategoryDetails.parse(input);
		const result = await bestbuyCall(
			ctx,
			`categories/${encodeURIComponent(parsed.id)}.json`,
			BestBuyEndpointOutputSchemas.getCategoryDetails,
			{ show: parsed.show },
		);
		await logEventFromContext(
			ctx,
			'bestbuy.categories.get',
			{ id: parsed.id },
			'completed',
		);
		return result;
	};

export const getStores: BestBuyEndpoints['getStores'] = async (ctx, input) => {
	const parsed = BestBuyEndpointInputSchemas.getStores.parse(input);
	const filters: string[] = [];
	if (parsed.geo) {
		const distance = parsed.geo.distance ?? 10;
		if (parsed.geo.postalCode) {
			filters.push(`area(${parsed.geo.postalCode},${distance})`);
		} else if (parsed.geo.lat !== undefined && parsed.geo.lng !== undefined) {
			filters.push(`area(${parsed.geo.lat},${parsed.geo.lng},${distance})`);
		}
	}
	if (parsed.city) filters.push(attrEquals('city', parsed.city));
	const region = parsed.region ?? parsed.state;
	if (region) filters.push(attrEquals('region', region));
	if (parsed.storeId !== undefined) {
		filters.push(attrEquals('storeId', parsed.storeId));
	}
	if (parsed.postalCode) {
		filters.push(attrEquals('postalCode', parsed.postalCode));
	}
	if (parsed.storeType) filters.push(attrEquals('storeType', parsed.storeType));
	if (parsed.services) {
		filters.push(attrIn('services.service', parsed.services));
	}

	const result = await bestbuyCall(
		ctx,
		collectionPath('stores', filters),
		BestBuyEndpointOutputSchemas.getStores,
		pageQuery(parsed),
	);
	await logEventFromContext(ctx, 'bestbuy.stores.list', parsed, 'completed');
	return result;
};

export const getStoreDetails: BestBuyEndpoints['getStoreDetails'] = async (
	ctx,
	input,
) => {
	const parsed = BestBuyEndpointInputSchemas.getStoreDetails.parse(input);
	const result = await bestbuyCall(
		ctx,
		`stores/${encodeURIComponent(parsed.storeId)}.json`,
		BestBuyEndpointOutputSchemas.getStoreDetails,
		{ show: parsed.show },
	);
	await logEventFromContext(
		ctx,
		'bestbuy.stores.get',
		{ storeId: parsed.storeId },
		'completed',
	);
	return result;
};

export const getReviews: BestBuyEndpoints['getReviews'] = async (
	ctx,
	input,
) => {
	const parsed = BestBuyEndpointInputSchemas.getReviews.parse(input);
	const filters: string[] = [];
	if (parsed.sku) filters.push(attrEquals('sku', parsed.sku));
	if (parsed.reviewer) {
		filters.push(attrEquals('reviewer.name', parsed.reviewer));
	}
	if (parsed.minScore !== undefined) filters.push(`rating>=${parsed.minScore}`);
	if (parsed.maxScore !== undefined) filters.push(`rating<=${parsed.maxScore}`);

	const result = await bestbuyCall(
		ctx,
		collectionPath('reviews', filters),
		BestBuyEndpointOutputSchemas.getReviews,
		pageQuery(parsed),
	);
	await logEventFromContext(ctx, 'bestbuy.reviews.list', parsed, 'completed');
	return result;
};

export const getReviewDetails: BestBuyEndpoints['getReviewDetails'] = async (
	ctx,
	input,
) => {
	const parsed = BestBuyEndpointInputSchemas.getReviewDetails.parse(input);
	const result = await bestbuyCall(
		ctx,
		`reviews/${encodeURIComponent(parsed.id)}.json`,
		BestBuyEndpointOutputSchemas.getReviewDetails,
		{ show: parsed.show },
	);
	await logEventFromContext(
		ctx,
		'bestbuy.reviews.get',
		{ id: parsed.id },
		'completed',
	);
	return result;
};
