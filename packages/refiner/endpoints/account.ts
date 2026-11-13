import type { RefinerEndpoints } from '..';
import { call } from './call';
import {
	RefinerEndpointInputSchemas as Inputs,
	RefinerEndpointOutputSchemas as Outputs,
} from './types';

export const get: RefinerEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/account', replayable: true }),
		{
			log: (_, result) => ({
				plan: result.subscription?.plan ?? undefined,
				environments: result.environments?.length ?? 0,
				responses: result.subscription?.msr_count ?? undefined,
			}),
		},
	);
