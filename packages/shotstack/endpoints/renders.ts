import type { ShotstackEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { RendersCreateInput, RendersGetInput } from './types';
import {
	ShotstackEndpointInputSchemas,
	ShotstackEndpointOutputSchemas,
} from './types';

export const create: ShotstackEndpoints['rendersCreate'] = async (
	ctx,
	rawInput,
) => {
	return call(
		ctx,
		{
			event: 'renders.create',
			input: ShotstackEndpointInputSchemas.rendersCreate,
			output: ShotstackEndpointOutputSchemas.rendersCreate,
		},
		rawInput,
		(input: RendersCreateInput) => ({
			method: 'POST',
			service: 'edit',
			path: '/render',
			body: {
				timeline: input.timeline,
				output: input.output,
				merge: input.merge,
				callback: input.callback,
				instance: input.instance,
			},
		}),
		{
			log: (_input, result) => ({
				renderId: result.response.id,
			}),
		},
	);
};

export const get: ShotstackEndpoints['rendersGet'] = async (ctx, rawInput) => {
	return call(
		ctx,
		{
			event: 'renders.get',
			input: ShotstackEndpointInputSchemas.rendersGet,
			output: ShotstackEndpointOutputSchemas.rendersGet,
		},
		rawInput,
		(input: RendersGetInput) => ({
			method: 'GET',
			service: 'edit',
			path: `/render/${segment(input.id)}`,
			// data=false is always sent: Shotstack's default is true today and
			// flips the whole timeline echo into the response.
			query: { data: input.data ?? false, merged: input.merged },
		}),
		{
			log: (_input, result) => ({
				renderId: result.response.id,
				status: result.response.status,
			}),
		},
	);
};
