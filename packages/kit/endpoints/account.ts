import type { KitEndpoints } from '..';
import { call } from './call';
import {
	KitEndpointInputSchemas as Inputs,
	KitEndpointOutputSchemas as Outputs,
} from './types';

export const get: KitEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/v4/account' }),
		{ log: (_, result) => ({ accountId: result.account?.id ?? undefined }) },
	);
