import type { StorerocketEndpoints } from '..';
import { call } from './call';
import {
	StorerocketEndpointInputSchemas as Inputs,
	StorerocketEndpointOutputSchemas as Outputs,
} from './types';

export const get: StorerocketEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		() => ({
			method: 'GET',
			path: '/user',
		}),
		{
			log: (_, result) => ({ userId: result.data.id ?? undefined }),
		},
	);
