import type { GumroadEndpoints } from '..';
import type { GumroadForm } from '../client';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['productsList'] = (ctx, input) =>
	call(ctx, 'productsList', 'products.list', '/products', input);

export const get: GumroadEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		'productsGet',
		'products.get',
		`/products/${encodeURIComponent(input.id)}`,
		input,
	);

// The docs' attach flow posts repeated files[][...] keys, one pair per file,
// so file entries join the ordered form entry list.
type ProductFileEntry = { id?: string; external_id?: string; url: string };

function fileFormEntries(files: ProductFileEntry[] | undefined): GumroadForm {
	const entries: GumroadForm = [];
	for (const file of files ?? []) {
		if (file.id !== undefined) entries.push(['files[][id]', file.id]);
		if (file.external_id !== undefined) {
			entries.push(['files[][external_id]', file.external_id]);
		}
		entries.push(['files[][url]', file.url]);
	}
	return entries;
}

export const create: GumroadEndpoints['productsCreate'] = (ctx, input) =>
	call(ctx, 'productsCreate', 'products.create', '/products', input, {
		method: 'POST',
		toForm: (parsed) => [
			...formEntries({
				draft: parsed.draft,
				published: parsed.published,
				native_type: parsed.native_type,
				name: parsed.name,
				description: parsed.description,
				custom_permalink: parsed.custom_permalink,
				price: parsed.price,
				price_currency_type: parsed.price_currency_type,
				subscription_duration: parsed.subscription_duration,
				customizable_price: parsed.customizable_price,
				suggested_price_cents: parsed.suggested_price_cents,
				max_purchase_count: parsed.max_purchase_count,
				category: parsed.category,
				taxonomy_id: parsed.taxonomy_id,
				tags: parsed.tags !== undefined ? parsed.tags.join(',') : undefined,
				custom_summary: parsed.custom_summary,
				refund_period: parsed.refund_period,
				refund_fine_print: parsed.refund_fine_print,
				rich_content: parsed.rich_content
					? JSON.stringify(parsed.rich_content)
					: undefined,
			}),
			...fileFormEntries(parsed.files),
		],
	});

export const update: GumroadEndpoints['productsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'productsUpdate',
		'products.update',
		`/products/${encodeURIComponent(input.id)}`,
		input,
		{
			method: 'PUT',
			toForm: (parsed) => [
				...formEntries({
					name: parsed.name,
					description: parsed.description,
					custom_permalink: parsed.custom_permalink,
					price: parsed.price,
					price_currency_type: parsed.price_currency_type,
					customizable_price: parsed.customizable_price,
					suggested_price_cents: parsed.suggested_price_cents,
					max_purchase_count: parsed.max_purchase_count,
					quantity_enabled: parsed.quantity_enabled,
					is_adult: parsed.is_adult,
					display_product_reviews: parsed.display_product_reviews,
					should_show_sales_count: parsed.should_show_sales_count,
					category: parsed.category,
					taxonomy_id: parsed.taxonomy_id,
					// tags and cover_ids are full-replacement params: [] must send
					// an empty value to clear them, not drop the field entirely.
					tags: parsed.tags !== undefined ? parsed.tags.join(',') : undefined,
					custom_receipt: parsed.custom_receipt,
					custom_summary: parsed.custom_summary,
					refund_period: parsed.refund_period,
					refund_fine_print: parsed.refund_fine_print,
					custom_html: parsed.custom_html,
					cover_ids:
						parsed.cover_ids !== undefined
							? parsed.cover_ids.join(',')
							: undefined,
					rich_content: parsed.rich_content
						? JSON.stringify(parsed.rich_content)
						: undefined,
					has_same_rich_content_for_all_variants:
						parsed.has_same_rich_content_for_all_variants,
				}),
				...fileFormEntries(parsed.files),
			],
		},
	);

export const remove: GumroadEndpoints['productsDelete'] = (ctx, input) =>
	call(
		ctx,
		'productsDelete',
		'products.delete',
		`/products/${encodeURIComponent(input.id)}`,
		input,
		{ method: 'DELETE' },
	);

export const enable: GumroadEndpoints['productsEnable'] = (ctx, input) =>
	call(
		ctx,
		'productsEnable',
		'products.enable',
		`/products/${encodeURIComponent(input.id)}/enable`,
		input,
		{ method: 'PUT' },
	);

export const disable: GumroadEndpoints['productsDisable'] = (ctx, input) =>
	call(
		ctx,
		'productsDisable',
		'products.disable',
		`/products/${encodeURIComponent(input.id)}/disable`,
		input,
		{ method: 'PUT' },
	);

export const reviewsList: GumroadEndpoints['productsReviewsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'productsReviewsList',
		'products.reviewsList',
		`/products/${encodeURIComponent(input.product_id)}/reviews`,
		input,
		{ toQuery: (parsed) => ({ page_key: parsed.page_key }) },
	);

export const categoriesList: GumroadEndpoints['productsCategoriesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'productsCategoriesList',
		'products.categoriesList',
		'/categories',
		input,
	);

export const coversAdd: GumroadEndpoints['productsCoversAdd'] = (ctx, input) =>
	call(
		ctx,
		'productsCoversAdd',
		'products.coversAdd',
		`/products/${encodeURIComponent(input.product_id)}/covers`,
		input,
		{
			method: 'POST',
			toForm: (parsed) => formEntries({ url: parsed.url }),
		},
	);

export const coversDelete: GumroadEndpoints['productsCoversDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'productsCoversDelete',
		'products.coversDelete',
		`/products/${encodeURIComponent(input.product_id)}/covers/${encodeURIComponent(input.id)}`,
		input,
		{ method: 'DELETE' },
	);

export const thumbnailSet: GumroadEndpoints['productsThumbnailSet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'productsThumbnailSet',
		'products.thumbnailSet',
		`/products/${encodeURIComponent(input.product_id)}/thumbnail`,
		input,
		{
			method: 'POST',
			toForm: (parsed) =>
				formEntries({ url: parsed.url, signed_blob_id: parsed.signed_blob_id }),
		},
	);

export const thumbnailDelete: GumroadEndpoints['productsThumbnailDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'productsThumbnailDelete',
		'products.thumbnailDelete',
		`/products/${encodeURIComponent(input.product_id)}/thumbnail`,
		input,
		{ method: 'DELETE' },
	);
