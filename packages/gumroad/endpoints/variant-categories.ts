import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

const categoryPath = (product_id: string) =>
	`/products/${encodeURIComponent(product_id)}/variant_categories`;

const variantPath = (product_id: string, variant_category_id: string): string =>
	`${categoryPath(product_id)}/${encodeURIComponent(variant_category_id)}/variants`;

export const list: GumroadEndpoints['variantCategoriesList'] = (ctx, input) =>
	call(
		ctx,
		'variantCategoriesList',
		'variantCategories.list',
		categoryPath(input.product_id),
		input,
	);

export const create: GumroadEndpoints['variantCategoriesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'variantCategoriesCreate',
		'variantCategories.create',
		categoryPath(input.product_id),
		input,
		{
			method: 'POST',
			toForm: (parsed) => formEntries({ title: parsed.title }),
		},
	);

export const get: GumroadEndpoints['variantCategoriesGet'] = (ctx, input) =>
	call(
		ctx,
		'variantCategoriesGet',
		'variantCategories.get',
		`${categoryPath(input.product_id)}/${encodeURIComponent(input.id)}`,
		input,
	);

export const update: GumroadEndpoints['variantCategoriesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'variantCategoriesUpdate',
		'variantCategories.update',
		`${categoryPath(input.product_id)}/${encodeURIComponent(input.id)}`,
		input,
		{
			method: 'PUT',
			toForm: (parsed) => formEntries({ title: parsed.title }),
		},
	);

export const remove: GumroadEndpoints['variantCategoriesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'variantCategoriesDelete',
		'variantCategories.delete',
		`${categoryPath(input.product_id)}/${encodeURIComponent(input.id)}`,
		input,
		{ method: 'DELETE' },
	);

export const variantsList: GumroadEndpoints['variantCategoriesVariantsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'variantCategoriesVariantsList',
		'variantCategories.variantsList',
		variantPath(input.product_id, input.variant_category_id),
		input,
	);

export const variantsCreate: GumroadEndpoints['variantCategoriesVariantsCreate'] =
	(ctx, input) =>
		call(
			ctx,
			'variantCategoriesVariantsCreate',
			'variantCategories.variantsCreate',
			variantPath(input.product_id, input.variant_category_id),
			input,
			{
				method: 'POST',
				toForm: (parsed) =>
					formEntries({
						name: parsed.name,
						price_difference_cents: parsed.price_difference_cents,
						max_purchase_count: parsed.max_purchase_count,
					}),
			},
		);

export const variantsGet: GumroadEndpoints['variantCategoriesVariantsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'variantCategoriesVariantsGet',
		'variantCategories.variantsGet',
		`${variantPath(input.product_id, input.variant_category_id)}/${encodeURIComponent(input.id)}`,
		input,
	);

export const variantsUpdate: GumroadEndpoints['variantCategoriesVariantsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			'variantCategoriesVariantsUpdate',
			'variantCategories.variantsUpdate',
			`${variantPath(input.product_id, input.variant_category_id)}/${encodeURIComponent(input.id)}`,
			input,
			{
				method: 'PUT',
				toForm: (parsed) =>
					formEntries({
						name: parsed.name,
						price_difference_cents: parsed.price_difference_cents,
						max_purchase_count: parsed.max_purchase_count,
					}),
			},
		);

export const variantsDelete: GumroadEndpoints['variantCategoriesVariantsDelete'] =
	(ctx, input) =>
		call(
			ctx,
			'variantCategoriesVariantsDelete',
			'variantCategories.variantsDelete',
			`${variantPath(input.product_id, input.variant_category_id)}/${encodeURIComponent(input.id)}`,
			input,
			{ method: 'DELETE' },
		);
