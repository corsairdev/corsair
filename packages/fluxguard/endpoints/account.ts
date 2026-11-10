import type { FluxguardEndpoints } from '..';
import { call } from './call';
import {
	FluxguardEndpointInputSchemas as Inputs,
	FluxguardEndpointOutputSchemas as Outputs,
} from './types';

export const get: FluxguardEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account' }),
	);
