import type { YnabEndpoints } from '..';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

/** The user behind the token, which is the cheapest way to check it. */
export const get: YnabEndpoints['userGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'user.get', input: Inputs.userGet, output: Outputs.userGet },
		input,
		() => ({ method: 'GET', path: '/user' }),
		{
			log: (_, result) => ({ id: result.data.user?.id ?? undefined }),
		},
	);
