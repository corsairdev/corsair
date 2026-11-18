import type { ReamazeEndpoints } from '..';
import { call, unwrapArray } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

// Verified live: `GET /systems` answers a **bare array**, empty on an instance
// with no systems. The plugin wraps it under `systems`.

export const list: ReamazeEndpoints['systemsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'systems.list',
			input: Inputs.systemsList,
			output: Outputs.systemsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/systems',
		}),
		{
			shape: (raw) => ({ systems: unwrapArray(raw, 'system list') }),
			log: (_, result) => ({ count: result.systems.length }),
		},
	);
