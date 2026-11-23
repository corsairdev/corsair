import type { MoreTreesEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MoreTreesEndpointInputSchemas as Inputs,
	MoreTreesEndpointOutputSchemas as Outputs,
} from './types';

/** Reads one forest's branding and plantation statistics. */
export const get: MoreTreesEndpoints['forestGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'forest.get',
			input: Inputs.forestGet,
			output: Outputs.forestGet,
		},
		input,
		({ forestSlugOrAccountCode }) => ({
			service: 'user_management',
			replayable: true,
			method: 'GET',
			path: `/forest/${segment(forestSlugOrAccountCode)}`,
		}),
		{
			log: ({ forestSlugOrAccountCode }) => ({
				forestSlugOrAccountCode,
			}),
		},
	);
