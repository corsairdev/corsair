import type { SignwellEndpoints } from '..';
import { call } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const get: SignwellEndpoints['meGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'me.get',
			input: Inputs.meGet,
			output: Outputs.meGet,
		},
		input,
		() => ({ method: 'GET', path: '/v1/me' }),
		{
			// Only the role, which is what tells a caller whether the token can
			// manage the account. The email addresses stay out of the log.
			log: (_, result) => ({ role: result.role }),
		},
	);
