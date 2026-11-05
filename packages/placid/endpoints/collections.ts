import type { PlacidEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const list: PlacidEndpoints['collectionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.list',
			input: Inputs.collectionsList,
			output: Outputs.collectionsList,
		},
		input,
		(parsed) => ({ method: 'GET', path: '/collections', query: parsed }),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const create: PlacidEndpoints['collectionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.create',
			input: Inputs.collectionsCreate,
			output: Outputs.collectionsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/collections', body: parsed }),
		{
			log: (_, result) => ({ id: result.id }),
		},
	);

export const get: PlacidEndpoints['collectionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.get',
			input: Inputs.collectionsGet,
			output: Outputs.collectionsGet,
		},
		input,
		({ collection_id }) => ({
			method: 'GET',
			path: `/collections/${segment(collection_id)}`,
		}),
		{
			log: (_, result) => ({ id: result.id }),
		},
	);

export const update: PlacidEndpoints['collectionsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'collections.update',
			input: Inputs.collectionsUpdate,
			output: Outputs.collectionsUpdate,
		},
		input,
		({ collection_id, ...body }) => ({
			method: 'PATCH',
			path: `/collections/${segment(collection_id)}`,
			body,
		}),
		{
			log: ({ collection_id }) => ({ id: collection_id }),
		},
	);

export const remove: PlacidEndpoints['collectionsDelete'] = (ctx, input) =>
	callDelete(
		ctx,
		{
			event: 'collections.delete',
			input: Inputs.collectionsDelete,
			output: Outputs.collectionsDelete,
		},
		input,
		({ collection_id }) => ({
			method: 'DELETE',
			path: `/collections/${segment(collection_id)}`,
		}),
		({ collection_id }) => ({ success: true as const, collection_id }),
		({ collection_id }) => ({ id: collection_id }),
	);
