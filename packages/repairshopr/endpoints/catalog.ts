import type { z } from 'zod';
import type { RepairshoprEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { pagedShape, singleShape } from './shape';
import {
	RepairshoprEndpointInputSchemas as Inputs,
	RepairshoprEndpointOutputSchemas as Outputs,
} from './types';

export const invoicesList: RepairshoprEndpoints['invoicesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'invoices.list',
			input: Inputs.invoicesList,
			output: Outputs.invoicesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/invoices',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				per_page: parsed.per_page,
				ticket_id: parsed.ticket_id,
				paid: parsed.paid,
				unpaid: parsed.unpaid,
				since_updated_at: parsed.since_updated_at,
			}),
		}),
		{
			shape: pagedShape('invoices'),
			log: (_, result) => ({
				count: result.invoices.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const invoicesGet: RepairshoprEndpoints['invoicesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'invoices.get',
			input: Inputs.invoicesGet,
			output: Outputs.invoicesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/invoices/${segment(parsed.invoice_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('invoice'),
			log: (_, result) => ({ invoiceId: result.invoice.id ?? 0 }),
		},
	);

export const productsList: RepairshoprEndpoints['productsList'] = (
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
			path: '/products',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				query: parsed.query,
				sku: parsed.sku,
				name: parsed.name,
				upc_code: parsed.upc_code,
				category_id: parsed.category_id,
				id: parsed.id,
				id_not: parsed.id_not,
				sort: parsed.sort,
			}),
		}),
		{
			shape: pagedShape('products'),
			log: (_, result) => ({
				count: result.products.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const productsGet: RepairshoprEndpoints['productsGet'] = (ctx, input) =>
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
			path: `/products/${segment(parsed.product_id)}`,
			replayable: true,
		}),
		{
			shape: singleShape('product'),
			log: (_, result) => ({ productId: result.product.id ?? 0 }),
		},
	);

/**
 * The product fields, already in the wire spelling. `product_id` is stripped on
 * an update because it travels in the path.
 */
function productBody(
	input: Partial<z.output<(typeof Inputs)['productsCreate']>> & {
		product_id?: number;
	},
	// unknown: the body is assembled from the parsed input under wire names,
	// so its values are the provider's own shapes rather than one declared type.
): Record<string, unknown> {
	const { product_id: _id, ...rest } = input;
	return Object.fromEntries(
		Object.entries(rest).filter(([, value]) => value !== undefined),
	);
}

export const productsCreate: RepairshoprEndpoints['productsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.create',
			input: Inputs.productsCreate,
			output: Outputs.productsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/products',
			replayable: false,
			body: productBody(parsed),
		}),
		{
			shape: singleShape('product'),
			log: (_, result) => ({ productId: result.product.id ?? 0 }),
		},
	);

export const productsUpdate: RepairshoprEndpoints['productsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.update',
			input: Inputs.productsUpdate,
			output: Outputs.productsUpdate,
		},
		input,
		(parsed) => {
			const { product_id: productId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/products/${segment(productId)}`,
				replayable: false,
				body: productBody(rest),
			};
		},
		{
			shape: singleShape('product'),
			log: (parsed) => ({ productId: parsed.product_id }),
		},
	);

export const contactsList: RepairshoprEndpoints['contactsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/contacts',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				customer_id: parsed.customer_id,
			}),
		}),
		{
			shape: pagedShape('contacts'),
			log: (_, result) => ({
				count: result.contacts.length,
				hasNext: result.next_page !== null,
			}),
		},
	);

export const vendorsList: RepairshoprEndpoints['vendorsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vendors.list',
			input: Inputs.vendorsList,
			output: Outputs.vendorsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/vendors',
			replayable: true,
			query: queryOf({ page: parsed.page }),
		}),
		{
			shape: pagedShape('vendors'),
			log: (_, result) => ({
				count: result.vendors.length,
				hasNext: result.next_page !== null,
			}),
		},
	);
