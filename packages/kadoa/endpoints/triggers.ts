import type { KadoaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

export const list: KadoaEndpoints['triggersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'triggers.list',
			input: Inputs.triggersList,
			output: Outputs.triggersList,
		},
		input,
		({ workflowId }) => ({
			method: 'GET',
			path: `/v4/workflows/${segment(workflowId)}/triggers`,
		}),
		{
			log: (_, result) => ({
				outgoing: result.triggers.length,
				incoming: result.incoming.length,
			}),
		},
	);
