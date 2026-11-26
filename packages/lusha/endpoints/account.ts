import type { LushaEndpoints } from '..';
import { call } from './call';
import {
	LushaEndpointInputSchemas as Inputs,
	LushaEndpointOutputSchemas as Outputs,
} from './types';

export const getAccountUsage: LushaEndpoints['accountGetAccountUsage'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.getAccountUsage',
			input: Inputs.accountGetAccountUsage,
			output: Outputs.accountGetAccountUsage,
		},
		input,
		() => ({
			method: 'GET',
			path: '/v3/account/usage',
			// Free (capped at 5 requests per minute), so safe to repeat.
			replayable: true,
		}),
		{
			log: (_, result) => ({
				creditsRemaining: result.credits?.remaining ?? undefined,
				plan: result.plan?.category ?? undefined,
			}),
		},
	);
