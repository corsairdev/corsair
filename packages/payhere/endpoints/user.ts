import type { PayhereEndpoints } from '..';
import { call } from './call';
import {
	PayhereEndpointInputSchemas as Inputs,
	PayhereEndpointOutputSchemas as Outputs,
} from './types';

export const get: PayhereEndpoints['userGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.get',
			input: Inputs.userGet,
			output: Outputs.userGet,
		},
		input,
		() => ({ method: 'GET', path: '/api/v1/user' }),
		{ log: (_, result) => ({ userId: result.data.id }) },
	);
