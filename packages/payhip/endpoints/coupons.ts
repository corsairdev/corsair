import type { PayhipEndpoints } from '..';
import { call } from './call';
import {
	PayhipEndpointInputSchemas as Inputs,
	PayhipEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Payhip refuses a `Z` suffix and fractional seconds ("not a valid RFC 3339
 * datetime string", seen live on 2026-11-21) but takes a numeric offset, so
 * both are rewritten to the form it accepts.
 */
export function toPayhipDate(value: string): string {
	return value
		.replace(/\.\d+(?=Z|[+-]\d{2}:\d{2}$)/, '')
		.replace(/Z$/, '+00:00');
}

/** Flattens the input into the form fields the API takes. */
function couponForm(input: {
	code: string;
	coupon_type: 'single' | 'multi' | 'collection';
	percent_off?: number;
	amount_off?: number;
	product_key?: string;
	collection_id?: string;
	start_date?: string;
	end_date?: string;
	minimum_purchase_amount?: number;
	usage_limit?: number;
	notes?: string;
}): Record<string, string> {
	const form: Record<string, string> = {
		code: input.code,
		coupon_type: input.coupon_type,
	};
	if (input.percent_off !== undefined)
		form['percent_off'] = String(input.percent_off);
	if (input.amount_off !== undefined)
		form['amount_off'] = String(input.amount_off);
	if (input.product_key !== undefined) form['product_key'] = input.product_key;
	if (input.collection_id !== undefined)
		form['collection_id'] = input.collection_id;
	if (input.start_date !== undefined)
		form['start_date'] = toPayhipDate(input.start_date);
	if (input.end_date !== undefined)
		form['end_date'] = toPayhipDate(input.end_date);
	if (input.minimum_purchase_amount !== undefined)
		form['minimum_purchase_amount'] = String(input.minimum_purchase_amount);
	if (input.usage_limit !== undefined)
		form['usage_limit'] = String(input.usage_limit);
	if (input.notes !== undefined) form['notes'] = input.notes;
	return form;
}

export const create: PayhipEndpoints['couponsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'coupons.create',
			input: Inputs.couponsCreate,
			output: Outputs.couponsCreate,
		},
		input,
		(input) => ({
			method: 'POST',
			path: '/api/v2/coupons',
			auth: 'account',
			form: couponForm(input),
		}),
		{ log: (_, result) => ({ couponId: result.data.id ?? undefined }) },
	);

export const list: PayhipEndpoints['couponsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'coupons.list',
			input: Inputs.couponsList,
			output: Outputs.couponsList,
		},
		input,
		(query) => ({
			method: 'GET',
			path: '/api/v2/coupons',
			auth: 'account',
			query: { limit: query.limit, offset: query.offset },
		}),
		{ log: (_, page) => ({ count: page.data.coupons.length }) },
	);

export const get: PayhipEndpoints['couponsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'coupons.get',
			input: Inputs.couponsGet,
			output: Outputs.couponsGet,
		},
		input,
		({ couponId }) => ({
			method: 'GET',
			path: `/api/v2/coupons/${couponId}`,
			auth: 'account',
		}),
		{ log: (_, result) => ({ couponId: result.data.id ?? undefined }) },
	);
