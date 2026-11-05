import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['offerCodesList'] = (ctx, input) =>
	call(ctx, 'offerCodesList', 'offerCodes.list', '/offer_codes', input, {
		toQuery: (parsed) => ({
			auto_apply: parsed.auto_apply,
			page_key: parsed.page_key,
		}),
	});

export const get: GumroadEndpoints['offerCodesGet'] = (ctx, input) =>
	call(
		ctx,
		'offerCodesGet',
		'offerCodes.get',
		`/offer_codes/${encodeURIComponent(input.id)}`,
		input,
	);

const writableEntries = (parsed: {
	max_purchase_count?: number;
	minimum_amount_cents?: number;
	auto_apply?: 'true' | 'false';
	sale_label?: string;
	valid_at?: string;
	expires_at?: string;
}) =>
	formEntries({
		max_purchase_count: parsed.max_purchase_count,
		minimum_amount_cents: parsed.minimum_amount_cents,
		auto_apply: parsed.auto_apply,
		sale_label: parsed.sale_label,
		valid_at: parsed.valid_at,
		expires_at: parsed.expires_at,
	});

export const update: GumroadEndpoints['offerCodesUpdate'] = (ctx, input) =>
	call(
		ctx,
		'offerCodesUpdate',
		'offerCodes.update',
		`/offer_codes/${encodeURIComponent(input.id)}`,
		input,
		{ method: 'PUT', toForm: writableEntries },
	);

export const listForProduct: GumroadEndpoints['offerCodesListForProduct'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'offerCodesListForProduct',
		'offerCodes.listForProduct',
		`/products/${encodeURIComponent(input.product_id)}/offer_codes`,
		input,
	);

export const getForProduct: GumroadEndpoints['offerCodesGetForProduct'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'offerCodesGetForProduct',
		'offerCodes.getForProduct',
		`/products/${encodeURIComponent(input.product_id)}/offer_codes/${encodeURIComponent(input.id)}`,
		input,
	);

export const createForProduct: GumroadEndpoints['offerCodesCreateForProduct'] =
	(ctx, input) =>
		call(
			ctx,
			'offerCodesCreateForProduct',
			'offerCodes.createForProduct',
			`/products/${encodeURIComponent(input.product_id)}/offer_codes`,
			input,
			{
				method: 'POST',
				toForm: (parsed) =>
					formEntries({
						name: parsed.name,
						amount_off: parsed.amount_off,
						offer_type: parsed.offer_type,
						max_purchase_count: parsed.max_purchase_count,
						minimum_amount_cents: parsed.minimum_amount_cents,
						universal: parsed.universal,
						auto_apply: parsed.auto_apply,
						sale_label: parsed.sale_label,
						valid_at: parsed.valid_at,
						expires_at: parsed.expires_at,
					}),
			},
		);

export const updateForProduct: GumroadEndpoints['offerCodesUpdateForProduct'] =
	(ctx, input) =>
		call(
			ctx,
			'offerCodesUpdateForProduct',
			'offerCodes.updateForProduct',
			`/products/${encodeURIComponent(input.product_id)}/offer_codes/${encodeURIComponent(input.id)}`,
			input,
			{ method: 'PUT', toForm: writableEntries },
		);

export const deleteForProduct: GumroadEndpoints['offerCodesDeleteForProduct'] =
	(ctx, input) =>
		call(
			ctx,
			'offerCodesDeleteForProduct',
			'offerCodes.deleteForProduct',
			`/products/${encodeURIComponent(input.product_id)}/offer_codes/${encodeURIComponent(input.id)}`,
			input,
			{ method: 'DELETE' },
		);
