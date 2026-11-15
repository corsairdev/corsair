import type { CloudConvertEndpoints } from '..';
import { call } from './call';
import {
	CloudConvertEndpointInputSchemas as Inputs,
	CloudConvertEndpointOutputSchemas as Outputs,
} from './types';

export const usersShow: CloudConvertEndpoints['usersShow'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.show',
			input: Inputs.usersShow,
			output: Outputs.usersShow,
		},
		input,
		() => ({ method: 'GET', path: '/users/me' }),
		// The user response contains email and account details; record no values.
		{ log: () => ({}) },
	);
