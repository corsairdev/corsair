import type { CodereadrEndpoints } from '..';
import { call } from './call';
import { shapeLimits } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const retrieve: CodereadrEndpoints['limitsRetrieve'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'limits.retrieve',
			input: Inputs.limitsRetrieve,
			output: Outputs.limitsRetrieve,
		},
		input,
		() => ({ section: 'limits', action: 'retrieve' }),
		{
			shape: (root) => shapeLimits(root),
			log: (_, result) => ({
				minuteLeft: result.minute?.left ?? undefined,
				dayLeft: result.day?.left ?? undefined,
			}),
			replaySafe: true,
		},
	);
