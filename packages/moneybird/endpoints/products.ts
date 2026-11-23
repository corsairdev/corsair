import type { MoneybirdEndpoints } from '..';
import { idSegment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MoneybirdEndpointInputSchemas as Inputs,
	MoneybirdEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MoneybirdEndpoints['productsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.list',
			input: Inputs.productsList,
			output: Outputs.productsList,
		},
		input,
		({ page, per_page }) => ({
			replayable: true,
			method: 'GET',
			path: '/products.json',
			query: { page, per_page },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page, parsed.per_page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MoneybirdEndpoints['productsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'products.get',
			input: Inputs.productsGet,
			output: Outputs.productsGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/products/${idSegment(id)}.json`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

function upsertBody(input: {
	description?: string;
	title?: string;
	identifier?: string;
	price?: string | number;
	currency?: string;
	tax_rate_id?: string | number;
	ledger_account_id?: string | number;
	frequency?: number;
	frequency_type?: string;
}) {
	return {
		description: input.description,
		title: input.title,
		identifier: input.identifier,
		price: input.price,
		currency: input.currency,
		tax_rate_id: input.tax_rate_id,
		ledger_account_id: input.ledger_account_id,
		frequency: input.frequency,
		frequency_type: input.frequency_type,
	};
}

export const create: MoneybirdEndpoints['productsCreate'] = async (
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
			path: '/products.json',
			body: { product: upsertBody(parsed) },
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id }),
		},
	);

export const update: MoneybirdEndpoints['productsUpdate'] = async (
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
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/products/${idSegment(id)}.json`,
			body: { product: upsertBody(rest) },
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MoneybirdEndpoints['productsDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'products.delete',
			input: Inputs.productsDelete,
			output: Outputs.productsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/products/${idSegment(id)}.json`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, String(id)),
			log: ({ id }) => ({ id }),
		},
	);
