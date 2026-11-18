import type { ShippoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ShippoEndpointInputSchemas as Inputs,
	ShippoEndpointOutputSchemas as Outputs,
} from './types';

export const listItems: ShippoEndpoints['customsItemsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customsItems.list',
			input: Inputs.customsItemsList,
			output: Outputs.customsItemsList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/customs/items',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const getItem: ShippoEndpoints['customsItemsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customsItems.get',
			input: Inputs.customsItemsGet,
			output: Outputs.customsItemsGet,
		},
		input,
		({ customs_item_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/customs/items/${segment(customs_item_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ customs_item_id }) => ({ customsItemId: customs_item_id }),
		},
	);

export const createItem: ShippoEndpoints['customsItemsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customsItems.create',
			input: Inputs.customsItemsCreate,
			output: Outputs.customsItemsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/customs/items',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ customsItemId: result.object_id ?? undefined }),
		},
	);

export const listDeclarations: ShippoEndpoints['customsDeclarationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customsDeclarations.list',
			input: Inputs.customsDeclarationsList,
			output: Outputs.customsDeclarationsList,
		},
		input,
		({ page, results, shippo_account_id }) => ({
			method: 'GET',
			path: '/customs/declarations',
			query: { page, results },
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({ count: result.results.length }),
		},
	);

export const getDeclaration: ShippoEndpoints['customsDeclarationsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customsDeclarations.get',
			input: Inputs.customsDeclarationsGet,
			output: Outputs.customsDeclarationsGet,
		},
		input,
		({ customs_declaration_id, shippo_account_id }) => ({
			method: 'GET',
			path: `/customs/declarations/${segment(customs_declaration_id)}`,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: ({ customs_declaration_id }) => ({
				customsDeclarationId: customs_declaration_id,
			}),
		},
	);

export const createDeclaration: ShippoEndpoints['customsDeclarationsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customsDeclarations.create',
			input: Inputs.customsDeclarationsCreate,
			output: Outputs.customsDeclarationsCreate,
		},
		input,
		({ shippo_account_id, ...body }) => ({
			method: 'POST',
			path: '/customs/declarations',
			body,
			shippoAccountId: shippo_account_id,
		}),
		{
			log: (_, result) => ({
				customsDeclarationId: result.object_id ?? undefined,
				contentsType: result.contents_type ?? undefined,
			}),
		},
	);
