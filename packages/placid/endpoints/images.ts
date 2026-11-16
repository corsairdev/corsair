import type { PlacidEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const create: PlacidEndpoints['imagesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.create',
			input: Inputs.imagesCreate,
			output: Outputs.imagesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/images',
			body: parsed,
		}),
		{
			log: (_, result) => ({ id: result.id, status: result.status }),
		},
	);

export const get: PlacidEndpoints['imagesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.get',
			input: Inputs.imagesGet,
			output: Outputs.imagesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/images/${segment(id)}` }),
		{
			log: ({ id }, result) => ({ id, status: result.status }),
		},
	);

export const remove: PlacidEndpoints['imagesDelete'] = (ctx, input) =>
	callDelete(
		ctx,
		{
			event: 'images.delete',
			input: Inputs.imagesDelete,
			output: Outputs.imagesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/images/${segment(id)}` }),
		({ id }) => ({ success: true as const, id }),
		({ id }) => ({ id }),
	);
