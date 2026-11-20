import type { PerigonEndpoints } from '..';
import { call } from './call';
import {
	PerigonEndpointInputSchemas as Inputs,
	PerigonEndpointOutputSchemas as Outputs,
} from './types';

export const get: PerigonEndpoints['limitsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'limits.get',
			input: Inputs.limitsGet,
			output: Outputs.limitsGet,
		},
		input,
		() => ({ method: 'GET', path: '/v1/limits' }),
		{ log: (_, limits) => ({ used: limits.requestsUsed ?? undefined }) },
	);
