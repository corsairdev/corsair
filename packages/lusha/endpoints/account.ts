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
			// Free, but Lusha caps it at 5 requests per minute.
			metered: false,
		}),
		{
			log: (_, result) => ({
				creditsRemaining: result.credits?.remaining ?? undefined,
				plan: result.plan?.category ?? undefined,
			}),
		},
	);
