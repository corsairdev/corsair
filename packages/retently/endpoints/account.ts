import type { RetentlyEndpoints } from '..';
import { call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

export const ping: RetentlyEndpoints['accountPing'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.ping',
			input: Inputs.accountPing,
			output: Outputs.accountPing,
		},
		input,
		() => ({ method: 'GET', path: '/ping', replayable: true }),
		{
			log: (_, result) => ({
				account: result.data?.account?.name ?? undefined,
				contacts: result.data?.usage?.contacts ?? undefined,
				remaining: result.data?.plan?.credits?.surveys?.remaining ?? undefined,
			}),
		},
	);
