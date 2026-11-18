import type { SuitedashEndpoints } from '..';
import { call } from './shared';
import {
	SuitedashEndpointInputSchemas as Inputs,
	SuitedashEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Worlds are a Power-up, and this route answers a bare array at the envelope's
 * `data`, alongside a top-level `pagination` rather than the CRM `meta` block.
 */
export const list: SuitedashEndpoints['worldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'worlds.list',
			input: Inputs.worldsList,
			output: Outputs.worldsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/worlds', query }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
