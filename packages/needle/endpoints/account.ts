import type { NeedleEndpoints } from '..';
import { call } from './call';
import {
	NeedleEndpointInputSchemas as Inputs,
	NeedleEndpointOutputSchemas as Outputs,
} from './types';

/** The key's owning user and organization. Needs only a valid key. */
export const me: NeedleEndpoints['accountMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.me',
			input: Inputs.accountMe,
			output: Outputs.accountMe,
		},
		input,
		() => ({ method: 'GET', path: '/me' }),
		{ log: (_, result) => ({ userId: result.user.id ?? undefined }) },
	);
