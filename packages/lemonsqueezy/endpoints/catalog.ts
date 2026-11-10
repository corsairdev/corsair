import type { LemonSqueezyEndpoints } from '..';
import { segment } from '../client';
import { call, idOf } from './call';
import {
	LemonSqueezyEndpointInputSchemas as Inputs,
	invoiceQuery,
	LemonSqueezyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The catalog resources: reads that need no write, grouped by the resource the
 * route names. Everything here is one GET, so a 5xx is safe to replay (see
 * error-handlers.ts).
 *
 * Query parameters go out in JSON:API bracket form. `filter[...]` keys are
 * built here rather than typed in the schema, so a filter the resource does not
 * support is a 400 from Lemon Squeezy naming the parameter, not a silent
 * no-op: the API rejects unknown filters rather than ignoring them.
 */

/** Paging and include, shared by every list below. */
type ListInput = {
	pageNumber?: number;
	pageSize?: number;
	sort?: string;
	include?: readonly string[];
};

function pageQuery(
	parsed: ListInput,
	filters: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
	const query: Record<string, string | number | boolean | undefined> = {
		'page[number]': parsed.pageNumber,
		'page[size]': parsed.pageSize,
		sort: parsed.sort,
		include: parsed.include?.join(','),
	};
	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined) query[`filter[${key}]`] = value;
	}
	return query;
}

// ── users ─────────────────────────────────────────────────────────────────

export const usersGet: LemonSqueezyEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.get', input: Inputs.usersGet, output: Outputs.usersGet },
		input,
		() => ({ method: 'GET', path: '/v1/users/me' }),
		{ log: (_, result) => ({ userId: result.data.id }) },
	);

// ── stores ────────────────────────────────────────────────────────────────

export const storesList: LemonSqueezyEndpoints['storesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stores.list',
			input: Inputs.storesList,
			output: Outputs.storesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/stores',
			query: pageQuery(parsed),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const storesGet: LemonSqueezyEndpoints['storesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'stores.get', input: Inputs.storesGet, output: Outputs.storesGet },
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/stores/${segment(parsed.storeId)}`,
		}),
		{ log: (parsed) => ({ storeId: parsed.storeId }) },
	);

// ── products ──────────────────────────────────────────────────────────────

export const productsList: LemonSqueezyEndpoints['productsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/products',
			query: pageQuery(parsed, { store_id: parsed.storeId }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const productsGet: LemonSqueezyEndpoints['productsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/products/${segment(parsed.productId)}`,
		}),
		{ log: (parsed) => ({ productId: parsed.productId }) },
	);

// ── variants ──────────────────────────────────────────────────────────────

export const variantsList: LemonSqueezyEndpoints['variantsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'variants.list',
			input: Inputs.variantsList,
			output: Outputs.variantsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/variants',
			query: pageQuery(parsed, {
				product_id: parsed.productId,
				status: parsed.status,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const variantsGet: LemonSqueezyEndpoints['variantsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'variants.get',
			input: Inputs.variantsGet,
			output: Outputs.variantsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/variants/${segment(parsed.variantId)}`,
		}),
		{ log: (parsed) => ({ variantId: parsed.variantId }) },
	);

// ── prices ────────────────────────────────────────────────────────────────

export const pricesList: LemonSqueezyEndpoints['pricesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'prices.list',
			input: Inputs.pricesList,
			output: Outputs.pricesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/prices',
			query: pageQuery(parsed, { variant_id: parsed.variantId }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const pricesGet: LemonSqueezyEndpoints['pricesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'prices.get', input: Inputs.pricesGet, output: Outputs.pricesGet },
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/prices/${segment(parsed.priceId)}`,
		}),
		{ log: (parsed) => ({ priceId: parsed.priceId }) },
	);

// ── files ─────────────────────────────────────────────────────────────────

export const filesList: LemonSqueezyEndpoints['filesList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'files.list', input: Inputs.filesList, output: Outputs.filesList },
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/files',
			query: pageQuery(parsed, { variant_id: parsed.variantId }),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const filesGet: LemonSqueezyEndpoints['filesGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'files.get', input: Inputs.filesGet, output: Outputs.filesGet },
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/files/${segment(parsed.fileId)}`,
		}),
		{ log: (parsed) => ({ fileId: parsed.fileId }) },
	);

// ── orders ────────────────────────────────────────────────────────────────

export const ordersList: LemonSqueezyEndpoints['ordersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'orders.list',
			input: Inputs.ordersList,
			output: Outputs.ordersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/orders',
			query: pageQuery(parsed, {
				store_id: parsed.storeId,
				user_email: parsed.userEmail,
				order_number: parsed.orderNumber,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const ordersGet: LemonSqueezyEndpoints['ordersGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'orders.get', input: Inputs.ordersGet, output: Outputs.ordersGet },
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/orders/${segment(parsed.orderId)}`,
		}),
		{ log: (parsed) => ({ orderId: parsed.orderId }) },
	);

/**
 * Generates the order's invoice PDF. The billing details go in the query
 * string, and Lemon Squeezy answers a download link under `meta.urls`; the
 * call itself does not move money.
 */
export const ordersGenerateInvoice: LemonSqueezyEndpoints['ordersGenerateInvoice'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'orders.generateInvoice',
				input: Inputs.ordersGenerateInvoice,
				output: Outputs.ordersGenerateInvoice,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `/v1/orders/${segment(parsed.orderId)}/generate-invoice`,
				query: invoiceQuery(parsed),
			}),
			{
				// The billing details are personal data, so only the id is logged.
				log: (parsed) => ({ orderId: parsed.orderId }),
			},
		);

/**
 * Issues a refund. The amount is in cents and optional; omitting it refunds the
 * whole order. This is irreversible: a refund cannot be undone through the API.
 */
export const ordersRefund: LemonSqueezyEndpoints['ordersRefund'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orders.refund',
			input: Inputs.ordersRefund,
			output: Outputs.ordersRefund,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/v1/orders/${segment(parsed.orderId)}/refund`,
			body: {
				data: {
					type: 'orders',
					id: parsed.orderId,
					attributes:
						parsed.amount === undefined ? {} : { amount: parsed.amount },
				},
			},
		}),
		{
			log: (parsed, result) => ({
				orderId: parsed.orderId,
				amount: parsed.amount,
				refundedAmount: result.data.attributes.refunded_amount ?? undefined,
			}),
		},
	);

// ── order items ───────────────────────────────────────────────────────────

export const orderItemsList: LemonSqueezyEndpoints['orderItemsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orderItems.list',
			input: Inputs.orderItemsList,
			output: Outputs.orderItemsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/order-items',
			query: pageQuery(parsed, {
				order_id: parsed.orderId,
				product_id: parsed.productId,
				variant_id: parsed.variantId,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const orderItemsGet: LemonSqueezyEndpoints['orderItemsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'orderItems.get',
			input: Inputs.orderItemsGet,
			output: Outputs.orderItemsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/order-items/${segment(parsed.orderItemId)}`,
		}),
		{ log: (parsed) => ({ orderItemId: parsed.orderItemId }) },
	);

// ── affiliates ────────────────────────────────────────────────────────────

export const affiliatesList: LemonSqueezyEndpoints['affiliatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'affiliates.list',
			input: Inputs.affiliatesList,
			output: Outputs.affiliatesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/affiliates',
			query: pageQuery(parsed, {
				store_id: parsed.storeId,
				user_email: parsed.userEmail,
			}),
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const affiliatesGet: LemonSqueezyEndpoints['affiliatesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'affiliates.get',
			input: Inputs.affiliatesGet,
			output: Outputs.affiliatesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/affiliates/${segment(parsed.affiliateId)}`,
		}),
		{ log: (parsed) => ({ affiliateId: parsed.affiliateId }) },
	);

/** Reads the id of a created or updated resource for the log line. */
export { idOf };
