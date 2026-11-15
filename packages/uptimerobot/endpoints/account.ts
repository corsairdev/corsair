import type { UptimeRobotEndpoints } from '..';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The account behind the key: plan, monitor allowance and how many monitors are
 * in use. A read, and the cheapest way to check that a key works.
 */
export const me: UptimeRobotEndpoints['accountMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.me',
			input: Inputs.accountMe,
			output: Outputs.accountMe,
		},
		input,
		() => ({ method: 'GET', path: '/user/me' }),
		{
			log: (_, result) => ({
				plan: result.activeSubscription?.plan ?? undefined,
				monitors: result.monitorsCount ?? undefined,
				limit: result.monitorLimit ?? undefined,
			}),
		},
	);
