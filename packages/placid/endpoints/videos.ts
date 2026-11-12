import type { PlacidEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	PlacidEndpointInputSchemas as Inputs,
	PlacidEndpointOutputSchemas as Outputs,
} from './types';

export const create: PlacidEndpoints['videosCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.create',
			input: Inputs.videosCreate,
			output: Outputs.videosCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/videos', body: parsed }),
		{
			log: (parsed, result) => ({
				id: result.id,
				status: result.status,
				clips: parsed.clips.length,
			}),
		},
	);

export const get: PlacidEndpoints['videosGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'videos.get',
			input: Inputs.videosGet,
			output: Outputs.videosGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/videos/${segment(id)}` }),
		{
			log: ({ id }, result) => ({ id, status: result.status }),
		},
	);

export const remove: PlacidEndpoints['videosDelete'] = (ctx, input) =>
	callDelete(
		ctx,
		{
			event: 'videos.delete',
			input: Inputs.videosDelete,
			output: Outputs.videosDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/videos/${segment(id)}` }),
		({ id }) => ({ success: true as const, id }),
		({ id }) => ({ id }),
	);
