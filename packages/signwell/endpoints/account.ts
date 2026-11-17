import type { SignwellEndpoints } from '..';
import { call } from './shared';
import {
	SignwellEndpointInputSchemas as Inputs,
	SignwellEndpointOutputSchemas as Outputs,
} from './types';

export const get: SignwellEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/v1/account' }),
		{
			log: (_, result) => ({ planTier: result.plan_tier }),
		},
	);

export const update: SignwellEndpoints['accountUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.update',
			input: Inputs.accountUpdate,
			output: Outputs.accountUpdate,
		},
		input,
		(body) => ({ method: 'PUT', path: '/v1/account', body }),
		{
			// Only the field names are logged; `logo` can carry an image and the
			// time zone is account configuration, not something to duplicate.
			log: (parsed) => ({
				fields: Object.keys(parsed).sort().join(','),
			}),
		},
	);
