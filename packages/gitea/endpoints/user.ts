import type { GiteaEndpoints } from '..';
import { call } from './call';
import {
	GiteaEndpointInputSchemas as Inputs,
	GiteaEndpointOutputSchemas as Outputs,
} from './types';

export const me: GiteaEndpoints['userMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.me',
			input: Inputs.userMe,
			output: Outputs.userMe,
		},
		input,
		() => ({
			method: 'GET',
			path: '/user',
			replayable: true,
		}),
	);

export const User = { me };
