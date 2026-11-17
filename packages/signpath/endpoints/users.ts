import type { SignpathEndpoints } from '..';
import { call, orgPath } from './shared';
import {
	SignpathEndpointInputSchemas as Inputs,
	SignpathEndpointOutputSchemas as Outputs,
} from './types';

export const me: SignpathEndpoints['usersMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.me',
			input: Inputs.usersMe,
			output: Outputs.usersMe,
		},
		input,
		(_, organizationId) => ({
			method: 'GET',
			path: orgPath(organizationId, '/Users/Me'),
		}),
		{
			log: (_, result) => ({ userType: result.userType, role: result.role }),
		},
	);
